import { NextResponse } from 'next/server'
import { verifyTwitterCredentials } from '@/lib/twitter-api-v2'

/**
 * Verify Twitter API credentials
 * GET /api/social-bot/verify-twitter
 */
export async function GET() {
  try {
    const config = {
      api_key: process.env.TWITTER_API_KEY!,
      api_secret: process.env.TWITTER_API_SECRET!,
      access_token: process.env.TWITTER_ACCESS_TOKEN!,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
    }

    console.log('Verifying Twitter credentials:', {
      api_key: config.api_key?.substring(0, 10) + '...',
      api_key_length: config.api_key?.length,
      api_secret_length: config.api_secret?.length,
      access_token: config.access_token?.substring(0, 10) + '...',
      access_token_length: config.access_token?.length,
      access_token_secret_length: config.access_token_secret?.length
    })

    const result = await verifyTwitterCredentials(config)

    return NextResponse.json({
      success: result.success,
      username: result.username,
      error: result.error,
      credentials: {
        api_key_present: !!config.api_key,
        api_key_prefix: config.api_key?.substring(0, 10),
        api_secret_present: !!config.api_secret,
        access_token_present: !!config.access_token,
        access_token_prefix: config.access_token?.substring(0, 10),
        access_token_secret_present: !!config.access_token_secret
      }
    })
  } catch (error) {
    console.error('Error verifying Twitter credentials:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
