'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import UsageTracker from '@/components/UsageTracker'
import UpgradeModal from '@/components/UpgradeModal'
import PromoBanner from '@/components/PromoBanner'
import { OnboardingModal } from '@/components/OnboardingModal'
import { DashboardStatsSkeleton, CardSkeleton } from '@/components/LoadingProgress'
import ATSOptimizer from '@/components/ATSOptimizer'
import PhotoUpload from '@/components/PhotoUpload'
import { trackPageView, trackFeatureUsage } from '@/lib/analytics'
import { 
  Upload, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  Download,
  Trash2,
  Sparkles,
  Zap,
  Clock,
  Search,
  Filter,
  Edit3,
  Mail,
  TrendingUp,
  Activity,
  Star,
  Archive,
  X,
  CheckCircle,
  Shield,
  Crown,
  User,
  Lock,
  Check
} from 'lucide-react'
import { LanguageBadge } from '@/components/LanguageBadge'

interface CV {
  id: string
  file_meta: {
    name: string
    size: number
    upload_date: string
  }
  created_at: string
  last_accessed_at: string
  detected_language?: string
}

interface Generation {
  id: string
  job_title: string
  job_description: string
  rewrite_style: string
  tone: string
  created_at: string
  cv_id: string
  ats_score?: number
  output_language?: string
  cv?: {
    file_meta: {
      name: string
    }
  }
}

interface CoverLetter {
  id: string
  job_title: string
  company_name: string
  created_at: string
  content?: string // Optional since we don't always fetch it
  output_language?: string
}

interface InterviewPrep {
  id: string
  job_description: string
  company_research: any
  interview_data: any
  created_at: string
  cv?: {
    file_meta: {
      name: string
    }
  }
}

interface RecentActivity {
  id: string
  type: 'cv_upload' | 'cv_generation' | 'cover_letter' | 'cv_edit'
  title: string
  description: string
  created_at: string
  icon: any
}

interface UsageInfo {
  generation_count: number
  lifetime_generation_count: number
  plan_type: string
  max_lifetime_generations: number
  current_month: string
}

interface PurchaseInfo {
  status: string | null
  purchased_at: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [generations, setGenerations] = useState<Generation[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [interviewPreps, setInterviewPreps] = useState<InterviewPrep[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'cvs' | 'generations' | 'cover-letters' | 'interview-prep'>('generations')
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedCvForRating, setSelectedCvForRating] = useState<string | null>(null)
  const [cvRating, setCvRating] = useState<any>(null)
  const [isRating, setIsRating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Filter functions
  const filteredCvs = cvs.filter(cv => 
    cv.file_meta.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGenerations = generations.filter(gen => 
    gen.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gen.rewrite_style.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gen.tone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCoverLetters = coverLetters.filter(cl => 
    cl.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cl.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredInterviewPreps = interviewPreps.filter(prep => 
    prep.job_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prep.company_research?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleGenerateClick = (e: React.MouseEvent, cvId: string) => {
    e.preventDefault()
    
    // Check usage limit (lifetime generations)
    const isPro = usage?.plan_type === 'pro'
    const currentUsage = usage?.lifetime_generation_count || 0
    const maxGenerations = usage?.max_lifetime_generations || 1

    if (currentUsage >= maxGenerations) {
      if (isPro) {
        toast.error('You have reached your generation limit. Contact support for assistance.')
      } else {
        toast.error('You have used your 2 free generations. Upgrade to Pro for 100 more!', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscription')
          }
        })
      }
      return
    }

    // Navigate to generate page
    router.push(`/generate/${cvId}`)
  }

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
    
    // Track page view
    trackPageView('/dashboard')

    // Refetch data when user returns to dashboard
    const handleFocus = () => {
      console.log('Dashboard focused, refetching data...')
      fetchDashboardData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)

    // Check if user needs onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_completed) {
      setShowOnboarding(true)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if user is admin
      const adminUserId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
      setIsAdmin(user.id === adminUserId)

      // Fetch CVs
      const { data: cvsData, error: cvsError } = await supabase
        .from('cvs')
        .select('id, file_meta, created_at, last_accessed_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cvsError) {
        console.error('Error fetching CVs:', cvsError)
        toast.error('Failed to load CVs')
      } else {
        setCvs(cvsData || [])
      }

      // Fetch Generations (CV History) with ATS scores
      const { data: generationsData, error: generationsError } = await supabase
        .from('generations')
        .select(`
          id, job_title, job_description, rewrite_style, tone, created_at, cv_id, ats_score,
          cvs(file_meta)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (generationsError) {
        // Only show error if it has a message and code (real error)
        if (generationsError.message && generationsError.code) {
          console.error('Error fetching generations:', generationsError)
          toast.error('Failed to load CV generations')
        }
      }
      setGenerations(generationsData || [])

      // Fetch Cover Letters - without content to avoid size issues
      // Try both column names for backward compatibility
      let coverLettersData = null
      let coverLettersError = null
      
      try {
        const result = await supabase
          .from('cover_letters')
          .select('id, job_title, company_name, created_at')
          .order('created_at', { ascending: false })
        
        coverLettersData = result.data
        coverLettersError = result.error
      } catch (e) {
        console.error('Cover letters fetch error:', e)
      }

      // Silently handle cover letters errors (non-critical feature)
      if (coverLettersError && coverLettersError.message && coverLettersError.code) {
        console.error('Cover letters error:', coverLettersError)
      }
      
      setCoverLetters(coverLettersData || [])

      // Fetch Interview Preps
      let interviewPrepsData = null
      try {
        const result = await supabase
          .from('interview_preps')
          .select(`
            id, job_description, company_research, interview_data, created_at,
            cvs(file_meta)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        interviewPrepsData = result.data
      } catch (e) {
        console.error('Interview preps fetch error:', e)
      }
      
      setInterviewPreps(interviewPrepsData || [])

      // Create Recent Activity Feed
      const activities: RecentActivity[] = []
      
      // Add CV uploads
      cvsData?.forEach(cv => {
        activities.push({
          id: `cv-${cv.id}`,
          type: 'cv_upload',
          title: 'CV Uploaded',
          description: `Uploaded ${cv.file_meta.name}`,
          created_at: cv.created_at,
          icon: Upload
        })
      })

      // Add CV generations
      generationsData?.forEach(gen => {
        activities.push({
          id: `gen-${gen.id}`,
          type: 'cv_generation',
          title: 'CV Generated',
          description: `Generated CV for ${gen.job_title}`,
          created_at: gen.created_at,
          icon: Sparkles
        })
      })

      // Add cover letters
      coverLettersData?.forEach(cl => {
        activities.push({
          id: `cl-${cl.id}`,
          type: 'cover_letter',
          title: 'Cover Letter Created',
          description: `Cover letter for ${cl.job_title} at ${cl.company_name}`,
          created_at: cl.created_at,
          icon: Mail
        })
      })

      // Sort by date and take most recent 10
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivity(activities.slice(0, 10))

      // Fetch usage data (lifetime generations)
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('generation_count, lifetime_generation_count, plan_type, max_lifetime_generations, current_month')
        .eq('user_id', user.id)
        .single()

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching usage:', usageError)
      } else {
        setUsage(usageData)
      }

      // Fetch purchase status - handle if table doesn't exist
      try {
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchases')
          .select('status, purchased_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .maybeSingle()

        if (purchaseError && purchaseError.code !== 'PGRST116' && purchaseError.code !== '42P01') {
          console.error('Error fetching purchase:', purchaseError)
        } else {
          setPurchase(purchaseData || { status: null, purchased_at: null })
        }
      } catch (e) {
        console.log('Purchases table not available, defaulting to free plan')
        setPurchase({ status: null, purchased_at: null })
      }

    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if first visit for onboarding
  useEffect(() => {
    if (!isLoading && cvs.length === 0 && generations.length === 0) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [isLoading, cvs.length, generations.length])

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
  }

  const handleRateCV = async (cvId: string) => {
    setSelectedCvForRating(cvId)
    setRatingModalOpen(true)
    setIsRating(true)
    setCvRating(null)

    try {
      const response = await fetch('/api/rate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv_id: cvId })
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to rate CV')
        setRatingModalOpen(false)
        return
      }

      setCvRating(result.rating)
    } catch (error) {
      console.error('Rating error:', error)
      toast.error('Failed to rate CV')
      setRatingModalOpen(false)
    } finally {
      setIsRating(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        toast.error('Failed to logout')
        return
      }
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV? Your generated versions will be preserved, but the original uploaded CV will be permanently deleted.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId)

      if (error) {
        toast.error('Failed to delete CV')
      } else {
        toast.success('CV deleted successfully')
        setCvs(cvs.filter(cv => cv.id !== cvId))
      }
    } catch (error) {
      toast.error('Failed to delete CV')
    }
  }

  const handleDeleteGeneration = async (generationId: string) => {
    if (!confirm('Are you sure you want to delete this generation? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', generationId)

      if (error) {
        toast.error('Failed to delete generation')
      } else {
        toast.success('Generation deleted successfully')
        setGenerations(generations.filter(gen => gen.id !== generationId))
      }
    } catch (error) {
      toast.error('Failed to delete generation')
    }
  }

  const handleDeleteCoverLetter = async (coverLetterId: string) => {
    if (!confirm('Are you sure you want to delete this cover letter? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', coverLetterId)

      if (error) {
        toast.error('Failed to delete cover letter')
      } else {
        toast.success('Cover letter deleted successfully')
        setCoverLetters(coverLetters.filter(cl => cl.id !== coverLetterId))
      }
    } catch (error) {
      toast.error('Failed to delete cover letter')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CV Adapter</span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <DashboardStatsSkeleton />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="space-y-6">
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate usage limits based on plan type (lifetime)
  const isPro = usage?.plan_type === 'pro'
  const currentUsage = usage?.lifetime_generation_count || 0
  const maxGenerations = usage?.max_lifetime_generations || 1
  const usagePercentage = (currentUsage / maxGenerations) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false)
          fetchDashboardData()
        }}
      />
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CV Adapter</span>
              </Link>
              {/* User Info with Tier Badge */}
              {user && (
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 hidden md:inline">{user.email}</span>
                  </div>
                  {isPro ? (
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PRO
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                      FREE
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-6">
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </Link>
                </>
              )}
              {!isPro && (
                <Link
                  href="/subscription"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Upgrade to Pro</span>
                  <span className="sm:hidden">Upgrade</span>
                </Link>
              )}
              <Link
                href="/subscription"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Subscription</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Promo Banner - Only show to free users */}
        {!isPro && (
          <PromoBanner variant="dashboard" />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total CVs</p>
                <p className="text-2xl font-bold text-gray-900">{cvs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Generations</p>
                <p className="text-2xl font-bold text-gray-900">{generations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cover Letters</p>
                <p className="text-2xl font-bold text-gray-900">{coverLetters.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentUsage}/{maxGenerations}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {maxGenerations - currentUsage} generations remaining
              </p>
            </div>
          </div>
        </div>

        {/* Main Action Buttons - Professional Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cvs.length > 0 && (
            <button
              onClick={(e) => handleGenerateClick(e, cvs[0].id)}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg gap-2"
            >
              <Zap className="w-5 h-5" />
              Generate Tailored CV
            </button>
          )}

          {!isPro && (
            <Link
              href="/subscription"
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg gap-2"
            >
              <Star className="w-5 h-5" />
              Upgrade to Pro
            </Link>
          )}

          <Link
            href="/cover-letter"
            className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg gap-2"
          >
            <FileText className="w-5 h-5" />
            Create Cover Letter
          </Link>

          <Link
            href="/interview-prep"
            className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Interview Prep
          </Link>
        </div>

        {/* Usage Tracker - Prominent Display */}
        {usage && (
          <div className="mb-8">
            <UsageTracker
              currentUsage={currentUsage}
              maxGenerations={maxGenerations}
              isPro={isPro}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>
        )}

        {/* Upgrade Modal */}
        {usage && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            trigger="dashboard"
            currentUsage={currentUsage}
            maxGenerations={maxGenerations}
          />
        )}

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Tabs - Modern Pill Design */}
        <div className="mb-8">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium"
            >
              <option value="overview">📊 Overview</option>
              <option value="cvs">📄 CVs ({searchQuery ? filteredCvs.length : cvs.length})</option>
              <option value="generations">✨ Generations ({searchQuery ? filteredGenerations.length : generations.length})</option>
              <option value="cover-letters">✉️ Cover Letters ({searchQuery ? filteredCoverLetters.length : coverLetters.length})</option>
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="w-5 h-5 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('cvs')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'cvs'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                <span>CVs</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'cvs' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
                }`}>
                  {searchQuery ? filteredCvs.length : cvs.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('generations')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'generations'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                <span>Generations</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'generations' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
                }`}>
                  {searchQuery ? filteredGenerations.length : generations.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('cover-letters')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'cover-letters'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-5 h-5 mr-2" />
                <span>Cover Letters</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'cover-letters' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
                }`}>
                  {searchQuery ? filteredCoverLetters.length : coverLetters.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('interview-prep')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'interview-prep'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-5 h-5 mr-2" />
                <span>Interview Prep</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'interview-prep' ? 'bg-purple-500' : 'bg-gray-200 text-gray-700'
                }`}>
                  {searchQuery ? filteredInterviewPreps.length : interviewPreps.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(activity.created_at)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Usage Analytics */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
                      <span className="text-sm text-gray-500">{currentUsage}/{maxGenerations}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{cvs.length}</p>
                      <p className="text-sm text-gray-600">CVs Uploaded</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{generations.length}</p>
                      <p className="text-sm text-gray-600">Generations</p>
                    </div>
                  </div>

                  {!isPro && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Upgrade to Pro</p>
                          <p className="text-xs text-blue-700">Unlimited generations and premium features</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Photo Upload Section */}
          {cvs.length > 0 && (
            <div className="mt-8">
              <PhotoUpload
                cvId={cvs[0].id}
                currentPhotoUrl={(cvs[0] as any).photo_url}
                onPhotoUploaded={() => {
                  // Reload page to refresh data
                  window.location.reload()
                }}
              />
            </div>
          )}
          </>
        )}

        {activeTab === 'cvs' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Your CVs</h3>
            </div>
            
            {filteredCvs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No CVs found' : 'No CVs uploaded yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No CVs match "${searchQuery}". Try a different search term.`
                    : 'Upload your first CV to start tailoring it to job descriptions with AI.'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CV
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCvs.map((cv) => (
                  <div key={cv.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {cv.file_meta.name}
                            </h3>
                            {cv.detected_language && cv.detected_language !== 'en' && (
                              <LanguageBadge languageCode={cv.detected_language} showIcon={false} />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(cv.file_meta.size)} • Uploaded {formatDate(cv.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRateCV(cv.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-200"
                        >
                          <Star className="w-4 h-4" />
                          Rate
                        </button>
                        <Link
                          href={`/edit/${cv.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Link>
                        <Link
                          href={`/generate/${cv.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate
                        </Link>
                        <button
                          onClick={() => handleDeleteCV(cv.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'generations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">CV Generations</h3>
            </div>
            
            {filteredGenerations.length === 0 ? (
              <div className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No generations found' : 'No generations yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No generations match "${searchQuery}". Try a different search term.`
                    : 'Generate your first tailored CV to see it here.'
                  }
                </p>
                {!searchQuery && cvs.length > 0 && (
                  <button
                    onClick={(e) => handleGenerateClick(e, cvs[0].id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate CV
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredGenerations.map((generation) => (
                  <div key={generation.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {generation.job_title}
                            </h3>
                            {generation.output_language && generation.output_language !== 'en' && (
                              <LanguageBadge languageCode={generation.output_language} showIcon={false} />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {generation.rewrite_style} • {generation.tone} • {formatDate(generation.created_at)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {generation.ats_score && (
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                generation.ats_score >= 80 ? 'bg-green-100 text-green-800' :
                                generation.ats_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                ATS Score: {generation.ats_score}%
                              </div>
                            )}
                            {generation.ats_score && generation.ats_score < 75 && (
                              <ATSOptimizer
                                generationId={generation.id}
                                currentScore={generation.ats_score}
                                onOptimizationComplete={() => fetchDashboardData()}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/review/${generation.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        {generation.cv_id ? (
                          <Link
                            href={`/edit/${generation.cv_id}?generation=${generation.id}`}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </Link>
                        ) : (
                          <button
                            disabled
                            title="Original CV was deleted"
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed border border-gray-200"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        <Link
                          href={`/download/${generation.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-200"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Link>
                        <button
                          onClick={() => handleDeleteGeneration(generation.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cover-letters' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Cover Letters</h3>
            </div>
            
            {filteredCoverLetters.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No cover letters found' : 'No cover letters yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No cover letters match "${searchQuery}". Try a different search term.`
                    : 'Create your first cover letter to see it here.'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    href="/cover-letter"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Create Cover Letter
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCoverLetters.map((coverLetter) => (
                  <div key={coverLetter.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {coverLetter.job_title} at {coverLetter.company_name}
                            </h3>
                            {coverLetter.output_language && coverLetter.output_language !== 'en' && (
                              <LanguageBadge languageCode={coverLetter.output_language} showIcon={false} />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Created {formatDate(coverLetter.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/cover-letter/view/${coverLetter.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          href={`/api/cover-letter/${coverLetter.id}/export?format=docx`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-200"
                          target="_blank"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Link>
                        <button
                          onClick={() => handleDeleteCoverLetter(coverLetter.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'interview-prep' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Interview Prep Sessions</h3>
              <Link
                href="/interview-prep"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Interview Prep
              </Link>
            </div>
            
            {filteredInterviewPreps.length === 0 ? (
              <div className="p-12 text-center">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No interview preps found' : 'No interview preps yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No interview preps match "${searchQuery}". Try a different search term.`
                    : 'Generate interview questions and company research to ace your interviews!'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    href="/interview-prep"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Interview Prep
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInterviewPreps.map((prep) => (
                  <div key={prep.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {prep.company_research?.company_name || 'Interview Prep'}
                            </h3>
                            {prep.company_research && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Company Research
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {prep.job_description.substring(0, 80)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Created {formatDate(prep.created_at)}
                            {prep.cv?.file_meta?.name && ` • ${prep.cv.file_meta.name}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/interview-prep/view/${prep.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this interview prep?')) {
                              const { error } = await supabase
                                .from('interview_preps')
                                .delete()
                                .eq('id', prep.id)
                              
                              if (error) {
                                toast.error('Failed to delete')
                              } else {
                                toast.success('Interview prep deleted')
                                fetchDashboardData()
                              }
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feature Comparison for Free Users */}
        {!isPro && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Unlock Pro Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="font-semibold text-gray-900">Free Tier</div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>1 CV generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>PDF export only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>2 templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Watermark on exports</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-semibold">Pro Tier</div>
                  <span className="ml-auto bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full font-semibold">
                    £9.99/month
                  </span>
                </div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Unlimited generations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>All export formats (PDF, DOCX, HTML, TXT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>14 premium templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>No watermarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span>AI Review & Cover Letters</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href="/subscription"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Upgrade to Pro - £9.99/month
            </Link>
          </div>
        )}
      </div>

      {/* CV Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI CV Analysis</h2>
                    <p className="text-blue-100 text-sm">Powered by GPT-4</p>
                  </div>
                </div>
                <button
                  onClick={() => setRatingModalOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isRating ? (
                <div className="text-center py-16">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your CV</h3>
                  <p className="text-gray-600">Our AI is reviewing your experience, skills, and formatting...</p>
                </div>
              ) : cvRating ? (
                <div className="space-y-6">
                  {/* Score Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-100 text-sm font-medium">Overall Score</p>
                        <Star className="w-5 h-5 text-blue-200" />
                      </div>
                      <p className="text-5xl font-bold">{cvRating.overall_score}</p>
                      <p className="text-blue-100 text-sm mt-1">out of 100</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${cvRating.overall_score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-purple-100 text-sm font-medium">ATS Compatibility</p>
                        <BarChart3 className="w-5 h-5 text-purple-200" />
                      </div>
                      <p className="text-5xl font-bold">{cvRating.ats_score}</p>
                      <p className="text-purple-100 text-sm mt-1">out of 100</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${cvRating.ats_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">AI Summary</h4>
                        <p className="text-gray-700 leading-relaxed">{cvRating.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      Key Strengths
                    </h3>
                    <ul className="space-y-3">
                      {cvRating.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm font-bold">✓</span>
                          </div>
                          <span className="text-gray-700 ml-3 leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {cvRating.improvements?.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 text-sm font-bold">→</span>
                          </div>
                          <span className="text-gray-700 ml-3 leading-relaxed">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={() => setRatingModalOpen(false)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
