import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generation_id } = await request.json()

    if (!generation_id) {
      return NextResponse.json({ error: 'Missing generation_id' }, { status: 400 })
    }

    // Get generation data with CV content
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select(`
        job_description,
        output_sections,
        cvs!inner(parsed_sections)
      `)
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Extract CV content
    const cvSections = (generation as {output_sections: {sections: Array<{content: string}>}}).output_sections.sections
    const cvText = cvSections.map((s: {content: string}) => s.content).join('\n\n')
    const jobDescription = generation.job_description

    // Create ATS analysis prompt
    const prompt = `
You are an ATS (Applicant Tracking System) expert. Analyze how well this CV matches the job description for ATS optimization.

JOB DESCRIPTION:
${jobDescription}

CV CONTENT:
${cvText}

Analyze the following factors and provide a score out of 100:

1. KEYWORD MATCHING (30 points):
   - How many job-relevant keywords appear in the CV?
   - Are technical skills mentioned in the job description present?
   - Are industry-specific terms included?

2. FORMATTING & STRUCTURE (20 points):
   - Clear section headers
   - Consistent formatting
   - ATS-friendly structure
   - No complex formatting that ATS can't read

3. RELEVANCE & ALIGNMENT (25 points):
   - How well does experience align with job requirements?
   - Are required qualifications clearly stated?
   - Does the CV address the job's main responsibilities?

4. COMPLETENESS (15 points):
   - All essential sections present (contact, experience, education, skills)
   - Sufficient detail in each section
   - No major gaps in information

5. OPTIMIZATION FACTORS (10 points):
   - Use of action verbs
   - Quantified achievements
   - Job title alignment
   - Company/industry relevance

Provide your response in this exact JSON format:
{
  "overall_score": 85,
  "breakdown": {
    "keyword_matching": 25,
    "formatting_structure": 18,
    "relevance_alignment": 22,
    "completeness": 13,
    "optimization_factors": 7
  },
  "strengths": [
    "Strong keyword alignment with job requirements",
    "Clear section structure"
  ],
  "improvements": [
    "Add more technical keywords from job description",
    "Quantify more achievements with numbers"
  ],
  "missing_keywords": [
    "Python", "Machine Learning", "Agile"
  ],
  "ats_friendly": true
}

Be specific and actionable in your feedback.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an ATS optimization expert who analyzes CVs for keyword matching and ATS compatibility. Always provide responses in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    })

    const analysisContent = completion.choices[0]?.message?.content

    if (!analysisContent) {
      return NextResponse.json({ error: 'Failed to analyze ATS score' }, { status: 500 })
    }

    let analysis
    try {
      analysis = JSON.parse(analysisContent)
    } catch (error) {
      console.error('Failed to parse ATS analysis JSON:', error)
      return NextResponse.json({ error: 'Failed to parse ATS analysis' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      ...analysis
    })

  } catch (error) {
    console.error('ATS score error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
