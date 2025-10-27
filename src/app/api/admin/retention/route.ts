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
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get all users
    const { data: allUsers } = await supabase.auth.admin.listUsers()

    // Users who signed up 7+ days ago
    const usersFrom7DaysAgo = allUsers.users.filter(u => 
      new Date(u.created_at) <= sevenDaysAgo
    )

    // Of those, how many were active in last 7 days
    const { data: activeIn7Days } = await supabase
      .from('profiles')
      .select('id')
      .in('id', usersFrom7DaysAgo.map(u => u.id))
      .gte('last_activity_at', sevenDaysAgo.toISOString())

    const retention7Day = usersFrom7DaysAgo.length > 0
      ? (activeIn7Days?.length || 0) / usersFrom7DaysAgo.length * 100
      : 0

    // Users who signed up 30+ days ago
    const usersFrom30DaysAgo = allUsers.users.filter(u => 
      new Date(u.created_at) <= thirtyDaysAgo
    )

    // Of those, how many were active in last 30 days
    const { data: activeIn30Days } = await supabase
      .from('profiles')
      .select('id')
      .in('id', usersFrom30DaysAgo.map(u => u.id))
      .gte('last_activity_at', thirtyDaysAgo.toISOString())

    const retention30Day = usersFrom30DaysAgo.length > 0
      ? (activeIn30Days?.length || 0) / usersFrom30DaysAgo.length * 100
      : 0

    return NextResponse.json({
      day7: retention7Day,
      day30: retention30Day
    })
  } catch (error) {
    console.error('Retention error:', error)
    return NextResponse.json({ error: 'Failed to fetch retention data' }, { status: 500 })
  }
}
