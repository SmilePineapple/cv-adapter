import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { getOpenAIClient } from '@/lib/openai-client'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'
import puppeteer from 'puppeteer-core'
import puppeteerFull from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { CVSection } from '@/types/database'
import { analyzeContentDensity, getOptimizedSpacing, generateOptimizedTemplateCSS, isAdvancedTemplate } from '@/lib/pdf-layout-optimizer'
import { generateCreativeModernHTML, generateProfessionalColumnsHTML } from '@/lib/advanced-templates'
import { generateIndustryTemplateHTML, industryTemplates } from '@/lib/industry-templates'
import { stunningTemplates } from '@/lib/stunning-templates'
import { trackExport, trackTemplateSelection } from '@/lib/analytics'
import { measureRenderedCV, computeFillScale } from '@/lib/cv-render-measurer'
import { createRenderRepairPlan, createRenderRepairPrompt } from '@/lib/cv-render-repair'
import { renderPagePlanHTML } from '@/lib/page-plan-renderer'

// Configure runtime for Vercel
export const runtime = 'nodejs'
export const maxDuration = 60

// Helper function to safely get string content from section
const getSectionContent = (content: unknown): string => {
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
        const extractAllStrings = (obj: Record<string, unknown>): string[] => {
          const strings: string[] = []
          for (const value of Object.values(obj)) {
            if (typeof value === 'string' && value.trim()) {
              strings.push(value.trim())
            } else if (typeof value === 'object' && value !== null) {
              strings.push(...extractAllStrings(value as Record<string, unknown>))
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient()
    
    // Check authentication - try cookie-based auth first, fall back to Bearer token
    let user = null
    let activeClient = supabase
    const { data: { user: cookieUser } } = await supabase.auth.getUser()
    if (cookieUser) {
      user = cookieUser
    } else {
      // Try Bearer token in Authorization header
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        const { createClient } = await import('@supabase/supabase-js')
        const tokenClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        )
        const { data: { user: tokenUser } } = await tokenClient.auth.getUser()
        if (tokenUser) { user = tokenUser; activeClient = tokenClient }
      }
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generation_id, template, format } = await request.json()

    if (!generation_id || !template || !format) {
      return NextResponse.json({
        error: 'Missing required fields: generation_id, template, format'
      }, { status: 400 })
    }

    // Fetch generation data (allow orphaned generations with NULL cv_id)
    const { data: generation, error: genError } = await activeClient
      .from('generations')
      .select(`
        output_sections,
        job_title,
        cv_id,
        cvs(parsed_sections, photo_url),
        max_pages
      `)
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Get original CV sections
    const generationData = generation as unknown as {cvs: {parsed_sections: {sections: CVSection[]}, photo_url?: string | null}, max_pages?: number}
    const originalSections: CVSection[] = generationData.cvs.parsed_sections.sections
    const modifiedSections: CVSection[] = generation.output_sections.sections
    const jobTitle = generation.job_title
    const cvId = generation.cv_id
    const photoUrl = generationData.cvs?.photo_url || null
    const maxPages = generation.max_pages || 1

    console.log('📏 DEBUG: max_pages from generation:', generation.max_pages)
    console.log('📏 DEBUG: using maxPages:', maxPages)

    // CRITICAL FIX: Use generation output_sections as primary source for tailored CVs
    // This contains the AI-tailored content. Only use cv_sections if user has explicitly
    // edited the CV in the editor (which updates a timestamp we can check)
    let completeSections: CVSection[] = []
    
    // Check if cv_sections has been recently updated (user edited after generation)
    const { data: currentSections } = await supabase
      .from('cv_sections')
      .select('section_type, title, content, order_index, hobby_icons, updated_at')
      .eq('cv_id', cvId)
      .order('order_index')
    
    // Get generation created_at timestamp
    const { data: genTimestamp } = await supabase
      .from('generations')
      .select('created_at')
      .eq('id', generation_id)
      .single()
    
    // If cv_sections exist AND were updated AFTER generation, use them (user made edits)
    // Otherwise use generation output_sections (the tailored content)
    const hasUserEdits = currentSections && currentSections.length > 0 && 
                         currentSections.some(s => s.updated_at && genTimestamp && 
                         new Date(s.updated_at) > new Date(genTimestamp.created_at))
    
    if (hasUserEdits) {
      console.log('✅ Using edited sections from cv_sections (user made edits after generation)')
      completeSections = currentSections!.map(section => ({
        type: section.section_type,
        content: section.hobby_icons && section.hobby_icons.length > 0 
          ? section.hobby_icons
          : section.content,
        order: section.order_index
      }))
    } else {
      console.log('✅ Using generation output_sections (tailored content)')
      completeSections = [...modifiedSections]
    }
    
    // CRITICAL: Ensure name and contact sections are ALWAYS present from original CV
    // The AI sometimes doesn't include these in output_sections, or includes them with empty content
    const nameInOutput = completeSections.find(s => s.type === 'name')
    const contactInOutput = completeSections.find(s => s.type === 'contact')
    const nameIsEmpty = !nameInOutput || !getSectionContent(nameInOutput.content).trim()
    const contactIsEmpty = !contactInOutput || !getSectionContent(contactInOutput.content).trim()
    
    if (nameIsEmpty && originalSections) {
      const nameFromOriginal = originalSections.find(s => s.type === 'name')
      if (nameFromOriginal && getSectionContent(nameFromOriginal.content).trim()) {
        console.log('✅ Restoring name section from original CV (was missing/empty):', nameFromOriginal.content)
        // Replace empty or add missing
        completeSections = completeSections.filter(s => s.type !== 'name')
        completeSections.unshift({
          type: 'name',
          content: nameFromOriginal.content,
          order: 0
        })
      }
    }
    
    if (contactIsEmpty && originalSections) {
      const contactFromOriginal = originalSections.find(s => s.type === 'contact')
      if (contactFromOriginal && getSectionContent(contactFromOriginal.content).trim()) {
        console.log('✅ Restoring contact section from original CV (was missing/empty):', contactFromOriginal.content)
        // Replace empty or add missing
        completeSections = completeSections.filter(s => s.type !== 'contact')
        completeSections.splice(1, 0, {
          type: 'contact',
          content: contactFromOriginal.content,
          order: 1
        })
      }
    }

    // Deduplicate sections by type (keep only the first occurrence)
    const seenTypes = new Set<string>()
    const deduplicatedSections = completeSections.filter(section => {
      if (seenTypes.has(section.type)) {
        console.log(`Removing duplicate section: ${section.type}`)
        return false
      }
      seenTypes.add(section.type)
      return true
    })

    // Sort sections by order
    const sections: CVSection[] = deduplicatedSections.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    console.log('📄 Export sections:', sections.map(s => s.type).join(', '))
    console.log('📄 Section details:')
    sections.forEach(s => {
      const contentPreview = typeof s.content === 'string' 
        ? s.content.substring(0, 100) 
        : JSON.stringify(s.content).substring(0, 100)
      console.log(`  - ${s.type}: ${contentPreview}${contentPreview.length >= 100 ? '...' : ''}`)
      
      // Warn if critical sections are empty or missing
      if (['name', 'contact', 'education', 'certifications'].includes(s.type)) {
        const contentStr = getSectionContent(s.content)
        console.log(`🔍 DEBUG ${s.type}:`)
        console.log(`   Type: ${typeof s.content}`)
        console.log(`   Is Array: ${Array.isArray(s.content)}`)
        console.log(`   Raw content:`, JSON.stringify(s.content, null, 2))
        console.log(`   Processed content: "${contentStr}"`)
        console.log(`   Length: ${contentStr.length}`)
        
        if (!contentStr || contentStr.trim().length === 0) {
          console.error(`🚨 CRITICAL: ${s.type} section is EMPTY!`)
        }
      }
    })
    
    // Check if name and contact sections exist
    const hasName = sections.some(s => s.type === 'name')
    const hasContact = sections.some(s => s.type === 'contact')
    console.log(`📋 Has name section: ${hasName}`)
    console.log(`📋 Has contact section: ${hasContact}`)
    if (!hasName) console.error('🚨 CRITICAL: NAME SECTION MISSING!')
    if (!hasContact) console.error('🚨 CRITICAL: CONTACT SECTION MISSING!')

    // Track analytics
    try {
      await trackTemplateSelection(template)
      await trackExport('cv', format, template)
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError)
      // Don't fail export if analytics fails
    }

    // Generate content based on format
    switch (format) {
      case 'html':
        return handleHtmlExport(sections, template, jobTitle)
      case 'pdf':
        return await handlePdfExport(sections, template, jobTitle, photoUrl, maxPages)
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

async function handlePdfExport(
  sections: CVSection[],
  template: string,
  jobTitle: string,
  photoUrl?: string | null,
  maxPages?: number,
  renderRepairAttempted: boolean = false
) {
  try {
    // For single-page CVs, use the original template-specific generators with full designs
    // For multi-page CVs, use the deterministic page-plan renderer with zone-based layout
    let html: string
    
    if (!maxPages || maxPages === 1) {
      console.log(`🎨 Using template-specific renderer for single-page PDF (${template})`)
      html = generateTemplateHtml(sections, template, undefined, photoUrl, 1)
    } else {
      console.log(`📐 Using deterministic page-plan renderer for ${maxPages}-page PDF`)
      html = renderPagePlanHTML(sections, maxPages, template)
    }
    
    // Use bundled Chromium in dev, sparticuz in production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production'
    const browser = isProduction
      ? await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        })
      : await puppeteerFull.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
    
    const page = await browser.newPage()
    // Set viewport to A4 at 96dpi so CSS mm units and overflow:hidden match PDF output
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await new Promise(r => setTimeout(r, 500))

    const renderMeasurement = await measureRenderedCV(page, maxPages)
    const measLog = {
      targetPages: renderMeasurement.targetPages,
      actualPages: renderMeasurement.actualPages,
      overflowing: renderMeasurement.overflowing,
      pageOccupancy: renderMeasurement.pageOccupancy.map(item => ({
        page: item.page,
        occupancy: Number(item.occupancy.toFixed(2))
      })),
      underfilledPages: renderMeasurement.underfilledPages.map(item => item.page),
      sectionPlacements: renderMeasurement.sectionPlacements.map(section => ({
        type: section.type,
        pageStart: section.pageStart,
        pageEnd: section.pageEnd,
        height: Math.round(section.height)
      }))
    }
    console.log('📐 Render measurement:', measLog)

    // Deterministic spacing fill: only applies to multi-page CVs using page-plan renderer
    // For single-page CVs, the template generators handle their own spacing
    let activeMeasurement = renderMeasurement
    if (maxPages && maxPages > 1) {
      const fillScale = computeFillScale(renderMeasurement)
      if (fillScale > 1.02) {
        console.log(`📐 Applying deterministic fill scale: ${fillScale.toFixed(3)}`)
        html = renderPagePlanHTML(sections, maxPages, template, fillScale)
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 })
        await new Promise(r => setTimeout(r, 500))
        activeMeasurement = await measureRenderedCV(page, maxPages)
        const fillLog = {
          fillScale: fillScale.toFixed(3),
          actualPages: activeMeasurement.actualPages,
          overflowing: activeMeasurement.overflowing,
          pageOccupancy: activeMeasurement.pageOccupancy.map(item => ({
            page: item.page,
            occupancy: Number(item.occupancy.toFixed(2))
          }))
        }
        console.log('📐 Render measurement after fill:', fillLog)
      }
    }

    const renderRepairPlan = createRenderRepairPlan(activeMeasurement)
    console.log('📐 Render repair plan:', renderRepairPlan)

    if (renderRepairPlan.shouldRepair && !renderRepairAttempted) {
      console.log('📐 Running one-pass render-based layout repair...')
      try {
        const repairedSections = await repairSectionsForRenderedLayout(sections, activeMeasurement, renderRepairPlan)
        await browser.close()
        return handlePdfExport(repairedSections, template, jobTitle, photoUrl, maxPages, true)
      } catch (repairError) {
        console.error('❌ Render-based layout repair failed:', repairError)
      }
    }
    
    // Standard A4 margins for page-plan renderer (template handles internal layout)
    const margins = { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    
    const pdfOptions = {
      format: 'A4' as const,
      printBackground: true,
      margin: margins
    }

    const pdf = await page.pdf(pdfOptions)
    
    await browser.close()
    
    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV_${sanitizeFilename(jobTitle)}_${template}.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'PDF generation failed. Please try again.' }, { status: 500 })
  }
}

async function repairSectionsForRenderedLayout(
  sections: CVSection[],
  renderMeasurement: Awaited<ReturnType<typeof measureRenderedCV>>,
  renderRepairPlan: ReturnType<typeof createRenderRepairPlan>
): Promise<CVSection[]> {
  const openai = getOpenAIClient()
  const prompt = createRenderRepairPrompt(sections, renderMeasurement, renderRepairPlan)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You repair CV content based on real browser layout measurements. Preserve facts and return valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.2,
    max_tokens: 12000
  })

  const content = completion.choices[0]?.message?.content || '{}'
  const parsed = JSON.parse(content)

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Render repair response did not include a sections array.')
  }

  return parsed.sections.map((section: Partial<CVSection>, index: number) => ({
    type: section.type,
    content: section.content,
    order: typeof section.order === 'number' ? section.order : index + 1
  })).filter((section: Partial<CVSection>) => section.type && section.content !== undefined) as CVSection[]
}

async function handleDocxExport(sections: CVSection[], template: string, jobTitle: string) {
  try {
    const sortedSections = sections.sort((a, b) => a.order - b.order)
    const children: Paragraph[] = []

    sortedSections.forEach(section => {
      if (section.type === 'name') {
        // Name - Large, bold, centered
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                bold: true,
                size: 36,
                color: '1e3a8a', // Dark blue
                font: 'Calibri'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        )
      } else if (section.type === 'contact') {
        // Contact info - smaller, centered
        const contentStr = getSectionContent(section.content)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contentStr.replace(/\n/g, ' | '),
                size: 20,
                color: '475569',
                font: 'Calibri'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          })
        )
      } else if (section.type === 'summary') {
        // Summary - with border
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 26,
                color: '1e3a8a',
                font: 'Calibri'
              })
            ],
            spacing: { before: 200, after: 150 },
            border: {
              bottom: {
                color: '3b82f6',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          })
        )
        
        const contentStr = getSectionContent(section.content)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contentStr,
                size: 22,
                color: '334155',
                font: 'Calibri'
              })
            ],
            spacing: { after: 250 }
          })
        )
      } else {
        // Other sections - styled headers with underline
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.type.replace('_', ' ').toUpperCase(),
                bold: true,
                size: 26,
                color: '1e3a8a',
                font: 'Calibri'
              })
            ],
            spacing: { before: 200, after: 150 },
            border: {
              bottom: {
                color: '3b82f6',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          })
        )
        
        // Section content with better formatting
        const contentStr = getSectionContent(section.content)
        const contentLines = contentStr.split('\n')
        contentLines.forEach(line => {
          if (line.trim()) {
            const isBullet = line.trim().startsWith('•')
            const isHeader = line.includes('|') && !isBullet
            
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                    bold: isHeader,
                    color: isHeader ? '1e40af' : '334155',
                    font: 'Calibri'
                  })
                ],
                spacing: { after: isBullet ? 80 : 120 },
                indent: isBullet ? { left: 360 } : undefined
              })
            )
          }
        })
        
        // Add spacing after section
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '', size: 1 })],
            spacing: { after: 150 }
          })
        )
      }
    })

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: children
      }]
    })

    const buffer = await Packer.toBuffer(doc)
    
    return new NextResponse(buffer as unknown as BodyInit, {
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
  optimizedSpacing?: ReturnType<typeof getOptimizedSpacing>,
  photoUrl?: string | null,
  maxPages?: number
): string {
  // Check if this is an advanced template that needs special handling
  const advancedTemplates = ['creative_modern', 'professional_columns']
  const stunningTemplateIds = ['professional-metrics', 'teal-sidebar', 'soft-header', 'artistic-header', 'bold-split']
  
  // For advanced templates, use their specific HTML generators
  if (advancedTemplates.includes(templateId)) {
    const contactInfo = extractContactInfoFromSections(sections)
    if (templateId === 'creative_modern') {
      return generateCreativeModernHTML(sections, contactInfo, maxPages || 1)
    }
    if (templateId === 'professional_columns') {
      return generateProfessionalColumnsHTML(sections, contactInfo)
    }
  }
  
  // For stunning templates, use their specific generators
  if (stunningTemplateIds.includes(templateId)) {
    const templateData = prepareStunningTemplateData(sections, photoUrl)
    const generator = stunningTemplates[templateId as keyof typeof stunningTemplates]
    if (generator) {
      return generator(templateData)
    }
  }
  
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

  // Map new template IDs to existing styles until we implement custom styles
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

// Helper to extract contact info from sections for advanced templates
function extractContactInfoFromSections(sections: CVSection[]) {
  const contactSection = sections.find(s => s.type === 'contact')
  if (!contactSection) {
    return { email: '', phone: '', address: '', website: '', linkedin: '' }
  }
  
  try {
    const content = getSectionContent(contactSection.content)
    // Try parsing as JSON first
    if (content.startsWith('{')) {
      return JSON.parse(content)
    }
    // Otherwise extract from text
    const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/)
    const phoneMatch = content.match(/[\d\s\-\+\(\)]{10,}/)
    return {
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      address: '',
      website: '',
      linkedin: ''
    }
  } catch {
    return { email: '', phone: '', address: '', website: '', linkedin: '' }
  }
}

// Helper to prepare template data for stunning templates
function prepareStunningTemplateData(sections: CVSection[], photoUrl?: string | null) {
  const nameSection = sections.find(s => s.type === 'name')
  const contactSection = sections.find(s => s.type === 'contact')
  const summarySection = sections.find(s => s.type === 'summary' || (s.type as string) === 'professional_summary')
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
      const content = getSectionContent(contactSection.content)
      if (content.startsWith('{')) {
        const contact = JSON.parse(content)
        email = contact.email || ''
        phone = contact.phone || ''
        address = contact.address || ''
        website = contact.website || contact.linkedin || ''
      } else {
        const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/)
        const phoneMatch = content.match(/[\d\s\-\+\(\)]{10,}/)
        if (emailMatch) email = emailMatch[0]
        if (phoneMatch) phone = phoneMatch[0]
      }
    } catch {
      // ignore
    }
  }
  
  return {
    name: nameSection ? getSectionContent(nameSection.content) : '',
    email,
    phone,
    location: address,
    website,
    summary: summarySection ? getSectionContent(summarySection.content) : '',
    experience: experienceSection ? getSectionContent(experienceSection.content) : '',
    education: educationSection ? getSectionContent(educationSection.content) : '',
    skills: skillsSection ? getSectionContent(skillsSection.content) : '',
    skillScores: null,
    languages: languagesSection ? getSectionContent(languagesSection.content) : '',
    hobbies: hobbiesSection ? getSectionContent(hobbiesSection.content) : '',
    certifications: certificationsSection ? getSectionContent(certificationsSection.content) : '',
    photoUrl: photoUrl || ''
  }
}
