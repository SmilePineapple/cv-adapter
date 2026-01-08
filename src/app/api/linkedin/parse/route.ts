import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { linkedinText, userId } = await request.json()

    if (!linkedinText || !userId) {
      return NextResponse.json(
        { error: 'LinkedIn text and user ID are required' },
        { status: 400 }
      )
    }

    // Check user's subscription tier for gating
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('subscription_tier, linkedin_imports_used')
      .eq('user_id', userId)
      .single()

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
    const linkedinImportsUsed = usage?.linkedin_imports_used || 0

    // Gate: Free = 1 import, Pro = unlimited
    if (!isPro && linkedinImportsUsed >= 1) {
      return NextResponse.json(
        { 
          error: 'You have used your free LinkedIn import. Upgrade to Pro for unlimited imports!',
          requiresUpgrade: true
        },
        { status: 403 }
      )
    }

    console.log('[LinkedIn Parse] Parsing LinkedIn profile for user:', userId)

    // Parse LinkedIn text with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a LinkedIn profile parser. Extract structured CV data from LinkedIn profile text.

Return a JSON object with these sections:
{
  "personal_info": {
    "name": "Full Name",
    "title": "Current Job Title",
    "summary": "Professional summary/about section"
  },
  "work_experience": [
    {
      "job_title": "Title",
      "company": "Company Name",
      "dates": "Start - End",
      "description": "Bullet points of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "dates": "Start - End",
      "details": "Additional details"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Date"
    }
  ]
}

Extract as much information as possible. If a section is missing, return an empty array or object.`
        },
        {
          role: 'user',
          content: linkedinText
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })

    const parsedData = JSON.parse(completion.choices[0].message.content || '{}')

    console.log('[LinkedIn Parse] Successfully parsed profile')

    // Convert to CV sections format
    const cvSections = convertToSections(parsedData)

    // Create CV record in database
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .insert({
        user_id: userId,
        file_meta: {
          name: 'LinkedIn Import',
          size: linkedinText.length,
          type: 'text/plain',
          upload_date: new Date().toISOString(),
          source: 'linkedin'
        },
        parsed_sections: cvSections,
        original_text: linkedinText,
        detected_language: 'en'
      })
      .select()
      .single()

    if (cvError) {
      console.error('[LinkedIn Parse] CV creation error:', cvError)
      throw cvError
    }

    // Increment LinkedIn imports counter
    await supabase
      .from('usage_tracking')
      .update({
        linkedin_imports_used: linkedinImportsUsed + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    console.log('[LinkedIn Parse] CV created successfully:', cv.id)

    return NextResponse.json({
      success: true,
      cvId: cv.id,
      sections: cvSections,
      message: 'LinkedIn profile imported successfully!'
    })

  } catch (error: unknown) {
    console.error('[LinkedIn Parse] Error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to parse LinkedIn profile' },
      { status: 500 }
    )
  }
}

function convertToSections(parsedData: {
  personal_info?: {name?: string, title?: string, summary?: string}
  work_experience?: Array<{job_title?: string, company?: string, dates?: string, description?: string}>
  education?: Array<{degree?: string, institution?: string, dates?: string, details?: string}>
  skills?: string[]
  certifications?: Array<{name?: string, issuer?: string, date?: string}>
}) {
  const sections = []

  // Personal Info
  if (parsedData.personal_info) {
    sections.push({
      type: 'personal_info',
      title: 'Personal Information',
      content: {
        name: parsedData.personal_info.name || '',
        title: parsedData.personal_info.title || '',
        summary: parsedData.personal_info.summary || ''
      }
    })
  }

  // Work Experience
  if (parsedData.work_experience && parsedData.work_experience.length > 0) {
    sections.push({
      type: 'work_experience',
      title: 'Work Experience',
      content: parsedData.work_experience.map((exp) => ({
        job_title: exp.job_title || '',
        company: exp.company || '',
        dates: exp.dates || '',
        description: exp.description || ''
      }))
    })
  }

  // Education
  if (parsedData.education && parsedData.education.length > 0) {
    sections.push({
      type: 'education',
      title: 'Education',
      content: parsedData.education.map((edu) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        dates: edu.dates || '',
        details: edu.details || ''
      }))
    })
  }

  // Skills
  if (parsedData.skills && parsedData.skills.length > 0) {
    sections.push({
      type: 'skills',
      title: 'Skills',
      content: parsedData.skills.join(', ')
    })
  }

  // Certifications
  if (parsedData.certifications && parsedData.certifications.length > 0) {
    sections.push({
      type: 'certifications',
      title: 'Certifications',
      content: parsedData.certifications.map((cert) => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || ''
      }))
    })
  }

  return sections
}
