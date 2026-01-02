'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Briefcase, 
  Building2,
  Sparkles, 
  Loader2,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Crown,
  Lock
} from 'lucide-react'

export default function InterviewPrepPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [cvs, setCvs] = useState<any[]>([])
  const [selectedCvId, setSelectedCvId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [companyUrl, setCompanyUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isResearchingCompany, setIsResearchingCompany] = useState(false)
  const [companyResearch, setCompanyResearch] = useState<any>(null)
  const [interviewData, setInterviewData] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [usageData, setUsageData] = useState<{interview_preps_used: number} | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }

    await Promise.all([fetchCVs(), checkSubscription()])
    setIsLoading(false)
  }

  const fetchCVs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('cvs')
      .select('id, file_meta')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCvs(data)
      if (data.length > 0) {
        setSelectedCvId(data[0].id)
      }
    }
  }

  const checkSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('plan_type, subscription_tier, interview_preps_used')
      .eq('user_id', user.id)
      .single()

    const isProUser = usage?.plan_type === 'pro' || 
                      usage?.subscription_tier === 'pro_monthly' || 
                      usage?.subscription_tier === 'pro_annual'
    setIsPro(isProUser)
    setUsageData({ interview_preps_used: usage?.interview_preps_used || 0 })
  }

  const handleCompanyResearch = async () => {
    if (!companyUrl.trim()) {
      toast.error('Please enter a company URL')
      return
    }

    if (!isPro) {
      toast.error('Company research is a Pro feature!', {
        action: {
          label: 'Upgrade',
          onClick: () => router.push('/subscription')
        }
      })
      return
    }

    setIsResearchingCompany(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/company/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyUrl,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresUpgrade) {
          toast.error(data.error, {
            action: {
              label: 'Upgrade',
              onClick: () => router.push('/subscription')
            }
          })
        } else {
          toast.error(data.error)
        }
        return
      }

      setCompanyResearch(data.companyData)
      toast.success('Company research completed!')

    } catch (error: any) {
      console.error('Company research error:', error)
      toast.error('Failed to research company')
    } finally {
      setIsResearchingCompany(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedCvId) {
      toast.error('Please select a CV')
      return
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    setIsGenerating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/interview-prep/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: selectedCvId,
          jobDescription,
          companyResearch,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresUpgrade) {
          toast.error(data.error, {
            action: {
              label: 'Upgrade',
              onClick: () => router.push('/subscription')
            }
          })
        } else {
          toast.error(data.error)
        }
        return
      }

      setInterviewData(data.interviewData)
      toast.success('Interview prep generated!')

    } catch (error: any) {
      console.error('Interview prep error:', error)
      toast.error('Failed to generate interview prep')
    } finally {
      setIsGenerating(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Pro gate
  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro Feature</h2>
          <p className="text-gray-600 mb-6">
            Interview Prep is available exclusively to Pro users. Upgrade now to generate personalized interview questions and answers based on your CV!
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Personalized interview questions based on your CV</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Company research and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Suggested answers with examples</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Unlimited interview prep sessions</span>
              </li>
            </ul>
          </div>
          <Link
            href="/subscription"
            className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Upgrade to Pro
          </Link>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Interview Prep Assistant
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">PRO</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Generate personalized interview questions and answers based on your CV
          </p>
        </div>

        {/* Pro Badge Info */}
        {usageData && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900">
              <Crown className="w-4 h-4 inline mr-1" />
              <strong>Pro Feature:</strong> Unlimited interview prep sessions.{' '}
              for unlimited preps + company research!
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* CV Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CV *
            </label>
            <select
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a CV...</option>
              {cvs.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.file_meta?.name || 'Unnamed CV'}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Paste the job description here..."
            />
          </div>

          {/* Company Research (Pro Only) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Research (Optional)
                {!isPro && (
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PRO
                  </span>
                )}
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://company-website.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                disabled={!isPro}
              />
              <button
                onClick={handleCompanyResearch}
                disabled={isResearchingCompany || !isPro || !companyUrl.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isResearchingCompany ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Research
                  </>
                )}
              </button>
            </div>
            {!isPro && (
              <p className="text-xs text-gray-500 mt-2">
                Upgrade to Pro to research companies and get company-specific interview questions!
              </p>
            )}
          </div>

          {/* Company Research Results */}
          {companyResearch && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Company Research Complete: {companyResearch.company_name}
              </h3>
              <p className="text-sm text-green-800 mb-2">{companyResearch.overview}</p>
              <div className="text-xs text-green-700">
                <strong>Industry:</strong> {companyResearch.industry}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedCvId || !jobDescription.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Interview Prep...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Interview Prep
              </>
            )}
          </button>
        </div>

        {/* Interview Questions */}
        {interviewData && (
          <div className="space-y-6">
            {/* General Questions */}
            {interviewData.general_questions && (
              <QuestionSection
                title="General Questions"
                icon={<HelpCircle className="w-6 h-6 text-blue-600" />}
                questions={interviewData.general_questions}
              />
            )}

            {/* Technical Questions */}
            {interviewData.technical_questions && (
              <QuestionSection
                title="Technical Questions"
                icon={<Briefcase className="w-6 h-6 text-purple-600" />}
                questions={interviewData.technical_questions}
              />
            )}

            {/* Behavioral Questions */}
            {interviewData.behavioral_questions && (
              <QuestionSection
                title="Behavioral Questions"
                icon={<Lightbulb className="w-6 h-6 text-yellow-600" />}
                questions={interviewData.behavioral_questions}
              />
            )}

            {/* Company-Specific Questions */}
            {interviewData.company_specific_questions && (
              <QuestionSection
                title="Company-Specific Questions"
                icon={<Building2 className="w-6 h-6 text-green-600" />}
                questions={interviewData.company_specific_questions}
                isPro
              />
            )}

            {/* Questions to Ask Them */}
            {interviewData.questions_to_ask_them && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-indigo-600" />
                  Questions to Ask the Interviewer
                </h2>
                <ul className="space-y-2">
                  {interviewData.questions_to_ask_them.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span className="text-gray-700">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionSection({ title, icon, questions, isPro }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        {icon}
        {title}
        {isPro && (
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            PRO
          </span>
        )}
      </h2>
      <div className="space-y-4">
        {questions.map((q: any, i: number) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full text-left"
            >
              <h3 className="font-semibold text-gray-900 flex items-start gap-2">
                <span className="text-blue-600">{i + 1}.</span>
                {q.question}
              </h3>
            </button>
            {expandedIndex === i && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Sample Answer:</p>
                  <p className="text-sm text-gray-600">{q.sample_answer}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Tips:</p>
                  <p className="text-sm text-gray-600">{q.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
