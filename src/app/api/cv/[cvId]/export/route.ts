import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient, createSupabaseAdminClient } from '@/lib/supabase-server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

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
    let { format, sections, theme_settings } = body

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
        return `${section.title.toUpperCase()}\n${'-'.repeat(section.title.length)}\n${section.content?.raw_content || ''}\n\n`
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
            
            // Section content
            const content = section.content?.raw_content || ''
            if (content) {
              // Split content by lines and create paragraphs
              const lines = content.split('\n').filter((line: string) => line.trim())
              lines.forEach((line: string) => {
                // Handle markdown formatting
                const runs = []
                let currentText = line
                
                // Process bold text
                currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match: string, text: string) => {
                  runs.push(new TextRun({ text, bold: true }))
                  return '|||BOLD|||'
                })
                
                // Process italic text
                currentText = currentText.replace(/\*(.*?)\*/g, (match: string, text: string) => {
                  runs.push(new TextRun({ text, italics: true }))
                  return '|||ITALIC|||'
                })
                
                // Process underline text
                currentText = currentText.replace(/__(.*?)__/g, (match: string, text: string) => {
                  runs.push(new TextRun({ text, underline: {} }))
                  return '|||UNDERLINE|||'
                })
                
                // Add remaining text
                if (currentText && !currentText.includes('|||')) {
                  runs.unshift(new TextRun({ text: currentText }))
                }
                
                // If no special formatting, just add the line as text
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

    return new NextResponse(buffer, {
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
