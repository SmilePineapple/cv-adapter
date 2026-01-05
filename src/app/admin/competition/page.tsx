'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Trophy, Crown, Check, RefreshCw, Award, Users, TrendingUp, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

interface CompetitionScore {
  id: string
  email: string
  score: number
  game_type: string
  is_winner: boolean
  prize_claimed: boolean
  created_at: string
  user_id?: string
}

interface Competition {
  id: string
  name: string
  description: string
  max_winners: number
  prize_type: string
  prize_description?: string
  is_active: boolean
  start_date: string
  end_date: string
  winners_announced: boolean
}

interface LeaderboardEntry {
  rank: number
  email: string
  score: number
  is_winner: boolean
  created_at: string
}

export default function CompetitionAdminPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [loading, setLoading] = useState(true)
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [allScores, setAllScores] = useState<CompetitionScore[]>([])
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalGames: 0,
    avgScore: 0,
    topScore: 0
  })
  const [selectedWinners, setSelectedWinners] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchCompetitionData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if admin
    const adminUserId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
    if (user.id !== adminUserId) {
      router.push('/dashboard')
      toast.error('Admin access required')
      return
    }
  }

  const fetchCompetitionData = async () => {
    try {
      setLoading(true)

      // Fetch current competition
      const { data: compData } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', 'oct_2025')
        .single()

      setCompetition(compData)

      // Fetch leaderboard
      const { data: leaderboardData } = await supabase
        .rpc('get_competition_leaderboard', {
          p_competition_id: 'oct_2025',
          p_limit: 50
        })

      setLeaderboard(leaderboardData || [])

      // Fetch all scores for detailed view
      const { data: scoresData } = await supabase
        .from('competition_scores')
        .select('*')
        .eq('competition_id', 'oct_2025')
        .order('score', { ascending: false })

      setAllScores(scoresData || [])

      // Calculate stats
      if (scoresData && scoresData.length > 0) {
        const uniquePlayers = new Set(scoresData.map(s => s.email)).size
        const totalGames = scoresData.length
        const avgScore = Math.round(scoresData.reduce((sum, s) => sum + s.score, 0) / totalGames)
        const topScore = Math.max(...scoresData.map(s => s.score))

        setStats({
          totalPlayers: uniquePlayers,
          totalGames,
          avgScore,
          topScore
        })
      }

      // Pre-select current winners
      const currentWinners = scoresData?.filter(s => s.is_winner).map(s => s.email) || []
      setSelectedWinners(currentWinners)

    } catch (error) {
      console.error('Error fetching competition data:', error)
      toast.error('Failed to load competition data')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectWinner = (email: string) => {
    setSelectedWinners(prev => {
      if (prev.includes(email)) {
        return prev.filter(e => e !== email)
      } else {
        if (prev.length >= (competition?.max_winners || 5)) {
          toast.error(`Maximum ${competition?.max_winners} winners allowed`)
          return prev
        }
        return [...prev, email]
      }
    })
  }

  const handleMarkWinners = async () => {
    if (selectedWinners.length === 0) {
      toast.error('Please select at least one winner')
      return
    }

    if (!confirm(`Mark ${selectedWinners.length} users as winners?`)) {
      return
    }

    try {
      setProcessing(true)

      // Mark winners in database
      const { error: updateError } = await supabase
        .from('competition_scores')
        .update({ is_winner: false })
        .eq('competition_id', 'oct_2025')

      if (updateError) throw updateError

      // Mark selected winners
      for (const email of selectedWinners) {
        const { error } = await supabase
          .from('competition_scores')
          .update({ is_winner: true })
          .eq('competition_id', 'oct_2025')
          .eq('email', email)

        if (error) throw error
      }

      // Update competition status
      await supabase
        .from('competitions')
        .update({ winners_announced: true })
        .eq('id', 'oct_2025')

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      toast.success(`${selectedWinners.length} winners marked successfully!`)
      fetchCompetitionData()

    } catch (error) {
      console.error('Error marking winners:', error)
      toast.error('Failed to mark winners')
    } finally {
      setProcessing(false)
    }
  }

  const handleGrantFreeGenerations = async () => {
    const winners = allScores.filter(s => s.is_winner && !s.prize_claimed)
    
    if (winners.length === 0) {
      toast.error('No winners to grant free generations')
      return
    }

    if (!confirm(`Grant 20 free generations to ${winners.length} winners?`)) {
      return
    }

    try {
      setProcessing(true)
      let successCount = 0

      for (const winner of winners) {
        if (!winner.user_id) continue

        // Get current max generations
        const { data: currentUsage } = await supabase
          .from('usage_tracking')
          .select('max_lifetime_generations')
          .eq('user_id', winner.user_id)
          .single()

        if (currentUsage) {
          // Add 20 free generations
          const { error } = await supabase
            .from('usage_tracking')
            .update({
              max_lifetime_generations: currentUsage.max_lifetime_generations + 20,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', winner.user_id)

          if (!error) {
            // Mark prize as claimed
            await supabase
              .from('competition_scores')
              .update({ prize_claimed: true })
              .eq('id', winner.id)

            successCount++
          }
        }
      }

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      })

      toast.success(`20 free generations granted to ${successCount} winners!`)
      fetchCompetitionData()

    } catch (error) {
      console.error('Error granting free generations:', error)
      toast.error('Failed to grant free generations')
    } finally {
      setProcessing(false)
    }
  }

  const handleAutoSelectTopN = () => {
    const topN = competition?.max_winners || 5
    const topEmails = leaderboard.slice(0, topN).map(entry => entry.email)
    setSelectedWinners(topEmails)
    toast.success(`Auto-selected top ${topN} players`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading competition data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Competition Admin</h1>
                <p className="text-sm text-gray-600">{competition?.name}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.topScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Competition Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Competition Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">
                {competition?.is_active ? (
                  <span className="text-green-600">● Active</span>
                ) : (
                  <span className="text-gray-600">● Ended</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Winners</p>
              <p className="font-semibold text-gray-900">{competition?.max_winners}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prize</p>
              <p className="font-semibold text-gray-900">{competition?.prize_description || competition?.prize_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold text-gray-900">
                {competition?.start_date ? new Date(competition.start_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="font-semibold text-gray-900">
                {competition?.end_date ? new Date(competition.end_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Winners Announced</p>
              <p className="font-semibold text-gray-900">
                {competition?.winners_announced ? (
                  <span className="text-green-600">✓ Yes</span>
                ) : (
                  <span className="text-gray-600">✗ No</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAutoSelectTopN}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Crown className="w-5 h-5" />
              <span>Auto-Select Top {competition?.max_winners}</span>
            </button>

            <button
              onClick={handleMarkWinners}
              disabled={processing || selectedWinners.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-5 h-5" />
              <span>Mark {selectedWinners.length} as Winners</span>
            </button>

            <button
              onClick={handleGrantFreeGenerations}
              disabled={processing || allScores.filter(s => s.is_winner && !s.prize_claimed).length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>Grant 20 Free Generations</span>
            </button>

            <button
              onClick={fetchCompetitionData}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
            <p className="text-sm text-gray-600">
              Select winners by clicking on rows. Selected: {selectedWinners.length}/{competition?.max_winners}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => {
                  const isSelected = selectedWinners.includes(entry.email)
                  const scoreData = allScores.find(s => s.email === entry.email && s.score === entry.score)
                  const isWinner = scoreData?.is_winner || false
                  const prizeClaimed = scoreData?.prize_claimed || false

                  return (
                    <tr
                      key={`${entry.email}-${entry.rank}`}
                      onClick={() => handleSelectWinner(entry.email)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-purple-50 hover:bg-purple-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {entry.rank <= 3 && (
                            <Crown className={`w-5 h-5 mr-2 ${
                              entry.rank === 1 ? 'text-yellow-500' :
                              entry.rank === 2 ? 'text-gray-400' :
                              'text-orange-600'
                            }`} />
                          )}
                          <span className="text-sm font-bold text-gray-900">#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-purple-600">{entry.score} pts</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {isWinner && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Trophy className="w-3 h-3 mr-1" />
                              Winner
                            </span>
                          )}
                          {prizeClaimed && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Check className="w-3 h-3 mr-1" />
                              +20 Gens
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isSelected ? (
                            <Check className="w-5 h-5 text-purple-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No scores yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
