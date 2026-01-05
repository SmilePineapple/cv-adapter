import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export async function GET() {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Users who were active 30-60 days ago
    const { data: previouslyActiveUsers } = await supabase
      .from('profiles')
      .select('id, last_activity_at')
      .gte('last_activity_at', sixtyDaysAgo.toISOString())
      .lt('last_activity_at', thirtyDaysAgo.toISOString())

    const previouslyActiveCount = previouslyActiveUsers?.length || 0

    // Of those, how many are still active (active in last 30 days)
    const { data: stillActiveUsers } = await supabase
      .from('profiles')
      .select('id')
      .in('id', previouslyActiveUsers?.map(u => u.id) || [])
      .gte('last_activity_at', thirtyDaysAgo.toISOString())

    const stillActiveCount = stillActiveUsers?.length || 0

    // Churn = (previously active - still active) / previously active
    const churnedCount = previouslyActiveCount - stillActiveCount
    const churnRate = previouslyActiveCount > 0
      ? (churnedCount / previouslyActiveCount) * 100
      : 0

    return NextResponse.json({
      churnRate,
      churnedUsers: churnedCount,
      previouslyActiveUsers: previouslyActiveCount,
      retainedUsers: stillActiveCount
    })
  } catch (error) {
    console.error('Churn rate error:', error)
    return NextResponse.json({ error: 'Failed to calculate churn rate' }, { status: 500 })
  }
}
