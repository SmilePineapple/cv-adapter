'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Calendar, TrendingUp, Send, RefreshCw, Settings, BarChart3, Twitter, Linkedin, Facebook, Instagram, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SocialPost {
  id: string
  content: string
  platform: string
  content_type: string
  hashtags: string[]
  scheduled_for: string
  posted: boolean
  posted_at?: string
  likes: number
  shares: number
  comments: number
  clicks: number
}

interface PlatformConfig {
  platform: string
  enabled: boolean
  posting_enabled: boolean
  daily_post_limit: number
  posts_today: number
}

export default function SocialBotDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [configs, setConfigs] = useState<PlatformConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('twitter')
  const [showScheduled, setShowScheduled] = useState(true)

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchData()
  }, [showScheduled])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch posts
      const { data: postsData } = await supabase
        .from('social_media_posts')
        .select('*')
        .eq('posted', !showScheduled)
        .order('scheduled_for', { ascending: !showScheduled })
        .limit(50)

      setPosts(postsData || [])

      // Fetch configs
      const { data: configsData } = await supabase
        .from('social_media_config')
        .select('*')

      setConfigs(configsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyContent = async (platform: string) => {
    setGenerating(true)
    try {
      const response = await fetch('/api/social-bot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Generated ${result.count} posts for ${platform}!`)
        fetchData()
      } else {
        toast.error(result.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-500" />
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />
      default: return <Send className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'linkedin': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'facebook': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'instagram': return 'bg-pink-100 text-pink-700 border-pink-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalEngagement = posts.reduce((sum, post) => 
    sum + post.likes + post.shares + post.comments, 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Bot</h1>
              <p className="text-gray-600 mt-1">Automated content generation & posting</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Posts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {posts.filter(p => !p.posted).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Posted Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {posts.filter(p => p.posted && new Date(p.posted_at!).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalEngagement}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Platforms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {configs.filter(c => c.enabled).length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {configs.map((config) => (
            <div key={config.platform} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                {getPlatformIcon(config.platform)}
                <span className={`px-2 py-1 rounded text-xs font-medium ${config.posting_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {config.posting_enabled ? 'Active' : 'Paused'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 capitalize mb-2">{config.platform}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {config.posts_today} / {config.daily_post_limit} posts today
              </p>
              <button
                onClick={() => generateWeeklyContent(config.platform)}
                disabled={generating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {generating ? 'Generating...' : 'Generate Week'}
              </button>
            </div>
          ))}
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Posts</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowScheduled(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showScheduled
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => setShowScheduled(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showScheduled
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Posted
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No {showScheduled ? 'scheduled' : 'posted'} posts found
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPlatformColor(post.platform)}`}>
                          {post.platform}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          {post.content_type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.posted ? post.posted_at! : post.scheduled_for)}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-3 whitespace-pre-wrap">{post.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.hashtags.map((tag, i) => (
                          <span key={i} className="text-xs text-blue-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {post.posted && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>❤️ {post.likes}</span>
                          <span>🔄 {post.shares}</span>
                          <span>💬 {post.comments}</span>
                          <span>🔗 {post.clicks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
