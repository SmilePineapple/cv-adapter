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
  Zap,
  Twitter,
  Download,
  Filter,
  RefreshCw,
  Send,
  Trophy
} from 'lucide-react'
import { exportUsersToCSV, exportAnalyticsToCSV, exportRevenueReportToCSV } from '@/lib/csv-export'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

interface AnalyticsData {
  overview: {
    totalUsers: number
    freeUsers: number
    proUsers: number
    monthlyProUsers?: number
    annualProUsers?: number
    totalGenerations: number
    totalCVs: number
    totalCoverLetters: number
    newUsersLast7Days: number
    newUsersLast30Days: number
    activeUsers: number
    totalRevenue: number
    payingProUsers?: number  // Only customers with active Stripe subscriptions
    monthlyRecurringRevenue?: number
    projectedAnnualRevenue?: number
    conversionRate: string
    avgGenerationsPerUser: string
    revenueFromSubscriptions?: number
    revenueFromLegacyPurchases?: number
    averageRevenuePerProUser?: string
    monthlyProRevenue?: number
    annualProRevenue?: number
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
    max_lifetime_generations: number
    cv_count: number
    cover_letter_count: number
    interview_prep_count: number
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
  const [filterActivity, setFilterActivity] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterValue, setFilterValue] = useState<'all' | 'high' | 'low'>('all')
  const [showFilters, setShowFilters] = useState(false)
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
    // Search filter
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Plan filter
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    
    // Activity filter
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const lastActivity = user.last_activity ? new Date(user.last_activity) : null
    const isActive = lastActivity && lastActivity > sevenDaysAgo
    const matchesActivity = filterActivity === 'all' || 
                           (filterActivity === 'active' && isActive) ||
                           (filterActivity === 'inactive' && !isActive)
    
    // Value filter (high = >5 generations, low = <=5 generations)
    const matchesValue = filterValue === 'all' ||
                        (filterValue === 'high' && user.generation_count > 5) ||
                        (filterValue === 'low' && user.generation_count <= 5)
    
    return matchesSearch && matchesPlan && matchesActivity && matchesValue
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
                href="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
              >
                <BarChart3 className="w-4 h-4" />
                Advanced Analytics
              </Link>
              <Link
                href="/admin/competition"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg"
              >
                <Trophy className="w-4 h-4" />
                Competition
              </Link>
              <Link
                href="/admin/social-bot"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Social Bot
              </Link>
              <Link
                href="/admin/upgrade-user"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade User
              </Link>
              <Link
                href="/admin/email-campaign"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Campaign
              </Link>
              <Link
                href="/admin/send-email"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Email
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
            label="Paying Customers"
            value={analytics.overview.payingProUsers || 0}
            subtext={`${analytics.overview.proUsers} total Pro (${analytics.overview.conversionRate}% paid)`}
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
            label="Monthly Recurring Revenue"
            value={`£${(analytics.overview.monthlyRecurringRevenue || 0).toFixed(2)}`}
            subtext={`£${(analytics.overview.projectedAnnualRevenue || 0).toFixed(0)} projected ARR`}
            color="emerald"
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Revenue Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Monthly MRR</div>
              <div className="text-3xl font-bold">£{(analytics.overview.monthlyRecurringRevenue || 0).toFixed(2)}</div>
              <div className="text-xs opacity-75 mt-1">{analytics.overview.monthlyProUsers || 0} monthly × £2.99</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Projected ARR</div>
              <div className="text-3xl font-bold">£{(analytics.overview.projectedAnnualRevenue || 0).toFixed(0)}</div>
              <div className="text-xs opacity-75 mt-1">MRR × 12 months</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Monthly Subs</div>
              <div className="text-3xl font-bold">{analytics.overview.monthlyProUsers || 0}</div>
              <div className="text-xs opacity-75 mt-1">£{(analytics.overview.monthlyProRevenue || 0).toFixed(2)}/month</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Annual Subs</div>
              <div className="text-3xl font-bold">{analytics.overview.annualProUsers || 0}</div>
              <div className="text-xs opacity-75 mt-1">£{(analytics.overview.annualProRevenue || 0).toFixed(2)}/month</div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <StatCard
            icon={<Crown className="w-5 h-5" />}
            label="Conversion Rate"
            value={`${analytics.overview.conversionRate}%`}
            subtext={`${analytics.overview.proUsers} / ${analytics.overview.totalUsers} users`}
            color="purple"
            small
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Generations Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Generations (Last 7 Days)
              </h3>
              <Link 
                href="/admin/analytics"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View Full Analytics
                <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.charts.generationsByDay).slice(-7).map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{formatDate(date)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.charts.generationsByDay).slice(-7))) * 100, 100)}%` }}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                User Signups (Last 7 Days)
              </h3>
              <Link 
                href="/admin/analytics"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Monthly Stats
                <Calendar className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.charts.signupsByDay).slice(-7).map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{formatDate(date)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.charts.signupsByDay).slice(-7))) * 100, 100)}%` }}
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
            <div className="flex gap-3 flex-wrap">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'More Filters'}
              </button>
              <button
                onClick={() => exportUsersToCSV(filteredUsers)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                  <select
                    value={filterActivity}
                    onChange={(e) => setFilterActivity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active (7 days)</option>
                    <option value="inactive">Inactive (7+ days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Value</label>
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="high">High Value (&gt;5 gens)</option>
                    <option value="low">Low Value (≤5 gens)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterActivity('all')
                      setFilterValue('all')
                      setFilterPlan('all')
                      setSearchQuery('')
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Interview</th>
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
                          / {user.max_lifetime_generations === 999999 ? '∞' : user.max_lifetime_generations}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.cv_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.cover_letter_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.interview_prep_count}</td>
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
