'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import CVProgressStepper from '@/components/CVProgressStepper'
import { toast } from 'sonner'
import { CVSection } from '@/types/database'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Eye,
  CheckCircle,
  Loader2,
  Edit3,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import TemplatePreview from '@/components/TemplatePreview'
import UpgradeModal from '@/components/UpgradeModal'
import SkillScoreEditor from '@/components/SkillScoreEditor'
import PhotoUpload from '@/components/PhotoUpload'
import { generateCreativeModernHTML, generateProfessionalColumnsHTML } from '@/lib/advanced-templates'
import { stunningTemplates } from '@/lib/stunning-templates'

interface GenerationData {
  id: string
  job_title: string
  output_sections: { sections: CVSection[] }
  created_at: string
  cv_id: string
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

const TEMPLATES = [
  // ✨ STUNNING TEMPLATES (Free - Best designs!)
  { id: 'professional-metrics', name: '✨ Professional Metrics', description: 'Two-column with circular skill meters & clean layout', category: 'Professional', badge: 'NEW', advanced: true, pro: false },
  { id: 'teal-sidebar', name: '✨ Teal Sidebar', description: 'Icon sidebar with teal accent & skill bars', category: 'Modern', badge: 'NEW', advanced: true, pro: false },
  { id: 'soft-header', name: '✨ Soft Header', description: 'Gradient header with skill progress bars', category: 'Modern', badge: 'NEW', advanced: true, pro: false },
  { id: 'artistic-header', name: '✨ Artistic Header', description: 'Decorative pattern header with pink accent', category: 'Creative', badge: 'NEW', advanced: true, pro: false },
  { id: 'bold-split', name: '✨ Bold Split', description: 'Dark/cyan 50/50 split with high contrast', category: 'Bold', badge: 'NEW', advanced: true, pro: false },
  
  // ADVANCED TEMPLATES (Free)
  { id: 'creative_modern', name: 'Creative Modern', description: 'Two-column with icons & decorative elements', category: 'Advanced', badge: 'FREE', advanced: true, pro: false },
  { id: 'professional_columns', name: 'Professional Columns', description: 'Sidebar layout with skill bars & hobby badges', category: 'Advanced', badge: 'FREE', advanced: true, pro: false },
]

const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', description: 'Best for applications', icon: '📄', pro: false },
  { id: 'docx', name: 'Word', description: 'Editable document', icon: '📝', pro: true },
  { id: 'html', name: 'HTML', description: 'Web preview', icon: '🌐', pro: true },
  { id: 'txt', name: 'Text', description: 'Plain text format', icon: '📋', pro: true }
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
  const [selectedTemplate, setSelectedTemplate] = useState('creative_modern')
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
  const [showPhotoUpload, setShowPhotoUpload] = useState(true)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchGenerationData()
    checkSubscription()
  }, [generationId])

  useEffect(() => {
    if (generationData) {
      generatePreview()
    }
  }, [generationData, selectedTemplate])

  // Keyboard navigation for templates
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = TEMPLATES.findIndex(t => t.id === selectedTemplate)
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setSelectedTemplate(TEMPLATES[currentIndex - 1].id)
        } else if (e.key === 'ArrowRight' && currentIndex < TEMPLATES.length - 1) {
          setSelectedTemplate(TEMPLATES[currentIndex + 1].id)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedTemplate])

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
        .select('id, job_title, output_sections, created_at, cv_id, ats_score, cvs(parsed_sections, photo_url)')
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

      // Fetch latest hobbies from cv_sections (user may have customized icons)
      // Note: hobbies are stored as 'interests' in the database
      // Only fetch hobbies if cv_id exists (not orphaned)
      let latestHobbies = null
      if (generation.cv_id) {
        const { data: hobbiesData } = await supabase
          .from('cv_sections')
          .select('*')
          .eq('cv_id', generation.cv_id)
          .eq('section_type', 'interests')
          .single()
        latestHobbies = hobbiesData
      }

      // Merge original and modified sections for full CV preview
      const originalSections = (generation as any).cvs?.parsed_sections?.sections || []
      const modifiedSections = generation.output_sections?.sections || []
      
      const mergedSections = originalSections.map((originalSection: CVSection) => {
        const modifiedSection = modifiedSections.find((mod: CVSection) => mod.type === originalSection.type)
        
        // If this is hobbies and we have latest data, use it
        if (originalSection.type === 'hobbies' && latestHobbies) {
          return {
            type: 'hobbies',
            content: latestHobbies.content,
            order: latestHobbies.order_index || originalSection.order || 999
          }
        }
        
        return modifiedSection || originalSection
      })
      
      // Add any new sections from modifications
      modifiedSections.forEach((modSection: CVSection) => {
        if (!originalSections.find((orig: CVSection) => orig.type === modSection.type)) {
          mergedSections.push(modSection)
        }
      })
      
      // If hobbies exist in cv_sections but not in original/modified, add them
      if (latestHobbies && !mergedSections.find((s: CVSection) => s.type === 'hobbies')) {
        mergedSections.push({
          type: 'hobbies',
          content: latestHobbies.content,
          order: latestHobbies.order_index || 999
        })
      }
      
      // Update generation data with merged sections
      const completeGeneration = {
        ...generation,
        output_sections: { sections: mergedSections }
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

  const generatePreview = () => {
    if (!generationData) return

    let sections = [...generationData.output_sections.sections]
    
    // CRITICAL: Ensure name and contact sections are present from original CV
    const originalSections = generationData.cvs?.parsed_sections?.sections || []
    const nameInOutput = sections.find(s => s.type === 'name')
    const contactInOutput = sections.find(s => s.type === 'contact')
    
    if (!nameInOutput && originalSections.length > 0) {
      const nameFromOriginal = originalSections.find(s => s.type === 'name')
      if (nameFromOriginal) {
        console.log('✅ Preview: Adding name section from original CV')
        sections.unshift({
          type: 'name',
          content: nameFromOriginal.content,
          order: 0
        })
      }
    }
    
    if (!contactInOutput && originalSections.length > 0) {
      const contactFromOriginal = originalSections.find(s => s.type === 'contact')
      if (contactFromOriginal) {
        console.log('✅ Preview: Adding contact section from original CV')
        sections.splice(1, 0, {
          type: 'contact',
          content: contactFromOriginal.content,
          order: 1
        })
      }
    }
    
    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    
    // Generate HTML preview based on template
    const html = generateTemplateHtml(sections, selectedTemplate)
    setPreviewHtml(html)
  }

  const generateTemplateHtml = (sections: CVSection[], templateId: string): string => {
    // Check if it's a stunning template first
    const stunningTemplateKeys = Object.keys(stunningTemplates)
    if (stunningTemplateKeys.includes(templateId)) {
      const contactSection = sections.find(s => s.type === 'contact')
      const nameSection = sections.find(s => s.type === 'name')
      
      // Extract contact info
      let contactInfo: any = {}
      if (contactSection?.content) {
        if (typeof contactSection.content === 'string') {
          const content = contactSection.content
          const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/)
          const phoneMatch = content.match(/[\d\s()+-]{10,}/)
          const lines = content.split('\n').filter(l => l.trim())
          
          contactInfo = {
            email: emailMatch ? emailMatch[0] : '',
            phone: phoneMatch ? phoneMatch[0] : '',
            location: lines.find(l => !l.includes('@') && !l.match(/[\d\s()+-]{10,}/)) || ''
          }
        } else {
          contactInfo = contactSection.content
        }
      }
      
      // Prepare data for stunning templates
      const templateData = {
        name: getSectionContent(nameSection?.content) || 'Your Name',
        email: contactInfo?.email || '',
        phone: contactInfo?.phone || '',
        location: contactInfo?.location || '',
        website: (contactInfo as any)?.website || '',
        summary: getSectionContent(sections.find(s => s.type === 'summary')?.content),
        experience: getSectionContent(sections.find(s => s.type === 'experience')?.content),
        education: getSectionContent(sections.find(s => s.type === 'education')?.content),
        skills: getSectionContent(sections.find(s => s.type === 'skills')?.content),
        languages: getSectionContent(sections.find(s => s.type === 'languages')?.content),
        hobbies: getSectionContent(sections.find(s => s.type === 'hobbies')?.content),
        certifications: getSectionContent(sections.find(s => s.type === 'certifications')?.content),
        photoUrl: currentPhotoUrl || undefined,
      }
      
      return stunningTemplates[templateId as keyof typeof stunningTemplates](templateData)
    }
    
    // Check if it's an advanced template
    if (templateId === 'creative_modern' || templateId === 'professional_columns') {
      const contactSection = sections.find(s => s.type === 'contact')
      
      // Extract contact info
      let contactInfo = null
      if (contactSection?.content) {
        if (typeof contactSection.content === 'string') {
          const content = contactSection.content
          const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/)
          const phoneMatch = content.match(/[\d\s()+-]{10,}/)
          const lines = content.split('\n').filter(l => l.trim())
          
          contactInfo = {
            email: emailMatch ? emailMatch[0] : '',
            phone: phoneMatch ? phoneMatch[0] : '',
            location: lines.find(l => !l.includes('@') && !l.match(/[\d\s()+-]{10,}/)) || ''
          }
        } else {
          contactInfo = contactSection.content
        }
      }
      
      // Generate advanced template HTML
      if (templateId === 'creative_modern') {
        return generateCreativeModernHTML(sections, contactInfo)
      } else {
        return generateProfessionalColumnsHTML(sections, contactInfo)
      }
    }
    
    // Reorder sections: contact always first, then name, then others
    const contactSection = sections.find(s => s.type === 'contact')
    const nameSection = sections.find(s => s.type === 'name')
    const otherSections = sections.filter(s => s.type !== 'contact' && s.type !== 'name')
    const sortedSections = [contactSection, nameSection, ...otherSections.sort((a, b) => a.order - b.order)].filter(Boolean) as CVSection[]
    
    // Base styles for different templates
    const templateStyles = {
      modern: `
        body { font-family: 'Inter', 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; max-width: 850px; margin: 0 auto; padding: 50px; background: #fff; }
        .contact { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #fff; padding: 25px 30px; margin: -50px -50px 40px -50px; font-size: 0.95em; line-height: 1.8; }
        .header { margin-bottom: 35px; position: relative; }
        .name { font-size: 3.2em; font-weight: 800; color: #0f172a; margin-bottom: 15px; letter-spacing: -1px; border-left: 6px solid #3b82f6; padding-left: 20px; }
        .section { margin-bottom: 35px; position: relative; padding-left: 25px; }
        .section::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #3b82f6, #93c5fd); border-radius: 2px; }
        .section-title { font-size: 1.6em; font-weight: 700; color: #3b82f6; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 2px; }
        .content { white-space: pre-wrap; line-height: 1.8; }
      `,
      classic: `
        body { font-family: 'Garamond', 'Times New Roman', serif; line-height: 1.7; color: #1a1a1a; max-width: 750px; margin: 0 auto; padding: 60px; background: #fffef8; }
        .contact { text-align: center; font-size: 0.9em; padding: 15px; background: #f5f5f0; border-top: 2px solid #8b7355; border-bottom: 2px solid #8b7355; margin: -60px -60px 35px -60px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .name { font-size: 3em; font-weight: 700; margin-bottom: 20px; color: #2c2416; letter-spacing: 3px; }
        .section { margin-bottom: 35px; page-break-inside: avoid; }
        .section-title { font-size: 1.5em; font-weight: 700; margin-bottom: 15px; border-bottom: 3px double #8b7355; padding-bottom: 8px; color: #2c2416; font-variant: small-caps; letter-spacing: 1px; }
        .content { white-space: pre-wrap; text-align: justify; }
      `,
      minimal: `
        body { font-family: 'Helvetica Neue', 'Arial', sans-serif; line-height: 2; color: #333; max-width: 650px; margin: 0 auto; padding: 70px 40px; background: #fff; }
        .contact { font-size: 0.85em; color: #666; padding: 12px 0; margin-bottom: 50px; border-bottom: 1px solid #e5e5e5; line-height: 1.8; }
        .header { margin-bottom: 60px; }
        .name { font-size: 2.8em; font-weight: 200; margin-bottom: 25px; letter-spacing: 8px; color: #1a1a1a; }
        .section { margin-bottom: 50px; }
        .section-title { font-size: 0.95em; font-weight: 600; margin-bottom: 20px; color: #888; text-transform: uppercase; letter-spacing: 3px; }
        .content { white-space: pre-wrap; font-size: 0.95em; font-weight: 300; }
      `,
      creative: `
        body { font-family: 'Poppins', 'Helvetica Neue', sans-serif; line-height: 1.7; color: #1a202c; max-width: 900px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .contact { background: rgba(255,255,255,0.95); padding: 20px 40px; font-size: 0.9em; line-height: 1.8; border-bottom: 4px solid #667eea; }
        .header { background: rgba(255,255,255,0.98); padding: 50px 40px 30px; margin-bottom: 30px; }
        .name { font-size: 3.5em; font-weight: 900; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; letter-spacing: -2px; }
        .section { background: rgba(255,255,255,0.98); padding: 35px 40px; margin-bottom: 25px; position: relative; overflow: hidden; }
        .section::after { content: ''; position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #667eea, #764ba2); }
        .section-title { font-size: 1.8em; font-weight: 800; color: #667eea; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .content { white-space: pre-wrap; }
      `,
      technical: `
        body { font-family: 'Fira Code', 'Consolas', monospace; line-height: 1.7; color: #e6edf3; max-width: 950px; margin: 0 auto; padding: 0; background: #0d1117; }
        .contact { background: #161b22; color: #58a6ff; padding: 20px 35px; font-size: 0.9em; border-left: 5px solid #58a6ff; border-bottom: 1px solid #30363d; line-height: 1.9; }
        .header { background: #161b22; border-left: 6px solid #58a6ff; padding: 35px; margin-bottom: 30px; }
        .name { font-size: 3em; font-weight: 700; color: #58a6ff; margin-bottom: 15px; font-family: 'Courier New', monospace; letter-spacing: 2px; }
        .section { background: #161b22; border-left: 4px solid #30363d; padding: 30px 35px; margin-bottom: 25px; position: relative; }
        .section::before { content: '//'; position: absolute; top: 30px; left: 10px; color: #30363d; font-size: 0.8em; }
        .section-title { font-size: 1.5em; font-weight: 700; color: #58a6ff; margin-bottom: 18px; font-family: 'Courier New', monospace; text-transform: uppercase; }
        .content { white-space: pre-wrap; color: #c9d1d9; font-size: 0.95em; line-height: 1.8; }
      `,
      executive: `
        body { font-family: 'Merriweather', 'Georgia', serif; line-height: 1.8; color: #2d2d2d; max-width: 900px; margin: 0 auto; padding: 0; background: #ecf0f1; }
        .contact { background: #34495e; color: #ecf0f1; padding: 18px 45px; font-size: 0.9em; text-align: center; line-height: 1.7; }
        .header { text-align: center; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: #fff; padding: 55px 45px 45px; margin-bottom: 40px; }
        .name { font-size: 3.5em; font-weight: 800; margin-bottom: 20px; letter-spacing: 4px; text-transform: uppercase; }
        .section { background: #fff; padding: 40px 45px; margin-bottom: 30px; border-left: 8px solid #2c3e50; box-shadow: 0 3px 12px rgba(0,0,0,0.08); }
        .section-title { font-size: 1.7em; font-weight: 800; color: #2c3e50; margin-bottom: 22px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #ecf0f1; padding-bottom: 10px; }
        .content { white-space: pre-wrap; font-size: 1.05em; }
      `,
      academic: `
        body { font-family: 'Crimson Text', 'Palatino', serif; line-height: 1.9; color: #2a2a2a; max-width: 800px; margin: 0 auto; padding: 65px; background: #fdfdf8; }
        .contact { text-align: center; font-size: 0.9em; padding: 15px 0; margin-bottom: 40px; border-top: 2px solid #8b4513; border-bottom: 2px solid #8b4513; line-height: 1.7; color: #5a4a3a; }
        .header { text-align: center; margin-bottom: 50px; }
        .name { font-size: 2.8em; font-weight: 700; color: #5a3a2a; margin-bottom: 20px; font-variant: small-caps; letter-spacing: 2px; }
        .section { margin-bottom: 45px; page-break-inside: avoid; }
        .section-title { font-size: 1.6em; font-weight: 700; color: #8b4513; margin-bottom: 18px; font-variant: small-caps; letter-spacing: 2px; border-bottom: 2px solid #d4a574; padding-bottom: 8px; }
        .content { white-space: pre-wrap; text-align: justify; line-height: 2; }
      `,
      startup: `
        body { font-family: 'DM Sans', 'Inter', sans-serif; line-height: 1.7; color: #0f172a; max-width: 900px; margin: 0 auto; padding: 0; background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); }
        .contact { background: #fff; padding: 20px 40px; font-size: 0.9em; border-bottom: 4px solid #06b6d4; line-height: 1.8; }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%); color: #fff; padding: 50px 40px; margin-bottom: 35px; position: relative; }
        .header::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 20px solid #0284c7; }
        .name { font-size: 3.2em; font-weight: 900; margin-bottom: 15px; letter-spacing: -1px; }
        .section { background: #fff; padding: 35px 40px; border-radius: 16px; margin-bottom: 25px; border: 3px solid #e0f2fe; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.1); }
        .section-title { font-size: 1.7em; font-weight: 800; color: #0891b2; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 1px; }
        .content { white-space: pre-wrap; }
      `,
      corporate: `
        body { font-family: 'Calibri', 'Segoe UI', sans-serif; line-height: 1.7; color: #2c2c2c; max-width: 850px; margin: 0 auto; padding: 0; background: #f5f5f5; }
        .contact { background: #1a4d7a; color: #fff; padding: 18px 40px; font-size: 0.9em; text-align: center; line-height: 1.7; }
        .header { background: linear-gradient(135deg, #003366 0%, #1a4d7a 100%); color: #fff; padding: 50px 40px; margin-bottom: 35px; }
        .name { font-size: 3.2em; font-weight: 800; margin-bottom: 15px; letter-spacing: 1px; text-transform: uppercase; }
        .section { background: #fff; margin-bottom: 30px; padding: 35px 40px; border-top: 4px solid #003366; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .section-title { font-size: 1.6em; font-weight: 800; color: #003366; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 1px; }
        .content { white-space: pre-wrap; }
      `,
      designer: `
        body { font-family: 'Montserrat', 'Futura', sans-serif; line-height: 1.8; color: #2d2d2d; max-width: 950px; margin: 0 auto; padding: 0; background: #fafafa; }
        .contact { background: #fff; padding: 20px 45px; font-size: 0.9em; border-bottom: 6px solid; border-image: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3) 1; line-height: 1.8; }
        .header { position: relative; padding: 60px 45px 50px; margin-bottom: 45px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 75%, #ff9ff3 100%); overflow: hidden; }
        .header::after { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        .name { font-size: 4em; font-weight: 900; color: #fff; margin-bottom: 20px; text-shadow: 4px 4px 8px rgba(0,0,0,0.2); letter-spacing: -2px; position: relative; z-index: 1; }
        .section { background: #fff; padding: 40px 45px; margin-bottom: 30px; border-radius: 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.08); position: relative; overflow: hidden; }
        .section::before { content: ''; position: absolute; top: 0; left: 0; width: 8px; height: 100%; background: linear-gradient(180deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%); }
        .section-title { font-size: 2em; font-weight: 900; background: linear-gradient(90deg, #ff6b6b, #feca57); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 22px; margin-left: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .content { white-space: pre-wrap; margin-left: 20px; }
      `
    }

    // Map new template IDs to existing styles
    const templateMapping: Record<string, string> = {
      'professional-circle': 'executive',
      'modern-coral': 'designer',
      'minimal-yellow': 'minimal',
      'classic-beige': 'classic',
      'executive-tan': 'executive',
      'modern-sidebar': 'startup',
      'minimal-gray': 'minimal',
      'artistic-pattern': 'designer',
      'modern-blue': 'modern',
      'creative-accent': 'creative',
      'professional-split': 'corporate',
      'minimal-clean': 'minimal'
    }
    
    const mappedTemplate = templateMapping[templateId] || templateId
    const style = templateStyles[mappedTemplate as keyof typeof templateStyles] || templateStyles.modern

    let html = `
      <html>
        <head>
          <style>${style}</style>
        </head>
        <body>
    `

    sortedSections.forEach(section => {
      const contentStr = getSectionContent(section.content)
      if (section.type === 'contact') {
        html += `
          <div class="contact">${contentStr}</div>
        `
      } else if (section.type === 'name') {
        html += `
          <div class="header">
            <div class="name">${contentStr}</div>
          </div>
        `
      } else {
        html += `
          <div class="section">
            <div class="section-title">${section.type.replace('_', ' ').toUpperCase()}</div>
            <div class="content">${contentStr.replace(/\n/g, '<br>')}</div>
          </div>
        `
      }
    })

    html += `
        </body>
      </html>
    `

    return html
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
      setExportStep(`Generating ${selectedFormat.toUpperCase()} file...`)
      
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
      setExportStep('Processing document...')

      if (!response.ok) {
        throw new Error('Export failed')
      }

      setExportProgress(80)
      setExportStep('Downloading file...')
      
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
      toast.success('CV downloaded successfully!')
      
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export CV. Please try again.')
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        setExportStep('')
      }, 1000)
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
      <CVProgressStepper currentStep="download" />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-700 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <div className="flex-1 text-center px-4">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {generationData?.job_title || 'Your CV'}
              </h1>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
        {/* Template Slider - Horizontal */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Choose Template</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {TEMPLATES.map((template) => {
              const isLocked = template.pro && !isPro
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    if (isLocked) {
                      setShowUpgradeModal(true)
                    } else {
                      setSelectedTemplate(template.id)
                    }
                  }}
                  className={`
                    relative flex-shrink-0 w-48 p-4 rounded-lg border-2 transition-all snap-start
                    ${selectedTemplate === template.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : isLocked
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {template.description}
                    </div>
                    
                    {template.badge && (
                      <span className="inline-block px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
                        {template.badge}
                      </span>
                    )}
                    {template.category && (
                      <span className="inline-block ml-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {template.category}
                      </span>
                    )}
                  </div>
                  
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="text-xs font-semibold text-purple-600">PRO</div>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview - Clean and Centered */}
        <div className="max-w-5xl mx-auto mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Preview</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[800px] border-0"
                title="CV Preview"
              />
            </div>
          </div>
        </div>

        {/* Skill Score Editor - Only for templates that use it */}
        {generationData && generationData.cv_id && (
          ['professional-metrics', 'teal-sidebar', 'soft-header', 'artistic-header', 'bold-split'].includes(selectedTemplate)
        ) && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
              <button
                onClick={() => setShowSkillEditor(!showSkillEditor)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900">🎯 Adjust Skill Levels</h3>
                {showSkillEditor ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {showSkillEditor && (
                <div className="p-4 border-t">
                  <SkillScoreEditor
                    cvId={generationData.cv_id}
                    onUpdate={async () => {
                      // Refetch generation data to get updated skill scores
                      await fetchGenerationData()
                      // Then regenerate preview with new data
                      setTimeout(() => {
                        generatePreview()
                        toast.success('Skill levels updated! Preview refreshed.')
                      }, 100)
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
            <div className="bg-white rounded-lg border-2 border-purple-200 overflow-hidden">
              <button
                onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900">📸 Upload Your Photo</h3>
                {showPhotoUpload ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {showPhotoUpload && (
                <div className="p-4 border-t">
                  <PhotoUpload
                    cvId={generationData.cv_id}
                    currentPhotoUrl={currentPhotoUrl}
                    onPhotoUploaded={(url) => {
                      setCurrentPhotoUrl(url)
                      fetchGenerationData() // Refresh data
                      generatePreview() // Refresh preview
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Export Format</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    p-4 rounded-lg border-2 transition-colors text-center relative
                    ${selectedFormat === format.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : isLocked
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}>
                    {format.pro && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          PRO
                        </span>
                      </div>
                    )}
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <div className="font-semibold text-gray-900">{format.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                    {isLocked && (
                      <div className="text-xs text-purple-600 mt-2 font-semibold">
                        🔒 Upgrade to unlock
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Your CV is Ready!
                </h3>
                <p className="text-sm text-gray-600">
                  Download your tailored CV or make final edits
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download
                    </>
                  )}
                </button>
                
                {generationData && generationData.cv_id && (
                  <Link
                    href={`/edit/${generationData.cv_id}`}
                    className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 flex items-center gap-2"
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
                {TEMPLATES.map((template) => {
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
                        onChange={(e) => !isLocked && setSelectedTemplate(e.target.value)}
                        className="sr-only"
                        disabled={isLocked}
                      />
                      <div className={`
                        h-full p-3 rounded-lg border-2 transition-all hover:shadow-md relative
                        ${selectedTemplate === template.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : isLocked
                          ? 'border-gray-200 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}>
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                            <div className="text-center">
                              <div className="text-3xl mb-2">🔒</div>
                              <div className="text-sm font-semibold text-purple-600">Upgrade to unlock</div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col h-full">
                          <div className="font-medium text-gray-900 mb-2">{template.name}</div>
                          <div className="text-sm text-gray-600 mb-3 flex-grow">{template.description}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {template.badge && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
                                {template.badge}
                              </span>
                            )}
                            {template.category && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
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
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
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
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed" title="Original CV was deleted">
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
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    AI Expert Review
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Get professional feedback on your CV before downloading</p>
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
                <div className="text-sm text-gray-600 animate-pulse mb-4">
                  {reviewStep}
                </div>
              )}
              
              {showReview && aiReview && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="space-y-4">
                    {/* Overall Assessment */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Overall Assessment</h4>
                      <p className="text-sm text-gray-700">{aiReview.overall_assessment}</p>
                    </div>
                    
                    {/* Strengths & Improvements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-green-700 text-sm mb-2">✓ Strengths</h4>
                        <ul className="space-y-1">
                          {aiReview.strengths.map((strength, index) => (
                            <li key={index} className="text-xs text-gray-600">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-orange-700 text-sm mb-2">⚡ Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {aiReview.improvements.map((improvement, index) => (
                            <li key={index} className="text-xs text-gray-600">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Additional Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Missing Sections</h4>
                        <ul className="space-y-1">
                          {aiReview.missing_sections.map((section, index) => (
                            <li key={index} className="text-xs text-gray-600">• {section}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Keywords to Add</h4>
                        <ul className="space-y-1">
                          {aiReview.keywords_to_add.map((keyword, index) => (
                            <li key={index} className="text-xs text-gray-600">• {keyword}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Formatting Tips</h4>
                        <ul className="space-y-1">
                          {aiReview.formatting_tips.map((tip, index) => (
                            <li key={index} className="text-xs text-gray-600">• {tip}</li>
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
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  <div className="flex justify-between text-sm text-gray-600">
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

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          templateId={previewTemplate}
          onClose={() => {
            const templateToSelect = previewTemplate
            setPreviewTemplate(null)
            setSelectedTemplate(templateToSelect)
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
