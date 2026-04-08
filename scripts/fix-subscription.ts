/**
 * Script to fix a user's subscription status
 * Use this when a payment went through but the account wasn't upgraded
 *
 * Usage:
 * npx ts-node scripts/fix-subscription.ts <email>
 *
 * Example:
 * npx ts-node scripts/fix-subscription.ts seethalmanohar12@gmail.com
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!

if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
  console.error('❌ Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil'
})

async function fixSubscription(email: string) {
  console.log(`\n🔍 Fixing subscription for: ${email}\n`)

  try {
    // Find user
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error('❌ Failed to fetch users:', userError)
      return
    }

    const user = users.users.find(u => u.email === email)

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      return
    }

    console.log(`✅ Found user: ${user.id}`)
    console.log(`   Email: ${user.email}`)

    // Check current database status
    const { data: usageTracking } = await supabase
      .from('usage_tracking')
      .select('plan_type, subscription_tier, subscription_end_date')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log(`\n📊 Current Database Status:`)
    console.log(`   Plan Type: ${usageTracking?.plan_type || 'free'}`)
    console.log(`   Subscription Tier: ${usageTracking?.subscription_tier || 'free'}`)
    console.log(`   Subscription End: ${usageTracking?.subscription_end_date || 'N/A'}`)

    // Check subscriptions table
    const { data: subscriptionRecord } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    let stripeCustomerId = subscriptionRecord?.stripe_customer_id
    let stripeSubscriptionId = subscriptionRecord?.stripe_subscription_id

    console.log(`\n📊 Subscriptions Table:`)
    console.log(`   Stripe Customer: ${stripeCustomerId || 'Not found'}`)
    console.log(`   Stripe Subscription: ${stripeSubscriptionId || 'Not found'}`)
    console.log(`   Status: ${subscriptionRecord?.status || 'N/A'}`)

    // If no customer ID, search Stripe by email
    if (!stripeCustomerId) {
      console.log(`\n🔍 Searching Stripe for customer by email...`)
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      })

      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id
        console.log(`✅ Found Stripe customer: ${stripeCustomerId}`)
      } else {
        console.log(`⚠️ No Stripe customer found with email: ${email}`)

        // Try searching with partial email
        console.log(`\n🔍 Trying partial email search...`)
        const allCustomers = await stripe.customers.list({ limit: 100 })
        const partialMatch = allCustomers.data.find(c =>
          c.email?.toLowerCase().includes(email.split('@')[0].toLowerCase())
        )

        if (partialMatch) {
          stripeCustomerId = partialMatch.id
          console.log(`✅ Found customer with partial match: ${partialMatch.email} (${stripeCustomerId})`)
        }
      }
    }

    // Check for active subscriptions
    if (stripeCustomerId) {
      console.log(`\n🔍 Checking subscriptions for customer...`)
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        limit: 10
      })

      console.log(`   Found ${subscriptions.data.length} subscription(s)`)

      for (const sub of subscriptions.data) {
        console.log(`\n   📋 Subscription: ${sub.id}`)
        console.log(`      Status: ${sub.status}`)
        console.log(`      Current Period End: ${new Date((sub as any).current_period_end * 1000).toISOString()}`)

        if (sub.status === 'active') {
          stripeSubscriptionId = sub.id
          console.log(`\n✅ Found active subscription!`)

          // Calculate period end
          const subData = sub as any
          const currentPeriodEnd = new Date(subData.current_period_end * 1000)

          // Determine plan type
          const interval = sub.items.data[0]?.price?.recurring?.interval
          const isAnnual = interval === 'year'
          const subscriptionTier = isAnnual ? 'pro_annual' : 'pro_monthly'

          console.log(`\n📝 Proposed Changes:`)
          console.log(`   Plan Type: pro`)
          console.log(`   Subscription Tier: ${subscriptionTier}`)
          console.log(`   Period End: ${currentPeriodEnd.toISOString()}`)

          // Confirm before applying
          console.log(`\n⚠️  Press Ctrl+C to cancel, or wait 5 seconds to apply changes...`)
          await new Promise(resolve => setTimeout(resolve, 5000))

          // Apply changes
          console.log(`\n🔄 Applying changes...`)

          // Update usage_tracking
          const { error: usageError } = await supabase
            .from('usage_tracking')
            .upsert({
              user_id: user.id,
              plan_type: 'pro',
              subscription_tier: subscriptionTier,
              subscription_start_date: new Date().toISOString(),
              subscription_end_date: currentPeriodEnd.toISOString(),
              max_lifetime_generations: 999999,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            })

          if (usageError) {
            console.error(`❌ Failed to update usage_tracking: ${usageError.message}`)
            return
          }

          console.log(`✅ Updated usage_tracking`)

          // Update subscriptions table
          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              status: 'active',
              current_period_end: currentPeriodEnd.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            })

          if (subError) {
            console.error(`❌ Failed to update subscriptions table: ${subError.message}`)
          } else {
            console.log(`✅ Updated subscriptions table`)
          }

          console.log(`\n🎉 SUCCESS! User ${email} has been upgraded to Pro!`)
          console.log(`\n📋 Summary:`)
          console.log(`   User: ${email}`)
          console.log(`   Plan: ${subscriptionTier}`)
          console.log(`   Valid until: ${currentPeriodEnd.toLocaleDateString()}`)
          console.log(`   Stripe Customer: ${stripeCustomerId}`)
          console.log(`   Stripe Subscription: ${stripeSubscriptionId}`)

          return
        }
      }

      console.log(`\n⚠️ No active subscriptions found for this customer.`)
      console.log(`   The user may need to complete payment or their subscription may have expired.`)
    } else {
      console.log(`\n❌ No Stripe customer found for this user.`)
      console.log(`   The user may not have completed checkout yet.`)
    }

    console.log(`\n💡 Recommendations:`)
    console.log(`   1. Check Stripe Dashboard for any pending payments`)
    console.log(`   2. Ask the user to complete checkout if they haven't`)
    console.log(`   3. If payment is complete but not showing, check webhook logs`)

  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

// Run if called directly
const email = process.argv[2]

if (!email) {
  console.log('Usage: npx ts-node scripts/fix-subscription.ts <email>')
  console.log('Example: npx ts-node scripts/fix-subscription.ts seethalmanohar12@gmail.com')
  process.exit(1)
}

fixSubscription(email)
