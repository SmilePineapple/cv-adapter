import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { sendReEngagementEmail } from '@/lib/email'

/**
 * Cron job to send re-engagement emails to inactive users
 * Runs daily at 10 AM
 * Targets free users who haven't been active in 7 days
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel cron jobs send this header)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createSupabaseRouteClient()
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    // Get free users who were last active 7 days ago
    const { data: inactiveUsers, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, last_activity_at')
      .lt('last_activity_at', sevenDaysAgo.toISOString())
      .is('subscription_tier', null) // Free users only
    
    if (error) {
      console.error('Error fetching inactive users:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!inactiveUsers || inactiveUsers.length === 0) {
      console.log('No inactive users found')
      return NextResponse.json({ 
        success: true, 
        message: 'No inactive users to email',
        count: 0 
      })
    }

    // Get usage data for these users
    const userIds = inactiveUsers.map(u => u.id)
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('user_id, lifetime_generation_count, max_lifetime_generations')
      .in('user_id', userIds)

    const usageMap = new Map(
      usageData?.map(u => [u.user_id, u]) || []
    )

    // Send re-engagement emails
    const emailPromises = inactiveUsers.map(async (user) => {
      const usage = usageMap.get(user.id)
      const remainingGenerations = (usage?.max_lifetime_generations || 2) - (usage?.lifetime_generation_count || 0)
      
      // Only email if they have remaining generations
      if (remainingGenerations > 0) {
        const name = user.full_name || user.email?.split('@')[0] || 'there'
        const daysInactive = Math.floor((Date.now() - new Date(user.last_activity_at).getTime()) / (24 * 60 * 60 * 1000))
        
        return sendReEngagementEmail(user.email, name, daysInactive, remainingGenerations)
      }
      return null
    })

    const results = await Promise.allSettled(emailPromises)
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value !== null).length
    const failureCount = results.filter(r => r.status === 'rejected').length

    console.log(`Re-engagement emails sent: ${successCount} success, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      total: inactiveUsers.length
    })
  } catch (error) {
    console.error('Re-engagement cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
