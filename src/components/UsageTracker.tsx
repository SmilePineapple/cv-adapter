'use client'

import { Crown, Zap, TrendingUp } from 'lucide-react'
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
    <div className={`rounded-lg border-2 p-4 ${
      isAtLimit 
        ? 'bg-red-50 border-red-300' 
        : isNearLimit 
        ? 'bg-orange-50 border-orange-300' 
        : 'bg-blue-50 border-blue-300'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${
            isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-blue-600'
          }`} />
          <h3 className="font-semibold text-gray-900">
            {isPro ? 'Pro Plan' : 'Free Plan'}
          </h3>
          {isPro && <Crown className="w-4 h-4 text-purple-600" />}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-blue-600'
          }`}>
            {remaining}
          </div>
          <div className="text-xs text-gray-600">remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{currentUsage} used</span>
          <span>{maxGenerations} total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm font-semibold text-red-900 mb-2">
                🚫 You've used all your free generations!
              </p>
              <p className="text-xs text-red-700 mb-3">
                Upgrade to Pro for 100 more generations at just £0.05 each
              </p>
              {onUpgradeClick ? (
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Upgrade to Pro - £5
                </button>
              ) : (
                <Link
                  href="/subscription"
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all text-center"
                >
                  Upgrade to Pro - £5
                </Link>
              )}
            </div>
          ) : isNearLimit ? (
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <p className="text-sm font-semibold text-orange-900 mb-2">
                ⚠️ Almost out of generations!
              </p>
              <p className="text-xs text-orange-700 mb-3">
                Upgrade now to get 100 generations for just £5 (£0.05 each)
              </p>
              {onUpgradeClick ? (
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Upgrade to Pro - £5
                </button>
              ) : (
                <Link
                  href="/subscription"
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all text-center"
                >
                  Upgrade to Pro - £5
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-gray-600 mb-2">
                💡 <span className="font-semibold">Pro Tip:</span> Upgrade to Pro for 100 generations at just £0.05 each
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
        <div className="bg-white rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-purple-600" />
            <p className="text-sm font-semibold text-purple-900">
              Pro Member
            </p>
          </div>
          <p className="text-xs text-gray-600">
            {remaining > 0 
              ? `You have ${remaining} generation${remaining !== 1 ? 's' : ''} remaining. Keep creating amazing CVs!`
              : "You've used all 100 generations. Contact support for more."
            }
          </p>
        </div>
      )}
    </div>
  )
}
