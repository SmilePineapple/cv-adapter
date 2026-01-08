import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { CVSection } from '@/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generation_id } = await request.json()

    // Fetch generation data
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select('*, cvs!inner(parsed_sections)')
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const sections: CVSection[] = generation.output_sections.sections
    const jobDescription = generation.job_description
    const jobTitle = generation.job_title

    // AI Review Prompt
    const prompt = `You are an expert CV reviewer and career coach. Review this CV for a ${jobTitle} position and provide actionable feedback.

JOB DESCRIPTION:
${jobDescription}

CURRENT CV SECTIONS:
${sections.map(s => `${s.type.toUpperCase()}:\n${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n')}

Provide a comprehensive review with:

1. OVERALL ASSESSMENT (1-2 sentences on CV quality)

2. STRENGTHS (3-4 bullet points of what's working well)

3. AREAS FOR IMPROVEMENT (4-5 specific, actionable suggestions)

4. MISSING SECTIONS (List any sections that should be added based on the job description)

5. KEYWORD OPTIMIZATION (3-5 keywords from the job description that should be emphasized more)

6. FORMATTING SUGGESTIONS (2-3 tips for better structure/readability)

Format your response as JSON:
{
  "overall_assessment": "string",
  "strengths": ["string", "string", ...],
  "improvements": ["string", "string", ...],
  "missing_sections": ["string", "string", ...],
  "keywords_to_add": ["string", "string", ...],
  "formatting_tips": ["string", "string", ...]
}

Be specific, actionable, and encouraging. Focus on how to better match the job requirements.`

    console.log('🔍 AI reviewing CV...')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV reviewer and career coach. Provide specific, actionable feedback in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate review' }, { status: 500 })
    }

    const review = JSON.parse(aiResponse)
    console.log('✅ AI review complete')

    return NextResponse.json({
      success: true,
      review
    })

  } catch (error) {
    console.error('CV review error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
