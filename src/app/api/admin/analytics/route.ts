import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

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
    const totalUsers = users.length
    
    // Get active Stripe subscriptions FIRST (needed for revenue calculations)
    const activeSubscriptionUserIds = new Set(
      subscriptions
        .filter(s => s.status === 'active' && s.stripe_subscription_id)
        .map(s => s.user_id)
    )
    
    // Count ALL Pro users (including free Pro, manual upgrades, testing)
    const totalProUsersCount = usageTracking.filter(u => 
      u.subscription_tier === 'pro_monthly' || 
      u.subscription_tier === 'pro_annual' ||
      u.plan_type === 'pro'
    ).length
    
    // Count PAYING Pro users only (must have active Stripe subscription)
    const payingProUsersCount = usageTracking.filter(u => 
      (u.subscription_tier === 'pro_monthly' || u.subscription_tier === 'pro_annual') &&
      activeSubscriptionUserIds.has(u.user_id)
    ).length
    
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
    // Monthly Pro: £2.99/month, Annual Pro: £29.99/year
    // NOTE: activeSubscriptionUserIds already defined above
    
    // Count PAYING Pro users only (must have active Stripe subscription)
    const monthlyProCount = usageTracking.filter(u => 
      u.subscription_tier === 'pro_monthly' && activeSubscriptionUserIds.has(u.user_id)
    ).length
    const annualProCount = usageTracking.filter(u => 
      u.subscription_tier === 'pro_annual' && activeSubscriptionUserIds.has(u.user_id)
    ).length
    
    // Calculate Monthly Recurring Revenue (MRR) - only from PAYING customers
    const monthlyMRR = monthlyProCount * 2.99
    const annualMRR = annualProCount * (29.99 / 12) // Annual £29.99/year = £2.50/month
    const totalMRR = monthlyMRR + annualMRR
    
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
      const userGenerations = generations.filter(g => g.user_id === user.id)
      const userCVs = cvs.filter(c => c.user_id === user.id)
      const userCoverLetters = coverLetters.filter(c => c.user_id === user.id)
      const userInterviewPreps = interviewPreps.filter(i => i.user_id === user.id)
      const profile = profiles.find(p => p.id === user.id)

      // Determine plan: check usage_tracking.subscription_tier (source of truth for subscription model)
      let userPlan = 'free'
      let userStatus = 'none'
      let subscriptionType = null
      
      if (usage?.subscription_tier === 'pro_monthly') {
        userPlan = 'pro'
        userStatus = 'active'
        subscriptionType = 'monthly'
      } else if (usage?.subscription_tier === 'pro_annual') {
        userPlan = 'pro'
        userStatus = 'active'
        subscriptionType = 'annual'
      } else if (purchase) {
        // Legacy one-time purchase
        userPlan = 'pro'
        userStatus = 'active'
        subscriptionType = 'lifetime'
      } else if (subscription?.status === 'active' && subscription?.plan === 'pro') {
        // Legacy subscription
        userPlan = 'pro'
        userStatus = subscription.status
        const _subscriptionType = 'legacy'
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
        generation_count: userGenerations.length,
        monthly_usage: usage?.generation_count || 0,
        lifetime_usage: usage?.lifetime_generation_count || userGenerations.length,
        max_lifetime_generations: usage?.max_lifetime_generations || (userPlan === 'pro' ? 999999 : 1),
        cv_count: userCVs.length,
        cover_letter_count: userCoverLetters.length,
        interview_prep_count: userInterviewPreps.length,
        last_activity: profile?.last_activity_at || user.last_sign_in_at,
        full_name: profile?.full_name || null
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
        conversionRate: totalUsers > 0 ? ((payingProUsers / totalUsers) * 100).toFixed(1) : '0',  // Use paying customers for conversion
        avgGenerationsPerUser: totalUsers > 0 ? (totalGenerations / totalUsers).toFixed(1) : '0',
        revenueFromSubscriptions: totalMRR,
        revenueFromLegacyPurchases: legacyRevenue,
        averageRevenuePerProUser: payingProUsers > 0 ? (combinedRevenue / payingProUsers).toFixed(2) : '0',  // Use paying customers
        monthlyProRevenue: monthlyMRR,
        annualProRevenue: annualMRR
      },
      charts: {
        generationsByDay,
        signupsByDay
      },
      users: userDetails,
      topUsers
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
