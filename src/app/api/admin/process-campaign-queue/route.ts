import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

/**
 * Background worker to process email campaign queue
 * Processes emails in batches to avoid timeout
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Accept either admin user JWT or the cron secret
    const isCronRequest = token === process.env.CRON_SECRET
    if (!isCronRequest) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user || user.id !== ADMIN_USER_ID) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Initialize Resend client at runtime
    const resend = new Resend(process.env.RESEND_API_KEY!)

    const body = await request.json()
    const { campaignId } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
    }

    // Check daily send quota (80/day across all campaigns)
    const DAILY_LIMIT = 80
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { count: sentTodayCount } = await supabase
      .from('campaign_recipients')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', todayStart.toISOString())

    const sentToday = sentTodayCount || 0
    const remainingQuota = DAILY_LIMIT - sentToday

    console.log(`Daily quota: ${sentToday}/${DAILY_LIMIT} sent today, ${remainingQuota} remaining`)

    if (remainingQuota <= 0) {
      console.log('Daily send limit reached. Will resume tomorrow.')
      return NextResponse.json({
        success: true,
        message: `Daily limit of ${DAILY_LIMIT} reached. Campaign will continue tomorrow.`,
        processed: 0,
        dailyLimitReached: true
      })
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Update campaign status to processing
    if (campaign.status === 'queued') {
      await supabase
        .from('email_campaigns')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .eq('id', campaignId)
    }

    // Process up to remainingQuota emails (capped at 50 per run to avoid timeout)
    const BATCH_SIZE = Math.min(remainingQuota, 50)
    const { data: pendingRecipients } = await supabase
      .rpc('get_pending_recipients', { 
        p_campaign_id: campaignId, 
        p_batch_size: BATCH_SIZE 
      })

    if (!pendingRecipients || pendingRecipients.length === 0) {
      console.log(`No pending recipients for campaign ${campaignId}`)
      return NextResponse.json({
        success: true,
        message: 'No pending recipients',
        processed: 0
      })
    }

    console.log(`Processing ${pendingRecipients.length} recipients for campaign ${campaignId}`)

    let processed = 0
    let sent = 0
    let failed = 0

    // Send emails with 1-second delay
    for (const recipient of pendingRecipients) {
      try {
        // Personalize email
        const personalizedHtml = campaign.html_content
          .replace(/\{name\}/g, recipient.full_name || 'there')
          .replace(/\{email\}/g, recipient.email)

        await resend.emails.send({
          from: 'CV Adapter <updates@mycvbuddy.com>',
          to: recipient.email,
          subject: campaign.subject,
          html: personalizedHtml
        })

        // Mark as sent
        await supabase
          .from('campaign_recipients')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', recipient.id)

        sent++
        processed++
        console.log(`✓ Sent to ${recipient.email} (${processed}/${pendingRecipients.length})`)

      } catch (error: any) {
        // Mark as failed
        await supabase
          .from('campaign_recipients')
          .update({ 
            status: 'failed', 
            error_message: error.message 
          })
          .eq('id', recipient.id)

        failed++
        processed++
        console.error(`✗ Failed to send to ${recipient.email}: ${error.message}`)
      }

      // Wait 1 second before next email (rate limiting)
      if (processed < pendingRecipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Check if there are more pending recipients
    const { data: remainingRecipients } = await supabase
      .from('campaign_recipients')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .limit(1)

    const hasMore = remainingRecipients && remainingRecipients.length > 0

    // Recalculate how much quota remains after this batch
    const newSentToday = sentToday + sent
    const quotaExhausted = newSentToday >= DAILY_LIMIT

    if (hasMore && !quotaExhausted) {
      // Trigger next batch asynchronously (still within today's quota)
      console.log(`Triggering next batch for campaign ${campaignId}`)
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mycvbuddy.com'}/api/admin/process-campaign-queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ campaignId })
      }).catch(err => console.error('Error triggering next batch:', err))
    } else if (hasMore && quotaExhausted) {
      console.log(`Daily quota reached after this batch. Campaign ${campaignId} will continue tomorrow via cron.`)
    }

    // Mark campaign complete if no pending recipients remain
    if (!hasMore) {
      await supabase
        .from('email_campaigns')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', campaignId)
    }

    return NextResponse.json({
      success: true,
      processed,
      sent,
      failed,
      hasMore,
      dailyLimitReached: quotaExhausted,
      message: `Processed ${processed} recipients. ${!hasMore ? 'Campaign complete.' : quotaExhausted ? 'Daily limit reached — resumes tomorrow.' : 'More batches queued.'}`
    })

  } catch (error: any) {
    console.error('Queue processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
