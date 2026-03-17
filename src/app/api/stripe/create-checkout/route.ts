import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const { userId, currency = 'gbp', plan = 'monthly' } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'User profile not found. Please contact support.' }, { status: 404 })
    }

    let customerId = null // We'll create a new customer each time for now

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId,
        },
      })
      
      customerId = customer.id

      // Note: We're not storing the customer ID for now since the column doesn't exist
    }

    // Prepare checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription', // Changed from 'payment' to 'subscription'
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        user_id: userId,
        plan_type: plan, // 'monthly' or 'annual'
      },
    }

    // Option 1: Use Price IDs from Stripe Dashboard (RECOMMENDED)
    const priceIdEnvVar = plan === 'annual' 
      ? 'STRIPE_PRICE_ID_PRO_ANNUAL' 
      : 'STRIPE_PRICE_ID_PRO_MONTHLY'
    
    const priceId = process.env[priceIdEnvVar]
    
    if (priceId) {
      // Use pre-created Price IDs from Stripe Dashboard
      sessionParams.line_items = [
        {
          price: priceId,
          quantity: 1,
        },
      ]
    } 
    // Option 2: Fallback to inline pricing (for testing)
    else {
      console.log('⚠️ No Stripe Price ID found, using inline pricing')
      
      // Monthly pricing by currency
      const monthlyPricing: Record<string, number> = {
        gbp: 299,     // £2.99/month
        usd: 399,     // $3.99/month
        eur: 349,     // €3.49/month
        cad: 449,     // C$4.49/month
        aud: 499,     // A$4.99/month
        inr: 24900,   // ₹249/month
      }

      // Annual pricing by currency (save ~58%)
      const annualPricing: Record<string, number> = {
        gbp: 1499,    // £14.99/year (£1.25/month)
        usd: 1999,    // $19.99/year ($1.67/month)
        eur: 1749,    // €17.49/year (€1.46/month)
        cad: 2249,    // C$22.49/year (C$1.87/month)
        aud: 2499,    // A$24.99/year (A$2.08/month)
        inr: 124900,  // ₹1,249/year (₹104/month)
      }

      const pricing = plan === 'annual' ? annualPricing : monthlyPricing
      const amount = pricing[currency.toLowerCase()] || (plan === 'annual' ? 1499 : 299)
      const interval = plan === 'annual' ? 'year' : 'month'

      sessionParams.line_items = [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `CV Adapter Pro - ${plan === 'annual' ? 'Annual' : 'Monthly'} Plan`,
              description: plan === 'annual' 
                ? 'Unlimited CV generations - Billed annually (Save 58%)'
                : 'Unlimited CV generations - Billed monthly',
            },
            unit_amount: amount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ]
    }

    // Allow users to enter promotion codes at checkout
    sessionParams.allow_promotion_codes = true

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
