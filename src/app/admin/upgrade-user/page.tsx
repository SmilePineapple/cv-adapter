'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AdminUpgradeUserPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createSupabaseClient()

  const upgradeUser = async () => {
    if (!email) {
      toast.error('Please enter an email')
      return
    }

    setIsLoading(true)

    try {
      // Get user by email
      const { data: users, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', email)
        .single()

      if (userError || !users) {
        toast.error('User not found')
        setIsLoading(false)
        return
      }

      // Create/update subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: users.id,
          status: 'active',
          plan: 'pro',
          stripe_customer_id: `test_customer_${email}`,
          stripe_subscription_id: `test_sub_${email}`,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false
        })

      if (subError) {
        toast.error(`Error: ${subError.message}`)
      } else {
        toast.success(`✅ ${email} upgraded to Pro!`)
        setEmail('')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin: Upgrade User to Pro
          </h1>
          <p className="text-gray-600 mb-8">
            Manually upgrade any user to Pro for free testing
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tester@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={upgradeUser}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Upgrading...' : 'Upgrade to Pro (Free)'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Admin Only</h3>
            <p className="text-sm text-yellow-800">
              This page should only be accessible to admins. In production, add authentication check.
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 What This Does:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sets user plan to "pro"</li>
              <li>• Sets status to "active"</li>
              <li>• Valid for 1 year</li>
              <li>• No Stripe charges</li>
              <li>• Unlimited CV generations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
