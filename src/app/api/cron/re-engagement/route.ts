import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendReEngagementEmail } from '@/lib/email'

/**
 * Cron job to send re-engagement emails to inactive users
 * Runs daily at 10 AM UTC via cron-jobs.org
 * Targets free users who haven't been active in 7 days
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = Date.now()
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Get all auth users
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers()
    if (authErr) throw authErr

    // Get usage_tracking for all users
    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('user_id, lifetime_generation_count, max_lifetime_generations, plan_type, subscription_tier, last_generation_at')

    const usageMap = new Map((usageRows || []).map(u => [u.user_id, u]))

    // Get already-sent re-engagement records to avoid duplicates
    const { data: alreadySent } = await supabase
      .from('email_sequences')
      .select('user_id, sequence_step')

    const sentSet = new Set((alreadySent || []).map(r => `${r.user_id}::${r.sequence_step}`))

    // Target: free users, signed up >7 days ago, last active >7 days ago, not unsubscribed
    const targets = authData.users.filter(u => {
      if (!u.email || !u.created_at) return false
      if (u.user_metadata?.email_unsubscribed === true) return false
      const usage = usageMap.get(u.id)
      // Skip pro users
      if (usage?.plan_type === 'pro' || usage?.subscription_tier?.startsWith('pro')) return false
      // Skip if already sent re-engagement recently
      if (sentSet.has(`${u.id}::re_engagement_7day`)) return false
      // Must have been active at some point but not recently
      const lastActive = usage?.last_generation_at || u.created_at
      return lastActive < sevenDaysAgo
    })

    console.log(`[ReEngagement] ${targets.length} users targeted`)

    if (targets.length === 0) {
      return NextResponse.json({ success: true, message: 'No inactive users to email', count: 0 })
    }

    let successCount = 0
    let failureCount = 0

    for (const user of targets) {
      const usage = usageMap.get(user.id)
      const remainingGenerations = (usage?.max_lifetime_generations || 2) - (usage?.lifetime_generation_count || 0)
      if (remainingGenerations <= 0) continue

      const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0] || 'there'
      const lastActive = usage?.last_generation_at || user.created_at!
      const daysInactive = Math.floor((now - new Date(lastActive).getTime()) / (24 * 60 * 60 * 1000))

      const result = await sendReEngagementEmail(user.email!, name, daysInactive, remainingGenerations)
      if (result.success) {
        successCount++
        await supabase.from('email_sequences').upsert(
          { user_id: user.id, sequence_step: 're_engagement_7day', email: user.email!, sent_at: new Date().toISOString() },
          { onConflict: 'user_id,sequence_step' }
        )
      } else {
        failureCount++
        console.error(`[ReEngagement] Failed for ${user.email}:`, result.error)
      }
      await new Promise(r => setTimeout(r, 100))
    }

    console.log(`[ReEngagement] Done: ${successCount} sent, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      total: targets.length
    })
  } catch (error) {
    console.error('Re-engagement cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
