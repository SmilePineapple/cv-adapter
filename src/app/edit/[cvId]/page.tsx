'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Download,
  Plus,
  GripVertical,
  Settings,
  Palette,
  Type,
  Layout,
  Loader2,
  FileText,
  Sparkles,
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

// Helper function to safely get string content from section
const getSectionContent = (section: any): string => {
  if (!section) return ''
  
  const content = section.content?.raw_content || section.content || ''
  
  // If content is an array (like experience), format it
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (item.company && item.job_title) {
        return `${item.job_title} | ${item.company}\n${item.responsibilities || item.description || ''}`
      }
      return JSON.stringify(item)
    }).join('\n\n')
  }
  
  // If content is an object, stringify it
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2)
  }
  
  // Return as string
  return String(content)
}

interface CVSection {
  id: string
  type: string
  title: string
  content: any
  order: number
  metadata?: any
}

interface CVData {
  id: string
  file_meta: any
  sections: CVSection[]
  theme_settings: any
}

export default function CVEditorPage() {
  const params = useParams()
  const cvId = params.cvId as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()
  
  // Check if we're editing a generation
  const generationId = searchParams.get('generation')

  // Core state
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Editor state
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'print' | 'mobile'>('desktop')
  const [deletingSection, setDeletingSection] = useState<string | null>(null)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [showAiOptions, setShowAiOptions] = useState(false)
  const [aiUsageCount, setAiUsageCount] = useState(0)
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free')
  const [showExportOptions, setShowExportOptions] = useState(false)

  // Undo/Redo state
  const [history, setHistory] = useState<CVData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    fetchCVData()
    fetchAiUsage()
  }, [cvId])

  const fetchAiUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()

      setUserPlan(subscription?.status === 'active' ? 'pro' : 'free')

      const today = new Date().toISOString().split('T')[0]
      const { data: usage, error } = await supabase
        .from('ai_usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_type', 'section_populate')
        .eq('usage_date', today)
        .single()

      // Silently handle if table doesn't exist
      if (!error || error.code === 'PGRST116') {
        setAiUsageCount(usage?.usage_count || 0)
      }
    } catch (error) {
      // Silently fail - AI usage tracking is optional
    }
  }

  const fetchCVData = async () => {
    try {
      console.log('🔍 CV Editor - Loading CV ID:', cvId)
      if (generationId) {
        console.log('📝 Editing generation:', generationId)
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      let sectionsData: any[] = []
      
      // Load original CV sections first
      console.log('📥 Fetching CV sections for:', cvId)
      const { data: cvSections, error: sectionsError } = await supabase
        .from('cv_sections')
        .select('*')
        .eq('cv_id', cvId)
        .order('order_index')

      if (sectionsError || !cvSections || cvSections.length === 0) {
        // Fallback: migrate from old format
        await migrateCVToSections()
        return
      }
      
      sectionsData = cvSections

      // If editing a generation, merge the modified sections
      if (generationId) {
        console.log('📥 Fetching generation sections for:', generationId)
        const { data: generationData, error: genError } = await supabase
          .from('generations')
          .select('output_sections')
          .eq('id', generationId)
          .eq('user_id', user.id)
          .single()
        
        if (genError || !generationData) {
          toast.error('Generation not found')
          router.push('/dashboard')
          return
        }
        
        // Get modified sections from generation
        const outputSections = generationData.output_sections?.sections || []
        console.log('🔄 Merging generation sections:', outputSections)
        
        // Replace original sections with modified ones
        outputSections.forEach((modifiedSection: any) => {
          const sectionType = modifiedSection.type.toLowerCase()
          const existingIndex = sectionsData.findIndex(
            s => s.section_type.toLowerCase() === sectionType
          )
          
          if (existingIndex >= 0) {
            // Replace existing section
            sectionsData[existingIndex] = {
              ...sectionsData[existingIndex],
              content: modifiedSection.content,
              title: modifiedSection.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
            }
          } else {
            // Add new section
            sectionsData.push({
              id: `gen-${modifiedSection.type}`,
              cv_id: cvId,
              section_type: modifiedSection.type,
              title: modifiedSection.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              content: modifiedSection.content,
              order_index: modifiedSection.order || sectionsData.length,
              metadata: {}
            })
          }
        })
        
        console.log('✅ Merged', outputSections.length, 'modified sections into', sectionsData.length, 'total sections')
      }

      // Get CV metadata
      const { data: cvMeta, error: cvError } = await supabase
        .from('cvs')
        .select('id, file_meta')
        .eq('id', cvId)
        .eq('user_id', user.id)
        .single()

      if (cvError || !cvMeta) {
        console.error('❌ CV not found for ID:', cvId)
        toast.error('CV not found')
        router.push('/dashboard')
        return
      }

      console.log('✅ Loaded CV:', cvMeta.file_meta?.name || 'Unknown CV')

      // Get latest version for theme settings
      const { data: versionData } = await supabase
        .from('cv_versions')
        .select('theme_settings')
        .eq('cv_id', cvId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      console.log('📊 Sections data:', sectionsData)
      
      // Deduplicate sections by type (keep the first occurrence)
      const seenTypes = new Set()
      const uniqueSections = sectionsData.filter(section => {
        const type = section.section_type?.toLowerCase()
        if (seenTypes.has(type)) {
          console.log('🗑️ Removing duplicate section:', type)
          return false
        }
        seenTypes.add(type)
        return true
      })
      
      console.log('✅ Deduplicated:', sectionsData.length, '→', uniqueSections.length, 'sections')
      
      const cvData: CVData = {
        id: cvMeta.id,
        file_meta: cvMeta.file_meta,
        sections: uniqueSections.map(section => ({
          id: section.id,
          type: section.section_type,
          title: section.title || section.section_type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          content: section.content,
          order: section.order_index,
          metadata: section.metadata || {}
        })),
        theme_settings: versionData?.theme_settings || {
          font: 'Inter',
          fontSize: 12,
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            background: '#ffffff'
          }
        }
      }
      
      console.log('📦 Final cvData:', cvData)
      console.log('🎯 Setting cvData state...')
      setCvData(cvData)
      // Initialize history
      setHistory([cvData])
      setHistoryIndex(0)
      console.log('State set successfully')

    } catch (error) {
      console.error('Error fetching CV:', error)
      toast.error('Failed to load CV')
      router.push('/dashboard')
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const migrateCVToSections = async () => {
    try {
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/migrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Migration successful:', result)
        // Retry fetching after migration
        setTimeout(() => fetchCVData(), 1000)
      } else {
        const errorData = await response.json()
        console.error('Migration failed:', errorData)
        throw new Error(errorData.error || 'Migration failed')
      }
    } catch (error) {
      console.error('Migration error:', error)
      toast.error('Failed to prepare CV for editing')
      router.push('/history')
    }
  }

  const saveChanges = async () => {
    if (!cvData) return

    setIsSaving(true)
    try {
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          sections: cvData.sections,
          theme_settings: cvData.theme_settings,
        }),
      })

      if (response.ok) {
        setHasUnsavedChanges(false)
        toast.success('Changes saved successfully')
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const addToHistory = (newData: CVData) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setHasUnsavedChanges(true)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCvData(history[newIndex])
      setHasUnsavedChanges(true)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCvData(history[newIndex])
      setHasUnsavedChanges(true)
    }
  }

  const updateSection = (sectionId: string, updates: Partial<CVSection>) => {
    if (!cvData) return

    const newSections = cvData.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    )

    const newData = { ...cvData, sections: newSections }
    setCvData(newData)
    addToHistory(newData)
  }

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    if (!cvData) return

    const newSections = [...cvData.sections]
    const draggedSection = newSections[dragIndex]
    
    newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, draggedSection)
    
    // Update order indices
    newSections.forEach((section, index) => {
      section.order = index
    })

    const newData = { ...cvData, sections: newSections }
    setCvData(newData)
    addToHistory(newData)
  }

  const handleDragStart = (e: React.DragEvent, sectionId: string, index: number) => {
    setDraggedSection(sectionId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', sectionId)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (!draggedSection || !cvData) return
    
    const dragIndex = cvData.sections.findIndex(s => s.id === draggedSection)
    if (dragIndex === -1 || dragIndex === dropIndex) return
    
    reorderSections(dragIndex, dropIndex)
    setDraggedSection(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedSection(null)
    setDragOverIndex(null)
  }

  const deleteSection = async (sectionId: string) => {
    if (!cvData) return

    setDeletingSection(sectionId)
    
    try {
      // Remove from local state
      const newSections = cvData.sections.filter(s => s.id !== sectionId)
      const newData = { ...cvData, sections: newSections }
      setCvData(newData)
      addToHistory(newData)

      // Clear selection if deleted section was selected
      if (selectedSection === sectionId) {
        setSelectedSection(null)
      }

      // Delete from database
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/section/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
      })

      if (response.ok) {
        toast.success('Section deleted successfully')
      } else {
        toast.error('Failed to delete section from database')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete section')
    } finally {
      setDeletingSection(null)
    }
  }

  const addSection = async (sectionType: string, title: string, useAI: boolean = false) => {
    if (!cvData) return

    try {
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          type: sectionType,
          title: title,
          source: useAI ? 'ai' : 'blank'
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Add to local state
        const newSection: CVSection = {
          id: result.section_id,
          type: sectionType,
          title: title,
          content: { raw_content: result.content || '', format: 'text' },
          order: cvData.sections.length,
          metadata: { ai_generated: useAI }
        }

        const newSections = [...cvData.sections, newSection]
        const newData = { ...cvData, sections: newSections }
        setCvData(newData)
        addToHistory(newData)
        setSelectedSection(newSection.id)
        
        toast.success('Section added successfully')
      } else {
        throw new Error('Failed to add section')
      }
    } catch (error) {
      console.error('Add section error:', error)
      toast.error('Failed to add section')
    }
  }

  const handleAiPopulate = async (style: string) => {
    if (!selectedSection || !cvData) return
    
    // Check AI usage limits for free users
    if (userPlan === 'free' && aiUsageCount >= 10) {
      toast.error('You\'ve reached your AI generation limit (10/10). Upgrade to Pro for unlimited AI generations!')
      return
    }
    
    const section = cvData.sections.find(s => s.id === selectedSection)
    if (!section) return

    setIsAiGenerating(true)

    try {
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/ai-populate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          section_id: selectedSection,
          section_type: section.type,
          section_title: section.title,
          style: style,
          existing_content: section.content?.raw_content || ''
        }),
      })

      if (response.ok) {
        const result = await response.json()
        updateSection(selectedSection, { 
          content: { 
            raw_content: result.content, 
            format: 'text' 
          } 
        })
        
        // Show different success messages based on style
        const messages = {
          compact: 'Content made more compact!',
          detailed: 'Added detailed content!',
          professional: 'Content made more professional!',
          friendly: 'Content made more friendly!',
          expand: 'Added more content!',
          improve: 'Content improved!'
        }
        
        toast.success(messages[style as keyof typeof messages] || 'Section populated with AI content!')
        
        // Increment AI usage count for free users
        if (userPlan === 'free') {
          setAiUsageCount(prev => prev + 1)
        }
      } else {
        throw new Error('AI populate failed')
      }
    } catch (error) {
      console.error('AI populate error:', error)
      toast.error('Failed to generate AI content')
    } finally {
      setIsAiGenerating(false)
    }
  }

  const addSectionWithTemplate = async (sectionType: string, title: string, templateContent: string) => {
    if (!cvData) return

    try {
      // Get next order index
      const nextOrder = cvData.sections.length

      // Create section locally first
      const newSection: CVSection = {
        id: `temp-${Date.now()}`, // Temporary ID
        type: sectionType,
        title: title,
        content: { raw_content: templateContent, format: 'text' },
        order: nextOrder,
        metadata: { template_used: true }
      }

      // Add to local state immediately
      const newSections = [...cvData.sections, newSection]
      const newData = { ...cvData, sections: newSections }
      setCvData(newData)
      addToHistory(newData)
      setSelectedSection(newSection.id)

      // Then save to database
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          type: sectionType,
          title: title,
          content: templateContent,
          source: 'template'
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Update with real ID from database
        updateSection(newSection.id, { id: result.section_id })
        toast.success('Section added from template!')
      } else {
        // Remove from local state if save failed
        const filteredSections = cvData.sections.filter(s => s.id !== newSection.id)
        const revertData = { ...cvData, sections: filteredSections }
        setCvData(revertData)
        toast.error('Failed to save section template')
      }
    } catch (error) {
      console.error('Template section error:', error)
      toast.error('Failed to add section template')
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!cvData) return

    try {
      setShowExportOptions(false)
      
      // Show message for PDF
      if (format === 'pdf') {
        toast.info('Downloading as DOCX (you can convert to PDF in Word)')
      }
      
      const session = await supabase.auth.getSession()
      const response = await fetch(`/api/cv/${cvId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          format: format,
          sections: cvData.sections,
          theme_settings: cvData.theme_settings
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Remove existing extension from filename
        const baseFilename = cvData.file_meta?.name?.replace(/\.(docx|pdf|txt)$/i, '') || 'CV'
        a.download = `${baseFilename}.${format}`
        
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`CV exported as ${format.toUpperCase()} successfully!`)
      } else if (response.status === 501) {
        const errorData = await response.json()
        toast.error(errorData.error || 'Export format not available')
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Failed to export CV as ${format.toUpperCase()}`)
    }
  }

  console.log('🎨 Render - isLoading:', isLoading, 'cvData:', cvData)

  if (isLoading) {
    console.log('📺 Rendering loading screen')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading CV Editor...</p>
        </div>
      </div>
    )
  }

  if (!cvData) {
    console.log('📺 Rendering CV not found screen')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CV Not Found</h2>
          <p className="text-gray-600 mb-4">The CV you're trying to edit could not be loaded.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  console.log('📺 Rendering main editor UI')

  try {
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {generationId ? (
                    <>Editing Generated CV: {cvData.file_meta?.name || 'Untitled CV'}</>
                  ) : (
                    <>Editing: {cvData.file_meta?.name || 'Untitled CV'}</>
                  )}
                </h1>
                <p className="text-sm text-gray-500">
                  {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-gray-300" />

              {/* Preview Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {(['desktop', 'print', 'mobile'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      previewMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              {/* Actions */}
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Theme Settings"
              >
                <Palette className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Export CV"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                {showExportOptions && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <button
                      onClick={() => handleDownload('docx')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      DOCX
                    </button>
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload('txt')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      TXT
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={saveChanges}
                disabled={isSaving || !hasUnsavedChanges}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Sections */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
              <button
                onClick={() => setShowAddSection(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add Section"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {cvData.sections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSection === section.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${
                    draggedSection === section.id
                      ? 'opacity-50 scale-95'
                      : ''
                  } ${
                    dragOverIndex === index && draggedSection !== section.id
                      ? 'border-green-400 bg-green-50'
                      : ''
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{section.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{section.type}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {section.content?.raw_content ? 
                          `${section.content.raw_content.substring(0, 50)}...` : 
                          'No content'
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {selectedSection === section.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Are you sure you want to delete the "${section.title}" section?`)) {
                            deleteSection(section.id)
                          }
                        }}
                        disabled={deletingSection === section.id}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete section"
                      >
                        {deletingSection === section.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
          <div className={`mx-auto bg-white shadow-lg rounded-lg ${
            previewMode === 'desktop' ? 'max-w-4xl' :
            previewMode === 'print' ? 'w-[8.5in]' :
            'max-w-sm'
          }`}>
            <div 
              className="p-8 relative"
              style={{ 
                backgroundColor: cvData.theme_settings?.colors?.background || '#ffffff',
                fontFamily: cvData.theme_settings?.font || 'Inter'
              }}
            >
              {/* CV Header */}
              <div 
                className="text-center mb-8 pb-6 border-b-2"
                style={{ 
                  borderColor: cvData.theme_settings?.colors?.primary || '#e5e7eb',
                  fontFamily: cvData.theme_settings?.font || 'Inter'
                }}
              >
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ 
                    color: cvData.theme_settings?.colors?.primary || '#1f2937',
                    fontSize: cvData.theme_settings?.fontSize ? `${cvData.theme_settings.fontSize + 8}pt` : '30px',
                    fontFamily: cvData.theme_settings?.font || 'Inter'
                  }}
                >
                  {cvData.sections.find(s => s.type === 'name')?.content?.raw_content || 
                   cvData.file_meta?.name?.replace('.docx', '').replace('.pdf', '') || 
                   'Your Name'}
                </h1>
                <p 
                  className="text-lg"
                  style={{ 
                    color: cvData.theme_settings?.colors?.secondary || '#6b7280',
                    fontFamily: cvData.theme_settings?.font || 'Inter'
                  }}
                >
                  Professional CV
                </p>
              </div>

              {/* Render sections with intelligent layout */}
              <div className="space-y-6">
                {cvData.sections
                  .filter(section => section.type !== 'name')
                  .map((section, index) => {
                    const alignment = section.metadata?.alignment || 'left'
                    const fontSize = section.metadata?.fontSize || 'normal'
                    const textColor = section.metadata?.textColor || '#374151'
                    
                    const fontSizeClasses = {
                      small: 'text-sm',
                      normal: 'text-base',
                      large: 'text-lg'
                    }

                    // Check if this is the first section and there are top-right sections
                    const topRightSections = cvData.sections.filter(s => s.metadata?.alignment === 'top-right')
                    const isFirstSection = index === 0
                    const hasTopRightSections = topRightSections.length > 0
                    const shouldShareSpace = isFirstSection && hasTopRightSections && alignment !== 'top-right'
                    
                    if (alignment === 'top-right') {
                      return (
                        <div key={section.id} className="absolute top-0 right-0 w-1/3 z-10 mt-8">
                          <div
                            className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm border-2 border-dashed border-transparent hover:border-blue-300 transition-colors cursor-pointer ${
                              selectedSection === section.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedSection(section.id)}
                            style={{ color: textColor }}
                          >
                            <h2 className="font-semibold text-gray-900 mb-2 capitalize text-sm">
                              {section.title}
                            </h2>
                            <div 
                              className="text-gray-700 whitespace-pre-line leading-relaxed text-sm"
                              style={{ color: textColor }}
                              dangerouslySetInnerHTML={{
                                __html: getSectionContent(section)
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/__(.*?)__/g, '<u>$1</u>')
                                  .replace(/\n/g, '<br>')
                              }}
                            />
                            {(!section.content?.raw_content && !section.content) && (
                              <span className="text-gray-400 italic text-xs">Click to add content...</span>
                            )}
                            {selectedSection === section.id && (
                              <div className="mt-2 text-xs text-blue-600 font-medium">
                                ← Edit in Properties panel
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    }

                    const alignmentClasses = {
                      left: 'w-full',
                      center: 'w-full text-center',
                      right: 'w-full text-right',
                      inline: 'inline-block w-1/2 pr-4'
                    }
                    
                    return (
                      <div 
                        key={section.id}
                        className={shouldShareSpace ? 'relative' : ''}
                        style={{ 
                          marginRight: shouldShareSpace ? '35%' : '0',
                          minHeight: shouldShareSpace ? '250px' : 'auto',
                          marginBottom: shouldShareSpace ? '1rem' : '0'
                        }}
                      >
                        <div
                          className={`p-4 rounded-lg border-2 border-dashed border-transparent hover:border-blue-300 transition-colors cursor-pointer ${
                            selectedSection === section.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          } ${alignmentClasses[alignment as keyof typeof alignmentClasses]}`}
                          onClick={() => setSelectedSection(section.id)}
                          style={{ 
                            color: textColor,
                            fontFamily: cvData.theme_settings?.font || 'Inter',
                            fontSize: cvData.theme_settings?.fontSize ? `${cvData.theme_settings.fontSize}pt` : undefined
                          }}
                        >
                          <h2 
                            className={`font-semibold mb-3 capitalize border-b border-gray-200 pb-2 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
                            style={{ color: cvData.theme_settings?.colors?.primary || '#1f2937' }}
                          >
                            {section.title}
                          </h2>
                          <div 
                            className={`whitespace-pre-line leading-relaxed ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
                            style={{ color: textColor }}
                            dangerouslySetInnerHTML={{
                              __html: getSectionContent(section)
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/__(.*?)__/g, '<u>$1</u>')
                                .replace(/\n/g, '<br>')
                            }}
                          />
                          {(!section.content?.raw_content && !section.content) && (
                            <span className="text-gray-400 italic">Click to add content...</span>
                          )}
                          {selectedSection === section.id && (
                            <div className="mt-2 text-xs text-blue-600 font-medium">
                              ← Click in Properties panel to edit
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedSection ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={cvData.sections.find(s => s.id === selectedSection)?.title || ''}
                    onChange={(e) => updateSection(selectedSection, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Section Layout Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Layout
                  </label>
                  <select
                    value={cvData.sections.find(s => s.id === selectedSection)?.metadata?.alignment || 'left'}
                    onChange={(e) => {
                      const currentSection = cvData.sections.find(s => s.id === selectedSection)
                      updateSection(selectedSection, { 
                        metadata: { 
                          ...currentSection?.metadata, 
                          alignment: e.target.value 
                        } 
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="left">Full Width (Left)</option>
                    <option value="center">Center Aligned</option>
                    <option value="right">Right Aligned</option>
                    <option value="top-right">Top Right (Contact Style)</option>
                    <option value="inline">Inline with Previous</option>
                  </select>
                </div>

                {/* Text Formatting Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Formatting
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => {
                        const textarea = document.getElementById('sectionContent') as HTMLTextAreaElement
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const selectedText = textarea.value.substring(start, end)
                          const newText = textarea.value.substring(0, start) + 
                            `**${selectedText}**` + 
                            textarea.value.substring(end)
                          updateSection(selectedSection, { 
                            content: { 
                              raw_content: newText, 
                              format: 'text' 
                            } 
                          })
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border font-bold"
                    >
                      B
                    </button>
                    <button
                      onClick={() => {
                        const textarea = document.getElementById('sectionContent') as HTMLTextAreaElement
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const selectedText = textarea.value.substring(start, end)
                          const newText = textarea.value.substring(0, start) + 
                            `*${selectedText}*` + 
                            textarea.value.substring(end)
                          updateSection(selectedSection, { 
                            content: { 
                              raw_content: newText, 
                              format: 'text' 
                            } 
                          })
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border italic"
                    >
                      I
                    </button>
                    <button
                      onClick={() => {
                        const textarea = document.getElementById('sectionContent') as HTMLTextAreaElement
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const selectedText = textarea.value.substring(start, end)
                          const newText = textarea.value.substring(0, start) + 
                            `__${selectedText}__` + 
                            textarea.value.substring(end)
                          updateSection(selectedSection, { 
                            content: { 
                              raw_content: newText, 
                              format: 'text' 
                            } 
                          })
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border underline"
                    >
                      U
                    </button>
                    <button
                      onClick={() => {
                        const textarea = document.getElementById('sectionContent') as HTMLTextAreaElement
                        if (textarea) {
                          const cursorPos = textarea.selectionStart
                          const newText = textarea.value.substring(0, cursorPos) + 
                            '\n• ' + 
                            textarea.value.substring(cursorPos)
                          updateSection(selectedSection, { 
                            content: { 
                              raw_content: newText, 
                              format: 'text' 
                            } 
                          })
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                    >
                      •
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                      <select
                        value={cvData.sections.find(s => s.id === selectedSection)?.metadata?.fontSize || 'normal'}
                        onChange={(e) => {
                          const currentSection = cvData.sections.find(s => s.id === selectedSection)
                          updateSection(selectedSection, { 
                            metadata: { 
                              ...currentSection?.metadata, 
                              fontSize: e.target.value 
                            } 
                          })
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="small">Small</option>
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={cvData.sections.find(s => s.id === selectedSection)?.metadata?.textColor || '#374151'}
                        onChange={(e) => {
                          const currentSection = cvData.sections.find(s => s.id === selectedSection)
                          updateSection(selectedSection, { 
                            metadata: { 
                              ...currentSection?.metadata, 
                              textColor: e.target.value 
                            } 
                          })
                        }}
                        className="w-full h-8 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="sectionContent"
                    value={
                      cvData.sections.find(s => s.id === selectedSection)?.content?.raw_content ||
                      cvData.sections.find(s => s.id === selectedSection)?.content ||
                      ''
                    }
                    onChange={(e) => updateSection(selectedSection, { 
                      content: { 
                        raw_content: e.target.value, 
                        format: 'text' 
                      } 
                    })}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter content for this section..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use line breaks to separate paragraphs and bullet points
                  </p>
                </div>

                <div className="space-y-3">
                  {userPlan === 'free' ? (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            AI Section Population - Pro Feature
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Upgrade to Pro to use AI to automatically populate sections with professional content tailored to your experience.
                          </p>
                          <Link
                            href="/subscription"
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Upgrade to Pro
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowAiOptions(!showAiOptions)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Populate
                      </button>

                      {showAiOptions && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">AI Generation Options</h4>
                        {userPlan === 'free' && (
                          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                            {aiUsageCount}/10 used
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAiPopulate('compact')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Compact'}
                        </button>
                        
                        <button
                          onClick={() => handleAiPopulate('detailed')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Detailed'}
                        </button>
                        
                        <button
                          onClick={() => handleAiPopulate('professional')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Professional'}
                        </button>
                        
                        <button
                          onClick={() => handleAiPopulate('friendly')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Friendly'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handleAiPopulate('expand')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-3 h-3 animate-spin mr-2" />
                              Generating...
                            </div>
                          ) : (
                            'Add More Content'
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleAiPopulate('improve')}
                          disabled={isAiGenerating}
                          className="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                        >
                          {isAiGenerating ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-3 h-3 animate-spin mr-2" />
                              Improving...
                            </div>
                          ) : (
                            'Improve Existing'
                          )}
                        </button>
                      </div>

                      {isAiGenerating && (
                        <div className="text-center py-2">
                          <div className="inline-flex items-center text-sm text-purple-600">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            AI is generating content...
                          </div>
                        </div>
                      )}
                    </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a section to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Section</h3>
              <button
                onClick={() => setShowAddSection(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  id="sectionType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="experience"
                >
                  <option value="experience">Work Experience</option>
                  <option value="education">Education</option>
                  <option value="skills">Skills</option>
                  <option value="projects">Projects</option>
                  <option value="certifications">Certifications</option>
                  <option value="volunteer">Volunteer Work</option>
                  <option value="awards">Awards</option>
                  <option value="languages">Languages</option>
                  <option value="publications">Publications</option>
                  <option value="hobbies">Interests & Hobbies</option>
                  <option value="custom">Custom Section</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  id="sectionTitle"
                  placeholder="Enter section title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const typeSelect = document.getElementById('sectionType') as HTMLSelectElement
                      const titleInput = document.getElementById('sectionTitle') as HTMLInputElement
                      
                      if (titleInput.value.trim()) {
                        addSection(typeSelect.value, titleInput.value.trim(), false)
                        setShowAddSection(false)
                      } else {
                        toast.error('Please enter a section title')
                      }
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blank
                  </button>
                  
                  <button
                    onClick={() => {
                      const typeSelect = document.getElementById('sectionType') as HTMLSelectElement
                      const titleInput = document.getElementById('sectionTitle') as HTMLInputElement
                      
                      if (titleInput.value.trim()) {
                        addSection(typeSelect.value, titleInput.value.trim(), true)
                        setShowAddSection(false)
                      } else {
                        toast.error('Please enter a section title')
                      }
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate
                  </button>
                </div>

                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Templates</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        addSectionWithTemplate('experience', 'Work Experience', 'Senior Software Engineer at TechCorp\n• Led development of web applications using React and Node.js\n• Improved system performance by 40% through optimization\n• Mentored 3 junior developers and conducted code reviews')
                        setShowAddSection(false)
                      }}
                      className="p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      Work Experience
                    </button>
                    
                    <button
                      onClick={() => {
                        addSectionWithTemplate('skills', 'Technical Skills', 'Programming Languages: JavaScript, Python, Java\nFrameworks: React, Node.js, Express\nDatabases: PostgreSQL, MongoDB\nTools: Git, Docker, AWS')
                        setShowAddSection(false)
                      }}
                      className="p-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                    >
                      Skills
                    </button>
                    
                    <button
                      onClick={() => {
                        addSectionWithTemplate('projects', 'Key Projects', 'E-commerce Platform\n• Built full-stack web application with React and Node.js\n• Implemented payment processing and user authentication\n• Deployed on AWS with 99.9% uptime')
                        setShowAddSection(false)
                      }}
                      className="p-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    >
                      Projects
                    </button>
                    
                    <button
                      onClick={() => {
                        addSectionWithTemplate('education', 'Education', 'Bachelor of Science in Computer Science\nUniversity of Technology, 2020\nRelevant Coursework: Data Structures, Algorithms, Software Engineering')
                        setShowAddSection(false)
                      }}
                      className="p-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors"
                    >
                      Education
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Panel */}
      {showThemePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
              <button
                onClick={() => setShowThemePanel(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Font Family</label>
                    <select
                      value={cvData.theme_settings?.font || 'Inter'}
                      onChange={(e) => {
                        const newTheme = { ...cvData.theme_settings, font: e.target.value }
                        const newData = { ...cvData, theme_settings: newTheme }
                        setCvData(newData)
                        addToHistory(newData)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Calibri">Calibri</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Helvetica">Helvetica</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                    <input
                      type="range"
                      min="10"
                      max="16"
                      value={cvData.theme_settings?.fontSize || 12}
                      onChange={(e) => {
                        const newTheme = { ...cvData.theme_settings, fontSize: parseInt(e.target.value) }
                        const newData = { ...cvData, theme_settings: newTheme }
                        setCvData(newData)
                        addToHistory(newData)
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10pt</span>
                      <span>{cvData.theme_settings?.fontSize || 12}pt</span>
                      <span>16pt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={cvData.theme_settings?.colors?.primary || '#2563eb'}
                      onChange={(e) => {
                        const newColors = { ...cvData.theme_settings?.colors, primary: e.target.value }
                        const newTheme = { ...cvData.theme_settings, colors: newColors }
                        const newData = { ...cvData, theme_settings: newTheme }
                        setCvData(newData)
                        addToHistory(newData)
                      }}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Secondary Color</label>
                    <input
                      type="color"
                      value={cvData.theme_settings?.colors?.secondary || '#64748b'}
                      onChange={(e) => {
                        const newColors = { ...cvData.theme_settings?.colors, secondary: e.target.value }
                        const newTheme = { ...cvData.theme_settings, colors: newColors }
                        const newData = { ...cvData, theme_settings: newTheme }
                        setCvData(newData)
                        addToHistory(newData)
                      }}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Template Presets */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Style Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Professional', font: 'Calibri', primary: '#2563eb', secondary: '#64748b' },
                    { name: 'Creative', font: 'Inter', primary: '#7c3aed', secondary: '#a855f7' },
                    { name: 'Minimal', font: 'Arial', primary: '#374151', secondary: '#6b7280' },
                    { name: 'Classic', font: 'Times New Roman', primary: '#1f2937', secondary: '#4b5563' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        const newTheme = {
                          ...cvData.theme_settings,
                          font: preset.font,
                          colors: {
                            ...cvData.theme_settings?.colors,
                            primary: preset.primary,
                            secondary: preset.secondary
                          }
                        }
                        const newData = { ...cvData, theme_settings: newTheme }
                        setCvData(newData)
                        addToHistory(newData)
                      }}
                      className="p-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  } catch (error) {
    console.error('❌ Render error:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Rendering Error</h2>
          <p className="text-gray-600 mb-4">Failed to render the CV editor. Check console for details.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }
}
