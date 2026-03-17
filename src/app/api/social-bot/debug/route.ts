import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

/**
 * Debug endpoint to check Twitter credentials in database
 * GET /api/social-bot/debug
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()
    // Get Twitter config from database
    const { data: config, error } = await supabase
      .from('social_media_config')
      .select('*')
      .eq('platform', 'twitter')
      .single()

    if (error) {
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, { status: 500 })
    }

    if (!config) {
      return NextResponse.json({
        error: 'No Twitter config found',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, { status: 404 })
    }

    // Return credential info WITHOUT exposing actual values
    return NextResponse.json({
      success: true,
      platform: config.platform,
      enabled: config.enabled,
      credentials: {
        api_key: {
          exists: !!config.api_key,
          length: config.api_key?.length || 0,
          preview: config.api_key?.substring(0, 10) + '...',
          startsWithR: config.api_key?.startsWith('R') || false
        },
        api_secret: {
          exists: !!config.api_secret,
          length: config.api_secret?.length || 0,
          preview: config.api_secret?.substring(0, 10) + '...',
          startsWithX: config.api_secret?.startsWith('X') || false
        },
        access_token: {
          exists: !!config.access_token,
          length: config.access_token?.length || 0,
          preview: config.access_token?.substring(0, 25) + '...',
          startsWithExpected: config.access_token?.startsWith('1892580529') || false
        },
        access_token_secret: {
          exists: !!config.access_token_secret,
          length: config.access_token_secret?.length || 0,
          preview: config.access_token_secret?.substring(0, 10) + '...',
          startsWithO: config.access_token_secret?.startsWith('O') || false
        }
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 })
  }
}
