import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { CVSection, GenerationRequest, DiffMetadata } from '@/types/database'
import { getLanguageInstruction, LANGUAGE_NAMES } from '@/lib/language-detection'
import { trackCVGeneration } from '@/lib/analytics'
import { calculateATSScore } from '@/lib/ats-calculator-improved'
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

    // 🚨 CRITICAL VALIDATION: Check if AI invented fake jobs or changed companies
    const originalExperience = originalSections.sections.find(s => s.type === 'experience')
    const rewrittenExperience = rewrittenSections.find(s => s.type === 'experience')
    
    if (originalExperience && rewrittenExperience) {
      const originalContent = typeof originalExperience.content === 'string' 
        ? originalExperience.content 
        : JSON.stringify(originalExperience.content)
      const rewrittenContent = typeof rewrittenExperience.content === 'string'
        ? rewrittenExperience.content
        : JSON.stringify(rewrittenExperience.content)
      
      // Extract company names from original using regex
      // Matches patterns like "Company Name | Location" or "Position | Company"
      const companyPattern = /\|\s*([^|]+?)\s*\|/g
      const originalCompanies = new Set<string>()
      let match
      while ((match = companyPattern.exec(originalContent)) !== null) {
        const company = match[1].trim()
        if (company && company.length > 2 && !company.match(/^\d{2}\/\d{4}/)) {
          originalCompanies.add(company)
        }
      }
      
      console.log(`📋 Original companies detected: ${Array.from(originalCompanies).join(', ')}`)
      
      // Check if AI invented fake companies (common ones that appear in fake CVs)
      const suspiciousFakeCompanies = [
        'Springer Nature',
        'Research Integrity Content Coordinator',
        'Content Coordinator',
        'Research Coordinator'
      ]
      
      const detectedFakeCompanies = suspiciousFakeCompanies.filter(fake =>
        rewrittenContent.toLowerCase().includes(fake.toLowerCase()) &&
        !originalContent.toLowerCase().includes(fake.toLowerCase())
      )
      
      if (detectedFakeCompanies.length > 0) {
        console.error(`🚨 CRITICAL: AI invented fake companies: ${detectedFakeCompanies.join(', ')}`)
        return NextResponse.json({ 
          error: `AI generated invalid content - invented fake companies (${detectedFakeCompanies.join(', ')}). The system detected that job titles or companies were changed from the original CV. Please try again.` 
        }, { status: 500 })
      }
      
      // Check if original companies are preserved (at least 70% should be present)
      if (originalCompanies.size > 0) {
        const preservedCount = Array.from(originalCompanies).filter(company =>
          rewrittenContent.includes(company)
        ).length
        const preservationRate = preservedCount / originalCompanies.size
        
        if (preservationRate < 0.7) {
          console.error(`🚨 CRITICAL: Only ${Math.round(preservationRate * 100)}% of companies preserved`)
          return NextResponse.json({ 
            error: 'AI removed too many original companies. Please try again.' 
          }, { status: 500 })
        }
        
        console.log(`✅ Validation passed: ${Math.round(preservationRate * 100)}% of companies preserved`)
      }
    }

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

🚨🚨🚨 ABSOLUTELY CRITICAL - DO NOT SKIP THESE RULES 🚨🚨🚨

YOU ARE ADAPTING A CV, NOT CREATING A NEW ONE!

RULE #1: NEVER CHANGE JOB TITLES OR COMPANIES
- If original says "Play Therapist", output MUST say "Play Therapist"
- If original says "Child in Mind", output MUST say "Child in Mind"
- If original says "10/2016 – 08/2022", output MUST say "10/2016 – 08/2022"
- DO NOT create fake jobs like "Research Coordinator at Springer Nature"

RULE #2: KEEP ALL SECTIONS FROM ORIGINAL
- If original has: name, contact, summary, experience, education, skills, certifications, hobbies, groups, strengths, additional
- Output MUST have: name, contact, summary, experience, education, skills, certifications, hobbies, groups, strengths, additional
- DO NOT remove sections!

RULE #3: ONLY CHANGE THE DESCRIPTIONS
- Keep job title: "Play Therapist" → "Play Therapist" ✅
- Keep company: "Child in Mind" → "Child in Mind" ✅
- Keep dates: "10/2016 – 08/2022" → "10/2016 – 08/2022" ✅
- Change bullets: "Managed caseload" → "Led comprehensive therapy programs for 50+ families" ✅

RULE #4: EDUCATION STAYS IDENTICAL
- Copy EXACTLY: "Filial Therapy in Family Therapy | Manchester | 08/2019"
- DO NOT replace with: "Bachelor of Arts in [Relevant Field]" ❌

RULE #5: INCLUDE ALL JOBS
- Original has 6 jobs → Output MUST have 6 jobs
- Each with ACTUAL title, company, dates

TONE: ${tone}
LANGUAGE: ${languageName}${languageCode !== 'en' ? ' (output MUST be in ' + languageName + ')' : ''}

WRONG EXAMPLE (DO NOT DO THIS):
❌ "Research Integrity Content Coordinator | Springer Nature | [Month, Year] - Present"

CORRECT EXAMPLE (DO THIS):
✅ "Play Therapist | Child in Mind | 10/2016 – 08/2022 | Manchester, England"
   - Led comprehensive family therapy programs for 50+ families, improving child-parent relationships
   - Delivered specialized 1:1 therapy sessions, achieving 85% improvement in behavioral outcomes

FOCUS AREAS:
- Summary: 3-4 sentences, highlight ${keywords.slice(0, 3).join(', ')}
- Experience: COUNT the jobs in the original CV and include THE SAME NUMBER in your output. For EACH job, include ALL original bullet points PLUS add 1-2 more with metrics and action verbs. NEVER reduce the number of bullet points.
- Skills: Include ALL skills from original CV, prioritize job-relevant ones
- Education: COPY EXACTLY from original - same degrees, universities, dates, coursework. DO NOT modify, replace, or leave empty.
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

// Normalize section types to prevent duplicates
function normalizeSectionType(type: string): string {
  const typeMap: Record<string, string> = {
    'work_experience': 'experience',
    'work experience': 'experience',
    'professional experience': 'experience',
    'employment': 'experience',
    'professional summary': 'summary',
    'profile': 'summary',
    'hobbies': 'interests',
    'interests': 'interests',
    'certifications': 'certifications',
    'certificates': 'certifications',
    'licenses': 'certifications'
  }
  
  const normalized = typeMap[type.toLowerCase()] || type.toLowerCase()
  return normalized.replace(/\s+/g, '_')
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

    // Normalize section types and remove duplicates
    const seenTypes = new Set<string>()
    const rewrittenSections: CVSection[] = parsed.sections
      .map((section: any) => ({
        ...section,
        type: normalizeSectionType(section.type)
      }))
      .filter((section: CVSection) => {
        if (seenTypes.has(section.type)) {
          console.log(`⚠️ Duplicate section type detected and removed: ${section.type}`)
          return false
        }
        seenTypes.add(section.type)
        return true
      })
    
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
