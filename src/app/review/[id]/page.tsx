'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { CVSection, DiffMetadata } from '@/types/database'
import UpgradeModal from '@/components/UpgradeModal'
import { 
  ArrowLeft, 
  Download, 
  Edit3, 
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  Loader2
} from 'lucide-react'
// Simple diff implementation without external library

// Helper function to format section content properly
const formatSectionContent = (content: any): string => {
  if (typeof content === 'string') {
    return content
  }
  
  // Handle array of experience objects
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (typeof item === 'string') {
        return item
      }
      
      // Handle structured experience objects
      if (typeof item === 'object' && item !== null) {
        const parts = []
        
        // Title line
        if (item.title || item.job_title) {
          const title = item.title || item.job_title
          const company = item.company || ''
          const dates = item.dates || item.duration || ''
          
          if (company && dates) {
            parts.push(`${title} | ${company} | ${dates}`)
          } else if (company) {
            parts.push(`${title} | ${company}`)
          } else {
            parts.push(title)
          }
        }
        
        // Bullets/responsibilities
        if (item.bullets && Array.isArray(item.bullets)) {
          item.bullets.forEach((bullet: string) => {
            parts.push(`• ${bullet}`)
          })
        } else if (item.responsibilities) {
          if (typeof item.responsibilities === 'string') {
            parts.push(item.responsibilities)
          } else if (Array.isArray(item.responsibilities)) {
            item.responsibilities.forEach((resp: string) => {
              parts.push(`• ${resp}`)
            })
          }
        } else if (item.description) {
          parts.push(item.description)
        }
        
        return parts.join('\n')
      }
      
      return String(item)
    }).join('\n\n')
  }
  
  // Handle single object
  if (typeof content === 'object' && content !== null) {
    const parts = []
    
    // Try to extract meaningful text
    if (content.title) parts.push(content.title)
    if (content.content) parts.push(content.content)
    if (content.text) parts.push(content.text)
    if (content.description) parts.push(content.description)
    
    if (parts.length > 0) {
      return parts.join('\n\n')
    }
    
    // Last resort: convert to readable text
    return Object.entries(content)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
  
  return String(content)
}

interface GenerationData {
  id: string
  job_title: string
  job_description: string
  rewrite_style: string
  tone: string
  output_sections: { sections: CVSection[] }
  diff_meta: DiffMetadata
  cv_id: string
  created_at: string
  ats_score?: number
}

interface AIReview {
  overall_assessment: string
  strengths: string[]
  improvements: string[]
  missing_sections: string[]
  keywords_to_add: string[]
  formatting_tips: string[]
}

export default function ReviewPage() {
  const params = useParams()
  const generationId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [generationData, setGenerationData] = useState<GenerationData | null>(null)
  const [originalSections, setOriginalSections] = useState<CVSection[]>([])
  const [editedSections, setEditedSections] = useState<CVSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ lifetime_generation_count: number, max_lifetime_generations: number, plan_type: string } | null>(null)
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isApplyingImprovements, setIsApplyingImprovements] = useState(false)
  const [hasUsedFreeImprovement, setHasUsedFreeImprovement] = useState(false)
  const [generateStep, setGenerateStep] = useState('')

  useEffect(() => {
    fetchGenerationData()
  }, [generationId])

  const fetchGenerationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch generation data
      const { data: generation, error: genError } = await supabase
        .from('generations')
        .select('*, ats_score')
        .eq('id', generationId)
        .eq('user_id', user.id)
        .single()

      if (genError || !generation) {
        toast.error('Generation not found')
        router.push('/dashboard')
        return
      }

      // Fetch original CV data
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .select('parsed_sections')
        .eq('id', generation.cv_id)
        .eq('user_id', user.id)
        .single()

      if (cvError || !cvData) {
        toast.error('Original CV not found')
        router.push('/dashboard')
        return
      }

      setGenerationData(generation)
      const originalSecs: CVSection[] = cvData.parsed_sections.sections || []
      const generatedSecs: CVSection[] = generation.output_sections.sections || []
      
      // Merge: use generated sections where they exist, otherwise use original
      const mergedSections = originalSecs.map((originalSection: CVSection) => {
        const generatedSection = generatedSecs.find((s: CVSection) => s.type === originalSection.type)
        return generatedSection || originalSection
      })
      
      // Add any generated sections that don't exist in original
      generatedSecs.forEach((genSection: CVSection) => {
        if (!originalSecs.find((s: CVSection) => s.type === genSection.type)) {
          mergedSections.push(genSection)
        }
      })
      
      setOriginalSections(originalSecs)
      setEditedSections(mergedSections)
      
      // Fetch usage info to show upgrade prompt if needed
      const { data: usage, error: usageError } = await supabase
        .from('usage_tracking')
        .select('lifetime_generation_count, max_lifetime_generations, plan_type')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (usage && !usageError) {
        setUsageInfo(usage)
        
        // Show upgrade modal after first generation for free users
        if (usage.plan_type === 'free' && usage.lifetime_generation_count === 1) {
          // Delay modal to let user see their result first
          setTimeout(() => {
            setShowUpgradeModal(true)
          }, 3000)
        }
      }
      
      // Check if user has used their free improvement
      const { data: improvementData } = await supabase
        .from('ai_improvements')
        .select('id')
        .eq('user_id', user.id)
        .single()

      setHasUsedFreeImprovement(!!improvementData)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching generation data:', error)
      toast.error('Failed to load generation data')
      setIsLoading(false)
    }
  }

  const handleSectionEdit = (sectionType: string, newContent: string) => {
    setEditedSections(prev => 
      prev.map(section => 
        section.type === sectionType 
          ? { ...section, content: newContent }
          : section
      )
    )
  }

  const handleRevertSection = (sectionType: string) => {
    const originalSection = originalSections.find(s => s.type === sectionType)
    if (!originalSection) {
      toast.error('Original section not found')
      return
    }

    setEditedSections(prev =>
      prev.map(section =>
        section.type === sectionType
          ? { ...section, content: originalSection.content }
          : section
      )
    )
    
    toast.success(`${sectionType.replace('_', ' ')} reverted to original`)
  }

  const handleSaveChanges = async () => {
    if (!generationData) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('generations')
        .update({
          output_sections: { sections: editedSections },
          updated_at: new Date().toISOString()
        })
        .eq('id', generationId)

      if (error) {
        toast.error('Failed to save changes')
      } else {
        toast.success('Changes saved successfully!')
        setEditingSection(null)
      }
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const createDiff = (original: string, modified: string) => {
    // Simple diff - just show original and modified side by side
    // For now, we'll highlight the entire text if it's different
    if (original === modified) {
      return <span>{original}</span>
    }
    
    return (
      <div className="space-y-2">
        <div className="bg-red-50 p-2 rounded border-l-4 border-red-200">
          <div className="text-xs text-red-600 font-medium mb-1">Original:</div>
          <div className="text-red-800">{original}</div>
        </div>
        <div className="bg-green-50 p-2 rounded border-l-4 border-green-200">
          <div className="text-xs text-green-600 font-medium mb-1">Updated:</div>
          <div className="text-green-800">{modified}</div>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    if (generationData) {
      router.push(`/download/${generationData.id}`)
    }
  }

  const handleAIReview = async () => {
    setIsReviewing(true)
    setGenerateStep('🔍 Analyzing your CV...')
    
    try {
      // Simulate progress updates
      setTimeout(() => setGenerateStep('📊 Evaluating ATS compatibility...'), 2000)
      setTimeout(() => setGenerateStep('💡 Identifying improvements...'), 4000)
      setTimeout(() => setGenerateStep('🎯 Checking keyword optimization...'), 6000)
      setTimeout(() => setGenerateStep('✨ Finalizing review...'), 8000)
      
      const response = await fetch('/api/review-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generation_id: generationId
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to review CV')
        return
      }

      setAiReview(result.review)
      setShowReview(true)
      toast.success('AI review complete!')
    } catch (error) {
      console.error('Review error:', error)
      toast.error('Failed to review CV')
    } finally {
      setIsReviewing(false)
      setGenerateStep('')
    }
  }

  const handleApplyImprovements = async () => {
    if (!aiReview) return

    if (hasUsedFreeImprovement) {
      toast.error('You have already used your free AI improvement. Upgrade to Pro for unlimited improvements!')
      return
    }

    setIsApplyingImprovements(true)
    setGenerateStep('🔧 Preparing improvements...')
    
    try {
      // Simulate progress updates
      setTimeout(() => setGenerateStep('📝 Rewriting sections...'), 2000)
      setTimeout(() => setGenerateStep('🎯 Adding missing sections...'), 4000)
      setTimeout(() => setGenerateStep('💡 Emphasizing keywords...'), 6000)
      setTimeout(() => setGenerateStep('🎨 Applying formatting tips...'), 8000)
      setTimeout(() => setGenerateStep('✨ Finalizing improvements...'), 10000)
      
      const response = await fetch('/api/apply-improvements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generation_id: generationId,
          improvements: aiReview.improvements,
          missing_sections: aiReview.missing_sections,
          keywords: aiReview.keywords_to_add,
          formatting_tips: aiReview.formatting_tips
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to apply improvements')
        return
      }

      // Update sections with improved content
      setEditedSections(result.sections)
      setHasUsedFreeImprovement(true)
      toast.success('Improvements applied successfully! Your CV has been updated.')
      
      // Refresh the page to show updated content
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Apply improvements error:', error)
      toast.error('Failed to apply improvements')
    } finally {
      setIsApplyingImprovements(false)
      setGenerateStep('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!generationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generation Not Found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upgrade Modal */}
      {usageInfo && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger="first_generation"
          currentUsage={usageInfo.lifetime_generation_count}
          maxGenerations={usageInfo.max_lifetime_generations}
        />
      )}
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
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
            
            <div className="flex items-center space-x-3">
              {generationData.ats_score && (
                <div className={`flex items-center px-3 py-2 rounded-lg font-semibold text-sm ${
                  generationData.ats_score >= 80 ? 'bg-green-100 text-green-800' :
                  generationData.ats_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1.5" />
                  ATS: {generationData.ats_score}%
                </div>
              )}
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={handleAIReview}
                  disabled={isReviewing}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Review
                    </>
                  )}
                </button>
                {isReviewing && generateStep && (
                  <div className="text-xs text-gray-600 animate-pulse">
                    {generateStep}
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Generation Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">CV Tailored Successfully!</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Title</h3>
              <p className="text-gray-700">{generationData.job_title}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-700">
                {generationData.rewrite_style} style, {generationData.tone} tone
              </p>
            </div>
          </div>

          {generationData.diff_meta?.summary && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Summary of Changes</h3>
              <p className="text-blue-800">{generationData.diff_meta.summary}</p>
            </div>
          )}
        </div>

        {/* AI Review Panel */}
        {showReview && aiReview && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 mb-8 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Expert Review</h2>
                  <p className="text-sm text-gray-600">Personalized feedback for your CV</p>
                </div>
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Overall Assessment */}
            <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Overall Assessment</h3>
                  <p className="text-gray-700">{aiReview.overall_assessment}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Strengths */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {aiReview.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {aiReview.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-orange-600 flex-shrink-0">→</span>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Missing Sections */}
              {aiReview.missing_sections.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Missing Sections</h4>
                  <ul className="space-y-1">
                    {aiReview.missing_sections.map((section, index) => (
                      <li key={index} className="text-xs text-gray-600">• {section}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords to Add */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Keywords to Emphasize</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiReview.keywords_to_add.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formatting Tips */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Formatting Tips</h4>
                <ul className="space-y-1">
                  {aiReview.formatting_tips.map((tip, index) => (
                    <li key={index} className="text-xs text-gray-600">• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleApplyImprovements}
                disabled={isApplyingImprovements || hasUsedFreeImprovement}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
              >
                <div className="flex items-center">
                  {isApplyingImprovements ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Applying Improvements...
                    </>
                  ) : hasUsedFreeImprovement ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Free Improvement Used
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Apply All Improvements (1 Free!)
                    </>
                  )}
                </div>
                {isApplyingImprovements && generateStep && (
                  <div className="text-xs mt-2 text-green-100 animate-pulse">
                    {generateStep}
                  </div>
                )}
              </button>
              
              <div className="p-3 bg-purple-100 rounded-lg">
                <p className="text-xs text-purple-800 text-center">
                  {hasUsedFreeImprovement ? (
                    <>🎉 You've used your free AI improvement! Upgrade to Pro for unlimited improvements.</>
                  ) : (
                    <>💡 Get 1 FREE AI improvement! This will apply all suggestions above and update your CV automatically.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section-by-Section Review */}
        <div className="space-y-6">
          {editedSections.map((section, index) => {
            const originalSection = originalSections.find(s => s.type === section.type);
            const isEditing = editingSection === section.type;
            const hasChanges = originalSection && originalSection.content !== section.content;
            return (
              <div key={`${section.type}-${index}`} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {section.type.replace('_', ' ')}
                    </h3>
                    {hasChanges && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Modified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {hasChanges && (
                      <button
                        onClick={() => handleRevertSection(section.type)}
                        className="flex items-center px-3 py-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Revert to original"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Revert
                      </button>
                    )}
                    <button
                      onClick={() => setEditingSection(isEditing ? null : section.type)}
                      className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isEditing ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edit {section.type.replace('_', ' ')}
                      </label>
                      <textarea
                        value={formatSectionContent(section.content)}
                        onChange={(e) => handleSectionEdit(section.type, e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  ) : hasChanges ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Original</h4>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap border border-gray-200 leading-relaxed">
                          {formatSectionContent(originalSection?.content || '')}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">AI Generated</h4>
                        </div>
                        <div className="p-5 bg-blue-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap border border-blue-200 leading-relaxed">
                          {formatSectionContent(section.content)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap border border-gray-200 leading-relaxed">
                      {formatSectionContent(section.content)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
            {!showReview && (
              <button
                onClick={handleAIReview}
                disabled={isReviewing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Review
                  </>
                )}
              </button>
            )}
            <Link
              href={`/edit/${generationData.cv_id}`}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Edit CV in Editor
            </Link>
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Tailored CV
            </button>
            <Link
              href={`/generate/${generationData.cv_id}`}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Generate Another Version
            </Link>
          </div>
      </div>
    </div>
  )
}
