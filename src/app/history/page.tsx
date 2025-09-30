'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  FileText, 
  Calendar,
  Briefcase,
  Download,
  Eye,
  Trash2,
  Clock,
  Target,
  Loader2,
  Edit3
} from 'lucide-react'

interface GenerationHistory {
  id: string
  job_title: string
  job_description: string
  rewrite_style: string
  tone: string
  created_at: string
  cv_id: string
  cvs: {
    file_meta: {
      name: string
    }
  }
}

interface CoverLetterHistory {
  id: string
  company_name: string
  job_title: string
  length: string
  tone: string
  created_at: string
  generation_id: string
}

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [generations, setGenerations] = useState<GenerationHistory[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetterHistory[]>([])
  const [activeTab, setActiveTab] = useState<'cvs' | 'cover-letters'>('cvs')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [atsScores, setAtsScores] = useState<Record<string, any>>({})
  const [loadingScores, setLoadingScores] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchGenerations()
    fetchCoverLetters()
  }, [])

  const fetchGenerations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('generations')
        .select(`
          id,
          job_title,
          job_description,
          rewrite_style,
          tone,
          created_at,
          cv_id,
          cvs!inner(file_meta)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching generations:', error)
        toast.error('Failed to load CV history')
        return
      }

      setGenerations((data as any) || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load CV history')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCoverLetters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('cover_letters')
        .select('id, company_name, job_title, length, tone, created_at, generation_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching cover letters:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        // If table doesn't exist, just set empty array
        if (error.message?.includes('relation "cover_letters" does not exist')) {
          setCoverLetters([])
          return
        }
        // For now, set empty array for any error to prevent crashes
        setCoverLetters([])
        return
      }

      setCoverLetters(data || [])
    } catch (error) {
      console.error('Cover letters fetch error:', error)
    }
  }

  const fetchATSScore = async (generationId: string) => {
    if (atsScores[generationId] || loadingScores[generationId]) return

    setLoadingScores(prev => ({ ...prev, [generationId]: true }))

    try {
      const response = await fetch('/api/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generation_id: generationId }),
      })

      const result = await response.json()

      if (response.ok) {
        setAtsScores(prev => ({ ...prev, [generationId]: result }))
      } else {
        console.error('ATS score error:', result.error)
      }
    } catch (error) {
      console.error('ATS score fetch error:', error)
    } finally {
      setLoadingScores(prev => ({ ...prev, [generationId]: false }))
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Work'
  }

  const handleDelete = async (generationId: string) => {
    if (!confirm('Are you sure you want to delete this generated CV?')) {
      return
    }

    setDeletingId(generationId)
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', generationId)

      if (error) {
        throw error
      }

      setGenerations(generations.filter(g => g.id !== generationId))
      toast.success('CV deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete CV')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteCoverLetter = async (coverLetterId: string) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', coverLetterId)

      if (error) {
        throw error
      }

      setCoverLetters(coverLetters.filter(cl => cl.id !== coverLetterId))
      toast.success('Cover letter deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete cover letter')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CV History</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                History
              </h1>
              <p className="text-gray-600">
                View and manage all your AI-generated content
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('cvs')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'cvs'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              CVs ({generations.length})
            </button>
            <button
              onClick={() => setActiveTab('cover-letters')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'cover-letters'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cover Letters ({coverLetters.length})
            </button>
          </div>

          {/* CV History Tab */}
          {activeTab === 'cvs' && (
            <>
              {generations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No generated CVs yet</h3>
                  <p className="text-gray-600 mb-6">
                    Upload a CV and generate your first tailored version to get started.
                  </p>
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Upload CV
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {generations.map((generation) => (
                <div
                  key={generation.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {generation.job_title}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {generation.rewrite_style}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {generation.tone}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {truncateDescription(generation.job_description)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {generation.cvs.file_meta.name}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(generation.created_at)}
                          </div>
                        </div>

                        {/* ATS Score */}
                        <div className="flex items-center">
                          {loadingScores[generation.id] ? (
                            <div className="flex items-center text-sm text-gray-500">
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Analyzing...
                            </div>
                          ) : atsScores[generation.id] ? (
                            <div 
                              className="flex items-center space-x-2 cursor-help"
                              title={`Keywords: ${atsScores[generation.id].breakdown?.keyword_matching || 0}/30 | Format: ${atsScores[generation.id].breakdown?.formatting_structure || 0}/20 | Relevance: ${atsScores[generation.id].breakdown?.relevance_alignment || 0}/25`}
                            >
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(atsScores[generation.id].overall_score)}`}>
                                ATS: {atsScores[generation.id].overall_score}/100
                              </div>
                              <span className={`text-xs font-medium ${getScoreColor(atsScores[generation.id].overall_score).split(' ')[0]}`}>
                                {getScoreLabel(atsScores[generation.id].overall_score)}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => fetchATSScore(generation.id)}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Target className="w-4 h-4 mr-1" />
                              Get ATS Score
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/review/${generation.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Link>
                      <Link
                        href={`/edit/${generation.cv_id}`}
                        className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <Link
                        href={`/download/${generation.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Link>
                      <button
                        onClick={() => handleDelete(generation.id)}
                        disabled={deletingId === generation.id}
                        className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {deletingId === generation.id ? (
                          <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

          {/* Cover Letter History Tab */}
          {activeTab === 'cover-letters' && (
            <>
              {coverLetters.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cover letters yet</h3>
                  <p className="text-gray-600 mb-6">
                    Generate a CV first, then create cover letters from the review page.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {coverLetters.map((coverLetter) => (
                    <div
                      key={coverLetter.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {coverLetter.job_title} at {coverLetter.company_name}
                            </h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {coverLetter.length}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {coverLetter.tone}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDate(coverLetter.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/review/${coverLetter.generation_id}`}
                            className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View CV
                          </Link>
                          <button
                            onClick={() => handleDeleteCoverLetter(coverLetter.id)}
                            className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
