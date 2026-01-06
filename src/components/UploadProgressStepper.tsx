'use client'

interface UploadProgressStepperProps {
  currentStep: 1 | 2 | 3
}

export default function UploadProgressStepper({ currentStep }: UploadProgressStepperProps) {
  const steps = [
    { number: 1, title: 'Upload CV', description: 'Upload your existing CV' },
    { number: 2, title: 'Enter Job Details', description: 'Paste job description' },
    { number: 3, title: 'Download', description: 'Get your tailored CV' }
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                  transition-all duration-300
                  ${currentStep >= step.number
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                  }
                  ${currentStep === step.number ? 'ring-4 ring-blue-200' : ''}
                `}
              >
                {currentStep > step.number ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Title - Hidden on mobile, shown on tablet+ */}
              <div className="mt-2 text-center hidden sm:block">
                <p className={`text-sm font-semibold ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 sm:mx-4">
                <div
                  className={`h-full rounded transition-all duration-300 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Title - Only shown on mobile */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-base font-semibold text-gray-900">
          {steps[currentStep - 1].title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  )
}
