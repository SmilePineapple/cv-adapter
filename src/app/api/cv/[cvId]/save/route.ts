import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface SaveRequest {
  sections: Array<{
    id: string
    type: string
    title: string
    content: any
    order: number
    metadata?: any
  }>
  theme_settings: any
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
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

    const { cvId } = await params

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SaveRequest = await request.json()
    const { sections, theme_settings } = body

    // Verify CV ownership
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('id, user_id')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Update sections
    for (const section of sections) {
      const { error: updateError } = await supabase
        .from('cv_sections')
        .update({
          section_type: section.type,
          title: section.title,
          content: section.content,
          order_index: section.order,
          metadata: section.metadata || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)
        .eq('cv_id', cvId)

      if (updateError) {
        console.error('Section update error:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update section',
          section_id: section.id,
          details: updateError.message 
        }, { status: 500 })
      }
    }

    // Get latest version number
    const { data: latestVersion } = await supabase
      .from('cv_versions')
      .select('version_number')
      .eq('cv_id', cvId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1

    // Create new version
    const { error: versionError } = await supabase
      .from('cv_versions')
      .insert({
        cv_id: cvId,
        user_id: user.id,
        version_number: nextVersionNumber,
        title: `Version ${nextVersionNumber}`,
        template_id: 'modern',
        theme_settings: theme_settings,
        sections_snapshot: sections,
        metadata: {
          created_from: 'editor_save',
          tokens_used: 0,
          model: 'manual_edit',
          save_timestamp: new Date().toISOString()
        }
      })

    if (versionError) {
      console.error('Version creation error:', versionError)
      // Don't fail the save if version creation fails
    }

    // Update CV's last_accessed_at
    await supabase
      .from('cvs')
      .update({ 
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', cvId)

    return NextResponse.json({ 
      success: true,
      message: 'CV saved successfully',
      version_number: nextVersionNumber,
      sections_updated: sections.length
    })

  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ 
      error: 'Save failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
