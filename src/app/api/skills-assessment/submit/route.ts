import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SubmitAnswerRequest, SubmitAnswerResponse } from '@/types/skills-assessment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
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

    const body: SubmitAnswerRequest = await request.json()
    const { assessment_id, question_id, user_answer, time_spent_seconds } = body

    if (!assessment_id || !question_id || !user_answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify assessment belongs to user
    const { data: assessment, error: assessmentError } = await supabase
      .from('skill_assessments')
      .select('user_id, status')
      .eq('id', assessment_id)
      .single()

    if (assessmentError || !assessment || assessment.user_id !== user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.status === 'completed') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('skill_assessment_questions')
      .select('*')
      .eq('id', question_id)
      .eq('assessment_id', assessment_id)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Check if answer is correct
    const isCorrect = checkAnswer(user_answer, question.correct_answer, question.question_type)
    const pointsEarned = isCorrect ? question.points : 0

    // Update assessment status to in_progress if it's draft
    if (assessment.status === 'draft') {
      await supabase
        .from('skill_assessments')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', assessment_id)
    }

    // Save answer
    const { data: answer, error: answerError } = await supabase
      .from('skill_assessment_answers')
      .upsert({
        assessment_id,
        question_id,
        user_answer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_spent_seconds
      }, {
        onConflict: 'assessment_id,question_id'
      })
      .select()
      .single()

    if (answerError) {
      console.error('Error saving answer:', answerError)
      return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
    }

    const response: SubmitAnswerResponse = {
      answer_id: answer.id,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      explanation: question.explanation
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit answer' },
      { status: 500 }
    )
  }
}

function checkAnswer(userAnswer: string, correctAnswer: string, questionType: string): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase()
  const normalizedCorrect = correctAnswer.trim().toLowerCase()

  switch (questionType) {
    case 'multiple_choice':
    case 'true_false':
      return normalizedUser === normalizedCorrect

    case 'short_answer':
      // For short answers, check if key terms are present
      const correctTerms = normalizedCorrect.split(/\s+/)
      const userTerms = normalizedUser.split(/\s+/)
      const matchCount = correctTerms.filter(term => userTerms.includes(term)).length
      return matchCount / correctTerms.length >= 0.7 // 70% match threshold

    case 'code':
      // For code, exact match (could be enhanced with code similarity)
      return normalizedUser === normalizedCorrect

    case 'scenario':
      // For scenarios, check for key concepts
      const keyPhrases = normalizedCorrect.split(',').map(p => p.trim())
      return keyPhrases.some(phrase => normalizedUser.includes(phrase))

    default:
      return normalizedUser === normalizedCorrect
  }
}
