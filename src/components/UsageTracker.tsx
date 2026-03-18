'use client'

import { Crown, Zap, TrendingUp, Upload } from 'lucide-react'
import Link from 'next/link'

interface UsageTrackerProps {
  currentUsage: number
  maxGenerations: number
  isPro: boolean
  onUpgradeClick?: () => void
}

export default function UsageTracker({ 
  currentUsage, 
  maxGenerations, 
  isPro,
  onUpgradeClick 
}: UsageTrackerProps) {
  const remaining = maxGenerations - currentUsage
  const percentage = (currentUsage / maxGenerations) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = currentUsage >= maxGenerations

  return (
    <div className={`rounded-2xl border-2 p-4 backdrop-blur-md ${
      isAtLimit 
        ? 'bg-red-500/10 border-red-500/30' 
        : isNearLimit 
        ? 'bg-orange-500/10 border-orange-500/30' 
        : 'bg-blue-500/10 border-blue-500/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${
            isAtLimit ? 'text-red-400' : isNearLimit ? 'text-orange-400' : 'text-blue-400'
          }`} />
          <h3 className="font-black text-white">
            {isPro ? 'Pro Plan' : 'Free Plan'}
          </h3>
          {isPro && <Crown className="w-4 h-4 text-purple-400" />}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black ${
            isAtLimit ? 'text-red-400' : isNearLimit ? 'text-orange-400' : 'text-blue-400'
          }`}>
            {remaining}
          </div>
          <div className="text-xs text-gray-400">remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>{currentUsage} used</span>
          <span>{maxGenerations} total</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isAtLimit 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : isNearLimit 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Call to Action */}
      {!isPro && (
        <>
          {isAtLimit ? (
            <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/30">
              <p className="text-sm font-black text-red-400 mb-2">
                🚫 You've used all your free generations!
              </p>
              <p className="text-xs text-red-300 mb-3">
                Upgrade to Pro for unlimited generations at just £2.99/month
              </p>
              {onUpgradeClick ? (
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Upgrade to Pro - £2.99/month
                </button>
              ) : (
                <Link
                  href="/subscription"
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all text-center"
                >
                  Upgrade to Pro - £2.99/month
                </Link>
              )}
            </div>
          ) : isNearLimit ? (
            <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/30">
              <p className="text-sm font-black text-orange-400 mb-2">
                ⚠️ Almost out of generations!
              </p>
              <p className="text-xs text-orange-300 mb-3">
                Upgrade now for unlimited generations at £2.99/month
              </p>
              {onUpgradeClick ? (
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Upgrade to Pro - £2.99/month
                </button>
              ) : (
                <Link
                  href="/subscription"
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all text-center"
                >
                  Upgrade to Pro - £2.99/month
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/30">
              <p className="text-xs text-gray-300 mb-2">
                💡 <span className="font-black">Pro Tip:</span> Upgrade to Pro for unlimited generations at £2.99/month
              </p>
              {onUpgradeClick ? (
                <button
                  onClick={onUpgradeClick}
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Learn more →
                </button>
              ) : (
                <Link
                  href="/subscription"
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Learn more →
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {/* Pro User Message */}
      {isPro && (
        <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-purple-400" />
            <p className="text-sm font-black text-purple-400">
              Pro Member
            </p>
          </div>
          <p className="text-xs text-gray-300">
            {remaining > 0 
              ? `Unlimited generations available. Keep creating amazing CVs!`
              : "Unlimited generations available. Keep creating amazing CVs!"
            }
          </p>
        </div>
      )}

      {/* Upload CV & Photo Button - Secondary Action */}
      <div className="mt-4">
        <Link
          href="/upload"
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl font-black hover:bg-white/20 transition-colors gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload CV & Photo
        </Link>
      </div>
    </div>
  )
}
