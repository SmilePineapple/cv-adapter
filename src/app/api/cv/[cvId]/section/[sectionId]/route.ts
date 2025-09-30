import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string; sectionId: string }> }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { cvId, sectionId } = await params

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        auth_error: authError?.message 
      }, { status: 401 })
    }

    // Verify CV ownership and section exists
    const { data: sectionData, error: sectionError } = await supabase
      .from('cv_sections')
      .select(`
        id,
        cv_id,
        cvs!inner(user_id)
      `)
      .eq('id', sectionId)
      .eq('cv_id', cvId)
      .single()

    if (sectionError || !sectionData) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Check ownership through the CV
    if ((sectionData as any).cvs.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the section
    const { error: deleteError } = await supabase
      .from('cv_sections')
      .delete()
      .eq('id', sectionId)

    if (deleteError) {
      console.error('Section delete error:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete section',
        details: deleteError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Section deleted successfully'
    })

  } catch (error) {
    console.error('Delete section error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete section',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
