import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

/**
 * Delete pending posts by platform
 * DELETE /api/social-bot/posts?platform=twitter  (or omit for all non-linkedin)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const platform = request.nextUrl.searchParams.get('platform')

    let query = supabase
      .from('social_media_posts')
      .delete()
      .eq('posted', false)

    if (platform) {
      query = query.eq('platform', platform)
    } else {
      query = query.neq('platform', 'linkedin')
    }

    const { error, count } = await query

    if (error) {
      console.error('Error deleting posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      deleted: count,
      message: platform
        ? `Deleted pending ${platform} posts`
        : 'Deleted all pending non-LinkedIn posts'
    })
  } catch (error) {
    console.error('Posts DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Get social media posts
 * GET /api/social-bot/posts?posted=false&limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
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
