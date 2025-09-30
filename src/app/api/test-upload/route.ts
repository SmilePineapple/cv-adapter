import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Test upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    })

  } catch (error) {
    console.error('Test upload error:', error)
    return NextResponse.json({ 
      error: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}
