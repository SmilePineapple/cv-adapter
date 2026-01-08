'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Building2,
  Briefcase,
  HelpCircle,
  Lightbulb,
  Crown,
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  Award
} from 'lucide-react'

export default function ViewInterviewPrepPage() {
  const params = useParams()
  const prepId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [prep, setPrep] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedQuestions, setExpandedQuestions] = useState<{[key: string]: number | null}>({})

  useEffect(() => {
    fetchPrep()
  }, [prepId])

  const fetchPrep = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('interview_preps')
        .select(`
          *,
          cvs(file_meta)
        `)
        .eq('id', prepId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setPrep(data)
    } catch (error) {
      console.error('Error fetching prep:', error)
      toast.error('Failed to load interview prep')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleQuestion = (category: string, index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [category]: prev[category] === index ? null : index
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!prep) {
    return null
  }

  const { company_research, interview_data } = prep

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
          <h1 className="text-3xl font-bold text-gray-900">
            Interview Prep
          </h1>
          <p className="text-gray-600 mt-2">
            Created {new Date(prep.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Company Research Section */}
        {company_research && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-green-600" />
              {company_research.company_name}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO RESEARCH
              </span>
            </h2>

            {/* Company Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
              <p className="text-gray-700 leading-relaxed">{company_research.overview}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {company_research.industry && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">Industry</p>
                    <p className="text-sm font-semibold text-gray-900">{company_research.industry}</p>
                  </div>
                )}
                {company_research.founded && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 font-medium">Founded</p>
                    <p className="text-sm font-semibold text-gray-900">{company_research.founded}</p>
                  </div>
                )}
                {company_research.headquarters && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium">Headquarters</p>
                    <p className="text-sm font-semibold text-gray-900">{company_research.headquarters}</p>
                  </div>
                )}
                {company_research.employee_count && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs text-orange-600 font-medium">Employees</p>
                    <p className="text-sm font-semibold text-gray-900">{company_research.employee_count}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products/Services */}
            {company_research.products_services && company_research.products_services.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Products & Services
                </h3>
                <div className="grid gap-3">
                  {company_research.products_services.map((product: any, i: number) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{product.name || product}</h4>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture & Values */}
            {company_research.culture && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Culture</h3>
                <p className="text-gray-700">{company_research.culture}</p>
              </div>
            )}

            {company_research.values && company_research.values.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Values</h3>
                <div className="grid gap-2">
                  {company_research.values.map((value: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent News */}
            {company_research.recent_news && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Recent News & Achievements
                </h3>
                <div className="space-y-2">
                  {Array.isArray(company_research.recent_news) ? (
                    company_research.recent_news.map((news: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-700">{news}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-gray-700">{company_research.recent_news}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key People */}
            {company_research.key_people && company_research.key_people.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Key People to Know
                </h3>
                <div className="grid gap-3">
                  {company_research.key_people.map((person: any, i: number) => (
                    <div key={i} className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{person.name}</h4>
                        <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">{person.role}</span>
                      </div>
                      {person.background && (
                        <p className="text-sm text-gray-600">{person.background}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {company_research.red_flags && company_research.red_flags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Things to Clarify
                </h3>
                <div className="space-y-2">
                  {company_research.red_flags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-orange-50 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interview Questions */}
        {interview_data && (
          <div className="space-y-6">
            {/* General Questions */}
            {interview_data.general_questions && interview_data.general_questions.length > 0 && (
              <QuestionSection
                title="General Questions"
                icon={<HelpCircle className="w-6 h-6 text-blue-600" />}
                questions={interview_data.general_questions}
                category="general"
                expandedQuestions={expandedQuestions}
                toggleQuestion={toggleQuestion}
              />
            )}

            {/* Technical Questions */}
            {interview_data.technical_questions && interview_data.technical_questions.length > 0 && (
              <QuestionSection
                title="Technical Questions"
                icon={<Briefcase className="w-6 h-6 text-purple-600" />}
                questions={interview_data.technical_questions}
                category="technical"
                expandedQuestions={expandedQuestions}
                toggleQuestion={toggleQuestion}
              />
            )}

            {/* Behavioral Questions */}
            {interview_data.behavioral_questions && interview_data.behavioral_questions.length > 0 && (
              <QuestionSection
                title="Behavioral Questions"
                icon={<Lightbulb className="w-6 h-6 text-yellow-600" />}
                questions={interview_data.behavioral_questions}
                category="behavioral"
                expandedQuestions={expandedQuestions}
                toggleQuestion={toggleQuestion}
              />
            )}

            {/* Company-Specific Questions */}
            {interview_data.company_specific_questions && interview_data.company_specific_questions.length > 0 && (
              <QuestionSection
                title="Company-Specific Questions"
                icon={<Building2 className="w-6 h-6 text-green-600" />}
                questions={interview_data.company_specific_questions}
                category="company"
                expandedQuestions={expandedQuestions}
                toggleQuestion={toggleQuestion}
                isPro
              />
            )}

            {/* Questions to Ask Them */}
            {interview_data.questions_to_ask_them && interview_data.questions_to_ask_them.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-indigo-600" />
                  Questions to Ask the Interviewer
                </h2>
                <ul className="space-y-3">
                  {interview_data.questions_to_ask_them.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-indigo-50 rounded-lg p-4">
                      <span className="text-indigo-600 font-bold text-lg">{i + 1}.</span>
                      <span className="text-gray-700 flex-1">{q}</span>
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

function QuestionSection({ title, icon, questions, category, expandedQuestions, toggleQuestion, isPro }: any) {
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
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleQuestion(category, i)}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">{i + 1}.</span>
                <span className="flex-1">{q.question}</span>
              </h3>
            </button>
            {expandedQuestions[category] === i && (
              <div className="px-4 pb-4 space-y-3 bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">💡 Sample Answer:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.sample_answer}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">✨ Tips:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
