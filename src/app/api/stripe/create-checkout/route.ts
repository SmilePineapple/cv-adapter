import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
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
        gbp: 999,     // £9.99/month
        usd: 1299,    // $12.99/month
        eur: 1099,    // €10.99/month
        cad: 1499,    // C$14.99/month
        aud: 1599,    // A$15.99/month
        inr: 99900,   // ₹999/month
      }

      // Annual pricing by currency (save ~59%)
      const annualPricing: Record<string, number> = {
        gbp: 4900,    // £49/year (£4.08/month)
        usd: 6900,    // $69/year ($5.75/month)
        eur: 5900,    // €59/year (€4.92/month)
        cad: 7900,    // C$79/year (C$6.58/month)
        aud: 8900,    // A$89/year (A$7.42/month)
        inr: 499900,  // ₹4,999/year (₹416/month)
      }

      const pricing = plan === 'annual' ? annualPricing : monthlyPricing
      const amount = pricing[currency.toLowerCase()] || (plan === 'annual' ? 4900 : 999)
      const interval = plan === 'annual' ? 'year' : 'month'

      sessionParams.line_items = [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `CV Adapter Pro - ${plan === 'annual' ? 'Annual' : 'Monthly'} Plan`,
              description: plan === 'annual' 
                ? 'Unlimited CV generations - Billed annually (Save 59%)'
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
