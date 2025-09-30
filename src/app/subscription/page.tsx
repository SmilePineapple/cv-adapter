'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { loadStripe } from '@stripe/stripe-js'
import { 
  ArrowLeft, 
  Check, 
  Crown,
  Zap,
  Star,
  CreditCard
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionInfo {
  status: string | null
  current_period_end: string | null
  price_id: string | null
  cancel_at_period_end?: boolean
}

export default function SubscriptionPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      await fetchSubscription(user.id)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubscription = async (userId: string) => {
    try {
      // Try to fetch existing subscription from database
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end, price_id, cancel_at_period_end')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.warn('Subscription fetch error:', error.code || 'unknown')
        // No subscription found - user is on free plan
        setSubscription(null)
        return
      }

      if (!data) {
        // No subscription found - user is on free plan
        setSubscription(null)
        return
      }

      console.log('Subscription data:', data)
      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
      // On error, assume free plan
      setSubscription(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return

    const periodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end).toLocaleDateString()
      : 'the end of your billing period'

    const confirmed = confirm(
      `Are you sure you want to cancel your subscription? You will keep Pro access until ${periodEnd}.`
    )

    if (!confirmed) return

    setIsCancelling(true)
    try {
      // Try manual cancellation first (for testing without Stripe)
      const manualResponse = await fetch('/api/cancel-subscription-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (manualResponse.ok) {
        const result = await manualResponse.json()
        toast.success(`Subscription cancelled. You will have access until ${periodEnd}.`, { duration: 5000 })
        await fetchSubscription(user.id)
        return
      }

      // Fallback to Stripe cancellation
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Show the helpful message from the API
        const message = result.message || result.error || 'Failed to cancel subscription'
        toast.error(message, { duration: 6000 })
        return
      }

      toast.success('Subscription cancelled successfully. You will have access until the end of your billing period.')
      
      // Refresh subscription data
      await fetchSubscription(user.id)
    } catch (error: any) {
      console.error('Cancel subscription error:', error)
      toast.error('Failed to cancel subscription. Please contact support at jakedalerourke@gmail.com')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleUpgrade = async (priceId: string) => {
    if (!user) return

    setIsUpgrading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      const { sessionId } = result

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (error: any) {
      console.error('Upgrade error:', error)
      toast.error(error.message || 'Failed to start upgrade process')
    } finally {
      setIsUpgrading(false)
    }
  }

  const isActive = subscription?.status === 'active'
  
  // Debug logging
  console.log('Subscription state:', subscription)
  console.log('Is active:', isActive)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Subscription</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pro Subscription Management */}
        {isActive && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {subscription?.cancel_at_period_end ? (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <div className="flex items-center">
                  <Crown className="w-8 h-8 text-white mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Pro Subscription - Cancelling</h2>
                    <p className="text-orange-100">
                      Active until {subscription?.current_period_end 
                        ? new Date(subscription.current_period_end).toLocaleDateString()
                        : 'end of period'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center">
                  <Crown className="w-8 h-8 text-white mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Pro Subscription</h2>
                    <p className="text-green-100">Active and ready to use</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">CV Adapter Pro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">£5/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generations:</span>
                      <span className="font-medium">100/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {subscription?.cancel_at_period_end ? 'Access until:' : 'Next billing:'}
                      </span>
                      <span className={`font-medium ${subscription?.cancel_at_period_end ? 'text-orange-600' : ''}`}>
                        {subscription?.current_period_end 
                          ? new Date(subscription.current_period_end).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                    {subscription?.cancel_at_period_end && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-orange-600">Cancelling at period end</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      100 CV generations per month
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Unlimited cover letters
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      All export formats
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cancellation Notice */}
              {subscription?.cancel_at_period_end && (
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-orange-800">Subscription Cancelled</h3>
                      <div className="mt-2 text-sm text-orange-700">
                        <p>
                          Your subscription has been cancelled and will not renew. You will keep full Pro access until{' '}
                          <strong>
                            {subscription?.current_period_end 
                              ? new Date(subscription.current_period_end).toLocaleDateString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              : 'the end of your billing period'
                            }
                          </strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Need help? Contact support at{' '}
                      <a href="mailto:jakedalerourke@gmail.com" className="text-blue-600 hover:text-blue-700">
                        jakedalerourke@gmail.com
                      </a>
                    </p>
                  </div>
                  {!subscription?.cancel_at_period_end && (
                    <button 
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        {!isActive && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-12 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-gray-600 mb-8">
                Unlock unlimited CV generations and premium features
              </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="border border-gray-200 rounded-xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
                  <div className="text-gray-600">per month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">3 CV generations per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">All export formats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Basic templates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>

                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-blue-500 rounded-xl p-8 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-blue-600 mr-2" />
                    Pro
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">£5</div>
                  <div className="text-gray-600">per month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">100 CV generations per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">All export formats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Premium templates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">AI cover letter generation</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Advanced AI features</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('price_1SBByxEFkh28oI4Tf8LVjPoe')} // Your real Stripe price ID
                  disabled={isUpgrading || isActive}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : isActive ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards including Visa, Mastercard, and American Express through our secure Stripe payment processor.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">Absolutely. We use industry-standard encryption and never store your payment information. All data is processed securely through Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
