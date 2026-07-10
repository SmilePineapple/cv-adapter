import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin-auth'

/**
 * Get campaign status and progress
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const campaignId = url.searchParams.get('campaignId')

    if (campaignId) {
      // Get specific campaign status
      const { data: campaign, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (error || !campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }

      return NextResponse.json({ campaign })
    } else {
      // Get all campaigns
      const { data: campaigns, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ campaigns })
    }

  } catch (error: any) {
    console.error('Campaign status error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
