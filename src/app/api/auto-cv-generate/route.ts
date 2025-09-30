import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AutoCVRequest {
  job_description: string
  personal_info: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn?: string
    website?: string
  }
  work_experience: Array<{
    jobTitle: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    details?: string
  }>
  skills: string
  additional_info: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limits
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

    const body: AutoCVRequest = await request.json()
    const { 
      job_description, 
      personal_info, 
      work_experience, 
      education, 
      skills, 
      additional_info 
    } = body

    // Validate request
    if (!job_description || !personal_info.fullName || !personal_info.email) {
      return NextResponse.json({ 
        error: 'Missing required fields: job_description, personal_info.fullName, personal_info.email' 
      }, { status: 400 })
    }

    // Create comprehensive prompt for CV generation
    const prompt = `
You are an expert CV writer. Create a professional, ATS-optimized CV based on the following information:

TARGET JOB:
${job_description}

CANDIDATE INFORMATION:
Name: ${personal_info.fullName}
Email: ${personal_info.email}
Phone: ${personal_info.phone}
Location: ${personal_info.location}
LinkedIn: ${personal_info.linkedIn || 'Not provided'}
Website: ${personal_info.website || 'Not provided'}

WORK EXPERIENCE:
${work_experience.map(exp => `
- ${exp.jobTitle} at ${exp.company} (${exp.duration})
  ${exp.description}
`).join('\n')}

EDUCATION:
${education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.year})
  ${edu.details || ''}
`).join('\n')}

SKILLS:
${skills}

ADDITIONAL INFORMATION:
${additional_info}

INSTRUCTIONS:
1. Create a professional CV with the following sections: name, contact, professional_summary, experience, education, skills, and any other relevant sections
2. Write a compelling professional summary that aligns with the target job
3. Optimize work experience descriptions with relevant keywords from the job description
4. Ensure all content is truthful and based on the provided information
5. Use strong action verbs and quantify achievements where possible
6. Make the CV ATS-friendly with clear section headers
7. Tailor the content to match the job requirements while staying truthful
8. If work experience is limited, focus more on skills, education, and potential
9. Add relevant sections like "Projects", "Certifications", or "Volunteer Work" if the additional information suggests them

Provide your response in this exact JSON format:
{
  "sections": [
    {
      "type": "name",
      "content": "Full Name",
      "order": 0
    },
    {
      "type": "contact",
      "content": "Email: email@example.com\\nPhone: +1234567890\\nLocation: City, State\\nLinkedIn: linkedin.com/in/profile",
      "order": 1
    },
    {
      "type": "professional_summary",
      "content": "Professional summary content...",
      "order": 2
    },
    {
      "type": "experience",
      "content": "Detailed work experience...",
      "order": 3
    },
    {
      "type": "education",
      "content": "Education details...",
      "order": 4
    },
    {
      "type": "skills",
      "content": "Skills list...",
      "order": 5
    }
  ]
}

Make sure each section is well-formatted and professional. Focus on making this CV stand out for the specific job while remaining truthful to the candidate's background.
`

    console.log('Generating CV with OpenAI...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV writer who creates compelling, ATS-optimized CVs that help candidates get interviews. Always provide responses in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const cvContent = completion.choices[0]?.message?.content

    if (!cvContent) {
      return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 })
    }

    let parsedSections
    try {
      parsedSections = JSON.parse(cvContent)
    } catch (error) {
      console.error('Failed to parse CV JSON:', error)
      return NextResponse.json({ error: 'Failed to parse generated CV' }, { status: 500 })
    }

    // Create a "CV" entry first (as if uploaded)
    const cvData = {
      user_id: user.id,
      original_text: `Auto-generated CV for ${personal_info.fullName}`,
      parsed_sections: parsedSections,
      file_meta: {
        name: `${personal_info.fullName.replace(/\s+/g, '_')}_Auto_CV.txt`,
        ext: 'txt',
        size: cvContent.length,
        upload_date: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    }

    const { data: cvRecord, error: cvError } = await supabase
      .from('cvs')
      .insert(cvData)
      .select()
      .single()

    if (cvError) {
      console.error('CV save error:', cvError)
      return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 })
    }

    // Create generation record
    const generationData = {
      user_id: user.id,
      cv_id: cvRecord.id,
      job_title: extractJobTitle(job_description),
      job_description: job_description,
      rewrite_style: 'balanced' as const,
      tone: 'professional' as const,
      output_sections: parsedSections,
      diff_meta: {
        changes: [],
        summary: 'Auto-generated CV from scratch'
      },
      created_at: new Date().toISOString()
    }

    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert(generationData)
      .select()
      .single()

    if (genError) {
      console.error('Generation save error:', genError)
      return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 })
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
      generation_id: generation.id,
      cv_id: cvRecord.id,
      sections: parsedSections.sections,
      usage: {
        current_count: (usage?.generation_count || 0) + 1,
        max_count: maxGenerations,
        is_pro: isPro
      }
    })

  } catch (error) {
    console.error('Auto-CV generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function extractJobTitle(jobDescription: string): string {
  // Simple extraction - look for common patterns
  const lines = jobDescription.split('\n')
  const firstLine = lines[0]?.trim()
  
  // If first line looks like a job title (short and doesn't contain common job description words)
  if (firstLine && firstLine.length < 100 && !firstLine.toLowerCase().includes('we are looking')) {
    return firstLine
  }
  
  // Look for "Job Title:" or similar patterns
  const titleMatch = jobDescription.match(/(?:job title|position|role):\s*([^\n]+)/i)
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  // Default fallback
  return 'Professional Role'
}
