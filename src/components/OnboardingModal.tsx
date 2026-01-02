'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  X, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  Rocket,
  Upload,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const router = useRouter()
  const supabase = createSupabaseClient()

  if (!isOpen) return null

  const goals = [
    {
      id: 'new-job',
      title: 'Get a New Job',
      description: 'Tailor my CV for specific job applications',
      icon: Briefcase,
      color: 'blue'
    },
    {
      id: 'career-change',
      title: 'Change Career',
      description: 'Pivot to a new industry or role',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'international',
      title: 'Work Abroad',
      description: 'Apply for international opportunities',
      icon: Globe,
      color: 'green'
    },
    {
      id: 'improve',
      title: 'Improve My CV',
      description: 'Make my CV more professional and ATS-friendly',
      icon: Rocket,
      color: 'orange'
    }
  ]

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId)
  }

  const handleNext = () => {
    if (step === 1 && !selectedGoal) {
      toast.error('Please select your goal')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSkip = async () => {
    // Mark onboarding as completed (skipped)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)
    }
    onClose()
  }

  const handleUploadClick = () => {
    router.push('/upload')
    onComplete()
  }

  const handleComplete = async () => {
    // Mark onboarding as completed
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_goal: selectedGoal 
        })
        .eq('id', user.id)
    }
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome to CV Adapter!</h2>
              <p className="text-blue-100 text-sm">Let's get you started in 3 easy steps</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: What's your goal? */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">What's your goal?</h3>
                <p className="text-gray-600">This helps us personalize your experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = selectedGoal === goal.id
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        goal.color === 'blue' ? 'bg-blue-100' :
                        goal.color === 'purple' ? 'bg-purple-100' :
                        goal.color === 'green' ? 'bg-green-100' :
                        'bg-orange-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          goal.color === 'blue' ? 'text-blue-600' :
                          goal.color === 'purple' ? 'text-purple-600' :
                          goal.color === 'green' ? 'text-green-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                      {isSelected && (
                        <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Upload CV */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Your CV</h3>
                <p className="text-gray-600">We'll use this as the foundation for your tailored CVs</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to upload your CV?
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Supported formats: PDF, DOCX (Max 5MB)
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Upload CV Now
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-900 mb-3">What happens next?</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">We'll parse your CV and extract all sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">You can then tailor it for any job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Export in multiple formats (PDF, DOCX, HTML)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
                <p className="text-gray-600">Here's what you can do now</p>
              </div>

              <div className="grid gap-4">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Generate Tailored CVs</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Paste any job description and we'll adapt your CV to match it perfectly
                      </p>
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Interview Prep</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Get AI-generated interview questions and company research
                      </p>
                      <button
                        onClick={() => router.push('/interview-prep')}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        Start Prep
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-2">🚀 Upgrade to Pro</h4>
                  <p className="text-sm text-purple-100 mb-4">
                    Get unlimited generations, company research, and premium features for just £2.99/month
                  </p>
                  <button
                    onClick={() => router.push('/subscription')}
                    className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                  >
                    View Pro Features
                  </button>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 3 && (
          <div className="px-8 pb-8 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
            >
              Skip for now
            </button>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={step === 1 && !selectedGoal}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
