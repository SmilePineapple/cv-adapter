import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']
const TEST_ACCOUNT = 'jake.rourke@btinternet.com'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Allow admins to reset any user, or test account to reset themselves
    const isAdmin = ADMIN_EMAILS.includes(user.email || '')
    const isTestAccountResettingSelf = user.email === TEST_ACCOUNT && userId === user.id

    if (!isAdmin && !isTestAccountResettingSelf) {
      return NextResponse.json({ error: 'Unauthorized - Admin access only' }, { status: 403 })
    }

    console.log('[RESET]', user.email, 'resetting generations for userId:', userId)

    // Reset generation counts in usage_tracking
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({
        generation_count: 0,
        lifetime_generation_count: 0,
        last_reset_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('[RESET] Error resetting generations:', updateError)
      return NextResponse.json({ 
        error: 'Failed to reset generations',
        message: updateError.message
      }, { status: 500 })
    }

    console.log('[RESET] Successfully reset generations for userId:', userId)

    return NextResponse.json({
      success: true,
      message: 'Generation counts reset to 0 successfully'
    })

  } catch (error: any) {
    console.error('[RESET] Error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to reset generations',
      message: error.message
    }, { status: 500 })
  }
}
