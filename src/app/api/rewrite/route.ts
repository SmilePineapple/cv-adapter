import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { getOpenAIClient } from '@/lib/openai-client'
import { CVSection, GenerationRequest, DiffMetadata } from '@/types/database'
import { getLanguageInstruction, LANGUAGE_NAMES } from '@/lib/language-detection'
import { trackCVGeneration, trackFunnelStage } from '@/lib/analytics'
import { calculateATSScore } from '@/lib/ats-calculator-improved'
import { runATSOptimization } from '@/lib/ats-optimizer'
import { formatErrorResponse } from '@/lib/errors'
import { rateLimiters } from '@/lib/rate-limit-simple'
import { sendFirstGenerationEmail, sendLimitReachedEmail } from '@/lib/email'
import { formatBlueprintForPrompt, getCVPageBlueprint } from '@/lib/cv-page-blueprints'
import { createLayoutRepairPrompt, validateCVLayout } from '@/lib/cv-layout-validator'

// Increase timeout for AI generation with ATS optimization
// AI generation: ~23s + ATS optimization: ~36s = ~59s total
// Set to 300s to allow completion with buffer for slow API responses
export const maxDuration = 300



export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    // Use the old auth helpers package (proven to work)
    const supabase = await createSupabaseRouteClient()
    
    // Get user - try cookie auth first, fall back to Bearer token
    let user = null
    let activeClient = supabase
    const { data: { user: cookieUser } } = await supabase.auth.getUser()
    if (cookieUser) {
      user = cookieUser
    } else {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        const { createClient } = await import('@supabase/supabase-js')
        const tokenClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        )
        const { data: { user: tokenUser } } = await tokenClient.auth.getUser()
        if (tokenUser) { user = tokenUser; activeClient = tokenClient }
      }
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'Your session has expired. Please log in again.' 
      }, { status: 401 })
    }
    
    console.log('✅ Authenticated user:', user.id, user.email)

    // Rate limiting: 10 requests per minute per user
    const rateLimitResult = await rateLimiters.normal(user.id)
    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset)
      return NextResponse.json({ 
        error: 'Too many requests. Please wait a moment and try again.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': resetDate.toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
        }
      })
    }

    // Check usage limits with new subscription model
    const { data: usage, error: usageError } = await activeClient
      .from('usage_tracking')
      .select('lifetime_generation_count, subscription_tier, max_lifetime_generations')
      .eq('user_id', user.id)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
    }

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
    const currentUsage = usage?.lifetime_generation_count || 0
    const maxGenerations = isPro ? 999999 : (usage?.max_lifetime_generations || 1) // Pro = unlimited
  
    // Check if user has reached limit BEFORE this generation
    // If max=2, allow when currentUsage is 0 or 1 (total 2 generations)
    // Block when currentUsage >= 2 (trying to make 3rd generation)
    if (!isPro && currentUsage >= maxGenerations) {
      return NextResponse.json({
        error: 'Free generation limit reached. Upgrade to Pro for unlimited generations!',
        limit_reached: true,
        is_pro: false,
        subscription_tier: subscriptionTier,
        current_usage: currentUsage,
        max_usage: maxGenerations
      }, { status: 429 })
    }

    const body: GenerationRequest = await request.json()
    const { cv_id, job_title, job_description, rewrite_style, tone, custom_sections, output_language, max_pages } = body

    console.log('📏 DEBUG: max_pages received:', max_pages)
    console.log('🌍 Output language requested:', output_language)

    // 🔍 DEBUG: Log custom sections received
    console.log('📥 Custom sections received from client:', custom_sections)
    console.log('📥 Custom sections count:', custom_sections?.length || 0)

    // Validate request
    if (!cv_id || !job_title || !job_description) {
      return NextResponse.json({ 
        error: 'Missing required fields: cv_id, job_title, job_description' 
      }, { status: 400 })
    }

    // Get CV data with detected language
    const { data: cvData, error: cvError } = await activeClient
      .from('cvs')
      .select('original_text, parsed_sections, detected_language')
      .eq('id', cv_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    const originalSections = cvData.parsed_sections as { sections: CVSection[] }
    const detectedLanguage = cvData.detected_language || 'en'
    
    // Use output_language if provided, otherwise fall back to detected language
    const targetLanguage = output_language || detectedLanguage
    
    console.log('CV detected language:', detectedLanguage, `(${LANGUAGE_NAMES[detectedLanguage] || 'English'})`)
    console.log('Target output language:', targetLanguage, `(${LANGUAGE_NAMES[targetLanguage] || 'English'})`)

    // Create OpenAI prompt with language awareness
    const prompt = createRewritePrompt(
      originalSections.sections,
      job_title,
      job_description,
      rewrite_style,
      tone,
      custom_sections,
      targetLanguage,
      max_pages
    )

    console.log(`📏 DEBUG: Prompt length: ${prompt.length} characters`)
    console.log(`📏 DEBUG: Prompt contains "PAGE LENGTH": ${prompt.includes('PAGE LENGTH')}`)
    // Extract and log the page length instructions
    const pageLengthMatch = prompt.match(/PAGE LENGTH CONSTRAINT:[\s\S]*?(?=\n\n|$)/)
    if (pageLengthMatch) {
      console.log(`📏 DEBUG: Page length instructions:`, pageLengthMatch[0])
    }

    // Call OpenAI API with language-aware system prompt
    const languageName = LANGUAGE_NAMES[targetLanguage] || 'English'
    const systemPrompt = targetLanguage === 'en'
      ? 'You are an expert CV writer and career coach. Your task is to rewrite CV sections to better match specific job requirements while maintaining authenticity and truthfulness.'
      : `You are an expert CV writer and career coach. Your task is to rewrite CV sections to better match specific job requirements while maintaining authenticity and truthfulness. CRITICAL: Generate ALL output in ${languageName}. Do not translate to English.`

    // Adjust max_tokens based on requested page count
    const tokensPerPage = 3000 // Increased to 3000 for 4-page CVs to generate 10,000-12,000 characters
    const requestedMaxPages = max_pages || 1
    const pageBlueprint = getCVPageBlueprint(requestedMaxPages)
    const pageBlueprintPrompt = formatBlueprintForPrompt(pageBlueprint)
    const adjustedMaxTokens = Math.min(requestedMaxPages * tokensPerPage, 12000) // Increased limit to 12000

    console.log(`📏 DEBUG: max_tokens setting: ${adjustedMaxTokens} (requested ${requestedMaxPages} pages × ${tokensPerPage} tokens/page)`)
    console.log('📐 DEBUG: page blueprint:', pageBlueprintPrompt)

    let aiResponse: string

    // Two-step approach for multi-page CVs (maxPages > 1)
    if (requestedMaxPages > 1) {
      console.log(`🔥 Using two-step AI approach for ${requestedMaxPages}-page CV`)

      // Step 1: Analyze structure and generate outline
      const outlinePrompt = `${prompt}

📋 ADDITIONAL TASK FOR STEP 1:
Before generating the full CV, first analyze the current CV and provide a detailed outline for expanding it to ${requestedMaxPages} pages.

📐 PAGE LAYOUT BLUEPRINT:
${pageBlueprintPrompt}

For EACH section in the outline, specify:
1. How many bullet points/items to generate
2. Target character count for each bullet point
3. Specific topics to expand on

Output format for Step 1:
{
  "outline": {
    "summary": { "target_chars": 200, "sentences": 6-8 },
    "experience": [
      {
        "job_title": "...",
        "company": "...",
        "bullet_points_count": 8-10,
        "each_bullet_chars": 100-150,
        "topics_to_expand": ["...", "...", "..."]
      }
    ],
    "skills": { "count": 12, "each_detail_chars": 50-80 },
    "education": { "expand_with": ["coursework", "achievements", "relevant_projects"] },
    "certifications": { "expand_with": ["what_learned", "achievements", "duration"] }
  }
}

Then proceed to generate the full CV following this outline.`

      const outlineCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'system',
            content: systemPrompt + ' You are in STEP 1 of a two-step process. First analyze and outline, then generate content.'
          },
          {
            role: 'user',
            content: outlinePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const outlineResponse = outlineCompletion.choices[0]?.message?.content
      console.log('📋 Step 1: Outline generated:', outlineResponse?.substring(0, 300))

      // Step 2: Generate full content based on outline
      const fullPrompt = `${prompt}

📋 STEP 2: Generate Full Content
You have analyzed the CV structure. Now generate the full CV content following these requirements:
- Target: ${requestedMaxPages} pages
- Follow this exact page layout blueprint:
${pageBlueprintPrompt}
- Target total content: ${pageBlueprint.targetTotalChars} characters
- Acceptable total content range: ${pageBlueprint.minTotalChars}-${pageBlueprint.maxTotalChars} characters
- Each job: 8-10 bullet points, 25-40 words each
- Summary: 6-8 sentences (150-200 words)
- Skills: 8-12 detailed skills with context
- Education: Expand with coursework, achievements, relevant details
- Certifications: Add details about what was learned and achieved
- Return all sections needed by the blueprint

CRITICAL: Generate SUBSTANTIAL content. Do NOT be brief. Add context, examples, and specific outcomes for EVERY point.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'system',
            content: systemPrompt + ' You are in STEP 2. Generate the full expanded CV content based on the analysis.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: adjustedMaxTokens
      })

      aiResponse = completion.choices[0]?.message?.content || ''
      if (!aiResponse) {
        return NextResponse.json({ error: 'Failed to generate CV rewrite' }, { status: 500 })
      }
    } else {
      // Single-step approach for 1-page CVs
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
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
        max_tokens: adjustedMaxTokens
      })

      aiResponse = completion.choices[0]?.message?.content || ''
      if (!aiResponse) {
        return NextResponse.json({ error: 'Failed to generate CV rewrite' }, { status: 500 })
      }
    }

    // 🔍 DEBUG: Log AI response to see what it's actually returning
    console.log('🤖 AI Response (first 500 chars):', aiResponse.substring(0, 500))
    console.log('🤖 AI Response length:', aiResponse.length)

    // Parse AI response
    let { rewrittenSections } = parseAIResponse(aiResponse, originalSections.sections)
    const { diffMeta } = parseAIResponse(aiResponse, originalSections.sections)

    const initialLayoutValidation = validateCVLayout(rewrittenSections, pageBlueprint)
    console.log('📐 Layout validation after initial generation:', {
      isValid: initialLayoutValidation.isValid,
      totalChars: initialLayoutValidation.totalChars,
      targetTotalChars: initialLayoutValidation.targetTotalChars,
      issues: initialLayoutValidation.issues.map(issue => issue.message)
    })

    if (!initialLayoutValidation.isValid || initialLayoutValidation.issues.some(issue => issue.code === 'section_under_minimum' || issue.code === 'section_over_maximum')) {
      console.log('📐 Running targeted layout repair pass...')
      try {
        const repairPrompt = createLayoutRepairPrompt(rewrittenSections, pageBlueprint, initialLayoutValidation)
        const repairCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: systemPrompt + ' Repair only the layout budget issues while preserving factual accuracy and returning the full sections array.'
            },
            {
              role: 'user',
              content: repairPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: adjustedMaxTokens
        })

        const repairResponse = repairCompletion.choices[0]?.message?.content || ''
        if (repairResponse) {
          const repaired = parseAIResponse(repairResponse, originalSections.sections)
          const repairedValidation = validateCVLayout(repaired.rewrittenSections, pageBlueprint)
          console.log('📐 Layout validation after repair:', {
            isValid: repairedValidation.isValid,
            totalChars: repairedValidation.totalChars,
            targetTotalChars: repairedValidation.targetTotalChars,
            issues: repairedValidation.issues.map(issue => issue.message)
          })
          const initialIsTooShort = initialLayoutValidation.issues.some(issue => issue.code === 'total_under_minimum')
          const repairImprovedLength = repairedValidation.totalChars > initialLayoutValidation.totalChars
          const repairResolvedOrImprovedIssues = repairedValidation.issues.length <= initialLayoutValidation.issues.length

          if (initialIsTooShort ? repairImprovedLength : repairResolvedOrImprovedIssues) {
            rewrittenSections = repaired.rewrittenSections
          } else {
            console.warn('📐 Layout repair rejected because it did not expand the underfilled CV.', {
              initialTotalChars: initialLayoutValidation.totalChars,
              repairedTotalChars: repairedValidation.totalChars
            })
          }
        }
      } catch (layoutRepairError) {
        console.error('❌ Layout repair failed:', layoutRepairError)
      }
    }
    
    // For 4-page CVs, validate structure specifications and regenerate if needed
    if (requestedMaxPages >= 4) {
      console.log('🔍 Validating 4-page CV structure specifications...')
      
      // Local helper to get section content as string
      const getSectionContentLocal = (content: any): string => {
        if (!content) return ''
        if (typeof content === 'string') return content
        if (Array.isArray(content)) {
          return content.map((item: any) => {
            if (typeof item === 'string') return item
            if (typeof item === 'object' && item !== null) {
              const parts = []
              const title = item.title || item.job_title || item.position || ''
              const company = item.company || item.employer || ''
              const dates = item.dates || item.duration || item.period || ''
              if (title || company) {
                let titleLine = ''
                if (title && company && dates) {
                  titleLine = `${title} | ${company} | ${dates}`
                } else if (title && company) {
                  titleLine = `${title} | ${company}`
                } else {
                  titleLine = title || company
                }
                parts.push(titleLine)
              }
              if (item.bullets && Array.isArray(item.bullets)) {
                item.bullets.forEach((bullet: string) => {
                  parts.push(`• ${bullet}`)
                })
              } else if (item.responsibilities) {
                if (typeof item.responsibilities === 'string') {
                  parts.push(item.responsibilities)
                } else if (Array.isArray(item.responsibilities)) {
                  item.responsibilities.forEach((resp: string) => {
                    parts.push(`• ${resp}`)
                  })
                }
              } else if (item.description) {
                parts.push(item.description)
              }
              return parts.join('\n')
            }
            return ''
          }).join('\n\n')
        }
        if (typeof content === 'object') {
          return Object.values(content).filter((v: any) => typeof v === 'string').join('\n')
        }
        return String(content)
      }
      
      try {
        const expSection = rewrittenSections.find((s: any) => s.type === 'experience')
        if (expSection) {
          const expContent = getSectionContentLocal(expSection.content)
          const expLines = expContent.split('\n').filter((line: string) => line.trim().startsWith('•'))
          console.log(`💼 Experience bullets count: ${expLines.length} (target: 10 per job)`)
          
          // Check if we have enough bullets (should be 10 per job)
          if (expLines.length < 10) {
            console.log(`⚠️ Not enough bullets (${expLines.length} < 10), asking AI to expand...`)
            
            const expandPrompt = `The experience section has only ${expLines.length} bullet points but needs EXACTLY 10 bullet points per job for a 4-page CV. Each bullet must be 35-40 words.

Current experience content:
${expContent}

Add ${10 - expLines.length} more detailed bullet points. Each bullet must:
- Be 35-40 words
- Include action verb + specific task + quantifiable result + context
- Be relevant to the job title and company

Respond with ONLY the complete experience section content with all bullet points.`
            
            const openai = getOpenAIClient()
            const expandCompletion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are a CV content generator. Expand experience sections to meet exact specifications.'
                },
                {
                  role: 'user',
                  content: expandPrompt
                }
              ],
              temperature: 0.7,
              max_tokens: 2000
            })
            
            const expandedContent = expandCompletion.choices[0]?.message?.content
            if (expandedContent) {
              expSection.content = expandedContent
              console.log('✅ Experience section expanded')
            }
          }
        }
        
        const summarySection = rewrittenSections.find((s: any) => s.type === 'summary')
        if (summarySection) {
          const summaryContent = getSectionContentLocal(summarySection.content)
          const summarySentences = summaryContent.split(/[.!?]+/).filter((s: string) => s.trim().length > 0)
          console.log(`📝 Summary sentences count: ${summarySentences.length} (target: 6)`)
          
          if (summarySentences.length < 6) {
            console.log(`⚠️ Not enough summary sentences (${summarySentences.length} < 6), asking AI to expand...`)
            
            const expandPrompt = `The summary section has only ${summarySentences.length} sentences but needs EXACTLY 6 sentences for a 4-page CV. Each sentence should be 12-15 words.

Current summary:
${summaryContent}

Add ${6 - summarySentences.length} more sentences. Focus on: professional background, key strengths, therapeutic approach, achievements.

Respond with ONLY the complete summary section content.`
            
            const openai = getOpenAIClient()
            const expandCompletion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are a CV content generator. Expand summary sections to meet exact specifications.'
                },
                {
                  role: 'user',
                  content: expandPrompt
                }
              ],
              temperature: 0.7,
              max_tokens: 500
            })
            
            const expandedContent = expandCompletion.choices[0]?.message?.content
            if (expandedContent) {
              summarySection.content = expandedContent
              console.log('✅ Summary section expanded')
            }
          }
        }
      } catch (error) {
        console.error('❌ Structure validation failed:', error)
      }
    }
    
    // 🔍 DEBUG: Log parsed sections
    console.log('📋 Parsed sections count:', rewrittenSections.length)
    console.log('📋 Section types:', rewrittenSections.map(s => s.type).join(', '))
    
    // 🔍 DEBUG: Check experience section specifically
    const expSection = rewrittenSections.find((s: any) => s.type === 'experience')
    if (expSection) {
      const expContent = typeof expSection.content === 'string' ? expSection.content : JSON.stringify(expSection.content)
      console.log('💼 Experience section length:', expContent.length)
      console.log('💼 Experience content preview:', expContent.substring(0, 300))
    } else {
      console.error('❌ NO EXPERIENCE SECTION IN AI OUTPUT!')
    }

    // 🎨 AI LAYOUT ANALYSIS: Review CV content and suggest improvements for multi-page CVs
    if (max_pages === 4) {
      console.log('🎨 Running AI layout analysis for 4-page CV...')
      try {
        const totalContentLength = rewrittenSections.reduce((sum: number, s: any) => {
          const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content)
          return sum + content.length
        }, 0)
        
        console.log(`📏 Total content length: ${totalContentLength} characters`)
        
        // Target: ~12,000 characters for 4 pages (3,000 per page)
        if (totalContentLength < 10000) {
          console.log('⚠️ Content is too short for 4 pages, requesting AI to add more sections...')
          
          const layoutAnalysisPrompt = `
You are a CV layout expert. Review the following CV content and suggest additional relevant sections to fill white space and improve the layout.

CURRENT CV CONTENT:
${JSON.stringify(rewrittenSections, null, 2)}

ANALYSIS:
- Total content length: ${totalContentLength} characters
- Target for 4-page CV: ~12,000 characters
- Gap: ${12000 - totalContentLength} characters needed

TASK:
1. Analyze the current sections and identify gaps
2. Suggest 2-3 additional sections that would be relevant for this candidate's profile
3. For each suggested section, provide:
   - Section type (e.g., "achievements", "projects", "volunteering", "publications", "conferences")
   - 5-7 bullet points with 15-20 words each
   - Content should be relevant to the candidate's experience and industry

RESPONSE FORMAT (JSON):
{
  "suggested_sections": [
    {
      "type": "section_type",
      "content": "section content with bullet points"
    }
  ]
}

IMPORTANT:
- Do NOT invent fake experience or companies
- Use the candidate's actual experience and skills as context
- Make suggestions relevant to their industry and career level
- Keep content professional and factual
`

          const layoutAnalysisResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a CV layout expert who helps optimize CV content for professional presentation.' },
              { role: 'user', content: layoutAnalysisPrompt }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          })

          const layoutAnalysis = JSON.parse(layoutAnalysisResponse.choices[0].message.content || '{}')
          
          if (layoutAnalysis.suggested_sections && layoutAnalysis.suggested_sections.length > 0) {
            console.log(`✅ AI suggested ${layoutAnalysis.suggested_sections.length} additional sections`)
            
            // Add suggested sections to the CV
            for (const section of layoutAnalysis.suggested_sections) {
              rewrittenSections.push({
                type: section.type,
                content: section.content,
                order: rewrittenSections.length + 1
              })
            }
            
            console.log(`✅ Added ${layoutAnalysis.suggested_sections.length} sections to CV`)
            console.log('📋 New section types:', rewrittenSections.map(s => s.type).join(', '))
          }
        } else {
          console.log('✅ Content length is sufficient for 4 pages')
        }
      } catch (error) {
        console.error('❌ AI layout analysis failed:', error)
        // Continue without layout analysis if it fails
      }
    }

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
        'XYZ Company',
        'ABC Corporation',
        'Springer Nature',
        'Research Integrity Content Coordinator',
        'Content Coordinator',
        'Research Coordinator',
        'Content Writer at XYZ',
        'at XYZ Company'
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
      
      // 🚨 ADDITIONAL CHECK: Detect if AI created entirely new job entries
      // Count job entries (separated by newlines with company names)
      const originalJobCount = (originalContent.match(/\|\s*[A-Z]/g) || []).length
      const rewrittenJobCount = (rewrittenContent.match(/\|\s*[A-Z]/g) || []).length
      
      if (rewrittenJobCount < originalJobCount) {
        console.error(`🚨 CRITICAL: AI removed jobs! Original: ${originalJobCount}, Rewritten: ${rewrittenJobCount}`)
        return NextResponse.json({ 
          error: `AI removed ${originalJobCount - rewrittenJobCount} job(s) from work experience. Please try again.` 
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
    
    // 🚨 CRITICAL VALIDATION: Check if AI modified education
    const originalEducation = originalSections.sections.find(s => s.type === 'education')
    const rewrittenEducation = rewrittenSections.find(s => s.type === 'education')
    
    if (originalEducation && rewrittenEducation) {
      const originalContent = typeof originalEducation.content === 'string' 
        ? originalEducation.content 
        : JSON.stringify(originalEducation.content)
      const rewrittenContent = typeof rewrittenEducation.content === 'string'
        ? rewrittenEducation.content
        : JSON.stringify(rewrittenEducation.content)
      
      // Check for suspicious fake education entries
      const fakeEducationPatterns = [
        'Bachelor of Arts in English Literature',
        'University of London',
        'Bachelor of Arts in [',
        'Bachelor of Science in [',
        'Master of Arts in [',
        '[Relevant Field]'
      ]
      
      const detectedFakeEducation = fakeEducationPatterns.filter(fake =>
        rewrittenContent.includes(fake) &&
        !originalContent.includes(fake)
      )
      
      if (detectedFakeEducation.length > 0) {
        console.error(`🚨 CRITICAL: AI invented fake education: ${detectedFakeEducation.join(', ')}`)
        return NextResponse.json({ 
          error: `AI modified education section with fake entries (${detectedFakeEducation.join(', ')}). Education must be copied exactly from original CV. Please try again.` 
        }, { status: 500 })
      }
      
      console.log(`✅ Education validation passed`)
    }

    // 🔍 DEBUG: Log sections before ATS calculation
    console.log('📊 Sections before ATS calc:', rewrittenSections.length)
    console.log('📊 Section types before ATS:', rewrittenSections.map(s => s.type).join(', '))

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
      console.log(`Good ATS score (${atsScore}%), no optimization needed`)
    }

    // DEBUG: Log sections RIGHT BEFORE database insert
    console.log('Sections being saved to DB:', rewrittenSections.length)
    console.log('Section types being saved:', rewrittenSections.map(s => s.type).join(', '))

    // Save generation to database
    const { data: generationData, error: generationError } = await activeClient
      .from('generations')
      .insert({
        cv_id,
        user_id: user.id,
        job_title,
        job_description,
        rewrite_style,
        tone,
        output_sections: { sections: rewrittenSections },
        diff_meta: diffMeta,
        ats_score: atsScore,
        output_language: targetLanguage,
        max_pages: max_pages || 1
      })
      .select()
      .single()

    if (generationError) {
      console.error('Generation save error:', generationError)
      return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 })
    }

    // Track analytics event (async - don't block response)
    trackCVGeneration({
      jobTitle: job_title,
      outputLanguage: targetLanguage,
      rewriteStyle: rewrite_style,
      tone
    }).catch(err => console.error('Analytics tracking failed:', err))
    
    trackFunnelStage('first_generation').catch(err => 
      console.error('Funnel tracking failed:', err)
    )

    // Update usage tracking - increment lifetime count
    const newCount = currentUsage + 1
    console.log('Updating usage tracking:', {
      userId: user.id,
      oldCount: currentUsage,
      newCount
    })

    const { data: updatedUsage, error: usageUpdateError } = await activeClient
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

    // Send email triggers based on usage
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'
    
    // First generation email (only if this was their first generation)
    if (currentUsage === 0 && newCount === 1 && !isPro) {
      console.log('📧 Sending first generation email to:', user.email)
      sendFirstGenerationEmail(user.email!, userName).catch(err => 
        console.error('Failed to send first generation email:', err)
      )
    }
    
    // Limit reached email (only if they just hit the limit)
    if (currentUsage < maxGenerations && newCount >= maxGenerations && !isPro) {
      console.log('📧 Sending limit reached email to:', user.email)
      sendLimitReachedEmail(user.email!, userName).catch(err => 
        console.error('Failed to send limit reached email:', err)
      )
    }

    // Update CV last accessed
    await activeClient
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
    const errorResponse = formatErrorResponse(error)
    return NextResponse.json({ 
      error: errorResponse.error 
    }, { status: errorResponse.statusCode })
  }
}

function createRewritePrompt(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string,
  rewriteStyle: string,
  tone: string,
  customSections?: string[],
  languageCode: string = 'en',
  maxPages?: number
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

  // Detect voice and writing style from the original CV
  const allText = sections.map(s => typeof s.content === 'string' ? s.content : JSON.stringify(s.content)).join(' ').toLowerCase()
  const isFirstPerson = /\bi('ve| have| am| was| led| built| created| managed| delivered)\b/.test(allText) || /\bmy (experience|background|skills|work|career)\b/.test(allText)
  const hasMetrics = /\d+[\+%kmb]|\£\d|\$\d|\d+ (clients|people|teams|projects|years)/.test(allText)
  const voiceInstruction = isFirstPerson
    ? '\n⚠️ VOICE: This CV uses first-person writing ("I have", "I\'ve led"). You MUST preserve this first-person voice in the summary and any narrative sections. Do NOT convert to third-person.'
    : ''
  const metricsInstruction = hasMetrics
    ? '\n⚠️ METRICS: This CV contains specific numbers and metrics. You MUST preserve ALL real numbers (percentages, £/$ figures, headcounts, years of experience) — do NOT replace them with vague language.'
    : ''

  const languageName = LANGUAGE_NAMES[languageCode] || 'English'
  const styleMap = {
    conservative: 'minimal changes',
    balanced: 'moderate improvements',
    bold: 'significant optimization'
  }

  // Page length instructions with exact structure specifications
  let pageLengthInstructions = ''
  if (maxPages) {
    pageLengthInstructions = `\n\n📏 PAGE LENGTH CONSTRAINT: Maximum ${maxPages} page(s)\n`
    if (maxPages === 1) {
      pageLengthInstructions += '- Use concise bullet points (2-3 per job)\n- Focus on most relevant experience only\n- Keep summary to 2-3 sentences'
    } else if (maxPages === 2) {
      pageLengthInstructions += '- Use standard bullet points (3-4 per job)\n- Include all relevant experience\n- Keep summary to 3-4 sentences'
    } else if (maxPages === 3) {
      pageLengthInstructions += '- Use detailed bullet points (4-5 per job)\n- Include comprehensive experience\n- Keep summary to 4-5 sentences'
    } else {
      // Specify exact structure for 4-page CV
      pageLengthInstructions += `🔥 CRITICAL: 4-PAGE CV REQUIREMENTS - EXACT STRUCTURE SPECIFICATIONS 🔥

You MUST follow these EXACT structure specifications:

SUMMARY SECTION:
- EXACTLY 6 sentences
- Each sentence: 12-15 words
- Total: ~75-90 words
- Focus: Professional background, key strengths, therapeutic approach, achievements

EXPERIENCE SECTION:
- For EACH job: EXACTLY 10 bullet points
- Each bullet point: EXACTLY 35-40 words
- Each bullet MUST include: action verb + specific task + quantifiable result/metric + context
- Example: "Developed innovative communication resources for 50+ children with diverse needs, resulting in 40% improvement in engagement levels across 12 schools."
- DO NOT write fewer than 10 bullets per job
- DO NOT write bullets shorter than 35 words
- If you don't have enough source material, expand with reasonable details based on job title

SKILLS SECTION:
- EXACTLY 12 skills
- Each skill: 8-10 words with context
- Format: "Skill name - context/application"
- Example: "Play Therapy - child-centered approaches for emotional expression"

EDUCATION SECTION:
- For each degree: EXACTLY 5 bullet points
- Each bullet: 15-20 words
- Include: coursework completed, projects undertaken, research participation, achievements, relevant modules

CERTIFICATIONS SECTION:
- For each certification: EXACTLY 4 bullet points
- Each bullet: 15-20 words
- Include: what was learned, skills gained, practical applications, duration/intensity

INTERESTS SECTION:
- EXACTLY 6 interests
- Each interest: 12-15 words with context
- Example: "Traveling - exploring cultures for personal growth and inspiration"

CRITICAL INSTRUCTIONS:
1. Count the items as you generate - DO NOT guess
2. If a section has fewer items than specified, add more
3. If bullets are too short, expand with more detail
4. Follow the EXACT word counts for each item
5. DO NOT exceed or fall short of these structure specifications
6. Your output MUST follow this exact structure to fill 4 pages`
    }
  }

  return `🚨🚨🚨 CRITICAL INSTRUCTIONS - FAILURE = REJECTED OUTPUT 🚨🚨🚨

THIS IS A CV ADAPTATION TASK, NOT A CV CREATION TASK!

YOU MUST PRESERVE:
✅ ALL job titles (e.g., "Play Therapist" → "Play Therapist")
✅ ALL company names (e.g., "Child in Mind" → "Child in Mind")
✅ ALL employment dates (e.g., "10/2016 – 08/2022" → "10/2016 – 08/2022")
✅ ALL education entries EXACTLY as written
✅ ALL certifications EXACTLY as written
✅ ALL hobbies/interests EXACTLY as written

YOU CAN ONLY CHANGE:
✏️ Bullet points describing job responsibilities
✏️ Professional summary wording
✏️ Skill ordering (not content)

REWRITING CV FOR: ${jobTitle}
KEY REQUIREMENTS: ${keywords.join(', ')}
${pageLengthInstructions}${voiceInstruction}${metricsInstruction}

CURRENT CV:
${sectionsText}

🚨🚨🚨 ABSOLUTELY CRITICAL - READ EVERY WORD 🚨🚨🚨

YOU ARE ADAPTING AN EXISTING CV, NOT WRITING A NEW ONE FROM SCRATCH!

YOUR ONLY JOB: Rewrite the bullet points/descriptions to match the new job role.
YOU MUST NOT: Change job titles, companies, dates, education, or create fake content.

RULE #1: PRESERVE ALL JOB INFORMATION EXACTLY
- Job Title: COPY EXACTLY (e.g., "Play Therapist" stays "Play Therapist")
- Company: COPY EXACTLY (e.g., "Child in Mind" stays "Child in Mind")
- Dates: COPY EXACTLY (e.g., "10/2016 – 08/2022" stays "10/2016 – 08/2022")
- Location: COPY EXACTLY (e.g., "Manchester, England" stays "Manchester, England")
- ❌ NEVER invent: "Content Writer | XYZ Company | June 2021 - Present"
- ❌ NEVER change: "Play Therapist" to "Content Writer"

RULE #2: ADAPT ONLY THE DESCRIPTIONS/BULLETS
What you CAN change:
- Bullet points describing responsibilities
- Action verbs and metrics
- Wording to highlight relevant skills

What you CANNOT change:
- Job titles
- Company names
- Employment dates
- Locations
- Number of jobs

RULE #3: EDUCATION SECTION - COPY 100% EXACTLY
- DO NOT modify degrees, universities, dates, or coursework
- DO NOT add generic placeholders like "Bachelor of Arts in [Relevant Field]"
- COPY EXACTLY character-for-character from the original
- Example: "Filial Therapy in Family Therapy | Manchester | 08/2019" → EXACT SAME

RULE #4: PRESERVE ALL WORK HISTORY
- If original has 6 jobs → Output MUST have 6 jobs
- If original has 3 jobs → Output MUST have 3 jobs
- NEVER reduce or combine jobs
- NEVER create new fake jobs
- Each job must have its ORIGINAL title, company, and dates

RULE #5: KEEP ALL SECTIONS
- If original has: name, contact, summary, experience, education, skills, certifications, hobbies
- Output MUST have: name, contact, summary, experience, education, skills, certifications, hobbies
- DO NOT remove or skip any sections

TONE: ${tone}
LANGUAGE: ${languageName}${languageCode !== 'en' ? ' (output MUST be in ' + languageName + ')' : ''}

❌ WRONG EXAMPLES (NEVER DO THIS):
1. Creating fake jobs:
   ❌ "Content Writer | XYZ Company | June 2021 - Present"
   ❌ "Research Coordinator | Springer Nature | 2020 - Present"

2. Changing job titles:
   ❌ Original: "Play Therapist" → Output: "Content Writer" ❌ NEVER!

3. Changing companies:
   ❌ Original: "Child in Mind" → Output: "XYZ Company" ❌ NEVER!

4. Modifying education:
   ❌ Original: "Filial Therapy in Family Therapy | Manchester | 08/2019"
   ❌ Output: "Bachelor of Arts in Psychology | University | 2019" ❌ NEVER!

✅ CORRECT EXAMPLES (ALWAYS DO THIS):
1. Preserving job info, adapting descriptions:
   Original:
   "Play Therapist | Child in Mind | 10/2016 – 08/2022 | Manchester, England
   • Managed a caseload of children and families."
   
   ✅ Correct Output:
   "Play Therapist | Child in Mind | 10/2016 – 08/2022 | Manchester, England
   • Led comprehensive therapy programs for 50+ families, improving child-parent relationships
   • Delivered specialized 1:1 therapy sessions, achieving 85% improvement in behavioral outcomes
   • Managed diverse caseload with focus on trauma-informed care"

2. Education - EXACT COPY:
   Original: "Filial Therapy in Family Therapy | Manchester | 08/2019"
   ✅ Output: "Filial Therapy in Family Therapy | Manchester | 08/2019"

FOCUS AREAS:
- Summary: Write 3-4 sentences connecting the candidate's background to the target role. PRESERVE any specific numbers ("15 years", "over 50 clients"), named qualifications ("ACCA", "PMP"), and sector expertise from the original summary. If the original uses first-person ("I have", "I've led"), KEEP the first-person voice.
- Experience: For EACH job, you MUST:
  1. Keep job title | company | dates | location EXACTLY as original
  2. REWRITE 3-5 bullet points to emphasize relevance to ${jobTitle}
  3. PRESERVE any real numbers, metrics, percentages, and named tools from the original (e.g. "50+ clients", "£2M budget", "Selenium", "Salesforce") — do NOT replace them with vague phrases like "multiple clients" or "various tools"
  4. Keep technical tools named explicitly — do NOT say "automation tools" when the original says "Selenium/TestNG"
  5. Use action verbs appropriate to the original role level — senior roles get strategic language, technical roles get technical language
- Skills: Include ALL original skills ONLY, reorder to prioritize job-relevant ones. DO NOT add any new skills that are not in the original CV.
- Education: COPY 100% EXACTLY - zero modifications allowed
- Certifications: COPY 100% EXACTLY - zero modifications allowed
- Hobbies: COPY 100% EXACTLY - zero modifications allowed
- Custom sections (volunteer_work, publications, awards, projects, languages, memberships, speaking, patents, research, teaching, community): 
  * If present in original CV: COPY 100% EXACTLY - zero modifications allowed
  * If NOT in original CV but requested: Include section with placeholder text "To be added" or leave empty
- All other sections: COPY EXACTLY if present

🚨 CRITICAL: Experience section MUST have bullet points! Do NOT just list job titles!
🚨 CRITICAL: ALL sections from original CV MUST be in output!
🚨 CRITICAL: If custom sections are requested but not in original, include them as empty sections!

VERIFICATION CHECKLIST (CHECK BEFORE RESPONDING):
□ Same number of jobs as original?
□ All job titles match original exactly?
□ All company names match original exactly?
□ All dates match original exactly?
□ EACH job has 3-5 bullet points describing responsibilities?
□ Education copied 100% exactly (no modifications)?
□ Certifications copied 100% exactly?
□ Hobbies copied 100% exactly?
□ No fake companies like "XYZ Company", "ABC Corporation", "Springer Nature"?
□ No fake education like "Bachelor of Arts in English Literature, University of London"?
□ No fake job titles like "Content Writer at XYZ Company"?
□ No fabricated skills that don't exist in the original CV (e.g., adding "React, Node.js" when original has therapy skills)?

⚠️ IF ANY CHECKBOX IS UNCHECKED, YOUR OUTPUT WILL BE REJECTED! ⚠️

${customSections && customSections.length > 0 ? `ADD SECTIONS: ${customSections.join(', ')}` : ''}

Return JSON with this EXACT structure:
{
  "sections": [
    {
      "type": "name|contact|summary|experience|education|skills|certifications|hobbies|groups|strengths|additional|interests|volunteer_work|publications|awards|projects|languages|memberships|speaking|patents|research|teaching|community",
      "content": "EXACT content from original (for education/certifications/hobbies/volunteer_work/publications/awards/projects/languages/memberships/speaking/patents/research/teaching/community) OR adapted content (for experience/summary/skills)",
      "order": number,
      "changes": ["list of changes made - ONLY for modified sections"]
    }
  ],
  "summary_of_changes": "Brief summary of what was adapted (NOT what was preserved)"
}

🚨 IMPORTANT: Custom sections requested: ${customSections && customSections.length > 0 ? customSections.join(', ') : 'none'}
${customSections && customSections.length > 0 ? `
For each requested custom section:
1. Check if it exists in the CURRENT CV above
2. If it EXISTS in original CV: COPY the content 100% EXACTLY
3. If it does NOT exist in original CV: GENERATE relevant content based on the candidate's experience and the job description
   - For volunteer_work: Generate 2-3 relevant volunteer experiences that align with their skills
   - For publications: Generate 2-3 relevant publications/articles they could have written
   - For awards: Generate 2-3 relevant awards/recognitions based on their achievements
   - For projects: Generate 2-3 relevant projects based on their work experience
   - For languages: Generate language proficiencies if relevant to the job
   - For memberships: Generate relevant professional memberships
   - For speaking: Generate relevant speaking engagements/presentations
   - For patents: Generate relevant patents/innovations if applicable
   - For research: Generate relevant research work based on their background
   - For teaching: Generate relevant teaching/training experience
   - For community: Generate relevant community involvement

IMPORTANT: Generated content must be:
- Realistic and believable based on their actual experience
- Relevant to the job description
- Professional and credible
- Not fabricated - infer from their existing experience

Example: If "volunteer_work" is requested but not in current CV, and they have therapy experience:
{"type": "volunteer_work", "content": "Volunteer Counselor | Local Community Center | 2020-Present\n• Provide pro-bono counseling services to underserved families\n• Facilitate support groups for parents and caregivers", "order": 15}
` : ''}

REMEMBER: You are ADAPTING bullet points, NOT creating a new CV!
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
