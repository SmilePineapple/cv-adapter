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

    // Fetch all users from auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Count only confirmed emails
    const confirmedUsers = users?.filter(u => u.email && u.email_confirmed_at) || []

    return NextResponse.json({
      count: confirmedUsers.length,
      users: confirmedUsers.map(u => ({
        email: u.email,
        confirmed: !!u.email_confirmed_at
      }))
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
