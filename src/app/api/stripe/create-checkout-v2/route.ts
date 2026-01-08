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
    const { userId, couponCode } = await request.json()

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

    // Create or get Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: userId,
      },
    })

    // Prepare checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        user_id: userId,
      },
      allow_promotion_codes: true, // Allow users to enter coupon codes at checkout
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
      sessionParams.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'CV Adapter Pro - Lifetime Access',
              description: 'Unlimited AI-powered CV generations',
            },
            unit_amount: 500, // £5.00 in pence
          },
          quantity: 1,
        },
      ]
    }

    // Apply coupon code if provided
    if (couponCode) {
      try {
        // Verify coupon exists and is valid
        const coupon = await stripe.coupons.retrieve(couponCode)
        if (coupon.valid) {
          sessionParams.discounts = [
            {
              coupon: couponCode,
            },
          ]
        }
      } catch (error) {
        console.error('Invalid coupon code:', couponCode)
        // Don't fail checkout, just don't apply coupon
      }
    }

    // Apply default coupon if set (for automatic promotions)
    if (!couponCode && process.env.STRIPE_DEFAULT_COUPON) {
      try {
        const defaultCoupon = await stripe.coupons.retrieve(process.env.STRIPE_DEFAULT_COUPON)
        if (defaultCoupon.valid) {
          sessionParams.discounts = [
            {
              coupon: process.env.STRIPE_DEFAULT_COUPON,
            },
          ]
        }
      } catch (error) {
        console.error('Default coupon not valid')
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
