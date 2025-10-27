'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { 
  getConversionFunnel, 
  getCohortRetention, 
  getFeatureAdoptionRates,
  getDailyActiveUsers 
} from '@/lib/analytics'
import Link from 'next/link'
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Activity,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react'

interface FunnelStage {
  stage: string
  users: number
  conversion_rate: number
  drop_off: number
}

interface CohortData {
  cohort_month: string
  cohort_size: number
  activity_month: string
  active_users: number
  retention_rate: number
  months_since_signup: number
}

interface FeatureData {
  feature_name: string
  users_count: number
  total_usage: number
  avg_usage_per_user: number
}

interface DAUData {
  date: string
  active_users: number
}

export default function AnalyticsV2Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([])
  const [cohortData, setCohortData] = useState<CohortData[]>([])
  const [featureData, setFeatureData] = useState<FeatureData[]>([])
  const [dauData, setDAUData] = useState<DAUData[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminAndFetchData()
  }, [])

  const checkAdminAndFetchData = async () => {
    const supabase = createSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.email !== 'jakedalerourke@gmail.com') {
      window.location.href = '/dashboard'
      return
    }
    
    setIsAdmin(true)
    await fetchAllData()
  }

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [funnel, cohort, features, dau] = await Promise.all([
        getConversionFunnel(),
        getCohortRetention(),
        getFeatureAdoptionRates(),
        getDailyActiveUsers(30)
      ])
      
      setFunnelData(funnel as FunnelStage[])
      setCohortData(cohort as CohortData[])
      setFeatureData(features as FeatureData[])
      setDAUData(dau as DAUData[])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">User journey and conversion insights</p>
              </div>
            </div>
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Conversion Funnel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Conversion Funnel</h2>
                  <p className="text-sm text-gray-600">User journey from signup to conversion</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{stage.stage}</div>
                          <div className="text-sm text-gray-600">{stage.users} users</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {stage.conversion_rate.toFixed(1)}%
                        </div>
                        {stage.drop_off > 0 && (
                          <div className="text-sm text-red-600">
                            -{stage.drop_off} dropped
                          </div>
                        )}
                      </div>
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-0.5 h-4 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Active Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Daily Active Users</h2>
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {dauData.slice(0, 28).map((day) => {
                  const maxUsers = Math.max(...dauData.map(d => d.active_users))
                  const height = maxUsers > 0 ? (day.active_users / maxUsers) * 100 : 0
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t" style={{ height: '100px' }}>
                        <div 
                          className="w-full bg-blue-500 rounded-t transition-all"
                          style={{ 
                            height: `${height}%`,
                            marginTop: `${100 - height}%`
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {new Date(day.date).getDate()}
                      </div>
                      <div className="text-xs font-semibold text-gray-900">
                        {day.active_users}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Feature Adoption */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Feature Adoption</h2>
                  <p className="text-sm text-gray-600">Most used features</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {featureData.slice(0, 10).map((feature) => (
                  <div key={feature.feature_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {feature.feature_name.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.users_count} users • {feature.total_usage} total uses
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {feature.avg_usage_per_user.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">avg per user</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort Retention */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Cohort Retention</h2>
                  <p className="text-sm text-gray-600">User retention by signup month</p>
                </div>
              </div>
              
              {cohortData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-900">Cohort</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-900">Size</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-900">Month 0</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-900">Month 1</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-900">Month 2</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-900">Month 3+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Set(cohortData.map(c => c.cohort_month))).slice(0, 6).map(cohort => {
                        const cohortRows = cohortData.filter(c => c.cohort_month === cohort)
                        const cohortSize = cohortRows[0]?.cohort_size || 0
                        
                        return (
                          <tr key={cohort} className="border-b border-gray-100">
                            <td className="py-2 px-3 font-medium text-gray-900">
                              {new Date(cohort).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </td>
                            <td className="text-right py-2 px-3 text-gray-600">{cohortSize}</td>
                            {[0, 1, 2, 3].map(month => {
                              const data = cohortRows.find(r => r.months_since_signup === month)
                              const rate = data?.retention_rate || 0
                              const color = rate > 50 ? 'text-green-600' : rate > 25 ? 'text-yellow-600' : 'text-red-600'
                              
                              return (
                                <td key={month} className={`text-right py-2 px-3 font-semibold ${color}`}>
                                  {rate > 0 ? `${rate.toFixed(0)}%` : '-'}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No cohort data available yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
