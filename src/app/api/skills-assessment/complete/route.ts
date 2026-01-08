import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { CompleteAssessmentRequest, CompleteAssessmentResponse, AISkillGapAnalysis } from '@/types/skills-assessment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

    const body: CompleteAssessmentRequest = await request.json()
    const { assessment_id } = body

    if (!assessment_id) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 })
    }

    // Verify assessment belongs to user
    const { data: assessment, error: assessmentError } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('id', assessment_id)
      .eq('user_id', user.id)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.status === 'completed') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    // Calculate score using database function
    const { data: scoreData, error: scoreError } = await supabase
      .rpc('calculate_assessment_score', { assessment_uuid: assessment_id })

    if (scoreError || !scoreData || scoreData.length === 0) {
      console.error('Error calculating score:', scoreError)
      return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 })
    }

    const score = scoreData[0]

    // Get all questions and answers for analysis
    const { data: questions } = await supabase
      .from('skill_assessment_questions')
      .select('*')
      .eq('assessment_id', assessment_id)
      .order('question_number')

    const { data: answers } = await supabase
      .from('skill_assessment_answers')
      .select('*')
      .eq('assessment_id', assessment_id)

    // Calculate skill breakdown by category
    const skillBreakdown: { [key: string]: number } = {}
    const categoryScores: { [key: string]: { correct: number, total: number } } = {}

    questions?.forEach(q => {
      const answer = answers?.find(a => a.question_id === q.id)
      if (!categoryScores[q.skill_category]) {
        categoryScores[q.skill_category] = { correct: 0, total: 0 }
      }
      categoryScores[q.skill_category].total++
      if (answer?.is_correct) {
        categoryScores[q.skill_category].correct++
      }
    })

    Object.keys(categoryScores).forEach(category => {
      const { correct, total } = categoryScores[category]
      skillBreakdown[category] = Math.round((correct / total) * 100)
    })

    // Generate AI analysis for strengths, weaknesses, and recommendations
    const aiAnalysis = await generateSkillGapAnalysis(
      assessment.job_role,
      assessment.job_description,
      questions || [],
      answers || [],
      skillBreakdown,
      score.percentage_score
    )

    // Calculate time taken
    const startedAt = new Date(assessment.started_at || assessment.created_at)
    const completedAt = new Date()
    const timeTakenMinutes = Math.round((completedAt.getTime() - startedAt.getTime()) / 60000)

    // Create result record
    const { data: result, error: resultError } = await supabase
      .from('skill_assessment_results')
      .insert({
        assessment_id,
        user_id: user.id,
        total_score: score.total_score,
        max_score: score.max_score,
        percentage_score: score.percentage_score,
        time_taken_minutes: timeTakenMinutes,
        questions_correct: score.questions_correct,
        questions_total: score.questions_total,
        skill_breakdown: skillBreakdown,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        skill_gaps: aiAnalysis.skill_gaps,
        recommendations: aiAnalysis.recommendations
      })
      .select()
      .single()

    if (resultError) {
      console.error('Error creating result:', resultError)
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    // Update assessment status
    await supabase
      .from('skill_assessments')
      .update({ 
        status: 'completed',
        completed_at: completedAt.toISOString()
      })
      .eq('id', assessment_id)

    // Get learning resources for skill gaps
    const skillGapsWithResources = await Promise.all(
      aiAnalysis.skill_gaps.map(async (gap) => {
        const { data: resources } = await supabase
          .from('skill_learning_resources')
          .select('*')
          .ilike('skill_name', `%${gap.skill}%`)
          .limit(3)

        return {
          ...gap,
          resources: resources || []
        }
      })
    )

    result.skill_gaps = skillGapsWithResources

    const response: CompleteAssessmentResponse = {
      result,
      next_steps: [
        'Review your skill gaps and prioritize high-priority areas',
        'Explore recommended learning resources',
        'Practice weak areas with additional assessments',
        'Update your CV to highlight your strengths',
        'Consider certifications for key skill gaps'
      ]
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error completing assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete assessment' },
      { status: 500 }
    )
  }
}

async function generateSkillGapAnalysis(
  jobRole: string,
  jobDescription: string | undefined,
  questions: any[],
  answers: any[],
  skillBreakdown: { [key: string]: number },
  overallScore: number
): Promise<AISkillGapAnalysis> {
  const incorrectQuestions = questions.filter(q => {
    const answer = answers.find(a => a.question_id === q.id)
    return !answer?.is_correct
  })

  const prompt = `You are a career development expert. Analyze this skills assessment result and provide actionable insights.

Job Role: ${jobRole}
${jobDescription ? `Job Description: ${jobDescription}\n` : ''}
Overall Score: ${overallScore.toFixed(1)}%

Skill Breakdown:
${Object.entries(skillBreakdown).map(([cat, score]) => `- ${cat}: ${score}%`).join('\n')}

Areas where candidate struggled:
${incorrectQuestions.slice(0, 5).map(q => `- ${q.skill_category}: ${q.question_text.substring(0, 100)}...`).join('\n')}

Provide analysis in JSON format:
{
  "strengths": ["List 3-5 key strengths based on high-scoring areas"],
  "weaknesses": ["List 3-5 areas needing improvement"],
  "skill_gaps": [
    {
      "skill": "Specific skill name",
      "current_level": 60,
      "target_level": 85,
      "priority": "high|medium|low"
    }
  ],
  "recommendations": ["List 5-7 specific, actionable recommendations for improvement"]
}

Be specific, actionable, and encouraging. Focus on practical next steps.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: 'You are a career development expert providing constructive feedback. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    return JSON.parse(content) as AISkillGapAnalysis

  } catch (error: any) {
    console.error('Error generating AI analysis:', error)
    // Return fallback analysis
    return {
      strengths: ['Completed the assessment', 'Demonstrated commitment to learning'],
      weaknesses: ['Areas identified for improvement'],
      skill_gaps: [],
      recommendations: [
        'Review incorrect answers carefully',
        'Practice in weak areas',
        'Consider additional training',
        'Seek mentorship opportunities',
        'Apply skills in real projects'
      ]
    }
  }
}
