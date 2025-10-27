import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role for admin queries
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const todayStart = new Date(now.setHours(0, 0, 0, 0))

    // Active users now (last 30 minutes for more accurate count)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const { data: activeUsers } = await supabaseAdmin
      .from('usage_tracking')
      .select('user_id')
      .gte('updated_at', thirtyMinutesAgo.toISOString())

    // Generations in last hour
    const { data: recentGenerations } = await supabaseAdmin
      .from('generations')
      .select('id')
      .gte('created_at', oneHourAgo.toISOString())

    // Revenue today
    const { data: todayPurchases } = await supabaseAdmin
      .from('purchases')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', todayStart.toISOString())

    const revenueToday = todayPurchases?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0

    // Signups today - use service role
    const { data: todaySignups } = await supabaseAdmin.auth.admin.listUsers()
    const signupsToday = todaySignups?.users?.filter(u => 
      new Date(u.created_at) >= todayStart
    ).length || 0

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
