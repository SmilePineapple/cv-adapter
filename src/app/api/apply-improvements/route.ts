import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'
import { CVSection } from '@/types/database'
import { calculateATSScore } from '@/lib/ats-calculator'

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

    const { generation_id, improvements, missing_sections, keywords, formatting_tips } = await request.json()

    // Check user's plan type
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('plan_type')
      .eq('user_id', user.id)
      .single()

    // Only check free improvement usage for free users
    if (usage?.plan_type === 'free') {
      const { data: existingImprovement } = await supabase
        .from('ai_improvements')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingImprovement) {
        return NextResponse.json({ 
          error: 'You have already used your free AI improvement. Upgrade to Pro for unlimited improvements!' 
        }, { status: 403 })
      }
    }
    // Pro users have unlimited improvements - no check needed

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

    // AI Improvement Prompt
    const prompt = `You are an expert CV writer. Apply these specific improvements to the CV:

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}

CURRENT CV SECTIONS:
${sections.map(s => `${s.type.toUpperCase()}:\n${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n')}

IMPROVEMENTS TO APPLY:
${improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join('\n')}

MISSING SECTIONS TO ADD:
${missing_sections.map((sec: string) => `- ${sec}`).join('\n')}

KEYWORDS TO EMPHASIZE:
${keywords.join(', ')}

FORMATTING TIPS:
${formatting_tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}

INSTRUCTIONS:
1. Apply ALL the improvements listed above
2. Add the missing sections with relevant content based on existing CV
3. Emphasize the keywords naturally throughout the CV
4. Apply the formatting tips
5. Keep all personal details, job titles, and company names unchanged
6. Maintain truthfulness - don't invent fake information

Return the improved CV sections in this JSON format:
{
  "sections": [
    {
      "type": "section_name",
      "content": "section content"
    }
  ],
  "changes_summary": "Brief summary of what was improved"
}`

    console.log('🔧 AI applying improvements...')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV writer. Apply specific improvements to CVs while maintaining truthfulness and professionalism.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to apply improvements' }, { status: 500 })
    }

    const result = JSON.parse(aiResponse)
    console.log('✅ Improvements applied')

    // Recalculate ATS score with improved sections
    const newAtsScore = calculateATSScore(result.sections, jobDescription)
    const oldAtsScore = generation.ats_score || 0
    const scoreImprovement = newAtsScore - oldAtsScore
    
    console.log(`📊 ATS Score updated: ${oldAtsScore}% → ${newAtsScore}% (${scoreImprovement > 0 ? '+' : ''}${scoreImprovement}%)`)

    // Update generation with improved sections AND new ATS score
    const { error: updateError } = await supabase
      .from('generations')
      .update({
        output_sections: { sections: result.sections },
        ats_score: newAtsScore
      })
      .eq('id', generation_id)

    if (updateError) {
      console.error('Failed to update generation:', updateError)
      return NextResponse.json({ error: 'Failed to save improvements' }, { status: 500 })
    }

    // Track that free user has used their free improvement (Pro users don't need tracking)
    if (usage?.plan_type === 'free') {
      await supabase
        .from('ai_improvements')
        .insert({
          user_id: user.id,
          generation_id,
          improvements_applied: improvements,
          missing_sections_added: missing_sections,
          keywords_added: keywords
        })
    }

    return NextResponse.json({
      success: true,
      sections: result.sections,
      changes_summary: result.changes_summary,
      ats_score: {
        before: oldAtsScore,
        after: newAtsScore,
        improvement: scoreImprovement
      }
    })

  } catch (error) {
    console.error('Apply improvements error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
