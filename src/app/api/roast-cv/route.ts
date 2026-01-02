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

    // Check if user is Pro
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('plan_type, subscription_tier')
      .eq('user_id', user.id)
      .single()

    const isPro = usage?.plan_type === 'pro' || 
                  usage?.subscription_tier === 'pro_monthly' || 
                  usage?.subscription_tier === 'pro_annual'

    if (!isPro) {
      return NextResponse.json({ 
        error: 'Roast Your CV is a Pro feature',
        requiresUpgrade: true
      }, { status: 403 })
    }

    const { itemId, itemType, roastLevel, roastStyle } = await request.json()

    if (!itemId || !itemType) {
      return NextResponse.json({ error: 'Item ID and type are required' }, { status: 400 })
    }

    let cvContent: any
    let fileName: string

    // Get CV data based on type
    if (itemType === 'uploaded') {
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .select('parsed_content, file_meta')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single()

      if (cvError || !cvData) {
        return NextResponse.json({ error: 'CV not found' }, { status: 404 })
      }

      cvContent = cvData.parsed_content
      fileName = cvData.file_meta?.original_name || 'Unknown'
    } else if (itemType === 'generated') {
      const { data: genData, error: genError } = await supabase
        .from('generations')
        .select('output_sections, job_title')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single()

      if (genError || !genData) {
        return NextResponse.json({ error: 'Generated CV not found' }, { status: 404 })
      }

      cvContent = genData.output_sections
      fileName = `Generated CV - ${genData.job_title || 'Untitled'}`
    } else {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 })
    }

    // Build roast prompt based on settings
    const levelPrompts: Record<string, string> = {
      mild: 'Be gentle and constructive. Point out issues with humor but always offer helpful suggestions. Keep it light and encouraging.',
      medium: 'Be honest and funny. Point out obvious issues with wit and humor. Balance criticism with actionable advice. Make them laugh while learning.',
      brutal: 'Hold nothing back! Be brutally honest and savage. Roast every weak point mercilessly. Use sharp wit and cutting humor. No sugar-coating!'
    }

    const stylePrompts: Record<string, string> = {
      funny: 'Use comedic timing, puns, and playful jokes. Make it entertaining and laugh-out-loud funny.',
      sarcastic: 'Use heavy sarcasm and irony. Be witty and cutting with your observations.',
      professional: 'Maintain a professional tone but with dry humor. Be like a disappointed career advisor who cares but is exasperated.',
      savage: 'Be absolutely savage. Use roast comedy style. No holds barred. Make it hurt (but in a funny way).'
    }

    const systemPrompt = `You are a hilarious CV roaster with years of recruitment experience. Your job is to roast CVs with humor while providing genuine insights.

Roast Level: ${roastLevel.toUpperCase()}
${levelPrompts[roastLevel] || levelPrompts.medium}

Roast Style: ${roastStyle.toUpperCase()}
${stylePrompts[roastStyle] || stylePrompts.funny}

Focus on:
- Clichés and buzzwords ("team player", "hard worker", "go-getter")
- Vague or generic descriptions
- Poor formatting or structure issues
- Obvious gaps or inconsistencies
- Overly long or overly short sections
- Lack of quantifiable achievements
- Spelling or grammar mistakes
- Outdated information
- Irrelevant details

Format your roast as a cohesive, entertaining commentary. Use emojis sparingly for emphasis. Make it feel like a stand-up comedy routine about their CV.

End with 2-3 actual helpful tips for improvement (even in brutal mode, give them something useful).`

    const userPrompt = `Roast this CV:

${JSON.stringify(cvContent, null, 2)}

File name: ${fileName}

Give me your best roast!`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.9, // High creativity for humor
      max_tokens: 1500
    })

    const roast = completion.choices[0]?.message?.content || 'Failed to generate roast. Even AI is speechless at this CV! 😅'

    return NextResponse.json({
      roast,
      message: 'CV roasted successfully'
    })

  } catch (error: any) {
    console.error('Roast CV error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}
