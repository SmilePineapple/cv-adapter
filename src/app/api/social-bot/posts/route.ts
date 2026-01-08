import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Get social media posts
 * GET /api/social-bot/posts?posted=false&limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const posted = searchParams.get('posted') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data: posts, error } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('posted', posted)
      .order('scheduled_for', { ascending: posted })
      .limit(limit)

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: posts || []
    })

  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
