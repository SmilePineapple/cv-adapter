import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = [
  'jakedalerourke@gmail.com',
  'smilepineapple118@gmail.com',
  'jake.rourke@btinternet.com'
]

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'No authorization' }, { status: 401 })
    }

    // Fetch all users with pagination (listUsers has a default limit of 50)
    let allUsers: Array<{id: string, email?: string, created_at: string, email_confirmed_at?: string, last_sign_in_at?: string}> = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000 // Max allowed by Supabase
      })
      
      if (error) throw error
      
      allUsers = allUsers.concat(data.users)
      hasMore = data.users.length === 1000 // If we got 1000, there might be more
      page++
    }

    // Fetch all analytics data
    const [
      profilesResult,
      purchasesResult,
      subscriptionsResult,
      usageResult,
      generationsResult,
      cvsResult,
      coverLettersResult,
      interviewPrepsResult
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('purchases').select('*'),
      supabase.from('subscriptions').select('*'),
      supabase.from('usage_tracking').select('*'),
      supabase.from('generations').select('id, user_id, created_at, job_title'),
      supabase.from('cvs').select('id, user_id, created_at'),
      supabase.from('cover_letters').select('id, user_id, created_at'),
      supabase.from('interview_preps').select('id, user_id, created_at')
    ])

    const users = allUsers
    const profiles = profilesResult.data || []
    const purchases = purchasesResult.data || []
    const subscriptions = subscriptionsResult.data || []
    const usageTracking = usageResult.data || []
    const generations = generationsResult.data || []
    const cvs = cvsResult.data || []
    const coverLetters = coverLettersResult.data || []
    const interviewPreps = interviewPrepsResult.data || []

    // Calculate statistics
    const now = new Date()
    const totalUsers = users.length
    
    // Get active Stripe subscriptions FIRST (needed for revenue calculations)
    const activeSubscriptionUserIds = new Set(
      subscriptions
        .filter(s => s.status === 'active' && s.stripe_subscription_id)
        .map(s => s.user_id)
    )
    
    // Get users who made completed purchases (one-time payments)
    const completedPurchaseUserIds = new Set(
      purchases
        .filter(p => p.status === 'completed' && p.amount_paid && p.amount_paid > 0)
        .map(p => p.user_id)
    )
    
    // Get admin user IDs to exclude from Pro counts
    const adminUserIds = new Set(
      users
        .filter(u => ADMIN_EMAILS.includes(u.email || ''))
        .map(u => u.id)
    )
    
    // Count ALL Pro users (excluding admins)
    const totalProUsersCount = usageTracking.filter(u => {
      const isPro = u.subscription_tier === 'pro_monthly' || 
                    u.subscription_tier === 'pro_annual' ||
                    u.plan_type === 'pro'
      return isPro && !adminUserIds.has(u.user_id)
    }).length
    
    // Count PAYING Pro users (active subscription OR completed purchase, excluding admins)
    const payingProUsersCount = usageTracking.filter(u => {
      const isPro = u.subscription_tier === 'pro_monthly' || 
                    u.subscription_tier === 'pro_annual' ||
                    u.plan_type === 'pro'
      const hasPaid = activeSubscriptionUserIds.has(u.user_id) || 
                      completedPurchaseUserIds.has(u.user_id)
      return isPro && hasPaid && !adminUserIds.has(u.user_id)
    }).length
    
    const proUsers = totalProUsersCount  // Total Pro users (for display)
    const payingProUsers = payingProUsersCount  // Paying customers (for revenue)
    const freeUsers = totalUsers - proUsers
    const totalGenerations = generations.length
    const totalCVs = cvs.length
    const totalCoverLetters = coverLetters.length
    const totalInterviewPreps = interviewPreps.length

    // New users in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newUsersLast7Days = users.filter(u => new Date(u.created_at) > sevenDaysAgo).length

    // New users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const newUsersLast30Days = users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length


    // Active users (generated CV in last 30 days)
    const activeUserIds = new Set(
      generations
        .filter(g => new Date(g.created_at) > thirtyDaysAgo)
        .map(g => g.user_id)
    )
    const activeUsers = activeUserIds.size

    // Revenue calculation for MONTHLY SUBSCRIPTION MODEL
    // Use usage_tracking.subscription_tier to identify paying users (excluding admins)
    // Then query Stripe API for actual amounts
    
    // Paying pro users list (for fallback)
    const activePayingProUsers = usageTracking.filter(u => {
      const hasSubscriptionTier = u.subscription_tier === 'pro_monthly' || u.subscription_tier === 'pro_annual'
      const hasPaidStatus = activeSubscriptionUserIds.has(u.user_id) || completedPurchaseUserIds.has(u.user_id)
      return hasSubscriptionTier && hasPaidStatus && !adminUserIds.has(u.user_id)
    })

    console.log('[Analytics] Paying Pro users (non-admin):', activePayingProUsers.length)

    let totalMRR = 0
    let monthlyProCount = 0
    let annualProCount = 0
    let monthlyProRevenue = 0
    let annualProRevenue = 0
    let monthlyRevenueByMonth: Array<{ month: string; revenue: number; currency: string }> = []
    const upcomingPaymentsFromStripe: Array<{
      user_id: string; email: string; due_date: string; due_date_ts: number;
      days_until_due: number; plan: 'monthly' | 'annual'; amount: number;
      stripe_subscription_id: string | null; stripe_status: string;
    }> = []

    try {
      const stripe: any = require('stripe')(process.env.STRIPE_SECRET_KEY!)

      // ── Monthly revenue: Stripe invoices only (no double-counting) ──────────
      try {
        const startDate = new Date('2025-10-01T00:00:00.000Z')
        const monthTotals = new Map<string, { amountMinor: number; currencies: Set<string> }>()
        let startingAfter: string | undefined = undefined

        while (true) {
          const invoicesPage: any = await stripe.invoices.list({
            limit: 100,
            created: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(now.getTime() / 1000),
            },
            ...(startingAfter ? { starting_after: startingAfter } : {}),
          })
          for (const inv of invoicesPage.data) {
            if (inv.status !== 'paid') continue
            const netAmountMinor = Math.max(0, inv.amount_paid || 0)
            if (netAmountMinor <= 0) continue
            const created = new Date((inv.created || 0) * 1000)
            const key = `${created.getUTCFullYear()}-${String(created.getUTCMonth() + 1).padStart(2, '0')}`
            const current = monthTotals.get(key) || { amountMinor: 0, currencies: new Set<string>() }
            current.amountMinor += netAmountMinor
            if (inv.currency) current.currencies.add(String(inv.currency).toLowerCase())
            monthTotals.set(key, current)
          }
          if (!invoicesPage.has_more) break
          startingAfter = invoicesPage.data[invoicesPage.data.length - 1]?.id
          if (!startingAfter) break
        }

        monthlyRevenueByMonth = Array.from(monthTotals.entries())
          .map(([month, v]) => {
            const currencies = Array.from(v.currencies)
            return { month, revenue: v.amountMinor / 100, currency: currencies.length === 1 ? currencies[0] : 'mixed' }
          })
          .sort((a, b) => a.month.localeCompare(b.month))
      } catch (err) {
        console.error('[Analytics] Failed to compute monthly revenue from Stripe invoices:', err)
      }

      // ── MRR + upcoming payments: list ALL active Stripe subscriptions ────────
      // This is the fix: query Stripe directly instead of relying on DB current_period_end
      try {
        let subStartingAfter: string | undefined = undefined
        const stripeActiveSubs: any[] = []

        while (true) {
          const page: any = await stripe.subscriptions.list({
            status: 'active',
            limit: 100,
            expand: ['data.customer'],
            ...(subStartingAfter ? { starting_after: subStartingAfter } : {}),
          })
          stripeActiveSubs.push(...page.data)
          if (!page.has_more) break
          subStartingAfter = page.data[page.data.length - 1]?.id
          if (!subStartingAfter) break
        }

        const stripeCustomerEmail = (sub: any): string => {
          if (typeof sub.customer === 'object' && sub.customer?.email) return sub.customer.email
          return ''
        }

        for (const stripeSub of stripeActiveSubs) {
          const stripeCustomerId = typeof stripeSub.customer === 'object'
            ? stripeSub.customer?.id
            : stripeSub.customer

          // Strategy 1: match via subscriptions table (stripe_subscription_id or stripe_customer_id)
          let dbSub = subscriptions.find(
            s => s.stripe_subscription_id === stripeSub.id ||
                 (s.stripe_customer_id && s.stripe_customer_id === stripeCustomerId)
          )

          // Strategy 2: match via usage_tracking stripe_customer_id
          if (!dbSub) {
            const usageMatch = usageTracking.find(u => u.stripe_customer_id === stripeCustomerId)
            if (usageMatch) {
              dbSub = { user_id: usageMatch.user_id, stripe_subscription_id: stripeSub.id, stripe_customer_id: stripeCustomerId }
            }
          }

          // Strategy 3: match by Stripe customer email against auth users
          let userId = dbSub?.user_id
          if (!userId) {
            const custEmail = stripeCustomerEmail(stripeSub)
            if (custEmail) {
              const matchedUser = users.find(u => u.email?.toLowerCase() === custEmail.toLowerCase())
              if (matchedUser) userId = matchedUser.id
            }
          }

          if (!userId) {
            console.log('[Analytics] Stripe sub unmatched:', stripeSub.id, 'customer:', stripeCustomerId, 'email:', stripeCustomerEmail(stripeSub))
            continue
          }
          if (adminUserIds.has(userId)) continue

          const authUser = users.find(u => u.id === userId)
          const email = authUser?.email || stripeCustomerEmail(stripeSub) || 'Unknown'

          const price = stripeSub.items?.data?.[0]?.price
          const amount = price?.unit_amount || 0
          const interval = price?.recurring?.interval || 'month'

          if (interval === 'month') {
            const monthly = amount / 100
            totalMRR += monthly; monthlyProRevenue += monthly; monthlyProCount++
          } else if (interval === 'year') {
            const monthly = (amount / 100) / 12
            totalMRR += monthly; annualProRevenue += monthly; annualProCount++
          }

          // Upcoming payment using Stripe's current_period_end (always fresh)
          const periodEnd = stripeSub.current_period_end
          if (periodEnd) {
            const dueDate = new Date(periodEnd * 1000)
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            if (daysUntilDue >= 0) {
              upcomingPaymentsFromStripe.push({
                user_id: userId,
                email,
                due_date: dueDate.toISOString(),
                due_date_ts: periodEnd,
                days_until_due: daysUntilDue,
                plan: interval === 'year' ? 'annual' : 'monthly',
                amount: amount / 100,
                stripe_subscription_id: stripeSub.id,
                stripe_status: stripeSub.status,
              })
            }
          }
        }

        upcomingPaymentsFromStripe.sort((a, b) => a.days_until_due - b.days_until_due)
        console.log('[Analytics] Upcoming payments from Stripe:', upcomingPaymentsFromStripe.length)

      } catch (err) {
        console.error('[Analytics] Failed to list Stripe active subscriptions:', err)
        // Fallback MRR from DB tiers
        for (const u of activePayingProUsers) {
          if (u.subscription_tier === 'pro_monthly') { totalMRR += 2.99; monthlyProRevenue += 2.99; monthlyProCount++ }
          else if (u.subscription_tier === 'pro_annual') { totalMRR += 29.99 / 12; annualProRevenue += 29.99 / 12; annualProCount++ }
        }
      }

    } catch (err) {
      console.error('[Analytics] Failed to initialize Stripe:', err)
      monthlyProCount = activePayingProUsers.filter(u => u.subscription_tier === 'pro_monthly').length
      annualProCount = activePayingProUsers.filter(u => u.subscription_tier === 'pro_annual').length
      monthlyProRevenue = monthlyProCount * 2.99
      annualProRevenue = annualProCount * (29.99 / 12)
      totalMRR = monthlyProRevenue + annualProRevenue
    }

    console.log('[Analytics] Total MRR:', totalMRR, 'Monthly:', monthlyProCount, 'Annual:', annualProCount)

    const monthlyMRR = monthlyProRevenue
    const annualMRR = annualProRevenue
    
    // Calculate projected annual revenue (ARR)
    const projectedARR = totalMRR * 12
    
    // Legacy one-time purchases (if any exist from old model)
    const legacyRevenue = purchases
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100
    
    // Total revenue = MRR + legacy one-time purchases
    const combinedRevenue = totalMRR + legacyRevenue

    // User details with their stats
    const userDetails = users.map(user => {
      const purchase = purchases.find(p => p.user_id === user.id && p.status === 'completed')
      const subscription = subscriptions.find(s => s.user_id === user.id)
      const usage = usageTracking.find(u => u.user_id === user.id)
      // const userGenerations = generations.filter(g => g.user_id === user.id)
      const userCVs = cvs.filter(c => c.user_id === user.id)
      const userCoverLetters = coverLetters.filter(c => c.user_id === user.id)
      const userInterviewPreps = interviewPreps.filter(i => i.user_id === user.id)
      const profile = profiles.find(p => p.id === user.id)

      // Determine plan: check usage_tracking.subscription_tier (source of truth for subscription model)
      let userPlan = 'free'
      let userStatus = 'none'
      // const subscriptionType = null
      
      if (usage?.subscription_tier === 'pro_monthly') {
        userPlan = 'pro'
        userStatus = 'active'
        // subscriptionType = 'monthly'
      } else if (usage?.subscription_tier === 'pro_annual') {
        userPlan = 'pro'
        userStatus = 'active'
      } else if (purchase) {
        // Legacy one-time purchase
        userPlan = 'pro'
        userStatus = 'active'
      } else if (subscription?.status === 'active' && subscription?.plan === 'pro') {
        // Legacy subscription
        userPlan = 'pro'
        userStatus = subscription.status
      } else if (subscription) {
        userStatus = subscription.status
      }

      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        plan: userPlan,
        status: userStatus,
        generation_count: usage?.lifetime_generation_count || 0,
        monthly_usage: usage?.generation_count || 0,
        lifetime_usage: usage?.lifetime_generation_count || 0,
        max_lifetime_generations: usage?.max_lifetime_generations || (userPlan === 'pro' ? 999999 : 1),
        cv_count: userCVs.length,
        cover_letter_count: userCoverLetters.length,
        interview_prep_count: userInterviewPreps.length,
        last_activity: profile?.last_activity_at || user.last_sign_in_at,
        full_name: profile?.full_name || null,
        subscription_tier: usage?.subscription_tier || null,
        stripe_subscription_id: subscriptions.find(s => s.user_id === user.id)?.stripe_subscription_id || null,
      }
    })

    // Sort by last activity (most recent first)
    userDetails.sort((a, b) => {
      const dateA = a.last_activity ? new Date(a.last_activity).getTime() : 0
      const dateB = b.last_activity ? new Date(b.last_activity).getTime() : 0
      return dateB - dateA
    })

    // Generation activity over time (last 30 days)
    const generationsByDay: { [key: string]: number } = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split('T')[0]
      generationsByDay[dateKey] = 0
    }

    generations.forEach(gen => {
      const genDate = new Date(gen.created_at)
      if (genDate > thirtyDaysAgo) {
        const dateKey = genDate.toISOString().split('T')[0]
        if (generationsByDay[dateKey] !== undefined) {
          generationsByDay[dateKey]++
        }
      }
    })

    // User signups over time (last 30 days)
    const signupsByDay: { [key: string]: number } = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split('T')[0]
      signupsByDay[dateKey] = 0
    }

    users.forEach(user => {
      const userDate = new Date(user.created_at)
      if (userDate > thirtyDaysAgo) {
        const dateKey = userDate.toISOString().split('T')[0]
        if (signupsByDay[dateKey] !== undefined) {
          signupsByDay[dateKey]++
        }
      }
    })

    // Top users by generation count
    const topUsers = [...userDetails]
      .sort((a, b) => b.generation_count - a.generation_count)
      .slice(0, 10)

    // Count monthly vs annual Pro users (PAYING customers only)
    const monthlyProUsers = monthlyProCount  // Already filtered for paying customers above
    const annualProUsers = annualProCount  // Already filtered for paying customers above

    // Upcoming payments come directly from Stripe (upcomingPaymentsFromStripe built above)
    const upcomingPayments = upcomingPaymentsFromStripe.slice(0, 30)

    return NextResponse.json({
      overview: {
        totalUsers,
        proUsers,  // Total Pro users (including free Pro)
        payingProUsers,  // Only paying customers with Stripe subscriptions
        freeUsers,
        monthlyProUsers,
        annualProUsers,
        totalGenerations,
        totalCVs,
        totalCoverLetters,
        totalInterviewPreps,
        totalRevenue: combinedRevenue,
        monthlyRecurringRevenue: totalMRR,
        projectedAnnualRevenue: projectedARR,
        newUsersLast7Days,
        newUsersLast30Days,
        activeUsers,
        conversionRate: totalUsers > 0 ? ((payingProUsers / totalUsers) * 100).toFixed(1) : '0',
        avgGenerationsPerUser: totalUsers > 0 ? (totalGenerations / totalUsers).toFixed(1) : '0',
        revenueFromSubscriptions: totalMRR,
        revenueFromLegacyPurchases: legacyRevenue,
        averageRevenuePerProUser: payingProUsers > 0 ? ((totalMRR + legacyRevenue) / payingProUsers).toFixed(2) : '0',
        monthlyProRevenue: monthlyMRR,
        annualProRevenue: annualMRR,
        dataFetchedAt: now.toISOString(),
      },
      charts: { generationsByDay, signupsByDay },
      users: userDetails,
      topUsers,
      monthlyRevenueByMonth,
      upcomingPayments,
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
