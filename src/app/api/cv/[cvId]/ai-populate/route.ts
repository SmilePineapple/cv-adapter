import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { cvId } = await params

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        auth_error: authError?.message 
      }, { status: 401 })
    }

    const body = await request.json()
    const { section_id, section_type, section_title, style, existing_content } = body

    // Verify CV ownership
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('id, user_id')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Get all existing sections for context
    const { data: allSections } = await supabase
      .from('cv_sections')
      .select('section_type, title, content')
      .eq('cv_id', cvId)
      .neq('id', section_id) // Exclude the current section

    const cvContext = allSections?.map(s => ({
      type: s.section_type,
      title: s.title,
      content: s.content?.raw_content || ''
    })) || []

    // Create context-aware prompt
    const contextText = cvContext
      .filter(s => s.content.length > 10) // Only include sections with meaningful content
      .map(s => `${s.type}: ${s.content.substring(0, 300)}...`)
      .join('\n\n')

    // Style-specific instructions
    const styleInstructions = {
      compact: 'Keep content very concise (2-3 bullet points max). Focus on key achievements only.',
      detailed: 'Provide comprehensive content (5-7 bullet points). Include specific details, metrics, and examples.',
      professional: 'Use formal, corporate language. Focus on achievements, metrics, and business impact.',
      friendly: 'Use approachable, warm language while maintaining professionalism. Show personality.',
      expand: existing_content ? 'Add 2-3 more bullet points to the existing content below. Build upon what\'s already there.' : 'Create comprehensive content with multiple detailed points.',
      improve: existing_content ? 'Improve and enhance the existing content below. Make it more impactful and professional.' : 'Create high-quality, impactful content.'
    }

    const basePrompt = `
You are a professional CV writer. Based on the existing CV content below, generate realistic and relevant content for a "${section_type}" section titled "${section_title}".

EXISTING CV CONTEXT:
${contextText}

${existing_content ? `CURRENT SECTION CONTENT:\n${existing_content}\n` : ''}

STYLE: ${style?.toUpperCase() || 'STANDARD'}
STYLE INSTRUCTIONS: ${styleInstructions[style as keyof typeof styleInstructions] || 'Generate professional, balanced content.'}

GENERAL INSTRUCTIONS:
- Generate content that fits naturally with the existing CV
- For experience sections: Use bullet points with action verbs and quantifiable achievements
- For skills sections: List relevant technical and soft skills
- For education: Include institution, degree, dates, and relevant details
- For projects: Include project name, technologies, and outcomes
- Use line breaks to separate different items
- Make it realistic and professional
- ${style === 'expand' || style === 'improve' ? 'Work with the existing content provided above.' : 'Create new content from scratch.'}

Generate content for: ${section_title} (${section_type} section)
`

    const prompt = basePrompt

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV writer who creates compelling, realistic content that matches the candidate\'s existing experience and maintains consistency across all sections.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
    }

    // Update the section in the database
    const { error: updateError } = await supabase
      .from('cv_sections')
      .update({
        content: {
          raw_content: generatedContent,
          format: 'text'
        },
        metadata: {
          ai_generated: true,
          private: false,
          last_ai_update: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', section_id)
      .eq('cv_id', cvId)

    if (updateError) {
      console.error('Section update error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update section',
        details: updateError.message 
      }, { status: 500 })
    }

    // Track AI usage
    try {
      await supabase
        .from('ai_usage_tracking')
        .upsert({
          user_id: user.id,
          feature_type: 'section_populate',
          usage_date: new Date().toISOString().split('T')[0],
          usage_count: 1
        }, {
          onConflict: 'user_id,feature_type,usage_date',
          ignoreDuplicates: false
        })
        .select()
    } catch (trackingError) {
      console.error('Usage tracking error:', trackingError)
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ 
      success: true,
      content: generatedContent,
      message: 'Section populated with AI content successfully'
    })

  } catch (error) {
    console.error('AI populate error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate AI content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
