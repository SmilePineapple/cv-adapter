import { NextResponse } from 'next/server'
import { postTweet } from '@/lib/twitter-api-v2'

/**
 * Test posting a tweet directly
 * GET /api/social-bot/test-post
 */
export async function GET() {
  try {
    const config = {
      api_key: process.env.TWITTER_API_KEY!,
      api_secret: process.env.TWITTER_API_SECRET!,
      access_token: process.env.TWITTER_ACCESS_TOKEN!,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    }

    console.log('Testing tweet post with config:', {
      api_key: config.api_key?.substring(0, 10) + '...',
      access_token: config.access_token?.substring(0, 15) + '...',
    })

    const testContent = '🧪 Test tweet from CV Adapter social bot! If you see this, automated posting is working! 🚀 #TestTweet'

    console.log('Attempting to post test tweet...')
    const result = await postTweet(testContent, config)

    if (result.success) {
      console.log('✅ Test tweet posted successfully!')
      return NextResponse.json({
        success: true,
        message: 'Test tweet posted successfully!',
        tweetId: result.tweetId,
        tweetUrl: result.tweetUrl
      })
    } else {
      console.error('❌ Failed to post test tweet:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Fatal error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || String(error)
      },
      { status: 500 }
    )
  }
}
