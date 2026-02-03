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

        // Extract user_id from metadata
        const userId = session.metadata?.user_id || session.client_reference_id

        if (!userId) {
          console.error('[Webhook] No user_id found in session metadata')
          break
        }

        // Handle subscription mode
        if (session.mode === 'subscription') {
          const planType = session.metadata?.plan_type || 'monthly'

          if (!subscriptionId) {
            console.error('[Webhook] No subscription ID found in session')
            break
          }

          console.log('[Webhook] Processing subscription for user:', userId, 'Plan:', planType)

          // Get subscription details - expand to ensure we have all data
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['latest_invoice', 'customer']
          })
          
          console.log('[Webhook] Retrieved subscription:', {
            id: subscription.id,
            status: subscription.status,
            current_period_end: subscription.current_period_end,
            current_period_start: subscription.current_period_start,
            billing_cycle_anchor: subscription.billing_cycle_anchor
          })
          
          // Calculate current_period_end with fallback logic
          let currentPeriodEnd: Date
          
          if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
            // Use current_period_end if available
            currentPeriodEnd = new Date(subscription.current_period_end * 1000)
            console.log('[Webhook] Using subscription.current_period_end:', currentPeriodEnd.toISOString())
          } else if (subscription.current_period_start && typeof subscription.current_period_start === 'number') {
            // Fallback: Calculate from current_period_start + billing interval
            const startDate = new Date(subscription.current_period_start * 1000)
            const interval = subscription.items.data[0]?.price?.recurring?.interval || 'month'
            const intervalCount = subscription.items.data[0]?.price?.recurring?.interval_count || 1
            
            if (interval === 'month') {
              currentPeriodEnd = new Date(startDate)
              currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalCount)
            } else if (interval === 'year') {
              currentPeriodEnd = new Date(startDate)
              currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + intervalCount)
            } else {
              // Default to 1 month
              currentPeriodEnd = new Date(startDate)
              currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
            }
            
            console.log('[Webhook] Calculated period end from start date:', currentPeriodEnd.toISOString())
          } else {
            // Last resort: Use current date + billing interval
            currentPeriodEnd = new Date()
            const interval = subscription.items.data[0]?.price?.recurring?.interval || 'month'
            
            if (interval === 'month') {
              currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
            } else if (interval === 'year') {
              currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
            } else {
              currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
            }
            
            console.log('[Webhook] Using fallback period end (now + interval):', currentPeriodEnd.toISOString())
          }
          
          // Validate the date is valid
          if (isNaN(currentPeriodEnd.getTime())) {
            console.error('[Webhook] Invalid period end date calculated')
            throw new Error('Invalid subscription: could not determine valid period end date')
          }

          console.log('[Webhook] Final subscription period end:', currentPeriodEnd.toISOString())

          // Upgrade user to pro with subscription tier
          const subscriptionTier = planType === 'annual' ? 'pro_annual' : 'pro_monthly'
          
          const { error: upgradeError } = await supabase
            .from('usage_tracking')
            .update({
              plan_type: 'pro', // CRITICAL: Set plan_type to 'pro' for auto-upgrade
              subscription_tier: subscriptionTier,
              subscription_start_date: new Date().toISOString(),
              subscription_end_date: currentPeriodEnd.toISOString(),
              max_lifetime_generations: 999999, // Unlimited generations for Pro
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)

          if (upgradeError) {
            console.error('[Webhook] User upgrade error:', upgradeError)
            throw upgradeError
          }

          // CRITICAL: Create subscription record for dashboard MRR calculation
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: 'active',
              current_period_end: currentPeriodEnd.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })

          if (subscriptionError) {
            console.error('[Webhook] Subscription record creation error:', subscriptionError)
            // Don't fail the upgrade if subscription record fails, but log it
          } else {
            console.log('[Webhook] Subscription record created:', subscriptionId)
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
        } 
        // Handle one-time payment mode (lifetime access)
        else if (session.mode === 'payment') {
          console.log('[Webhook] Processing one-time payment for user:', userId)

          // Create purchase record for tracking
          const { error: purchaseError } = await supabase
            .from('purchases')
            .insert({
              user_id: userId,
              stripe_customer_id: customerId,
              payment_intent_id: session.payment_intent as string,
              amount_paid: session.amount_total || 0,
              currency: session.currency || 'gbp',
              status: 'completed',
              plan: 'pro_lifetime',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (purchaseError) {
            console.error('[Webhook] Purchase record creation error:', purchaseError)
            // Don't fail the upgrade if purchase record fails
          }

          // For one-time payments, give lifetime access
          // Use pro_annual for subscription_tier (constraint allows: free, pro_monthly, pro_annual)
          // Set plan_type to 'pro' (this is what the dashboard checks)
          const { error: upgradeError } = await supabase
            .from('usage_tracking')
            .update({
              plan_type: 'pro', // Dashboard checks this field
              subscription_tier: 'pro_annual', // Use annual tier for lifetime (closest match)
              subscription_start_date: new Date().toISOString(),
              subscription_end_date: null, // Lifetime = no end date
              max_lifetime_generations: 999999, // Unlimited generations
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)

          if (upgradeError) {
            console.error('[Webhook] User upgrade error:', upgradeError)
            throw upgradeError
          }

          // Track analytics event
          try {
            await trackPaymentCompleted(session.amount_total || 0, 'pro_lifetime')
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

          console.log('[Webhook] User upgraded to Pro Lifetime successfully')
        } else {
          console.log('[Webhook] Unknown checkout mode:', session.mode)
        }
        
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('[Webhook] Subscription created:', subscription.id)

        // Get customer to find user_id from metadata
        const customer = await stripe.customers.retrieve(customerId)
        
        if (customer.deleted) {
          console.error('[Webhook] Customer was deleted:', customerId)
          break
        }

        const userId = customer.metadata?.supabase_user_id

        if (!userId) {
          console.error('[Webhook] No user_id found in customer metadata')
          break
        }

        // Access subscription properties safely
        const subData = subscription as any

        // Validate current_period_end exists
        if (!subData.current_period_end || typeof subData.current_period_end !== 'number') {
          console.error('[Webhook] Subscription missing or invalid current_period_end:', subscription.id, subData.current_period_end)
          break
        }
        
        const currentPeriodEnd = new Date(subData.current_period_end * 1000)
        
        // Validate the date is valid
        if (isNaN(currentPeriodEnd.getTime())) {
          console.error('[Webhook] Invalid current_period_end timestamp:', subData.current_period_end)
          break
        }

        // Determine plan type from subscription interval
        const interval = subscription.items.data[0]?.price?.recurring?.interval
        const planType = interval === 'year' ? 'annual' : 'monthly'
        const subscriptionTier = planType === 'annual' ? 'pro_annual' : 'pro_monthly'

        console.log('[Webhook] Upgrading user to:', subscriptionTier)

        // Upgrade user to pro
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

        // Create subscription record for dashboard MRR calculation
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: 'active',
            current_period_end: currentPeriodEnd.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })

        if (subscriptionError) {
          console.error('[Webhook] Subscription record creation error:', subscriptionError)
        } else {
          console.log('[Webhook] Subscription record created:', subscription.id)
        }

        console.log('[Webhook] User upgraded via subscription.created:', userId)
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
        
        // Access subscription properties safely
        const subData = subscription as any
        
        // Validate current_period_end exists
        if (!subData.current_period_end || typeof subData.current_period_end !== 'number') {
          console.error('[Webhook] Subscription missing or invalid current_period_end:', subscription.id, subData.current_period_end)
          break
        }
        
        const currentPeriodEnd = new Date(subData.current_period_end * 1000)
        
        // Validate the date is valid
        if (isNaN(currentPeriodEnd.getTime())) {
          console.error('[Webhook] Invalid current_period_end timestamp:', subData.current_period_end)
          break
        }

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

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData = invoice as any
        const customerId = invoice.customer as string
        const subscriptionId = typeof invoiceData.subscription === 'string' ? invoiceData.subscription : invoiceData.subscription?.id

        console.log('[Webhook] Invoice payment failed:', {
          invoiceId: invoice.id,
          customerId,
          subscriptionId,
          attemptCount: invoice.attempt_count,
          amountDue: invoice.amount_due
        })

        // Get customer to find user_id
        const customer = await stripe.customers.retrieve(customerId)
        
        if (customer.deleted) {
          console.error('[Webhook] Customer was deleted:', customerId)
          break
        }

        let userId = customer.metadata?.supabase_user_id

        // Fallback: try to find user via subscriptions table
        if (!userId) {
          const { data: subRecords } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .limit(1)

          if (subRecords && subRecords.length > 0) {
            userId = subRecords[0].user_id
          }
        }

        // Fallback: try to find user via purchases table
        if (!userId) {
          const { data: purchases } = await supabase
            .from('purchases')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .limit(1)

          if (purchases && purchases.length > 0) {
            userId = purchases[0].user_id
          }
        }

        if (!userId) {
          console.error('[Webhook] No user found for failed payment customer:', customerId)
          break
        }

        // Get user email for logging
        const { data: userData } = await supabase.auth.admin.getUserById(userId)
        const userEmail = userData?.user?.email || 'unknown'

        console.log('[Webhook] Downgrading user due to payment failure:', {
          userId,
          email: userEmail,
          attemptCount: invoice.attempt_count
        })

        // Downgrade user to free tier immediately
        const { error: downgradeError } = await supabase
          .from('usage_tracking')
          .update({
            plan_type: 'free',
            subscription_tier: 'free',
            subscription_end_date: new Date().toISOString(),
            max_lifetime_generations: 3, // Reset to free tier limit
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (downgradeError) {
          console.error('[Webhook] Failed to downgrade user:', downgradeError)
          throw downgradeError
        }

        // Update subscription status in subscriptions table
        await supabase
          .from('subscriptions')
          .update({
            status: 'payment_failed',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        console.log('[Webhook] User downgraded to free due to payment failure:', userEmail)
        
        // TODO: Send email notification to user about failed payment and downgrade
        break
      }

      case 'invoice.payment_action_required': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log('[Webhook] Invoice payment action required:', {
          invoiceId: invoice.id,
          customerId,
          status: invoice.status
        })

        // Get customer to find user_id
        const customer = await stripe.customers.retrieve(customerId)
        
        if (customer.deleted) {
          console.error('[Webhook] Customer was deleted:', customerId)
          break
        }

        const userId = customer.metadata?.supabase_user_id

        if (userId) {
          const { data: userData } = await supabase.auth.admin.getUserById(userId)
          console.log('[Webhook] Payment action required for user:', userData?.user?.email)
          
          // TODO: Send email notification to user about payment action required
        }
        
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
