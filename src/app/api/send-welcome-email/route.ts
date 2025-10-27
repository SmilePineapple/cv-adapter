import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * Send welcome email to newly signed up user
 * Called from client after successful signup
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, name } = await request.json()
    
    // Verify the email matches the authenticated user
    if (email !== user.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 })
    }

    // Send welcome email
    const result = await sendWelcomeEmail(email, name || user.user_metadata?.full_name || 'there')
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Welcome email sent' })
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Send welcome email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
