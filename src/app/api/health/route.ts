import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * Lightweight health check endpoint for cron-job.org
 * Pings the database once to keep Supabase project awake
 * Run daily via cron-job.org to prevent 7-day auto-pause on free tier
 */
export async function GET() {
  try {
    const supabase = createSupabaseRouteClient()

    // Lightweight query - just checks database connection
    const { error } = await supabase
      .from('generations')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Health check failed:', error)
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
