import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe is not configured. Please contact support to cancel your subscription.',
        message: 'For now, subscriptions are managed manually. Please contact jakedalerourke@gmail.com to cancel.'
      }, { status: 503 })
    }

    // Get the user's subscription info from usage_tracking
    const { data: usageData, error: usageError } = await supabase
      .from('usage_tracking')
      .select('subscription_tier, stripe_subscription_id')
      .eq('user_id', userId)
      .single()

    if (usageError || !usageData) {
      return NextResponse.json({ 
        error: 'No user data found',
        message: 'Please contact support if you believe this is an error.'
      }, { status: 404 })
    }

    // Check if user is actually on a paid subscription
    const isPro = usageData.subscription_tier === 'pro_monthly' || usageData.subscription_tier === 'pro_annual'
    
    if (!isPro) {
      return NextResponse.json({ 
        error: 'No active subscription',
        message: 'You are currently on the free plan.'
      }, { status: 400 })
    }

    // Handle manually upgraded users (no Stripe subscription)
    if (!usageData.stripe_subscription_id) {
      // Downgrade to free tier immediately for manually upgraded users
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({
          subscription_tier: 'free',
          plan_type: 'free',
          max_lifetime_generations: 1,
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error downgrading user:', updateError)
        return NextResponse.json({ 
          error: 'Failed to cancel subscription',
          message: 'Please contact support at jakedalerourke@gmail.com'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled successfully. You have been downgraded to the free tier.',
        subscription: {
          status: 'cancelled',
          tier: 'free'
        }
      })
    }

    // Cancel the subscription in Stripe (at period end)
    const canceledSubscription = await stripe.subscriptions.update(
      usageData.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    )

    // Update the subscription status in usage_tracking
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({
        subscription_status: 'canceling',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating subscription status:', updateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        status: 'canceling',
        cancel_at_period_end: true
      }
    })

  } catch (error: any) {
    console.error('Cancel subscription error:', error)
    
    // Handle Stripe-specific errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: 'Invalid subscription',
        message: 'The subscription could not be found or is already cancelled.'
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to cancel subscription',
      message: 'Please contact support at jakedalerourke@gmail.com'
    }, { status: 500 })
  }
}
