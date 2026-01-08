'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface AssessmentProgressProps {
  currentQuestion: number
  totalQuestions: number
  answeredQuestions: number
}

export default function AssessmentProgress({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions 
}: AssessmentProgressProps) {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestion} of {totalQuestions}
          </h3>
          <p className="text-sm text-gray-600">
            {answeredQuestions} answered • {totalQuestions - answeredQuestions} remaining
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-2 mt-4">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const questionNum = i + 1
          const isAnswered = questionNum <= answeredQuestions
          const isCurrent = questionNum === currentQuestion

          return (
            <div
              key={i}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${isAnswered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
              `}
              title={`Question ${questionNum}${isAnswered ? ' (Answered)' : ''}`}
            >
              {isAnswered ? <CheckCircle className="w-4 h-4" /> : questionNum}
            </div>
          )
        })}
      </div>
    </div>
  )
}
