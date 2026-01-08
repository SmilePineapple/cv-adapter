'use client'

import { useState, useEffect } from 'react'
import { X, Crown, Sparkles, CheckCircle, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface SmartUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: 'before_generation' | 'after_preview' | 'before_download' | 'after_views' | 'return_visit'
  userName?: string
}

export default function SmartUpgradeModal({ isOpen, onClose, trigger, userName }: SmartUpgradeModalProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowModal(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setShowModal(false)
    setTimeout(onClose, 300)
  }

  if (!isOpen && !showModal) return null

  const getContent = () => {
    switch (trigger) {
      case 'before_generation':
        return {
          emoji: '🎉',
          title: "You're About to Generate Your First CV!",
          subtitle: "Pro users get unlimited generations + ATS optimization",
          benefits: [
            { icon: <Zap className="w-5 h-5" />, text: "Unlimited CV generations for different jobs" },
            { icon: <TrendingUp className="w-5 h-5" />, text: "95%+ ATS score guaranteed" },
            { icon: <Sparkles className="w-5 h-5" />, text: "20+ premium templates" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Cover letter generator included" }
          ],
          cta: "Try Pro Free for 7 Days",
          ctaSecondary: "Continue with Free (1 generation)",
          highlight: "No credit card required for trial"
        }

      case 'after_preview':
        return {
          emoji: '💼',
          title: "Love Your CV?",
          subtitle: "Pro members get unlimited revisions and premium features",
          benefits: [
            { icon: <Sparkles className="w-5 h-5" />, text: "Unlimited CV revisions" },
            { icon: <TrendingUp className="w-5 h-5" />, text: "ATS score 95%+ guaranteed" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "10+ premium templates" },
            { icon: <Crown className="w-5 h-5" />, text: "Priority support" }
          ],
          cta: "Upgrade to Pro - £2.99/month",
          ctaSecondary: "Maybe Later",
          highlight: "Join 5,000+ Pro members"
        }

      case 'before_download':
        return {
          emoji: '📥',
          title: "Ready to Download?",
          subtitle: "Pro members unlock all formats and templates",
          benefits: [
            { icon: <CheckCircle className="w-5 h-5" />, text: "Download in 5 formats (PDF, DOCX, HTML, TXT, JSON)" },
            { icon: <Sparkles className="w-5 h-5" />, text: "Choose from 20+ premium templates" },
            { icon: <Zap className="w-5 h-5" />, text: "Unlimited regenerations" },
            { icon: <Crown className="w-5 h-5" />, text: "No watermark on exports" }
          ],
          cta: "Upgrade to Unlock All Formats",
          ctaSecondary: "Download PDF Only",
          highlight: "One-time payment - £2.99/month"
        }

      case 'after_views':
        return {
          emoji: '✨',
          title: "Perfecting Your CV?",
          subtitle: "Pro members get AI-powered suggestions while editing",
          benefits: [
            { icon: <Sparkles className="w-5 h-5" />, text: "AI-powered editing suggestions" },
            { icon: <TrendingUp className="w-5 h-5" />, text: "Real-time ATS optimization" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Unlimited versions for different jobs" },
            { icon: <Zap className="w-5 h-5" />, text: "Interview prep included" }
          ],
          cta: "Try Pro Free for 7 Days",
          ctaSecondary: "Continue Editing",
          highlight: "Cancel anytime - no commitment"
        }

      case 'return_visit':
        return {
          emoji: '👋',
          title: `Welcome Back${userName ? `, ${userName}` : ''}!`,
          subtitle: "Applying to multiple jobs? Get unlimited CV generations",
          benefits: [
            { icon: <Zap className="w-5 h-5" />, text: "Generate unlimited CVs for different roles" },
            { icon: <Sparkles className="w-5 h-5" />, text: "Tailor each CV to specific job descriptions" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Cover letters for every application" },
            { icon: <Crown className="w-5 h-5" />, text: "Interview prep for each role" }
          ],
          cta: "Upgrade to Pro - £2.99/month",
          ctaSecondary: "Not Now",
          highlight: "Most users upgrade after 2nd visit"
        }

      default:
        return {
          emoji: '🚀',
          title: "Upgrade to Pro",
          subtitle: "Unlock all features",
          benefits: [
            { icon: <Sparkles className="w-5 h-5" />, text: "Unlimited generations" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "All premium features" }
          ],
          cta: "Upgrade Now",
          ctaSecondary: "Maybe Later",
          highlight: "£2.99/month"
        }
    }
  }

  const content = getContent()

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{content.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.title}
            </h2>
            <p className="text-gray-600">
              {content.subtitle}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-blue-600 flex-shrink-0 mt-0.5">
                  {benefit.icon}
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          {/* Highlight */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 mb-6 text-center">
            <p className="text-sm font-semibold text-blue-900">
              ✨ {content.highlight}
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              href="/subscription"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-center"
            >
              {content.cta}
            </Link>
            <button
              onClick={handleClose}
              className="block w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors text-center"
            >
              {content.ctaSecondary}
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Rated 4.9/5 by 1,247 users
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
