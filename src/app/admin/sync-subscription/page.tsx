'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

interface SyncResult {
  success: boolean
  userId: string
  email: string
  action: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripeSubscriptionStatus: string | null
  previousPlanType: string
  updates: any
  message: string
}

export default function SyncSubscriptionPage() {
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      toast.error('Unauthorized - Admin access only')
      router.push('/dashboard')
      return
    }

    setIsAuthorized(true)
    setIsCheckingAuth(false)
  }

  const syncSubscription = async () => {
    if (!email && !userId) {
      toast.error('Please enter an email or user ID')
      return
    }

    setIsLoading(true)
    setSyncResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Not authenticated')
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/admin/sync-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email: email || undefined,
          userId: userId || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to sync subscription')
        return
      }

      setSyncResult(data)

      if (data.action === 'upgrade_to_pro') {
        toast.success(`✅ ${data.email} upgraded to Pro!`)
      } else if (data.action === 'downgrade_to_free') {
        toast.warning(`⚠️ ${data.email} downgraded to Free (no active subscription)`)
      } else if (data.action === 'sync_dates') {
        toast.success(`✅ Subscription dates synced for ${data.email}`)
      } else {
        toast.info(`ℹ️ No action needed for ${data.email}`)
      }
    } catch {
      toast.error('An error occurred during sync')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Checking authorization...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Sync Subscription with Stripe
            </h1>
          </div>
          <p className="text-gray-600 mb-8">
            Check and sync a user&apos;s subscription status between Stripe and the database.
            Use this when a payment went through but the account wasn&apos;t upgraded.
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
                placeholder="seethalmanohar12@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="text-center text-gray-500 text-sm">OR</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="43db75c8-26a7-4403-9c6f-9a36e78e071e"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={syncSubscription}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Syncing with Stripe...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Sync Subscription
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {syncResult && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Sync Results
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User:</span>
                  <span className="font-medium">{syncResult.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Action Taken:</span>
                  <span className={`font-medium ${
                    syncResult.action === 'upgrade_to_pro' ? 'text-green-600' :
                    syncResult.action === 'downgrade_to_free' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {syncResult.action.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Previous Plan:</span>
                  <span className="font-medium capitalize">{syncResult.previousPlanType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Stripe Customer:</span>
                  <span className="font-mono text-xs">
                    {syncResult.stripeCustomerId || 'Not found'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Stripe Subscription:</span>
                  <span className="font-mono text-xs">
                    {syncResult.stripeSubscriptionId || 'Not found'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription Status:</span>
                  <span className={`font-medium ${
                    syncResult.stripeSubscriptionStatus === 'active' ? 'text-green-600' :
                    syncResult.stripeSubscriptionStatus ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {syncResult.stripeSubscriptionStatus || 'N/A'}
                  </span>
                </div>

                {syncResult.stripeCustomerId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={`https://dashboard.stripe.com/customers/${syncResult.stripeCustomerId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in Stripe Dashboard
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Troubleshooting Guide */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Common Scenarios
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <span><strong>Payment succeeded but not upgraded:</strong> The sync will find the active subscription in Stripe and upgrade the user.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 mt-0.5 text-red-600" />
                <span><strong>Marked Pro but subscription expired:</strong> The sync will detect the inactive subscription and downgrade the user.</span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 mt-0.5 text-blue-600" />
                <span><strong>Dates out of sync:</strong> The sync will update the subscription end date to match Stripe.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ Admin Authenticated</h3>
            <p className="text-sm text-green-800">
              Only users in ADMIN_EMAILS can access this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
