'use client'

import { useState, useEffect } from 'react'
import { X, Crown, Zap, Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UpgradePromptModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: 'limit_reached' | 'second_generation' | 'manual'
  generationsUsed: number
  maxGenerations: number
}

export default function UpgradePromptModal({
  isOpen,
  onClose,
  trigger,
  generationsUsed,
  maxGenerations
}: UpgradePromptModalProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleUpgrade = () => {
    router.push('/subscription')
  }

  if (!isOpen) return null

  const isLimitReached = generationsUsed >= maxGenerations

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isLimitReached ? 'Limit Reached!' : 'Almost There!'}
              </h2>
              <p className="text-purple-100 text-sm">
                {isLimitReached 
                  ? `You've used all ${maxGenerations} free generations`
                  : `${generationsUsed}/${maxGenerations} free generations used`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isLimitReached ? (
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-4">
                You've reached your free generation limit. Upgrade to <span className="font-semibold text-purple-600">Pro</span> to continue creating professional CVs!
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-4">
                You've used your <span className="font-semibold">{generationsUsed} of {maxGenerations}</span> free generations. 
                Upgrade now to unlock unlimited CV generations!
              </p>
            </div>
          )}

          {/* Pro Features */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Pro Features</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Unlimited CV generations',
                'Unlimited cover letters',
                'Unlimited interview prep',
                'Priority support',
                'Advanced AI customization',
                'Export to multiple formats'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">£9.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600">Cancel anytime. No hidden fees.</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {!isLimitReached && (
              <button
                onClick={handleClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure payment via Stripe • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
