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
  RotateCcw
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
      if (item.company && item.job_title) {
        // Format as experience entry
        const title = `${item.job_title} | ${item.company}`
        const responsibilities = item.responsibilities || item.description || ''
        return `${title}\n${responsibilities}`
      }
      return JSON.stringify(item, null, 2)
    }).join('\n\n')
  }
  
  // Fallback to JSON for other objects
  return JSON.stringify(content, null, 2)
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
        .select('*')
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
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('lifetime_generation_count, max_lifetime_generations, plan_type')
        .eq('user_id', user.id)
        .single()
      
      if (usage) {
        setUsageInfo(usage)
        
        // Show upgrade modal after first generation for free users
        if (usage.plan_type === 'free' && usage.lifetime_generation_count === 1) {
          // Delay modal to let user see their result first
          setTimeout(() => {
            setShowUpgradeModal(true)
          }, 3000)
        }
      }
      
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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/cover-letter/${generationId}`}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Cover Letter
              </Link>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
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

        {/* Section-by-Section Review */}
        <div className="space-y-6">
          {editedSections.map((section, index) => {
            const originalSection = originalSections.find(s => s.type === section.type)
            const isEditing = editingSection === section.type
            const hasChanges = originalSection && originalSection.content !== section.content

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
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : hasChanges ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                          {formatSectionContent(originalSection?.content || '')}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Generated</h4>
                        <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                          {formatSectionContent(section.content)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                      {formatSectionContent(section.content)}
                    </div>
                  )}

                  {hasChanges && !isEditing && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Changes Made</h4>
                      <div className="text-sm text-yellow-700">
                        {createDiff(originalSection?.content || '', section.content)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
