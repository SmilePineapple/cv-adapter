import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const resend = new Resend(process.env.RESEND_API_KEY!)
const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

/**
 * Background worker to process email campaign queue
 * Processes emails in batches to avoid timeout
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user || user.id !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { campaignId } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
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

    // Process in batches of 50 to avoid timeout (50 emails * 1 second = 50 seconds)
    const BATCH_SIZE = 50
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

    if (hasMore) {
      // Trigger next batch asynchronously
      console.log(`Triggering next batch for campaign ${campaignId}`)
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mycvbuddy.com'}/api/admin/process-campaign-queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ campaignId })
      }).catch(err => console.error('Error triggering next batch:', err))
    }

    return NextResponse.json({
      success: true,
      processed,
      sent,
      failed,
      hasMore,
      message: `Processed ${processed} recipients. ${hasMore ? 'More batches queued.' : 'Campaign complete.'}`
    })

  } catch (error: any) {
    console.error('Queue processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
