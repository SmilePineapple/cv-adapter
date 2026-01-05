import { NextResponse } from 'next/server'
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

    // Get all users
    const { data: allUsers } = await supabase.auth.admin.listUsers()
    const totalSignups = allUsers.users.length

    // Users with at least 1 generation
    const { data: usersWithGenerations } = await supabase
      .from('usage_tracking')
      .select('user_id, lifetime_generation_count')
      .gte('lifetime_generation_count', 1)

    const firstGeneration = usersWithGenerations?.length || 0

    // Users with 2+ generations
    const secondGeneration = usersWithGenerations?.filter(u => u.lifetime_generation_count >= 2).length || 0

    // Pro users (upgrades)
    const { data: proUsers } = await supabase
      .from('purchases')
      .select('user_id')
      .eq('status', 'completed')

    const upgrades = proUsers?.length || 0

    // Estimate visitors (signups / 0.2 = rough visitor estimate)
    const estimatedVisitors = Math.round(totalSignups / 0.2)

    return NextResponse.json({
      visitors: estimatedVisitors,
      signups: totalSignups,
      firstGeneration,
      secondGeneration,
      upgrades
    })
  } catch (error) {
    console.error('Conversion funnel error:', error)
    return NextResponse.json({ error: 'Failed to fetch funnel data' }, { status: 500 })
  }
}
