import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
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

    // Get CV data
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .single()

    // Get existing sections
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('cv_sections')
      .select('*')
      .eq('cv_id', cvId)

    return NextResponse.json({
      success: true,
      cv_data: cvData,
      cv_error: cvError?.message,
      sections_data: sectionsData,
      sections_error: sectionsError?.message,
      sections_count: sectionsData?.length || 0,
      parsed_sections: cvData?.parsed_sections,
      debug_info: {
        cv_id: cvId,
        has_parsed_sections: !!cvData?.parsed_sections,
        parsed_sections_count: cvData?.parsed_sections?.sections?.length || 0
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
