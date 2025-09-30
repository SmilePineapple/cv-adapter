import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cv_id } = await request.json()

    if (!cv_id) {
      return NextResponse.json({ error: 'Missing cv_id' }, { status: 400 })
    }

    // Check if rating already exists
    const { data: existingRating } = await supabase
      .from('cv_ratings')
      .select('*')
      .eq('cv_id', cv_id)
      .eq('user_id', user.id)
      .single()

    if (existingRating) {
      // Return existing rating
      return NextResponse.json({
        success: true,
        rating: {
          overall_score: existingRating.overall_score,
          ats_score: existingRating.ats_score,
          summary: existingRating.summary,
          strengths: existingRating.strengths,
          improvements: existingRating.improvements
        },
        cached: true
      })
    }

    // Get CV data
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('original_text, parsed_sections')
      .eq('id', cv_id)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    const sections = cvData.parsed_sections as { sections: any[] }
    const cvText = sections.sections.map(s => `${s.type}: ${s.content}`).join('\n\n')

    // Call OpenAI to rate the CV
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV reviewer and career coach. Analyze CVs and provide constructive feedback with specific, actionable recommendations.'
        },
        {
          role: 'user',
          content: `Please analyze this CV and provide:
1. An overall score out of 100
2. Key strengths (2-3 points)
3. Areas for improvement (3-4 specific, actionable points)
4. ATS compatibility score out of 100
5. One sentence summary

CV Content:
${cvText}

Respond in JSON format:
{
  "overall_score": number,
  "ats_score": number,
  "summary": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string", "string"]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate rating' }, { status: 500 })
    }

    const rating = JSON.parse(aiResponse)

    // Save rating to database
    const { error: saveError } = await supabase
      .from('cv_ratings')
      .insert({
        cv_id,
        user_id: user.id,
        overall_score: rating.overall_score,
        ats_score: rating.ats_score,
        summary: rating.summary,
        strengths: rating.strengths,
        improvements: rating.improvements
      })

    if (saveError) {
      console.error('Failed to save rating:', saveError)
      // Continue anyway, return the rating even if save fails
    }

    return NextResponse.json({
      success: true,
      rating,
      cached: false
    })

  } catch (error) {
    console.error('CV rating error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
