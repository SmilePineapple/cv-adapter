import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { formatPostForPlatform, SocialPost } from '@/lib/social-media-bot'

/**
 * Cron Job API Route: Post scheduled content
 * GET /api/social-bot/cron
 * 
 * This should be called by a cron service (Vercel Cron, GitHub Actions, etc.)
 * every hour to check for and post scheduled content.
 * 
 * Security: Verify cron secret to prevent unauthorized access
 */
export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClient()
  try {
    // Verify this is from Vercel Cron (optional - Vercel Cron is already secure)
    const authHeader = request.headers.get('authorization')
    
    // Log for debugging
    console.log('Cron job triggered at:', new Date().toISOString())
    console.log('Auth header:', authHeader ? 'Present' : 'Missing')

    const now = new Date()
    const results = {
      checked: 0,
      posted: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Reset daily counts first so we don't skip posts forever if a cron runs after midnight
    try {
      await supabase.rpc('reset_daily_post_counts')
    } catch (resetError) {
      console.warn('reset_daily_post_counts failed (continuing):', resetError)
    }

    // Get posts scheduled for now or earlier that haven't been posted
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('posted', false)
      .lte('scheduled_for', now.toISOString())
      .order('scheduled_for', { ascending: true })
      .limit(50) // Process more per run to drain backlog

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch scheduled posts' },
        { status: 500 }
      )
    }

    results.checked = scheduledPosts?.length || 0

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts to publish',
        results
      })
    }

    // Process each post
    for (const post of scheduledPosts) {
      try {
        // Check if platform is enabled and has posting enabled
        const { data: config } = await supabase
          .from('social_media_config')
          .select('*')
          .eq('platform', post.platform)
          .single()

        if (!config?.enabled || !config?.posting_enabled) {
          console.log(`Skipping ${post.platform} - not enabled for posting`)
          continue
        }

        // Check daily limit
        if (config.posts_today >= config.daily_post_limit) {
          console.log(`Skipping ${post.platform} - daily limit reached`)
          continue
        }

        // Format post for platform
        const formattedContent = formatPostForPlatform({
          ...post,
          hashtags: post.hashtags || []
        } as SocialPost)

        // Post to platform (you'll implement this based on platform APIs)
        const postResult = await postToPlatform(
          post.platform,
          formattedContent,
          config
        )

        if (postResult.success) {
          // Update post as posted
          await supabase
            .from('social_media_posts')
            .update({
              posted: true,
              posted_at: new Date().toISOString(),
              post_id: postResult.postId,
              post_url: postResult.postUrl
            })
            .eq('id', post.id)

          // Update platform config
          await supabase
            .from('social_media_config')
            .update({
              posts_today: config.posts_today + 1,
              last_post_date: new Date().toISOString().split('T')[0]
            })
            .eq('platform', post.platform)

          results.posted++
        } else {
          // Update retry count and error
          await supabase
            .from('social_media_posts')
            .update({
              retry_count: (post.retry_count || 0) + 1,
              error_message: postResult.error
            })
            .eq('id', post.id)

          results.failed++
          results.errors.push(`${post.platform}: ${postResult.error}`)
        }

      } catch (error) {
        console.error(`Error posting to ${post.platform}:`, error)
        results.failed++
        results.errors.push(`${post.platform}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.checked} posts`,
      results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Post content to specific platform
 * You'll need to implement this based on each platform's API
 */
async function postToPlatform(
  platform: string,
  content: string,
  config: any
): Promise<{ success: boolean; postId?: string; postUrl?: string; error?: string }> {
  
  // For now, this is a placeholder
  // You'll need to implement actual API calls for each platform
  
  switch (platform) {
    case 'linkedin':
      return await postToLinkedIn(content, config)
    
    default:
      return {
        success: false,
        error: 'Unknown platform'
      }
  }
}

/**
 * Post to LinkedIn
 * Requires: LinkedIn API credentials
 */
async function postToLinkedIn(
  content: string,
  config: any
): Promise<{ success: boolean; postId?: string; postUrl?: string; error?: string }> {
  try {
    console.log('Posting to LinkedIn:', content.substring(0, 50) + '...')
    
    if (!config.access_token) {
      throw new Error('LinkedIn access token not found')
    }

    // Get user profile for personal posting
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${config.access_token}`
      }
    })

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      throw new Error(`Failed to get LinkedIn profile: ${errorText}`)
    }

    const profile = await profileResponse.json()
    const personUrn = `urn:li:person:${profile.sub}`
    
    console.log('Posting to LinkedIn personal profile:', personUrn)

    // Create the post using UGC API (personal profile)
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

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    })

    if (!postResponse.ok) {
      const errorText = await postResponse.text()
      console.error('LinkedIn post failed:', errorText)
      throw new Error(`LinkedIn API error: ${errorText}`)
    }

    const result = await postResponse.json()
    console.log('✅ LinkedIn post created on personal profile:', result.id)

    return {
      success: true,
      postId: result.id,
      postUrl: `https://www.linkedin.com/feed/update/${result.id}`
    }
  } catch (error) {
    console.error('Error posting to LinkedIn:', error)
    return {
      success: false,
      error: String(error)
    }
  }
}

