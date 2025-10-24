'use client'

import { AlertTriangle, XCircle, WifiOff, Clock, CreditCard, RefreshCw, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export type ErrorType = 
  | 'network'
  | 'validation'
  | 'limit'
  | 'authentication'
  | 'file'
  | 'server'
  | 'generic'

interface ErrorMessageProps {
  type: ErrorType
  title?: string
  message?: string
  onRetry?: () => void
  onAction?: () => void
  actionLabel?: string
  actionLink?: string
}

export function ErrorMessage({
  type,
  title,
  message,
  onRetry,
  onAction,
  actionLabel,
  actionLink
}: ErrorMessageProps) {
  const errorConfig = {
    network: {
      icon: WifiOff,
      color: 'orange',
      defaultTitle: 'Connection Lost',
      defaultMessage: "We couldn't reach our servers. Please check your internet connection and try again.",
      showRetry: true
    },
    validation: {
      icon: AlertTriangle,
      color: 'yellow',
      defaultTitle: 'Missing Information',
      defaultMessage: 'Please fill in all required fields to continue.',
      showRetry: false
    },
    limit: {
      icon: Clock,
      color: 'blue',
      defaultTitle: 'Generation Limit Reached',
      defaultMessage: "You've used your free generation. Upgrade to Pro for 100 more!",
      showRetry: false
    },
    authentication: {
      icon: XCircle,
      color: 'red',
      defaultTitle: 'Session Expired',
      defaultMessage: 'Your session has expired. Please log in again to continue.',
      showRetry: false
    },
    file: {
      icon: AlertTriangle,
      color: 'orange',
      defaultTitle: 'File Upload Error',
      defaultMessage: 'Please upload a valid PDF, DOCX, or TXT file.',
      showRetry: true
    },
    server: {
      icon: XCircle,
      color: 'red',
      defaultTitle: 'Server Error',
      defaultMessage: 'Something went wrong on our end. Please try again in a moment.',
      showRetry: true
    },
    generic: {
      icon: AlertTriangle,
      color: 'gray',
      defaultTitle: 'Error',
      defaultMessage: 'An unexpected error occurred. Please try again.',
      showRetry: true
    }
  }

  const config = errorConfig[type]
  const Icon = config.icon
  const displayTitle = title || config.defaultTitle
  const displayMessage = message || config.defaultMessage

  const colorClasses = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
      button: 'bg-orange-600 hover:bg-orange-700'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100',
      button: 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const colors = colorClasses[config.color as keyof typeof colorClasses]

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6`}>
      <div className="flex items-start space-x-4">
        <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {displayTitle}
          </h3>
          <p className="text-gray-700 mb-4">
            {displayMessage}
          </p>
          <div className="flex flex-wrap gap-3">
            {config.showRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center px-4 py-2 ${colors.button} text-white rounded-lg font-medium transition-colors`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            {actionLink && (
              <Link
                href={actionLink}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {actionLabel || 'Learn More'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
            {onAction && !actionLink && (
              <button
                onClick={onAction}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {actionLabel || 'Fix Now'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline error message for forms
 */
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/**
 * Payment required error
 */
export function PaymentRequiredError({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <ErrorMessage
      type="limit"
      title="Upgrade to Continue"
      message="You've reached your free generation limit. Upgrade to Pro for £9.99/month to unlock unlimited generations!"
      actionLabel="Upgrade Now"
      actionLink="/subscription"
    />
  )
}

/**
 * Authentication error
 */
export function AuthenticationError() {
  return (
    <ErrorMessage
      type="authentication"
      title="Please Log In"
      message="You need to be logged in to access this feature."
      actionLabel="Log In"
      actionLink="/auth/login"
    />
  )
}
