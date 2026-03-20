import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

/**
 * Lazy initialization of Stripe client to avoid build-time errors
 */
function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    return null
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-08-27.basil',
  })
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Check if Stripe is configured
    const stripe = getStripeClient()
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe is not configured',
        invoices: []
      }, { status: 200 })
    }

    // Get the user's Stripe customer ID
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subError || !subscriptionData?.stripe_customer_id) {
      return NextResponse.json({ 
        error: 'No subscription found',
        invoices: []
      }, { status: 200 })
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: subscriptionData.stripe_customer_id,
      limit: 100,
    })

    // Format invoices for frontend
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency.toUpperCase(),
      status: invoice.status,
      created: invoice.created,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
    }))

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices
    })

  } catch (error: any) {
    console.error('Fetch invoices error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to fetch invoices',
      invoices: []
    }, { status: 500 })
  }
}
