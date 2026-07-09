'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import CVProgressStepper from '@/components/CVProgressStepper'
import { toast } from 'sonner'
import { CVSection } from '@/types/database'
import { 
  ArrowLeft, 
  Download, 
  CheckCircle,
  Loader2,
  Edit3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react'
import TemplatePreview from '@/components/TemplatePreview'
import UpgradeModal from '@/components/UpgradeModal'
import SkillScoreEditor from '@/components/SkillScoreEditor'
import PhotoUpload from '@/components/PhotoUpload'
import { generateCreativeModernHTML, generateProfessionalColumnsHTML } from '@/lib/advanced-templates'
import { stunningTemplates } from '@/lib/stunning-templates'
import { renderPagePlanHTML } from '@/lib/page-plan-renderer'

interface GenerationData {
  id: string
  job_title: string
  output_sections: { sections: CVSection[] }
  created_at: string
  cv_id: string
  ats_score?: number
  max_pages?: number
  photo_url?: string | null
}

interface AIReview {
  overall_assessment: string
  strengths: string[]
  improvements: string[]
  missing_sections: string[]
  keywords_to_add: string[]
  formatting_tips: string[]
}

// 🎯 PHASE 4: Simplified to Creative Modern only for predictable rendering
const TEMPLATE_ID = 'creative_modern'
const TEMPLATE_NAME = 'Creative Modern'

// Removed all other templates to focus on one high-quality, predictable template
// This allows us to:
// - Fine-tune density calibration for one template
// - Ensure consistent rendering across all page counts
// - Simplify testing and maintenance
// - Provide better user experience (no choice paralysis)

const LEGACY_TEMPLATES = [
  // Kept for reference but not used in UI
  { 
    id: 'professional-metrics', 
    name: '✨ Professional Metrics', 
    description: 'Two-column with circular skill meters & clean layout', 
    category: 'Professional', 
    badge: 'PRO', 
    advanced: true, 
    pro: true,
    screenshot: '/templates/professional-metrics.png',
    colors: ['#4F46E5', '#6366F1', '#818CF8']
  },
  { 
    id: 'teal-sidebar', 
    name: '✨ Teal Sidebar', 
    description: 'Icon sidebar with teal accent & skill bars', 
    category: 'Modern', 
    badge: 'PRO', 
    advanced: true, 
    pro: true,
    screenshot: '/templates/teal-sidebar.png',
    colors: ['#14B8A6', '#2DD4BF', '#5EEAD4']
  },
  { 
    id: 'soft-header', 
    name: '✨ Soft Header', 
    description: 'Gradient header with skill progress bars', 
    category: 'Modern', 
    badge: 'PRO', 
    advanced: true, 
    pro: true,
    screenshot: '/templates/soft-header.png',
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
  },
  { 
    id: 'artistic-header', 
    name: '✨ Artistic Header', 
    description: 'Decorative pattern header with pink accent', 
    category: 'Creative', 
    badge: 'PRO', 
    advanced: true, 
    pro: true,
    screenshot: '/templates/artistic-header.png',
    colors: ['#EC4899', '#F472B6', '#F9A8D4']
  },
  { 
    id: 'bold-split', 
    name: '✨ Bold Split', 
    description: 'Dark/cyan 50/50 split with high contrast', 
    category: 'Bold', 
    badge: 'PRO', 
    advanced: true, 
    pro: true,
    screenshot: '/templates/bold-split.png',
    colors: ['#06B6D4', '#22D3EE', '#67E8F9']
  },
  { 
    id: 'professional_columns', 
    name: 'Professional Columns', 
    description: 'Sidebar layout with skill bars & hobby badges', 
    category: 'Advanced', 
    badge: 'FREE', 
    advanced: true, 
    pro: false,
    screenshot: '/templates/professional-columns.png',
    colors: ['#3B82F6', '#60A5FA', '#93C5FD']
  },

  // ACTIVE: Creative Modern with Phase 1-6 calibration
  { 
    id: 'creative_modern', 
    name: 'Creative Modern', 
    description: 'Two-column with icons & decorative elements', 
    category: 'Advanced', 
    badge: 'FREE', 
    advanced: true, 
    pro: false,
    screenshot: '/templates/creative-modern.png',
    colors: ['#7C3AED', '#8B5CF6', '#A78BFA']
  },
]

const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', description: 'Best for applications', detail: 'Professional format accepted by all employers', icon: '📄', pro: false },
  { id: 'docx', name: 'Word', description: 'Editable document', detail: 'Edit and customize in Microsoft Word', icon: '📝', pro: true },
  { id: 'html', name: 'HTML', description: 'Web preview', detail: 'Share online or embed in websites', icon: '🌐', pro: true },
  { id: 'txt', name: 'Text', description: 'Plain text format', detail: 'Copy & paste into online forms', icon: '📋', pro: true }
]

// Helper function to safely get string content from section
const getSectionContent = (content: any): string => {
  if (!content) return ''
  
  // If content is already a string, return it
  if (typeof content === 'string') {
    return content
  }
  
  // If content is an array (like experience, education, certifications), format it
  if (Array.isArray(content)) {
    return content.map((item) => {
      // Handle string items
      if (typeof item === 'string') {
        return item
      }
      
      if (typeof item === 'object' && item !== null) {
        // Try common field names for work experience
        const title = item.job_title || item.jobTitle || item.title || item.position || ''
        const company = item.company || item.employer || item.organization || ''
        const description = item.responsibilities || item.description || item.details || item.content || ''
        const duration = item.duration || item.dates || item.period || ''
        
        if (title || company) {
          let result = ''
          if (title && company) {
            result += `${title} | ${company}`
          } else {
            result += title || company
          }
          if (duration) {
            result += ` (${duration})`
          }
          if (description) {
            result += `\n${description}`
          }
          return result
        }
        
        // Try education field names
        const degree = item.degree || item.qualification || item.course || ''
        const institution = item.institution || item.school || item.university || ''
        const eduDate = item.date || item.year || item.graduation_date || ''
        const location = item.location || ''
        
        if (degree || institution) {
          const parts = [degree, institution, location, eduDate].filter(Boolean)
          return parts.join(' | ')
        }
        
        // Try certification field names
        const certName = item.name || item.certification || item.license_name || ''
        const issuer = item.issuer || item.organization || item.issued_by || ''
        const licenseNum = item.license || item.license_number || item.credential_id || ''
        const url = item.url || item.link || ''
        const certDate = item.date || item.issued_date || item.valid_from || ''
        
        if (certName || issuer || licenseNum) {
          let result = certName
          if (issuer) result += ` | ${issuer}`
          if (licenseNum) result += ` | License: ${licenseNum}`
          if (url) result += `\n  URL: ${url}`
          if (certDate) result += ` | ${certDate}`
          return result
        }
        
        // Fallback: try to extract ALL values (including nested)
        const extractAllStrings = (obj: any): string[] => {
          const strings: string[] = []
          for (const value of Object.values(obj)) {
            if (typeof value === 'string' && value.trim()) {
              strings.push(value.trim())
            } else if (typeof value === 'object' && value !== null) {
              strings.push(...extractAllStrings(value))
            }
          }
          return strings
        }
        
        const values = extractAllStrings(item)
        return values.join(' | ')
      }
      return ''
    }).filter(Boolean).join('\n\n')
  }
  
  // If content is an object, try to extract meaningful text
  if (typeof content === 'object' && content !== null) {
    const values = Object.values(content).filter(v => typeof v === 'string' && v.trim())
    return values.join('\n')
  }
  
  // Return as string
  return String(content)
}

export default function DownloadPage() {
  const params = useParams()
  const generationId = params.id as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [generationData, setGenerationData] = useState<GenerationData | null>(null)
  // 🎯 PHASE 4: Hardcoded to Creative Modern (no template selection)
  const selectedTemplate = TEMPLATE_ID
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStep, setExportStep] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewStep, setReviewStep] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSkillEditor, setShowSkillEditor] = useState(true)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [skillScores, setSkillScores] = useState<{ name: string; level: number }[] | null>(null)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)

  useEffect(() => {
    fetchGenerationData()
    checkSubscription()
  }, [generationId])

  useEffect(() => {
    if (generationData) {
      generatePreview()
    }
  }, [generationData, selectedTemplate])

  // 🎯 PHASE 4: Removed keyboard navigation (single template only)

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
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const fetchGenerationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: generation, error } = await supabase
        .from('generations')
        .select('id, job_title, output_sections, created_at, cv_id, ats_score, max_pages, cvs(photo_url)')
        .eq('id', generationId)
        .eq('user_id', user.id)
        .single()

      if (error || !generation) {
        toast.error('Generation not found')
        router.push('/dashboard')
        return
      }

      // Set photo URL from CV data
      const photoUrl = (generation as any).cvs?.photo_url || null
      setCurrentPhotoUrl(photoUrl)

      // CRITICAL FIX: Use generation output_sections as primary source for tailored CVs
      // This contains the AI-tailored content. Only use cv_sections if user has explicitly
      // edited the CV in the editor AFTER generation
      let finalSections: CVSection[] = []
      
      if (generation.cv_id) {
        // Check if cv_sections has been updated after generation
        const { data: currentSections } = await supabase
          .from('cv_sections')
          .select('section_type, title, content, order_index, hobby_icons, updated_at')
          .eq('cv_id', generation.cv_id)
          .order('order_index')

        // Check if user made edits after generation
        const hasUserEdits = currentSections && currentSections.length > 0 && 
                             currentSections.some(s => s.updated_at && 
                             new Date(s.updated_at) > new Date(generation.created_at))

        if (hasUserEdits) {
          console.log('✅ Download Preview: Using edited sections from cv_sections (user made edits)')
          finalSections = currentSections!.map(section => ({
            type: section.section_type,
            content: section.hobby_icons && section.hobby_icons.length > 0 
              ? section.hobby_icons
              : section.content,
            order: section.order_index
          }))
        } else {
          console.log('✅ Download Preview: Using generation output_sections (tailored content)')
          finalSections = generation.output_sections?.sections || []
        }
      } else {
        // Orphaned generation - use output_sections
        console.log('✅ Download Preview: Orphaned generation, using output_sections')
        finalSections = generation.output_sections?.sections || []
      }
      
      // Update generation data with final sections
      const completeGeneration = {
        ...generation,
        output_sections: { sections: finalSections }
      }

      setGenerationData(completeGeneration)
    } catch (error) {
      console.error('Error fetching generation data:', error)
      toast.error('Failed to load generation data')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const generatePreview = async (updatedSkillScores?: { name: string; level: number }[] | null) => {
    if (!generationData) return

    // Use sections from generationData (already fetched from cv_sections in fetchGenerationData)
    const sections = [...generationData.output_sections.sections]
    
    // Generate HTML preview based on template, passing updated skill scores if available
    const html = generateTemplateHtml(sections, selectedTemplate, updatedSkillScores)
    setPreviewHtml(html)
  }

  const generateTemplateHtml = (sections: CVSection[], templateId: string, overrideSkillScores?: { name: string; level: number }[] | null): string => {
    const maxPages = generationData?.max_pages || 1
    
    // For multi-page CVs (2, 3, 4 pages), use the deterministic page-plan renderer
    // which handles zone-based layout and spacing fill across multiple A4 pages.
    if (maxPages > 1) {
      return renderPagePlanHTML(sections, maxPages, templateId)
    }
    
    // For single-page CVs, use the original template-specific generators
    // which have full visual designs (two-column layouts, decorative elements, etc.)
    const contactInfo = extractContactInfo(sections)
    const templateData = prepareTemplateData(sections, overrideSkillScores)
    
    // Map template IDs to their generators
    const templateGenerators: Record<string, (data: any) => string> = {
      'creative_modern': () => generateCreativeModernHTML(sections, contactInfo, maxPages),
      'professional_columns': () => generateProfessionalColumnsHTML(sections, contactInfo),
      'professional-metrics': (data) => stunningTemplates['professional-metrics'](data),
      'teal-sidebar': (data) => stunningTemplates['teal-sidebar'](data),
      'soft-header': (data) => stunningTemplates['soft-header'](data),
      'artistic-header': (data) => stunningTemplates['artistic-header'](data),
      'bold-split': (data) => stunningTemplates['bold-split'](data),
    }
    
    const generator = templateGenerators[templateId]
    if (generator) {
      return generator(templateData)
    }
    
    // Fallback to creative_modern if template not found
    return generateCreativeModernHTML(sections, contactInfo, maxPages)
  }
  
  // Helper to prepare template data from sections
  const prepareTemplateData = (sections: CVSection[], overrideSkillScores?: { name: string; level: number }[] | null) => {
    const nameSection = sections.find(s => s.type === 'name')
    const contactSection = sections.find(s => s.type === 'contact')
    const summarySection = sections.find(s => s.type === 'summary' || (s.type as string) === 'professional_summary' || (s.type as string) === 'profile')
    const experienceSection = sections.find(s => s.type === 'experience' || (s.type as string) === 'work_experience')
    const educationSection = sections.find(s => s.type === 'education')
    const skillsSection = sections.find(s => s.type === 'skills')
    const certificationsSection = sections.find(s => s.type === 'certifications')
    const languagesSection = sections.find(s => (s.type as string) === 'languages')
    const hobbiesSection = sections.find(s => (s.type as string) === 'interests' || s.type === 'hobbies')
    
    // Parse contact info
    let email = '', phone = '', address = '', website = ''
    if (contactSection) {
      try {
        const contact = JSON.parse(getSectionContent(contactSection.content))
        email = contact.email || ''
        phone = contact.phone || ''
        address = contact.address || ''
        website = contact.website || contact.linkedin || ''
      } catch {
        const contactText = getSectionContent(contactSection.content)
        const emailMatch = contactText.match(/[\w.-]+@[\w.-]+\.\w+/)
        const phoneMatch = contactText.match(/[\d\s\-\+\(\)]{10,}/)
        if (emailMatch) email = emailMatch[0]
        if (phoneMatch) phone = phoneMatch[0]
      }
    }
    
    return {
      name: getSectionContent(nameSection?.content || ''),
      email,
      phone,
      location: address,
      website,
      summary: getSectionContent(summarySection?.content || ''),
      experience: getSectionContent(experienceSection?.content || ''),
      education: getSectionContent(educationSection?.content || ''),
      skills: getSectionContent(skillsSection?.content || ''),
      skillScores: overrideSkillScores,
      languages: getSectionContent(languagesSection?.content || ''),
      hobbies: getSectionContent(hobbiesSection?.content || ''),
      certifications: getSectionContent(certificationsSection?.content || ''),
      photoUrl: generationData?.photo_url || ''
    }
  }
  
  // Helper to extract contact info object from sections
  const extractContactInfo = (sections: CVSection[]) => {
    const contactSection = sections.find(s => s.type === 'contact')
    if (!contactSection) return { email: '', phone: '', address: '', website: '', linkedin: '' }
    
    try {
      return JSON.parse(getSectionContent(contactSection.content))
    } catch {
      return { email: '', phone: '', address: '', website: '', linkedin: '' }
    }
  }

  const handleAIReview = async () => {
    setIsReviewing(true)
    setReviewStep('🔍 Analyzing your CV...')
    
    try {
      // Simulate progress updates
      setTimeout(() => setReviewStep('📊 Evaluating ATS compatibility...'), 2000)
      setTimeout(() => setReviewStep('💡 Identifying improvements...'), 4000)
      setTimeout(() => setReviewStep('🎯 Checking keyword optimization...'), 6000)
      setTimeout(() => setReviewStep('✨ Finalizing review...'), 8000)
      
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
      setReviewStep('')
    }
  }

  const handleExport = async () => {
    if (!generationData) return

    setIsExporting(true)
    setExportProgress(0)
    setExportStep('Preparing export...')
    
    try {
      setExportProgress(20)
      setExportStep(
        selectedFormat === 'pdf'
          ? 'Building page-plan layout...'
          : `Generating ${selectedFormat.toUpperCase()} file...`
      )
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generation_id: generationId,
          template: selectedTemplate,
          format: selectedFormat,
        }),
      })

      setExportProgress(60)
      setExportStep(
        selectedFormat === 'pdf'
          ? 'Measuring and optimizing page fit...'
          : 'Processing document...'
      )

      if (!response.ok) {
        throw new Error('Export failed')
      }

      setExportProgress(80)
      setExportStep('Finalizing download...')
      
      // Handle file download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      const filename = `CV_${generationData.job_title.replace(/[^a-z0-9]/gi, '_')}_${selectedTemplate}.${selectedFormat}`
      a.download = filename
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportProgress(100)
      setExportStep('Complete!')
      setShowSuccessScreen(true)
      
    } catch (error) {
      console.error('Export error:', error)
      const msg = error instanceof Error ? error.message : 'Unknown error'
      if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('upgrade')) {
        toast.error('Export limit reached. Please upgrade to Pro.')
        setShowUpgradeModal(true)
      } else {
        toast.error('Failed to generate PDF. Please try again or choose a different template.')
      }
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        setExportStep('')
      }, 1000)
    }
  }

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-black mb-3">CV Downloaded! 🎉</h1>
          <p className="text-xl text-gray-300 mb-2">
            Best of luck with your{' '}
            <span className="text-white font-bold">{generationData?.job_title}</span>{' '}
            application!
          </p>
          <p className="text-gray-400 mb-10">We&apos;re rooting for you — go get it! 💪</p>

          {!isPro && (
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 mb-8">
              <p className="text-lg font-bold text-white mb-2">Applying for more roles? 🚀</p>
              <p className="text-gray-300 text-sm mb-4">
                Upgrade to Pro for just <span className="text-white font-bold">£2.99/month</span> and generate a tailored CV for every job you apply for — unlimited, no restrictions.
              </p>
              <button
                onClick={() => router.push('/subscription')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-full font-black text-lg hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro →
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 border border-white/20 text-white py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/upload')}
              className="flex-1 bg-white text-black py-3 rounded-full font-black hover:bg-gray-100 transition-colors"
            >
              Create Another CV
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Stepper */}
      <CVProgressStepper currentStep="download" />
      
      {/* Header */}
      <header className="bg-black border-b border-white/10 sticky top-0 z-40 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-300 hover:text-white font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <div className="flex-1 text-center px-4">
              <h1 className="text-2xl font-black text-white truncate">
                {generationData?.job_title || 'Your CV'}
              </h1>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 PHASE 4: Removed template selector - using Creative Modern only */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Using {TEMPLATE_NAME} Template</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Optimized for all page counts with predictable, professional rendering
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview - Clean and Centered */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white">Preview</h2>
            <button
              onClick={async () => {
                await generatePreview()
                toast.success('Preview refreshed!')
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Preview
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6">
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white">
              <iframe
                key={previewHtml}
                srcDoc={previewHtml}
                className="w-full border-0 bg-white"
                title="CV Preview"
                style={{ background: '#ffffff', height: '1200px' }}
                onLoad={(e) => {
                  const iframe = e.currentTarget
                  try {
                    const h = iframe.contentDocument?.documentElement?.scrollHeight || iframe.contentDocument?.body?.scrollHeight
                    if (h && h > 100) iframe.style.height = h + 'px'
                  } catch {}
                }}
              />
            </div>
          </div>
        </div>

        {/* Skill Score Editor - Only for templates that use it */}
        {generationData && generationData.cv_id && (
          ['professional-metrics', 'teal-sidebar', 'soft-header', 'artistic-header', 'bold-split'].includes(selectedTemplate)
        ) && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowSkillEditor(!showSkillEditor)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-black text-white">🎯 Adjust Skill Levels</h3>
                {showSkillEditor ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {showSkillEditor && (
                <div className="p-4 border-t">
                  <SkillScoreEditor
                    cvId={generationData.cv_id}
                    onUpdate={async (updatedSkills) => {
                      // Update local skill scores state immediately for real-time preview
                      if (updatedSkills) {
                        setSkillScores(updatedSkills)
                        // Regenerate preview with updated skills
                        await generatePreview(updatedSkills)
                        toast.success('Skill levels updated! Preview refreshed.')
                      } else {
                        // Fallback: reload from database
                        await generatePreview()
                        toast.success('Skill levels saved!')
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photo Upload - Collapsible */}
        {generationData && generationData.cv_id && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-black text-white">📸 Upload Your Photo</h3>
                {showPhotoUpload ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {showPhotoUpload && (
                <div className="p-4 border-t">
                  <PhotoUpload
                    cvId={generationData.cv_id}
                    currentPhotoUrl={currentPhotoUrl}
                    onPhotoUploaded={async (url) => {
                      setCurrentPhotoUrl(url)
                      await generatePreview() // Refresh preview
                      toast.success('Photo uploaded! Preview refreshed.')
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Format Selection */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-2">Choose Your Export Format</h2>
            <p className="text-gray-400 text-sm">Select the format that works best for your needs. PDF is free and works everywhere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPORT_FORMATS.map((format) => {
              const isLocked = format.pro && !isPro
              return (
                <label 
                  key={format.id} 
                  className={isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault()
                      setShowUpgradeModal(true)
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={selectedFormat === format.id}
                    onChange={(e) => !isLocked && setSelectedFormat(e.target.value)}
                    className="sr-only"
                    disabled={isLocked}
                  />
                  <div className={`
                    p-5 rounded-xl border-2 transition-all text-center relative h-full flex flex-col
                    ${selectedFormat === format.id 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-lg scale-105' 
                      : isLocked
                      ? 'border-white/10 bg-white/5 opacity-70 hover:opacity-80'
                      : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10 hover:scale-102'
                    }
                  `}>
                    {format.pro && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
                          PRO
                        </span>
                      </div>
                    )}
                    <div className="text-4xl mb-3">{format.icon}</div>
                    <div className="font-black text-white text-lg mb-1">{format.name}</div>
                    <div className="text-sm text-gray-300 font-semibold mb-2">{format.description}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{format.detail}</div>
                    {isLocked && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-purple-400 font-bold flex items-center justify-center gap-1">
                          <span>🔒</span>
                          <span>Upgrade to unlock</span>
                        </div>
                      </div>
                    )}
                    {selectedFormat === format.id && !isLocked && (
                      <div className="mt-3 pt-3 border-t border-blue-400/30">
                        <div className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                          <span>✓</span>
                          <span>Selected</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Download or Edit CV - Single Action Section */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white mb-1">
                  Your CV is Ready!
                </h3>
                <p className="text-sm text-gray-400">
                  Download your tailored CV or make final edits
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-lg"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {exportStep || 'Exporting...'}
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => generationData && router.push(`/edit/${generationData.id}`)}
                    className="px-6 py-3 border-2 border-white/20 text-white rounded-full font-black font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit CV
                  </button>
                </div>
                {isExporting && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>{exportStep}</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Removed duplicate Edit CV button */}
              <div className="hidden">
                
                {generationData && generationData.cv_id && (
                  <Link
                    href={`/edit/${generationData.cv_id}`}
                    className="bg-white text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors border-2 border-white/20 flex items-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit CV
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Old Template Grid - Hidden */}
        <div className="hidden">
          <div className="hidden">
            <div className="hidden">
                {LEGACY_TEMPLATES.map((template) => {
                  const isLocked = template.pro && !isPro
                  return (
                    <label 
                      key={template.id} 
                      className={isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault()
                          setShowUpgradeModal(true)
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={selectedTemplate === template.id}
                        onChange={() => {/* No-op - template selection removed */}}
                        className="sr-only"
                        disabled={isLocked}
                      />
                      <div className={`
                        h-full p-3 rounded-lg border-2 transition-all hover:shadow-md relative
                        ${selectedTemplate === template.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : isLocked
                          ? 'border-white/10 bg-white/5 opacity-60'
                          : 'border-white/10 hover:border-white/20'
                        }
                      `}>
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                            <div className="text-center">
                              <div className="text-3xl mb-2">🔒</div>
                              <div className="text-sm font-semibold text-purple-400">Upgrade to unlock</div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col h-full">
                          <div className="font-bold text-white mb-2">{template.name}</div>
                          <div className="text-sm text-gray-400 mb-3 flex-grow">{template.description}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {template.badge && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
                                {template.badge}
                              </span>
                            )}
                            {template.category && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-300 rounded">
                                {template.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

            {/* Hobby Icons Info for Advanced Templates */}
            {(selectedTemplate === 'creative_modern' || selectedTemplate === 'professional_columns' || selectedTemplate === 'artistic-header') && generationData && (
              <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-purple-900 text-sm mb-1">✨ Advanced Template Feature</h3>
                    <p className="text-purple-800 text-xs mb-3">
                      This template supports custom hobby icons! Add visual icons to your hobbies section for a more engaging CV.
                    </p>
                    {generationData.cv_id ? (
                      <Link
                        href={`/hobbies/${generationData.cv_id}?returnTo=/download/${generationId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        Add Hobby Icons
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed" title="Original CV was deleted">
                        <Sparkles className="w-4 h-4" />
                        Add Hobby Icons (Original Deleted)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Review Section */}
            <div className="mt-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    AI Expert Review
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Get professional feedback on your CV before downloading</p>
                </div>
                {!showReview && (
                  <button
                    onClick={handleAIReview}
                    disabled={isReviewing}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 font-semibold"
                  >
                    {isReviewing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get Expert Review
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {isReviewing && reviewStep && (
                <div className="text-sm text-gray-400 animate-pulse mb-4">
                  {reviewStep}
                </div>
              )}
              
              {showReview && aiReview && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="space-y-4">
                    {/* Overall Assessment */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                      <h4 className="font-black text-white text-sm mb-2">Overall Assessment</h4>
                      <p className="text-sm text-gray-300">{aiReview.overall_assessment}</p>
                    </div>
                    
                    {/* Strengths & Improvements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                        <h4 className="font-black text-green-400 text-sm mb-2">✓ Strengths</h4>
                        <ul className="space-y-1">
                          {aiReview.strengths.map((strength, index) => (
                            <li key={index} className="text-xs text-gray-400">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                        <h4 className="font-black text-orange-400 text-sm mb-2">⚡ Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {aiReview.improvements.map((improvement, index) => (
                            <li key={index} className="text-xs text-gray-400">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Additional Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                        <h4 className="font-black text-white text-sm mb-2">Missing Sections</h4>
                        <ul className="space-y-1">
                          {aiReview.missing_sections.map((section, index) => (
                            <li key={index} className="text-xs text-gray-400">• {section}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                        <h4 className="font-black text-white text-sm mb-2">Keywords to Add</h4>
                        <ul className="space-y-1">
                          {aiReview.keywords_to_add.map((keyword, index) => (
                            <li key={index} className="text-xs text-gray-400">• {keyword}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-sm">
                        <h4 className="font-black text-white text-sm mb-2">Formatting Tips</h4>
                        <ul className="space-y-1">
                          {aiReview.formatting_tips.map((tip, index) => (
                            <li key={index} className="text-xs text-gray-400">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Apply Improvements Button */}
                    <div className="mt-4 flex justify-center">
                      <Link
                        href={`/review/${generationId}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        Apply These Improvements
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="mt-6">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-full font-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating {selectedFormat.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download as {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
              
              {/* Progress Bar for Export */}
              {isExporting && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{exportStep}</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal - Disabled (single template only) */}
      {previewTemplate && (
        <TemplatePreview
          templateId={previewTemplate}
          screenshot={LEGACY_TEMPLATES.find(t => t.id === previewTemplate)?.screenshot}
          colors={LEGACY_TEMPLATES.find(t => t.id === previewTemplate)?.colors}
          onClose={() => {
            setPreviewTemplate(null)
            // Template selection removed - using Creative Modern only
          }}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="manual"
      />
    </div>
  )
}
