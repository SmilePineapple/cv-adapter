import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendDay3ProNudgeEmail, sendDay7OfferEmail } from '@/lib/email'

/**
 * Drip email sequence cron — runs daily at 10:30 AM UTC
 *
 * Day 3: Free users who signed up 3 days ago → Pro nudge email
 * Day 7: Free users who signed up 7 days ago and still haven't converted → Offer email
 *
 * Uses email_sequences table to ensure each step is only ever sent once per user.
 * Skips unsubscribed users and Pro users.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = new Date()

    // ── helpers ────────────────────────────────────────────────────────────────
    const daysAgo = (n: number) => {
      const d = new Date(now)
      d.setDate(d.getDate() - n)
      return d.toISOString()
    }

    const results = {
      day3: { sent: 0, skipped: 0, errors: 0 },
      day7: { sent: 0, skipped: 0, errors: 0 },
    }

    // ── fetch auth users & usage_tracking once ─────────────────────────────────
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers()
    if (authErr) throw authErr

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('user_id, subscription_tier, plan_type')

    const { data: alreadySent } = await supabase
      .from('email_sequences')
      .select('user_id, sequence_step')

    const proUserIds = new Set(
      (usage || [])
        .filter(u => u.subscription_tier?.startsWith('pro') || u.plan_type === 'pro')
        .map(u => u.user_id)
    )

    const sentSet = new Set(
      (alreadySent || []).map(r => `${r.user_id}::${r.sequence_step}`)
    )

    const isUnsubscribed = (u: any) => u.user_metadata?.email_unsubscribed === true
    const getName = (u: any) => u.user_metadata?.name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'there'

    // ── helper: record sent ───────────────────────────────────────────────────
    async function markSent(userId: string, step: string, email: string) {
      await supabase.from('email_sequences').upsert(
        { user_id: userId, sequence_step: step, email, sent_at: now.toISOString() },
        { onConflict: 'user_id,sequence_step' }
      )
    }

    // ── Day 3: Pro nudge ───────────────────────────────────────────────────────
    const day3Start = daysAgo(4)
    const day3End = daysAgo(3)
    const day3Users = authData.users.filter(u => {
      if (!u.email || !u.created_at) return false
      if (isUnsubscribed(u)) return false
      if (proUserIds.has(u.id)) return false
      if (sentSet.has(`${u.id}::day3_pro_nudge`)) return false
      const created = u.created_at
      return created >= day3Start && created < day3End
    })

    console.log(`[Drip] Day 3 candidates: ${day3Users.length}`)

    for (const user of day3Users) {
      const name = getName(user)
      const result = await sendDay3ProNudgeEmail(user.email!, name)
      if (result.success) {
        await markSent(user.id, 'day3_pro_nudge', user.email!)
        results.day3.sent++
      } else {
        results.day3.errors++
        console.error(`[Drip] Day3 failed for ${user.email}:`, result.error)
      }
      await new Promise(r => setTimeout(r, 150))
    }

    // ── Day 7: Offer ──────────────────────────────────────────────────────────
    const day7Start = daysAgo(8)
    const day7End = daysAgo(7)
    const day7Users = authData.users.filter(u => {
      if (!u.email || !u.created_at) return false
      if (isUnsubscribed(u)) return false
      if (proUserIds.has(u.id)) return false          // already converted — skip
      if (sentSet.has(`${u.id}::day7_offer`)) return false
      const created = u.created_at
      return created >= day7Start && created < day7End
    })

    console.log(`[Drip] Day 7 candidates: ${day7Users.length}`)

    for (const user of day7Users) {
      const name = getName(user)
      const result = await sendDay7OfferEmail(user.email!, name)
      if (result.success) {
        await markSent(user.id, 'day7_offer', user.email!)
        results.day7.sent++
      } else {
        results.day7.errors++
        console.error(`[Drip] Day7 failed for ${user.email}:`, result.error)
      }
      await new Promise(r => setTimeout(r, 150))
    }

    console.log('[Drip] Sequence complete:', results)

    return NextResponse.json({
      success: true,
      results,
      timestamp: now.toISOString(),
    })

  } catch (error: unknown) {
    console.error('[Drip] Cron error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
