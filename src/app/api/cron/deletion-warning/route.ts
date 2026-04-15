import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendDeletionWarningEmail } from '@/lib/email'

/**
 * Cron job: send 30-day deletion warning to inactive free users (GDPR)
 * Targets users inactive for 60 days (30 days before the 90-day deletion threshold)
 * Runs daily at 8 AM UTC via cron-jobs.org
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const now = Date.now()

    // Target: inactive for 60-70 days (warn them 30 days before deletion at 90 days)
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString()
    const seventyDaysAgo = new Date(now - 70 * 24 * 60 * 60 * 1000).toISOString()

    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers()
    if (authErr) throw authErr

    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('user_id, plan_type, subscription_tier, last_generation_at')

    const usageMap = new Map((usageRows || []).map(u => [u.user_id, u]))

    // Check who has already been warned (use email_sequences table)
    const { data: alreadyWarned } = await supabase
      .from('email_sequences')
      .select('user_id, sequence_step')
      .eq('sequence_step', 'deletion_warning_30day')

    const warnedSet = new Set((alreadyWarned || []).map(r => r.user_id))

    // Target: free users inactive 60-70 days, not yet warned
    const targets = authData.users.filter(u => {
      if (!u.email || !u.created_at) return false
      const usage = usageMap.get(u.id)
      // Skip pro users
      if (usage?.plan_type === 'pro' || usage?.subscription_tier?.startsWith('pro')) return false
      // Skip already warned
      if (warnedSet.has(u.id)) return false
      // Check inactivity window (60-70 days ago)
      const lastActive = usage?.last_generation_at || u.last_sign_in_at || u.created_at
      return lastActive <= sixtyDaysAgo && lastActive > seventyDaysAgo
    })

    console.log(`[DeletionWarning] ${targets.length} users targeted for warning`)

    if (targets.length === 0) {
      return NextResponse.json({ success: true, message: 'No users to warn', count: 0 })
    }

    let successCount = 0
    let failureCount = 0

    for (const user of targets) {
      const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0]
      // Deletion date = 30 days from now
      const deletionDate = new Date(now + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })

      const result = await sendDeletionWarningEmail(user.email!, name, deletionDate)
      if (result.success) {
        successCount++
        await supabase.from('email_sequences').upsert(
          { user_id: user.id, sequence_step: 'deletion_warning_30day', email: user.email!, sent_at: new Date().toISOString() },
          { onConflict: 'user_id,sequence_step' }
        )
      } else {
        failureCount++
        console.error(`[DeletionWarning] Failed for ${user.email}:`, result.error)
      }
      await new Promise(r => setTimeout(r, 100))
    }

    console.log(`[DeletionWarning] Done: ${successCount} warned, ${failureCount} failed`)

    return NextResponse.json({ success: true, warned: successCount, failed: failureCount, total: targets.length })
  } catch (error) {
    console.error('[DeletionWarning] Cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
