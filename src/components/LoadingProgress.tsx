'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingProgressProps {
  steps?: string[]
  currentStep?: number
  message?: string
  showProgress?: boolean
}

const defaultSteps = [
  'Analyzing your CV...',
  'Understanding job requirements...',
  'AI is tailoring your experience...',
  'Optimizing for ATS...',
  'Finalizing your CV...',
]

export function LoadingProgress({
  steps = defaultSteps,
  currentStep,
  message,
  showProgress = true
}: LoadingProgressProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStep !== undefined) {
      setActiveStep(currentStep)
      setProgress(((currentStep + 1) / steps.length) * 100)
      return
    }

    // Auto-progress through steps if currentStep not provided
    const stepDuration = 1500 // 1.5 seconds per step
    const progressInterval = 50 // Update progress every 50ms

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, stepDuration)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + 1
        }
        return prev
      })
    }, progressInterval)

    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
    }
  }, [currentStep, steps.length])

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Spinner and Message */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        </div>
        <p className="text-sm font-medium text-gray-700 text-center animate-pulse">
          {message || steps[activeStep]}
        </p>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index <= activeStep
                ? 'w-8 bg-blue-600'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton Loader Component
 */
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <SkeletonLoader className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonLoader className="h-20 w-full" />
      <div className="flex space-x-2">
        <SkeletonLoader className="h-8 w-20" />
        <SkeletonLoader className="h-8 w-20" />
      </div>
    </div>
  )
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <SkeletonLoader className="w-10 h-10 rounded" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-3 w-2/3" />
          </div>
          <SkeletonLoader className="w-20 h-8 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Dashboard Stats Skeleton
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <SkeletonLoader className="h-4 w-24" />
              <SkeletonLoader className="h-8 w-16" />
            </div>
            <SkeletonLoader className="w-12 h-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
