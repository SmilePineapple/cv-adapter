import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { send3DayReminderEmail } from '@/lib/email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Cron job to send 3-day reminder emails to users who haven't generated a CV yet
 * This should be called by Vercel Cron or similar scheduler
 * 
 * Schedule: Daily at 10:00 AM UTC
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Starting 3-day reminder email job...')

    // Calculate date 3 days ago
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const threeDaysAgoISO = threeDaysAgo.toISOString()

    // Find users who:
    // 1. Registered exactly 3 days ago (within a 24-hour window)
    // 2. Haven't generated any CVs yet (lifetime_generation_count = 0)
    // 3. Are on free tier
    // 4. Haven't unsubscribed
    
    const fourDaysAgo = new Date()
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
    const fourDaysAgoISO = fourDaysAgo.toISOString()

    const { data: users, error: usersError } = await supabase
      .from('usage_tracking')
      .select(`
        user_id,
        lifetime_generation_count,
        plan_type,
        created_at
      `)
      .eq('lifetime_generation_count', 0)
      .eq('plan_type', 'free')
      .gte('created_at', fourDaysAgoISO)
      .lte('created_at', threeDaysAgoISO)

    if (usersError) {
      console.error('[Cron] Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    if (!users || users.length === 0) {
      console.log('[Cron] No users found to send reminder emails')
      return NextResponse.json({ 
        success: true, 
        message: 'No users to email',
        count: 0 
      })
    }

    console.log(`[Cron] Found ${users.length} users to email`)

    // Get user details from auth.users
    const userIds = users.map(u => u.user_id)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('[Cron] Error fetching auth users:', authError)
      return NextResponse.json({ error: 'Failed to fetch auth users' }, { status: 500 })
    }

    // Filter to only users we need and exclude unsubscribed users
    const targetUsers = authUsers.users.filter(u => {
      const isTargetUser = userIds.includes(u.id)
      const isUnsubscribed = u.user_metadata?.email_unsubscribed === true
      return isTargetUser && !isUnsubscribed
    })

    console.log(`[Cron] After filtering unsubscribed: ${targetUsers.length} users to email`)

    // Send emails
    const results = []
    for (const user of targetUsers) {
      const email = user.email
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'there'

      console.log(`[Cron] Sending reminder email to ${email}`)

      const result = await send3DayReminderEmail(email, name)
      results.push({
        email,
        success: result.success,
        error: result.error || null
      })

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    console.log(`[Cron] Reminder emails sent: ${successCount} success, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} emails, ${failureCount} failed`,
      totalUsers: users.length,
      successCount,
      failureCount,
      results
    })

  } catch (error: unknown) {
    console.error('[Cron] Error in reminder email job:', error)
    return NextResponse.json({ 
      error: (error as Error).message || 'Internal server error' 
    }, { status: 500 })
  }
}
