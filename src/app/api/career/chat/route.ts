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

    const { message, conversationHistory } = await request.json()

    // Get user's CV data for context
    const { data: cvData } = await supabase
      .from('cvs')
      .select('parsed_content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: generations } = await supabase
      .from('generations')
      .select('job_title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Build conversation messages
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an expert career coach and advisor. You provide personalized, actionable career advice.

User Context:
- Current/Target Role: ${generations?.job_title || 'Professional'}
- CV Summary: ${cvData?.parsed_content ? JSON.stringify(cvData.parsed_content).substring(0, 500) : 'Not available'}

Provide helpful, specific advice on:
- Career development and progression
- Skills to learn and develop
- Job search strategies
- Interview preparation
- Salary negotiation
- Work-life balance
- Networking tips
- Industry insights

Be encouraging, practical, and specific. Use examples when helpful.`
      }
    ]

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    return NextResponse.json({
      response,
      message: 'Response generated successfully'
    })

  } catch (error: any) {
    console.error('Career chat error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}
