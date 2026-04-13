import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = [
  'jakedalerourke@gmail.com',
  'smilepineapple118@gmail.com',
  'jake.rourke@btinternet.com',
]

/**
 * Debug endpoint — dumps raw Stripe active subscriptions and DB matching results.
 * Only accessible by admin users. Remove after diagnosis.
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Auth check
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'No auth' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return NextResponse.json({ error: 'No STRIPE_SECRET_KEY' }, { status: 500 })

    const stripe: any = require('stripe')(stripeKey)

    // 1. Fetch Stripe active subscriptions
    const stripeActiveSubs: any[] = []
    let startingAfter: string | undefined = undefined
    while (true) {
      const page: any = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
        expand: ['data.customer'],
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      })
      stripeActiveSubs.push(...page.data)
      if (!page.has_more) break
      startingAfter = page.data[page.data.length - 1]?.id
      if (!startingAfter) break
    }

    // 2. Fetch DB tables
    const { data: subscriptions } = await supabase.from('subscriptions').select('*')
    const { data: usageTracking } = await supabase.from('usage_tracking').select('*')
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })

    const adminUserIds = new Set(
      authUsers.filter(u => ADMIN_EMAILS.includes(u.email || '')).map(u => u.id)
    )

    // 3. Attempt matching for each Stripe sub
    const matchResults = stripeActiveSubs.map(stripeSub => {
      const stripeCustomerId = typeof stripeSub.customer === 'object'
        ? stripeSub.customer?.id
        : stripeSub.customer

      const custEmail = typeof stripeSub.customer === 'object'
        ? stripeSub.customer?.email || ''
        : ''

      // Strategy 1
      const dbSubS1 = (subscriptions || []).find(
        s => s.stripe_subscription_id === stripeSub.id ||
             (s.stripe_customer_id && s.stripe_customer_id === stripeCustomerId)
      )

      // Strategy 2
      const usageMatch = (usageTracking || []).find(
        u => (u as any).stripe_customer_id === stripeCustomerId
      )

      // Strategy 3
      const emailMatch = custEmail
        ? authUsers.find(u => u.email?.toLowerCase() === custEmail.toLowerCase())
        : null

      const resolvedUserId = dbSubS1?.user_id || usageMatch?.user_id || emailMatch?.id || null
      const isAdmin = resolvedUserId ? adminUserIds.has(resolvedUserId) : false

      const price = stripeSub.items?.data?.[0]?.price
      const amount = price?.unit_amount || 0
      const interval = price?.recurring?.interval || 'unknown'
      const periodEnd = stripeSub.current_period_end
      const dueDate = periodEnd ? new Date(periodEnd * 1000).toISOString() : null
      const daysUntil = periodEnd
        ? Math.ceil((new Date(periodEnd * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

      return {
        stripe_sub_id: stripeSub.id,
        stripe_customer_id: stripeCustomerId,
        stripe_customer_email: custEmail,
        stripe_status: stripeSub.status,
        interval,
        amount_pence: amount,
        // Raw fields from Stripe for diagnosis
        raw_current_period_end: stripeSub.current_period_end,
        raw_item_current_period_end: stripeSub.items?.data?.[0]?.current_period_end,
        raw_billing_cycle_anchor: stripeSub.billing_cycle_anchor,
        raw_item0_keys: stripeSub.items?.data?.[0] ? Object.keys(stripeSub.items.data[0]) : [],
        current_period_end: dueDate,
        days_until_renewal: daysUntil,
        matched_by: dbSubS1 ? 'strategy1_subscriptions_table'
          : usageMatch ? 'strategy2_usage_tracking'
          : emailMatch ? 'strategy3_email'
          : 'UNMATCHED',
        resolved_user_id: resolvedUserId,
        is_admin: isAdmin,
        will_appear_in_upcoming: resolvedUserId && !isAdmin && daysUntil !== null && daysUntil >= 0,
      }
    })

    return NextResponse.json({
      stripe_active_sub_count: stripeActiveSubs.length,
      db_subscriptions_count: (subscriptions || []).length,
      db_subscriptions_with_stripe_ids: (subscriptions || []).filter(
        s => s.stripe_subscription_id && s.stripe_customer_id
      ).length,
      usage_tracking_rows: (usageTracking || []).length,
      auth_user_count: authUsers.length,
      admin_user_count: adminUserIds.size,
      match_results: matchResults,
      db_subscriptions_raw: (subscriptions || []).map(s => ({
        user_id: s.user_id,
        stripe_customer_id: s.stripe_customer_id,
        stripe_subscription_id: s.stripe_subscription_id,
        status: s.status,
        current_period_end: s.current_period_end,
      })),
    })
  } catch (error: unknown) {
    console.error('[DebugStripe]', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal error' },
      { status: 500 }
    )
  }
}
