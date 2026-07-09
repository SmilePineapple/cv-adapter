import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import Stripe from 'stripe'

/**
 * Cron job: permanently delete inactive free users after 90 days (GDPR Article 5)
 * Only deletes users who:
 *   - Are free tier (verified via BOTH usage_tracking AND subscriptions table)
 *   - Have been inactive for 90+ days
 *   - Were sent a deletion warning email 30 days ago
 * Runs daily at 8:30 AM UTC via cron-jobs.org
 */

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) return null
  return new Stripe(apiKey, { apiVersion: '2025-08-27.basil' })
}
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = Date.now()
    const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString()

    // force=true bypasses the warning requirement for one-time bulk cleanup
    const force = request.nextUrl.searchParams.get('force') === 'true'

    // Paginate through all users (default page size is 50)
    const allUsers = []
    let page = 1
    while (true) {
      const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      if (authErr) throw authErr
      allUsers.push(...authData.users)
      if (authData.users.length < 1000) break
      page++
    }

    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('user_id, plan_type, subscription_tier, last_generation_at')

    const usageMap = new Map((usageRows || []).map(u => [u.user_id, u]))

    // Also fetch subscriptions table — this is the source of truth for Stripe state
    // A user may have usage_tracking.plan_type = 'free' but still have an active
    // Stripe subscription (e.g. after a sync error). We must NEVER delete those users.
    const { data: subRows } = await supabase
      .from('subscriptions')
      .select('user_id, stripe_subscription_id, stripe_customer_id, status')

    const activeSubMap = new Map<string, { stripe_subscription_id: string | null; stripe_customer_id: string | null; status: string }>()
    ;(subRows || []).forEach(r => {
      if (r.status === 'active' || r.status === 'trialing' || r.status === 'past_due') {
        activeSubMap.set(r.user_id, r)
      }
    })

    // Only check warnings if not in force mode
    const warnedMap = new Map<string, string>()
    if (!force) {
      const { data: warnedRows } = await supabase
        .from('email_sequences')
        .select('user_id, sent_at')
        .eq('sequence_step', 'deletion_warning_30day')
      ;(warnedRows || []).forEach(r => warnedMap.set(r.user_id, r.sent_at))
    }

    const twentyFiveDaysAgo = new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString()

    const targets = allUsers.filter(u => {
      if (!u.email || !u.created_at) return false
      const usage = usageMap.get(u.id)
      // Skip pro users — never delete paying customers
      if (usage?.plan_type === 'pro' || usage?.subscription_tier?.startsWith('pro')) return false
      // Also check subscriptions table — if there's an active Stripe sub, skip regardless
      // This catches the edge case where usage_tracking was reset/corrupted but Stripe is still charging
      if (activeSubMap.has(u.id)) return false
      // Must be inactive for 90+ days
      // Null last_sign_in_at means never logged in — treat as inactive since created_at
      const lastActive = usage?.last_generation_at || u.last_sign_in_at || u.created_at || ninetyDaysAgo
      if (lastActive > ninetyDaysAgo) return false
      // In normal mode, must have been warned at least 25 days ago
      if (!force) {
        const warnedAt = warnedMap.get(u.id)
        if (!warnedAt || warnedAt > twentyFiveDaysAgo) return false
      }
      return true
    })

    console.log(`[DeleteInactiveUsers] Total auth users: ${allUsers.length}, force: ${force}`)
    console.log(`[DeleteInactiveUsers] Usage rows: ${usageRows?.length || 0}`)
    console.log(`[DeleteInactiveUsers] ${targets.length} users targeted for deletion`)

    // Debug: show breakdown of why users are excluded
    let proSkipped = 0, tooRecentlyActive = 0, activeSubSkipped = 0
    allUsers.forEach((u: { id: string; last_sign_in_at?: string | null; created_at: string }) => {
      const usage = usageMap.get(u.id)
      if (usage?.plan_type === 'pro' || usage?.subscription_tier?.startsWith('pro')) { proSkipped++; return }
      if (activeSubMap.has(u.id)) { activeSubSkipped++; return }
      const lastActive = usage?.last_generation_at || u.last_sign_in_at || u.created_at || ninetyDaysAgo
      if (lastActive > ninetyDaysAgo) tooRecentlyActive++
    })
    console.log(`[DeleteInactiveUsers] Pro users skipped: ${proSkipped}, Active sub skipped: ${activeSubSkipped}, Too recently active: ${tooRecentlyActive}`)

    if (targets.length === 0) {
      return NextResponse.json({ success: true, message: 'No users to delete', count: 0 })
    }

    // ── Save aggregate signup stats BEFORE deleting (preserves history with no PII) ──
    try {
      const signupMonthCounts = new Map<string, number>()
      for (const u of targets) {
        if (!u.created_at) continue
        const d = new Date(u.created_at)
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
        signupMonthCounts.set(key, (signupMonthCounts.get(key) || 0) + 1)
      }

      // For each affected month, ensure new_signups is at least as large as the
      // combined live + about-to-be-deleted count (MAX wins on conflict).
      const { data: existingStats } = await supabase
        .from('user_growth_stats')
        .select('year_month, new_signups')
        .in('year_month', Array.from(signupMonthCounts.keys()))

      const existingMap = new Map<string, number>(
        (existingStats || []).map((r: { year_month: string; new_signups: number }) => [r.year_month, r.new_signups])
      )

      const signupRows = Array.from(signupMonthCounts.entries()).map(([year_month, deletedCount]) => ({
        year_month,
        // Use whichever is higher: what we already stored vs (existing stored + users we're about to delete)
        new_signups: Math.max(existingMap.get(year_month) || 0, (existingMap.get(year_month) || 0) + deletedCount),
        updated_at: new Date().toISOString(),
      }))

      await supabase.from('user_growth_stats').upsert(signupRows, { onConflict: 'year_month' })
      console.log(`[DeleteInactiveUsers] Saved signup stats for ${signupRows.length} month(s) before deletion`)
    } catch (statsErr) {
      console.error('[DeleteInactiveUsers] Failed to save pre-deletion signup stats:', statsErr)
      // Non-fatal — continue with deletion
    }

    let successCount = 0
    let failureCount = 0
    const deletedEmails: string[] = []

    const stripe = getStripeClient()

    for (const user of targets) {
      try {
        // Cancel any Stripe subscription that might still be active (safety net)
        // Even though we checked activeSubMap, there could be edge cases where a sub
        // exists in Stripe but not in our DB. Check by user ID in Stripe metadata.
        if (stripe) {
          try {
            // Check subscriptions table for this user (even inactive status)
            const { data: userSub } = await supabase
              .from('subscriptions')
              .select('stripe_subscription_id, stripe_customer_id, status')
              .eq('user_id', user.id)
              .maybeSingle()

            if (userSub?.stripe_subscription_id) {
              try {
                const sub = await stripe.subscriptions.retrieve(userSub.stripe_subscription_id)
                if (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') {
                  console.log(`[DeleteInactiveUsers] Cancelling orphaned Stripe subscription ${userSub.stripe_subscription_id} for user ${user.email}`)
                  await stripe.subscriptions.cancel(userSub.stripe_subscription_id)
                  console.log(`[DeleteInactiveUsers] Stripe subscription cancelled for ${user.email}`)
                }
              } catch (stripeErr: any) {
                // Subscription may already be deleted — log but don't block
                console.log(`[DeleteInactiveUsers] Stripe sub cleanup skipped for ${user.email}: ${stripeErr.message}`)
              }
            }
          } catch (subLookupErr) {
            console.error(`[DeleteInactiveUsers] Error checking subscriptions for ${user.email}:`, subLookupErr)
          }
        }

        // Delete user data from public tables first (cascade should handle most)
        await supabase.from('usage_tracking').delete().eq('user_id', user.id)
        await supabase.from('email_sequences').delete().eq('user_id', user.id)
        await supabase.from('analytics_events').delete().eq('user_id', user.id)
        await supabase.from('rate_limits').delete().eq('identifier', user.id)

        // Delete CVs and sections
        const { data: cvs } = await supabase.from('cvs').select('id').eq('user_id', user.id)
        if (cvs && cvs.length > 0) {
          const cvIds = cvs.map(c => c.id)
          await supabase.from('cv_sections').delete().in('cv_id', cvIds)
          await supabase.from('cvs').delete().eq('user_id', user.id)
        }

        // Finally delete the auth user
        const { error: deleteErr } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteErr) throw deleteErr

        successCount++
        deletedEmails.push(user.email!)
        console.log(`[DeleteInactiveUsers] Deleted user: ${user.email}`)
      } catch (err) {
        failureCount++
        console.error(`[DeleteInactiveUsers] Failed to delete ${user.email}:`, err)
      }
      await new Promise(r => setTimeout(r, 200))
    }

    console.log(`[DeleteInactiveUsers] Done: ${successCount} deleted, ${failureCount} failed`)

    // ── Record deletion count for current month ──────────────────────────────
    if (successCount > 0) {
      try {
        const now2 = new Date()
        const currentMonth = `${now2.getUTCFullYear()}-${String(now2.getUTCMonth() + 1).padStart(2, '0')}`
        const { data: monthRow } = await supabase
          .from('user_growth_stats')
          .select('deletions')
          .eq('year_month', currentMonth)
          .maybeSingle()

        await supabase.from('user_growth_stats').upsert({
          year_month: currentMonth,
          deletions: (monthRow?.deletions || 0) + successCount,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'year_month' })
        console.log(`[DeleteInactiveUsers] Recorded ${successCount} deletions for ${currentMonth}`)
      } catch (statsErr) {
        console.error('[DeleteInactiveUsers] Failed to save deletion count:', statsErr)
      }
    }

    return NextResponse.json({
      success: true,
      deleted: successCount,
      failed: failureCount,
      total: targets.length,
    })
  } catch (error) {
    console.error('[DeleteInactiveUsers] Cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
