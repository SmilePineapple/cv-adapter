import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) return null
  return new Stripe(apiKey, { apiVersion: '2025-08-27.basil' })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Delete all user data in order (respecting foreign key constraints)
    // 1. Delete generations
    const { error: genError } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', userId)

    if (genError) {
      console.error('Error deleting generations:', genError)
    }

    // 2. Delete cover letters
    const { error: clError } = await supabase
      .from('cover_letters')
      .delete()
      .eq('user_id', userId)

    if (clError) {
      console.error('Error deleting cover letters:', clError)
    }

    // 3. Delete interview preps
    const { error: ipError } = await supabase
      .from('interview_preps')
      .delete()
      .eq('user_id', userId)

    if (ipError) {
      console.error('Error deleting interview preps:', ipError)
    }

    // 4. Delete CVs
    const { error: cvError } = await supabase
      .from('cvs')
      .delete()
      .eq('user_id', userId)

    if (cvError) {
      console.error('Error deleting CVs:', cvError)
    }

    // 5. Delete usage tracking
    const { error: usageError } = await supabase
      .from('usage_tracking')
      .delete()
      .eq('user_id', userId)

    if (usageError) {
      console.error('Error deleting usage tracking:', usageError)
    }

    // 5b. Cancel any active Stripe subscription before deleting the user
    // This prevents orphaned subscriptions that continue charging after account deletion
    const stripe = getStripeClient()
    if (stripe) {
      try {
        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('stripe_subscription_id, stripe_customer_id, status')
          .eq('user_id', userId)
          .maybeSingle()

        if (userSub?.stripe_subscription_id) {
          try {
            const sub = await stripe.subscriptions.retrieve(userSub.stripe_subscription_id)
            if (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') {
              console.log('[DeleteAccount] Cancelling Stripe subscription before account deletion:', userSub.stripe_subscription_id)
              await stripe.subscriptions.cancel(userSub.stripe_subscription_id)
              console.log('[DeleteAccount] Stripe subscription cancelled')
            }
          } catch (stripeErr: any) {
            console.log('[DeleteAccount] Stripe sub cleanup skipped:', stripeErr.message)
          }
        }
      } catch (subLookupErr) {
        console.error('[DeleteAccount] Error checking subscriptions:', subLookupErr)
      }
    }

    // 6. Delete purchases
    const { error: purchaseError } = await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId)

    if (purchaseError) {
      console.error('Error deleting purchases:', purchaseError)
    }

    // 7. Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 8. Delete auth user (this will cascade delete everything else)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json({ 
        error: 'Failed to delete account',
        message: 'Please contact support at jakedalerourke@gmail.com'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete account error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to delete account',
      message: 'Please contact support at jakedalerourke@gmail.com'
    }, { status: 500 })
  }
}
