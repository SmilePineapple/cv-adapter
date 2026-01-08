import { NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export async function GET() {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total users
    const { data: allUsers } = await supabase.auth.admin.listUsers()
    const totalUsers = allUsers.users.length

    // Users who generated CVs
    const { data: cvUsers } = await supabase
      .from('generations')
      .select('user_id')
      .limit(1000)
    
    const uniqueCVUsers = new Set(cvUsers?.map(g => g.user_id) || []).size

    // Users who created cover letters
    const { data: coverLetterUsers } = await supabase
      .from('cover_letters')
      .select('user_id')
      .limit(1000)
    
    const uniqueCoverLetterUsers = new Set(coverLetterUsers?.map(c => c.user_id) || []).size

    // Users who used interview prep
    const { data: interviewPrepUsers } = await supabase
      .from('interview_preps')
      .select('user_id')
      .limit(1000)
    
    const uniqueInterviewPrepUsers = new Set(interviewPrepUsers?.map(i => i.user_id) || []).size

    // Estimate PDF exports (would need tracking in production)
    const estimatedPDFExports = Math.round(uniqueCVUsers * 0.7) // 70% of CV users export

    return NextResponse.json({
      totalUsers,
      cvGeneration: uniqueCVUsers,
      coverLetters: uniqueCoverLetterUsers,
      interviewPrep: uniqueInterviewPrepUsers,
      exportPDF: estimatedPDFExports
    })
  } catch (error) {
    console.error('Feature usage error:', error)
    return NextResponse.json({ error: 'Failed to fetch feature usage' }, { status: 500 })
  }
}
