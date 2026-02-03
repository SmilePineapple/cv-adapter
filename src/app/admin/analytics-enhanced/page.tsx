'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  MousePointer,
  Search,
  Smartphone,
  ArrowLeft,
  RefreshCw,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Award,
  Zap,
  Crown
} from 'lucide-react'
import Link from 'next/link'

interface EnhancedAnalytics {
  monthlyGrowth: {
    [key: string]: {
      total: number
      free: number
      pro: number
      new: number
    }
  }
  monthlyGenerations: { [key: string]: number }
  monthlyRevenue: { [key: string]: number }
  geography: {
    topCountries: Array<{ country: string; count: number }>
    totalCountries: number
  }
  traffic: {
    sources: Array<{ source: string; count: number; percentage: string }>
    totalSources: number
  }
  keywords: {
    topKeywords: Array<{ keyword: string; count: number }>
    totalKeywords: number
  }
  devices: {
    breakdown: { mobile: number; desktop: number; tablet: number; unknown: number }
    browsers: Array<{ browser: string; count: number }>
  }
  retention: {
    returningUsers: number
    retentionRate: string
    totalUsers: number
  }
  conversionFunnel: {
    signups: number
    uploaded: number
    generated: number
    paid: number
    uploadRate: string
    generationRate: string
    conversionRate: string
  }
  topJobTitles: Array<{ title: string; count: number }>
  dailyActiveUsers: { [key: string]: number }
  churnMetrics: {
    churnRate: string
    churnedUsers: number
    atRiskUsers: number
  }
  lifetimeValue: {
    avgLTV: string
    totalLTV: string
    topUserLTV: string
  }
  engagementScore: {
    averageScore: number
    highEngagement: number
    mediumEngagement: number
    lowEngagement: number
  }
  growthTrends: {
    weekOverWeek: string
    monthOverMonth: string
    projectedNextMonth: number
  }
}

export default function EnhancedAnalyticsPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
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

      const response = await fetch('/api/admin/analytics-enhanced', {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading enhanced analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized || !analytics) {
    return null
  }

  const monthlyGrowthEntries = Object.entries(analytics.monthlyGrowth).slice(-12)
  const latestMonth = monthlyGrowthEntries[monthlyGrowthEntries.length - 1]
  const previousMonth = monthlyGrowthEntries[monthlyGrowthEntries.length - 2]
  
  const monthOverMonthGrowth = previousMonth 
    ? (((latestMonth[1].new - previousMonth[1].new) / previousMonth[1].new) * 100).toFixed(1)
    : '0'

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
                  <h1 className="text-2xl font-bold text-gray-900">Enhanced Analytics</h1>
                  <p className="text-xs text-gray-500">Comprehensive insights & growth metrics</p>
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
        
        {/* Month-by-Month User Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Month-by-Month User Growth
              </h3>
              <p className="text-sm text-gray-600 mt-1">Since October 2025 (app launch) - Total, Free, and Pro users</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${parseFloat(monthOverMonthGrowth) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {parseFloat(monthOverMonthGrowth) >= 0 ? '+' : ''}{monthOverMonthGrowth}% MoM
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">New Users</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Users</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Free</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pro</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Conversion %</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Generations</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Est. MRR</th>
                </tr>
              </thead>
              <tbody>
                {monthlyGrowthEntries.map(([month, data], index) => {
                  const conversionRate = data.total > 0 ? ((data.pro / data.total) * 100).toFixed(1) : '0'
                  const generations = analytics.monthlyGenerations[month] || 0
                  const revenue = analytics.monthlyRevenue[month] || 0
                  const prevData = index > 0 ? monthlyGrowthEntries[index - 1][1] : null
                  const growth = prevData && prevData.new > 0 ? (((data.new - prevData.new) / prevData.new) * 100).toFixed(0) : '0'
                  
                  return (
                    <tr key={month} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className="font-semibold text-gray-900">{data.new}</span>
                        {prevData && (
                          <span className={`ml-2 text-xs ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({parseFloat(growth) >= 0 ? '+' : ''}{growth}%)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{data.total}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">{data.free}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Crown className="w-3 h-3 mr-1" />
                          {data.pro}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">{conversionRate}%</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">{generations}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-green-600">£{revenue.toFixed(0)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Visual Chart */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">User Growth Visualization</h4>
            <div className="space-y-3">
              {monthlyGrowthEntries.slice(-6).map(([month, data]) => {
                const maxTotal = Math.max(...monthlyGrowthEntries.map(([, d]) => d.total))
                const percentage = (data.total / maxTotal) * 100
                
                return (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-16">
                      {new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                    <div className="flex-1 relative">
                      <div className="bg-gray-100 rounded-full h-10 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs font-semibold text-white">{data.total}</span>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 h-full flex items-center pl-3">
                        <span className="text-xs text-gray-700">
                          {data.pro > 0 && (
                            <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full mr-2">
                              {data.pro} Pro
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Geographic Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-blue-600" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {analytics.geography.topCountries.map((country, index) => {
                const maxCount = analytics.geography.topCountries[0].count
                const percentage = (country.count / maxCount) * 100
                
                return (
                  <div key={country.country} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500 w-6">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900 w-32">{country.country}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                        {country.count} users
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Total countries: {analytics.geography.totalCountries}
            </p>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <MousePointer className="w-5 h-5 text-purple-600" />
              Traffic Sources
            </h3>
            <div className="space-y-3">
              {analytics.traffic.sources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{source.count}</div>
                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Total sources tracked: {analytics.traffic.totalSources}
            </p>
          </div>
        </div>

        {/* Keywords & Job Titles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keywords */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-orange-600" />
              Search Keywords
            </h3>
            {analytics.keywords.topKeywords.length > 0 ? (
              <div className="space-y-2">
                {analytics.keywords.topKeywords.slice(0, 10).map((keyword, index) => (
                  <div key={keyword.keyword} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{keyword.keyword}</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{keyword.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No keyword data available yet</p>
                <p className="text-xs mt-1">Keywords will appear as users sign up with UTM parameters</p>
              </div>
            )}
            {analytics.keywords.totalKeywords > 0 && (
              <p className="text-xs text-gray-500 mt-4">
                Total keywords tracked: {analytics.keywords.totalKeywords}
              </p>
            )}
          </div>

          {/* Top Job Titles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-blue-600" />
              Popular Job Titles
            </h3>
            <div className="space-y-2">
              {analytics.topJobTitles.slice(0, 10).map((job, index) => (
                <div key={job.title} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{job.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{job.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            Conversion Funnel
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">1. Sign Ups</span>
                <span className="text-lg font-bold text-gray-900">{analytics.conversionFunnel.signups}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-12 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-center text-white font-semibold" style={{ width: '100%' }}>
                  100%
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">2. Uploaded CV</span>
                <span className="text-lg font-bold text-gray-900">{analytics.conversionFunnel.uploaded}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-12 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full flex items-center justify-center text-white font-semibold" style={{ width: `${analytics.conversionFunnel.uploadRate}%` }}>
                  {analytics.conversionFunnel.uploadRate}%
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">3. Generated CV</span>
                <span className="text-lg font-bold text-gray-900">{analytics.conversionFunnel.generated}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-12 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full flex items-center justify-center text-white font-semibold" style={{ width: `${analytics.conversionFunnel.generationRate}%` }}>
                  {analytics.conversionFunnel.generationRate}%
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">4. Paid (Pro)</span>
                <span className="text-lg font-bold text-gray-900">{analytics.conversionFunnel.paid}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-12 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-center text-white font-semibold" style={{ width: `${analytics.conversionFunnel.conversionRate}%` }}>
                  {analytics.conversionFunnel.conversionRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">{analytics.conversionFunnel.uploadRate}%</div>
              <div className="text-xs text-purple-700 mt-1">Upload Rate</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">{analytics.conversionFunnel.generationRate}%</div>
              <div className="text-xs text-orange-700 mt-1">Generation Rate</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-900">{analytics.conversionFunnel.conversionRate}%</div>
              <div className="text-xs text-green-700 mt-1">Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Device & Browser Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              Device Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(analytics.devices.breakdown).map(([device, count]) => {
                const total = Object.values(analytics.devices.breakdown).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{device}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-pink-600" />
              User Retention
            </h3>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-pink-600 mb-2">{analytics.retention.retentionRate}%</div>
              <div className="text-sm text-gray-600 mb-6">Returning Users</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.retention.returningUsers}</div>
                  <div className="text-xs text-gray-600 mt-1">Returned</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.retention.totalUsers - analytics.retention.returningUsers}</div>
                  <div className="text-xs text-gray-600 mt-1">One-time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Churn Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Churn Analysis
            </h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{analytics.churnMetrics?.churnRate || '0%'}</div>
                <div className="text-xs text-red-700 mt-1">Churn Rate (30d)</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">{analytics.churnMetrics?.churnedUsers || 0}</div>
                  <div className="text-xs text-gray-600 mt-1">Churned Users</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">{analytics.churnMetrics?.atRiskUsers || 0}</div>
                  <div className="text-xs text-orange-700 mt-1">At Risk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lifetime Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-green-600" />
              Lifetime Value
            </h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">£{analytics.lifetimeValue?.avgLTV || '0.00'}</div>
                <div className="text-xs text-green-700 mt-1">Avg LTV per User</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">£{analytics.lifetimeValue?.totalLTV || '0'}</div>
                  <div className="text-xs text-gray-600 mt-1">Total LTV</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">£{analytics.lifetimeValue?.topUserLTV || '0'}</div>
                  <div className="text-xs text-blue-700 mt-1">Top User</div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-600" />
              Engagement Score
            </h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{analytics.engagementScore?.averageScore || 0}/100</div>
                <div className="text-xs text-yellow-700 mt-1">Average Score</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">High Engagement</span>
                  <span className="font-bold text-green-600">{analytics.engagementScore?.highEngagement || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Medium Engagement</span>
                  <span className="font-bold text-yellow-600">{analytics.engagementScore?.mediumEngagement || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Low Engagement</span>
                  <span className="font-bold text-red-600">{analytics.engagementScore?.lowEngagement || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Growth Trends & Projections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Week over Week</div>
              <div className="text-3xl font-bold">{analytics.growthTrends?.weekOverWeek || '0%'}</div>
              <div className="text-xs text-white/70 mt-1">7-day growth rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Month over Month</div>
              <div className="text-3xl font-bold">{analytics.growthTrends?.monthOverMonth || '0%'}</div>
              <div className="text-xs text-white/70 mt-1">30-day growth rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Projected Next Month</div>
              <div className="text-3xl font-bold">{analytics.growthTrends?.projectedNextMonth || 0}</div>
              <div className="text-xs text-white/70 mt-1">Expected new users</div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Key Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <h4 className="font-semibold">Monthly Growth</h4>
              </div>
              <p className="text-sm text-white/90">
                {latestMonth[1].new} new users last month ({parseFloat(monthOverMonthGrowth) >= 0 ? '+' : ''}{monthOverMonthGrowth}% MoM).
                {parseFloat(monthOverMonthGrowth) >= 0 
                  ? ' Strong growth! Focus on retention and conversion.'
                  : ' Growth slowing - review marketing and user acquisition.'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <h4 className="font-semibold">Conversion Funnel</h4>
              </div>
              <p className="text-sm text-white/90">
                {analytics.conversionFunnel.uploadRate}% upload rate, {analytics.conversionFunnel.conversionRate}% convert to Pro.
                {parseFloat(analytics.conversionFunnel.uploadRate) < 50
                  ? ' Low upload rate - improve onboarding flow.'
                  : ' Good engagement - optimize pricing page.'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5" />
                <h4 className="font-semibold">Geographic Reach</h4>
              </div>
              <p className="text-sm text-white/90">
                Users from {analytics.geography.totalCountries} countries. Top: {analytics.geography.topCountries[0]?.country || 'N/A'}.
                {analytics.geography.totalCountries < 10
                  ? ' Limited reach - expand international marketing.'
                  : ' Great global presence! Consider localization.'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5" />
                <h4 className="font-semibold">User Retention</h4>
              </div>
              <p className="text-sm text-white/90">
                {analytics.retention.retentionRate}% of users return after first visit.
                {parseFloat(analytics.retention.retentionRate) < 30
                  ? ' Low retention - improve product value and email nurturing.'
                  : ' Solid retention! Users see value in the product.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
