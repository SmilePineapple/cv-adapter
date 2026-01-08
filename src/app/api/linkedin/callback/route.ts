import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * LinkedIn OAuth - Step 2: Handle callback and exchange code for access token
 * GET /api/linkedin/callback?code=xxx&state=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Check for errors from LinkedIn
    if (error) {
      console.error('LinkedIn OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        `https://www.mycvbuddy.com/admin/social-bot?error=${encodeURIComponent(errorDescription || error)}`
      )
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      )
    }

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

    // Exchange authorization code for access token
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken'
    const redirectUri = 'https://www.mycvbuddy.com/api/linkedin/callback'

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: config.api_key,
      client_secret: config.api_secret,
      redirect_uri: redirectUri
    })

    console.log('Exchanging code for access token...')
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenParams.toString()
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(
        `https://www.mycvbuddy.com/admin/social-bot?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    console.log('Access token received!')

    // Store access token in database
    const { error: updateError } = await supabase
      .from('social_media_config')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        token_expires_at: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString()
      })
      .eq('platform', 'linkedin')

    if (updateError) {
      console.error('Failed to store access token:', updateError)
      return NextResponse.redirect(
        `https://www.mycvbuddy.com/admin/social-bot?error=failed_to_store_token`
      )
    }

    console.log('✅ LinkedIn access token stored successfully!')

    // Redirect back to admin page with success message
    return NextResponse.redirect(
      `https://www.mycvbuddy.com/admin/social-bot?linkedin_connected=true`
    )

  } catch (error) {
    console.error('LinkedIn callback error:', error)
    return NextResponse.redirect(
      `https://www.mycvbuddy.com/admin/social-bot?error=callback_failed`
    )
  }
}
