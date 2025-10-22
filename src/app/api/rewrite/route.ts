import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { CVSection, GenerationRequest, DiffMetadata } from '@/types/database'
import { getLanguageInstruction, LANGUAGE_NAMES } from '@/lib/language-detection'
import { trackCVGeneration } from '@/lib/analytics'
import { calculateATSScore } from '@/lib/ats-calculator'
import { runATSOptimization } from '@/lib/ats-optimizer'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Use the old auth helpers package (proven to work)
    const supabase = createSupabaseRouteClient()
    
    console.log('=== AUTH DEBUG ===')
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      error: authError?.message,
      errorCode: authError?.status
    })
    
    if (authError || !user) {
      console.error('=== AUTH FAILED ===')
      console.error('Error:', authError)
      
      // Try to get more details about the session
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('Session exists:', !!sessionData.session)
      
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'Your session has expired. Please log in again.' 
      }, { status: 401 })
    }
    
    console.log('✅ Authenticated user:', user.id, user.email)

    // Check usage limits (lifetime generations)
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('lifetime_generation_count, plan_type, max_lifetime_generations')
      .eq('user_id', user.id)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
    }

    const isPro = usage?.plan_type === 'pro'
    const currentUsage = usage?.lifetime_generation_count || 0
    const maxGenerations = usage?.max_lifetime_generations || 1
  
    if (currentUsage >= maxGenerations) {
      return NextResponse.json({
        error: isPro ? 'Generation limit reached' : 'Free generation used. Upgrade to Pro for 100 more!',
        limit_reached: true,
        is_pro: isPro,
        current_usage: currentUsage,
        max_usage: maxGenerations
      }, { status: 429 })
    }

    const body: GenerationRequest = await request.json()
    const { cv_id, job_title, job_description, rewrite_style, tone, custom_sections, output_language } = body

    // Validate request
    if (!cv_id || !job_title || !job_description) {
      return NextResponse.json({ 
        error: 'Missing required fields: cv_id, job_title, job_description' 
      }, { status: 400 })
    }

    // Get CV data with detected language
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('original_text, parsed_sections, detected_language')
      .eq('id', cv_id)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    const originalSections = cvData.parsed_sections as { sections: CVSection[] }
    const detectedLanguage = cvData.detected_language || 'en'
    
    console.log('CV language:', detectedLanguage, `(${LANGUAGE_NAMES[detectedLanguage] || 'English'})`)

    // Create OpenAI prompt with language awareness
    const prompt = createRewritePrompt(
      originalSections.sections,
      job_title,
      job_description,
      rewrite_style,
      tone,
      custom_sections,
      detectedLanguage
    )

    // Call OpenAI API with language-aware system prompt
    const languageName = LANGUAGE_NAMES[detectedLanguage] || 'English'
    const systemPrompt = detectedLanguage === 'en' 
      ? 'You are an expert CV writer and career coach. Your task is to rewrite CV sections to better match specific job requirements while maintaining authenticity and truthfulness.'
      : `You are an expert CV writer and career coach. Your task is to rewrite CV sections to better match specific job requirements while maintaining authenticity and truthfulness. CRITICAL: Generate ALL output in ${languageName}. Do not translate to English.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" }, // ✅ Guaranteed valid JSON
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000 // Increased to handle comprehensive CVs with multiple work experiences
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate CV rewrite' }, { status: 500 })
    }

    // Parse AI response
    let { rewrittenSections, diffMeta } = parseAIResponse(aiResponse, originalSections.sections)

    // Calculate initial ATS score
    let atsScore = calculateATSScore(rewrittenSections, job_description)
    console.log('✅ Initial ATS Score calculated:', atsScore)

    // 🚀 AUTO-OPTIMIZE FOR ATS if score is below 70%
    if (atsScore < 70) {
      console.log(`⚠️ Low ATS score detected (${atsScore}%), running automatic optimization...`)
      try {
        const optimizationResult = await runATSOptimization(rewrittenSections, job_description, atsScore)
        rewrittenSections = optimizationResult.optimizedSections
        atsScore = calculateATSScore(rewrittenSections, job_description)
        console.log(`✅ ATS Optimization complete! Score improved: ${optimizationResult.beforeScore}% → ${atsScore}%`)
      } catch (optimizationError) {
        console.error('ATS optimization failed, using original content:', optimizationError)
        // Continue with original content if optimization fails
      }
    } else {
      console.log(`✅ Good ATS score (${atsScore}%), no optimization needed`)
    }

    // Save generation to database
    const { data: generationData, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        cv_id,
        job_title,
        job_description,
        rewrite_style,
        tone,
        output_sections: { sections: rewrittenSections },
        diff_meta: diffMeta,
        ats_score: atsScore,
        output_language: detectedLanguage
      })
      .select()
      .single()

    if (genError) {
      console.error('Generation save error:', genError)
      return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 })
    }

    // Track analytics event
    try {
      await trackCVGeneration({
        jobTitle: job_title,
        outputLanguage: detectedLanguage,
        rewriteStyle: rewrite_style,
        tone
      })
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError)
      // Don't fail the generation if analytics fails
    }

    // Update usage tracking - increment lifetime count
    const newCount = currentUsage + 1
    console.log('Updating usage tracking:', {
      userId: user.id,
      oldCount: currentUsage,
      newCount
    })

    const { data: updatedUsage, error: usageUpdateError } = await supabase
      .from('usage_tracking')
      .update({
        lifetime_generation_count: newCount,
        generation_count: newCount, // Keep for backwards compatibility
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()

    if (usageUpdateError) {
      console.error('Failed to update usage tracking:', usageUpdateError)
    } else {
      console.log('Usage tracking updated successfully:', updatedUsage)
    }

    // Update CV last accessed
    await supabase
      .from('cvs')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', cv_id)

    return NextResponse.json({
      success: true,
      generation_id: generationData.id,
      output_sections: rewrittenSections,
      diff_meta: diffMeta,
      usage: {
        current_count: newCount,
        max_count: maxGenerations,
        is_pro: isPro
      }
    })

  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function createRewritePrompt(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string,
  rewriteStyle: string,
  tone: string,
  customSections?: string[],
  languageCode: string = 'en'
): string {
  // Extract top keywords from job description (more efficient)
  const keywords = extractTopKeywords(jobDescription, 10)
  
  // Format sections - DO NOT truncate to preserve ALL work experiences
  const sectionsText = sections
    .map(s => {
      const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content)
      return `${s.type}:\n${content}`
    })
    .join('\n\n')
  
  const languageName = LANGUAGE_NAMES[languageCode] || 'English'
  const styleMap = {
    conservative: 'minimal changes',
    balanced: 'moderate improvements',
    bold: 'significant optimization'
  }

  return `Rewrite CV for: ${jobTitle}

KEY REQUIREMENTS: ${keywords.join(', ')}

CURRENT CV:
${sectionsText}

CRITICAL RULES:
1. PRESERVE ALL: Names, contacts, dates, companies, job titles, ALL work experiences
2. INCLUDE EVERY WORK EXPERIENCE: Do NOT skip or merge any jobs - include ALL of them
3. ENHANCE: ${styleMap[rewriteStyle as keyof typeof styleMap]} to experience descriptions
4. TONE: ${tone}
5. LANGUAGE: ${languageName}${languageCode !== 'en' ? ' (output MUST be in ' + languageName + ')' : ''}

FOCUS AREAS:
- Summary: 3-4 sentences, highlight ${keywords.slice(0, 3).join(', ')}
- Experience: Include EVERY job listed, 4-5 bullets per role, add metrics, use action verbs
- Skills: Include ALL skills from original CV, prioritize job-relevant ones
- Education: MUST include ALL qualifications exactly as shown - DO NOT leave empty
- Certifications: MUST include ALL certifications and licenses exactly as shown - DO NOT leave empty
- Hobbies: MUST include ALL hobbies/interests exactly as shown - DO NOT leave empty
- Groups: MUST include if present in original CV
- Strengths: MUST include if present in original CV
- Additional Info: MUST include if present in original CV

CRITICAL: Do NOT leave any sections empty if they have content in the original CV!

${customSections && customSections.length > 0 ? `ADD SECTIONS: ${customSections.join(', ')}` : ''}

Return JSON:
{
  "sections": [{"type": "string", "content": "string", "order": number, "changes": ["string"]}],
  "summary_of_changes": "string"
}
`
}

// Helper: Extract top N keywords from job description
function extractTopKeywords(text: string, limit: number = 10): string[] {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'])
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !commonWords.has(w))
  
  // Count frequency
  const freq = new Map<string, number>()
  words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1))
  
  // Sort by frequency and return top N
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word)
}

// Helper: Truncate content for compact prompt
function truncateContent(content: any, maxLength: number): string {
  const str = typeof content === 'string' ? content : JSON.stringify(content)
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

function parseAIResponse(aiResponse: string, originalSections: CVSection[]): {
  rewrittenSections: CVSection[],
  diffMeta: DiffMetadata
} {
  try {
    // With JSON mode, response is guaranteed to be valid JSON
    const parsed = JSON.parse(aiResponse)
    
    // Validate structure
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response structure: missing sections array')
    }

    const rewrittenSections: CVSection[] = parsed.sections
    
    // Create diff metadata
    const changes = []
    for (const rewritten of rewrittenSections) {
      const original = originalSections.find(s => s.type === rewritten.type)
      if (original && original.content !== rewritten.content) {
        changes.push({
          section: rewritten.type,
          type: 'modified' as const,
          original: original.content,
          new: rewritten.content,
          explanation: 'Content updated for job alignment'
        })
      }
    }

    const diffMeta: DiffMetadata = {
      changes,
      summary: parsed.summary_of_changes || 'CV updated to better match job requirements'
    }

    return { rewrittenSections, diffMeta }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    console.error('Response was:', aiResponse)
    // Fallback: return original sections with minimal changes
    return {
      rewrittenSections: originalSections,
      diffMeta: {
        changes: [],
        summary: 'Failed to parse AI response. Original content preserved.'
      }
    }
  }
}
