'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { getDailyStats, getLanguageUsageStats, getExportFormatStats } from '@/lib/analytics'
import { LANGUAGE_NAMES } from '@/lib/language-detection'
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Globe,
  Download,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface DailyStat {
  date: string
  cvs_uploaded: number
  cvs_generated: number
  cover_letters_generated: number
  payments: number
  active_users: number
  paying_users: number
}

interface LanguageStat {
  language: string
  usage_count: number
  unique_users: number
  date: string
}

interface ExportStat {
  format: string
  export_count: number
  unique_users: number
  date: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([])
  const [exportStats, setExportStats] = useState<ExportStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    checkAdminAndFetchData()
  }, [timeRange])

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if user is admin (replace with your admin user ID)
      const adminUserId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
      if (!user || user.id !== adminUserId) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await fetchAnalytics()
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    const [daily, language, exportData] = await Promise.all([
      getDailyStats(timeRange),
      getLanguageUsageStats(),
      getExportFormatStats()
    ])

    setDailyStats(daily)
    setLanguageStats(language)
    setExportStats(exportData)
  }

  // Aggregate language stats
  const aggregatedLanguageStats = languageStats.reduce((acc, stat) => {
    const existing = acc.find(s => s.language === stat.language)
    if (existing) {
      existing.usage_count += stat.usage_count
      existing.unique_users = Math.max(existing.unique_users, stat.unique_users)
    } else {
      acc.push({ ...stat })
    }
    return acc
  }, [] as LanguageStat[])
  .sort((a, b) => b.usage_count - a.usage_count)
  .slice(0, 10)

  // Aggregate export stats
  const aggregatedExportStats = exportStats.reduce((acc, stat) => {
    const existing = acc.find(s => s.format === stat.format)
    if (existing) {
      existing.export_count += stat.export_count
      existing.unique_users = Math.max(existing.unique_users, stat.unique_users)
    } else {
      acc.push({ ...stat })
    }
    return acc
  }, [] as ExportStat[])
  .sort((a, b) => b.export_count - a.export_count)

  // Calculate totals
  const totals = dailyStats.reduce((acc, stat) => ({
    cvs_uploaded: acc.cvs_uploaded + stat.cvs_uploaded,
    cvs_generated: acc.cvs_generated + stat.cvs_generated,
    cover_letters: acc.cover_letters + stat.cover_letters_generated,
    payments: acc.payments + stat.payments,
    active_users: Math.max(acc.active_users, stat.active_users),
  }), {
    cvs_uploaded: 0,
    cvs_generated: 0,
    cover_letters: 0,
    payments: 0,
    active_users: 0,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30 | 90)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total CVs Generated</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totals.cvs_generated}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totals.active_users}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cover Letters</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totals.cover_letters}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">£{totals.payments * 5}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Usage */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Language Usage</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Top languages by generation count</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {aggregatedLanguageStats.map((stat, index) => {
                  const languageName = LANGUAGE_NAMES[stat.language as keyof typeof LANGUAGE_NAMES] || stat.language
                  const maxCount = aggregatedLanguageStats[0]?.usage_count || 1
                  const percentage = (stat.usage_count / maxCount) * 100

                  return (
                    <div key={stat.language} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            {index + 1}. {languageName}
                          </span>
                          <span className="text-xs text-gray-500">({stat.language})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">{stat.usage_count}</span>
                          <span className="text-xs text-gray-500 ml-1">uses</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Export Formats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Export Formats</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Preferred download formats</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {aggregatedExportStats.map((stat, index) => {
                  const maxCount = aggregatedExportStats[0]?.export_count || 1
                  const percentage = (stat.export_count / maxCount) * 100

                  return (
                    <div key={stat.format} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          {index + 1}. {stat.format}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">{stat.export_count}</span>
                          <span className="text-xs text-gray-500 ml-1">exports</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Daily Activity</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">CV generations and uploads over time</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {dailyStats.slice(0, 14).map((stat) => (
                  <div key={stat.date} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-600">
                      {new Date(stat.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.min((stat.cvs_generated / 20) * 100, 100)}%` }}
                        >
                          {stat.cvs_generated > 0 && (
                            <span className="text-xs font-medium text-white">{stat.cvs_generated}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-16">CVs</span>
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.min((stat.cvs_uploaded / 10) * 100, 100)}%` }}
                        >
                          {stat.cvs_uploaded > 0 && (
                            <span className="text-xs font-medium text-white">{stat.cvs_uploaded}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-16">Uploads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
