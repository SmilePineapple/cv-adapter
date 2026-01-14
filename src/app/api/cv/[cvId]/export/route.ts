import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient, createSupabaseAdminClient } from '@/lib/supabase-server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

// Helper function to safely extract content from section
const getSectionContent = (section: any): string => {
  if (!section) return ''
  
  const content = section.content?.raw_content || section.content || ''
  
  // If content is an array (like experience), format it properly
  if (Array.isArray(content)) {
    return content.map((item) => {
      // Work Experience format
      if (item.company && item.job_title) {
        const parts = [
          `${item.job_title} at ${item.company}`,
          item.dates || item.duration || '',
          item.location || '',
          item.responsibilities || item.description || ''
        ].filter(Boolean)
        return parts.join('\n')
      }
      
      // Education format
      if (item.degree || item.institution) {
        const parts = [
          item.degree || '',
          item.institution || '',
          item.graduation_date || item.dates || '',
          item.details || ''
        ].filter(Boolean)
        return parts.join('\n')
      }
      
      // Skills/certifications format
      if (item.name || item.title) {
        return `${item.name || item.title}${item.level ? ` - ${item.level}` : ''}`
      }
      
      // Fallback: try to extract meaningful text
      if (typeof item === 'object') {
        const values = Object.values(item).filter(v => v && typeof v === 'string')
        return values.join(' • ')
      }
      
      return String(item)
    }).join('\n\n')
  }
  
  // If content is an object, try to extract text
  if (typeof content === 'object' && content !== null) {
    const values = Object.values(content).filter(v => v && typeof v === 'string')
    return values.join('\n')
  }
  
  // Return as string
  return String(content || '')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  try {
    const { cvId } = await params

    // Use route client for authentication (cookies)
    const supabase = createSupabaseRouteClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'Please log in again.' 
      }, { status: 401 })
    }
    
    // Use admin client for database operations
    const adminClient = createSupabaseAdminClient()

    const body = await request.json()
    let format = body.format
    const sections = body.sections
    const theme_settings = body.theme_settings

    // Verify CV ownership first
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('id, user_id, file_meta')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Handle different export formats
    if (format === 'txt') {
      // Simple text export
      const cvText = sections.map((section: any) => {
        const content = getSectionContent(section)
        return `${section.title.toUpperCase()}\n${'-'.repeat(section.title.length)}\n${content}\n\n`
      }).join('')

      const fullCV = `${cvData.file_meta?.name || 'CV'}\n${'='.repeat(50)}\n\n${cvText}`

      return new NextResponse(fullCV, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${cvData.file_meta?.name || 'CV'}.txt"`,
        },
      })
    }

    if (format === 'pdf') {
      // For PDF, convert DOCX to PDF using the download page
      // Generate DOCX first, then user can convert
      // For now, redirect to DOCX
      format = 'docx'
    }

    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // CV Header
          new Paragraph({
            text: cvData.file_meta?.name?.replace('.docx', '').replace('.pdf', '') || 'Professional CV',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          // Sections
          ...sections.flatMap((section: any) => {
            const sectionParagraphs = []
            
            // Section title
            sectionParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 28,
                    color: theme_settings?.colors?.primary?.replace('#', '') || '1f2937'
                  })
                ],
                spacing: { before: 300, after: 200 },
                border: {
                  bottom: {
                    color: theme_settings?.colors?.primary?.replace('#', '') || '1f2937',
                    space: 1,
                    style: 'single',
                    size: 6
                  }
                }
              })
            )
            
            // Section content - use helper to extract properly
            const content = getSectionContent(section)
            if (content) {
              // Split content by lines and create paragraphs
              const lines = content.split('\n').filter((line: string) => line.trim())
              lines.forEach((line: string) => {
                // Handle markdown formatting
                const runs: TextRun[] = []
                
                // Split by markdown patterns and create runs
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g)
                
                parts.forEach((part: string) => {
                  if (!part) return
                  
                  // Bold
                  if (part.startsWith('**') && part.endsWith('**')) {
                    runs.push(new TextRun({ 
                      text: part.slice(2, -2), 
                      bold: true 
                    }))
                  }
                  // Italic
                  else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                    runs.push(new TextRun({ 
                      text: part.slice(1, -1), 
                      italics: true 
                    }))
                  }
                  // Underline
                  else if (part.startsWith('__') && part.endsWith('__')) {
                    runs.push(new TextRun({ 
                      text: part.slice(2, -2), 
                      underline: {} 
                    }))
                  }
                  // Regular text
                  else {
                    runs.push(new TextRun({ text: part }))
                  }
                })
                
                // If no runs were created, add the line as plain text
                if (runs.length === 0) {
                  runs.push(new TextRun({ text: line }))
                }
                
                sectionParagraphs.push(
                  new Paragraph({
                    children: runs,
                    spacing: { after: 120 }
                  })
                )
              })
            }
            
            return sectionParagraphs
          })
        ]
      }]
    })

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${cvData.file_meta?.name || 'CV'}.docx"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ 
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
