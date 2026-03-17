import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { postTweet, verifyTwitterCredentials } from '@/lib/twitter-api'

/**
 * Test API Route: Test Twitter posting
 * GET /api/social-bot/test?action=verify
 * GET /api/social-bot/test?action=post
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'verify'

    // Get Twitter config from database
    const { data: config, error } = await supabase
      .from('social_media_config')
      .select('*')
      .eq('platform', 'twitter')
      .single()

    if (error || !config) {
      return NextResponse.json(
        { error: 'Twitter configuration not found' },
        { status: 404 }
      )
    }

    if (!config.api_key || !config.access_token) {
      return NextResponse.json(
        { error: 'Twitter API credentials not configured' },
        { status: 400 }
      )
    }

    const twitterConfig = {
      api_key: config.api_key,
      api_secret: config.api_secret,
      access_token: config.access_token,
      access_token_secret: config.access_token_secret
    }

    // Debug: Log credential lengths (not actual values)
    console.log('[Twitter Test] Credential check:', {
      api_key_length: twitterConfig.api_key?.length,
      api_secret_length: twitterConfig.api_secret?.length,
      access_token_length: twitterConfig.access_token?.length,
      access_token_secret_length: twitterConfig.access_token_secret?.length,
      api_key_preview: twitterConfig.api_key?.substring(0, 10) + '...',
      access_token_preview: twitterConfig.access_token?.substring(0, 25) + '...'
    })

    if (action === 'verify') {
      // Verify credentials
      const result = await verifyTwitterCredentials(twitterConfig)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Twitter credentials verified!',
          username: result.username
        })
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 401 }
        )
      }
    }

    if (action === 'post') {
      // Post test tweet
      const testContent = `🤖 Test tweet from CV Adapter Social Bot!

This is an automated test to verify the bot is working correctly.

Generated at: ${new Date().toLocaleString('en-GB')}

#CVAdapter #TestTweet`

      const result = await postTweet(testContent, twitterConfig)

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Test tweet posted successfully!',
          tweetId: result.tweetId,
          tweetUrl: result.tweetUrl
        })
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=verify or ?action=post' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
