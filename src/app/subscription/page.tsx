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
  CreditCard,
  Globe,
  Download,
  XCircle,
  FileText
} from 'lucide-react'
import { getCurrencyFromLocale, type CurrencyConfig, CURRENCIES } from '@/lib/currency'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PurchaseInfo {
  status: string | null
  purchased_at: string | null
  amount_paid: number | null
}

interface UsageInfo {
  plan_type: string
  lifetime_generation_count: number
  max_lifetime_generations: number
}

interface Invoice {
  id: string
  number: string | null
  amount: number
  currency: string
  status: string
  created: number
  invoice_pdf: string | null
  hosted_invoice_url: string | null
  period_start: number
  period_end: number
}

export default function SubscriptionPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [user, setUser] = useState<any>(null)
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null)
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [userCurrency, setUserCurrency] = useState<CurrencyConfig>(CURRENCIES.GBP)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    checkAuth()
    // Detect user's currency
    const currency = getCurrencyFromLocale()
    setUserCurrency(currency)
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      await fetchPurchaseAndUsage(user.id)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPurchaseAndUsage = async (userId: string) => {
    try {
      // Fetch purchase record
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('status, purchased_at, amount_paid')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .maybeSingle()

      if (purchaseError && purchaseError.code !== 'PGRST116') {
        console.warn('Purchase fetch error:', purchaseError.code || 'unknown')
      }

      setPurchase(purchaseData || null)

      // Fetch usage info
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('plan_type, lifetime_generation_count, max_lifetime_generations')
        .eq('user_id', userId)
        .single()

      if (usageError) {
        console.warn('Usage fetch error:', usageError.code || 'unknown')
      } else {
        setUsage(usageData)
      }
    } catch (error) {
      console.error('Error fetching purchase/usage:', error)
      setPurchase(null)
      setUsage(null)
    }
  }

  const fetchInvoices = async () => {
    if (!user) return
    
    setIsLoadingInvoices(true)
    try {
      const response = await fetch(`/api/stripe/invoices?userId=${user.id}`)
      const data = await response.json()
      
      if (data.success && data.invoices) {
        setInvoices(data.invoices)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setIsLoadingInvoices(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user) return
    
    setIsCancelling(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.success('Subscription cancelled successfully. You\'ll have access until the end of your billing period.')
        setShowCancelDialog(false)
        // Refresh purchase/usage data
        await fetchPurchaseAndUsage(user.id)
      } else {
        throw new Error(data.message || data.error || 'Failed to cancel subscription')
      }
    } catch (error: any) {
      console.error('Cancel error:', error)
      toast.error(error.message || 'Failed to cancel subscription')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) return

    setIsUpgrading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currency: userCurrency.code,
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

  const isPro = usage?.plan_type === 'pro'

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
        {/* Pro Purchase Management */}
        {isPro && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-white mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Pro Plan Active</h2>
                  <p className="text-green-100">Active subscription - unlimited access</p>
                </div>
              </div>
            </div>
            
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
                      <span className="text-gray-600">Price Paid:</span>
                      <span className="font-medium">£9.99/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generations:</span>
                      <span className="font-medium">{usage?.lifetime_generation_count || 0} used (unlimited)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchased:</span>
                      <span className="font-medium">
                        {purchase?.purchased_at 
                          ? new Date(purchase.purchased_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Lifetime Access</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Unlimited CV generations
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

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={fetchInvoices}
                      disabled={isLoadingInvoices}
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {isLoadingInvoices ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          View Invoices
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setShowCancelDialog(true)}
                      className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </button>
                  </div>

                  {/* Invoices List */}
                  {invoices.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Invoices</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {invoice.number || `Invoice ${invoice.id.slice(-8)}`}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {invoice.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {new Date(invoice.created * 1000).toLocaleDateString()} • {invoice.currency} {invoice.amount.toFixed(2)}
                              </div>
                            </div>
                            {invoice.invoice_pdf && (
                              <a
                                href={invoice.invoice_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <p className="text-sm text-gray-600">
                      Need help? Contact support at{' '}
                      <a href="mailto:jakedalerourke@gmail.com" className="text-blue-600 hover:text-blue-700">
                        jakedalerourke@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cancel Subscription?</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        {!isPro && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-12 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-gray-600 mb-8">
                Unlock unlimited CV generations and premium features
              </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">£0</div>
                  <div className="text-gray-600">forever</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">1 CV generation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">All export formats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Basic templates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Email support</span>
                  </li>
                </ul>

                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                >
                  Current Plan
                </button>
              </div>

              {/* Monthly Pro Plan */}
              <div className="border-2 border-blue-500 rounded-xl p-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-blue-600 mr-2" />
                    Monthly
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{userCurrency.displayAmount}</div>
                  <div className="text-gray-600 text-sm">per month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Unlimited CV generations</span>
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
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isPro}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : isPro ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Already Purchased
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Pro Access
                    </>
                  )}
                </button>
              </div>

              {/* Annual Pro Plan */}
              <div className="border-2 border-green-500 rounded-xl p-6 relative bg-gradient-to-br from-green-50 to-blue-50">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Save £70/year + 50% OFF with code LAUNCH50ANNUAL
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-green-600 mr-2" />
                    Annual
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">£49</div>
                  <div className="text-gray-600 text-sm">per year</div>
                  <div className="text-green-600 text-xs font-medium mt-1">Just £4.08/month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Unlimited CV generations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">All export formats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Premium templates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">AI cover letter generation</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 text-sm">Advanced AI features</span>
                  </li>
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isPro}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-semibold"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : isPro ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Already Purchased
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Annual Plan
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
