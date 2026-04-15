import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

/**
 * Cron job: permanently delete inactive free users after 90 days (GDPR Article 5)
 * Only deletes users who:
 *   - Are free tier
 *   - Have been inactive for 90+ days
 *   - Were sent a deletion warning email 30 days ago
 * Runs daily at 8:30 AM UTC via cron-jobs.org
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = Date.now()
    const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString()

    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers()
    if (authErr) throw authErr

    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('user_id, plan_type, subscription_tier, last_generation_at')

    const usageMap = new Map((usageRows || []).map(u => [u.user_id, u]))

    // Only delete users who were warned (must have deletion_warning_30day record)
    const { data: warnedRows } = await supabase
      .from('email_sequences')
      .select('user_id, sent_at')
      .eq('sequence_step', 'deletion_warning_30day')

    // Build map: user_id -> warned_at date
    const warnedMap = new Map((warnedRows || []).map(r => [r.user_id, r.sent_at]))

    // Target: free users, inactive 90+ days, warned at least 25 days ago
    const twentyFiveDaysAgo = new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString()

    const targets = authData.users.filter(u => {
      if (!u.email || !u.created_at) return false
      const usage = usageMap.get(u.id)
      // Skip pro users — never delete paying customers
      if (usage?.plan_type === 'pro' || usage?.subscription_tier?.startsWith('pro')) return false
      // Must have been warned
      const warnedAt = warnedMap.get(u.id)
      if (!warnedAt || warnedAt > twentyFiveDaysAgo) return false
      // Must be inactive for 90+ days
      const lastActive = usage?.last_generation_at || u.last_sign_in_at || u.created_at
      return lastActive <= ninetyDaysAgo
    })

    console.log(`[DeleteInactiveUsers] ${targets.length} users targeted for deletion`)

    if (targets.length === 0) {
      return NextResponse.json({ success: true, message: 'No users to delete', count: 0 })
    }

    let successCount = 0
    let failureCount = 0
    const deletedEmails: string[] = []

    for (const user of targets) {
      try {
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
