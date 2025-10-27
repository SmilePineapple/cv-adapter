import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { sendPromoEmail } from '@/lib/email'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

/**
 * Send promotional email to all users
 * POST /api/send-promo-blast
 * Admin only - requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient()
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access only' }, { status: 401 })
    }

    console.log('📧 Starting promo email blast...')

    // Get all users from auth
    const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    console.log(`📊 Found ${allUsers.users.length} total users`)

    // Filter out Pro users (only send to free users)
    const { data: proUsers } = await supabase
      .from('usage_tracking')
      .select('user_id')
      .or('plan_type.eq.pro,subscription_tier.eq.pro_monthly,subscription_tier.eq.pro_annual')

    const proUserIds = new Set(proUsers?.map(u => u.user_id) || [])
    
    const freeUsers = allUsers.users.filter(u => !proUserIds.has(u.id))
    
    console.log(`🎯 Sending to ${freeUsers.length} free users (excluding ${proUserIds.size} Pro users)`)

    // Send emails with delay to avoid rate limiting
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const user of freeUsers) {
      const email = user.email
      const name = user.user_metadata?.full_name || email?.split('@')[0] || 'there'
      
      if (email) {
        try {
          const result = await sendPromoEmail(email, name)
          
          if (result.success) {
            results.sent++
            console.log(`✅ Sent to ${email}`)
          } else {
            results.failed++
            results.errors.push(`${email}: ${JSON.stringify(result.error)}`)
            console.error(`❌ Failed to send to ${email}:`, result.error)
          }
          
          // Small delay to avoid rate limiting (100ms between emails)
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          results.failed++
          results.errors.push(`${email}: ${error}`)
          console.error(`❌ Exception sending to ${email}:`, error)
        }
      }
    }

    console.log('📊 Promo blast complete:', results)

    return NextResponse.json({
      success: true,
      message: 'Promo email blast completed',
      results: {
        total: freeUsers.length,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors.slice(0, 10) // Only return first 10 errors
      }
    })
  } catch (error) {
    console.error('Promo blast error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send promo blast'
    }, { status: 500 })
  }
}
