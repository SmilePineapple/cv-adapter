'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, FileText, Target, Globe, Layout, Zap, Palette, BarChart3, Trophy } from 'lucide-react'
import Link from 'next/link'

interface Tip {
  id: number
  icon: React.ReactNode
  text: string
  cta: string
  link: string
  gradient: string
}

const tips: Tip[] = [
  {
    id: 1,
    icon: <FileText className="w-5 h-5" />,
    text: "Generate unlimited cover letters tailored to any job description",
    cta: "Try Cover Letters",
    link: "/cover-letter",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    icon: <Target className="w-5 h-5" />,
    text: "Use our ATS Optimizer to score 80%+ on applicant tracking systems",
    cta: "Optimize Now",
    link: "/dashboard",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    icon: <Sparkles className="w-5 h-5" />,
    text: "Generate custom interview prep with company research and practice questions",
    cta: "Prepare Now",
    link: "/interview-prep",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    icon: <Globe className="w-5 h-5" />,
    text: "Generate CVs in 50+ languages automatically - perfect for international jobs",
    cta: "Learn More",
    link: "/dashboard",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    icon: <Layout className="w-5 h-5" />,
    text: "Export to 10+ professional templates and find your perfect style",
    cta: "View Templates",
    link: "/templates",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    id: 6,
    icon: <Zap className="w-5 h-5" />,
    text: "Pro users get unlimited generations - never worry about limits again",
    cta: "Upgrade to Pro",
    link: "/subscription",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: 7,
    icon: <Palette className="w-5 h-5" />,
    text: "Customize your CV with our live editor - fonts, colors, and layouts",
    cta: "Try Editor",
    link: "/dashboard",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 8,
    icon: <BarChart3 className="w-5 h-5" />,
    text: "Track your applications and see which CVs perform best",
    cta: "View Stats",
    link: "/dashboard",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 9,
    icon: <Trophy className="w-5 h-5" />,
    text: "Pro users save an average of 5 hours per job application",
    cta: "Save Time",
    link: "/subscription",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    id: 10,
    icon: <Sparkles className="w-5 h-5" />,
    text: "Join 7 Pro users who've already upgraded - get unlimited access today",
    cta: "Join Now",
    link: "/subscription",
    gradient: "from-violet-500 to-purple-500"
  }
]

export default function RotatingTipsBar() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the tips bar
    const dismissed = localStorage.getItem('tipsBarDismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
      return
    }

    // Rotate tips every 10 seconds
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length)
        setIsAnimating(false)
      }, 300) // Animation duration
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('tipsBarDismissed', 'true')
  }

  if (!isVisible) return null

  const currentTip = tips[currentTipIndex]

  return (
    <div className={`bg-gradient-to-r ${currentTip.gradient} text-white shadow-lg mb-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {currentTip.icon}
            </div>
          </div>

          {/* Tip Text */}
          <div className={`flex-1 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <p className="text-sm sm:text-base font-medium">
              💡 <span className="font-semibold">Pro Tip:</span> {currentTip.text}
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href={currentTip.link}
            className="flex-shrink-0 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md"
          >
            {currentTip.cta}
          </Link>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss tips"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 pb-2">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentTipIndex 
                  ? 'w-8 bg-white' 
                  : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
