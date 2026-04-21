import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

/**
 * POST /api/admin/snapshot-user-stats
 * Seeds / refreshes user_growth_stats from three sources:
 *   1. Current auth.users (live accounts)
 *   2. Orphaned `profiles` rows (deleted users whose profile survived the cron cleanup)
 *   3. Orphaned `generations` rows (earliest gen date used as proxy signup date)
 *
 * Safe to run multiple times — upsert uses MAX to never overwrite higher stored counts.
 */
export async function POST(request: NextRequest) {
  try {
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

    // ── 1. Current live auth.users ────────────────────────────────────────────
    const liveUsers: Array<{ id: string; created_at: string }> = []
    let page = 1
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      if (error) throw error
      liveUsers.push(...data.users.map(u => ({ id: u.id, created_at: u.created_at })))
      if (data.users.length < 1000) break
      page++
    }
    const liveUserIds = new Set(liveUsers.map(u => u.id))

    // Combined map: user_id → earliest known date (signup date)
    const signupDates = new Map<string, string>()
    for (const u of liveUsers) {
      if (u.created_at) signupDates.set(u.id, u.created_at)
    }

    // ── 2. Orphaned profiles (users deleted from auth but profile row survived) ──
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, created_at')

    let orphanedProfileCount = 0
    for (const p of (allProfiles || [])) {
      if (!liveUserIds.has(p.id) && p.created_at) {
        signupDates.set(p.id, p.created_at)
        orphanedProfileCount++
      }
    }

    // ── 3. Orphaned generations (earliest generation ≈ signup for any remaining gaps) ──
    const { data: allGenerations } = await supabase
      .from('generations')
      .select('user_id, created_at')
      .order('created_at', { ascending: true })

    let orphanedGenCount = 0
    for (const g of (allGenerations || [])) {
      if (!liveUserIds.has(g.user_id) && !signupDates.has(g.user_id) && g.created_at) {
        signupDates.set(g.user_id, g.created_at)
        orphanedGenCount++
      }
    }

    // ── Group all signup dates by year-month ──────────────────────────────────
    const monthlyCounts = new Map<string, number>()
    for (const dateStr of signupDates.values()) {
      const d = new Date(dateStr)
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
      monthlyCounts.set(key, (monthlyCounts.get(key) || 0) + 1)
    }

    // ── Upsert: MAX wins — never lower a stored count ─────────────────────────
    const { data: existing } = await supabase
      .from('user_growth_stats')
      .select('year_month, new_signups')

    const existingMap = new Map<string, number>(
      (existing || []).map(r => [r.year_month, r.new_signups])
    )

    const rows = Array.from(monthlyCounts.entries()).map(([year_month, count]) => ({
      year_month,
      new_signups: Math.max(count, existingMap.get(year_month) || 0),
      updated_at: new Date().toISOString(),
    }))

    if (rows.length === 0) {
      return NextResponse.json({
        success: true, upserted: 0, totalUsers: 0,
        sources: { live: liveUsers.length, orphanedProfiles: 0, orphanedGenerations: 0 },
      })
    }

    const { error: upsertError } = await supabase
      .from('user_growth_stats')
      .upsert(rows, { onConflict: 'year_month' })

    if (upsertError) throw upsertError

    const totalRecovered = signupDates.size
    console.log(`[SnapshotUserStats] Upserted ${rows.length} months | live=${liveUsers.length} orphaned_profiles=${orphanedProfileCount} orphaned_gens=${orphanedGenCount} total=${totalRecovered}`)

    return NextResponse.json({
      success: true,
      upserted: rows.length,
      totalUsers: totalRecovered,
      sources: {
        live: liveUsers.length,
        orphanedProfiles: orphanedProfileCount,
        orphanedGenerations: orphanedGenCount,
      },
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
