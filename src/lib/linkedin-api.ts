/**
 * LinkedIn API Client
 * Handles OAuth authentication and posting to LinkedIn
 */

interface LinkedInConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface LinkedInTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  refresh_token_expires_in?: number
}

interface LinkedInPostResponse {
  id: string
  activity: string
}

/**
 * Get LinkedIn OAuth authorization URL
 */
export function getLinkedInAuthUrl(config: LinkedInConfig, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state: state,
    scope: 'w_member_social openid profile email'
  })

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function getLinkedInAccessToken(
  config: LinkedInConfig,
  code: string
): Promise<LinkedInTokenResponse> {
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn token exchange failed: ${error}`)
  }

  return response.json()
}

/**
 * Get LinkedIn user profile (to get person URN)
 */
export async function getLinkedInProfile(accessToken: string): Promise<any> {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn profile fetch failed: ${error}`)
  }

  return response.json()
}

/**
 * Post to LinkedIn using Share API
 */
export async function postToLinkedIn(
  accessToken: string,
  personUrn: string,
  content: string
): Promise<LinkedInPostResponse> {
  const postData = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content
        },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(postData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn post failed: ${error}`)
  }

  return response.json()
}

/**
 * Verify LinkedIn credentials
 */
export async function verifyLinkedInCredentials(
  clientId: string,
  clientSecret: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // For now, just check if credentials are present
    // Full verification requires OAuth flow
    if (!clientId || !clientSecret) {
      return { valid: false, error: 'Missing credentials' }
    }

    return { valid: true }
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
