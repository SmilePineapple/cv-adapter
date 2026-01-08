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

export async function GET(request: NextRequest) {
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

    // Fetch all users
    const { data: authData, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Filter users who have unsubscribed
    const unsubscribedUsers = authData.users
      .filter(u => u.user_metadata?.email_unsubscribed === true)
      .map(u => ({
        email: u.email || 'Unknown',
        unsubscribed_at: u.user_metadata?.unsubscribed_at || 'Unknown'
      }))
      .sort((a, b) => {
        // Sort by most recent first
        if (a.unsubscribed_at === 'Unknown') return 1
        if (b.unsubscribed_at === 'Unknown') return -1
        return new Date(b.unsubscribed_at).getTime() - new Date(a.unsubscribed_at).getTime()
      })

    return NextResponse.json({
      success: true,
      count: unsubscribedUsers.length,
      users: unsubscribedUsers
    })

  } catch (error: any) {
    console.error('Error fetching unsubscribed users:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}
