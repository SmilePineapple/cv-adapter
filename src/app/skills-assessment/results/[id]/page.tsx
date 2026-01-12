'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  Target, 
  BookOpen,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { AssessmentResult } from '@/types/skills-assessment'
import SkillGapChart from '@/components/SkillGapChart'
import LearningResourceCard from '@/components/LearningResourceCard'

export default function AssessmentResultsPage() {
  const params = useParams()
  const assessmentId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [assessment, setAssessment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [assessmentId])

  const fetchResults = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Fetch result
      const { data: resultData, error: resultError } = await supabase
        .from('skill_assessment_results')
        .select('*')
        .eq('assessment_id', assessmentId)
        .single()

      if (resultError) throw resultError

      // Fetch assessment details
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single()

      if (assessmentError) throw assessmentError

      setResult(resultData)
      setAssessment(assessmentData)

    } catch (error: any) {
      console.error('Error fetching results:', error)
      toast.error('Failed to load results')
      router.push('/skills-assessment')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200'
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return '🎉 Outstanding! You\'re highly proficient!'
    if (percentage >= 80) return '✨ Excellent work! You\'re well-prepared!'
    if (percentage >= 70) return '👍 Good job! Some areas to improve.'
    if (percentage >= 60) return '📚 Fair performance. Focus on weak areas.'
    return '💪 Keep learning! Lots of room for growth.'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result || !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Results not found</p>
          <Link href="/skills-assessment" className="text-blue-600 hover:text-blue-700">
            Back to Skills Assessment
          </Link>
        </div>
      </div>
    )
  }

  const selectedSkillGap = selectedSkill 
    ? result.skill_gaps.find(g => g.skill === selectedSkill)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/skills-assessment"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Assessments
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied!')
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl border-2 p-8 mb-8 ${getScoreBg(result.percentage_score)}`}>
          <div className="text-center mb-6">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(result.percentage_score)}`} />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Assessment Complete!
            </h1>
            <p className="text-lg text-gray-700">
              {assessment.job_role}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.percentage_score)}`}>
                {result.percentage_score.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {result.questions_correct} / {result.questions_total} correct
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Time Taken</p>
              <p className="text-4xl font-bold text-blue-600">
                {result.time_taken_minutes || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">minutes</p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Skill Gaps</p>
              <p className="text-4xl font-bold text-purple-600">
                {result.skill_gaps.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">areas to improve</p>
            </div>
          </div>

          <p className="text-center text-lg font-medium text-gray-700">
            {getScoreMessage(result.percentage_score)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Skill Breakdown</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(result.skill_breakdown).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category.replace('_', ' ')}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          (score as number) >= 80 ? 'bg-green-500' :
                          (score as number) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions & Answers Review */}
            {questions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Question Review</h2>
                </div>
                <div className="space-y-6">
                  {questions.map((question) => {
                    const userAnswer = answers.find(a => a.question_id === question.id)
                    
                    return (
                      <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            userAnswer?.is_correct
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {question.question_number}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-3">{question.question_text}</p>
                            <div className="space-y-2">
                              {question.options.map((option: string, optIdx: number) => {
                                const isUserAnswer = userAnswer?.selected_option === optIdx
                                const isCorrectAnswer = question.correct_option_index === optIdx
                                
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-3 rounded-lg border-2 ${
                                      isUserAnswer
                                        ? userAnswer.is_correct
                                          ? 'bg-green-50 border-green-500'
                                          : 'bg-red-50 border-red-500'
                                        : isCorrectAnswer
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700">{option}</span>
                                      {isUserAnswer && (
                                        <span className={`text-xs font-semibold ${
                                          userAnswer.is_correct ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {userAnswer.is_correct ? '✓ Your Answer' : '✗ Your Answer'}
                                        </span>
                                      )}
                                      {!userAnswer?.is_correct && isCorrectAnswer && (
                                        <span className="text-xs text-green-600 font-semibold">✓ Correct Answer</span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">Areas to Improve</h3>
                </div>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 mt-0.5">→</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skill Gaps */}
            {result.skill_gaps.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Skill Gaps</h2>
                </div>
                <SkillGapChart 
                  skillGaps={result.skill_gaps}
                  onSkillClick={setSelectedSkill}
                />
              </div>
            )}

            {/* Learning Resources for Selected Skill */}
            {selectedSkillGap && selectedSkillGap.resources && selectedSkillGap.resources.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Resources for {selectedSkill}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedSkillGap.resources.map((resource, idx) => (
                    <LearningResourceCard key={idx} resource={resource} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📋 Recommendations
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 font-bold mt-0.5">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <Link
                  href="/skills-assessment"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Take Another Assessment
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
