import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test basic table access
    const { data: testSelect, error: selectError } = await supabase
      .from('cover_letters')
      .select('*')
      .limit(1)

    if (selectError) {
      return NextResponse.json({ 
        error: 'Select failed',
        details: selectError,
        message: selectError.message,
        code: selectError.code
      })
    }

    // Test insert
    const testData = {
      user_id: user.id,
      generation_id: null,
      content: 'Test cover letter content',
      company_name: 'Test Company',
      position_title: 'Test Position',
      length: 'short' as const,
      tone: 'professional' as const,
      hiring_manager_name: null
    }

    const { data: insertResult, error: insertError } = await supabase
      .from('cover_letters')
      .insert(testData)
      .select()

    if (insertError) {
      return NextResponse.json({ 
        error: 'Insert failed',
        details: insertError,
        message: insertError.message,
        code: insertError.code
      })
    }

    // Clean up test data
    if (insertResult && insertResult.length > 0) {
      await supabase
        .from('cover_letters')
        .delete()
        .eq('id', insertResult[0].id)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Cover letters table is working correctly',
      user_id: user.id
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
