'use client'

import { useState, useEffect } from 'react'
import { X, Check, Crown, Zap, Clock, Users, Shield, Star } from 'lucide-react'
import Link from 'next/link'

interface EnhancedUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'limit_reached' | 'feature_locked' | 'manual'
}

export default function EnhancedUpgradeModal({ isOpen, onClose, trigger = 'manual' }: EnhancedUpgradeModalProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [showOffer, setShowOffer] = useState(true)

  useEffect(() => {
    if (!isOpen || !showOffer) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowOffer(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, showOffer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  const headlines = {
    limit_reached: "You've Used Your Free Generation! 🎉",
    feature_locked: "Unlock This Pro Feature! ✨",
    manual: "Upgrade to CV Adapter Pro! 🚀"
  }

  const subheadlines = {
    limit_reached: "Great job! You've experienced the power of AI-powered CV generation. Ready to unlock unlimited access?",
    feature_locked: "This feature is available to Pro users. Upgrade now to unlock all premium features!",
    manual: "Join professionals who are landing more interviews with CV Adapter Pro"
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="text-center pt-8 px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {headlines[trigger]}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subheadlines[trigger]}
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 px-6 py-6 bg-gray-50 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">7</span>
              </div>
              <p className="text-sm text-gray-600">Pro Users</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900">4.9</span>
              </div>
              <p className="text-sm text-gray-600">User Rating</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">5hrs</span>
              </div>
              <p className="text-sm text-gray-600">Time Saved</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 px-6 py-8">
            {/* Monthly Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Pro</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">£2.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Cancel anytime</p>
              </div>
              <Link
                href="/subscription?plan=monthly"
                className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Start Monthly Plan
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="border-2 border-purple-500 rounded-xl p-6 relative bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  BEST VALUE - Save 59%
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Annual Pro</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">£49</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <p className="text-sm text-green-600 font-semibold mt-2">Just £4.08/month</p>
              </div>
              <Link
                href="/subscription?plan=annual"
                className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Start Annual Plan
              </Link>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="px-6 pb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              What You Get with Pro
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: <Zap className="w-5 h-5" />, text: "Unlimited CV generations", highlight: true },
                { icon: <Check className="w-5 h-5" />, text: "Unlimited cover letters" },
                { icon: <Check className="w-5 h-5" />, text: "AI interview preparation" },
                { icon: <Check className="w-5 h-5" />, text: "Advanced ATS optimization" },
                { icon: <Check className="w-5 h-5" />, text: "10+ professional templates" },
                { icon: <Check className="w-5 h-5" />, text: "50+ language support" },
                { icon: <Check className="w-5 h-5" />, text: "Priority customer support" },
                { icon: <Check className="w-5 h-5" />, text: "Export to all formats" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    feature.highlight ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 ${feature.highlight ? 'text-purple-600' : 'text-green-600'}`}>
                    {feature.icon}
                  </div>
                  <span className={`text-sm ${feature.highlight ? 'font-semibold text-purple-900' : 'text-gray-700'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>30-Day Money Back</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center px-6 py-4 bg-white">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
