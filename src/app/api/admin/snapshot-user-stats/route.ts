import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

/**
 * POST /api/admin/snapshot-user-stats
 * Seeds / refreshes user_growth_stats from all current auth.users.
 * Safe to run multiple times — uses upsert (will only ADD to existing counts,
 * never overwrite months that already have a higher value from past deletions).
 *
 * Call this once to backfill historical data from existing users, then the
 * deletion cron keeps the table accurate going forward.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth: must be admin user
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: userError } = await userClient.auth.getUser(token)
    if (userError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = createAdminClient()

    // Paginate through all current auth users
    const allUsers: Array<{ created_at: string }> = []
    let page = 1
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      if (error) throw error
      allUsers.push(...data.users)
      if (data.users.length < 1000) break
      page++
    }

    // Group by year-month based on created_at
    const monthlyCounts = new Map<string, number>()
    for (const u of allUsers) {
      if (!u.created_at) continue
      const d = new Date(u.created_at)
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
      monthlyCounts.set(key, (monthlyCounts.get(key) || 0) + 1)
    }

    // Upsert into user_growth_stats — for each month we take the MAX of
    // what's already stored vs what we can see now (protects against deleted-user data)
    const { data: existing } = await supabase
      .from('user_growth_stats')
      .select('year_month, new_signups')

    const existingMap = new Map<string, number>(
      (existing || []).map(r => [r.year_month, r.new_signups])
    )

    const rows = Array.from(monthlyCounts.entries()).map(([year_month, liveCount]) => ({
      year_month,
      new_signups: Math.max(liveCount, existingMap.get(year_month) || 0),
      updated_at: new Date().toISOString(),
    }))

    if (rows.length === 0) {
      return NextResponse.json({ success: true, upserted: 0, totalUsers: 0 })
    }

    const { error: upsertError } = await supabase
      .from('user_growth_stats')
      .upsert(rows, { onConflict: 'year_month' })

    if (upsertError) throw upsertError

    console.log(`[SnapshotUserStats] Upserted ${rows.length} months from ${allUsers.length} current users`)

    return NextResponse.json({
      success: true,
      upserted: rows.length,
      totalUsers: allUsers.length,
      months: rows.map(r => ({ month: r.year_month, signups: r.new_signups })).sort((a, b) => a.month.localeCompare(b.month)),
    })
  } catch (error) {
    console.error('[SnapshotUserStats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
