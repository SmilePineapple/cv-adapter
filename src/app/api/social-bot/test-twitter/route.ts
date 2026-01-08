import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

/**
 * Test Twitter API with detailed error logging
 * GET /api/social-bot/test-twitter
 */
export async function GET() {
  try {
    const config = {
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    }

    console.log('Testing Twitter API with config:', {
      appKey: config.appKey?.substring(0, 10) + '...',
      appKey_length: config.appKey?.length,
      appSecret_length: config.appSecret?.length,
      accessToken: config.accessToken?.substring(0, 10) + '...',
      accessToken_length: config.accessToken?.length,
      accessSecret_length: config.accessSecret?.length,
    })

    // Test 1: Create client
    console.log('Test 1: Creating Twitter client...')
    const client = new TwitterApi(config)
    console.log('✅ Client created')

    // Test 2: Get authenticated user
    console.log('Test 2: Getting authenticated user...')
    try {
      const user = await client.v2.me()
      console.log('✅ User retrieved:', user.data.username)
      
      return NextResponse.json({
        success: true,
        test: 'verify_credentials',
        username: user.data.username,
        user_id: user.data.id
      })
    } catch (error: any) {
      console.error('❌ Failed to get user:', error)
      
      // Try v1.1 API instead
      console.log('Test 3: Trying v1.1 API...')
      try {
        const v1Client = client.v1
        const v1User = await v1Client.verifyCredentials()
        console.log('✅ v1.1 worked:', v1User.screen_name)
        
        return NextResponse.json({
          success: true,
          test: 'v1.1_verify_credentials',
          username: v1User.screen_name,
          user_id: v1User.id_str,
          note: 'v2 failed but v1.1 worked'
        })
      } catch (v1Error: any) {
        console.error('❌ v1.1 also failed:', v1Error)
        
        return NextResponse.json({
          success: false,
          error: {
            v2_error: error.message || String(error),
            v1_error: v1Error.message || String(v1Error),
            v2_code: error.code,
            v1_code: v1Error.code,
            v2_data: error.data,
            v1_data: v1Error.data
          }
        }, { status: 401 })
      }
    }
  } catch (error: any) {
    console.error('Fatal error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
