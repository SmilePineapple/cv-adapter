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

/**
 * Handle email unsubscribe requests
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email
    const { data: authData } = await supabase.auth.admin.listUsers()
    const user = authData.users.find(u => u.email === email)

    if (!user) {
      // Don't reveal if email exists or not for privacy
      return NextResponse.json({ 
        success: true, 
        message: 'If this email is in our system, it has been unsubscribed' 
      })
    }

    // Update user metadata to mark as unsubscribed
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          email_unsubscribed: true,
          unsubscribed_at: new Date().toISOString()
        }
      }
    )

    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }

    console.log(`User ${email} unsubscribed from emails`)

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed from promotional emails' 
    })

  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}
