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
    const { type, title, source, content: templateContent } = body

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

    let content = templateContent || ''

    // Generate AI content if requested
    if (source === 'ai') {
      try {
        // Get existing CV context for AI generation
        const { data: existingSections } = await supabase
          .from('cv_sections')
          .select('section_type, title, content')
          .eq('cv_id', cvId)

        const cvContext = existingSections?.map(s => ({
          type: s.section_type,
          title: s.title,
          content: s.content?.raw_content || ''
        })) || []

        const prompt = `
Based on the existing CV sections below, generate content for a new "${type}" section titled "${title}".

Existing CV Context:
${cvContext.map(s => `${s.type}: ${s.content.substring(0, 200)}...`).join('\n')}

Instructions:
- Generate realistic, professional content for the "${type}" section
- Keep it relevant to the existing CV context
- Use bullet points for experience, skills, etc.
- Keep it concise but informative
- Format as plain text with line breaks

Generate content for: ${title} (${type})
`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writer. Generate realistic, relevant content for CV sections based on existing context.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        })

        content = completion.choices[0]?.message?.content || ''
      } catch (aiError) {
        console.error('AI generation error:', aiError)
        content = `Add your ${type} details here...`
      }
    } else {
      content = `Add your ${type} details here...`
    }

    // Get next order index
    const { data: maxOrderData } = await supabase
      .from('cv_sections')
      .select('order_index')
      .eq('cv_id', cvId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrderData?.order_index || 0) + 1

    // Insert new section
    const { data: newSection, error: insertError } = await supabase
      .from('cv_sections')
      .insert({
        cv_id: cvId,
        order_index: nextOrder,
        section_type: type,
        title: title,
        content: {
          raw_content: content,
          format: 'text'
        },
        metadata: {
          ai_generated: source === 'ai',
          private: false,
          created_via: 'editor'
        }
      })
      .select()
      .single()

    if (insertError) {
      console.error('Section insert error:', insertError)
      return NextResponse.json({ 
        error: 'Failed to create section',
        details: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      section_id: newSection.id,
      content: content,
      message: `${title} section ${source === 'ai' ? 'generated' : 'created'} successfully`
    })

  } catch (error) {
    console.error('Add section error:', error)
    return NextResponse.json({ 
      error: 'Failed to add section',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
