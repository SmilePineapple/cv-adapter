import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Simple upload API called')
  
  try {
    console.log('Getting form data...')
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

    // Return the expected structure for the upload page
    return NextResponse.json({
      success: true,
      cv_id: 'test-cv-id',
      sections: [
        { type: 'name', content: 'Test Name', order: 0 },
        { type: 'contact', content: 'Test Contact Info', order: 1 },
        { type: 'summary', content: 'Test Summary', order: 2 }
      ],
      parse_success: true,
      file_meta: {
        name: file.name,
        ext: file.name.split('.').pop() || '',
        size: file.size,
        upload_date: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Simple upload error:', error)
    return NextResponse.json({ 
      error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}
