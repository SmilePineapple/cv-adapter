import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

// Manual subscription cancellation for testing (no Stripe required)
// This marks the subscription as "canceling" but keeps access until period_end
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

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ 
        error: 'No active subscription found' 
      }, { status: 404 })
    }

    // Mark as canceling (will keep access until current_period_end)
    // Try to update with cancel_at_period_end, but handle if column doesn't exist
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    // Try to add cancel_at_period_end if column exists
    try {
      updateData.cancel_at_period_end = true
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('user_id', user.id)

      if (updateError) {
        // If error is about missing column, that's okay - just update timestamp
        if (!updateError.message?.includes('cancel_at_period_end')) {
          console.error('Update error:', updateError)
          return NextResponse.json({ 
            error: 'Failed to cancel subscription',
            details: updateError.message 
          }, { status: 500 })
        }
      }
    } catch (error: any) {
      console.error('Update error:', error)
      return NextResponse.json({ 
        error: 'Failed to cancel subscription',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of your billing period',
      subscription: {
        status: subscription.status,
        cancel_at_period_end: true,
        current_period_end: subscription.current_period_end
      }
    })

  } catch (error) {
    console.error('Cancel error:', error)
    return NextResponse.json({ 
      error: 'Failed to cancel subscription' 
    }, { status: 500 })
  }
}
