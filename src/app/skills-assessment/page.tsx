'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft, Sparkles, Target, TrendingUp, Award, Zap } from 'lucide-react'
import { DifficultyLevel } from '@/types/skills-assessment'

export default function SkillsAssessmentPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [jobRole, setJobRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('intermediate')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    checkProStatus()
  }, [])

  const checkProStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('plan_type')
        .eq('user_id', user.id)
        .single()

      setIsPro(usage?.plan_type === 'pro')
    } catch (error) {
      console.error('Error checking pro status:', error)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!jobRole.trim()) {
      toast.error('Please enter a job role')
      return
    }

    setIsGenerating(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to continue')
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/skills-assessment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          job_role: jobRole,
          job_description: jobDescription || undefined,
          difficulty_level: difficultyLevel,
          total_questions: totalQuestions
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate assessment')
      }

      toast.success('Assessment generated successfully!')
      router.push(`/skills-assessment/take/${data.assessment_id}`)

    } catch (error: any) {
      console.error('Error generating assessment:', error)
      toast.error(error.message || 'Failed to generate assessment')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Skills Assessment
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Target className="w-4 h-4" />
            AI-Powered Skills Testing
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Test Your Skills & Identify Gaps
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized skill assessments tailored to your target role. Receive detailed feedback, gap analysis, and learning recommendations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Role-Specific</h3>
            <p className="text-sm text-gray-600">Questions tailored to your target job</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Gap Analysis</h3>
            <p className="text-sm text-gray-600">Identify areas for improvement</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant Feedback</h3>
            <p className="text-sm text-gray-600">Detailed explanations for each question</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Learning Path</h3>
            <p className="text-sm text-gray-600">Personalized resource recommendations</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Job Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The role you're preparing for or want to assess
              </p>
            </div>

            {/* Job Description (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Job Description (Optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to get more targeted questions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Adding a job description makes questions more specific
              </p>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyLevel(level)}
                    className={`
                      px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all
                      ${difficultyLevel === level 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Number of Questions: {totalQuestions}
                {!isPro && totalQuestions > 5 && (
                  <span className="ml-2 text-xs text-orange-600 font-normal">
                    (Free users limited to 5)
                  </span>
                )}
              </label>
              <input
                type="range"
                min="5"
                max={isPro ? "20" : "5"}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 questions</span>
                <span>{isPro ? '20 questions' : '5 questions (Pro: up to 20)'}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Assessment...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Skills Assessment
                </>
              )}
            </button>

            {!isPro && (
              <div className="text-center">
                <Link 
                  href="/subscription"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upgrade to Pro for unlimited questions and advanced features →
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enter Details</h3>
              <p className="text-sm text-gray-600">Specify your target role and preferences</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Take Test</h3>
              <p className="text-sm text-gray-600">Answer AI-generated questions</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
              <p className="text-sm text-gray-600">Instant scoring and feedback</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Improve</h3>
              <p className="text-sm text-gray-600">Follow personalized learning path</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
