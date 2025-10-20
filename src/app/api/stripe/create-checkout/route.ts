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
    const { userId, currency = 'gbp' } = await request.json()

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
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        user_id: userId,
      },
    }

    // Option 1: Use Price ID (if you've created a Product in Stripe)
    if (process.env.STRIPE_PRICE_ID_PRO) {
      sessionParams.line_items = [
        {
          price: process.env.STRIPE_PRICE_ID_PRO,
          quantity: 1,
        },
      ]
    } 
    // Option 2: Fallback to inline pricing (current method)
    else {
      // Currency-specific pricing
      const currencyPricing: Record<string, number> = {
        gbp: 500,    // £5.00
        usd: 699,    // $6.99
        eur: 599,    // €5.99
        cad: 899,    // C$8.99
        aud: 999,    // A$9.99
        inr: 49900,  // ₹499
      }

      const amount = currencyPricing[currency.toLowerCase()] || 500

      sessionParams.line_items = [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'CV Adapter Pro - 100 Lifetime Generations',
              description: '100 AI-powered CV generations that never expire',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ]
    }

    // Apply default coupon if set (for automatic promotions like LAUNCH50)
    // NOTE: If using discounts, we cannot also use allow_promotion_codes
    if (process.env.STRIPE_DEFAULT_COUPON) {
      try {
        const defaultCoupon = await stripe.coupons.retrieve(process.env.STRIPE_DEFAULT_COUPON)
        if (defaultCoupon.valid) {
          sessionParams.discounts = [
            {
              coupon: process.env.STRIPE_DEFAULT_COUPON,
            },
          ]
          // When using discounts, don't set allow_promotion_codes
        }
      } catch (error) {
        console.error('Default coupon not valid:', error)
        // If coupon fails, allow manual entry instead
        sessionParams.allow_promotion_codes = true
      }
    } else {
      // If no default coupon, allow users to enter their own
      sessionParams.allow_promotion_codes = true
    }

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
