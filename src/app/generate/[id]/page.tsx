'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
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
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { LanguageBadge } from '@/components/LanguageBadge'
import { LANGUAGE_NAMES } from '@/lib/language-detection'
import { LoadingProgress } from '@/components/LoadingProgress'
import UpgradeModal from '@/components/UpgradeModal'
import UpgradePromptModal from '@/components/UpgradePromptModal'
import EnhancedUpgradeModal from '@/components/EnhancedUpgradeModal'
import SmartUpgradeModal from '@/components/SmartUpgradeModal'
import CVGenerationLoader from '@/components/CVGenerationLoader'
import { shouldShowUpgradePrompt, trackPromptShown, incrementGenerationCount } from '@/lib/upgrade-tracking'

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
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isQuickMode, setIsQuickMode] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showEnhancedUpgradeModal, setShowEnhancedUpgradeModal] = useState(false)
  const [upgradeModalTrigger, setUpgradeModalTrigger] = useState<'limit_reached' | 'feature_locked' | 'manual'>('manual')
  const [upgradeTrigger, setUpgradeTrigger] = useState<'limit_reached' | 'second_generation' | 'manual'>('manual')
  const [showSmartUpgrade, setShowSmartUpgrade] = useState(false)
  const [smartUpgradeTrigger, setSmartUpgradeTrigger] = useState<'before_generation' | 'after_preview' | 'before_download' | 'after_views' | 'return_visit'>('before_generation')

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

    // Check if we should show upgrade prompt BEFORE first generation
    if (usageData && !usageData.is_pro && shouldShowUpgradePrompt('before_generation')) {
      setSmartUpgradeTrigger('before_generation')
      setShowSmartUpgrade(true)
      trackPromptShown('before_generation')
      return
    }

    // Check usage limit BEFORE making API call
    if (usageData && usageData.generation_count >= usageData.max_generations) {
      if (usageData.is_pro) {
        toast.error('Unexpected error. Please contact support.')
      } else {
        // Show enhanced upgrade modal instead of toast
        setUpgradeModalTrigger('limit_reached')
        setShowEnhancedUpgradeModal(true)
      }
      return
    }

    // Track generation
    incrementGenerationCount()

    setIsGenerating(true)
    setGenerateProgress(0)
    setGenerateStep('🔍 Analyzing job requirements...')

    try {
      // Step 1: Preparing
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(15)
      setGenerateStep('📄 Extracting CV content...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(25)
      setGenerateStep('🎯 Matching skills to job description...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerateProgress(35)
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

      // Step 2: AI Processing - spread progress more evenly
      // Start progress updates that continue during API call
      const progressInterval = setInterval(() => {
        setGenerateProgress(prev => {
          if (prev < 85) {
            return prev + 2 // Increment by 2% every interval
          }
          return prev
        })
      }, 1500) // Update every 1.5 seconds
      
      const progressMessages = [
        '✍️ Rewriting work experience...',
        '💼 Tailoring professional summary...',
        '🎓 Optimizing skills section...',
        '🎯 Running ATS optimization...',
        '🔍 Analyzing keyword density...',
        '📊 Calculating ATS score...',
        '✨ Polishing final content...',
        '� Formatting sections...',
        '💫 Adding final touches...',
        '🔥 Almost there...',
        '⚡ Finalizing your masterpiece...'
      ]
      
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        setGenerateStep(progressMessages[messageIndex % progressMessages.length])
        messageIndex++
      }, 3000) // Change message every 3 seconds
      
      // Wait for API response
      const response = await responsePromise
      clearInterval(messageInterval)
      clearInterval(progressInterval)
      
      // Check response status BEFORE parsing JSON
      if (!response.ok) {
        // Handle timeout (504) or other errors
        if (response.status === 504) {
          toast.error('Generation took too long and timed out. Please try again with a shorter job description.')
          throw new Error('Request timeout - please try again')
        }
        
        // Try to parse error as JSON, fallback to text
        const result = await response.json().catch(() => ({ error: 'Generation failed' }))
        
        if (result.limit_reached) {
          setShowUpgradeModal(true)
          toast.error('Free generation limit reached. Upgrade to Pro for unlimited generations!')
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
      
      const result = await response.json()
      
      setGenerateProgress(95)
      setGenerateStep('✨ Finalizing your perfect CV...')

      setGenerateProgress(100)
      setGenerateStep('Complete!')
      toast.success('CV tailored successfully!')
      
      // Check if user just hit their 2nd generation (show upgrade prompt)
      if (usageData && !usageData.is_pro) {
        const newCount = usageData.generation_count + 1
        if (newCount === 2) {
          // Show upgrade prompt after 2nd generation
          setUpgradeTrigger('second_generation')
          setTimeout(() => {
            setShowUpgradePrompt(true)
          }, 1000) // Show after success message
        } else if (newCount >= usageData.max_generations) {
          // Show limit reached prompt
          setUpgradeTrigger('limit_reached')
          setTimeout(() => {
            setShowUpgradePrompt(true)
          }, 1000)
        }
      }
      
      // Small delay to show completion
      setTimeout(() => {
        if (isQuickMode) {
          router.push(`/download/${result.generation_id}`)
        } else {
          router.push(`/review/${result.generation_id}`)
        }
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Stepper */}
      <CVProgressStepper currentStep="generate" />
      
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-400 hover:text-white mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-black text-white">CV Adapter</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">
              Tailor Your CV with AI
            </h1>
            <p className="text-gray-400">
              Enter the job details and let AI optimize your CV for maximum impact
            </p>
          </div>

          {/* CV Selector */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-black text-white">
                    Selected CV: {cvData?.file_meta?.name}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
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
                  <label className="text-sm font-bold text-white">Switch CV:</label>
                  <select
                    value={selectedCvId}
                    onChange={(e) => setSelectedCvId(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 text-sm"
                  >
                    {allCvs.map((cv) => (
                      <option key={cv.id} value={cv.id} className="bg-black">
                        {cv.file_meta?.name} ({new Date(cv.created_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-bold text-white mb-2">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-bold text-white mb-2">
                Job Description *
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Paste the full job description here. Include requirements, responsibilities, and qualifications for best results."
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Tip: Include the full job posting for better keyword matching and ATS optimization
              </p>
            </div>

            {/* Advanced Options */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Settings className="w-4 h-4" />
                  Advanced Options
                  {(rewriteStyle !== 'balanced' || tone !== 'professional' || customSections.length > 0 || outputLanguage !== 'en') && (
                    <span className="text-xs bg-blue-500/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">customised</span>
                  )}
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {showAdvanced && (
                <div className="px-5 py-5 space-y-6 border-t border-white/10">
                  {/* Rewrite Style + Tone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="rewriteStyle" className="block text-sm font-bold text-white mb-2">
                        <Settings className="inline w-4 h-4 mr-1" />
                        Rewrite Style
                      </label>
                      <select
                        id="rewriteStyle"
                        value={rewriteStyle}
                        onChange={(e) => setRewriteStyle(e.target.value as RewriteStyle)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="conservative" className="bg-black">Conservative — Minimal changes</option>
                        <option value="balanced" className="bg-black">Balanced — Moderate optimization</option>
                        <option value="bold" className="bg-black">Bold — Maximum alignment</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        {rewriteStyle === 'conservative' && 'Keeps most original content, adds key terms'}
                        {rewriteStyle === 'balanced' && 'Good balance of optimization and authenticity'}
                        {rewriteStyle === 'bold' && 'Significant changes for strong job alignment'}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="tone" className="block text-sm font-bold text-white mb-2">
                        <Zap className="inline w-4 h-4 mr-1" />
                        Tone
                      </label>
                      <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as ToneType)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="professional" className="bg-black">Professional — Formal business language</option>
                        <option value="friendly" className="bg-black">Friendly — Warm yet professional</option>
                        <option value="creative" className="bg-black">Creative — Dynamic and engaging</option>
                        <option value="technical" className="bg-black">Technical — Precise technical language</option>
                      </select>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Output Language
                    </label>
                    {detectedLanguage && detectedLanguage !== 'en' && (
                      <p className="text-xs text-gray-400 mb-2">
                        Detected: <strong className="text-white">{LANGUAGE_NAMES[detectedLanguage as keyof typeof LANGUAGE_NAMES] || detectedLanguage}</strong>
                      </p>
                    )}
                    <LanguageSelector
                      currentLanguage={outputLanguage}
                      onLanguageChange={setOutputLanguage}
                    />
                  </div>

                  {/* Custom Sections */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      <Plus className="inline w-4 h-4 mr-1" />
                      Custom Sections
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Add additional sections — AI will generate relevant content based on your background.</p>

                    <div className="bg-white/5 rounded-xl p-4 mb-3">
                      <p className="text-xs font-black text-blue-400 mb-2">💡 Popular ideas:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Volunteer Work', 'Publications', 'Awards & Honors', 'Certifications', 'Projects', 'Languages', 'Professional Memberships', 'Speaking Engagements', 'Research', 'Teaching Experience'].map((example) => (
                          <button
                            key={example}
                            onClick={() => {
                              if (!customSections.includes(example)) {
                                setCustomSections([...customSections, example])
                                toast.success(`Added "${example}"`)
                              }
                            }}
                            className="text-xs px-2 py-1 bg-white/10 text-blue-400 border border-blue-500/30 rounded hover:bg-white/20 transition-colors"
                            type="button"
                          >
                            + {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    {customSections.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {customSections.map((section, index) => (
                          <div key={index} className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                            <span>{section}</span>
                            <button onClick={() => removeCustomSection(section)} className="ml-2 hover:text-blue-300" type="button">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddSection ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          placeholder="e.g., Volunteer Work"
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
                        />
                        <button onClick={addCustomSection} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold" type="button">Add</button>
                        <button onClick={() => { setShowAddSection(false); setNewSectionName('') }} className="px-4 py-2 text-gray-400 border border-white/20 rounded-xl hover:bg-white/5" type="button">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowAddSection(true)} className="flex items-center px-4 py-2 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors text-sm" type="button">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Section
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isGenerating || !jobTitle.trim() || !jobDescription.trim()}
                  onClick={() => setIsQuickMode(false)}
                  className="flex-1 bg-white text-black py-4 px-6 rounded-full font-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg"
                >
                  {isGenerating && !isQuickMode ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate CV
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isGenerating || !jobTitle.trim() || !jobDescription.trim()}
                  onClick={() => setIsQuickMode(true)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-full font-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg"
                >
                  {isGenerating && isQuickMode ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Quick Generate
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-500">Quick Generate skips the review page and takes you straight to download</p>
              
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
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">ATS Optimized</h3>
              <p className="text-xs text-gray-400">Keywords matched to job requirements</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Format Preserved</h3>
              <p className="text-xs text-gray-400">Original structure maintained</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Settings className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Customizable</h3>
              <p className="text-xs text-gray-400">Review and edit before download</p>
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

      {/* Smart Upgrade Modal (strategic timing) */}
      <SmartUpgradeModal
        isOpen={showSmartUpgrade}
        onClose={() => setShowSmartUpgrade(false)}
        trigger={smartUpgradeTrigger}
      />

      {/* Upgrade Prompt Modal (after 2nd generation) */}
      <UpgradePromptModal
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        trigger={upgradeTrigger}
        generationsUsed={usageData?.generation_count || 0}
        maxGenerations={usageData?.max_generations || 2}
      />

      {/* Enhanced Upgrade Modal */}
      <EnhancedUpgradeModal
        isOpen={showEnhancedUpgradeModal}
        onClose={() => setShowEnhancedUpgradeModal(false)}
        trigger={upgradeModalTrigger}
      />
    </div>
  )
}
