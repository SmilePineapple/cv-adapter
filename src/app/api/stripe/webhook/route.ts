import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { trackPaymentCompleted } from '@/lib/analytics'
import { sendUpgradeConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('[Webhook] Checkout completed:', { customerId, subscriptionId, mode: session.mode })

        // Only process subscription mode
        if (session.mode !== 'subscription') {
          console.log('[Webhook] Not a subscription, skipping')
          break
        }
        
        // Extract user_id from metadata
        const userId = session.metadata?.user_id || session.client_reference_id
        const planType = session.metadata?.plan_type || 'monthly'

        if (!userId) {
          console.error('[Webhook] No user_id found in session metadata')
          break
        }

        console.log('[Webhook] Processing subscription for user:', userId, 'Plan:', planType)

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000)

        // Upgrade user to pro with subscription tier
        const subscriptionTier = planType === 'annual' ? 'pro_annual' : 'pro_monthly'
        
        const { error: upgradeError } = await supabase
          .from('usage_tracking')
          .update({
            subscription_tier: subscriptionTier,
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (upgradeError) {
          console.error('[Webhook] User upgrade error:', upgradeError)
          throw upgradeError
        }

        // Track analytics event
        try {
          await trackPaymentCompleted(session.amount_total || 0, subscriptionTier)
        } catch (analyticsError) {
          console.error('[Webhook] Analytics tracking failed:', analyticsError)
        }

        // Send upgrade confirmation email
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(userId)
          if (userData?.user?.email) {
            const userName = userData.user.user_metadata?.full_name || userData.user.email.split('@')[0] || 'there'
            await sendUpgradeConfirmationEmail(userData.user.email, userName)
            console.log('[Webhook] Upgrade confirmation email sent to:', userData.user.email)
          }
        } catch (emailError) {
          console.error('[Webhook] Failed to send upgrade confirmation email:', emailError)
          // Don't fail the webhook if email fails
        }

        console.log('[Webhook] User upgraded to Pro successfully:', subscriptionTier)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('[Webhook] Subscription updated:', subscription.id)

        // Find user by customer ID
        const { data: purchases } = await supabase
          .from('purchases')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .limit(1)

        if (!purchases || purchases.length === 0) {
          console.error('[Webhook] No user found for customer:', customerId)
          break
        }

        const userId = purchases[0].user_id
        const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000)

        // Update subscription end date
        await supabase
          .from('usage_tracking')
          .update({
            subscription_end_date: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        console.log('[Webhook] Subscription updated for user:', userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('[Webhook] Subscription cancelled:', subscription.id)

        // Find user by customer ID
        const { data: purchases } = await supabase
          .from('purchases')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .limit(1)

        if (!purchases || purchases.length === 0) {
          console.error('[Webhook] No user found for customer:', customerId)
          break
        }

        const userId = purchases[0].user_id

        // Downgrade user to free tier
        await supabase
          .from('usage_tracking')
          .update({
            subscription_tier: 'free',
            subscription_end_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        console.log('[Webhook] User downgraded to free:', userId)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('[Webhook] Payment succeeded:', paymentIntent.id)

        // Update purchase status if needed
        const { error: updateError } = await supabase
          .from('purchases')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('[Webhook] Purchase update error:', updateError)
        }

        console.log('[Webhook] Payment recorded successfully')
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('[Webhook] Payment failed:', paymentIntent.id)

        await supabase
          .from('purchases')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
