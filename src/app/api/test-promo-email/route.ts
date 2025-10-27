import { NextRequest, NextResponse } from 'next/server'
import { sendPromoEmail } from '@/lib/email'

/**
 * Test endpoint to send promo email to Jake
 * GET /api/test-promo-email
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Sending test promo email to Jake...')
    console.log('🔑 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
    console.log('📧 FROM_EMAIL:', process.env.RESEND_FROM_EMAIL)
    
    const result = await sendPromoEmail('jakepamdalerourke@gmail.com', 'Jake')
    
    console.log('📊 Send result:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test promo email sent successfully!',
        data: result.data
      })
    } else {
      console.error('❌ Send failed:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error,
        errorDetails: JSON.stringify(result.error)
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('💥 Test promo email exception:', error)
    console.error('💥 Error stack:', error?.stack)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to send test email',
      errorType: error?.constructor?.name,
      errorStack: error?.stack
    }, { status: 500 })
  }
}
