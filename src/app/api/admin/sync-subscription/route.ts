import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

/**
 * Admin API: Sync subscription status between Stripe and database
 * Use this when a user's payment went through but their account wasn't upgraded
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil'
    })

    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email, userId } = await request.json()

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or User ID required' },
        { status: 400 }
      )
    }

    let targetUserId = userId
    let targetEmail = email
    let stripeCustomerId: string | null = null
    let stripeSubscriptionId: string | null = null

    // If email provided, get user ID
    if (email && !userId) {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers()

      if (userError) {
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        )
      }

      const foundUser = users.users.find(u => u.email === email)

      if (!foundUser) {
        return NextResponse.json(
          { error: `User not found: ${email}` },
          { status: 404 }
        )
      }

      targetUserId = foundUser.id
      targetEmail = foundUser.email || email
    }

    // If userId provided, get email
    if (userId && !email) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(targetUserId)

      if (userError || !userData) {
        return NextResponse.json(
          { error: `User not found: ${userId}` },
          { status: 404 }
        )
      }

      targetEmail = userData.user.email || ''
    }

    // Check subscriptions table for Stripe customer ID
    const { data: subscriptionRecord } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', targetUserId)
      .maybeSingle()

    if (subscriptionRecord?.stripe_customer_id) {
      stripeCustomerId = subscriptionRecord.stripe_customer_id
      stripeSubscriptionId = subscriptionRecord.stripe_subscription_id
    }

    // Check purchases table for customer ID
    if (!stripeCustomerId) {
      const { data: purchaseRecord } = await supabase
        .from('purchases')
        .select('stripe_customer_id')
        .eq('user_id', targetUserId)
        .maybeSingle()

      if (purchaseRecord?.stripe_customer_id) {
        stripeCustomerId = purchaseRecord.stripe_customer_id
      }
    }

    // If no customer ID found, try to find in Stripe by email
    let stripeSubscription: Stripe.Subscription | null = null
    let stripeCustomer: Stripe.Customer | null = null

    if (stripeCustomerId) {
      // Fetch customer from Stripe
      try {
        const customer = await stripe.customers.retrieve(stripeCustomerId)
        if (!customer.deleted) {
          stripeCustomer = customer
        }
      } catch {
        console.log(`[Sync] Customer ${stripeCustomerId} not found in Stripe`)
      }
    } else if (targetEmail) {
      // Search for customer by email
      try {
        const customers = await stripe.customers.list({
          email: targetEmail,
          limit: 1
        })

        if (customers.data.length > 0) {
          stripeCustomer = customers.data[0]
          stripeCustomerId = stripeCustomer.id
        }
      } catch (error) {
        console.error('[Sync] Error searching for customer:', error)
      }
    }

    // If we have a customer, check their subscriptions
    if (stripeCustomerId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'active',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0]
          stripeSubscriptionId = stripeSubscription.id
        }
      } catch (error) {
        console.error('[Sync] Error fetching subscriptions:', error)
      }
    }

    // Determine current database status
    const { data: usageTracking } = await supabase
      .from('usage_tracking')
      .select('plan_type, subscription_tier')
      .eq('user_id', targetUserId)
      .maybeSingle()

    const currentPlanType = usageTracking?.plan_type || 'free'
    const currentSubscriptionTier = usageTracking?.subscription_tier || 'free'

    // Determine action based on Stripe status
    let action: string
    let updates: any = {}

    if (stripeSubscription && stripeSubscription.status === 'active') {
      // User has active subscription in Stripe but may not be Pro in DB
      const interval = stripeSubscription.items.data[0]?.price?.recurring?.interval
      const isAnnual = interval === 'year'
      const subscriptionTier = isAnnual ? 'pro_annual' : 'pro_monthly'

      // Calculate period end
      let currentPeriodEnd: Date
      if (stripeSubscription.current_period_end) {
        currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000)
      } else {
        currentPeriodEnd = new Date()
        if (isAnnual) {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
        } else {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
        }
      }

      if (currentPlanType !== 'pro') {
        // Need to upgrade
        action = 'upgrade_to_pro'
        updates = {
          plan_type: 'pro',
          subscription_tier: subscriptionTier,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: currentPeriodEnd.toISOString(),
          max_lifetime_generations: 999999,
          updated_at: new Date().toISOString()
        }
      } else {
        // Already Pro, just sync dates
        action = 'sync_dates'
        updates = {
          subscription_end_date: currentPeriodEnd.toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      // Update usage_tracking
      const { error: usageError } = await supabase
        .from('usage_tracking')
        .upsert(
          {
            user_id: targetUserId,
            ...updates,
            created_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id',
            ignoreDuplicates: false
          }
        )

      if (usageError) {
        return NextResponse.json(
          { error: `Failed to update usage_tracking: ${usageError.message}` },
          { status: 500 }
        )
      }

      // Update subscriptions table
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: targetUserId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            status: 'active',
            current_period_end: currentPeriodEnd.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id',
            ignoreDuplicates: false
          }
        )

      if (subError) {
        console.error('[Sync] Error updating subscriptions table:', subError)
      }
    } else {
      // No active subscription in Stripe
      if (currentPlanType === 'pro') {
        // User is marked as Pro but has no active subscription - downgrade
        action = 'downgrade_to_free'
        updates = {
          plan_type: 'free',
          subscription_tier: 'free',
          subscription_end_date: new Date().toISOString(),
          max_lifetime_generations: 3,
          updated_at: new Date().toISOString()
        }

        const { error: usageError } = await supabase
          .from('usage_tracking')
          .update(updates)
          .eq('user_id', targetUserId)

        if (usageError) {
          return NextResponse.json(
            { error: `Failed to downgrade user: ${usageError.message}` },
            { status: 500 }
          )
        }

        // Update subscriptions table
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', targetUserId)
      } else {
        action = 'no_action_needed'
        updates = { message: 'User is already on free tier with no active subscription' }
      }
    }

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      email: targetEmail,
      action,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus: stripeSubscription?.status || null,
      previousPlanType: currentPlanType,
      updates,
      message: `Subscription sync completed: ${action}`
    })
  } catch (error) {
    console.error('[Sync] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
