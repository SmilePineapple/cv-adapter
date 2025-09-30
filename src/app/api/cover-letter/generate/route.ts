import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }

    // Use the route client for authentication
    const supabase = createSupabaseRouteClient()
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'Your session has expired. Please log in again.' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { 
      cvId, 
      jobTitle, 
      companyName, 
      hiringManagerName, 
      jobDescription, 
      length = 'short', 
      tone = 'professional' 
    } = body

    if (!cvId || !jobTitle || !companyName) {
      return NextResponse.json({ 
        error: 'Missing required fields: cvId, jobTitle, companyName' 
      }, { status: 400 })
    }

    // Fetch the CV data
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Fetch CV sections for more detailed content
    const { data: sectionsData } = await supabase
      .from('cv_sections')
      .select('*')
      .eq('cv_id', cvId)
      .order('order_index')

    // Prepare CV content for AI
    let cvContent = ''
    if (cvData.parsed_content) {
      cvContent = typeof cvData.parsed_content === 'string' 
        ? cvData.parsed_content 
        : JSON.stringify(cvData.parsed_content)
    }

    // Add sections content if available
    if (sectionsData && sectionsData.length > 0) {
      cvContent += '\n\nCV Sections:\n'
      sectionsData.forEach(section => {
        cvContent += `\n${section.section_type}: ${section.raw_content || section.content}\n`
      })
    }

    // Extract user's name from CV content
    let userName = '[Your Name]'
    const nameMatch = cvContent.match(/name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i)
    if (nameMatch) {
      userName = nameMatch[1].trim()
    } else {
      // Try to find name in contact section
      const contactMatch = cvContent.match(/contact[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i)
      if (contactMatch) {
        userName = contactMatch[1].trim()
      }
    }

    // Create the AI prompt
    const lengthInstruction = length === 'long' 
      ? 'Write a comprehensive 2-3 paragraph cover letter'
      : 'Write a concise 1 paragraph cover letter'

    const toneInstructions: Record<string, string> = {
      professional: 'Use a professional and confident tone',
      friendly: 'Use a warm and approachable tone while maintaining professionalism',
      enthusiastic: 'Use an enthusiastic and energetic tone showing genuine excitement',
      formal: 'Use a formal and traditional business tone'
    }
    const toneInstruction = toneInstructions[tone] || toneInstructions.professional

    const hiringManagerGreeting = hiringManagerName 
      ? `Dear ${hiringManagerName},`
      : 'Dear Hiring Manager,'

    const prompt = `You are an expert cover letter writer. Based STRICTLY on the CV content provided, write a personalized cover letter for the following job application.

Job Details:
- Position: ${jobTitle}
- Company: ${companyName}
- Hiring Manager: ${hiringManagerName || 'Not specified'}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

CV Content:
${cvContent}

CRITICAL INSTRUCTIONS:
- ${lengthInstruction}
- ${toneInstruction}
- Start with "${hiringManagerGreeting}"
- ONLY use information, experience, and skills that are EXPLICITLY mentioned in the CV above
- DO NOT invent, assume, or fabricate any achievements, statistics, or experiences not in the CV
- DO NOT mention specific metrics (like "30% increase") unless they are explicitly stated in the CV
- If the CV doesn't mention experience in the exact field, focus on transferable skills
- Highlight the most relevant experience and skills from the CV that match the job requirements
- Show genuine interest in the company and position
- End with "Sincerely," followed by "${userName}" on the next line
- Make it specific to this role and company, not generic
- Be honest about the candidate's actual experience level

${jobDescription ? 'Tailor the content specifically to the job requirements mentioned in the job description, but ONLY using what is actually in the CV.' : ''}

Write only the cover letter content, no additional commentary.`

    // Generate cover letter with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer who creates personalized, compelling cover letters based STRICTLY on the candidate\'s actual CV content. You NEVER invent or fabricate experiences, achievements, or statistics. You only use information explicitly stated in the CV provided. If the CV lacks specific experience, you focus on transferable skills and genuine enthusiasm for the role.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: length === 'long' ? 800 : 400,
      temperature: 0.7
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
    }

    // Save the cover letter to the database
    const { data: coverLetterData, error: insertError } = await supabase
      .from('cover_letters')
      .insert({
        user_id: user.id,
        content: generatedContent,
        company_name: companyName,
        job_title: jobTitle,
        length,
        tone,
        hiring_manager_name: hiringManagerName || null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving cover letter:', insertError)
      return NextResponse.json({ error: 'Failed to save cover letter' }, { status: 500 })
    }

    // Track AI usage
    const today = new Date().toISOString().split('T')[0]
    await supabase
      .from('ai_usage_tracking')
      .upsert({
        user_id: user.id,
        feature_type: 'cover_letter_generation',
        usage_date: today,
        usage_count: 1
      }, {
        onConflict: 'user_id,feature_type,usage_date',
        ignoreDuplicates: false
      })

    return NextResponse.json({
      id: coverLetterData.id,
      content: generatedContent,
      message: 'Cover letter generated successfully'
    })

  } catch (error: any) {
    console.error('Cover letter generation error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
