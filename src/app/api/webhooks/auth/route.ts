import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * Webhook handler for Supabase Auth events
 * Triggers welcome email on user signup
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('x-supabase-signature')
    // TODO: Verify signature with SUPABASE_WEBHOOK_SECRET
    
    const { event, user } = payload
    
    console.log('Auth webhook received:', { event, userId: user?.id })
    
    // Handle user signup event
    if (event === 'user.created' || event === 'signup') {
      const email = user?.email
      const name = user?.user_metadata?.full_name || email?.split('@')[0] || 'there'
      
      if (email) {
        // Send welcome email asynchronously
        sendWelcomeEmail(email, name).catch(err => 
          console.error('Failed to send welcome email:', err)
        )
        
        console.log('Welcome email triggered for:', email)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
