'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Crown, Check, Zap, TrendingUp, Shield, Star } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'limit_reached' | 'first_generation' | 'dashboard' | 'manual'
  currentUsage?: number
  maxGenerations?: number
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  trigger = 'manual',
  currentUsage = 0,
  maxGenerations = 1
}: UpgradeModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleUpgrade = () => {
    setIsLoading(true)
    router.push('/subscription')
  }

  // Different messaging based on trigger
  const getHeadline = () => {
    switch (trigger) {
      case 'limit_reached':
        return "You've Used Your Free Generation! 🎉"
      case 'first_generation':
        return "Great Job! Ready for More? 🚀"
      case 'dashboard':
        return "Unlock Your Full Potential 💪"
      default:
        return "Upgrade to Pro Today! 👑"
    }
  }

  const getSubheadline = () => {
    switch (trigger) {
      case 'limit_reached':
        return "You've experienced the power of AI-tailored CVs. Get unlimited generations for just £2.99/month!"
      case 'first_generation':
        return "You just created an amazing CV! Upgrade now for unlimited generations."
      case 'dashboard':
        return "Join hundreds of professionals who upgraded to Pro and landed their dream jobs."
      default:
        return "Transform your job search with unlimited AI-powered CV generation."
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{getHeadline()}</h2>
            <p className="text-lg text-purple-100">{getSubheadline()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Usage Stats (if applicable) */}
          {trigger === 'limit_reached' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-orange-900">
                    You've used {currentUsage} of {maxGenerations} free generation{maxGenerations > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-orange-700">
                    Upgrade now for unlimited generations!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 mb-6 relative overflow-hidden">
            {/* "Most Popular" Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              MOST POPULAR
            </div>
            
            <div className="flex items-start justify-between mb-4 mt-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                  Pro Plan
                </h3>
                <p className="text-gray-600">Recurring subscription. Cancel anytime.</p>
              </div>
              <div className="text-right">
                <div className="flex flex-col gap-1">
                  <div className="text-4xl font-bold text-purple-600">£2.99</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1">or £29.99/year (save 17%!)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-1">∞</div>
                <div className="text-gray-600">Unlimited Generations</div>
                <div className="text-sm text-gray-500 mt-1">Create as many CVs as you need</div>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Loading...' : '🚀 Upgrade to Pro Now'}
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <FeatureItem
              icon={<Check className="w-5 h-5" />}
              title="Unlimited Generations"
              description="Create as many CVs as you need for different jobs."
            />
            <FeatureItem
              icon={<Zap className="w-5 h-5" />}
              title="AI-Powered Tailoring"
              description="Match your CV to any job description instantly."
            />
            <FeatureItem
              icon={<TrendingUp className="w-5 h-5" />}
              title="ATS Optimization"
              description="Get past applicant tracking systems easily."
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5" />}
              title="Secure & Private"
              description="Your data is encrypted and never shared."
            />
            <FeatureItem
              icon={<Star className="w-5 h-5" />}
              title="14 Pro Templates"
              description="Access all templates including advanced designs."
            />
            <FeatureItem
              icon={<Crown className="w-5 h-5" />}
              title="Priority Support"
              description="Get help when you need it most."
            />
          </div>

          {/* Social Proof */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900">
                  Join 500+ professionals who upgraded
                </p>
                <p className="text-sm text-green-700">
                  "Best investment in my career. Generated 15 tailored CVs and landed my dream job!" - Sarah M.
                </p>
              </div>
            </div>
          </div>

          {/* Annual Plan Savings Banner */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-4 mb-6 text-center">
            <p className="text-2xl font-bold mb-1">💰 SAVE 17% WITH ANNUAL PLAN!</p>
            <p className="text-lg mb-2">
              Pay <span className="font-bold text-3xl">£29.99/year</span> instead of £35.88
            </p>
            <p className="text-sm opacity-90">
              That's only £2.50/month - cheaper than a coffee!
            </p>
            <p className="text-xs mt-2 opacity-75">
              Choose annual plan at checkout
            </p>
          </div>

          {/* Urgency Message */}
          {trigger === 'limit_reached' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-center text-red-900 font-semibold">
                ⚡ Continue your job search without interruption
              </p>
              <p className="text-center text-sm text-red-700 mt-1">
                Upgrade now and apply to unlimited jobs
              </p>
            </div>
          )}

          {/* Comparison Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-purple-700 bg-purple-50">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <ComparisonRow feature="CV Generations" free="1" pro="Unlimited" />
                <ComparisonRow feature="AI Expert Review" free="✗" pro="✓" />
                <ComparisonRow feature="Cover Letter Generator" free="✗" pro="✓" />
                <ComparisonRow feature="Professional Templates" free="3 basic" pro="14 (incl. advanced)" />
                <ComparisonRow feature="Export Formats" free="PDF only" pro="All formats" />
                <ComparisonRow feature="Watermark" free="Yes" pro="No" />
                <ComparisonRow feature="Priority Support" free="✗" pro="✓" />
              </tbody>
            </table>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              🛡️ <span className="font-semibold">30-Day Money-Back Guarantee</span> - Not satisfied? Get a full refund, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function ComparisonRow({ feature, free, pro }: { feature: string, free: string, pro: string }) {
  return (
    <tr>
      <td className="py-3 px-4 text-gray-900">{feature}</td>
      <td className="py-3 px-4 text-center text-gray-600">{free}</td>
      <td className="py-3 px-4 text-center font-semibold text-purple-600 bg-purple-50">{pro}</td>
    </tr>
  )
}
