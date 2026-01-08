'use client'

import { useState } from 'react'
import { AssessmentQuestion } from '@/types/skills-assessment'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface QuestionCardProps {
  question: AssessmentQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer?: string
  onAnswerSelect: (answer: string) => void
  showCorrectAnswer?: boolean
  isReview?: boolean
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  isReview = false
}: QuestionCardProps) {
  const [localAnswer, setLocalAnswer] = useState(selectedAnswer || '')

  const handleSelect = (answer: string) => {
    setLocalAnswer(answer)
    onAnswerSelect(answer)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '💻'
      case 'soft_skills': return '🤝'
      case 'industry_knowledge': return '📚'
      default: return '📝'
    }
  }

  const isCorrectAnswer = (option: string) => {
    return showCorrectAnswer && option === question.correct_answer
  }

  const isWrongAnswer = (option: string) => {
    return showCorrectAnswer && option === localAnswer && option !== question.correct_answer
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getCategoryIcon(question.skill_category)}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-500">
                Question {questionNumber} of {totalQuestions}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500 capitalize">
              {question.skill_category.replace('_', ' ')} • {question.points} points
            </p>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed">
          {question.question_text}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.question_type === 'multiple_choice' && question.options && (
          <>
            {question.options.map((option, index) => {
              const isSelected = localAnswer === option
              const isCorrect = isCorrectAnswer(option)
              const isWrong = isWrongAnswer(option)

              return (
                <button
                  key={index}
                  onClick={() => !isReview && handleSelect(option)}
                  disabled={isReview}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all
                    ${isSelected && !showCorrectAnswer ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${isWrong ? 'border-red-500 bg-red-50' : ''}
                    ${!isReview && !showCorrectAnswer ? 'hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer' : ''}
                    ${isReview ? 'cursor-not-allowed opacity-75' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${isSelected && !showCorrectAnswer ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                        ${isCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${isWrong ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {(isSelected || isCorrect || isWrong) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{option}</span>
                    </div>
                    {isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {isWrong && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </>
        )}

        {question.question_type === 'true_false' && (
          <>
            {['True', 'False'].map((option) => {
              const isSelected = localAnswer === option
              const isCorrect = isCorrectAnswer(option)
              const isWrong = isWrongAnswer(option)

              return (
                <button
                  key={option}
                  onClick={() => !isReview && handleSelect(option)}
                  disabled={isReview}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all
                    ${isSelected && !showCorrectAnswer ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${isWrong ? 'border-red-500 bg-red-50' : ''}
                    ${!isReview && !showCorrectAnswer ? 'hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer' : ''}
                    ${isReview ? 'cursor-not-allowed opacity-75' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected && !showCorrectAnswer ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                        ${isCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${isWrong ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {(isSelected || isCorrect || isWrong) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{option}</span>
                    </div>
                    {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              )
            })}
          </>
        )}

        {(question.question_type === 'short_answer' || question.question_type === 'scenario') && (
          <textarea
            value={localAnswer}
            onChange={(e) => handleSelect(e.target.value)}
            disabled={isReview}
            placeholder="Type your answer here..."
            className={`
              w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isReview ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              ${showCorrectAnswer && localAnswer ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}
            `}
            rows={question.question_type === 'scenario' ? 6 : 3}
          />
        )}
      </div>

      {/* Explanation (shown after answering in review mode) */}
      {showCorrectAnswer && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Explanation</p>
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
