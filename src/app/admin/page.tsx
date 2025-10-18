'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Mail, 
  DollarSign, 
  Activity,
  Crown,
  Calendar,
  BarChart3,
  UserCheck,
  Zap
} from 'lucide-react'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

interface AnalyticsData {
  overview: {
    totalUsers: number
    freeUsers: number
    proUsers: number
    totalGenerations: number
    totalCVs: number
    totalCoverLetters: number
    newUsersLast7Days: number
    newUsersLast30Days: number
    activeUsers: number
    totalRevenue: number
    conversionRate: string
    avgGenerationsPerUser: string
    revenueFromPurchases?: number
    revenueFromLegacySubscriptions?: number
    averageRevenuePerProUser?: string
  }
  charts: {
    generationsByDay: { [key: string]: number }
    signupsByDay: { [key: string]: number }
  }
  users: Array<{
    id: string
    email: string
    created_at: string
    last_sign_in_at: string
    plan: string
    status: string
    generation_count: number
    monthly_usage: number
    lifetime_usage: number
    cv_count: number
    cover_letter_count: number
    last_activity: string
    full_name: string | null
  }>
  topUsers: Array<{
    id: string
    email: string
    generation_count: number
    plan: string
  }>
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro'>('all')
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      toast.error('Unauthorized - Admin access only')
      router.push('/dashboard')
      return
    }
    
    setIsAuthorized(true)
    await loadAnalytics()
  }

  const loadAnalytics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Not authenticated')
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
    } catch (error) {
      toast.error('Failed to load analytics')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = analytics?.users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    return matchesSearch && matchesPlan
  }) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  if (!isAuthorized || !analytics) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">CV Adapter Analytics & User Management</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/upgrade-user"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade User
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={analytics.overview.totalUsers}
            subtext={`${analytics.overview.newUsersLast7Days} new this week`}
            color="blue"
          />
          <StatCard
            icon={<Crown className="w-6 h-6" />}
            label="Pro Users"
            value={analytics.overview.proUsers}
            subtext={`${analytics.overview.conversionRate}% conversion rate`}
            color="purple"
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            label="Total Generations"
            value={analytics.overview.totalGenerations}
            subtext={`${analytics.overview.avgGenerationsPerUser} avg per user`}
            color="green"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Revenue"
            value={`£${analytics.overview.totalRevenue.toFixed(2)}`}
            subtext={`£${analytics.overview.averageRevenuePerProUser || '0'} avg per Pro user`}
            color="emerald"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<UserCheck className="w-5 h-5" />}
            label="Active Users (30d)"
            value={analytics.overview.activeUsers}
            subtext="Generated at least 1 CV"
            color="indigo"
            small
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="New Users (30d)"
            value={analytics.overview.newUsersLast30Days}
            subtext="Last month signups"
            color="pink"
            small
          />
          <StatCard
            icon={<Mail className="w-5 h-5" />}
            label="Cover Letters"
            value={analytics.overview.totalCoverLetters}
            subtext="Total created"
            color="orange"
            small
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Generations Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Generations (Last 30 Days)
            </h3>
            <div className="space-y-2">
              {Object.entries(analytics.charts.generationsByDay).slice(-14).map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{formatDate(date)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.charts.generationsByDay))) * 100, 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signups Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              User Signups (Last 30 Days)
            </h3>
            <div className="space-y-2">
              {Object.entries(analytics.charts.signupsByDay).slice(-14).map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{formatDate(date)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.charts.signupsByDay))) * 100, 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Top 10 Users by Generations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Generations</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-bold text-gray-900">#{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan === 'pro' ? '👑 Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-blue-600">{user.generation_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Users Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              All Users ({filteredUsers.length})
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value as 'all' | 'free' | 'pro')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Only</option>
                <option value="pro">Pro Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Gens</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lifetime</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CVs</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Letters</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        {user.full_name && (
                          <div className="text-xs text-gray-500">{user.full_name}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan === 'pro' ? '👑 Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-blue-600">{user.generation_count}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {user.lifetime_usage}
                        <span className="text-xs text-gray-500 ml-1">
                          / {user.plan === 'pro' ? '100' : '1'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.cv_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.cover_letter_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.last_activity ? formatDateTime(user.last_activity) : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext: string
  color: 'blue' | 'purple' | 'green' | 'emerald' | 'indigo' | 'pink' | 'orange'
  small?: boolean
}

function StatCard({ icon, label, value, subtext, color, small = false }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`${small ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-1`}>{value}</div>
      <div className="text-sm text-gray-500">{subtext}</div>
    </div>
  )
}
