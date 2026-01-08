import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 500 })
    }

    const supabase = createSupabaseRouteClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cvData, currentRole } = await request.json()

    // Generate career path analysis using AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert career advisor. Analyze the user's CV and current role to provide:
1. 3-5 potential next career steps
2. Estimated timeline for each step
3. Salary progression expectations
4. Skills gap analysis with current vs required proficiency levels

Provide practical, realistic advice based on industry standards.`
        },
        {
          role: 'user',
          content: `Current Role: ${currentRole}
          
CV Data: ${JSON.stringify(cvData)}

Please analyze my career path and provide:
1. Next potential roles (3-5 options)
2. Timeline to reach each role
3. Expected salary progression
4. Skills I need to develop (with current level 0-100% and required level 0-100%)`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    })

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

    // Structure the response
    const careerPath = {
      currentRole: currentRole,
      nextRoles: analysis.nextRoles || [],
      timeline: analysis.timeline || '2-5 years',
      salaryProgression: analysis.salaryProgression || 'Potential 20-40% increase'
    }

    const skillsGap = analysis.skillsGap || []

    return NextResponse.json({
      careerPath,
      skillsGap,
      message: 'Career path analyzed successfully'
    })

  } catch (error: unknown) {
    console.error('Career analysis error:', error)
    return NextResponse.json({ 
      error: (error as Error).message || 'Internal server error'
    }, { status: 500 })
  }
}
