'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
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
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Send,
  Linkedin,
  ChevronDown,
  Clock,
  UserCheck,
  Zap,
} from 'lucide-react'
import { exportUsersToCSV } from '@/lib/csv-export'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

interface UpcomingPayment {
  user_id: string
  email: string
  due_date: string
  due_date_ts: number
  days_until_due: number
  plan: 'monthly' | 'annual'
  amount: number
  stripe_subscription_id: string | null
  stripe_status: string
}

interface AnalyticsData {
  upcomingPayments?: UpcomingPayment[]
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
    dataFetchedAt?: string
  }
  monthlyRevenueByMonth?: Array<{ month: string; revenue: number; currency: string }>
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
    subscription_tier: string | null
    stripe_subscription_id: string | null
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
  const [resettingUserId, setResettingUserId] = useState<string | null>(null)
  const [showAllRevenueMonths, setShowAllRevenueMonths] = useState(false)
  const [showNavMenu, setShowNavMenu] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleResetGenerations = async (userId: string, userEmail: string) => {
    if (!confirm(`Reset generation counts for ${userEmail}? This will set their generation_count and lifetime_generation_count to 0.`)) {
      return
    }

    setResettingUserId(userId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Not authenticated')
        return
      }

      const response = await fetch('/api/admin/reset-generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset generations')
      }

      toast.success(`Successfully reset generations for ${userEmail}`)
      await loadAnalytics()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset generations')
      console.error(error)
    } finally {
      setResettingUserId(null)
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-600 border-t-purple-500" />
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (!isAuthorized || !analytics) return null

  const proUsers = analytics.users.filter(u => u.plan === 'pro')
  const maxRevMonth = Math.max(...(analytics.monthlyRevenueByMonth?.map(m => m.revenue) || [1]))
  const recentMonths = showAllRevenueMonths
    ? (analytics.monthlyRevenueByMonth || [])
    : (analytics.monthlyRevenueByMonth || []).slice(-6)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">My CV Buddy Admin</h1>
              {analytics.overview.dataFetchedAt && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {formatDateTime(analytics.overview.dataFetchedAt)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAnalytics}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              ← Dashboard
            </Link>
            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNavMenu(v => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Tools
                <ChevronDown className="w-4 h-4" />
              </button>
              {showNavMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {[
                    { href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" />, label: 'Full Analytics' },
                    { href: '/admin/analytics-enhanced', icon: <TrendingUp className="w-4 h-4" />, label: 'Enhanced Analytics' },
                    { href: '/admin/upgrade-user', icon: <Crown className="w-4 h-4" />, label: 'Upgrade User' },
                    { href: '/admin/sync-subscription', icon: <RefreshCw className="w-4 h-4" />, label: 'Sync Subscription' },
                    { href: '/admin/email-campaign', icon: <Mail className="w-4 h-4" />, label: 'Email Campaign' },
                    { href: '/admin/send-email', icon: <Send className="w-4 h-4" />, label: 'Send Email' },
                    { href: '/admin/social-bot', icon: <Linkedin className="w-4 h-4" />, label: 'Social Bot' },
                    { href: '/admin/competition', icon: <Activity className="w-4 h-4" />, label: 'Competition' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowNavMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── 4 Hero KPI Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={analytics.overview.totalUsers.toLocaleString()}
            sub={`+${analytics.overview.newUsersLast7Days} this week`}
            color="blue"
          />
          <KpiCard
            icon={<Crown className="w-5 h-5" />}
            label="Pro Customers"
            value={analytics.overview.payingProUsers || 0}
            sub={`${analytics.overview.monthlyProUsers || 0} monthly · ${analytics.overview.annualProUsers || 0} annual`}
            color="purple"
          />
          <KpiCard
            icon={<FileText className="w-5 h-5" />}
            label="Total Generations"
            value={analytics.overview.totalGenerations.toLocaleString()}
            sub={`${analytics.overview.avgGenerationsPerUser} avg/user`}
            color="green"
          />
          <KpiCard
            icon={<DollarSign className="w-5 h-5" />}
            label="MRR"
            value={`£${(analytics.overview.monthlyRecurringRevenue || 0).toFixed(2)}`}
            sub={`£${(analytics.overview.projectedAnnualRevenue || 0).toFixed(0)} ARR`}
            color="emerald"
          />
        </div>

        {/* ── Secondary KPIs ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2"><UserCheck className="w-3.5 h-3.5" /> Active (30d)</div>
            <div className="text-2xl font-bold">{analytics.overview.activeUsers}</div>
            <div className="text-xs text-gray-500 mt-1">Generated at least 1 CV</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2"><Calendar className="w-3.5 h-3.5" /> New (30d)</div>
            <div className="text-2xl font-bold">{analytics.overview.newUsersLast30Days}</div>
            <div className="text-xs text-gray-500 mt-1">Signups last 30 days</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2"><TrendingUp className="w-3.5 h-3.5" /> Conversion</div>
            <div className="text-2xl font-bold">{analytics.overview.conversionRate}%</div>
            <div className="text-xs text-gray-500 mt-1">{analytics.overview.payingProUsers} / {analytics.overview.totalUsers} users</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2"><DollarSign className="w-3.5 h-3.5" /> Avg Rev / Pro</div>
            <div className="text-2xl font-bold">£{analytics.overview.averageRevenuePerProUser || '0.00'}</div>
            <div className="text-xs text-gray-500 mt-1">Per paying customer</div>
          </div>
        </div>

        {/* ── Revenue by Month + Upcoming Payments ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Chart */}
          {analytics.monthlyRevenueByMonth && analytics.monthlyRevenueByMonth.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Revenue by Month
                </h2>
                <button
                  onClick={() => setShowAllRevenueMonths(v => !v)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {showAllRevenueMonths ? 'Show less' : 'Show all'}
                </button>
              </div>
              <div className="space-y-2.5">
                {recentMonths.map((m) => {
                  const pct = maxRevMonth > 0 ? (m.revenue / maxRevMonth) * 100 : 0
                  const label = new Date(m.month + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                  return (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
                          £{m.revenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upcoming Payments */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Upcoming Renewals
                <span className="ml-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                  {analytics.upcomingPayments?.length || 0}
                </span>
              </h2>
              <span className="text-xs text-gray-500">Live from Stripe</span>
            </div>

            {!analytics.upcomingPayments || analytics.upcomingPayments.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">No upcoming renewals found</div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {analytics.upcomingPayments.map((p, i) => {
                  const urgency = p.days_until_due <= 2 ? 'red' : p.days_until_due <= 7 ? 'amber' : 'gray'
                  const urgencyClasses = {
                    red: 'border-red-800 bg-red-950/40',
                    amber: 'border-amber-800 bg-amber-950/30',
                    gray: 'border-gray-700 bg-gray-800/50',
                  }
                  const badgeClasses = {
                    red: 'bg-red-500/20 text-red-400',
                    amber: 'bg-amber-500/20 text-amber-400',
                    gray: 'bg-gray-700 text-gray-400',
                  }
                  return (
                    <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${urgencyClasses[urgency]}`}>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-100 truncate">{p.email}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(p.due_date)}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${p.plan === 'annual' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {p.plan}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <div className="text-sm font-bold text-white">£{p.amount.toFixed(2)}</div>
                        <span className={`inline-flex text-xs px-1.5 py-0.5 rounded font-medium ${badgeClasses[urgency]}`}>
                          {p.days_until_due === 0 ? 'Today' : `${p.days_until_due}d`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Activity Charts ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Generations (Last 7 Days)
            </h2>
            <div className="space-y-2">
              {(() => {
                const entries = Object.entries(analytics.charts.generationsByDay).slice(-7)
                const max = Math.max(...entries.map(([, v]) => v), 1)
                return entries.map(([date, count]) => (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 shrink-0">{formatDate(date)}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">{count}</span>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Signups (Last 7 Days)
            </h2>
            <div className="space-y-2">
              {(() => {
                const entries = Object.entries(analytics.charts.signupsByDay).slice(-7)
                const max = Math.max(...entries.map(([, v]) => v), 1)
                return entries.map(([date, count]) => (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 shrink-0">{formatDate(date)}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                      <div className="bg-green-600 h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">{count}</span>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>

        {/* ── Pro Users Table ──────────────────────────────────────── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-400" />
              Pro Customers
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">
                {proUsers.length}
              </span>
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{analytics.overview.monthlyProUsers || 0} monthly</span>
              <span className="text-gray-700">·</span>
              <span>{analytics.overview.annualProUsers || 0} annual</span>
              <span className="text-gray-700">·</span>
              <span className="text-emerald-400 font-semibold">£{(analytics.overview.monthlyRecurringRevenue || 0).toFixed(2)} MRR</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Activity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Generations</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">CVs / Letters</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody>
                {proUsers
                  .sort((a, b) => b.generation_count - a.generation_count)
                  .map((user) => {
                    const daysSince = user.last_activity
                      ? Math.floor((Date.now() - new Date(user.last_activity).getTime()) / 86400000)
                      : 999
                    const isRecent = daysSince < 7
                    const tier = user.subscription_tier
                    return (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-100">{user.email}</div>
                          {user.full_name && <div className="text-xs text-gray-500">{user.full_name}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            tier === 'pro_annual' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            <Crown className="w-3 h-3" />
                            {tier === 'pro_annual' ? 'Annual' : 'Monthly'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isRecent ? 'bg-green-500' : 'bg-gray-600'}`} />
                            <span className="text-xs text-gray-400">{isRecent ? 'Active' : `${daysSince}d ago`}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold text-purple-300">{user.generation_count}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {user.cv_count} <span className="text-gray-600">/</span> {user.cover_letter_count}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {user.last_activity ? formatDateTime(user.last_activity) : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── All Users Table ──────────────────────────────────────── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                All Users
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-medium border border-gray-700">
                  {filteredUsers.length}
                </span>
              </h2>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as 'all' | 'free' | 'pro')}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
                <button
                  onClick={() => exportUsersToCSV(filteredUsers)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={filterActivity}
                  onChange={(e) => setFilterActivity(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  <option value="all">Any Activity</option>
                  <option value="active">Active (7d)</option>
                  <option value="inactive">Inactive (7d+)</option>
                </select>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value as 'all' | 'high' | 'low')}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  <option value="all">Any Usage</option>
                  <option value="high">High (&gt;5 gens)</option>
                  <option value="low">Low (≤5 gens)</option>
                </select>
                <button
                  onClick={() => { setFilterActivity('all'); setFilterValue('all'); setFilterPlan('all'); setSearchQuery('') }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gens</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">CVs / Letters</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="text-sm font-medium text-gray-200">{user.email}</div>
                      {user.full_name && <div className="text-xs text-gray-500">{user.full_name}</div>}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.plan === 'pro' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {user.plan === 'pro' ? '👑 Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-sm font-semibold text-blue-400">{user.generation_count}</td>
                    <td className="py-2.5 px-4 text-sm text-gray-400">{user.cv_count} / {user.cover_letter_count}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">{formatDate(user.created_at)}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">
                      {user.last_activity ? formatDateTime(user.last_activity) : '—'}
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => handleResetGenerations(user.id, user.email)}
                        disabled={resettingUserId === user.id}
                        className="px-2.5 py-1 bg-gray-700 hover:bg-orange-700 text-gray-300 hover:text-white text-xs rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1"
                      >
                        {resettingUserId === user.id
                          ? <><div className="w-3 h-3 animate-spin rounded-full border-2 border-gray-400 border-t-white" /> Resetting</>
                          : <><RefreshCw className="w-3 h-3" /> Reset</>}
                      </button>
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

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub: string
  color: 'blue' | 'purple' | 'green' | 'emerald'
}

function KpiCard({ icon, label, value, sub, color }: KpiCardProps) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    green: 'text-green-400 bg-green-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
  }
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${colors[color]}`}>{icon}</div>
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  )
}
