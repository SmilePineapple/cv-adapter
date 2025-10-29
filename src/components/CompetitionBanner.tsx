'use client'

import { useState, useEffect } from 'react'
import { Trophy, Sparkles, X, TrendingUp } from 'lucide-react'
import ProCompetitionGame from './ProCompetitionGame'

interface CompetitionBannerProps {
  userEmail: string
}

export default function CompetitionBanner({ userEmail }: CompetitionBannerProps) {
  const [showGame, setShowGame] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; email: string; score: number }>>([])
  const [userRank, setUserRank] = useState<{ score: number; rank: number; total_players: number } | null>(null)

  useEffect(() => {
    // Check if user dismissed banner
    const isDismissed = localStorage.getItem('competition_banner_dismissed')
    if (isDismissed) {
      setDismissed(true)
    }

    // Fetch leaderboard
    fetchLeaderboard()
    fetchUserRank()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/competition/submit?limit=5')
      const data = await response.json()
      if (data.success) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
  }

  const fetchUserRank = async () => {
    try {
      const response = await fetch(`/api/competition/user-rank?email=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      if (data.success && data.rank) {
        setUserRank(data.rank)
      }
    } catch (error) {
      console.error('Failed to fetch user rank:', error)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('competition_banner_dismissed', 'true')
  }

  if (dismissed) return null

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg overflow-hidden mb-6 relative animate-gradient">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:flex md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <h3 className="text-2xl font-bold">Win 1 Month Pro FREE! 🎉</h3>
            </div>
            <p className="text-purple-100 mb-4 md:mb-0">
              Play our CV Clicker game and compete for the top 5 spots. Winners get 1 month of Pro access absolutely FREE!
            </p>
            
            {userRank && (
              <div className="mt-3 inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Your Best: {userRank.score} pts (Rank #{userRank.rank} of {userRank.total_players})
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6">
            <button
              onClick={() => setShowGame(true)}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 w-full md:w-auto justify-center"
            >
              <Sparkles className="w-5 h-5" />
              <span>Play Now!</span>
            </button>
          </div>
        </div>

        {/* Mini Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm px-6 py-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-purple-100">🏆 Current Top 5:</p>
              <div className="flex items-center space-x-4 text-sm">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-yellow-300 font-bold">#{entry.rank}</span>
                    <span className="text-white/80">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Animated gradient background */}
        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
        `}</style>
      </div>

      {showGame && (
        <ProCompetitionGame
          userEmail={userEmail}
          onClose={() => {
            setShowGame(false)
            fetchLeaderboard()
            fetchUserRank()
          }}
        />
      )}
    </>
  )
}
