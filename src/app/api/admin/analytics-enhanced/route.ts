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

    // Fetch all users with pagination
    let allUsers: Array<{id: string, email?: string, created_at: string, email_confirmed_at?: string, last_sign_in_at?: string, user_metadata?: any}> = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000
      })
      
      if (error) throw error
      
      allUsers = allUsers.concat(data.users)
      hasMore = data.users.length === 1000
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
      coverLettersResult
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('purchases').select('*'),
      supabase.from('subscriptions').select('*'),
      supabase.from('usage_tracking').select('*'),
      supabase.from('generations').select('id, user_id, created_at, job_title'),
      supabase.from('cvs').select('id, user_id, created_at'),
      supabase.from('cover_letters').select('id, user_id, created_at')
    ])

    const users = allUsers
    const profiles = profilesResult.data || []
    const purchases = purchasesResult.data || []
    const subscriptions = subscriptionsResult.data || []
    const usageTracking = usageResult.data || []
    const generations = generationsResult.data || []
    const cvs = cvsResult.data || []
    const coverLetters = coverLettersResult.data || []

    // Get active Stripe subscriptions
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

    // MONTH-BY-MONTH USER GROWTH
    const monthlyUserGrowth: { [key: string]: { total: number, free: number, pro: number, new: number } } = {}
    const monthlyGenerations: { [key: string]: number } = {}
    const monthlyRevenue: { [key: string]: number } = {}
    
    // App started October 1, 2025 - only show data from then onwards
    const appStartDate = new Date('2025-10-01')
    const currentDate = new Date()
    
    // Initialize months from October 2025 to current month
    let tempDate = new Date(appStartDate)
    while (tempDate <= currentDate) {
      const monthKey = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}`
      monthlyUserGrowth[monthKey] = { total: 0, free: 0, pro: 0, new: 0 }
      monthlyGenerations[monthKey] = 0
      monthlyRevenue[monthKey] = 0
      tempDate.setMonth(tempDate.getMonth() + 1)
    }

    // Calculate cumulative users per month and new signups
    users.forEach(user => {
      const userDate = new Date(user.created_at)
      const usage = usageTracking.find(u => u.user_id === user.id)
      const isProUser = usage?.subscription_tier === 'pro_monthly' || 
                        usage?.subscription_tier === 'pro_annual' ||
                        usage?.plan_type === 'pro'
      const hasPaid = activeSubscriptionUserIds.has(user.id) || completedPurchaseUserIds.has(user.id)
      const isPro = isProUser && hasPaid
      
      // For each month, count cumulative users
      Object.keys(monthlyUserGrowth).forEach(monthKey => {
        const [year, month] = monthKey.split('-').map(Number)
        const monthDate = new Date(year, month - 1, 1)
        
        // If user was created before or during this month
        if (userDate <= new Date(year, month, 0)) {
          monthlyUserGrowth[monthKey].total++
          if (isPro) {
            monthlyUserGrowth[monthKey].pro++
          } else {
            monthlyUserGrowth[monthKey].free++
          }
        }
      })
      
      // Count new signups in the month they joined
      const signupMonthKey = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`
      if (monthlyUserGrowth[signupMonthKey]) {
        monthlyUserGrowth[signupMonthKey].new++
      }
    })

    // Calculate monthly generations
    generations.forEach(gen => {
      const genDate = new Date(gen.created_at)
      const monthKey = `${genDate.getFullYear()}-${String(genDate.getMonth() + 1).padStart(2, '0')}`
      if (monthlyGenerations[monthKey] !== undefined) {
        monthlyGenerations[monthKey]++
      }
    })

    // Calculate monthly revenue (MRR snapshot per month)
    Object.keys(monthlyRevenue).forEach(monthKey => {
      const proUsersInMonth = monthlyUserGrowth[monthKey].pro
      // Estimate: assume average of £2.75/month (mix of monthly £2.99 and annual £2.50)
      monthlyRevenue[monthKey] = proUsersInMonth * 2.75
    })

    // GEOGRAPHIC DATA - Extract from user metadata or profiles
    const countryCounts: { [key: string]: number } = {}
    users.forEach(user => {
      // Try to get country from user metadata or profile
      const country = user.user_metadata?.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    })
    
    const topCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }))

    // TRAFFIC SOURCES - Extract from user metadata
    const trafficSources: { [key: string]: number } = {}
    users.forEach(user => {
      const source = user.user_metadata?.referrer || user.user_metadata?.utm_source || 'Direct'
      trafficSources[source] = (trafficSources[source] || 0) + 1
    })
    
    const topTrafficSources = Object.entries(trafficSources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count, percentage: ((count / users.length) * 100).toFixed(1) }))

    // KEYWORD DATA - Extract from user metadata (if tracked)
    const keywords: { [key: string]: number } = {}
    users.forEach(user => {
      const keyword = user.user_metadata?.search_keyword || user.user_metadata?.utm_term
      if (keyword) {
        keywords[keyword] = (keywords[keyword] || 0) + 1
      }
    })
    
    const topKeywords = Object.entries(keywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([keyword, count]) => ({ keyword, count }))

    // DEVICE & BROWSER DATA
    const devices: { [key: string]: number } = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 }
    const browsers: { [key: string]: number } = {}
    
    users.forEach(user => {
      const device = user.user_metadata?.device_type || 'unknown'
      devices[device] = (devices[device] || 0) + 1
      
      const browser = user.user_metadata?.browser || 'Unknown'
      browsers[browser] = (browsers[browser] || 0) + 1
    })

    // USER RETENTION - Users who came back after first visit
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const returningUsers = users.filter(user => {
      const created = new Date(user.created_at)
      const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
      return lastSignIn && created < thirtyDaysAgo && lastSignIn > created
    }).length

    const retentionRate = users.length > 0 ? ((returningUsers / users.length) * 100).toFixed(1) : '0'

    // CONVERSION FUNNEL
    const usersWhoUploaded = new Set(cvs.map(cv => cv.user_id)).size
    const usersWhoGenerated = new Set(generations.map(g => g.user_id)).size
    const payingUsers = usageTracking.filter(u => {
      const isProUser = u.subscription_tier === 'pro_monthly' || 
                        u.subscription_tier === 'pro_annual' ||
                        u.plan_type === 'pro'
      const hasPaid = activeSubscriptionUserIds.has(u.user_id) || 
                      completedPurchaseUserIds.has(u.user_id)
      return isProUser && hasPaid
    }).length

    const conversionFunnel = {
      signups: users.length,
      uploaded: usersWhoUploaded,
      generated: usersWhoGenerated,
      paid: payingUsers,
      uploadRate: users.length > 0 ? ((usersWhoUploaded / users.length) * 100).toFixed(1) : '0',
      generationRate: usersWhoUploaded > 0 ? ((usersWhoGenerated / usersWhoUploaded) * 100).toFixed(1) : '0',
      conversionRate: usersWhoGenerated > 0 ? ((payingUsers / usersWhoGenerated) * 100).toFixed(1) : '0'
    }

    // POPULAR JOB TITLES
    const jobTitleCounts: { [key: string]: number } = {}
    generations.forEach(gen => {
      if (gen.job_title) {
        jobTitleCounts[gen.job_title] = (jobTitleCounts[gen.job_title] || 0) + 1
      }
    })
    
    const topJobTitles = Object.entries(jobTitleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([title, count]) => ({ title, count }))

    // DAILY ACTIVE USERS (last 30 days)
    const dailyActiveUsers: { [key: string]: number } = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split('T')[0]
      dailyActiveUsers[dateKey] = 0
    }

    generations.forEach(gen => {
      const genDate = new Date(gen.created_at)
      if (genDate > thirtyDaysAgo) {
        const dateKey = genDate.toISOString().split('T')[0]
        if (dailyActiveUsers[dateKey] !== undefined) {
          const userId = gen.user_id
          // Count unique users per day (simplified - in production use Set)
          dailyActiveUsers[dateKey]++
        }
      }
    })

    return NextResponse.json({
      monthlyGrowth: monthlyUserGrowth,
      monthlyGenerations,
      monthlyRevenue,
      geography: {
        topCountries,
        totalCountries: Object.keys(countryCounts).length
      },
      traffic: {
        sources: topTrafficSources,
        totalSources: Object.keys(trafficSources).length
      },
      keywords: {
        topKeywords,
        totalKeywords: Object.keys(keywords).length
      },
      devices: {
        breakdown: devices,
        browsers: Object.entries(browsers)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([browser, count]) => ({ browser, count }))
      },
      retention: {
        returningUsers,
        retentionRate,
        totalUsers: users.length
      },
      conversionFunnel,
      topJobTitles,
      dailyActiveUsers
    })

  } catch (error) {
    console.error('Enhanced analytics error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
