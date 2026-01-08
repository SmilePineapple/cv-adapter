'use client'

import { useState } from 'react'
import { X, Crown, Sparkles, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StrategicUpgradePromptProps {
  trigger: 'before_generation' | 'after_preview' | 'before_download' | 'after_download' | 'multiple_views'
  onClose: () => void
  onUpgrade?: () => void
}

export function StrategicUpgradePrompt({ trigger, onClose, onUpgrade }: StrategicUpgradePromptProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/subscription')
    }
  }


  const content = {
    before_generation: {
      icon: <Sparkles className="w-12 h-12 text-yellow-500" />,
      title: "🎉 You're about to generate your first CV!",
      subtitle: "Pro users get unlimited generations + ATS optimization",
      benefits: [
        "Unlimited CV generations for different jobs",
        "95%+ ATS score guaranteed",
        "20+ premium templates",
        "Cover letter generator included",
        "No watermarks on your CVs"
      ],
      cta: "Upgrade to Pro - £2.99/month",
      secondaryCta: "Continue with Free (1 generation)",
      highlight: "Cancel anytime, no commitment"
    },
    after_preview: {
      icon: <Crown className="w-12 h-12 text-purple-500" />,
      title: "Love your CV?",
      subtitle: "Pro members get even better results",
      benefits: [
        "Unlimited revisions and regenerations",
        "ATS score 95%+ guaranteed (vs 60% free)",
        "Expert-level AI writing (vs basic)",
        "10+ premium templates",
        "Download in 5 formats (PDF, DOCX, TXT, JSON, HTML)"
      ],
      cta: "Upgrade to Pro - £2.99/month",
      secondaryCta: "Continue with Free",
      highlight: "Cancel anytime, no commitment"
    },
    before_download: {
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      title: "Ready to download?",
      subtitle: "Pro members unlock premium features",
      benefits: [
        "Download in 5 formats (not just PDF)",
        "Choose from 20+ professional templates",
        "Remove 'Generated with CV Adapter' watermark",
        "Unlimited regenerations for different jobs",
        "Priority support"
      ],
      cta: "Upgrade Now - £2.99/month",
      secondaryCta: "Download Free Version (PDF only)",
      highlight: "Upgrade anytime, cancel anytime"
    },
    after_download: {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      title: "Great! Your CV is ready.",
      subtitle: "Applying to multiple jobs?",
      benefits: [
        "Generate unlimited CVs for different roles",
        "Tailor each CV to specific job descriptions",
        "Create matching cover letters",
        "Interview preparation tools",
        "First month just £1"
      ],
      cta: "Get First Month for £1",
      secondaryCta: "Maybe Later",
      highlight: "Limited time offer - Save 67%"
    },
    multiple_views: {
      icon: <Sparkles className="w-12 h-12 text-indigo-500" />,
      title: "Perfecting your CV?",
      subtitle: "Pro members get unlimited revisions",
      benefits: [
        "Generate unlimited versions",
        "A/B test different approaches",
        "AI-powered improvement suggestions",
        "ATS optimization for each version",
        "Track which CV performs best"
      ],
      cta: "Upgrade to Pro - £2.99/month",
      secondaryCta: "Continue Editing",
      highlight: "Cancel anytime, no commitment"
    }
  }

  const { icon, title, subtitle, benefits, cta, secondaryCta, highlight } = content[trigger]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Highlight */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-gray-700">
              ✨ {highlight}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>{cta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleClose}
            className="w-full text-gray-600 py-2 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {secondaryCta}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No commitment</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
