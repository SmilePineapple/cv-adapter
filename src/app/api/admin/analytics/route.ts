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
    let allUsers: any[] = []
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

    // Calculate statistics - support both purchases (lifetime) and subscriptions (legacy)
    const totalUsers = users.length
    
    // Count pro users from both purchases and subscriptions tables
    const proUsersFromPurchases = new Set(purchases.filter(p => p.status === 'completed').map(p => p.user_id))
    const proUsersFromSubscriptions = new Set(subscriptions.filter(s => s.status === 'active' && s.plan === 'pro').map(s => s.user_id))
    const allProUsers = new Set([...proUsersFromPurchases, ...proUsersFromSubscriptions])
    
    const proUsers = allProUsers.size
    const freeUsers = totalUsers - proUsers
    const totalGenerations = generations.length
    const totalCVs = cvs.length
    const totalCoverLetters = coverLetters.length

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

    // Revenue calculation - sum actual amounts paid from purchases table
    // Note: amount_paid is in pence (500 = £5.00, 250 = £2.50)
    const totalRevenue = purchases
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100 // Convert pence to pounds
    
    // Legacy subscriptions revenue (if any exist)
    const legacyRevenue = subscriptions
      .filter(s => s.status === 'active' && s.plan === 'pro')
      .length * 5 // Assume £5 for legacy subscriptions
    
    const combinedRevenue = totalRevenue + legacyRevenue

    // User details with their stats
    const userDetails = users.map(user => {
      const purchase = purchases.find(p => p.user_id === user.id && p.status === 'completed')
      const subscription = subscriptions.find(s => s.user_id === user.id)
      const usage = usageTracking.find(u => u.user_id === user.id)
      const userGenerations = generations.filter(g => g.user_id === user.id)
      const userCVs = cvs.filter(c => c.user_id === user.id)
      const userCoverLetters = coverLetters.filter(c => c.user_id === user.id)
      const profile = profiles.find(p => p.id === user.id)

      // Determine plan: check purchases first (lifetime), then subscriptions (legacy), then usage_tracking
      let userPlan = 'free'
      let userStatus = 'none'
      
      if (purchase) {
        userPlan = 'pro'
        userStatus = 'active'
      } else if (subscription?.status === 'active' && subscription?.plan === 'pro') {
        userPlan = 'pro'
        userStatus = subscription.status
      } else if (usage?.plan_type === 'pro') {
        userPlan = 'pro'
        userStatus = 'active'
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
        cv_count: userCVs.length,
        cover_letter_count: userCoverLetters.length,
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

    return NextResponse.json({
      overview: {
        totalUsers,
        proUsers,
        freeUsers,
        totalGenerations,
        totalCVs,
        totalCoverLetters,
        totalRevenue: combinedRevenue,
        newUsersLast7Days,
        newUsersLast30Days,
        activeUsers,
        conversionRate: totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : '0',
        avgGenerationsPerUser: totalUsers > 0 ? (totalGenerations / totalUsers).toFixed(1) : '0',
        revenueFromPurchases: totalRevenue,
        revenueFromLegacySubscriptions: legacyRevenue,
        averageRevenuePerProUser: proUsers > 0 ? (combinedRevenue / proUsers).toFixed(2) : '0'
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
