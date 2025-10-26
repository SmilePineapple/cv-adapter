import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * LinkedIn OAuth - Step 1: Redirect to LinkedIn for authorization
 * GET /api/linkedin/auth
 */
export async function GET(request: NextRequest) {
  try {
    // Get LinkedIn credentials from database
    const { data: config } = await supabase
      .from('social_media_config')
      .select('api_key, api_secret')
      .eq('platform', 'linkedin')
      .single()

    if (!config?.api_key || !config?.api_secret) {
      return NextResponse.json(
        { error: 'LinkedIn API credentials not configured' },
        { status: 400 }
      )
    }

    // LinkedIn OAuth URLs
    const authUrl = 'https://www.linkedin.com/oauth/v2/authorization'
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`
    const scope = 'w_member_social r_liteprofile r_emailaddress'
    const state = crypto.randomUUID() // CSRF protection

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.api_key,
      redirect_uri: redirectUri,
      scope: scope,
      state: state
    })

    const linkedInAuthUrl = `${authUrl}?${params.toString()}`

    // Store state in session/cookie for verification (optional but recommended)
    // For now, we'll just redirect
    return NextResponse.redirect(linkedInAuthUrl)

  } catch (error) {
    console.error('LinkedIn auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate LinkedIn authorization' },
      { status: 500 }
    )
  }
}
