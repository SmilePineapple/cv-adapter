import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const todayStart = new Date(now.setHours(0, 0, 0, 0))

    // Active users now (last 5 minutes) - using usage_tracking table
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const { data: activeUsers } = await supabase
      .from('usage_tracking')
      .select('user_id')
      .gte('updated_at', fiveMinutesAgo.toISOString())

    // Generations in last hour
    const { data: recentGenerations } = await supabase
      .from('generations')
      .select('id')
      .gte('created_at', oneHourAgo.toISOString())

    // Revenue today
    const { data: todayPurchases } = await supabase
      .from('purchases')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', todayStart.toISOString())

    const revenueToday = todayPurchases?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0

    // Signups today
    const { data: todaySignups } = await supabase.auth.admin.listUsers()
    const signupsToday = todaySignups.users.filter(u => 
      new Date(u.created_at) >= todayStart
    ).length

    // Error rate (simplified - would need error tracking in production)
    const errorRate = 0.5 // Placeholder - implement proper error tracking

    return NextResponse.json({
      activeUsersNow: activeUsers?.length || 0,
      generationsLastHour: recentGenerations?.length || 0,
      revenueToday,
      signupsToday,
      errorRate
    })
  } catch (error) {
    console.error('Real-time metrics error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
