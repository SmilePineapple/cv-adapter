import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function DELETE(/* request: NextRequest */) {
  try {
    const supabaseAdmin = createAdminClient()
    const userId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
    
    console.log('Cleaning up old CVs for user:', userId)
    
    // Delete all CVs for this user
    const { data, error } = await supabaseAdmin
      .from('cvs')
      .delete()
      .eq('user_id', userId)
      .select()
    
    if (error) {
      console.error('Cleanup error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('Deleted CVs:', data?.length || 0)
    
    // Also clean up generations
    const { data: genData, error: genError } = await supabaseAdmin
      .from('generations')
      .delete()
      .eq('user_id', userId)
      .select()
    
    if (genError) {
      console.error('Generation cleanup error:', genError)
    } else {
      console.log('Deleted generations:', genData?.length || 0)
    }
    
    return NextResponse.json({ 
      success: true, 
      deleted_cvs: data?.length || 0,
      deleted_generations: genData?.length || 0
    })
    
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
