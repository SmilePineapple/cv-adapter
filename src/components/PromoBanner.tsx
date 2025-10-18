'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Sparkles, Clock, TrendingUp, Zap } from 'lucide-react'

interface PromoBannerProps {
  variant?: 'homepage' | 'dashboard'
  onClose?: () => void
}

export default function PromoBanner({ variant = 'homepage', onClose }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0 })

  // Calculate time remaining until October 31st, 11:59pm
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set promo end date: October 31st, 2025 at 11:59pm
      const endDate = new Date('2025-10-31T23:59:59')
      
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
    // Store in localStorage so it doesn't show again for 24 hours
    localStorage.setItem('promoBannerClosed', Date.now().toString())
  }

  // Check if banner was closed recently
  useEffect(() => {
    const closedTime = localStorage.getItem('promoBannerClosed')
    if (closedTime) {
      const hoursSinceClosed = (Date.now() - parseInt(closedTime)) / (1000 * 60 * 60)
      if (hoursSinceClosed < 24) {
        setIsVisible(false)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {variant === 'homepage' ? (
        // Homepage Banner - Full width, very prominent
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left side - Main message */}
              <div className="flex items-center gap-4 flex-1">
                <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm animate-bounce">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="inline-block px-3 py-1 bg-yellow-400 text-red-900 text-xs font-bold rounded-full uppercase tracking-wide animate-pulse">
                      🎉 Launch Special
                    </span>
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                      Limited Time
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-1">
                    50% OFF Pro Plan!
                  </h2>
                  <p className="text-sm md:text-base opacity-95">
                    Get 100 Lifetime Generations for just <span className="font-bold text-yellow-300 text-xl">£2.50</span>
                    <span className="line-through ml-2 opacity-75">£5.00</span>
                  </p>
                </div>
              </div>

              {/* Middle - Countdown */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-300 animate-pulse" />
                <div className="flex gap-2">
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-xs opacity-90">Days</div>
                  </div>
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-xs opacity-90">Hours</div>
                  </div>
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-xs opacity-90">Mins</div>
                  </div>
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href="/subscription"
                  className="group relative px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-yellow-300 hover:text-red-700 transition-all transform hover:scale-105 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Claim 50% Off
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom - Offer details */}
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="opacity-90">One-time payment • Lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-300" />
                <span className="opacity-90">Offer ends October 31st</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard Banner - Compact but eye-catching
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-2xl overflow-hidden mb-6 animate-pulse-slow">
          {/* Animated sparkles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 animate-ping">✨</div>
            <div className="absolute top-4 right-8 animate-ping delay-100">⚡</div>
            <div className="absolute bottom-3 left-1/3 animate-ping delay-200">🎉</div>
          </div>

          <div className="relative px-6 py-4">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left - Message */}
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 bg-yellow-400 text-red-900 text-xs font-bold rounded uppercase">
                      🔥 50% OFF
                    </span>
                    <span className="text-xs font-semibold">Limited Time Only!</span>
                  </div>
                  <p className="text-lg font-bold">
                    Upgrade to Pro for just <span className="text-yellow-300 text-2xl">£2.50</span>
                    <span className="line-through ml-2 text-base opacity-75">£5.00</span>
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    Get 100 lifetime generations • Offer ends Oct 31st
                  </p>
                </div>
              </div>

              {/* Right - CTA & Countdown */}
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/subscription"
                  className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-yellow-300 hover:text-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Claim Your Discount
                </Link>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span>Ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
