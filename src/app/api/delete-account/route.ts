import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Delete all user data in order (respecting foreign key constraints)
    // 1. Delete generations
    const { error: genError } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', userId)

    if (genError) {
      console.error('Error deleting generations:', genError)
    }

    // 2. Delete cover letters
    const { error: clError } = await supabase
      .from('cover_letters')
      .delete()
      .eq('user_id', userId)

    if (clError) {
      console.error('Error deleting cover letters:', clError)
    }

    // 3. Delete interview preps
    const { error: ipError } = await supabase
      .from('interview_preps')
      .delete()
      .eq('user_id', userId)

    if (ipError) {
      console.error('Error deleting interview preps:', ipError)
    }

    // 4. Delete CVs
    const { error: cvError } = await supabase
      .from('cvs')
      .delete()
      .eq('user_id', userId)

    if (cvError) {
      console.error('Error deleting CVs:', cvError)
    }

    // 5. Delete usage tracking
    const { error: usageError } = await supabase
      .from('usage_tracking')
      .delete()
      .eq('user_id', userId)

    if (usageError) {
      console.error('Error deleting usage tracking:', usageError)
    }

    // 6. Delete purchases
    const { error: purchaseError } = await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId)

    if (purchaseError) {
      console.error('Error deleting purchases:', purchaseError)
    }

    // 7. Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 8. Delete auth user (this will cascade delete everything else)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json({ 
        error: 'Failed to delete account',
        message: 'Please contact support at jakedalerourke@gmail.com'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete account error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to delete account',
      message: 'Please contact support at jakedalerourke@gmail.com'
    }, { status: 500 })
  }
}
