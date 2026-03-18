'use client'

import { Check } from 'lucide-react'

interface Step {
  number: number
  label: string
  completed: boolean
  active: boolean
}

interface CVProgressStepperProps {
  currentStep: 'upload' | 'generate' | 'review' | 'edit' | 'download'
}

export default function CVProgressStepper({ currentStep }: CVProgressStepperProps) {
  const steps: Step[] = [
    {
      number: 1,
      label: 'Upload',
      completed: ['generate', 'review', 'edit', 'download'].includes(currentStep),
      active: currentStep === 'upload'
    },
    {
      number: 2,
      label: 'Generate',
      completed: ['review', 'edit', 'download'].includes(currentStep),
      active: currentStep === 'generate'
    },
    {
      number: 3,
      label: 'Review',
      completed: ['edit', 'download'].includes(currentStep),
      active: currentStep === 'review'
    },
    {
      number: 4,
      label: 'Download',
      completed: false,
      active: currentStep === 'download'
    }
  ]

  return (
    <div className="bg-black border-b border-white/10 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-black text-white">
            Your journey to a better CV:
          </div>
          <div className="text-xs text-gray-400">
            Takes 2 minutes
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all
                    ${step.completed 
                      ? 'bg-blue-500 text-white' 
                      : step.active 
                        ? 'bg-blue-500 text-white ring-4 ring-blue-500/20' 
                        : 'bg-white/10 text-gray-400 border border-white/20'
                    }
                  `}
                >
                  {step.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div
                  className={`
                    mt-2 text-xs font-bold whitespace-nowrap
                    ${step.active ? 'text-blue-400' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-6">
                  <div
                    className={`
                      h-full transition-all
                      ${step.completed ? 'bg-blue-500' : 'bg-white/10'}
                    `}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
