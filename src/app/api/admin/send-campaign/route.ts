import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user || user.id !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { subject, htmlContent, testMode = false, excludeProUsers = false, excludedEmails = [] } = body

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Subject and htmlContent are required' },
        { status: 400 }
      )
    }

    // Fetch all users from auth.users (not profiles)
    console.log('Fetching users from auth.admin.listUsers()...')
    const { data: authData, error: usersError } = await supabase.auth.admin.listUsers()

    console.log('Auth data:', authData)
    console.log('Users error:', usersError)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json(
        { error: 'Failed to fetch users: ' + usersError.message },
        { status: 500 }
      )
    }

    const authUsers = authData?.users || []
    console.log(`Found ${authUsers.length} total auth users`)

    if (authUsers.length === 0) {
      return NextResponse.json(
        { error: 'No users found in auth system' },
        { status: 404 }
      )
    }

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

    // Map auth users to our format with filtering
    const users = authUsers
      .filter(u => {
        if (!u.email || !u.email_confirmed_at) return false
        // In test mode, don't apply filters - allow admin email through
        if (testMode) return true
        // Check if user has unsubscribed from emails
        if (u.user_metadata?.email_unsubscribed === true) return false
        if (excludeProUsers && proUserIds.has(u.id)) return false
        if (normalizedExcludedEmails.includes(u.email.toLowerCase())) return false
        return true
      })
      .map(u => ({
        email: u.email!,
        full_name: profilesMap.get(u.id) || null,
        user_id: u.id
      }))

    console.log(`Filtered to ${users.length} confirmed users (excludeProUsers: ${excludeProUsers}, excludedEmails: ${excludedEmails.length})`)

    // Test mode: only send to admin
    const recipients = testMode 
      ? users.filter(u => u.email === 'jakedalerourke@gmail.com')
      : users

    console.log(`Sending campaign to ${recipients.length} users (test mode: ${testMode})`)

    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Send emails with 5-second delay between each
    for (let i = 0; i < recipients.length; i++) {
      const user = recipients[i]
      
      try {
        // Personalize email
        const personalizedHtml = htmlContent
          .replace(/\{name\}/g, user.full_name || 'there')
          .replace(/\{email\}/g, user.email)

        await resend.emails.send({
          from: 'CV Adapter <updates@mycvbuddy.com>',
          to: user.email,
          subject: subject,
          html: personalizedHtml
        })

        results.sent++
        console.log(`✓ Sent to ${user.email} (${i + 1}/${recipients.length})`)

      } catch (error: unknown) {
        results.failed++
        const errorMsg = `Failed to send to ${user.email}: ${(error as Error).message}`
        results.errors.push(errorMsg)
        console.error(errorMsg)
      }

      // Wait 5 seconds before next email (rate limiting)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${results.sent}/${results.total} users`,
      results
    })

  } catch (error: unknown) {
    console.error('Campaign error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
