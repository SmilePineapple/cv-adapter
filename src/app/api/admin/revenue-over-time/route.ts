import { NextRequest, NextResponse } from 'next/server'
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

    // Get purchases from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const { data: purchases } = await supabase
      .from('purchases')
      .select('amount, created_at')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by date
    const revenueByDate: { [key: string]: number } = {}
    
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      revenueByDate[dateStr] = 0
    }

    // Add actual revenue
    purchases?.forEach(purchase => {
      const dateStr = purchase.created_at.split('T')[0]
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += purchase.amount / 100 // Convert from pence to pounds
      }
    })

    // Convert to array and sort
    const revenueData = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        revenue
      }))
      .reverse() // Most recent last

    return NextResponse.json(revenueData)
  } catch (error) {
    console.error('Revenue over time error:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
  }
}
