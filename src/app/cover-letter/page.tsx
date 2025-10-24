'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Upload,
  Mail,
  Building2,
  User,
  Clock,
  Zap
} from 'lucide-react'

interface CV {
  id: string
  file_meta: {
    name: string
    size: number
  }
  created_at: string
}

export default function CreateCoverLetterPage() {
  const [user, setUser] = useState<any>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>('')
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    hiringManagerName: '',
    jobDescription: '',
    length: 'short' as 'short' | 'long',
    tone: 'professional' as 'professional' | 'friendly' | 'enthusiastic' | 'formal'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkAuth()
    fetchCVs()
    checkSubscription()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single()

      const subscriptionTier = usage?.subscription_tier || 'free'
      const isProUser = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
      setIsPro(isProUser)
      
      // Show upgrade prompt for free users
      if (!isProUser) {
        setShowUpgradePrompt(true)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const fetchCVs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: cvsData, error } = await supabase
        .from('cvs')
        .select('id, file_meta, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching CVs:', error)
        toast.error('Failed to load CVs')
      } else {
        setCvs(cvsData || [])
        if (cvsData && cvsData.length > 0) {
          setSelectedCvId(cvsData[0].id)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load CVs')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateCoverLetter = async () => {
    if (!selectedCvId || !formData.jobTitle || !formData.companyName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvId: selectedCvId,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          hiringManagerName: formData.hiringManagerName,
          jobDescription: formData.jobDescription,
          length: formData.length,
          tone: formData.tone
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Cover letter generation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(errorData.error || `Failed to generate cover letter (${response.status})`)
      }

      const data = await response.json()
      toast.success('Cover letter generated successfully!')
      // Redirect to view the cover letter
      router.push(`/cover-letter/view/${data.id}`)
    } catch (error: any) {
      console.error('Error generating cover letter:', error)
      toast.error(error.message || 'Failed to generate cover letter')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upgrade Banner for Free Users */}
      {showUpgradePrompt && !isPro && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">Cover Letters are a Pro feature</span>
                <span className="ml-2 text-purple-100">Upgrade to unlock unlimited cover letters</span>
              </div>
              <Link
                href="/subscription"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Create Cover Letter</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cvs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No CVs Available</h2>
            <p className="text-gray-600 mb-6">
              You need to upload a CV first before creating a cover letter.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload CV
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cover Letter Details</h2>
              
              <div className="space-y-6">
                {/* CV Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CV
                  </label>
                  <select
                    value={selectedCvId}
                    onChange={(e) => setSelectedCvId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.file_meta.name} - {formatDate(cv.created_at)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Hiring Manager Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Manager Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.hiringManagerName}
                    onChange={(e) => handleInputChange('hiringManagerName', e.target.value)}
                    placeholder="e.g., John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    placeholder="Paste the job description here for better personalization..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length
                  </label>
                  <select
                    value={formData.length}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="short">Short (1 paragraph)</option>
                    <option value="long">Long (2-3 paragraphs)</option>
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating || !selectedCvId || !formData.jobTitle || !formData.companyName}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview/Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tips for Better Results</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Research the Company</h3>
                    <p className="text-sm text-gray-600">Include specific details about the company to make your cover letter more personalized.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Include Job Description</h3>
                    <p className="text-sm text-gray-600">Paste the job description for AI to tailor your cover letter to specific requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Hiring Manager Name</h3>
                    <p className="text-sm text-gray-600">If you know the hiring manager's name, include it for a more personal touch.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Choose the Right Length</h3>
                    <p className="text-sm text-gray-600">Short for quick applications, long for detailed positions requiring more explanation.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-900">AI-Powered Generation</h3>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Our AI will analyze your CV and create a personalized cover letter that highlights your most relevant experience for this specific role.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
