import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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
        const paymentIntentId = session.payment_intent as string

        console.log('[Webhook] Checkout completed:', { customerId, paymentIntentId, mode: session.mode })

        // Only process payment mode (one-time payments), not subscription mode
        if (session.mode !== 'payment') {
          console.log('[Webhook] Not a one-time payment, skipping')
          break
        }
        
        // Extract user_id from metadata (set during checkout creation)
        const userId = session.metadata?.user_id || session.client_reference_id

        if (!userId) {
          console.error('[Webhook] No user_id found in session metadata')
          break
        }

        console.log('[Webhook] Processing one-time payment for user:', userId)

        // Create purchase record
        const { error: purchaseError } = await supabase
          .from('purchases')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            payment_intent_id: paymentIntentId,
            status: 'completed',
            amount_paid: session.amount_total, // in cents/pence
            currency: session.currency || 'gbp',
            purchased_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (purchaseError) {
          console.error('[Webhook] Purchase record error:', purchaseError)
          throw purchaseError
        }

        // Upgrade user to pro (100 lifetime generations)
        const { error: upgradeError } = await supabase
          .from('usage_tracking')
          .update({
            plan_type: 'pro',
            max_lifetime_generations: 100,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (upgradeError) {
          console.error('[Webhook] User upgrade error:', upgradeError)
          throw upgradeError
        }

        console.log('[Webhook] User upgraded to Pro successfully')
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
