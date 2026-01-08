import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import {
  GenerateAssessmentRequest,
  GenerateAssessmentResponse,
  DifficultyLevel,
  QuestionType,
  SkillCategory,
  AIGeneratedQuestion
} from '@/types/skills-assessment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body: GenerateAssessmentRequest = await request.json()
    const {
      job_role,
      job_description,
      difficulty_level = 'intermediate',
      total_questions = 10,
      time_limit_minutes = 30
    } = body

    if (!job_role) {
      return NextResponse.json({ error: 'Job role is required' }, { status: 400 })
    }

    // Check if user is Pro (optional - can make this feature Pro-only)
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('plan_type')
      .eq('user_id', user.id)
      .single()

    const isPro = usage?.plan_type === 'pro'

    // Limit free users to fewer questions
    const maxQuestions = isPro ? total_questions : Math.min(total_questions, 5)

    console.log(`Generating ${maxQuestions} questions for ${job_role} at ${difficulty_level} level`)

    // Generate questions using OpenAI
    const questions = await generateQuestionsWithAI(
      job_role,
      job_description,
      difficulty_level,
      maxQuestions
    )

    // Create assessment in database
    const { data: assessment, error: assessmentError } = await supabase
      .from('skill_assessments')
      .insert({
        user_id: user.id,
        job_role,
        job_description,
        difficulty_level,
        total_questions: maxQuestions,
        time_limit_minutes,
        status: 'draft'
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError)
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
    }

    // Insert questions into database
    const questionsToInsert = questions.map((q, index) => ({
      assessment_id: assessment.id,
      question_number: index + 1,
      question_type: q.question_type,
      skill_category: q.skill_category,
      question_text: q.question_text,
      options: q.options || null,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points: q.points,
      difficulty: q.difficulty
    }))

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('skill_assessment_questions')
      .insert(questionsToInsert)
      .select()

    if (questionsError) {
      console.error('Error inserting questions:', questionsError)
      return NextResponse.json({ error: 'Failed to create questions' }, { status: 500 })
    }

    // Return response
    const response: GenerateAssessmentResponse = {
      assessment_id: assessment.id,
      questions: insertedQuestions,
      time_limit_minutes,
      total_questions: maxQuestions
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error generating assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate assessment' },
      { status: 500 }
    )
  }
}

async function generateQuestionsWithAI(
  jobRole: string,
  jobDescription: string | undefined,
  difficultyLevel: DifficultyLevel,
  totalQuestions: number
): Promise<AIGeneratedQuestion[]> {
  const prompt = `You are an expert skills assessment creator. Generate ${totalQuestions} high-quality assessment questions for a ${jobRole} position.

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}

Difficulty Level: ${difficultyLevel}

Requirements:
1. Mix of question types: multiple_choice (70%), true_false (20%), scenario (10%)
2. Cover different skill categories: technical (60%), soft_skills (25%), industry_knowledge (15%)
3. Questions should be relevant to ${jobRole}
4. For multiple choice, provide 4 options
5. Include detailed explanations for correct answers
6. Assign points based on difficulty: easy (5), medium (10), hard (15)

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question_type": "multiple_choice",
      "skill_category": "technical",
      "question_text": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option B",
      "explanation": "Detailed explanation...",
      "difficulty": "medium",
      "points": 10
    }
  ]
}

Make questions practical, realistic, and directly relevant to the ${jobRole} role.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating professional skills assessments. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7, // Slightly higher for variety
      max_tokens: 3000
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    const parsed = JSON.parse(content)
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format from OpenAI')
    }

    return parsed.questions as AIGeneratedQuestion[]

  } catch (error: any) {
    console.error('Error generating questions with AI:', error)
    throw new Error(`Failed to generate questions: ${error.message}`)
  }
}

// GET endpoint to retrieve existing assessment
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessment_id')

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 })
    }

    // Get assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('skill_assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_number')

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    return NextResponse.json({
      assessment,
      questions
    })

  } catch (error: any) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}
