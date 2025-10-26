/**
 * Twitter API v2 Integration
 * Handles posting tweets using OAuth 1.0a
 */

import crypto from 'crypto'

interface TwitterConfig {
  api_key: string
  api_secret: string
  access_token: string
  access_token_secret: string
}

/**
 * Generate OAuth 1.0a signature for Twitter API
 */
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  // Sort parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&')

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`

  // Generate signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64')

  return signature
}

/**
 * Generate OAuth 1.0a authorization header
 */
function generateOAuthHeader(
  method: string,
  url: string,
  config: TwitterConfig,
  additionalParams: Record<string, string> = {}
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.api_key,
    oauth_token: config.access_token,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(32).toString('base64').replace(/\W/g, ''),
    oauth_version: '1.0'
  }

  // Combine OAuth params with additional params for signature
  const allParams = { ...oauthParams, ...additionalParams }

  // Generate signature
  const signature = generateOAuthSignature(
    method,
    url,
    allParams,
    config.api_secret,
    config.access_token_secret
  )

  oauthParams.oauth_signature = signature

  // Build authorization header
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ')

  return authHeader
}

/**
 * Post a tweet to Twitter using API v2
 */
export async function postTweet(
  content: string,
  config: TwitterConfig
): Promise<{ success: boolean; tweetId?: string; tweetUrl?: string; error?: string }> {
  try {
    console.log('Posting tweet with config:', {
      api_key: config.api_key?.substring(0, 10) + '...',
      access_token: config.access_token?.substring(0, 10) + '...',
      hasSecret: !!config.api_secret,
      hasTokenSecret: !!config.access_token_secret
    })
    
    // Use v1.1 API which works with Free tier
    const url = 'https://api.twitter.com/1.1/statuses/update.json'
    const method = 'POST'
    
    // URL encode the status
    const params = { status: content }

    // Generate OAuth header with status parameter
    const authHeader = generateOAuthHeader(method, url, config, params)

    // Post tweet using form data
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }
      console.error('Twitter API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return {
        success: false,
        error: errorData.detail || errorData.title || errorData.error || errorText || 'Failed to post tweet'
      }
    }

    const data = await response.json()
    const tweetId = data.id_str || data.id
    const username = data.user?.screen_name || 'JPicklejak5299'

    return {
      success: true,
      tweetId,
      tweetUrl: `https://twitter.com/${username}/status/${tweetId}`
    }

  } catch (error) {
    console.error('Error posting tweet:', error)
    return {
      success: false,
      error: String(error)
    }
  }
}

/**
 * Get tweet engagement metrics
 */
export async function getTweetMetrics(
  tweetId: string,
  config: TwitterConfig
): Promise<{ likes: number; retweets: number; replies: number; impressions: number } | null> {
  try {
    const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`
    const method = 'GET'

    const authHeader = generateOAuthHeader(method, url, config)

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      console.error('Failed to get tweet metrics')
      return null
    }

    const data = await response.json()
    const metrics = data.data?.public_metrics

    return {
      likes: metrics?.like_count || 0,
      retweets: metrics?.retweet_count || 0,
      replies: metrics?.reply_count || 0,
      impressions: metrics?.impression_count || 0
    }

  } catch (error) {
    console.error('Error getting tweet metrics:', error)
    return null
  }
}

/**
 * Verify Twitter credentials
 */
export async function verifyTwitterCredentials(
  config: TwitterConfig
): Promise<{ success: boolean; username?: string; error?: string }> {
  try {
    const url = 'https://api.twitter.com/2/users/me'
    const method = 'GET'

    const authHeader = generateOAuthHeader(method, url, config)

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.detail || 'Failed to verify credentials'
      }
    }

    const data = await response.json()
    return {
      success: true,
      username: data.data?.username
    }

  } catch (error) {
    return {
      success: false,
      error: String(error)
    }
  }
}
