'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  FileText, 
  Briefcase,
  User,
  Clock,
  Volume2,
  Sparkles,
  Download,
  Copy,
  Check
} from 'lucide-react'

export default function CoverLetterPage() {
  const router = useRouter()
  const params = useParams()
  const generationId = params.id as string
  const supabase = createSupabaseClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generateStep, setGenerateStep] = useState('')
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  
  // Form state
  const [companyName, setCompanyName] = useState('')
  const [positionTitle, setPositionTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [length, setLength] = useState<'short' | 'long'>('short')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'enthusiastic' | 'formal'>('professional')
  const [hiringManagerName, setHiringManagerName] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Verify the generation exists and belongs to user
      const { data: generation, error } = await supabase
        .from('generations')
        .select('job_title, job_description')
        .eq('id', generationId)
        .eq('user_id', user.id)
        .single()

      if (error || !generation) {
        toast.error('Generation not found')
        router.push('/dashboard')
        return
      }

      // Pre-fill form with generation data
      setPositionTitle(generation.job_title)
      setJobDescription(generation.job_description)

    } catch (error) {
      console.error('Auth error:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!companyName.trim() || !positionTitle.trim() || !jobDescription.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setGenerateProgress(0)
    setGenerateStep('Analyzing your CV and job requirements...')

    try {
      setGenerateProgress(20)
      setGenerateStep('Crafting personalized content...')

      // Try the main API first, fallback to v2 if it fails
      let response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generation_id: generationId,
          company_name: companyName.trim(),
          position_title: positionTitle.trim(),
          job_description: jobDescription.trim(),
          length,
          tone,
          hiring_manager_name: hiringManagerName.trim() || undefined,
        }),
      })

      // If main API fails, try the v2 API
      if (!response.ok) {
        console.log('Main API failed, trying v2...')
        const session = await supabase.auth.getSession()
        response = await fetch('/api/generate-cover-letter-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.data.session?.access_token}`,
          },
          body: JSON.stringify({
            generation_id: generationId,
            company_name: companyName.trim(),
            position_title: positionTitle.trim(),
            job_description: jobDescription.trim(),
            length,
            tone,
            hiring_manager_name: hiringManagerName.trim() || undefined,
          }),
        })
      }

      setGenerateProgress(70)
      setGenerateStep('AI is writing your cover letter...')

      const result = await response.json()

      if (!response.ok) {
        if (result.limit_reached) {
          toast.error('Monthly generation limit reached. Please upgrade to continue.')
          return
        }
        throw new Error(result.error || 'Generation failed')
      }

      // Handle both v1 and v2 API responses
      if (result.success && result.content) {
        setCoverLetter(result.content)
        setGenerateProgress(100)
        setGenerateStep('Complete!')
        if (!result.saved) {
          toast.success('Cover letter generated! (Note: Not saved to history due to database issues)')
        } else {
          toast.success('Cover letter generated successfully!')
        }
      } else if (result.content) {
        // v1 API response
        setCoverLetter(result.content)
        setGenerateProgress(100)
        setGenerateStep('Complete!')
        toast.success('Cover letter generated successfully!')
      } else {
        throw new Error('No content received')
      }

    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate cover letter')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!coverLetter) return
    
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopied(true)
      toast.success('Cover letter copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = async (format: 'txt' | 'docx' | 'pdf' = 'txt') => {
    if (!coverLetter) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to download')
        return
      }

      const response = await fetch(`/api/cover-letter/${generationId}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const fileName = `Cover_Letter_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${positionTitle.replace(/[^a-zA-Z0-9]/g, '_')}`
      a.download = `${fileName}.${format}`
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Cover letter downloaded as ${format.toUpperCase()}!`)
      setShowExportOptions(false)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download cover letter')
    }
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
              href={`/review/${generationId}`}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Review
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cover Letter Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate Cover Letter</h1>
                <p className="text-gray-600">Create a tailored cover letter for your job application</p>
              </div>
            </div>

            {!coverLetter ? (
              <div className="space-y-6">
                {/* Company & Position */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Microsoft"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isGenerating}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Position Title *
                    </label>
                    <input
                      type="text"
                      value={positionTitle}
                      onChange={(e) => setPositionTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                {/* Hiring Manager (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Hiring Manager Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={hiringManagerName}
                    onChange={(e) => setHiringManagerName(e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                  <p className="text-sm text-gray-500 mt-1">If provided, the letter will be addressed to them personally</p>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Length
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value as 'short' | 'long')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isGenerating}
                    >
                      <option value="short">Short (250-300 words)</option>
                      <option value="long">Long (400-500 words)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Volume2 className="w-4 h-4 inline mr-1" />
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isGenerating}
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Cover Letter
                      </>
                    )}
                  </button>

                  {isGenerating && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{generateStep}</span>
                        <span>{generateProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${generateProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Generated Cover Letter */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Cover Letter</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCopy}
                      className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowExportOptions(!showExportOptions)}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      
                      {showExportOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleDownload('txt')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as TXT
                            </button>
                            <button
                              onClick={() => handleDownload('docx')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as DOCX
                            </button>
                            <button
                              onClick={() => handleDownload('pdf')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {coverLetter}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setCoverLetter(null)
                      setGenerateProgress(0)
                      setGenerateStep('')
                    }}
                    className="px-6 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
