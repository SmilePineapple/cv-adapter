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
 * RFC 3986 percent encoding (required by Twitter OAuth)
 * Different from encodeURIComponent - encodes more characters
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
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
  // Sort parameters and encode using RFC 3986 (Twitter requirement)
  // Each key and value must be percent encoded separately, then joined with =
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&')

  // Create signature base string
  // Method, URL, and parameter string must all be percent encoded
  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams)
  ].join('&')

  // Create signing key (secrets must be percent encoded)
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`

  console.log('[OAuth Signature Debug]', {
    method,
    url,
    paramCount: Object.keys(params).length,
    sortedParamsPreview: sortedParams.substring(0, 200) + '...',
    signatureBasePreview: signatureBaseString.substring(0, 200) + '...',
    signingKeyLength: signingKey.length
  })

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

  // Build authorization header using RFC 3986 encoding
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`)
    .join(', ')

  return authHeader
}

/**
 * Post a tweet to Twitter using API v2 with retry logic
 * v2 API is available on Free tier (1,500 tweets/month)
 * Implements exponential backoff for 503 errors (Twitter API instability)
 */
export async function postTweet(
  content: string,
  config: TwitterConfig
): Promise<{ success: boolean; tweetId?: string; tweetUrl?: string; error?: string }> {
  const MAX_RETRIES = 3
  const INITIAL_DELAY = 2000 // 2 seconds
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[Twitter POST] Retry attempt ${attempt}/${MAX_RETRIES}`)
      } else {
        console.log('[Twitter POST] Starting tweet post with config:', {
          api_key: config.api_key?.substring(0, 10) + '...',
          api_key_length: config.api_key?.length,
          access_token: config.access_token?.substring(0, 25) + '...',
          access_token_length: config.access_token?.length,
          api_secret_length: config.api_secret?.length,
          token_secret_length: config.access_token_secret?.length,
          content_length: content.length
        })
      }
      
      // Use v2 API which works with Free tier (1,500 tweets/month)
      const url = 'https://api.twitter.com/2/tweets'
      const method = 'POST'
      
      // v2 uses JSON body, not form parameters
      const body = JSON.stringify({ text: content })

      // Generate OAuth header WITHOUT body params (v2 uses JSON body)
      const authHeader = generateOAuthHeader(method, url, config)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body
      })

      // Handle 503 Service Unavailable with retry
      if (response.status === 503 && attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1)
        console.warn(`[Twitter POST] 503 Service Unavailable. Retrying in ${delay}ms... (attempt ${attempt}/${MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue // Retry
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        console.error('[Twitter POST] API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          attempt: `${attempt}/${MAX_RETRIES}`,
          requestUrl: url,
          requestMethod: method
        })
        
        // If this was the last attempt or not a retryable error, return failure
        if (attempt === MAX_RETRIES || response.status !== 503) {
          return {
            success: false,
            error: JSON.stringify(errorData)
          }
        }
      } else {
        // Success!
        const data = await response.json()
        // v2 API returns { data: { id, text } }
        const tweetId = data.data?.id || data.id
        const username = 'JPicklejak5299' // v2 doesn't return username in response

        console.log('[Twitter POST] Tweet posted successfully:', {
          tweetId,
          attempt: attempt > 1 ? `${attempt}/${MAX_RETRIES}` : '1/1',
          response: data
        })

        return {
          success: true,
          tweetId,
          tweetUrl: `https://twitter.com/${username}/status/${tweetId}`
        }
      }

    } catch (error) {
      console.error(`[Twitter POST] Error on attempt ${attempt}/${MAX_RETRIES}:`, error)
      
      // If this was the last attempt, return failure
      if (attempt === MAX_RETRIES) {
        return {
          success: false,
          error: String(error)
        }
      }
      
      // Otherwise, wait and retry
      const delay = INITIAL_DELAY * Math.pow(2, attempt - 1)
      console.log(`[Twitter POST] Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // Should never reach here, but just in case
  return {
    success: false,
    error: 'Max retries exceeded'
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
 * Verify Twitter credentials using v1.1 API
 */
export async function verifyTwitterCredentials(
  config: TwitterConfig
): Promise<{ success: boolean; username?: string; error?: string }> {
  try {
    // Use v1.1 API which works with Free tier (no Project required)
    const url = 'https://api.twitter.com/1.1/account/verify_credentials.json'
    const method = 'GET'

    const authHeader = generateOAuthHeader(method, url, config)

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }
      return {
        success: false,
        error: JSON.stringify(errorData)
      }
    }

    const data = await response.json()
    return {
      success: true,
      username: data.screen_name
    }

  } catch (error) {
    return {
      success: false,
      error: String(error)
    }
  }
}
