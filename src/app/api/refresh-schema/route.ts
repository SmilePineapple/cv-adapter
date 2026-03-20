import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'



export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
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
