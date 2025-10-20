'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Sparkles, Download, Eye } from 'lucide-react'
import confetti from 'canvas-confetti'

interface SuccessAnimationProps {
  title?: string
  message?: string
  onViewClick?: () => void
  onDownloadClick?: () => void
  showConfetti?: boolean
}

export function SuccessAnimation({
  title = 'Success!',
  message = 'Your CV has been generated successfully',
  onViewClick,
  onDownloadClick,
  showConfetti = true
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)

    // Trigger confetti
    if (showConfetti) {
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [showConfetti])

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 border-2 border-green-200 shadow-lg">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span>{title}</span>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </h3>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Action Buttons */}
        {(onViewClick || onDownloadClick) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onViewClick && (
              <button
                onClick={onViewClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                View CV
              </button>
            )}
            {onDownloadClick && (
              <button
                onClick={onDownloadClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition-all border-2 border-gray-200 hover:border-gray-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            )}
          </div>
        )}

        {/* Sparkle Effects */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className="w-4 h-4 text-yellow-400 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Simple success toast with checkmark
 */
export function SuccessToast({ message }: { message: string }) {
  return (
    <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <p className="text-sm font-medium text-green-900">{message}</p>
    </div>
  )
}
