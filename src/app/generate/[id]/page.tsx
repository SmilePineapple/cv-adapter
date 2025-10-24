'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import CVProgressStepper from '@/components/CVProgressStepper'
import { toast } from 'sonner'
import { RewriteStyle, ToneType } from '@/types/database'
import { 
  ArrowLeft, 
  Zap, 
  FileText, 
  Briefcase,
  Settings,
  Loader2,
  Plus,
  X,
  Sparkles,
  Globe
} from 'lucide-react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { LanguageBadge } from '@/components/LanguageBadge'
import { LANGUAGE_NAMES } from '@/lib/language-detection'
import { LoadingProgress } from '@/components/LoadingProgress'
import UpgradeModal from '@/components/UpgradeModal'
import JobScraper from '@/components/JobScraper'
import { analyzeJobPaste } from '@/lib/smart-paste'
import CVGenerationLoader from '@/components/CVGenerationLoader'

export default function GeneratePage() {
  const params = useParams()
  const cvId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [cvData, setCvData] = useState<any>(null)
  const [allCvs, setAllCvs] = useState<any[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>(cvId)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [smartPasteSuggestion, setSmartPasteSuggestion] = useState<{title: string, confidence: string} | null>(null)
  const [rewriteStyle, setRewriteStyle] = useState<RewriteStyle>('balanced')
  const [tone, setTone] = useState<ToneType>('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generateStep, setGenerateStep] = useState('')
  const [customSections, setCustomSections] = useState<string[]>([])
  const [newSectionName, setNewSectionName] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)
  const [usageData, setUsageData] = useState<{generation_count: number, max_generations: number, is_pro: boolean} | null>(null)
  const [outputLanguage, setOutputLanguage] = useState<string>('en')
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    fetchCVData()
    fetchAllCvs()
    fetchUsageData()
  }, [cvId])

  useEffect(() => {
    if (selectedCvId !== cvId) {
      fetchCVData(selectedCvId)
    }
  }, [selectedCvId])

  const fetchUsageData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get usage tracking with plan type
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('lifetime_generation_count, max_lifetime_generations, plan_type')
        .eq('user_id', user.id)
        .single()

      const isPro = usage?.plan_type === 'pro'
      const maxGenerations = usage?.max_lifetime_generations || (isPro ? 999999 : 1)
      const currentCount = usage?.lifetime_generation_count || 0

      setUsageData({
        generation_count: currentCount,
        max_generations: maxGenerations,
        is_pro: isPro
      })
    } catch (error) {
      console.error('Error fetching usage data:', error)
    }
  }

  const fetchAllCvs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('cvs')
        .select('id, file_meta, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAllCvs(data)
      }
    } catch (error) {
      console.error('Error fetching all CVs:', error)
    }
  }

  const fetchCVData = async (id?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id || cvId)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        toast.error('CV not found')
        router.push('/dashboard')
        return
      }

      setCvData(data)
      
      // Set detected language if available
      if (data.detected_language) {
        setDetectedLanguage(data.detected_language)
        setOutputLanguage(data.detected_language) // Default to detected language
      }
    } catch (error) {
      console.error('Error fetching CV:', error)
      toast.error('Failed to load CV')
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Please enter a section name')
      return
    }
    
    if (customSections.includes(newSectionName.trim())) {
      toast.error('Section already exists')
      return
    }
    
    setCustomSections([...customSections, newSectionName.trim()])
    setNewSectionName('')
    setShowAddSection(false)
    toast.success('Section added! It will be generated with AI content.')
  }

  const removeCustomSection = (sectionName: string) => {
    setCustomSections(customSections.filter(s => s !== sectionName))
    toast.success('Section removed')
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error('Please fill in both job title and description')
      return
    }

    // Check usage limit BEFORE making API call
    if (usageData && usageData.generation_count >= usageData.max_generations) {
      if (usageData.is_pro) {
        toast.error('Unexpected error. Please contact support.')
      } else {
        toast.error('You have used your 1 free generation. Upgrade to Pro for unlimited!', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscription')
          }
        })
      }
      return
    }

    setIsGenerating(true)
    setGenerateProgress(0)
    setGenerateStep('🔍 Analyzing job requirements...')

    try {
      // Step 1: Preparing
      await new Promise(resolve => setTimeout(resolve, 300))
      setGenerateProgress(10)
      setGenerateStep('📄 Extracting CV content...')
      
      await new Promise(resolve => setTimeout(resolve, 400))
      setGenerateProgress(20)
      setGenerateStep('🎯 Matching skills to job description...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(30)
      setGenerateStep('🤖 AI is analyzing your experience...')
      
      // Start API call
      const responsePromise = fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv_id: selectedCvId,
          job_title: jobTitle,
          job_description: jobDescription,
          rewrite_style: rewriteStyle,
          tone: tone,
          custom_sections: customSections,
          output_language: outputLanguage,
        }),
      })

      // Step 2: AI Processing
      await new Promise(resolve => setTimeout(resolve, 600))
      setGenerateProgress(45)
      setGenerateStep('✍️ Rewriting work experience...')
      
      await new Promise(resolve => setTimeout(resolve, 700))
      setGenerateProgress(55)
      setGenerateStep('💼 Tailoring professional summary...')
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setGenerateProgress(65)
      setGenerateStep('🎓 Optimizing skills section...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(70)
      setGenerateStep('🎯 Running ATS optimization...')
      
      await new Promise(resolve => setTimeout(resolve, 700))
      setGenerateProgress(75)
      setGenerateStep('🔍 Analyzing keyword density...')
      
      await new Promise(resolve => setTimeout(resolve, 600))
      setGenerateProgress(80)
      setGenerateStep('📊 Calculating ATS score...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(85)
      setGenerateStep('✨ Polishing final content...')
      
      await new Promise(resolve => setTimeout(resolve, 400))
      setGenerateProgress(90)
      setGenerateStep('🎨 Formatting sections...')
      
      // Add rotating messages while waiting for API
      const formattingMessages = [
        '✨ Adding final touches...',
        '🎯 Perfecting the layout...',
        '💫 Making it shine...',
        '🔥 Almost there...',
        '⚡ Finalizing your masterpiece...',
        '🌟 Polishing to perfection...',
        '🎨 Applying professional styling...',
        '✅ Just a few more seconds...'
      ]
      
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        setGenerateStep(formattingMessages[messageIndex % formattingMessages.length])
        messageIndex++
      }, 2000)
      
      // Wait for API response
      const response = await responsePromise
      clearInterval(messageInterval)
      const result = await response.json()
      
      setGenerateProgress(95)
      setGenerateStep('✨ Finalizing your perfect CV...')

      if (!response.ok) {
        if (result.limit_reached) {
          setShowUpgradeModal(true)
          toast.error('Free generation used. Upgrade to Pro for unlimited generations!')
          return
        }
        
        // Handle authentication errors
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.')
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 2000)
          return
        }
        
        const errorMessage = result.error || result.details || 'Generation failed'
        console.error('Generation error:', errorMessage, result)
        toast.error(errorMessage)
        throw new Error(errorMessage)
      }

      setGenerateProgress(100)
      setGenerateStep('Complete!')
      toast.success('CV tailored successfully!')
      
      // Small delay to show completion
      setTimeout(() => {
        router.push(`/review/${result.generation_id}`)
      }, 500)
      
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate tailored CV')
    } finally {
      setIsGenerating(false)
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
      {/* Progress Stepper */}
      <CVProgressStepper currentStep="generate" />
      
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-xl font-bold text-gray-900">CV Adapter</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tailor Your CV with AI
            </h1>
            <p className="text-gray-600">
              Enter the job details and let AI optimize your CV for maximum impact
            </p>
          </div>

          {/* CV Selector */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Selected CV: {cvData?.file_meta?.name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {cvData?.parsed_sections?.sections?.length || 0} sections • Uploaded {cvData?.created_at ? new Date(cvData.created_at).toLocaleDateString() : ''}
                    {detectedLanguage && detectedLanguage !== 'en' && (
                      <span className="inline-flex items-center gap-1">
                        • <LanguageBadge languageCode={detectedLanguage} />
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {allCvs.length > 1 && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Switch CV:</label>
                  <select
                    value={selectedCvId}
                    onChange={(e) => setSelectedCvId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {allCvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.file_meta?.name} ({new Date(cv.created_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Language Selector */}
          {detectedLanguage && (
            <div className="bg-purple-50 rounded-lg p-4 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      Output Language
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      We detected your CV is in <strong>{LANGUAGE_NAMES[detectedLanguage as keyof typeof LANGUAGE_NAMES] || detectedLanguage}</strong>. 
                      The AI will generate content in the same language, or you can override it below.
                    </p>
                    <LanguageSelector 
                      currentLanguage={outputLanguage}
                      onLanguageChange={setOutputLanguage}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Scraper */}
          <JobScraper
            onJobScraped={(jobData) => {
              setJobTitle(jobData.job_title || '')
              setJobDescription(jobData.job_description || '')
            }}
          />

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onPaste={(e) => {
                  // Smart paste detection
                  const pastedText = e.clipboardData.getData('text')
                  if (pastedText.length > 100) {
                    setTimeout(() => {
                      const analysis = analyzeJobPaste(pastedText)
                      if (analysis.detectedTitle && !jobTitle) {
                        setSmartPasteSuggestion({
                          title: analysis.detectedTitle,
                          confidence: analysis.confidence
                        })
                        toast.info(`Detected job title: "${analysis.detectedTitle}"`, {
                          duration: 5000,
                          action: {
                            label: 'Use Title',
                            onClick: () => {
                              setJobTitle(analysis.detectedTitle!)
                              setSmartPasteSuggestion(null)
                            }
                          }
                        })
                      }
                    }, 100)
                  }
                }}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste the full job description here. Include requirements, responsibilities, and qualifications for best results."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: Include the full job posting for better keyword matching and ATS optimization
              </p>
            </div>

            {/* Generation Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rewriteStyle" className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="inline w-4 h-4 mr-1" />
                  Rewrite Style
                </label>
                <select
                  id="rewriteStyle"
                  value={rewriteStyle}
                  onChange={(e) => setRewriteStyle(e.target.value as RewriteStyle)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="conservative">Conservative - Minimal changes</option>
                  <option value="balanced">Balanced - Moderate optimization</option>
                  <option value="bold">Bold - Maximum alignment</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {rewriteStyle === 'conservative' && 'Keeps most original content, adds key terms'}
                  {rewriteStyle === 'balanced' && 'Good balance of optimization and authenticity'}
                  {rewriteStyle === 'bold' && 'Significant changes for strong job alignment'}
                </p>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="inline w-4 h-4 mr-1" />
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="professional">Professional - Formal business language</option>
                  <option value="friendly">Friendly - Warm yet professional</option>
                  <option value="creative">Creative - Dynamic and engaging</option>
                  <option value="technical">Technical - Precise technical language</option>
                </select>
              </div>
            </div>

            {/* Custom Sections */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Plus className="inline w-4 h-4 mr-1" />
                Custom Sections
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Add additional sections to make your CV stand out. AI will generate relevant content based on your background.
              </p>
              
              {/* Section Examples */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-blue-900 mb-2">💡 Popular section ideas:</p>
                <div className="flex flex-wrap gap-2">
                  {['Volunteer Work', 'Publications', 'Awards & Honors', 'Certifications', 'Projects', 'Languages', 'Professional Memberships', 'Speaking Engagements', 'Patents', 'Research', 'Teaching Experience', 'Community Involvement'].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        if (!customSections.includes(example)) {
                          setCustomSections([...customSections, example])
                          toast.success(`Added "${example}" section!`)
                        } else {
                          toast.error('Section already added')
                        }
                      }}
                      className="text-xs px-2 py-1 bg-white text-blue-700 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                      type="button"
                    >
                      + {example}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Existing Custom Sections */}
              {customSections.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {customSections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{section}</span>
                      <button
                        onClick={() => removeCustomSection(section)}
                        className="ml-2 hover:text-blue-900"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Section */}
              {showAddSection ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="e.g., Volunteer Work"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
                  />
                  <button
                    onClick={addCustomSection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    type="button"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddSection(false)
                      setNewSectionName('')
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddSection(true)}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Section
                </button>
              )}
              
              {customSections.length > 0 && (
                <p className="text-xs text-amber-600 mt-2">
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Custom sections will use AI generation tokens
                </p>
              )}
            </div>

            {/* Generate Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isGenerating || !jobTitle.trim() || !jobDescription.trim()}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Tailored CV...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Tailored CV
                  </>
                )}
              </button>
              
              {/* Enhanced Loading Animation */}
              {isGenerating && (
                <CVGenerationLoader 
                  progress={generateProgress} 
                  step={generateStep} 
                />
              )}
            </div>
          </form>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">ATS Optimized</h3>
              <p className="text-xs text-gray-600">Keywords matched to job requirements</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Format Preserved</h3>
              <p className="text-xs text-gray-600">Original structure maintained</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Customizable</h3>
              <p className="text-xs text-gray-600">Review and edit before download</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="limit_reached"
        currentUsage={usageData?.generation_count || 1}
        maxGenerations={usageData?.max_generations || 1}
      />
    </div>
  )
}
