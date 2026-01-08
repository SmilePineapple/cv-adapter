import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Get social media platform configurations
 * GET /api/social-bot/config
 */
export async function GET() {
  try {
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
