import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * Webhook handler for Supabase Auth events
 * Triggers welcome email on user signup
 */

function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const expectedBuf = Buffer.from(expected, 'hex')
  const providedBuf = Buffer.from(signature, 'hex')
  if (expectedBuf.length !== providedBuf.length) return false
  return timingSafeEqual(expectedBuf, providedBuf)
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-supabase-signature')
    const secret = process.env.SUPABASE_WEBHOOK_SECRET

    if (!secret) {
      console.error('Auth webhook rejected: SUPABASE_WEBHOOK_SECRET is not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    if (!isValidSignature(rawBody, signature, secret)) {
      console.error('Auth webhook rejected: invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
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
