import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, score, game_type = 'cv_clicker', competition_id = 'oct_2025' } = body

    // Validation
    if (!email || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Email and score are required' },
        { status: 400 }
      )
    }

    if (score < 0 || score > 10000) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      )
    }

    // Get user_id from email
    const { data: userData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    // Insert score
    const { data, error } = await supabase
      .from('competition_scores')
      .insert({
        user_id: userData?.id,
        email,
        score,
        game_type,
        competition_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting score:', error)
      return NextResponse.json(
        { error: 'Failed to submit score' },
        { status: 500 }
      )
    }

    // Get user's rank
    const { data: rankData } = await supabase
      .rpc('get_user_best_score', {
        p_email: email,
        p_competition_id: competition_id
      })

    return NextResponse.json({
      success: true,
      score: data.score,
      rank: rankData?.[0]?.rank || null,
      total_players: rankData?.[0]?.total_players || null
    })

  } catch (error) {
    console.error('Competition submit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const competition_id = searchParams.get('competition_id') || 'oct_2025'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get leaderboard
    const { data, error } = await supabase
      .rpc('get_competition_leaderboard', {
        p_competition_id: competition_id,
        p_limit: limit
      })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      leaderboard: data || []
    })

  } catch (error) {
    console.error('Competition leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
