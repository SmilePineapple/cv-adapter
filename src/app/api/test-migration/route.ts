import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test if tables exist
    const { data: sectionsTest, error: sectionsError } = await supabase
      .from('cv_sections')
      .select('id')
      .limit(1)

    const { data: versionsTest, error: versionsError } = await supabase
      .from('cv_versions')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      tables: {
        cv_sections: sectionsError ? `Error: ${sectionsError.message}` : 'OK',
        cv_versions: versionsError ? `Error: ${versionsError.message}` : 'OK'
      },
      message: 'Migration test completed'
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
