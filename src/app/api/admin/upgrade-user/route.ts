import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'No authorization' }, { status: 401 })
    }

    const { email, userId } = await request.json()

    if (!email && !userId) {
      return NextResponse.json({ 
        error: 'Email or User ID required' 
      }, { status: 400 })
    }

    let targetUserId = userId
    let targetEmail = email

    // If email provided, get user ID
    if (email && !userId) {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers()
      
      if (userError) {
        return NextResponse.json({ 
          error: 'Failed to fetch users' 
        }, { status: 500 })
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        return NextResponse.json({ 
          error: `User not found: ${email}` 
        }, { status: 404 })
      }

      targetUserId = user.id
      targetEmail = user.email
    }

    // If userId provided, get email
    if (userId && !email) {
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(targetUserId)
      
      if (userError || !user) {
        return NextResponse.json({ 
          error: `User not found: ${userId}` 
        }, { status: 404 })
      }

      targetEmail = user.user.email
    }

    // UPSERT usage_tracking table (primary method)
    // IMPORTANT: Dashboard checks 'plan_type' column!
    // Use UPSERT because row might not exist yet
    const { error: usageError } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: targetUserId,
        plan_type: 'pro',
        subscription_tier: 'pro_monthly',
        generation_count: 0,
        lifetime_generation_count: 0,
        max_lifetime_generations: 999999,
        current_month: new Date().toISOString().substring(0, 7) + '-01', // First day of current month
        job_scrapes_used: 0,
        interview_preps_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (usageError) {
      console.error('Usage tracking upsert error:', usageError)
      return NextResponse.json({ 
        error: `Failed to upgrade: ${usageError.message}` 
      }, { status: 500 })
    }

    // Try to update subscriptions table if it exists (optional)
    try {
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: targetUserId,
          status: 'active',
          plan: 'pro',
          stripe_customer_id: `test_customer_${targetEmail}`,
          stripe_subscription_id: `test_sub_${targetEmail}`,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
    } catch (e) {
      // Subscriptions table doesn't exist, that's okay
      console.log('Subscriptions table not found, using usage_tracking only')
    }

    return NextResponse.json({ 
      success: true,
      email: targetEmail,
      userId: targetUserId,
      message: 'User upgraded to Pro successfully'
    })

  } catch (error) {
    console.error('Admin upgrade error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
