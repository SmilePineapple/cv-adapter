import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface CoverLetterRequest {
  generation_id: string
  company_name: string
  position_title: string
  job_description: string
  length: 'short' | 'long'
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'formal'
  hiring_manager_name?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CoverLetterRequest = await request.json()
    const { 
      generation_id, 
      company_name, 
      position_title, 
      job_description, 
      length, 
      tone, 
      hiring_manager_name 
    } = body

    // Validate required fields
    if (!generation_id || !company_name || !position_title || !job_description) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get CV data - fallback to regular query
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('generations')
      .select(`
        job_description,
        cvs!inner(parsed_sections)
      `)
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (fallbackError) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }
    
    // Use fallback data
    const fallbackCV = fallbackData as unknown as {cvs: {parsed_sections: {sections: Array<{type: string, content?: string}>}}}
    const cvSections = fallbackCV.cvs.parsed_sections.sections
    const personalDetails = cvSections.find((s: {type: string, content?: string}) => 
      s.type === 'personal_details' || s.type === 'contact' || s.type === 'name'
    )?.content || ''
    
    const experience = cvSections.find((s: {type: string, content?: string}) => 
      s.type === 'experience' || s.type === 'work_experience'
    )?.content || ''
    
    const skills = cvSections.find((s: {type: string, content?: string}) => 
      s.type === 'skills' || s.type === 'technical_skills'
    )?.content || ''
    
    const education = cvSections.find((s: {type: string, content?: string}) => 
      s.type === 'education'
    )?.content || ''

    // Generate cover letter with OpenAI
    const prompt = `
Write a ${length} cover letter for the following job application:

PERSONAL DETAILS:
${personalDetails}

WORK EXPERIENCE:
${experience}

SKILLS:
${skills}

EDUCATION:
${education}

JOB DETAILS:
Company: ${company_name}
Position: ${position_title}
${hiring_manager_name ? `Hiring Manager: ${hiring_manager_name}` : ''}

JOB DESCRIPTION:
${job_description}

INSTRUCTIONS:
- Write in a ${tone} tone
- Make it ${length === 'short' ? '2-3 paragraphs' : '4-5 paragraphs'}
- Highlight relevant experience and skills
- Show enthusiasm for the role
- Include proper salutation and closing
- Make it compelling and personalized

Format as a professional cover letter.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer who creates compelling, personalized cover letters that help candidates get interviews.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: length === 'short' ? 800 : 1200,
      temperature: 0.7,
    })

    const coverLetterContent = completion.choices[0]?.message?.content

    if (!coverLetterContent) {
      return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
    }

    // Try to save to database using direct SQL
    try {
      const { data: saveResult, error: saveError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          generation_id: generation_id,
          content: coverLetterContent,
          company_name: company_name,
          position_title: position_title,
          length: length,
          tone: tone,
          hiring_manager_name: hiring_manager_name || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (saveError) {
        console.error('Database save failed:', saveError)
        // Return cover letter even if save fails
        return NextResponse.json({
          success: true,
          content: coverLetterContent,
          saved: false,
          message: 'Cover letter generated successfully (database save failed)'
        })
      }

      return NextResponse.json({
        success: true,
        content: coverLetterContent,
        saved: true,
        id: saveResult.id,
        message: 'Cover letter generated and saved successfully!'
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        success: true,
        content: coverLetterContent,
        saved: false,
        message: 'Cover letter generated successfully (database save failed)'
      })
    }

  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
