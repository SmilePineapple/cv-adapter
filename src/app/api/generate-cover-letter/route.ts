import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CoverLetterRequest {
  generation_id: string
  company_name: string
  job_title: string
  job_description: string
  length: 'short' | 'long'
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'formal'
  hiring_manager_name?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limits (cover letters count towards generation limit)
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('generation_count')
      .eq('user_id', user.id)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
    }

    // Check subscription status for usage limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single()

    const isPro = subscription?.status === 'active'
    const maxGenerations = isPro ? 100 : 3
    
    if ((usage?.generation_count || 0) >= maxGenerations) {
      return NextResponse.json({
        error: 'Monthly generation limit reached',
        limit_reached: true,
        is_pro: isPro,
        current_usage: usage?.generation_count || 0,
        max_usage: maxGenerations
      }, { status: 429 })
    }

    const body: CoverLetterRequest = await request.json()
    const { 
      generation_id, 
      company_name, 
      job_title, 
      job_description, 
      length, 
      tone,
      hiring_manager_name 
    } = body

    // Validate request
    if (!generation_id || !company_name || !job_title || !job_description) {
      return NextResponse.json({ 
        error: 'Missing required fields: generation_id, company_name, job_title, job_description' 
      }, { status: 400 })
    }

    // Get the generation and CV data
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select(`
        output_sections,
        job_title,
        cvs!inner(parsed_sections)
      `)
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Extract personal details and experience from CV
    const cvSections = (generation as any).cvs.parsed_sections.sections
    const personalDetails = cvSections.find((s: any) => s.type === 'contact' || s.type === 'personal_details')
    const experience = cvSections.find((s: any) => s.type === 'experience' || s.type === 'work_experience')
    const skills = cvSections.find((s: any) => s.type === 'skills' || s.type === 'key_skills')
    const education = cvSections.find((s: any) => s.type === 'education')

    // Create cover letter prompt
    const lengthInstructions = {
      short: "Write a concise, impactful cover letter (250-300 words). Focus on the most relevant experience and skills.",
      long: "Write a comprehensive cover letter (400-500 words). Include detailed examples and elaborate on relevant experience."
    }

    const toneInstructions = {
      professional: "Use a professional, business-appropriate tone. Be confident but not overly casual.",
      friendly: "Use a warm, approachable tone while maintaining professionalism. Show personality.",
      enthusiastic: "Use an energetic, passionate tone. Show genuine excitement for the role and company.",
      formal: "Use a very formal, traditional business tone. Be respectful and conservative in language."
    }

    const prompt = `
You are an expert cover letter writer. Create a tailored cover letter based on the following information:

PERSONAL DETAILS:
${personalDetails?.content || 'Not provided'}

RELEVANT EXPERIENCE:
${experience?.content || 'Not provided'}

KEY SKILLS:
${skills?.content || 'Not provided'}

EDUCATION:
${education?.content || 'Not provided'}

JOB DETAILS:
- Company: ${company_name}
- Position: ${job_title}
- Job Description: ${job_description}
${hiring_manager_name ? `- Hiring Manager: ${hiring_manager_name}` : ''}

REQUIREMENTS:
- Length: ${lengthInstructions[length]}
- Tone: ${toneInstructions[tone]}

CRITICAL INSTRUCTIONS:
1. Address the letter properly (use hiring manager name if provided, otherwise "Dear Hiring Manager")
2. Reference the specific position and company name
3. Highlight relevant experience that matches the job requirements
4. Use specific examples from the CV content provided
5. Show knowledge of the company/role from the job description
6. Include a strong opening that grabs attention
7. End with a clear call to action
8. Use the candidate's actual experience - don't invent fake details
9. Match the requested tone and length exactly
10. Format as a proper business letter

Return ONLY the cover letter content, properly formatted with paragraphs.
`

    console.log('Generating cover letter with OpenAI...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer who creates compelling, tailored cover letters that help candidates stand out.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: length === 'short' ? 400 : 600,
      temperature: 0.7,
    })

    const coverLetterContent = completion.choices[0]?.message?.content

    if (!coverLetterContent) {
      return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
    }

    // Save cover letter to database
    const { data: coverLetterData, error: saveError } = await supabase
      .from('cover_letters')
      .insert({
        user_id: user.id,
        generation_id: generation_id,
        content: coverLetterContent,
        company_name: company_name,
        job_title: job_title,
        length: length,
        tone: tone,
        hiring_manager_name: hiring_manager_name || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Cover letter save error:', saveError)
      console.error('Error details:', {
        message: saveError.message,
        code: saveError.code,
        details: saveError.details,
        hint: saveError.hint
      })
      
      // If table doesn't exist, provide helpful error message
      if (saveError.message?.includes('relation "cover_letters" does not exist')) {
        return NextResponse.json({ 
          error: 'Cover letters table not set up. Please run the database migration first.',
          setup_required: true
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to save cover letter',
        details: saveError.message,
        code: saveError.code,
        full_error: saveError
      }, { status: 500 })
    }

    // Update usage count
    await supabase
      .from('usage_tracking')
      .update({ 
        generation_count: (usage?.generation_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      cover_letter_id: coverLetterData.id,
      content: coverLetterContent,
      company_name: company_name,
      job_title: job_title,
      length: length,
      tone: tone,
      usage: {
        current_count: (usage?.generation_count || 0) + 1,
        max_count: maxGenerations,
        is_pro: isPro
      }
    })

  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
