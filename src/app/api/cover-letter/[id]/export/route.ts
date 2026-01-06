import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: coverLetterId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'txt'

    // Fetch cover letter data
    const { data: coverLetterData, error: fetchError } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('id', coverLetterId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !coverLetterData) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
    }

    const fileName = `Cover_Letter_${coverLetterData.company_name.replace(/[^a-zA-Z0-9]/g, '_')}_${coverLetterData.job_title.replace(/[^a-zA-Z0-9]/g, '_')}`

    switch (format.toLowerCase()) {
      case 'docx':
        return await exportAsDocx(coverLetterData, fileName)
      case 'pdf':
        return await exportAsPdf(coverLetterData, fileName)
      case 'txt':
      default:
        return exportAsText(coverLetterData, fileName)
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

async function exportAsDocx(coverLetterData: {content: string, company_name?: string, position_title?: string, hiring_manager_name?: string}, fileName: string) {
  try {
    // Parse content to handle basic formatting
    const content = coverLetterData.content
    const paragraphs: Paragraph[] = []

    // Split content into paragraphs
    const contentParagraphs = content.split('\n\n').filter((p: string) => p.trim())

    contentParagraphs.forEach((paragraph: string, index: number) => {
      const trimmedParagraph = paragraph.trim()
      
      if (trimmedParagraph) {
        // Check if it's a greeting (first paragraph starting with "Dear")
        const isGreeting = index === 0 && trimmedParagraph.startsWith('Dear')
        
        // Check if it's a closing (last paragraph with common closings)
        const isClosing = index === contentParagraphs.length - 1 && 
          (trimmedParagraph.includes('Sincerely') || 
           trimmedParagraph.includes('Best regards') || 
           trimmedParagraph.includes('Kind regards') ||
           trimmedParagraph.includes('Yours truly'))

        // Process text for basic formatting
        const textRuns: TextRun[] = []
        const parts = trimmedParagraph.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g)
        
        parts.forEach(part => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            textRuns.push(new TextRun({
              text: part.slice(2, -2),
              bold: true
            }))
          } else if (part.startsWith('*') && part.endsWith('*')) {
            // Italic text
            textRuns.push(new TextRun({
              text: part.slice(1, -1),
              italics: true
            }))
          } else if (part.startsWith('__') && part.endsWith('__')) {
            // Underlined text
            textRuns.push(new TextRun({
              text: part.slice(2, -2),
              underline: {}
            }))
          } else if (part.trim()) {
            // Regular text
            textRuns.push(new TextRun({
              text: part
            }))
          }
        })

        paragraphs.push(new Paragraph({
          children: textRuns,
          alignment: isGreeting || isClosing ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
          spacing: {
            after: 200 // Add space after paragraph
          }
        }))
      }
    })

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with date and contact info
          new Paragraph({
            children: [
              new TextRun({
                text: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 }
          }),
          
          // Company information
          new Paragraph({
            children: [
              new TextRun({
                text: coverLetterData.company_name,
                bold: true
              })
            ],
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Re: ${coverLetterData.job_title}`,
                bold: true
              })
            ],
            spacing: { after: 400 }
          }),
          
          // Cover letter content
          ...paragraphs
        ]
      }]
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}.docx"`
      }
    })

  } catch (error) {
    console.error('DOCX export error:', error)
    throw error
  }
}

async function exportAsPdf(coverLetterData: {content: string, company_name?: string, position_title?: string, hiring_manager_name?: string}, fileName: string) {
  // For now, redirect to a PDF generation service or return text
  // This would require additional PDF generation library like puppeteer or jsPDF
  return exportAsText(coverLetterData, fileName)
}

function exportAsText(coverLetterData: {content: string, company_name?: string, position_title?: string, hiring_manager_name?: string}, fileName: string) {
  const content = `${coverLetterData.content}

---
Generated on: ${new Date().toLocaleDateString()}
Position: ${coverLetterData.job_title}
Company: ${coverLetterData.company_name}
${coverLetterData.hiring_manager_name ? `Hiring Manager: ${coverLetterData.hiring_manager_name}` : ''}
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${fileName}.txt"`
    }
  })
}
