'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
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
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

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
  }
  charts: {
    generationsByDay: { [key: string]: number }
    signupsByDay: { [key: string]: number }
  }
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
  const [timeRange] = useState<'7d' | '30d' | '90d'>('30d')
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
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load analytics:', error)
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
              <p className="text-sm text-gray-600 mt-1">Total Users</p>
              <p className="text-xs text-gray-500 mt-2">+{analytics.overview.newUsersLast7Days} this week</p>
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
              <p className="text-xs text-gray-500 mt-2">Free → Pro</p>
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

      </div>
    </div>
  )
}
