import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ADMIN ONLY - Restrict to specific admin emails
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access only',
        message: 'This endpoint is restricted to administrators only.'
      }, { status: 403 })
    }

    // Create or update Pro subscription for current user
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        status: 'active',
        price_id: 'price_pro',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (subError) {
      console.error('Subscription setup error:', subError)
      return NextResponse.json({ 
        error: 'Failed to setup subscription',
        details: subError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Pro subscription set up successfully',
      subscription: subscription
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
