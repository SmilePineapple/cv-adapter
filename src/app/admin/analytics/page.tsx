'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  ArrowLeft,
  Crown,
  Target,
  Zap,
  Mail,
  Clock,
  UserPlus,
  Activity,
  Award,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Database,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface MonthlyGrowthRow {
  year_month: string
  new_signups: number
  deletions: number
  net_change: number
  cumulative_signups: number
  cumulative_active: number
}

interface AnalyticsData {
  overview: {
    totalUsers: number
    freeUsers: number
    proUsers: number
    totalGenerations: number
    totalCVs: number
    totalCoverLetters: number
    totalInterviewPreps: number
    newUsersLast7Days: number
    newUsersLast30Days: number
    activeUsers: number
    totalRevenue: number
    conversionRate: string
    avgGenerationsPerUser: string
    monthlyProUsers?: number
    annualProUsers?: number
    totalEverRegistered?: number
    totalEverDeleted?: number
    payingProUsers?: number
  }
  charts: {
    generationsByDay: { [key: string]: number }
    signupsByDay: { [key: string]: number }
  }
  monthlyGrowthStats?: MonthlyGrowthRow[]
  users: Array<{
    id: string
    email: string
    plan: string
    generation_count: number
    created_at: string
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isSnapshotting, setIsSnapshotting] = useState(false)
  const [snapshotMsg, setSnapshotMsg] = useState<string | null>(null)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [manualMonth, setManualMonth] = useState('')
  const [manualCount, setManualCount] = useState('')
  const [isSavingManual, setIsSavingManual] = useState(false)
  const [manualMsg, setManualMsg] = useState<string | null>(null)
  // const [_timeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    checkAuthAndLoadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const ADMIN_EMAILS = ['jakedalerourke@gmail.com']
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/dashboard')
      return
    }
    
    setIsAuthorized(true)
    await loadAnalytics()
  }

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
      setAnalyticsError(null)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate growth metrics
  const getGrowthMetrics = () => {
    if (!analytics) return null
    
    const last7Days = Object.entries(analytics.charts.generationsByDay).slice(-7)
    const prev7Days = Object.entries(analytics.charts.generationsByDay).slice(-14, -7)
    
    const last7Total = last7Days.reduce((sum, [, count]) => sum + count, 0)
    const prev7Total = prev7Days.reduce((sum, [, count]) => sum + count, 0)
    
    const generationsGrowth = prev7Total > 0 
      ? ((last7Total - prev7Total) / prev7Total * 100).toFixed(1)
      : '0'
    
    const last7Signups = Object.entries(analytics.charts.signupsByDay).slice(-7)
    const prev7Signups = Object.entries(analytics.charts.signupsByDay).slice(-14, -7)
    
    const last7SignupsTotal = last7Signups.reduce((sum, [, count]) => sum + count, 0)
    const prev7SignupsTotal = prev7Signups.reduce((sum, [, count]) => sum + count, 0)
    
    const signupsGrowth = prev7SignupsTotal > 0
      ? ((last7SignupsTotal - prev7SignupsTotal) / prev7SignupsTotal * 100).toFixed(1)
      : '0'
    
    return {
      generationsGrowth: parseFloat(generationsGrowth),
      signupsGrowth: parseFloat(signupsGrowth),
      last7Generations: last7Total,
      last7Signups: last7SignupsTotal
    }
  }

  const runSnapshot = async () => {
    try {
      setIsSnapshotting(true)
      setSnapshotMsg(null)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/admin/snapshot-user-stats', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const json = await res.json()
      if (json.success) {
        const { live = 0, orphanedProfiles = 0, orphanedGenerations = 0 } = json.sources || {}
        setSnapshotMsg(`Seeded ${json.upserted} months | ${json.totalUsers} total (${live} live + ${orphanedProfiles} recovered from profiles + ${orphanedGenerations} from generations)`)
        await loadAnalytics()
      } else {
        setSnapshotMsg(`Error: ${json.error}`)
      }
    } catch (e) {
      setSnapshotMsg('Snapshot failed')
    } finally {
      setIsSnapshotting(false)
    }
  }

  const saveManualEntry = async () => {
    if (!manualMonth || !manualCount) return
    const count = parseInt(manualCount, 10)
    if (isNaN(count) || count < 0) { setManualMsg('Enter a valid positive number'); return }
    try {
      setIsSavingManual(true)
      setManualMsg(null)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/admin/snapshot-user-stats', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ year_month: manualMonth, new_signups: count })
      })
      const json = await res.json()
      if (json.success) {
        setManualMsg(`Saved: ${manualMonth} → ${json.saved.new_signups} signups`)
        setManualMonth('')
        setManualCount('')
        await loadAnalytics()
      } else {
        setManualMsg(`Error: ${json.error}`)
      }
    } catch {
      setManualMsg('Save failed')
    } finally {
      setIsSavingManual(false)
    }
  }

  const growth = getGrowthMetrics()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized || !analytics) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-xs text-gray-500">Real-time insights & metrics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runSnapshot}
                disabled={isSnapshotting}
                title="Seed/refresh user_growth_stats from current auth.users"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                {isSnapshotting ? 'Seeding...' : 'Seed Stats'}
              </button>
              <Link
                href="/admin/analytics-enhanced"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Enhanced Analytics
              </Link>
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <div className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Overview Stats - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              {growth && (
                <div className={`flex items-center gap-1 text-sm font-medium ${growth.signupsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.signupsGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(growth.signupsGrowth)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
              <p className="text-xs text-gray-500 mt-2">+{analytics.overview.newUsersLast7Days} this week</p>
              {(analytics.overview.totalEverRegistered ?? 0) > analytics.overview.totalUsers && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  {(analytics.overview.totalEverRegistered ?? 0).toLocaleString()} total ever registered
                  {' '}· {((analytics.overview.totalEverRegistered ?? 0) - analytics.overview.totalUsers).toLocaleString()} purged
                </p>
              )}
            </div>
          </div>

          {/* Total Generations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              {growth && (
                <div className={`flex items-center gap-1 text-sm font-medium ${growth.generationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.generationsGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(growth.generationsGrowth)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalGenerations}</p>
              <p className="text-sm text-gray-600 mt-1">CV Generations</p>
              <p className="text-xs text-gray-500 mt-2">{growth?.last7Generations || 0} this week</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">£{analytics.overview.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
              <p className="text-xs text-gray-500 mt-2">{analytics.overview.proUsers} paying users</p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.conversionRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
              <p className="text-xs text-gray-500 mt-2">Free → Pro (active users)</p>
              {(analytics.overview.totalEverRegistered ?? 0) > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {(((analytics.overview.payingProUsers ?? analytics.overview.proUsers) / (analytics.overview.totalEverRegistered ?? 1)) * 100).toFixed(1)}% of all-time signups
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">CVs Uploaded</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{analytics.overview.totalCVs}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Cover Letters</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{analytics.overview.totalCoverLetters}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{analytics.overview.activeUsers}</p>
            <p className="text-xs text-green-700 mt-1">Last 30 days</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-orange-900">Avg Generations</p>
            </div>
            <p className="text-2xl font-bold text-orange-900">{analytics.overview.avgGenerationsPerUser}</p>
            <p className="text-xs text-orange-700 mt-1">Per user</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generations Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  CV Generations Trend
                </h3>
                <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
              </div>
              {growth && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${growth.generationsGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {growth.generationsGrowth >= 0 ? '+' : ''}{growth.generationsGrowth}% WoW
                </div>
              )}
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.charts.generationsByDay).slice(-14).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(analytics.charts.generationsByDay))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16">{new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* User Signups Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  User Signups Trend
                </h3>
                <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
              </div>
              {growth && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${growth.signupsGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {growth.signupsGrowth >= 0 ? '+' : ''}{growth.signupsGrowth}% WoW
                </div>
              )}
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.charts.signupsByDay).slice(-14).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(analytics.charts.signupsByDay))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16">{new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Crown className="w-5 h-5 text-purple-600" />
            User Plan Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-gray-900">{analytics.overview.freeUsers}</div>
              <div className="text-sm text-gray-600 mt-2">Free Users</div>
              <div className="text-xs text-gray-500 mt-1">{((analytics.overview.freeUsers / analytics.overview.totalUsers) * 100).toFixed(1)}% of total</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-4xl font-bold text-purple-900">{analytics.overview.proUsers}</div>
              <div className="text-sm text-purple-700 mt-2 font-medium">Pro Users</div>
              <div className="text-xs text-purple-600 mt-1">{analytics.overview.conversionRate}% conversion</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-900">£{(analytics.overview.totalRevenue / analytics.overview.proUsers || 0).toFixed(0)}</div>
              <div className="text-sm text-green-700 mt-2">ARPU</div>
              <div className="text-xs text-green-600 mt-1">Average revenue per user</div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Key Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <h4 className="font-semibold">Growth Opportunity</h4>
              </div>
              <p className="text-sm text-white/90">
                {analytics.overview.conversionRate}% conversion rate. Industry average is 2-5%. 
                {parseFloat(analytics.overview.conversionRate) < 5 
                  ? ' Focus on onboarding and value proposition to increase conversions.'
                  : ' Excellent conversion! Focus on scaling user acquisition.'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5" />
                <h4 className="font-semibold">User Engagement</h4>
              </div>
              <p className="text-sm text-white/90">
                {analytics.overview.avgGenerationsPerUser} generations per user. 
                {parseFloat(analytics.overview.avgGenerationsPerUser) < 2
                  ? ' Low engagement - improve onboarding and feature discovery.'
                  : ' Good engagement! Users are finding value in the product.'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <h4 className="font-semibold">Revenue Potential</h4>
              </div>
              <p className="text-sm text-white/90">
                {analytics.overview.freeUsers} free users = £{(analytics.overview.freeUsers * 5).toFixed(0)} potential revenue at current pricing.
                Even 10% conversion = £{(analytics.overview.freeUsers * 0.1 * 5).toFixed(0)} additional revenue.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <h4 className="font-semibold">Weekly Performance</h4>
              </div>
              <p className="text-sm text-white/90">
                {growth?.last7Signups || 0} new users this week. 
                {(growth?.signupsGrowth || 0) >= 0 
                  ? ` Growing ${growth?.signupsGrowth}% week-over-week! 🚀`
                  : ` Down ${Math.abs(growth?.signupsGrowth || 0)}% - review marketing efforts.`}
              </p>
            </div>
          </div>
        </div>

        {/* User Growth History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                User Growth History
              </h3>
              <p className="text-sm text-gray-500 mt-1">All-time signup and deletion counts (survives GDPR cleanups)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {snapshotMsg && (
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-1">{snapshotMsg}</span>
              )}
              {analyticsError && (
                <span className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-1">Analytics error: {analyticsError}</span>
              )}
            </div>
          </div>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-900">{(analytics.overview.totalEverRegistered ?? analytics.overview.totalUsers).toLocaleString()}</p>
              <p className="text-xs text-blue-700 mt-1">Total Ever Registered</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-900">{(analytics.overview.totalEverDeleted ?? 0).toLocaleString()}</p>
              <p className="text-xs text-red-700 mt-1">Total Deleted (GDPR)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-900">{analytics.overview.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-700 mt-1">Currently Active</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-900">
                {analytics.overview.totalEverRegistered
                  ? `${(((analytics.overview.totalEverRegistered - analytics.overview.totalUsers) / analytics.overview.totalEverRegistered) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <p className="text-xs text-purple-700 mt-1">Churn Rate (lifetime)</p>
            </div>
          </div>

          {/* Manual entry */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-900 mb-3">Add Historical Month <span className="font-normal text-amber-700">(for months before tracking started — enter the total signups you know for that month)</span></p>
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className="text-xs text-amber-800 block mb-1">Month (YYYY-MM)</label>
                <input
                  type="month"
                  value={manualMonth}
                  onChange={e => setManualMonth(e.target.value)}
                  className="border border-amber-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-amber-800 block mb-1">Total signups that month</label>
                <input
                  type="number"
                  min="0"
                  value={manualCount}
                  onChange={e => setManualCount(e.target.value)}
                  placeholder="e.g. 85"
                  className="border border-amber-300 rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <button
                onClick={saveManualEntry}
                disabled={isSavingManual || !manualMonth || !manualCount}
                className="px-4 py-1.5 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {isSavingManual ? 'Saving...' : 'Save Entry'}
              </button>
              {manualMsg && <span className="text-xs text-amber-800">{manualMsg}</span>}
            </div>
          </div>

          {/* Monthly breakdown table */}
          {analytics.monthlyGrowthStats && analytics.monthlyGrowthStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-600 font-medium">Month</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">New Signups</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Deleted</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Net</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Cumulative Total</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">Still Active</th>
                  </tr>
                </thead>
                <tbody>
                  {[...analytics.monthlyGrowthStats].reverse().map(row => (
                    <tr key={row.year_month} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 font-medium text-gray-900">
                        {new Date(row.year_month + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-green-700 font-medium">+{row.new_signups}</span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {row.deletions > 0
                          ? <span className="text-red-600 flex items-center justify-end gap-1"><Trash2 className="w-3 h-3" />{row.deletions}</span>
                          : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className={row.net_change >= 0 ? 'text-blue-700' : 'text-orange-600'}>
                          {row.net_change >= 0 ? '+' : ''}{row.net_change}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700">{row.cumulative_signups.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-gray-700">{row.cumulative_active.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No growth history yet.</p>
              <p className="text-xs mt-1">Click <strong>Seed Stats</strong> above to populate from current users.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
