import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

/**
 * Create a new email campaign and queue recipients
 * This replaces the old send-campaign endpoint for long-running campaigns
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
    const { subject, htmlContent, excludeProUsers = false, excludedEmails = [] } = body

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Subject and htmlContent are required' },
        { status: 400 }
      )
    }

    console.log('Creating campaign with filters:', { excludeProUsers, excludedEmails: excludedEmails.length })

    // Fetch ALL users with pagination
    let allUsers: any[] = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data: pageData, error: usersError } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      
      if (usersError) {
        console.error('Error fetching users:', usersError)
        return NextResponse.json(
          { error: 'Failed to fetch users: ' + usersError.message },
          { status: 500 }
        )
      }
      
      const users = pageData?.users || []
      allUsers.push(...users)
      
      hasMore = users.length === 1000
      page++
    }

    console.log(`Found ${allUsers.length} total auth users`)

    // Get profiles for full names
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')

    const profilesMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

    // Get Pro users if filtering is enabled
    let proUserIds = new Set<string>()
    if (excludeProUsers) {
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('user_id, subscription_tier')

      proUserIds = new Set(
        usageData
          ?.filter(u => u.subscription_tier === 'pro_monthly' || u.subscription_tier === 'pro_annual')
          .map(u => u.user_id) || []
      )
      console.log(`Found ${proUserIds.size} Pro users to exclude`)
    }

    // Normalize excluded emails to lowercase for comparison
    const normalizedExcludedEmails = excludedEmails.map((e: string) => e.toLowerCase())

    // Filter users
    const recipients = allUsers
      .filter(u => {
        if (!u.email || !u.email_confirmed_at) return false
        if (u.user_metadata?.email_unsubscribed === true) return false
        if (excludeProUsers && proUserIds.has(u.id)) return false
        if (normalizedExcludedEmails.includes(u.email.toLowerCase())) return false
        return true
      })
      .map(u => ({
        user_id: u.id,
        email: u.email!,
        full_name: profilesMap.get(u.id) || null
      }))

    console.log(`Filtered to ${recipients.length} eligible recipients`)

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No eligible recipients found' },
        { status: 400 }
      )
    }

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        created_by: user.id,
        subject,
        html_content: htmlContent,
        status: 'queued',
        total_recipients: recipients.length,
        exclude_pro_users: excludeProUsers,
        excluded_emails: excludedEmails
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error creating campaign:', campaignError)
      return NextResponse.json(
        { error: 'Failed to create campaign: ' + campaignError.message },
        { status: 500 }
      )
    }

    console.log(`Created campaign ${campaign.id}`)

    // Queue all recipients
    const recipientRecords = recipients.map(r => ({
      campaign_id: campaign.id,
      user_id: r.user_id,
      email: r.email,
      full_name: r.full_name,
      status: 'pending'
    }))

    const { error: recipientsError } = await supabase
      .from('campaign_recipients')
      .insert(recipientRecords)

    if (recipientsError) {
      console.error('Error queuing recipients:', recipientsError)
      // Mark campaign as failed
      await supabase
        .from('email_campaigns')
        .update({ status: 'failed', error_message: recipientsError.message })
        .eq('id', campaign.id)
      
      return NextResponse.json(
        { error: 'Failed to queue recipients: ' + recipientsError.message },
        { status: 500 }
      )
    }

    console.log(`Queued ${recipients.length} recipients for campaign ${campaign.id}`)

    // Trigger the worker to start processing (call it asynchronously)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mycvbuddy.com'}/api/admin/process-campaign-queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ campaignId: campaign.id })
    }).catch(err => console.error('Error triggering worker:', err))

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        status: campaign.status,
        total_recipients: campaign.total_recipients,
        sent_count: campaign.sent_count,
        failed_count: campaign.failed_count
      },
      message: `Campaign created and queued. Processing ${recipients.length} recipients in the background.`
    })

  } catch (error: any) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
