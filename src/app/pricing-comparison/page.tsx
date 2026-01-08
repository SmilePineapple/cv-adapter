'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  FileText,
  Download,
  Globe,
  MessageSquare,
  Target,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'

export default function PricingComparisonPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: usage } = await supabase
          .from('usage_tracking')
          .select('plan_type')
          .eq('user_id', user.id)
          .single()

        setIsPro(usage?.plan_type === 'pro')
      }
    } catch (error) {
      console.error('Error checking user status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    if (!user) {
      router.push('/auth/signup')
    } else {
      router.push('/subscription')
    }
  }

  const features = [
    {
      category: "CV Generation",
      items: [
        { name: "CV Generations", free: "1 basic generation", pro: "Unlimited expert generations", icon: FileText },
        { name: "AI Quality", free: "Basic AI assistant", pro: "Expert CV writer (20+ years exp)", icon: Sparkles },
        { name: "ATS Optimization", free: "❌ Not included", pro: "✅ 95%+ ATS score guaranteed", icon: Target, highlight: true },
        { name: "Keyword Matching", free: "Basic", pro: "Advanced with density analysis", icon: TrendingUp },
        { name: "Professional Summary", free: "Template-based", pro: "Custom AI-written for each job", icon: Award },
      ]
    },
    {
      category: "Templates & Design",
      items: [
        { name: "CV Templates", free: "3 basic templates", pro: "20+ premium templates", icon: Star },
        { name: "Template Customization", free: "Limited", pro: "Full customization", icon: Zap },
        { name: "Watermark", free: "✅ 'Generated with CV Adapter'", pro: "❌ No watermark", icon: Shield, highlight: true },
        { name: "Professional Styling", free: "Basic", pro: "Premium + Industry-specific", icon: Sparkles },
      ]
    },
    {
      category: "Download & Export",
      items: [
        { name: "Download Formats", free: "PDF only", pro: "PDF, DOCX, TXT, JSON, HTML", icon: Download, highlight: true },
        { name: "Unlimited Downloads", free: "❌ 1 download", pro: "✅ Unlimited", icon: Download },
        { name: "Version History", free: "❌ Not available", pro: "✅ Track all versions", icon: Clock },
      ]
    },
    {
      category: "Additional Features",
      items: [
        { name: "Cover Letters", free: "❌ Not included", pro: "✅ Unlimited AI cover letters", icon: MessageSquare, highlight: true },
        { name: "Interview Preparation", free: "❌ Not included", pro: "✅ AI mock interviews", icon: Target },
        { name: "Multi-Language Support", free: "English only", pro: "6 languages", icon: Globe },
        { name: "CV Revisions", free: "❌ Cannot edit after generation", pro: "✅ Unlimited revisions", icon: FileText },
        { name: "Priority Support", free: "❌ Community support", pro: "✅ 24h email response", icon: Shield },
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CV Adapter</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free vs Pro Comparison
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly what you get with each plan. Upgrade anytime to unlock premium features.
          </p>
        </div>

        {/* Quick Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h2>
              <div className="text-4xl font-bold text-gray-900 mb-2">£0</div>
              <p className="text-gray-600">Perfect for trying out CV Adapter</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">1 basic CV generation</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">3 basic templates</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">PDF download</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">No ATS optimization</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">Watermarked CVs</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">No cover letters</span>
              </div>
            </div>

            {!user && (
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Get Started Free
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 border-2 border-blue-600 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
            </div>

            <div className="text-center mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
              <div className="text-4xl font-bold mb-2">£2.99<span className="text-xl">/month</span></div>
              <p className="text-blue-100">Everything you need to land your dream job</p>
            </div>

            <div className="space-y-3 mb-8 text-white">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited expert CV generations</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">95%+ ATS score guaranteed</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">20+ premium templates</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">5 download formats</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">No watermarks</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited cover letters</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Interview preparation</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Priority support</span>
              </div>
            </div>

            {isPro ? (
              <div className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-semibold text-center">
                ✓ Current Plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <div className="mt-4 text-center text-blue-100 text-sm">
              Cancel anytime • No hidden fees
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Detailed Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-blue-50">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-blue-600" />
                      <span>Pro</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={`category-${categoryIndex}`} className="bg-gray-100">
                      <td colSpan={3} className="px-6 py-3 text-sm font-bold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => {
                      const Icon = item.icon
                      return (
                        <tr 
                          key={`item-${categoryIndex}-${itemIndex}`}
                          className={item.highlight ? 'bg-yellow-50' : ''}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-900 font-medium">{item.name}</span>
                              {item.highlight && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-gray-600">
                            {item.free}
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-blue-600 bg-blue-50">
                            {item.pro}
                          </td>
                        </tr>
                      )
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Perfect CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who landed their dream jobs with CV Adapter Pro
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <span>Upgrade to Pro - £2.99/month</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
            
            {!user && (
              <button
                onClick={() => router.push('/auth/signup')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Start Free
              </button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Secure payment</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I upgrade anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade from Free to Pro at any time. Your Pro features activate immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">What if I'm not satisfied?</h3>
              <p className="text-gray-600">
                You can cancel your subscription anytime from your account settings. No questions asked.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I cancel my Pro subscription?</h3>
              <p className="text-gray-600">
                Yes, you can cancel anytime. You'll keep Pro access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">What's the difference in AI quality?</h3>
              <p className="text-gray-600">
                Free uses a basic AI assistant. Pro uses an expert CV writer with 20+ years experience, resulting in significantly better CVs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
