import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

/**
 * Get social media platform configurations
 * GET /api/social-bot/config
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()
    const { data: configs, error } = await supabase
      .from('social_media_config')
      .select('*')
      .order('platform')

    if (error) {
      console.error('Error fetching configs:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      configs: configs || []
    })

  } catch (error) {
    console.error('Config API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
