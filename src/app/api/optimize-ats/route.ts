import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { runATSOptimization, estimateScoreImprovement, analyzeATSIssues } from '@/lib/ats-optimizer'
import { calculateATSScore } from '@/lib/ats-calculator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generation_id } = await request.json()

    if (!generation_id) {
      return NextResponse.json({ 
        error: 'Missing generation_id' 
      }, { status: 400 })
    }

    // Fetch generation data
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const sections = generation.output_sections?.sections || []
    const jobDescription = generation.job_description || ''
    const currentScore = generation.ats_score || 0

    // Check if score is already good
    if (currentScore >= 75) {
      return NextResponse.json({
        message: 'CV already has a good ATS score',
        currentScore,
        optimizationNeeded: false
      })
    }

    console.log(`🚀 Optimizing CV for generation ${generation_id}`)
    console.log(`Current ATS score: ${currentScore}%`)

    // Run ATS optimization
    const result = await runATSOptimization(sections, jobDescription, currentScore)

    // Calculate new ATS score
    const newScore = await calculateATSScore(result.optimizedSections, jobDescription)
    result.afterScore = newScore

    // Update generation with optimized content
    const { error: updateError } = await supabase
      .from('generations')
      .update({
        output_sections: { sections: result.optimizedSections },
        ats_score: newScore
      })
      .eq('id', generation_id)

    if (updateError) {
      console.error('Error updating generation:', updateError)
      throw new Error('Failed to save optimized CV')
    }

    console.log(`✅ Optimization complete! Score: ${currentScore}% → ${newScore}%`)

    // Track optimization in history
    await supabase.from('ats_optimization_history').insert({
      user_id: user.id,
      generation_id,
      before_score: currentScore,
      after_score: newScore,
      improvements: result.improvements,
      changes_summary: result.changesSummary
    })

    // Track AI usage for analytics
    await supabase.from('ai_usage_tracking').insert({
      user_id: user.id,
      feature_type: 'ats_optimization',
      usage_count: 1,
      usage_date: new Date().toISOString().split('T')[0]
    })

    return NextResponse.json({
      success: true,
      beforeScore: currentScore,
      afterScore: newScore,
      improvement: newScore - currentScore,
      improvements: result.improvements,
      changesSummary: result.changesSummary,
      optimizedSections: result.optimizedSections
    })

  } catch (error) {
    console.error('ATS optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize CV for ATS' },
      { status: 500 }
    )
  }
}

// GET endpoint to analyze ATS issues without optimizing
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const generation_id = searchParams.get('generation_id')

    if (!generation_id) {
      return NextResponse.json({ 
        error: 'Missing generation_id' 
      }, { status: 400 })
    }

    // Fetch generation data
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const sections = generation.output_sections?.sections || []
    const jobDescription = generation.job_description || ''
    const currentScore = generation.ats_score || 0

    // Analyze issues
    const analysis = await analyzeATSIssues(sections, jobDescription, currentScore)
    const estimatedImprovement = estimateScoreImprovement(analysis)

    return NextResponse.json({
      currentScore,
      estimatedNewScore: Math.min(currentScore + estimatedImprovement, 100),
      analysis,
      canOptimize: currentScore < 75
    })

  } catch (error) {
    console.error('ATS analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze ATS issues' },
      { status: 500 }
    )
  }
}
