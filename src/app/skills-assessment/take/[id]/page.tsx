'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react'
import { AssessmentQuestion } from '@/types/skills-assessment'
import QuestionCard from '@/components/QuestionCard'
import AssessmentTimer from '@/components/AssessmentTimer'
import AssessmentProgress from '@/components/AssessmentProgress'

export default function TakeAssessmentPage() {
  const params = useParams()
  const assessmentId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [assessment, setAssessment] = useState<any>(null)
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  useEffect(() => {
    fetchAssessment()
  }, [assessmentId])

  const fetchAssessment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/skills-assessment/generate?assessment_id=${assessmentId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to fetch assessment' }))
        throw new Error(data.error || 'Failed to fetch assessment')
      }

      const data = await response.json()

      setAssessment(data.assessment)
      setQuestions(data.questions)

      // Load any existing answers
      const { data: existingAnswers } = await supabase
        .from('skill_assessment_answers')
        .select('question_id, user_answer')
        .eq('assessment_id', assessmentId)

      if (existingAnswers) {
        const answersMap: { [key: string]: string } = {}
        existingAnswers.forEach(a => {
          answersMap[a.question_id] = a.user_answer
        })
        setAnswers(answersMap)
      }

    } catch (error: any) {
      console.error('Error fetching assessment:', error)
      toast.error(error.message || 'Failed to load assessment')
      router.push('/skills-assessment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))

    // Auto-save answer
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch('/api/skills-assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          assessment_id: assessmentId,
          question_id: currentQuestion.id,
          user_answer: answer
        })
      })
    } catch (error) {
      console.error('Error saving answer:', error)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleTimeUp = () => {
    toast.error('Time is up! Submitting your assessment...')
    handleSubmit()
  }

  const handleSubmit = async () => {
    const unansweredCount = questions.length - Object.keys(answers).length

    if (unansweredCount > 0 && !showConfirmSubmit) {
      setShowConfirmSubmit(true)
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/skills-assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          assessment_id: assessmentId
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to submit assessment' }))
        throw new Error(data.error || 'Failed to submit assessment')
      }

      const data = await response.json()

      toast.success('Assessment completed!')
      router.push(`/skills-assessment/results/${assessmentId}`)

    } catch (error: any) {
      console.error('Error submitting assessment:', error)
      toast.error(error.message || 'Failed to submit assessment')
    } finally {
      setIsSubmitting(false)
      setShowConfirmSubmit(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Assessment not found</p>
          <Link href="/skills-assessment" className="text-blue-400 hover:text-blue-700">
            Back to Skills Assessment
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Timer */}
      {assessment.status === 'in_progress' && (
        <AssessmentTimer
          timeLimit={assessment.time_limit_minutes}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/skills-assessment"
                className="flex items-center text-gray-400 hover:text-white transition-colors transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Exit
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-black text-white">
                {assessment.job_role}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <AssessmentProgress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          answeredQuestions={answeredCount}
        />

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border-2 border-white/20 text-gray-300 rounded-lg font-semibold hover:border-gray-400 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Assessment
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                Ready to Submit?
              </h2>
              <p className="text-gray-400">
                You've answered {answeredCount} out of {questions.length} questions.
                {answeredCount < questions.length && (
                  <span className="block mt-2 text-orange-400 font-medium">
                    {questions.length - answeredCount} question(s) remain unanswered.
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 border-2 border-white/20 text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-white/5 transition-colors"
              >
                Continue Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
