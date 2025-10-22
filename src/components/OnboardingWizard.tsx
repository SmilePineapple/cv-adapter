'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, FileText, Download, CheckCircle, Sparkles } from 'lucide-react'

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const steps = [
    {
      title: "Welcome to CV Adapter! 👋",
      description: "Let's get you started with creating your first ATS-optimized CV in just 2 minutes",
      icon: Sparkles,
      action: "Get Started",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Step 1: Upload Your CV",
      description: "Upload your existing CV in PDF or Word format. We'll extract all the important information automatically.",
      icon: Upload,
      action: "Next",
      color: "bg-blue-100 text-blue-600",
      tip: "💡 Tip: Make sure your CV is in English or one of 50+ supported languages"
    },
    {
      title: "Step 2: Paste Job Description",
      description: "Copy and paste the job description you're applying for. Our AI will tailor your CV to match the requirements perfectly.",
      icon: FileText,
      action: "Next",
      color: "bg-green-100 text-green-600",
      tip: "💡 Tip: Include the full job description for best results"
    },
    {
      title: "Step 3: Download Your CV",
      description: "Choose from 12 professional templates and download your optimized CV. Free users get 1 generation, Pro users get 100!",
      icon: Download,
      action: "Start Creating",
      color: "bg-orange-100 text-orange-600",
      tip: "🎉 You're ready to land your dream job!"
    }
  ]

  const currentStep = steps[step - 1]

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    } else {
      // Last step - redirect to upload
      onComplete()
      router.push('/upload')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Skip onboarding"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${currentStep.color} rounded-full mb-4 animate-in zoom-in duration-500`}>
            <currentStep.icon className="w-10 h-10" />
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentStep.title}
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {currentStep.description}
          </p>
          
          {/* Tip */}
          {currentStep.tip && (
            <div className="mt-4 inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <p className="text-sm text-yellow-800">{currentStep.tip}</p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index + 1 === step
                  ? 'w-8 bg-blue-600'
                  : index + 1 < step
                  ? 'w-2 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {currentStep.action}
          </button>
        </div>

        {/* Skip link */}
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
