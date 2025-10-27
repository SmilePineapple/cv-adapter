import { NextRequest, NextResponse } from 'next/server'
import { sendPromoEmail } from '@/lib/email'

/**
 * Test endpoint to send promo email to Jake
 * GET /api/test-promo-email
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Sending test promo email to Jake...')
    
    const result = await sendPromoEmail('jakepamdalerourke@gmail.com', 'Jake')
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test promo email sent successfully!',
        data: result.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test promo email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email'
    }, { status: 500 })
  }
}
