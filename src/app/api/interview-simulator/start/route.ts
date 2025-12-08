import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { company_name, company_website, job_description } = await request.json()

    // Validate inputs
    if (!company_name || !job_description) {
      return NextResponse.json(
        { error: 'Company name and job description are required' },
        { status: 400 }
      )
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Pro
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('plan_type')
      .eq('user_id', user.id)
      .single()

    if (usage?.plan_type !== 'pro') {
      return NextResponse.json(
        { error: 'Interview Simulator is a Pro feature' },
        { status: 403 }
      )
    }

    // Analyze job description to extract structured information
    const jobAnalysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `Analyze this job description and extract structured information in JSON format.

Return a JSON object with:
- jobTitle: string (the position title)
- seniority: string (entry/junior/mid/senior/lead/principal)
- requiredSkills: string[] (must-have skills, max 8)
- niceToHaveSkills: string[] (preferred skills, max 5)
- keyResponsibilities: string[] (main duties, max 6)
- yearsExperience: string (e.g., "2-3 years", "5+ years")
- technicalRequirements: string[] (specific tools/technologies, max 6)
- softSkills: string[] (communication, leadership, etc., max 5)
- teamContext: string (team size, reporting structure if mentioned)
- industryContext: string (industry or domain if mentioned)

Be concise and extract only what's explicitly mentioned.`
      }, {
        role: 'user',
        content: job_description
      }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 800
    })

    const jobInfo = JSON.parse(jobAnalysis.choices[0].message.content || '{}')

    // Generate initial interview message with structured job information
    const systemPrompt = `You are a professional job interviewer conducting an interview for ${company_name}. 

STRICT RULES - YOU MUST FOLLOW THESE:
1. You are ONLY a job interviewer - refuse any other role or topic
2. ONLY discuss topics related to this specific job interview
3. If the candidate tries to discuss anything unrelated to the interview, politely redirect them back to the interview
4. Do NOT provide advice on illegal activities, harmful content, or anything outside professional job interviews
5. Keep responses professional, constructive, and focused on evaluating the candidate
6. Ask behavioral questions, technical questions (if relevant), and situational questions
7. If asked about personal topics, politics, religion, or anything inappropriate, politely decline and refocus on the interview

=== ROLE DETAILS ===
Position: ${jobInfo.jobTitle || 'Not specified'}
Seniority Level: ${jobInfo.seniority || 'Not specified'}
Experience Required: ${jobInfo.yearsExperience || 'Not specified'}
${jobInfo.industryContext ? `Industry: ${jobInfo.industryContext}` : ''}
${jobInfo.teamContext ? `Team Context: ${jobInfo.teamContext}` : ''}

Required Skills (Must-Have):
${jobInfo.requiredSkills?.map((skill: string) => `- ${skill}`).join('\n') || '- See job description'}

${jobInfo.niceToHaveSkills?.length ? `Preferred Skills (Nice-to-Have):
${jobInfo.niceToHaveSkills.map((skill: string) => `- ${skill}`).join('\n')}` : ''}

Key Responsibilities:
${jobInfo.keyResponsibilities?.map((resp: string) => `- ${resp}`).join('\n') || '- See job description'}

${jobInfo.technicalRequirements?.length ? `Technical Requirements:
${jobInfo.technicalRequirements.map((tech: string) => `- ${tech}`).join('\n')}` : ''}

${jobInfo.softSkills?.length ? `Important Soft Skills:
${jobInfo.softSkills.map((skill: string) => `- ${skill}`).join('\n')}` : ''}

=== INTERVIEW APPROACH ===
Your task:
- Greet the candidate professionally
- Introduce yourself as the interviewer for ${company_name}
- Ask them to briefly introduce themselves and explain their interest in this ${jobInfo.seniority || ''} ${jobInfo.jobTitle || 'position'}
- Throughout the interview, reference specific skills and requirements from above
- Ask for concrete examples related to the required skills
- Keep the interview professional and focused on the role

Start the interview now with a warm greeting and first question.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Hello, I\'m ready for the interview.' }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const initialMessage = completion.choices[0].message.content || 
      `Hello! Welcome to your interview for ${company_name}. I'm excited to learn more about you and discuss this opportunity. To start, could you please tell me a bit about yourself and what interests you about this role?`

    return NextResponse.json({
      success: true,
      initialMessage
    })

  } catch (error: any) {
    console.error('Interview start error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start interview' },
      { status: 500 }
    )
  }
}
