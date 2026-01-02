'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Flame, 
  Loader2,
  Sparkles,
  FileText,
  Zap,
  Skull,
  Laugh,
  AlertTriangle,
  ThumbsUp,
  Copy,
  Share2
} from 'lucide-react'

interface CV {
  id: string
  file_meta: {
    original_name: string
  }
  parsed_content: any
  created_at: string
}

export default function RoastCVPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cvs, setCvs] = useState<CV[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>('')
  const [roastLevel, setRoastLevel] = useState<'mild' | 'medium' | 'brutal'>('medium')
  const [roastStyle, setRoastStyle] = useState<'funny' | 'sarcastic' | 'professional' | 'savage'>('funny')
  const [isRoasting, setIsRoasting] = useState(false)
  const [roastResult, setRoastResult] = useState<string>('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      setUser(user)

      // Check if user is Pro
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('plan_type, subscription_tier')
        .eq('user_id', user.id)
        .single()

      const isProUser = usage?.plan_type === 'pro' || 
                        usage?.subscription_tier === 'pro_monthly' || 
                        usage?.subscription_tier === 'pro_annual'
      setIsPro(isProUser)

      if (!isProUser) {
        toast.error('Roast Your CV is a Pro feature. Please upgrade to continue.', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscription')
          }
        })
      } else {
        // Load user's CVs
        loadCVs(user.id)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/signin')
    }
  }

  const loadCVs = async (userId: string) => {
    const { data, error } = await supabase
      .from('cvs')
      .select('id, file_meta, parsed_content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCvs(data)
      if (data.length > 0) {
        setSelectedCvId(data[0].id)
      }
    }
  }

  const handleRoast = async () => {
    if (!selectedCvId) {
      toast.error('Please select a CV to roast')
      return
    }

    setIsRoasting(true)
    setRoastResult('')

    try {
      const response = await fetch('/api/roast-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: selectedCvId,
          roastLevel,
          roastStyle,
          userId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setRoastResult(data.roast)
        toast.success('🔥 Your CV has been roasted!')
      } else {
        throw new Error(data.error || 'Failed to roast CV')
      }
    } catch (error: any) {
      console.error('Roast error:', error)
      toast.error(error.message || 'Failed to roast CV')
    } finally {
      setIsRoasting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roastResult)
    toast.success('Roast copied to clipboard!')
  }

  const shareRoast = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My CV Got Roasted!',
        text: roastResult
      })
    } else {
      copyToClipboard()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pro Feature</h1>
          <p className="text-gray-600 mb-6">
            Roast Your CV is available to Pro users. Get brutally honest (and hilarious) feedback on your CV!
          </p>
          <button
            onClick={() => router.push('/subscription')}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Roast Your CV</h1>
              <p className="text-white/90 mt-1">Get brutally honest AI feedback (with humor!)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Roast Settings</h2>
          
          {/* CV Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CV to Roast
            </label>
            {cvs.length > 0 ? (
              <select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {cvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.file_meta?.original_name || 'Untitled CV'} - {new Date(cv.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No CVs found. Upload one first!</p>
                <button
                  onClick={() => router.push('/upload')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Upload CV
                </button>
              </div>
            )}
          </div>

          {/* Roast Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Roast Level 🔥
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setRoastLevel('mild')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  roastLevel === 'mild'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <ThumbsUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-semibold text-gray-900">Mild</div>
                <div className="text-xs text-gray-600 mt-1">Gentle & constructive</div>
              </button>

              <button
                onClick={() => setRoastLevel('medium')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  roastLevel === 'medium'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="font-semibold text-gray-900">Medium</div>
                <div className="text-xs text-gray-600 mt-1">Honest & funny</div>
              </button>

              <button
                onClick={() => setRoastLevel('brutal')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  roastLevel === 'brutal'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <Skull className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="font-semibold text-gray-900">Brutal</div>
                <div className="text-xs text-gray-600 mt-1">No mercy!</div>
              </button>
            </div>
          </div>

          {/* Roast Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Roast Style 😂
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setRoastStyle('funny')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  roastStyle === 'funny'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <Laugh className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                <div className="text-sm font-semibold">Funny</div>
              </button>

              <button
                onClick={() => setRoastStyle('sarcastic')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  roastStyle === 'sarcastic'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <Zap className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <div className="text-sm font-semibold">Sarcastic</div>
              </button>

              <button
                onClick={() => setRoastStyle('professional')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  roastStyle === 'professional'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-semibold">Professional</div>
              </button>

              <button
                onClick={() => setRoastStyle('savage')}
                className={`p-3 border-2 rounded-lg transition-all ${
                  roastStyle === 'savage'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <Skull className="w-5 h-5 mx-auto mb-1 text-red-600" />
                <div className="text-sm font-semibold">Savage</div>
              </button>
            </div>
          </div>

          {/* Roast Button */}
          <button
            onClick={handleRoast}
            disabled={isRoasting || !selectedCvId}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isRoasting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Roasting Your CV...
              </>
            ) : (
              <>
                <Flame className="w-6 h-6" />
                Roast My CV!
              </>
            )}
          </button>
        </div>

        {/* Roast Result */}
        {roastResult && (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-600" />
                The Roast
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={shareRoast}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="prose prose-orange max-w-none">
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {roastResult}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Remember:</p>
                  <p className="text-sm text-blue-800">
                    This is AI-generated humor! Take the feedback with a grain of salt and use it to improve your CV. 
                    For serious feedback, use our AI Expert Review feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!roastResult && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              How It Works
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">1.</span>
                <span>Select a CV you want to roast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">2.</span>
                <span>Choose how brutal you want the roast to be</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">3.</span>
                <span>Pick a style (funny, sarcastic, professional, or savage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">4.</span>
                <span>Get AI-powered roasting with honest (and hilarious) feedback</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600">
                <strong>Pro Tip:</strong> Start with "Medium" level and "Funny" style for the best balance of humor and useful feedback!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
