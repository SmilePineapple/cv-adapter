import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

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

    const sections = generation.output_sections.sections
    const jobDescription = generation.job_description
    const jobTitle = generation.job_title
    const currentAtsScore = generation.ats_score || 0

    console.log(`🔧 Optimizing generation ${generation_id} (Current ATS: ${currentAtsScore}%)`)

    // Comprehensive AI prompt for optimization
    const prompt = `You are an expert CV optimizer and ATS specialist. Analyze and optimize this CV for a ${jobTitle} position.

CURRENT ATS SCORE: ${currentAtsScore}%
TARGET: 85%+ ATS score

JOB DESCRIPTION:
${jobDescription}

CURRENT CV SECTIONS:
${sections.map(s => `${s.type.toUpperCase()}:\n${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n')}

OPTIMIZATION TASKS:
1. **ATS OPTIMIZATION**
   - Add missing keywords from job description
   - Improve keyword density (aim for 2-3% for key terms)
   - Use exact job title variations from description
   - Include industry-standard terminology
   - Add relevant technical skills mentioned in job posting

2. **CONTENT IMPROVEMENT**
   - Expand thin sections (add 2-3 more bullet points where needed)
   - Quantify achievements (add numbers, percentages, timeframes)
   - Strengthen action verbs (Led → Spearheaded, Managed → Orchestrated)
   - Add context (team size, budget, impact, scale)
   - Remove generic statements, add specific examples

3. **STRUCTURE OPTIMIZATION**
   - Ensure professional summary includes 3-4 key skills from job description
   - Categorize skills (Technical, Soft Skills, Tools/Platforms)
   - Format work experience with clear job title | company | dates
   - Add missing sections if beneficial (Certifications, Projects, etc.)

4. **FORMATTING FIXES**
   - Consistent date formats
   - Proper capitalization
   - Remove redundant information
   - Improve readability

Return the COMPLETE optimized CV in the EXACT same JSON structure:
{
  "sections": [
    {
      "type": "section_type",
      "content": "optimized content or structured object"
    }
  ],
  "improvements_made": ["list of specific improvements"],
  "estimated_ats_score": number (your estimate of new ATS score),
  "optimization_summary": "brief summary of changes"
}

CRITICAL: Maintain the exact same section types and structure. Only improve the content.`

    console.log('🤖 Calling OpenAI for comprehensive optimization...')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV optimizer specializing in ATS optimization and content improvement. Return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate optimization' }, { status: 500 })
    }

    const optimizedData = JSON.parse(aiResponse)
    console.log(`✅ Optimization complete. Estimated new ATS: ${optimizedData.estimated_ats_score}%`)

    // Update generation with optimized content
    const { error: updateError } = await supabase
      .from('generations')
      .update({
        output_sections: { sections: optimizedData.sections },
        ats_score: optimizedData.estimated_ats_score,
        updated_at: new Date().toISOString()
      })
      .eq('id', generation_id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save optimization' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sections: optimizedData.sections,
      improvements_made: optimizedData.improvements_made,
      old_ats_score: currentAtsScore,
      new_ats_score: optimizedData.estimated_ats_score,
      optimization_summary: optimizedData.optimization_summary
    })

  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
