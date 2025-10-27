import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/email'

/**
 * Simple test endpoint to verify Resend is working
 * GET /api/test-simple-email
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Sending simple test email...')
    
    const result = await sendTestEmail('jakepamdalerourke@gmail.com')
    
    console.log('📊 Result:', result)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Simple test email sent successfully!',
        data: result.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        errorString: JSON.stringify(result.error, null, 2)
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('💥 Exception:', error)
    return NextResponse.json({
      success: false,
      error: error?.message,
      stack: error?.stack
    }, { status: 500 })
  }
}
