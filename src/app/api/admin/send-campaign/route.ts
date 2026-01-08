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

    // In test mode, just fetch the admin user directly
    let authUsers: any[] = []
    
    if (testMode) {
      console.log('Test mode: Fetching admin user directly...')
      const { data: adminAuthData } = await supabase.auth.admin.listUsers()
      const allUsers = adminAuthData?.users || []
      const adminUser = allUsers.find(u => u.email === 'jakedalerourke@gmail.com')
      
      if (adminUser) {
        authUsers = [adminUser]
        console.log('Found admin user for test mode')
      } else {
        console.log('Admin user not found, fetching all users to search...')
        // Fetch all pages to find admin
        let page = 1
        let hasMore = true
        while (hasMore && !adminUser) {
          const { data: pageData } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
          const users = pageData?.users || []
          const found = users.find(u => u.email === 'jakedalerourke@gmail.com')
          if (found) {
            authUsers = [found]
            break
          }
          hasMore = pageData && pageData.users.length === 1000
          page++
        }
      }
    } else {
      // Production mode: fetch all users with pagination
      console.log('Production mode: Fetching all users...')
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
        authUsers.push(...users)
        
        hasMore = users.length === 1000
        page++
      }
    }

    console.log(`Found ${authUsers.length} total auth users`)

    if (authUsers.length === 0) {
      return NextResponse.json(
        { error: testMode ? 'Admin user not found' : 'No users found in auth system' },
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
    console.log(`Sending campaign to ${users.length} users (test mode: ${testMode})`)

    const results = {
      total: users.length,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Send emails with 5-second delay between each
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      
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
        console.log(`✓ Sent to ${user.email} (${i + 1}/${users.length})`)

      } catch (error: unknown) {
        results.failed++
        const errorMsg = `Failed to send to ${user.email}: ${(error as Error).message}`
        results.errors.push(errorMsg)
        console.error(errorMsg)
      }

      // Wait 5 seconds before next email (rate limiting)
      if (i < users.length - 1) {
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
