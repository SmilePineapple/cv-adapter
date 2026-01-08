'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

interface AssessmentTimerProps {
  timeLimit: number // in minutes
  onTimeUp: () => void
  isPaused?: boolean
}

export default function AssessmentTimer({ timeLimit, onTimeUp, isPaused = false }: AssessmentTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // Convert to seconds
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        
        // Warning when 5 minutes left
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true)
        }
        
        // Time's up
        if (newTime <= 0) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, timeRemaining, onTimeUp, isWarning])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const getTimerColor = () => {
    if (timeRemaining <= 60) return 'text-red-600 bg-red-50 border-red-200'
    if (timeRemaining <= 300) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  const getProgressPercentage = () => {
    return (timeRemaining / (timeLimit * 60)) * 100
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border-2 shadow-lg ${getTimerColor()} transition-all`}>
      <div className="flex items-center gap-3">
        {timeRemaining <= 300 ? (
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
        <div>
          <p className="text-xs font-medium opacity-75">Time Remaining</p>
          <p className="text-2xl font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-linear"
          style={{ 
            width: `${getProgressPercentage()}%`,
            backgroundColor: timeRemaining <= 60 ? '#dc2626' : timeRemaining <= 300 ? '#ea580c' : '#2563eb'
          }}
        />
      </div>
      
      {isWarning && timeRemaining > 60 && (
        <p className="text-xs mt-2 font-medium">⚠️ 5 minutes left!</p>
      )}
      
      {timeRemaining <= 60 && (
        <p className="text-xs mt-2 font-bold animate-pulse">🚨 Final minute!</p>
      )}
    </div>
  )
}
