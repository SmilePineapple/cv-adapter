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

interface RoastableItem {
  id: string
  type: 'uploaded' | 'generated'
  name: string
  created_at: string
  content: any
}

export default function RoastCVPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [roastableItems, setRoastableItems] = useState<RoastableItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [selectedItemType, setSelectedItemType] = useState<'uploaded' | 'generated'>('uploaded')
  const [roastLevel, setRoastLevel] = useState<'mild' | 'medium' | 'brutal'>('medium')
  const [roastStyle, setRoastStyle] = useState<'funny' | 'sarcastic' | 'professional' | 'savage'>('funny')
  const [isRoasting, setIsRoasting] = useState(false)
  const [roastResult, setRoastResult] = useState<string>('')
  const [roastProgress, setRoastProgress] = useState(0)
  const [roastHistory, setRoastHistory] = useState<Array<{level: string, style: string, result: string, date: string}>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [roastCount, setRoastCount] = useState(0)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparison, setComparison] = useState<{roast1: string, roast2: string, settings1: any, settings2: any} | null>(null)
  const [battleMode, setBattleMode] = useState(false)
  const [battleCv2Id, setBattleCv2Id] = useState('')
  const [battleResult, setBattleResult] = useState<{roast1: string, roast2: string, winner: string} | null>(null)

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

      // Check if user is Pro and get roast count
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('plan_type, subscription_tier, roast_count, roast_last_reset')
        .eq('user_id', user.id)
        .single()

      const isProUser = usage?.plan_type === 'pro' || 
                        usage?.subscription_tier === 'pro_monthly' || 
                        usage?.subscription_tier === 'pro_annual'
      setIsPro(isProUser)
      setRoastCount(usage?.roast_count || 0)

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
    const items: RoastableItem[] = []

    // Load uploaded CVs
    const { data: uploadedCVs, error: cvError } = await supabase
      .from('cvs')
      .select('id, file_meta, parsed_content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!cvError && uploadedCVs) {
      uploadedCVs.forEach((cv) => {
        items.push({
          id: cv.id,
          type: 'uploaded',
          name: cv.file_meta?.original_name || 'Untitled CV',
          created_at: cv.created_at,
          content: cv.parsed_content
        })
      })
    }

    // Load generated CVs
    const { data: generatedCVs, error: genError } = await supabase
      .from('generations')
      .select('id, job_title, output_sections, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!genError && generatedCVs) {
      generatedCVs.forEach((gen) => {
        items.push({
          id: gen.id,
          type: 'generated',
          name: `Generated CV - ${gen.job_title || 'Untitled'}`,
          created_at: gen.created_at,
          content: gen.output_sections
        })
      })
    }

    // Sort all items by date
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setRoastableItems(items)
    if (items.length > 0) {
      setSelectedItemId(items[0].id)
      setSelectedItemType(items[0].type)
    }
  }

  const handleRoast = async () => {
    if (!selectedItemId) {
      toast.error('Please select a CV to roast')
      return
    }

    // Check roast limit (10 per month for Pro users)
    if (roastCount >= 10) {
      toast.error('You\'ve reached your monthly limit of 10 roasts. Resets next month!', {
        duration: 5000
      })
      return
    }

    // Warning at 8th roast
    if (roastCount === 8) {
      toast.warning('⚠️ You only have 2 more roasts left this month!', {
        duration: 5000
      })
    }

    setIsRoasting(true)
    setRoastResult('')
    setRoastProgress(0)

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setRoastProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      const response = await fetch('/api/roast-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItemId,
          itemType: selectedItemType,
          roastLevel,
          roastStyle,
          userId: user.id,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'friend',
          customPrompt: customPrompt || undefined
        })
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setRoastProgress(100)

      if (response.ok) {
        setRoastResult(data.roast)
        setRoastCount(data.roastCount || roastCount + 1)
        
        // Add to history
        const newHistoryItem = {
          level: roastLevel,
          style: roastStyle,
          result: data.roast,
          date: new Date().toISOString()
        }
        setRoastHistory(prev => [newHistoryItem, ...prev].slice(0, 5))
        
        toast.success('🔥 Your CV has been roasted!')
      } else {
        throw new Error(data.error || 'Failed to roast CV')
      }
    } catch (error: unknown) {
      console.error('Roast error:', error)
      toast.error((error as Error).message || 'Failed to roast CV')
      clearInterval(progressInterval)
    } finally {
      setTimeout(() => {
        setIsRoasting(false)
        setRoastProgress(0)
      }, 500)
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

  const handleComparison = async () => {
    if (!selectedItemId) {
      toast.error('Please select a CV to compare')
      return
    }

    setIsRoasting(true)
    setComparison(null)

    try {
      // Get two different roasts with different settings
      const [response1, response2] = await Promise.all([
        fetch('/api/roast-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: selectedItemId,
            itemType: selectedItemType,
            roastLevel: 'mild',
            roastStyle: roastStyle,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'friend'
          })
        }),
        fetch('/api/roast-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: selectedItemId,
            itemType: selectedItemType,
            roastLevel: 'brutal',
            roastStyle: roastStyle,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'friend'
          })
        })
      ])

      const [data1, data2] = await Promise.all([response1.json(), response2.json()])

      if (response1.ok && response2.ok) {
        setComparison({
          roast1: data1.roast,
          roast2: data2.roast,
          settings1: { level: 'mild', style: roastStyle },
          settings2: { level: 'brutal', style: roastStyle }
        })
        setRoastCount(data2.roastCount || roastCount + 2)
        toast.success('🔥 Comparison complete!')
      }
    } catch (error) {
      console.error('Comparison error:', error)
      toast.error('Failed to generate comparison')
    } finally {
      setIsRoasting(false)
    }
  }

  const handleBattle = async () => {
    if (!selectedItemId || !battleCv2Id) {
      toast.error('Please select two CVs to battle')
      return
    }

    setIsRoasting(true)
    setBattleResult(null)

    try {
      const [response1, response2] = await Promise.all([
        fetch('/api/roast-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: selectedItemId,
            itemType: selectedItemType,
            roastLevel,
            roastStyle,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'friend'
          })
        }),
        fetch('/api/roast-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: battleCv2Id,
            itemType: 'uploaded',
            roastLevel,
            roastStyle,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'friend'
          })
        })
      ])

      const [data1, data2] = await Promise.all([response1.json(), response2.json()])

      if (response1.ok && response2.ok) {
        // Determine winner based on roast severity
        const winner = data1.roast.length > data2.roast.length ? 'CV 1' : 'CV 2'
        setBattleResult({
          roast1: data1.roast,
          roast2: data2.roast,
          winner
        })
        setRoastCount(data2.roastCount || roastCount + 2)
        toast.success('⚔️ Battle complete!')
      }
    } catch (error) {
      console.error('Battle error:', error)
      toast.error('Failed to battle CVs')
    } finally {
      setIsRoasting(false)
    }
  }

  const generateShareCard = () => {
    // Create shareable text for social media
    const blurredRoast = roastResult.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[NAME]')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')

    const shareText = `🔥 I got my CV roasted by AI! 🔥\n\n${blurredRoast.slice(0, 200)}...\n\nTry it yourself at CV Adapter!`
    
    if (navigator.share) {
      navigator.share({
        title: 'My CV Got Roasted!',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Share text copied! Paste it on Twitter/LinkedIn')
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
              Select CV to Roast (Uploaded or Generated)
            </label>
            {roastableItems.length > 0 ? (
              <select
                value={selectedItemId}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const selectedItem = roastableItems.find(item => item.id === selectedId)
                  setSelectedItemId(selectedId)
                  if (selectedItem) {
                    setSelectedItemType(selectedItem.type)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {roastableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.type === 'uploaded' ? '📄' : '✨'} {item.name} - {new Date(item.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No CVs found. Upload or generate one first!</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push('/upload')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Upload CV
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Generate CV
                  </button>
                </div>
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

          {/* Custom Prompt Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowCustomPrompt(!showCustomPrompt)}
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              {showCustomPrompt ? 'Hide' : 'Show'} Custom Roast Prompts
            </button>
            
            {showCustomPrompt && (
              <div className="mt-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a Celebrity Roaster
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCustomPrompt('Roast my CV as if you\'re Gordon Ramsay')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      customPrompt.includes('Gordon Ramsay')
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    👨‍🍳 Gordon Ramsay
                  </button>
                  <button
                    onClick={() => setCustomPrompt('Roast my CV like a pirate')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      customPrompt.includes('pirate')
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    🏴‍☠️ Pirate
                  </button>
                  <button
                    onClick={() => setCustomPrompt('Roast my CV as if you\'re a British aristocrat')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      customPrompt.includes('aristocrat')
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    🎩 British Aristocrat
                  </button>
                  <button
                    onClick={() => setCustomPrompt('Roast my CV like a Gen Z influencer')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      customPrompt.includes('Gen Z')
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    📱 Gen Z Influencer
                  </button>
                </div>
                {customPrompt && (
                  <button
                    onClick={() => setCustomPrompt('')}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear custom prompt
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              onClick={handleRoast}
              disabled={isRoasting || !selectedItemId}
              className="py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRoasting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Roasting...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Roast My CV
                </>
              )}
            </button>

            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              disabled={isRoasting || !selectedItemId}
              className="py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Compare Roasts
            </button>

            <button
              onClick={() => setBattleMode(!battleMode)}
              disabled={isRoasting}
              className="py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Skull className="w-5 h-5" />
              CV Battle
            </button>
          </div>

          {/* Comparison Mode UI */}
          {comparisonMode && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">🔥 Roast Comparison Mode</h3>
              <p className="text-sm text-purple-700 mb-3">
                Compare Mild vs Brutal roasts side-by-side to see how different settings change the feedback!
              </p>
              <button
                onClick={handleComparison}
                disabled={isRoasting || !selectedItemId}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                Generate Comparison (Uses 2 roasts)
              </button>
            </div>
          )}

          {/* Battle Mode UI */}
          {battleMode && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">⚔️ AI Roast Battle</h3>
              <p className="text-sm text-blue-700 mb-3">
                Select two CVs to battle! AI will roast both and declare a winner.
              </p>
              <div className="mb-3">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Select Second CV
                </label>
                <select
                  value={battleCv2Id}
                  onChange={(e) => setBattleCv2Id(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a CV...</option>
                  {roastableItems.filter(item => item.id !== selectedItemId).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.type === 'uploaded' ? '📄' : '✨'} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBattle}
                disabled={isRoasting || !selectedItemId || !battleCv2Id}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                Start Battle! (Uses 2 roasts)
              </button>
            </div>
          )}

          {/* Loading Progress Bar */}
          {isRoasting && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">AI is analyzing your CV...</span>
                <span className="text-sm font-bold text-orange-600">{Math.round(roastProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 transition-all duration-500 ease-out animate-pulse"
                  style={{ width: `${roastProgress}%` }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                  <span>Reading your CV content...</span>
                </div>
                {roastProgress > 30 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span>Finding things to roast...</span>
                  </div>
                )}
                {roastProgress > 60 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span>Crafting the perfect roast...</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
                  onClick={generateShareCard}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center gap-2"
                  title="Share on social media"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share Card</span>
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

            {/* Roast Again Button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setRoastResult('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
              >
                🔥 Roast Again
              </button>
              {roastHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {showHistory ? 'Hide' : 'Show'} History ({roastHistory.length})
                </button>
              )}
            </div>

            {/* Roast History */}
            {showHistory && roastHistory.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Previous Roasts</h3>
                {roastHistory.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded">
                          {item.level.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {item.style.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">{item.result}</p>
                    <button
                      onClick={() => {
                        setRoastResult(item.result)
                        setShowHistory(false)
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                      }}
                      className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View Full Roast →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison Result */}
        {comparison && (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-purple-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              Roast Comparison: Mild vs Brutal
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Mild Roast */}
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-900">Mild Roast</h3>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {comparison.roast1}
                </p>
              </div>

              {/* Brutal Roast */}
              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900">Brutal Roast</h3>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {comparison.roast2}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                💡 <strong>Comparison Insight:</strong> Notice how the brutal roast is more direct and specific, while the mild roast is gentler but still constructive!
              </p>
            </div>

            <button
              onClick={() => setComparison(null)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Close Comparison
            </button>
          </div>
        )}

        {/* Battle Result */}
        {battleResult && (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Skull className="w-6 h-6 text-blue-600" />
              CV Battle Results
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* CV 1 */}
              <div className={`border-2 rounded-lg p-4 ${battleResult.winner === 'CV 1' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">CV 1</h3>
                  {battleResult.winner === 'CV 1' && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      🏆 WINNER
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {battleResult.roast1}
                </p>
              </div>

              {/* CV 2 */}
              <div className={`border-2 rounded-lg p-4 ${battleResult.winner === 'CV 2' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">CV 2</h3>
                  {battleResult.winner === 'CV 2' && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      🏆 WINNER
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {battleResult.roast2}
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ⚔️ <strong>Battle Verdict:</strong> {battleResult.winner} had more issues to roast! Both CVs could use some improvements.
              </p>
            </div>

            <button
              onClick={() => setBattleResult(null)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Close Battle
            </button>
          </div>
        )}

        {/* Info Card */}
        {!roastResult && !comparison && !battleResult && (
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
