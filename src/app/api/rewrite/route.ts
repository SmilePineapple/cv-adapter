import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { CVSection, GenerationRequest, DiffMetadata } from '@/types/database'
import { getLanguageInstruction, LANGUAGE_NAMES } from '@/lib/language-detection'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// ATS Score Calculation Function
function calculateATSScore(sections: CVSection[], jobDescription: string): number {
  let score = 0
  
  // Extract keywords from job description (simple approach)
  const jobKeywords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'have', 'will', 'your', 'their'].includes(word))
  
  const uniqueKeywords = [...new Set(jobKeywords)]
  
  // Combine all section content
  const cvContent = sections
    .map(s => s.content || '')
    .join(' ')
    .toLowerCase()
  
  // 1. Keyword Matching (40 points)
  const matchedKeywords = uniqueKeywords.filter(keyword => 
    cvContent.includes(keyword)
  ).length
  
  const keywordScore = uniqueKeywords.length > 0 
    ? (matchedKeywords / uniqueKeywords.length) * 40 
    : 20
  score += keywordScore
  
  // 2. Section Completeness (20 points)
  const hasExperience = sections.some(s => s.type === 'experience' && s.content)
  const hasSkills = sections.some(s => s.type === 'skills' && s.content)
  const hasSummary = sections.some(s => s.type === 'summary' && s.content)
  
  if (hasExperience) score += 8
  if (hasSkills) score += 6
  if (hasSummary) score += 6
  
  // 3. Content Length (15 points)
  const totalLength = cvContent.length
  if (totalLength > 1000 && totalLength < 5000) {
    score += 15
  } else if (totalLength > 500) {
    score += 10
  } else {
    score += 5
  }
  
  // 4. Action Verbs (15 points)
  const actionVerbs = [
    'achieved', 'managed', 'led', 'developed', 'created', 'improved',
    'increased', 'decreased', 'delivered', 'implemented', 'designed',
    'coordinated', 'executed', 'optimized', 'streamlined', 'launched'
  ]
  
  const actionVerbCount = actionVerbs.filter(verb => 
    cvContent.includes(verb)
  ).length
  
  score += Math.min(actionVerbCount * 2, 15)
  
  // 5. Formatting Quality (10 points)
  const hasBulletPoints = sections.some(s => 
    (s.content || '').includes('•') || (s.content || '').includes('-')
  )
  if (hasBulletPoints) score += 10
  
  return Math.min(Math.round(score), 100)
}

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
    const { cv_id, job_title, job_description, rewrite_style, tone, custom_sections } = body

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
      max_tokens: 2000
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate CV rewrite' }, { status: 500 })
    }

    // Parse AI response
    const { rewrittenSections, diffMeta } = parseAIResponse(aiResponse, originalSections.sections)

    // Calculate ATS score
    const atsScore = calculateATSScore(rewrittenSections, job_description)
    console.log('✅ ATS Score calculated:', atsScore)

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
  const sectionsText = sections.map(s => `${s.type.toUpperCase()}:\n${s.content}`).join('\n\n')
  
  const styleInstructions = {
    conservative: 'Make minimal changes, only adjusting keywords and phrases to better match the job requirements.',
    balanced: 'Make moderate changes to improve alignment with the job while maintaining the original structure and key information.',
    bold: 'Make significant changes to strongly align with the job requirements, adding relevant keywords and restructuring content as needed.'
  }

  const toneInstructions = {
    professional: 'Use formal, business-appropriate language.',
    friendly: 'Use warm, approachable language while maintaining professionalism.',
    creative: 'Use dynamic, engaging language that showcases creativity and innovation.',
    technical: 'Use precise, technical language appropriate for technical roles.'
  }

  // Get language instruction
  const languageInstruction = getLanguageInstruction(languageCode)
  const languageName = LANGUAGE_NAMES[languageCode] || 'English'

  return `
Job Title: ${jobTitle}

Job Description:
${jobDescription}

Current CV Sections:
${sectionsText}

LANGUAGE REQUIREMENT:
${languageInstruction}
${languageCode !== 'en' ? `The CV is in ${languageName}. ALL rewritten content MUST be in ${languageName}. Do NOT translate to English or any other language.` : ''}

CRITICAL INSTRUCTIONS:
- PRESERVE ALL PERSONAL DETAILS: Keep name, contact info, interests, certifications, training, education exactly as provided
- PRESERVE JOB TITLES AND COMPANY NAMES: **NEVER change the actual job titles or company names from the original CV**
- MAINTAIN TRUTHFULNESS: Do not invent fake companies, roles, or achievements that don't exist in the original CV

SECTIONS TO MODIFY:
1. **Professional Summary/Profile**: Rewrite to emphasize skills and experience most relevant to the ${jobTitle} role
2. **Skills**: Reorder and highlight skills that match the job requirements, add relevant keywords from job description if they reflect actual abilities
3. **Work Experience**: Rewrite job descriptions/responsibilities to better match the target job, but keep job titles and company names identical
4. **Custom Sections**: Generate content for any requested custom sections based on existing CV information

SECTIONS TO PRESERVE UNCHANGED:
- Interests, personal details, certifications, training, education, contact information

STYLE & TONE:
- Rewrite Style: ${rewriteStyle} - ${styleInstructions[rewriteStyle as keyof typeof styleInstructions]}
- Tone: ${tone} - ${toneInstructions[tone as keyof typeof toneInstructions]}
- Focus on ATS optimization by including relevant keywords from the job description
- Quantify existing achievements where possible, but don't add fake numbers
- The candidate's actual job titles and companies are facts that cannot be changed - only adapt how their responsibilities are described
${customSections && customSections.length > 0 ? `
- CUSTOM SECTIONS TO ADD: Create the following new sections based on the candidate's background and the job requirements:
  ${customSections.map(section => `  * ${section}: Generate relevant content based on the existing CV content and job requirements`).join('\n  ')}
- For custom sections, infer content from the existing CV that would be relevant to that section type
- Keep custom section content truthful and based on information already present in the CV` : ''}

Please rewrite the CV sections and provide your response in this exact JSON format:
{
  "sections": [
    {
      "type": "section_type",
      "content": "rewritten content",
      "order": 0,
      "changes": ["list of key changes made"]
    }
  ],
  "summary_of_changes": "Brief summary of overall changes made"
}
`
}

function parseAIResponse(aiResponse: string, originalSections: CVSection[]): {
  rewrittenSections: CVSection[],
  diffMeta: DiffMetadata
} {
  try {
    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const rewrittenSections: CVSection[] = parsed.sections || []
    
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
