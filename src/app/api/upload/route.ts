import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { detectLanguage } from '@/lib/language-detection'
import { trackCVUpload } from '@/lib/analytics'

// Force dynamic rendering - don't try to build this at build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Use service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Define types inline to avoid import issues
interface CVSection {
  type: string
  content: string
  order: number
}

interface ParsedCV {
  sections: CVSection[]
  raw_text: string
}

interface FileMetadata {
  name: string
  ext: string
  size: number
  upload_date: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  console.log('[UPLOAD API] Called at:', new Date().toISOString())
  console.log('[UPLOAD API] Request method:', request.method)
  console.log('[UPLOAD API] Request URL:', request.url)
  
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    console.log('Authenticated user ID:', userId)

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a PDF or Word document.' 
      }, { status: 400 })
    }

    // Parse file content
    console.log('Starting file parsing, type:', file.type)
    const buffer = await file.arrayBuffer()
    let extractedText = ''
    let parseSuccess = true

    try {
      if (file.type === 'application/pdf') {
        console.log('Parsing PDF file')
        const pdfData = await pdfParse(Buffer.from(buffer))
        extractedText = pdfData.text
      } else if (file.type.includes('word') || file.type.includes('document')) {
        console.log('Parsing Word document')
        const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
        extractedText = result.value
      }
      console.log('Extracted text length:', extractedText.length)
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      parseSuccess = false
      extractedText = 'Failed to parse file content. Please try uploading a different format.'
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ 
        error: 'Could not extract text from the file. Please ensure the file contains readable text.' 
      }, { status: 400 })
    }

    // Detect language from extracted text
    console.log('Detecting language...')
    const languageResult = detectLanguage(extractedText)
    console.log('Language detected:', languageResult.code, `(${languageResult.name})`, `confidence: ${languageResult.confidence}`)

    // Parse CV sections using simple text analysis
    console.log('Parsing CV sections...')
    const parsedSections = parseCV(extractedText)
    console.log('Parsed sections:', parsedSections.sections.length)

    // Create file metadata
    const fileMetadata: FileMetadata = {
      name: file.name,
      ext: file.name.split('.').pop() || '',
      size: file.size,
      upload_date: new Date().toISOString()
    }

    // Save to database
    console.log('Saving to database...')
    const { data: cvData, error: dbError } = await supabaseAdmin
      .from('cvs')
      .insert({
        user_id: userId,
        original_text: extractedText,
        parsed_sections: parsedSections,
        file_meta: fileMetadata,
        detected_language: languageResult.code
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save CV data: ' + dbError.message 
      }, { status: 500 })
    }
    console.log('CV saved successfully:', cvData.id)

    // Track analytics event
    try {
      await trackCVUpload(languageResult.code, file.name)
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError)
      // Don't fail the upload if analytics fails
    }

    // Create CV sections for the editor
    console.log('Creating CV sections for editor...')
    const sectionsToInsert = parsedSections.sections.map((section, index) => ({
      cv_id: cvData.id,
      user_id: userId,
      section_type: mapSectionType(section.type),
      raw_content: section.content,
      content: section.content,
      order_index: index,
      layout: 'left' as const,
      font_size: 14,
      text_color: '#000000'
    }))

    if (sectionsToInsert.length > 0) {
      const { error: sectionsError } = await supabaseAdmin
        .from('cv_sections')
        .insert(sectionsToInsert)

      if (sectionsError) {
        console.error('Error creating CV sections:', sectionsError)
        // Don't fail the upload if sections creation fails
      } else {
        console.log('CV sections created successfully')
      }
    }

    return NextResponse.json({
      success: true,
      cv_id: cvData.id,
      sections: parsedSections.sections,
      parse_success: parseSuccess,
      file_meta: fileMetadata,
      detected_language: {
        code: languageResult.code,
        name: languageResult.name,
        confidence: languageResult.confidence
      }
    })

  } catch (error) {
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error: error
    })
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// Map parsed section types to valid database enum values
function mapSectionType(type: string): string {
  const typeMap: Record<string, string> = {
    'name': 'header',
    'contact': 'contact',
    'summary': 'summary',
    'experience': 'experience',
    'education': 'education',
    'skills': 'skills',
    'certifications': 'certifications',
    'projects': 'projects',
    'publications': 'publications',
    'hobbies': 'interests',
    'interests': 'interests'
  }
  
  return typeMap[type.toLowerCase()] || 'custom'
}

// Simple CV section parser
function parseCV(text: string): ParsedCV {
  const sections: CVSection[] = []
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let currentSection: CVSection | null = null
  let sectionOrder = 0

  // Common section headers to look for
  const sectionHeaders = {
    name: /^(name|full name)$/i,
    contact: /^(contact|contact information|phone|email|address)$/i,
    summary: /^(summary|profile|objective|about|personal statement)$/i,
    experience: /^(experience|work experience|employment|career|professional experience)$/i,
    education: /^(education|qualifications|academic|studies)$/i,
    skills: /^(skills|technical skills|competencies|abilities)$/i,
    certifications: /^(certifications|certificates|licenses)$/i,
    projects: /^(projects|portfolio|work samples)$/i,
    publications: /^(publications|papers|articles)$/i,
    hobbies: /^(hobbies|interests|personal interests|activities)$/i
  }

  // Try to identify name from first few lines
  if (lines.length > 0) {
    const firstLine = lines[0]
    if (firstLine.length < 50 && !firstLine.includes('@') && !firstLine.includes('http')) {
      sections.push({
        type: 'name',
        content: firstLine,
        order: sectionOrder++
      })
    }
  }

  // Parse remaining content
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if this line is a section header
    let foundSection: keyof typeof sectionHeaders | null = null
    for (const [sectionType, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line)) {
        foundSection = sectionType as keyof typeof sectionHeaders
        break
      }
    }

    if (foundSection) {
      // Save previous section if exists
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection)
      }
      
      // Start new section
      currentSection = {
        type: foundSection,
        content: '',
        order: sectionOrder++
      }
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += (currentSection.content ? '\n' : '') + line
    } else {
      // No current section, try to categorize based on content
      if (line.includes('@') || line.includes('phone') || line.includes('tel')) {
        const contactSection = sections.find(s => s.type === 'contact')
        if (contactSection) {
          contactSection.content += '\n' + line
        } else {
          sections.push({
            type: 'contact',
            content: line,
            order: sectionOrder++
          })
        }
      } else {
        // Add to summary if no other section identified
        const summarySection = sections.find(s => s.type === 'summary')
        if (summarySection) {
          summarySection.content += '\n' + line
        } else {
          sections.push({
            type: 'summary',
            content: line,
            order: sectionOrder++
          })
        }
      }
    }
  }

  // Save final section
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection)
  }

  return {
    sections: sections.sort((a, b) => a.order - b.order),
    raw_text: text
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
