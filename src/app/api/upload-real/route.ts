import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  console.log('Real upload API called - parsing actual CV file')
  
  try {
    // Use your actual user ID
    const userId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
    console.log('Using user ID:', userId)

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Parse file content using dynamic imports to avoid compilation issues
    console.log('Starting file parsing, type:', file.type)
    const buffer = await file.arrayBuffer()
    let extractedText = ''
    let parseSuccess = true

    try {
      if (file.type === 'application/pdf') {
        console.log('Parsing PDF file')
        const pdfParse = (await import('pdf-parse')).default
        const pdfData = await pdfParse(Buffer.from(buffer))
        extractedText = pdfData.text
      } else if (file.type.includes('word') || file.type.includes('document') || file.name.endsWith('.docx')) {
        console.log('Parsing Word document')
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
        extractedText = result.value
      } else {
        console.log('Unsupported file type, trying as text')
        const text = await file.text()
        extractedText = text
      }
      
      console.log('Extracted text length:', extractedText.length)
      console.log('First 500 chars of actual CV:', extractedText.substring(0, 500))
      
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

    // Parse CV sections using the actual extracted text
    console.log('Parsing CV sections from real content...')
    const parsedCV = parseRealCV(extractedText)
    console.log('Parsed sections from real CV:', parsedCV.sections.length)

    const fileMetadata = {
      name: file.name,
      ext: file.name.split('.').pop() || '',
      size: file.size,
      upload_date: new Date().toISOString()
    }

    console.log('Saving real CV content to database...')
    
    // Save to database with REAL content
    const { data: cvData, error: dbError } = await supabaseAdmin
      .from('cvs')
      .insert({
        user_id: userId,
        original_text: extractedText, // Real extracted text
        parsed_sections: parsedCV,    // Real parsed sections
        file_meta: fileMetadata
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save CV: ' + dbError.message 
      }, { status: 500 })
    }

    console.log('Real CV saved successfully:', cvData.id)

    return NextResponse.json({
      success: true,
      cv_id: cvData.id,
      sections: parsedCV.sections,
      parse_success: parseSuccess,
      file_meta: fileMetadata,
      extracted_length: extractedText.length
    })

  } catch (error) {
    console.error('Real upload error:', error)
    return NextResponse.json({ 
      error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// Enhanced CV parser that preserves ALL content from the real CV
function parseRealCV(text: string) {
  console.log('Parsing real CV text...')
  const sections: any[] = []
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let currentSection: any = null
  let sectionOrder = 0

  // Enhanced section headers to catch more variations
  const sectionHeaders = {
    name: /^(name|full name)$/i,
    contact: /^(contact|contact information|phone|email|address|personal details)$/i,
    summary: /^(summary|profile|objective|about|personal statement|professional summary)$/i,
    experience: /^(experience|work experience|employment|career|professional experience|employment history)$/i,
    education: /^(education|qualifications|academic|studies|educational background)$/i,
    skills: /^(skills|technical skills|competencies|abilities|core skills)$/i,
    certifications: /^(certifications|certificates|licenses|professional certifications|qualifications)$/i,
    training: /^(training|professional development|courses|workshops)$/i,
    projects: /^(projects|portfolio|work samples|key projects)$/i,
    publications: /^(publications|papers|articles|research)$/i,
    interests: /^(interests|hobbies|personal interests|activities|other interests)$/i,
    achievements: /^(achievements|accomplishments|awards|honors)$/i,
    languages: /^(languages|language skills)$/i,
    references: /^(references|referees)$/i
  }

  // Try to identify name from first few lines
  if (lines.length > 0) {
    const firstLine = lines[0]
    // Look for a name-like first line
    if (firstLine.length < 50 && !firstLine.includes('@') && !firstLine.includes('http') && !firstLine.includes('tel')) {
      sections.push({
        type: 'name',
        content: firstLine,
        order: sectionOrder++
      })
    }
  }

  // Parse remaining content, preserving everything
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
      if (line.includes('@') || line.includes('phone') || line.includes('tel') || line.includes('mobile')) {
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

  console.log('Real CV sections found:', sections.map(s => s.type))
  
  return {
    sections: sections.sort((a, b) => a.order - b.order),
    raw_text: text
  }
}
