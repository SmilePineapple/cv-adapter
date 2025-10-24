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
    const { cvId, jobDescription, companyResearch, userId } = await request.json()

    if (!cvId || !jobDescription || !userId) {
      return NextResponse.json(
        { error: 'CV ID, job description, and user ID are required' },
        { status: 400 }
      )
    }

    // Check subscription tier
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('subscription_tier, interview_preps_used')
      .eq('user_id', userId)
      .single()

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
    const interviewPrepsUsed = usage?.interview_preps_used || 0

    // Gate: Free = 2 interview preps, Pro = unlimited
    if (!isPro && interviewPrepsUsed >= 2) {
      return NextResponse.json(
        { 
          error: 'You have used your 2 free interview preps. Upgrade to Pro for unlimited!',
          requiresUpgrade: true
        },
        { status: 403 }
      )
    }

    console.log('[Interview Prep] Generating for CV:', cvId)

    // Fetch CV data
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('parsed_sections, original_text')
      .eq('id', cvId)
      .single()

    if (cvError || !cv) {
      throw new Error('CV not found')
    }

    // Extract CV summary
    const cvSummary = extractCVSummary(cv)

    // Generate interview questions and answers
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an interview preparation expert. Generate realistic interview questions and sample answers based on the candidate's CV and job description.

${companyResearch ? `Company Research Available:\n${JSON.stringify(companyResearch, null, 2)}\n\nInclude company-specific questions based on this research.` : ''}

Return JSON:
{
  "general_questions": [
    {
      "question": "Question text",
      "sample_answer": "Sample answer based on CV",
      "tips": "Tips for answering"
    }
  ],
  "technical_questions": [
    {
      "question": "Technical question",
      "sample_answer": "Technical answer",
      "tips": "Technical tips"
    }
  ],
  "behavioral_questions": [
    {
      "question": "Behavioral question",
      "sample_answer": "STAR method answer",
      "tips": "Behavioral tips"
    }
  ],
  ${companyResearch ? `"company_specific_questions": [
    {
      "question": "Company-specific question",
      "sample_answer": "Answer showing company knowledge",
      "tips": "Company-specific tips"
    }
  ],` : ''}
  "questions_to_ask_them": [
    "Question 1 to ask the interviewer",
    "Question 2 to ask the interviewer"
  ]
}

Generate 3-4 questions per category. Make answers specific to the candidate's experience.`
        },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nCandidate CV Summary:\n${cvSummary}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 2500
    })

    const interviewData = JSON.parse(completion.choices[0].message.content || '{}')

    // Save to interview_preps table
    const { data: savedPrep, error: saveError } = await supabase
      .from('interview_preps')
      .insert({
        user_id: userId,
        cv_id: cvId,
        job_description: jobDescription,
        company_research: companyResearch,
        interview_data: interviewData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('[Interview Prep] Save error:', saveError)
      // Don't fail the request, just log it
    }

    // Increment counter
    await supabase
      .from('usage_tracking')
      .update({
        interview_preps_used: interviewPrepsUsed + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    console.log('[Interview Prep] Generated successfully')

    return NextResponse.json({
      success: true,
      interviewData,
      prepId: savedPrep?.id,
      message: 'Interview prep generated successfully!'
    })

  } catch (error: any) {
    console.error('[Interview Prep] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate interview prep' },
      { status: 500 }
    )
  }
}

function extractCVSummary(cv: any): string {
  const sections = cv.parsed_sections || {}
  let summary = ''

  // Extract key information
  if (sections.personal_info) {
    summary += `Name: ${sections.personal_info.name || 'N/A'}\n`
    summary += `Title: ${sections.personal_info.title || 'N/A'}\n\n`
  }

  if (sections.work_experience) {
    summary += `Work Experience:\n${JSON.stringify(sections.work_experience).substring(0, 500)}\n\n`
  }

  if (sections.education) {
    summary += `Education:\n${JSON.stringify(sections.education).substring(0, 300)}\n\n`
  }

  if (sections.skills) {
    summary += `Skills: ${sections.skills}\n`
  }

  return summary.substring(0, 2000) // Keep it concise
}
