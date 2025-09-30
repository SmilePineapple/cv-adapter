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
        const subscriptionId = session.subscription as string

        console.log('[Webhook] Checkout completed:', { customerId, subscriptionId })

        if (!subscriptionId) {
          console.log('[Webhook] No subscription ID, skipping')
          break
        }

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        
        // Extract user_id from metadata (set during checkout creation)
        const userId = session.metadata?.user_id || session.client_reference_id

        if (!userId) {
          console.error('[Webhook] No user_id found in session metadata')
          break
        }

        console.log('[Webhook] Creating subscription for user:', userId)

        // Create or update subscription record
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_start: new Date((subscription.current_period_start as any) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end as any) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            updated_at: new Date().toISOString()
          })

        if (upsertError) {
          console.error('[Webhook] Subscription upsert error:', upsertError)
          throw upsertError
        }

        console.log('[Webhook] Subscription created successfully')
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('[Webhook] Subscription updated:', subscription.id)

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date((subscription.current_period_start as number) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end as number) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('[Webhook] Subscription update error:', updateError)
          throw updateError
        }

        console.log('[Webhook] Subscription updated successfully')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
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
