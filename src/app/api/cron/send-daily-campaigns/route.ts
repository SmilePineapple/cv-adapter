import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

/**
 * Cron job: resume any in-progress or queued email campaigns
 * Runs daily at 9:00 AM UTC
 * Sends up to 80 emails per day across all active campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    console.log('[DailyCampaignCron] Starting daily campaign send job...')

    // Find all campaigns that are still queued or processing (have pending recipients)
    const { data: activeCampaigns, error } = await supabase
      .from('email_campaigns')
      .select('id, subject, status, total_recipients, sent_count')
      .in('status', ['queued', 'processing'])
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[DailyCampaignCron] Error fetching campaigns:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    if (!activeCampaigns || activeCampaigns.length === 0) {
      console.log('[DailyCampaignCron] No active campaigns to process')
      return NextResponse.json({ success: true, message: 'No active campaigns', processed: 0 })
    }

    console.log(`[DailyCampaignCron] Found ${activeCampaigns.length} active campaign(s)`)

    const results = []

    for (const campaign of activeCampaigns) {
      // Check if this campaign still has pending recipients
      const { count: pendingCount } = await supabase
        .from('campaign_recipients')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id)
        .eq('status', 'pending')

      if (!pendingCount || pendingCount === 0) {
        // Mark complete if nothing pending
        await supabase
          .from('email_campaigns')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', campaign.id)
        console.log(`[DailyCampaignCron] Campaign ${campaign.id} already complete, marked done`)
        continue
      }

      console.log(`[DailyCampaignCron] Resuming campaign ${campaign.id} (${pendingCount} pending)`)

      // Trigger the process-campaign-queue worker using internal service token
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mycvbuddy.com'
      const response = await fetch(`${siteUrl}/api/admin/process-campaign-queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        },
        body: JSON.stringify({ campaignId: campaign.id })
      })

      const data = await response.json()
      results.push({ campaignId: campaign.id, ...data })

      // If daily limit reached, stop processing further campaigns today
      if (data.dailyLimitReached) {
        console.log('[DailyCampaignCron] Daily limit reached, stopping for today')
        break
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${activeCampaigns.length} campaign(s)`,
      results
    })

  } catch (error: any) {
    console.error('[DailyCampaignCron] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
