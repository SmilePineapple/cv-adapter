import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

export async function GET(request: NextRequest) {
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

    // Fetch ALL users with pagination (not just first 50)
    console.log('Fetching all users with pagination...')
    let allUsers: any[] = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data: pageData, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      
      if (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ 
          error: 'Failed to fetch users: ' + error.message 
        }, { status: 500 })
      }
      
      const users = pageData?.users || []
      allUsers.push(...users)
      
      hasMore = users.length === 1000
      page++
    }

    console.log(`Found ${allUsers.length} total users`)

    // Get Pro users to exclude
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('user_id, subscription_tier')

    const proUserIds = new Set(
      usageData
        ?.filter(u => u.subscription_tier === 'pro_monthly' || u.subscription_tier === 'pro_annual')
        .map(u => u.user_id) || []
    )

    console.log(`Found ${proUserIds.size} Pro users`)

    // Filter: confirmed emails, not Pro, not unsubscribed
    const eligibleUsers = allUsers.filter(u => {
      if (!u.email || !u.email_confirmed_at) return false
      if (u.user_metadata?.email_unsubscribed === true) return false
      if (proUserIds.has(u.id)) return false
      return true
    })

    console.log(`Filtered to ${eligibleUsers.length} eligible users (excluding Pro & unsubscribed)`)

    return NextResponse.json({
      count: eligibleUsers.length,
      total: allUsers.length,
      proUsers: proUserIds.size,
      unsubscribed: allUsers.filter(u => u.user_metadata?.email_unsubscribed === true).length
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
