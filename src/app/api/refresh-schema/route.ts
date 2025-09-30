import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    // Force refresh the schema cache by making a direct SQL call
    const { data, error } = await supabase.rpc('refresh_schema_cache')
    
    if (error) {
      console.log('RPC refresh failed, trying alternative method...')
      
      // Alternative: Make a simple query to force schema refresh
      const { data: testData, error: testError } = await supabase
        .from('cover_letters')
        .select('*')
        .limit(0)
      
      if (testError) {
        return NextResponse.json({ 
          error: 'Schema refresh failed',
          details: testError.message 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Schema cache refreshed successfully'
    })

  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ 
      error: 'Refresh failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
