import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const competition_id = searchParams.get('competition_id') || 'oct_2025'

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get user's best score and rank
    const { data, error } = await supabase
      .rpc('get_user_best_score', {
        p_email: email,
        p_competition_id: competition_id
      })

    if (error) {
      console.error('Error fetching user rank:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user rank' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rank: data?.[0] || null
    })

  } catch (error) {
    console.error('User rank error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
