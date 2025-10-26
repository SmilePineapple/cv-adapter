/**
 * Twitter API Integration using twitter-api-v2 library
 * This library handles OAuth 1.0a correctly
 */

import { TwitterApi } from 'twitter-api-v2'

interface TwitterConfig {
  api_key: string
  api_secret: string
  access_token: string
  access_token_secret: string
}

/**
 * Create Twitter client
 */
function createTwitterClient(config: TwitterConfig) {
  return new TwitterApi({
    appKey: config.api_key,
    appSecret: config.api_secret,
    accessToken: config.access_token,
    accessSecret: config.access_token_secret,
  })
}

/**
 * Post a tweet to Twitter
 */
export async function postTweet(
  content: string,
  config: TwitterConfig
): Promise<{ success: boolean; tweetId?: string; tweetUrl?: string; error?: string }> {
  try {
    console.log('Posting tweet with twitter-api-v2 library')
    console.log('Content length:', content.length)
    
    const client = createTwitterClient(config)
    
    // Post the tweet
    const tweet = await client.v2.tweet(content)
    
    console.log('✅ Tweet posted successfully:', tweet.data.id)
    
    return {
      success: true,
      tweetId: tweet.data.id,
      tweetUrl: `https://twitter.com/JPicklejak5299/status/${tweet.data.id}`
    }
  } catch (error: any) {
    console.error('❌ Failed to post tweet:', error)
    return {
      success: false,
      error: error.message || String(error)
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
    const client = createTwitterClient(config)
    
    const tweet = await client.v2.singleTweet(tweetId, {
      'tweet.fields': ['public_metrics']
    })
    
    const metrics = tweet.data.public_metrics
    
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
    const client = createTwitterClient(config)
    
    const user = await client.v2.me()
    
    return {
      success: true,
      username: user.data.username
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error)
    }
  }
}
