import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { CVSection } from '@/types/database'
import { analyzeContentDensity, getOptimizedSpacing, generateOptimizedTemplateCSS, isAdvancedTemplate } from '@/lib/pdf-layout-optimizer'
import { generateCreativeModernHTML, generateProfessionalColumnsHTML } from '@/lib/advanced-templates'

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generation_id, template, format } = await request.json()

    if (!generation_id || !template || !format) {
      return NextResponse.json({ 
        error: 'Missing required fields: generation_id, template, format' 
      }, { status: 400 })
    }

    // Fetch generation data AND original CV data
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select(`
        output_sections, 
        job_title,
        cv_id,
        cvs!inner(parsed_sections)
      `)
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Get original CV sections
    const originalSections: CVSection[] = (generation as any).cvs.parsed_sections.sections
    const modifiedSections: CVSection[] = generation.output_sections.sections
    const jobTitle = generation.job_title
    const cvId = generation.cv_id

    // Fetch latest hobbies from cv_sections table (user may have customized icons)
    const { data: latestHobbies } = await supabase
      .from('cv_sections')
      .select('*')
      .eq('cv_id', cvId)
      .eq('section_type', 'hobbies')
      .single()

    // Merge sections: use modified sections for experience, keep original for everything else
    const completeSections: CVSection[] = originalSections.map(originalSection => {
      // Check if this section was modified (typically experience sections)
      const modifiedSection = modifiedSections.find(mod => mod.type === originalSection.type)
      
      // If this is the hobbies section and we have latest data, use it
      if (originalSection.type === 'hobbies' && latestHobbies) {
        return {
          type: 'hobbies',
          content: latestHobbies.content,
          order: latestHobbies.order_index || originalSection.order || 999
        }
      }
      
      if (modifiedSection) {
        // Use the AI-modified version
        return modifiedSection
      } else {
        // Keep the original section (contact, education, interests, etc.)
        return originalSection
      }
    })

    // Add any new sections that were created by AI but didn't exist in original
    modifiedSections.forEach(modSection => {
      if (!originalSections.find(orig => orig.type === modSection.type)) {
        completeSections.push(modSection)
      }
    })

    // If hobbies exist in cv_sections but not in original/modified, add them
    if (latestHobbies && !completeSections.find(s => s.type === 'hobbies')) {
      completeSections.push({
        type: 'hobbies',
        content: latestHobbies.content,
        order: latestHobbies.order_index || 999
      })
    }

    // Sort sections by order
    const sections: CVSection[] = completeSections.sort((a, b) => (a.order || 0) - (b.order || 0))

    // Generate content based on format
    switch (format) {
      case 'html':
        return handleHtmlExport(sections, template, jobTitle)
      case 'pdf':
        return await handlePdfExport(sections, template, jobTitle)
      case 'docx':
        return await handleDocxExport(sections, template, jobTitle)
      case 'txt':
        return handleTxtExport(sections, jobTitle)
      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function handleHtmlExport(sections: CVSection[], template: string, jobTitle: string) {
  const html = generateTemplateHtml(sections, template)
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="CV_${sanitizeFilename(jobTitle)}_${template}.html"`
    }
  })
}

async function handlePdfExport(sections: CVSection[], template: string, jobTitle: string) {
  try {
    // Check if using advanced template
    let html: string
    let useOptimizedMargins = false
    let compressionLevel: 'none' | 'light' | 'medium' | 'heavy' = 'none'
    
    if (isAdvancedTemplate(template)) {
      // Use advanced template with icons and two-column layout
      const contactSection = sections.find(s => s.type === 'contact')
      
      // Extract contact info properly - handle both object and string formats
      let contactInfo = null
      if (contactSection?.content) {
        if (typeof contactSection.content === 'string') {
          // Parse string content to extract email, phone, address
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
          // Already an object
          contactInfo = contactSection.content
        }
      }
      
      if (template === 'creative_modern') {
        html = generateCreativeModernHTML(sections, contactInfo)
      } else if (template === 'professional_columns') {
        html = generateProfessionalColumnsHTML(sections, contactInfo)
      } else {
        // Fallback
        const metrics = analyzeContentDensity(sections)
        const optimizedSpacing = getOptimizedSpacing(metrics)
        html = generateTemplateHtml(sections, template, optimizedSpacing)
        useOptimizedMargins = true
        compressionLevel = metrics.compressionLevel
      }
      
      console.log('Using Advanced Template:', template)
    } else {
      // AI-powered layout optimization for basic templates
      const metrics = analyzeContentDensity(sections)
      const optimizedSpacing = getOptimizedSpacing(metrics)
      
      console.log('PDF Layout Optimization:', {
        estimatedPages: metrics.estimatedPages,
        compressionLevel: metrics.compressionLevel,
        sectionCount: metrics.sectionCount
      })
      
      html = generateTemplateHtml(sections, template, optimizedSpacing)
      useOptimizedMargins = true
      compressionLevel = metrics.compressionLevel
    }
    
    // Use chromium for serverless environments (Vercel)
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    // Optimized margins based on content density (for basic templates only)
    const margins = useOptimizedMargins 
      ? (compressionLevel === 'heavy' 
        ? { top: '6mm', right: '10mm', bottom: '6mm', left: '10mm' }
        : compressionLevel === 'medium'
        ? { top: '7mm', right: '11mm', bottom: '7mm', left: '11mm' }
        : { top: '8mm', right: '12mm', bottom: '8mm', left: '12mm' })
      : { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' } // Advanced templates handle their own margins
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: margins
    })
    
    await browser.close()
    
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV_${sanitizeFilename(jobTitle)}_${template}.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    // Fallback to HTML if PDF generation fails
    return handleHtmlExport(sections, template, jobTitle)
  }
}

async function handleDocxExport(sections: CVSection[], template: string, jobTitle: string) {
  try {
    const sortedSections = sections.sort((a, b) => a.order - b.order)
    const children: any[] = []

    sortedSections.forEach(section => {
      if (section.type === 'name') {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                bold: true,
                size: 32,
                color: '2563eb'
              })
            ],
            heading: HeadingLevel.TITLE,
            spacing: { after: 400 }
          })
        )
      } else {
        // Section title
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.type.replace('_', ' ').toUpperCase(),
                bold: true,
                size: 24,
                color: '2563eb'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          })
        )
        
        // Section content - use helper to handle arrays/objects
        const contentStr = getSectionContent(section.content)
        const contentLines = contentStr.split('\n')
        contentLines.forEach(line => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22
                  })
                ],
                spacing: { after: 100 }
              })
            )
          }
        })
      }
    })

    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    })

    const buffer = await Packer.toBuffer(doc)
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="CV_${sanitizeFilename(jobTitle)}_${template}.docx"`
      }
    })
  } catch (error) {
    console.error('DOCX generation error:', error)
    // Fallback to TXT if DOCX generation fails
    return handleTxtExport(sections, jobTitle)
  }
}

function handleTxtExport(sections: CVSection[], jobTitle: string) {
  const sortedSections = sections.sort((a, b) => a.order - b.order)
  let content = ''

  sortedSections.forEach(section => {
    const contentStr = getSectionContent(section.content)
    if (section.type === 'name') {
      content += `${contentStr}\n`
      content += '='.repeat(contentStr.length) + '\n\n'
    } else {
      content += `${section.type.replace('_', ' ').toUpperCase()}\n`
      content += '-'.repeat(section.type.length) + '\n'
      content += `${contentStr}\n\n`
    }
  })

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="CV_${sanitizeFilename(jobTitle)}.txt"`
    }
  })
}

function generateTemplateHtml(
  sections: CVSection[], 
  templateId: string, 
  optimizedSpacing?: ReturnType<typeof getOptimizedSpacing>
): string {
  // Reorder: contact first, then name, then others
  const contactSection = sections.find(s => s.type === 'contact')
  const nameSection = sections.find(s => s.type === 'name')
  const otherSections = sections.filter(s => s.type !== 'contact' && s.type !== 'name')
  const sortedSections = [contactSection, nameSection, ...otherSections.sort((a, b) => a.order - b.order)].filter(Boolean) as CVSection[]
  
  // Use optimized CSS if provided, otherwise use default templates
  if (optimizedSpacing) {
    const style = generateOptimizedTemplateCSS(templateId, optimizedSpacing)
    return generateHtmlWithStyle(sortedSections, style)
  }
  
  const templateStyles = {
    modern: `
      body { font-family: 'Inter', 'Segoe UI', sans-serif; line-height: 1.4; color: #1e293b; max-width: 100%; margin: 0; padding: 25px; background: #fff; font-size: 10px; }
      .contact { background: #3b82f6; color: #fff; padding: 10px 15px; margin: -25px -25px 15px -25px; font-size: 0.9em; line-height: 1.4; }
      .header { margin-bottom: 15px; border-left: 4px solid: #3b82f6; padding-left: 12px; }
      .name { font-size: 1.9em; font-weight: 800; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; line-height: 1.1; }
      .section { margin-bottom: 14px; padding-left: 12px; border-left: 3px solid #93c5fd; page-break-inside: avoid; }
      .section-title { font-size: 1.1em; font-weight: 700; color: #3b82f6; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
      .content { white-space: pre-wrap; line-height: 1.4; }
      @media print { body { padding: 20px; font-size: 9.5px; } .name { font-size: 1.8em; } }
    `,
    classic: `
      body { font-family: 'Garamond', 'Times New Roman', serif; line-height: 1.6; color: #1a1a1a; max-width: 100%; margin: 0; padding: 50px; background: #fffef8; font-size: 11px; }
      .contact { text-align: center; font-size: 0.85em; padding: 12px; background: #f5f5f0; border-top: 2px solid #8b7355; border-bottom: 2px solid #8b7355; margin: -50px -50px 25px -50px; line-height: 1.5; }
      .header { text-align: center; margin-bottom: 25px; }
      .name { font-size: 2.2em; font-weight: 700; margin-bottom: 15px; color: #2c2416; letter-spacing: 2px; line-height: 1.1; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .section-title { font-size: 1.2em; font-weight: 700; margin-bottom: 10px; border-bottom: 2px double #8b7355; padding-bottom: 5px; color: #2c2416; font-variant: small-caps; }
      .content { white-space: pre-wrap; text-align: justify; }
      @media print { body { padding: 40px; font-size: 10px; } .name { font-size: 2em; } }
    `,
    minimal: `
      body { font-family: 'Helvetica Neue', 'Arial', sans-serif; line-height: 1.5; color: #333; max-width: 100%; margin: 0; padding: 30px 20px; background: #fff; font-size: 10px; }
      .contact { font-size: 0.8em; color: #666; padding: 8px 0; margin-bottom: 20px; border-bottom: 1px solid #e5e5e5; line-height: 1.4; }
      .header { margin-bottom: 20px; }
      .name { font-size: 1.8em; font-weight: 200; margin-bottom: 12px; letter-spacing: 4px; color: #1a1a1a; line-height: 1.1; }
      .section { margin-bottom: 18px; page-break-inside: avoid; }
      .section-title { font-size: 0.85em; font-weight: 600; margin-bottom: 8px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
      .content { white-space: pre-wrap; font-size: 0.95em; font-weight: 300; line-height: 1.5; }
      @media print { body { padding: 25px 18px; } }
    `,
    creative: `
      body { font-family: 'Poppins', 'Helvetica Neue', sans-serif; line-height: 1.4; color: #1a202c; max-width: 100%; margin: 0; padding: 0; background: #f3f4f6; font-size: 10px; }
      .contact { background: #fff; padding: 10px 20px; font-size: 0.85em; line-height: 1.4; border-bottom: 3px solid #667eea; }
      .header { background: #fff; padding: 20px 20px 12px; margin-bottom: 12px; }
      .name { font-size: 2em; font-weight: 900; color: #667eea; margin-bottom: 8px; letter-spacing: -1px; line-height: 1.1; }
      .section { background: #fff; padding: 15px 20px; margin-bottom: 10px; border-right: 4px solid #667eea; page-break-inside: avoid; }
      .section-title { font-size: 1.1em; font-weight: 800; color: #667eea; margin-bottom: 8px; text-transform: uppercase; }
      .content { white-space: pre-wrap; line-height: 1.4; }
      @media print { body { background: #fff; padding: 0; } .section { border-right: 3px solid #667eea; padding: 12px 18px; margin-bottom: 8px; } .header { padding: 15px 18px 10px; } }
    `,
    technical: `
      body { font-family: 'Courier New', 'Consolas', monospace; line-height: 1.6; color: #e6edf3; max-width: 100%; margin: 0; padding: 0; background: #0d1117; font-size: 10.5px; }
      .contact { background: #161b22; color: #58a6ff; padding: 15px 25px; font-size: 0.85em; border-left: 4px solid #58a6ff; line-height: 1.7; }
      .header { background: #161b22; border-left: 5px solid #58a6ff; padding: 25px; margin-bottom: 20px; }
      .name { font-size: 2.2em; font-weight: 700; color: #58a6ff; margin-bottom: 12px; letter-spacing: 1px; line-height: 1.1; }
      .section { background: #161b22; border-left: 3px solid #30363d; padding: 20px 25px; margin-bottom: 18px; page-break-inside: avoid; }
      .section-title { font-size: 1.2em; font-weight: 700; color: #58a6ff; margin-bottom: 12px; text-transform: uppercase; }
      .section-title::before { content: '// '; color: #30363d; }
      .content { white-space: pre-wrap; color: #c9d1d9; font-size: 0.95em; line-height: 1.7; }
      @media print { body { background: #fff; color: #000; } .contact, .header, .section { background: #f5f5f5; color: #000; } .name, .section-title { color: #000; } .content { color: #333; } }
    `,
    executive: `
      body { font-family: 'Merriweather', 'Georgia', serif; line-height: 1.7; color: #2d2d2d; max-width: 100%; margin: 0; padding: 0; background: #ecf0f1; font-size: 11px; }
      .contact { background: #34495e; color: #ecf0f1; padding: 14px 35px; font-size: 0.85em; text-align: center; line-height: 1.6; }
      .header { text-align: center; background: #2c3e50; color: #fff; padding: 40px 35px 30px; margin-bottom: 25px; }
      .name { font-size: 2.5em; font-weight: 800; margin-bottom: 15px; letter-spacing: 3px; text-transform: uppercase; line-height: 1.1; }
      .section { background: #fff; padding: 28px 35px; margin-bottom: 20px; border-left: 6px solid #2c3e50; page-break-inside: avoid; }
      .section-title { font-size: 1.3em; font-weight: 800; color: #2c3e50; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ecf0f1; padding-bottom: 6px; }
      .content { white-space: pre-wrap; font-size: 1.02em; }
      @media print { body { background: #fff; padding: 0; } .header { background: #2c3e50; } .section { padding: 22px 30px; } }
    `,
    academic: `
      body { font-family: 'Crimson Text', 'Palatino', serif; line-height: 1.8; color: #2a2a2a; max-width: 100%; margin: 0; padding: 50px; background: #fdfdf8; font-size: 11px; }
      .contact { text-align: center; font-size: 0.85em; padding: 12px 0; margin-bottom: 28px; border-top: 2px solid #8b4513; border-bottom: 2px solid #8b4513; line-height: 1.6; color: #5a4a3a; }
      .header { text-align: center; margin-bottom: 35px; }
      .name { font-size: 2em; font-weight: 700; color: #5a3a2a; margin-bottom: 15px; font-variant: small-caps; letter-spacing: 1px; line-height: 1.1; }
      .section { margin-bottom: 30px; page-break-inside: avoid; }
      .section-title { font-size: 1.3em; font-weight: 700; color: #8b4513; margin-bottom: 12px; font-variant: small-caps; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 5px; }
      .content { white-space: pre-wrap; text-align: justify; line-height: 1.9; }
      @media print { body { padding: 40px; font-size: 10px; } .name { font-size: 1.8em; } }
    `,
    startup: `
      body { font-family: 'DM Sans', 'Inter', sans-serif; line-height: 1.6; color: #0f172a; max-width: 100%; margin: 0; padding: 0; background: #f0f9ff; font-size: 11px; }
      .contact { background: #fff; padding: 15px 30px; font-size: 0.85em; border-bottom: 3px solid #06b6d4; line-height: 1.6; }
      .header { background: #06b6d4; color: #fff; padding: 35px 30px; margin-bottom: 22px; }
      .name { font-size: 2.3em; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.5px; line-height: 1.1; }
      .section { background: #fff; padding: 25px 30px; border-radius: 8px; margin-bottom: 18px; border: 2px solid #e0f2fe; page-break-inside: avoid; }
      .section-title { font-size: 1.3em; font-weight: 800; color: #0891b2; margin-bottom: 12px; text-transform: uppercase; }
      .content { white-space: pre-wrap; }
      @media print { body { background: #fff; padding: 0; } .header { background: #06b6d4; } .section { border-radius: 0; padding: 20px 25px; } }
    `,
    corporate: `
      body { font-family: 'Calibri', 'Segoe UI', sans-serif; line-height: 1.6; color: #2c2c2c; max-width: 100%; margin: 0; padding: 0; background: #f5f5f5; font-size: 11px; }
      .contact { background: #1a4d7a; color: #fff; padding: 14px 30px; font-size: 0.85em; text-align: center; line-height: 1.6; }
      .header { background: #003366; color: #fff; padding: 35px 30px; margin-bottom: 22px; }
      .name { font-size: 2.3em; font-weight: 800; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.1; }
      .section { background: #fff; margin-bottom: 20px; padding: 25px 30px; border-top: 3px solid #003366; page-break-inside: avoid; }
      .section-title { font-size: 1.2em; font-weight: 800; color: #003366; margin-bottom: 12px; text-transform: uppercase; }
      .content { white-space: pre-wrap; }
      @media print { body { background: #fff; padding: 0; } .header { background: #003366; } .section { padding: 20px 25px; } }
    `,
    designer: `
      body { font-family: 'Montserrat', 'Futura', sans-serif; line-height: 1.7; color: #2d2d2d; max-width: 100%; margin: 0; padding: 0; background: #fafafa; font-size: 11px; }
      .contact { background: #fff; padding: 15px 35px; font-size: 0.85em; border-bottom: 5px solid; border-image: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb) 1; line-height: 1.6; }
      .header { padding: 45px 35px 35px; margin-bottom: 25px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%); color: #fff; }
      .name { font-size: 2.8em; font-weight: 900; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); letter-spacing: -1px; line-height: 1.1; }
      .section { background: #fff; padding: 28px 35px; margin-bottom: 20px; border-radius: 6px; border-left: 6px solid #ff6b6b; page-break-inside: avoid; }
      .section-title { font-size: 1.5em; font-weight: 900; color: #ff6b6b; margin-bottom: 15px; text-transform: uppercase; }
      .content { white-space: pre-wrap; margin-left: 10px; }
      @media print { body { background: #fff; padding: 0; } .header { background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb); } .section { border-radius: 0; padding: 22px 30px; } }
    `
  }

  const style = templateStyles[templateId as keyof typeof templateStyles] || templateStyles.modern

  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV</title>
        <style>${style}</style>
      </head>
      <body>
  `

  sortedSections.forEach(section => {
    const contentStr = getSectionContent(section.content)
    if (section.type === 'contact') {
      html += `<div class="contact">${escapeHtml(contentStr)}</div>`
    } else if (section.type === 'name') {
      html += `
        <div class="header">
          <div class="name">${escapeHtml(contentStr)}</div>
        </div>
      `
    } else {
      html += `
        <div class="section">
          <div class="section-title">${escapeHtml(section.type.replace('_', ' '))}</div>
          <div class="content">${escapeHtml(contentStr)}</div>
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

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9]/gi, '_').substring(0, 50)
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function generateHtmlWithStyle(sections: CVSection[], style: string): string {
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV</title>
        <style>${style}</style>
      </head>
      <body>
  `

  sections.forEach(section => {
    const contentStr = getSectionContent(section.content)
    if (section.type === 'contact') {
      html += `<div class="contact">${escapeHtml(contentStr)}</div>`
    } else if (section.type === 'name') {
      html += `
        <div class="header">
          <div class="name">${escapeHtml(contentStr)}</div>
        </div>
      `
    } else {
      html += `
        <div class="section">
          <div class="section-title">${escapeHtml(section.type.replace('_', ' '))}</div>
          <div class="content">${escapeHtml(contentStr)}</div>
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
