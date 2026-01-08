import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateWeeklyContent, Platform } from '@/lib/social-media-bot'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * API Route: Generate weekly social media content
 * POST /api/social-bot/generate
 * 
 * Body: {
 *   platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
 *   startDate?: string (ISO date)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { platform, startDate } = await request.json()

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    // Validate platform
    const validPlatforms: Platform[] = ['twitter', 'linkedin', 'facebook', 'instagram']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Check if platform is enabled
    const { data: config } = await supabase
      .from('social_media_config')
      .select('enabled')
      .eq('platform', platform)
      .single()

    if (!config?.enabled) {
      return NextResponse.json(
        { error: 'Platform is not enabled' },
        { status: 400 }
      )
    }

    // Generate content
    const start = startDate ? new Date(startDate) : new Date()
    const posts = await generateWeeklyContent(platform, start)

    // Save to database
    const { data, error } = await supabase
      .from('social_media_posts')
      .insert(
        posts.map(post => ({
          content: post.content,
          platform: post.platform,
          content_type: post.contentType,
          hashtags: post.hashtags,
          scheduled_for: post.scheduledFor.toISOString(),
          posted: false
        }))
      )
      .select()

    if (error) {
      console.error('Error saving posts:', error)
      return NextResponse.json(
        { error: 'Failed to save posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: data,
      count: data.length,
      message: `Generated ${data.length} posts for ${platform}`
    })

  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET: Get scheduled posts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform')
    const posted = searchParams.get('posted') === 'true'

    let query = supabase
      .from('social_media_posts')
      .select('*')
      .order('scheduled_for', { ascending: true })

    if (platform) {
      query = query.eq('platform', platform)
    }

    query = query.eq('posted', posted)

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: data,
      count: data.length
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
