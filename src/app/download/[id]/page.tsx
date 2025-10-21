'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { CVSection } from '@/types/database'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Eye,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react'
import TemplatePreview from '@/components/TemplatePreview'
import { generateCreativeModernHTML, generateProfessionalColumnsHTML } from '@/lib/advanced-templates'

interface GenerationData {
  id: string
  job_title: string
  output_sections: { sections: CVSection[] }
  created_at: string
}

const TEMPLATES = [
  // ✨ NEW ADVANCED TEMPLATES
  { id: 'creative_modern', name: '✨ Creative Modern', description: 'Two-column with icons & decorative elements', badge: 'NEW', advanced: true },
  { id: 'professional_columns', name: '✨ Professional Columns', description: 'Sidebar layout with skill bars & hobby badges', badge: 'NEW', advanced: true },
  
  // BASIC TEMPLATES
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'creative', name: 'Creative', description: 'Bold and eye-catching' },
  { id: 'technical', name: 'Technical', description: 'Perfect for tech roles' },
  { id: 'executive', name: 'Executive', description: 'Senior-level professional' },
  { id: 'academic', name: 'Academic', description: 'Research and education focused' },
  { id: 'startup', name: 'Startup', description: 'Dynamic and innovative' },
  { id: 'corporate', name: 'Corporate', description: 'Traditional business style' },
  { id: 'designer', name: 'Designer', description: 'Visually striking layout' }
]

const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', description: 'Best for applications' },
  { id: 'docx', name: 'Word', description: 'Editable document' },
  { id: 'html', name: 'HTML', description: 'Web preview' },
  { id: 'txt', name: 'Text', description: 'Plain text format' }
]

// Helper function to safely get string content from section
const getSectionContent = (content: any): string => {
  if (!content) return ''
  
  // If content is already a string, return it
  if (typeof content === 'string') {
    return content
  }
  
  // If content is an array (like experience), format it
  if (Array.isArray(content)) {
    return content.map((item) => {
      // Handle different object structures
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
        
        // Fallback: try to extract any meaningful text
        const values = Object.values(item).filter(v => typeof v === 'string' && v.trim())
        return values.join('\n')
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
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStep, setExportStep] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    fetchGenerationData()
  }, [generationId])

  useEffect(() => {
    if (generationData) {
      generatePreview()
    }
  }, [generationData, selectedTemplate])

  const fetchGenerationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: generation, error } = await supabase
        .from('generations')
        .select('id, job_title, output_sections, created_at, cv_id, cvs!inner(parsed_sections)')
        .eq('id', generationId)
        .eq('user_id', user.id)
        .single()

      if (error || !generation) {
        toast.error('Generation not found')
        router.push('/dashboard')
        return
      }

      // Merge original and modified sections for full CV preview
      const originalSections = (generation as any).cvs?.parsed_sections?.sections || []
      const modifiedSections = generation.output_sections?.sections || []
      
      const mergedSections = originalSections.map((originalSection: CVSection) => {
        const modifiedSection = modifiedSections.find((mod: CVSection) => mod.type === originalSection.type)
        return modifiedSection || originalSection
      })
      
      // Add any new sections from modifications
      modifiedSections.forEach((modSection: CVSection) => {
        if (!originalSections.find((orig: CVSection) => orig.type === modSection.type)) {
          mergedSections.push(modSection)
        }
      })
      
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

    const sections = generationData.output_sections.sections
    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    
    // Generate HTML preview based on template
    const html = generateTemplateHtml(sections, selectedTemplate)
    setPreviewHtml(html)
  }

  const generateTemplateHtml = (sections: CVSection[], templateId: string): string => {
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

    const style = templateStyles[templateId as keyof typeof templateStyles] || templateStyles.modern

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
      {/* Header */}
      <header className="bg-white border-b">
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
              <span className="text-xl font-bold text-gray-900">CV Adapter</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Download Your Tailored CV
          </h1>
          <p className="text-gray-600">
            Choose a template and format, then download your optimized CV
          </p>
        </div>

        {/* Export Format Selection - Moved to Top */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXPORT_FORMATS.map((format) => (
              <label key={format.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="sr-only"
                />
                <div className={`
                  p-4 rounded-lg border-2 transition-colors text-center
                  ${selectedFormat === format.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <div className="font-medium text-gray-900">{format.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{format.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Template Selection - Left Side */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h2>
              <div className="space-y-3">
                {TEMPLATES.map((template) => (
                  <label key={template.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`
                      flex-1 p-3 rounded-lg border-2 transition-all
                      ${selectedTemplate === template.id 
                        ? (template.advanced ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50' : 'border-blue-500 bg-blue-50')
                        : (template.advanced ? 'border-purple-200 hover:border-purple-300 bg-gradient-to-r from-purple-50/30 to-blue-50/30' : 'border-gray-200 hover:border-gray-300')
                      }
                    `}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="flex items-center gap-2">
                          {template.badge && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
                              {template.badge}
                            </span>
                          )}
                          {template.advanced && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setPreviewTemplate(template.id)
                              }}
                              className="p-1.5 hover:bg-purple-100 rounded-md transition-colors z-10"
                              title="Preview template"
                              type="button"
                            >
                              <Eye className="w-4 h-4 text-purple-600" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                      {template.advanced && (
                        <div className="mt-2 text-xs text-purple-600 font-medium">
                          ✨ Icons • Two-Column Layout • Visual Elements
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
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
            
            {/* Back to Dashboard Button */}
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
          
          {/* Preview - Right Side (Centered) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <span className="text-sm text-gray-600">
                  ({TEMPLATES.find(t => t.id === selectedTemplate)?.name} Template)
                </span>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[800px] border-0"
                  title="CV Preview"
                />
              </div>
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
    </div>
  )
}
