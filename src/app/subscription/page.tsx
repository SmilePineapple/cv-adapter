'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
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
  FileText,
  Sparkles,
  Shield,
  Award,
  Clock
} from 'lucide-react'
import { getCurrencyFromLocale, type CurrencyConfig, CURRENCIES } from '@/lib/currency'

let stripePromise: ReturnType<typeof loadStripe> | null = null

function getStripePromise() {
  if (stripePromise) return stripePromise
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    console.error('[Stripe] Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    return null
  }
  stripePromise = loadStripe(key)
  return stripePromise
}

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    checkAuth()
    // Detect user's currency using IP-based detection
    detectUserCurrency()
  }, [])

  const detectUserCurrency = async () => {
    try {
      // Try IP-based detection first
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      const countryCode = data.country_code
      
      // Map country to currency
      const currencyMap: Record<string, string> = {
        GB: 'GBP', US: 'USD', CA: 'CAD', AU: 'AUD', IN: 'INR',
        // Eurozone countries
        AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR',
        FR: 'EUR', DE: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR',
        LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', NL: 'EUR',
        PT: 'EUR', SK: 'EUR', SI: 'EUR', ES: 'EUR',
      }
      
      const currencyCode = currencyMap[countryCode] || 'GBP'
      const currency = CURRENCIES[currencyCode]
      
      setUserCurrency(currency)
    } catch (error) {
      console.error('IP-based currency detection failed, using locale fallback:', error)
      // Fallback to locale-based detection
      const currency = getCurrencyFromLocale()
      setUserCurrency(currency)
    }
  }

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
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      
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
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to cancel subscription' }))
        throw new Error(data.message || data.error || 'Failed to cancel subscription')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message || 'Subscription cancelled successfully.')
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

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to delete account' }))
        throw new Error(data.message || data.error || 'Failed to delete account')
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Account deleted successfully. Redirecting...')
        setShowDeleteDialog(false)
        // Sign out and redirect to home
        await supabase.auth.signOut()
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        throw new Error(data.message || data.error || 'Failed to delete account')
      }
    } catch (error: any) {
      console.error('Delete account error:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpgrade = async (plan: 'monthly' | 'annual' = 'monthly') => {
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
          plan: plan,
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Failed to create checkout session' }))
        throw new Error(result.error || 'Failed to create checkout session')
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      const { sessionId } = result

      const stripeLoader = getStripePromise()
      if (!stripeLoader) {
        throw new Error('Stripe is not configured')
      }

      const stripe = await stripeLoader
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-400 hover:text-white mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-black">Subscription</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pro Purchase Management */}
        {isPro && (
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-3xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Pro Plan Active</h2>
                  <p className="text-green-100 text-lg">Unlimited access to all features</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    Current Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Plan</span>
                      <span className="font-semibold text-white">CV Adapter Pro</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Price</span>
                      <span className="font-semibold text-green-400">£2.99/month</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Generations</span>
                      <span className="font-semibold text-white">{usage?.lifetime_generation_count || 0} used (unlimited)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Purchased</span>
                      <span className="font-semibold text-white">
                        {purchase?.purchased_at 
                          ? new Date(purchase.purchased_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Status</span>
                      <span className="font-semibold text-green-400 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                    Pro Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Unlimited CV generations
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Unlimited cover letters
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      All export formats (PDF, DOCX, TXT)
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Premium templates
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Priority support
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Interview prep tools
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={fetchInvoices}
                      disabled={isLoadingInvoices}
                      className="flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 border border-white/20"
                    >
                      {isLoadingInvoices ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                      className="flex items-center px-6 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/30"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </button>
                  </div>

                  {/* Invoices List */}
                  {invoices.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-bold text-white mb-4 text-lg">Invoices</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold text-white">
                                  {invoice.number || `Invoice ${invoice.id.slice(-8)}`}
                                </span>
                                <span className={`text-xs px-3 py-1 rounded-full ${
                                  invoice.status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-gray-400 border border-white/10'
                                }`}>
                                  {invoice.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {new Date(invoice.created * 1000).toLocaleDateString()} • {invoice.currency} {invoice.amount.toFixed(2)}
                              </div>
                            </div>
                            {invoice.invoice_pdf && (
                              <a
                                href={invoice.invoice_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <p className="text-sm text-gray-400">
                      Need help? Contact support at{' '}
                      <a href="mailto:jakedalerourke@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mr-4 border border-red-500/30">
                  <XCircle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Cancel Subscription?</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Are you sure you want to cancel? You'll lose access to Pro features at the end of your current billing period.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 border border-white/20 font-semibold"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold"
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
          <div className="text-center mb-16">
            {/* Hero Section for Pricing */}
            <div className="mb-12">
              <h1 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
                Unlock Your Full
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Potential</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join 10,000+ professionals using CV Adapter Pro to land their dream jobs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
                  <div className="text-5xl font-black text-white mb-2">{userCurrency.symbol}0</div>
                  <div className="text-gray-400">forever</div>
                </div>

                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>1 free CV generation</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>All export formats</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>

                <button
                  disabled
                  className="w-full py-4 px-6 bg-white/10 text-gray-400 rounded-xl cursor-not-allowed font-semibold border border-white/10"
                >
                  Current Plan
                </button>
              </div>

              {/* Monthly Pro Plan */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border-2 border-blue-500/50 rounded-2xl p-8 relative hover:scale-105 transition-all">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>

                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-blue-400 mr-2" />
                    Monthly
                  </h3>
                  <div className="text-5xl font-black text-white mb-2">{userCurrency.displayAmount}</div>
                  <div className="text-gray-400">per month</div>
                </div>

                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Unlimited CV generations</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>All export formats</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                    <span>AI cover letters</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Zap className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                    <span>Advanced AI features</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('monthly')}
                  disabled={isUpgrading || isPro}
                  className="w-full py-4 px-6 bg-white text-black rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-black text-lg shadow-lg"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Upgrade to Pro
                    </>
                  )}
                </button>
              </div>

              {/* Annual Pro Plan */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border-2 border-green-500/50 rounded-2xl p-8 relative hover:scale-105 transition-all">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    SAVE {userCurrency.annualSavings}
                  </span>
                </div>

                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-400 mr-2" />
                    Annual
                  </h3>
                  <div className="text-5xl font-black text-white mb-2">{userCurrency.annualDisplayAmount}</div>
                  <div className="text-gray-400">per year</div>
                  <div className="text-green-400 text-sm font-semibold mt-2">Just {userCurrency.annualMonthlyEquivalent}/month</div>
                </div>

                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Everything in Monthly</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Unlimited CV generations</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>All export formats</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>AI cover letters</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Zap className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>Advanced AI features</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('annual')}
                  disabled={isUpgrading || isPro}
                  className="w-full py-4 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-black text-lg shadow-lg"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Get Annual Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No hidden fees</span>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-black text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">Can I cancel anytime?</h3>
              <p className="text-gray-400 leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">What payment methods?</h3>
              <p className="text-gray-400 leading-relaxed">We accept all major credit cards (Visa, Mastercard, Amex) through our secure Stripe payment processor.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">Is my data secure?</h3>
              <p className="text-gray-400 leading-relaxed">Absolutely. We use industry-standard encryption and never store your payment info. All data is processed securely.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">What's included in Pro?</h3>
              <p className="text-gray-400 leading-relaxed">Unlimited CV generations, all export formats (PDF, DOCX, TXT), 12+ premium templates, AI cover letters, and priority support.</p>
            </div>
          </div>
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="mt-12 bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
            <XCircle className="w-6 h-6 mr-2" />
            Danger Zone
          </h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Once you delete your account, there is no going back. This will permanently delete your account, all your CVs, generations, cover letters, and all associated data.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
          >
            Delete Account
          </button>
        </div>

        {/* Cancel Subscription Dialog - Duplicate check */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Are you sure you want to cancel? You'll lose access to Pro features at the end of your billing period.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 border border-white/20 font-semibold"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold"
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

        {/* Delete Account Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-red-500/30 shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Delete Account Permanently?</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                This action <strong className="text-red-400">cannot be undone</strong>. This will permanently delete:
              </p>
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <li>Your account and profile</li>
                <li>All uploaded CVs</li>
                <li>All CV generations</li>
                <li>All cover letters</li>
                <li>All interview prep data</li>
                <li>All subscription data</li>
              </ul>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 border border-white/20 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Forever'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
