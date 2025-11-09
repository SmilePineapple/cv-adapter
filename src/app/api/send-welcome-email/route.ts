import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * Send welcome email to newly signed up user
 * Called from client after successful signup
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Send welcome email
    const result = await sendWelcomeEmail(email, name || 'there')
    
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
