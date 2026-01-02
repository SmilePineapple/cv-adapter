'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Download,
  RefreshCw,
  Zap,
  Globe,
  Calendar,
  BarChart3
} from 'lucide-react'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

interface RealTimeMetrics {
  activeUsersNow: number
  generationsLastHour: number
  revenueToday: number
  signupsToday: number
  errorRate: number
}

interface ConversionFunnel {
  visitors: number
  signups: number
  firstGeneration: number
  secondGeneration: number
  upgrades: number
}

interface RetentionData {
  day7: number
  day30: number
}

export default function AdvancedAdminDashboard() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null)
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel | null>(null)
  const [retention, setRetention] = useState<RetentionData | null>(null)
  const [revenueData, setRevenueData] = useState<Array<{date: string, revenue: number}>>([])
  const [geoData, setGeoData] = useState<Array<{flag: string, name: string, count: number, percentage: number}>>([])
  const [featureUsage, setFeatureUsage] = useState<Record<string, number> | null>(null)
  const [churnRate, setChurnRate] = useState<number>(0)

  useEffect(() => {
    checkAuthAndLoadData()
    
    // Refresh real-time metrics every 30 seconds
    const interval = setInterval(loadRealTimeMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      toast.error('Unauthorized - Admin access only')
      router.push('/dashboard')
      return
    }
    
    setIsAuthorized(true)
    await loadAllMetrics()
  }

  const loadAllMetrics = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        loadRealTimeMetrics(),
        loadConversionFunnel(),
        loadRetentionData(),
        loadRevenueOverTime(),
        loadGeoDistribution(),
        loadFeatureUsage(),
        loadChurnRate()
      ])
    } catch (error) {
      console.error('Error loading metrics:', error)
      toast.error('Failed to load some metrics')
    } finally {
      setIsLoading(false)
    }
  }

  const loadRealTimeMetrics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/real-time-metrics', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setRealTimeMetrics(data)
    } catch (error) {
      console.error('Real-time metrics error:', error)
    }
  }

  const loadConversionFunnel = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/conversion-funnel', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setConversionFunnel(data)
    } catch (error) {
      console.error('Conversion funnel error:', error)
    }
  }

  const loadRetentionData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/retention', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setRetention(data)
    } catch (error) {
      console.error('Retention error:', error)
    }
  }

  const loadRevenueOverTime = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/revenue-over-time', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setRevenueData(data)
    } catch (error) {
      console.error('Revenue data error:', error)
    }
  }

  const loadGeoDistribution = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/geo-distribution', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setGeoData(data)
    } catch (error) {
      console.error('Geo data error:', error)
    }
  }

  const loadFeatureUsage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/feature-usage', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setFeatureUsage(data)
    } catch (error) {
      console.error('Feature usage error:', error)
    }
  }

  const loadChurnRate = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/churn-rate', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      setChurnRate(data.churnRate)
    } catch (error) {
      console.error('Churn rate error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time insights and metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/analytics-v2"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              User Journey Analytics
            </Link>
            <button
              onClick={loadAllMetrics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Real-Time Monitoring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Active Now</p>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{realTimeMetrics?.activeUsersNow || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Users online</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Last Hour</p>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{realTimeMetrics?.generationsLastHour || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Generations</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Revenue Today</p>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">£{realTimeMetrics?.revenueToday?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-500 mt-1">Today&apos;s earnings</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Signups Today</p>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{realTimeMetrics?.signupsToday || 0}</p>
              <p className="text-xs text-gray-500 mt-1">New users</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Error Rate</p>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{realTimeMetrics?.errorRate?.toFixed(1) || '0.0'}%</p>
              <p className="text-xs text-gray-500 mt-1">Last hour</p>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Conversion Funnel
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              {conversionFunnel && (
                <>
                  <FunnelStep
                    label="Visitors"
                    count={conversionFunnel.visitors}
                    percentage={100}
                    color="bg-blue-500"
                  />
                  <FunnelStep
                    label="Signups"
                    count={conversionFunnel.signups}
                    percentage={(conversionFunnel.signups / conversionFunnel.visitors) * 100}
                    color="bg-green-500"
                  />
                  <FunnelStep
                    label="First Generation"
                    count={conversionFunnel.firstGeneration}
                    percentage={(conversionFunnel.firstGeneration / conversionFunnel.signups) * 100}
                    color="bg-yellow-500"
                  />
                  <FunnelStep
                    label="Second Generation"
                    count={conversionFunnel.secondGeneration}
                    percentage={(conversionFunnel.secondGeneration / conversionFunnel.firstGeneration) * 100}
                    color="bg-orange-500"
                  />
                  <FunnelStep
                    label="Upgrades"
                    count={conversionFunnel.upgrades}
                    percentage={(conversionFunnel.upgrades / conversionFunnel.secondGeneration) * 100}
                    color="bg-purple-500"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Retention & Churn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Retention</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">7-Day Retention</span>
                    <span className="text-2xl font-bold text-green-600">{retention?.day7?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${retention?.day7 || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">30-Day Retention</span>
                    <span className="text-2xl font-bold text-blue-600">{retention?.day30?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${retention?.day30 || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Churn Rate</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-6xl font-bold text-red-600 mb-2">{churnRate.toFixed(1)}%</p>
                <p className="text-gray-600">Monthly Churn Rate</p>
                <p className="text-sm text-gray-500 mt-4">
                  {churnRate < 5 ? '✅ Excellent' : churnRate < 10 ? '⚠️ Good' : '❌ Needs Attention'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Usage Heatmap */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Usage</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FeatureUsageCard
                feature="CV Generation"
                usage={featureUsage?.cvGeneration || 0}
                total={featureUsage?.totalUsers || 1}
              />
              <FeatureUsageCard
                feature="Cover Letters"
                usage={featureUsage?.coverLetters || 0}
                total={featureUsage?.totalUsers || 1}
              />
              <FeatureUsageCard
                feature="Interview Prep"
                usage={featureUsage?.interviewPrep || 0}
                total={featureUsage?.totalUsers || 1}
              />
              <FeatureUsageCard
                feature="Export PDF"
                usage={featureUsage?.exportPDF || 0}
                total={featureUsage?.totalUsers || 1}
              />
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Geographic Distribution
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-3">
              {geoData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium text-gray-900">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-16 text-right">
                      {country.count} ({country.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Over Time */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Revenue Over Time (Last 30 Days)
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                    style={{
                      height: `${(day.revenue / Math.max(...revenueData.map(d => d.revenue), 1)) * 100}%`,
                      minHeight: day.revenue > 0 ? '4px' : '0'
                    }}
                    title={`£${day.revenue.toFixed(2)}`}
                  ></div>
                  {index % 5 === 0 && (
                    <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function FunnelStep({ label, count, percentage, color }: { label: string; count: number; percentage: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{label}</span>
        <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-8">
        <div
          className={`${color} h-8 rounded-full flex items-center justify-center text-white text-sm font-medium`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && `${percentage.toFixed(0)}%`}
        </div>
      </div>
    </div>
  )
}

function FeatureUsageCard({ feature, usage, total }: { feature: string; usage: number; total: number }) {
  const percentage = (usage / total) * 100
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <p className="text-sm font-medium text-gray-900 mb-2">{feature}</p>
      <p className="text-2xl font-bold text-blue-600 mb-1">{usage}</p>
      <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of users</p>
    </div>
  )
}
