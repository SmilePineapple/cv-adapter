'use client'

import { useState, useEffect } from 'react'
import { Trophy, X, Zap, Star, Gift, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ProCompetitionGameProps {
  userEmail: string
  onClose: () => void
}

export default function ProCompetitionGame({ userEmail, onClose }: ProCompetitionGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; type: 'cv' | 'star' | 'bomb' }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Game timer
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
        id: Date.now() + Math.random(), // Ensure unique IDs
        x: Math.random() * 80 + 10, // 10-90% of width
        y: Math.random() * 70 + 10, // 10-80% of height
        type: randomType
      }

      setTargets((prev) => [...prev, newTarget])

      // Remove target after 1.5 seconds (faster)
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id))
      }, 1500)
    }, 400) // Spawn every 400ms (twice as fast!)

    return () => clearInterval(spawnInterval)
  }, [gameStarted, gameOver])

  const handleTargetClick = (target: typeof targets[0]) => {
    // Remove clicked target
    setTargets((prev) => prev.filter((t) => t.id !== target.id))

    // Update score
    if (target.type === 'cv') {
      setScore((prev) => prev + 10)
    } else if (target.type === 'star') {
      setScore((prev) => prev + 25)
      // Mini confetti
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { x: target.x / 100, y: target.y / 100 }
      })
    } else if (target.type === 'bomb') {
      setScore((prev) => Math.max(0, prev - 15))
    }
  }

  const handleSubmitScore = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/competition/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          score: score,
          game_type: 'cv_clicker'
        })
      })

      if (response.ok) {
        setSubmitted(true)
        // Big confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (error) {
      console.error('Failed to submit score:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(30)
    setGameOver(false)
    setTargets([])
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
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
            <h2 className="text-2xl font-bold">Win 1 Month Pro FREE!</h2>
          </div>
          <p className="text-purple-100">
            Top 5 scores win a free month of Pro access. Play now!
          </p>
        </div>

        {/* Game Content */}
        <div className="p-6">
          {!gameStarted && !gameOver && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  CV Clicker Challenge! 🎯
                </h3>
                <p className="text-gray-600 mb-6">
                  Click as many CVs and stars as you can in 30 seconds!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 text-left">
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">CV</span>
                      </div>
                      <span className="font-semibold text-gray-900">+10</span>
                    </div>
                    <p className="text-xs text-gray-600">Click CVs for points</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">+25</span>
                    </div>
                    <p className="text-xs text-gray-600">Bonus stars!</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">💣</span>
                      </div>
                      <span className="font-semibold text-gray-900">-15</span>
                    </div>
                    <p className="text-xs text-gray-600">Avoid bombs!</p>
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

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-left">
                <p className="text-sm text-blue-900">
                  <strong>🏆 Prize:</strong> Top 5 players win 1 month of Pro access (100 generations + unlimited features)
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Competition ends in 7 days. Winners announced via email!
                </p>
              </div>
            </div>
          )}

          {gameStarted && !gameOver && (
            <div>
              {/* Score & Timer */}
              <div className="flex justify-between items-center mb-4">
                <div className="bg-purple-100 px-6 py-3 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold">SCORE</p>
                  <p className="text-3xl font-bold text-purple-900">{score}</p>
                </div>
                <div className="bg-blue-100 px-6 py-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold">TIME</p>
                  <p className="text-3xl font-bold text-blue-900">{timeLeft}s</p>
                </div>
              </div>

              {/* Game Area */}
              <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl h-96 overflow-hidden border-4 border-purple-200">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetClick(target)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 animate-pulse"
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                    }}
                  >
                    {target.type === 'cv' && (
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600">
                        <span className="text-white font-bold text-xs">CV</span>
                      </div>
                    )}
                    {target.type === 'star' && (
                      <Star className="w-12 h-12 text-yellow-500 fill-yellow-500 cursor-pointer hover:text-yellow-600" />
                    )}
                    {target.type === 'bomb' && (
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-600">
                        <span className="text-2xl">💣</span>
                      </div>
                    )}
                  </button>
                ))}

                {targets.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <p className="text-lg">Click the targets as they appear!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Game Over!
                </h3>
                <p className="text-5xl font-bold text-purple-600 mb-4">
                  {score} points
                </p>

                {!submitted ? (
                  <>
                    <p className="text-gray-600 mb-6">
                      Submit your score to enter the competition!
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleSubmitScore}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Score'}
                      </button>
                      <button
                        onClick={startGame}
                        className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
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
                        You're now entered in the competition. Top 5 scores win 1 month Pro FREE!
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
                        className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-left">
                <p className="text-sm text-blue-900">
                  <strong>🏆 Check Leaderboard:</strong> Visit your dashboard to see current top scores
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
