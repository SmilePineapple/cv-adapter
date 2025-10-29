'use client'

import { useState, useEffect } from 'react'
import { Trophy, X, Zap, Gift, TrendingUp } from 'lucide-react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface Target {
  id: number
  x: number
  y: number
  type: 'cv' | 'star' | 'bomb'
}

interface PublicCompetitionGameProps {
  onClose: () => void
}

export default function PublicCompetitionGame({ onClose }: PublicCompetitionGameProps) {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [targets, setTargets] = useState<Target[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameOver])

  // Spawn targets
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const spawnInterval = setInterval(() => {
      const types: Array<'cv' | 'star' | 'bomb'> = ['cv', 'cv', 'cv', 'star', 'star', 'bomb']
      const randomType = types[Math.floor(Math.random() * types.length)]
      
      const newTarget = {
        id: Date.now() + Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        type: randomType
      }

      setTargets((prev) => [...prev, newTarget])

      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id))
      }, 1500)
    }, 400)

    return () => clearInterval(spawnInterval)
  }, [gameStarted, gameOver])

  const handleTargetClick = (target: typeof targets[0]) => {
    setTargets((prev) => prev.filter((t) => t.id !== target.id))

    if (target.type === 'cv') {
      setScore((prev) => prev + 10)
    } else if (target.type === 'star') {
      setScore((prev) => prev + 25)
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: target.x / 100, y: target.y / 100 }
      })
    } else if (target.type === 'bomb') {
      setScore((prev) => Math.max(0, prev - 15))
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setTimeLeft(30)
    setTargets([])
    setSubmitted(false)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setEmailSubmitted(true)
  }

  const handleSubmitScore = async () => {
    if (!email) {
      toast.error('Email required')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/competition/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          score,
          game_type: 'cv_clicker',
          competition_id: 'oct_2025'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast.success('Score submitted successfully!')
      } else {
        toast.error(data.error || 'Failed to submit score')
      }
    } catch (error) {
      console.error('Error submitting score:', error)
      toast.error('Failed to submit score')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Win 20 Free Generations!</h2>
          </div>
          <p className="text-purple-100">
            Monthly competition - Top 3 scores win 20 free CV generations!
          </p>
        </div>

        {/* Game Content */}
        <div className="p-6">
          {!emailSubmitted ? (
            // Email Collection
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Enter to Win!
                </h3>
                <p className="text-gray-600 mb-6">
                  Play our CV Clicker game for a chance to win 20 free CV generations. 
                  Enter your email to get started!
                </p>

                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Zap className="w-5 h-5 inline mr-2" />
                    Start Playing!
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  ℹ️ We'll only contact you if you win. No promotional emails.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-left">
                <p className="text-sm text-blue-900">
                  <strong>🏆 Prize:</strong> Top 3 players win 20 free CV generations added to their account
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Monthly competition - Winners announced at the start of each month!
                </p>
              </div>
            </div>
          ) : !gameStarted && !gameOver ? (
            // Game Instructions
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  CV Clicker Challenge! 🎯
                </h3>
                <p className="text-gray-600 mb-6">
                  Click as many CVs and stars as you can in 30 seconds!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="font-bold text-green-600">+10 pts</div>
                    <div className="text-xs text-gray-600">CV Icons</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="font-bold text-yellow-600">+25 pts</div>
                    <div className="text-xs text-gray-600">Stars (Bonus!)</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-4xl mb-2">💣</div>
                    <div className="font-bold text-red-600">-15 pts</div>
                    <div className="text-xs text-gray-600">Bombs (Avoid!)</div>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Zap className="w-5 h-5 inline mr-2" />
                  Start Game!
                </button>
              </div>
            </div>
          ) : gameStarted && !gameOver ? (
            // Active Game
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-purple-100 px-6 py-3 rounded-lg">
                  <div className="text-sm text-purple-600 font-semibold">Score</div>
                  <div className="text-3xl font-bold text-purple-900">{score}</div>
                </div>
                <div className="bg-blue-100 px-6 py-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-semibold">Time</div>
                  <div className="text-3xl font-bold text-blue-900">{timeLeft}s</div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl h-96 overflow-hidden border-4 border-purple-200">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetClick(target)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 text-5xl hover:scale-110 transition-transform cursor-pointer"
                    style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  >
                    {target.type === 'cv' && '📄'}
                    {target.type === 'star' && '⭐'}
                    {target.type === 'bomb' && '💣'}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Game Over
            <div className="text-center space-y-6">
              {!submitted ? (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Game Over!
                    </h3>
                    <p className="text-5xl font-bold text-purple-600 mb-4">
                      {score} points
                    </p>
                    <p className="text-gray-600">
                      Great job! Submit your score to enter the competition.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSubmitScore}
                      disabled={submitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Score'}
                    </button>
                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Play Again
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-4">
                    <p className="text-green-800 font-semibold mb-2">
                      ✅ Score Submitted Successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      You're now entered in the monthly competition. Top 3 scores win 20 free generations!
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      We'll email you at <strong>{email}</strong> if you win!
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
