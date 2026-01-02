'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  CheckCircle,
  Loader2,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Send,
  Bot,
  User,
  Lightbulb,
  BarChart3
} from 'lucide-react'

interface CareerPath {
  currentRole: string
  nextRoles: string[]
  timeline: string
  salaryProgression: string
}

interface SkillGap {
  skill: string
  current: number
  required: number
  priority: 'high' | 'medium' | 'low'
}

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  milestones: string[]
  completed: boolean
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function CareerCoachPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Career Path State
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Skills Gap State
  const [skillsGap, setSkillsGap] = useState<SkillGap[]>([])
  const [targetRole, setTargetRole] = useState('')
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatting, setIsChatting] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Goals State
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '', milestones: '' })
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<'path' | 'skills' | 'chat' | 'goals'>('path')

  useEffect(() => {
    checkAuth()
    scrollToBottom()
  }, [chatMessages])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
        toast.error('Career Coach is a Pro feature. Please upgrade to continue.', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscription')
          }
        })
      } else {
        // Load existing goals
        loadGoals(user.id)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/signin')
    }
  }

  const loadGoals = async (userId: string) => {
    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setGoals(data.map(g => ({
        ...g,
        milestones: JSON.parse(g.milestones || '[]')
      })))
    }
  }

  const analyzeCareerPath = async () => {
    if (!user) return

    setIsAnalyzing(true)
    try {
      // Get user's CV data
      const { data: cvData } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { data: generations } = await supabase
        .from('generations')
        .select('job_title, output_sections')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const response = await fetch('/api/career/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cvData: cvData?.parsed_content,
          currentRole: generations?.job_title || 'Professional'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setCareerPath(data.careerPath)
        setSkillsGap(data.skillsGap || [])
        toast.success('Career path analyzed successfully!')
      } else {
        throw new Error(data.error || 'Failed to analyze career path')
      }
    } catch (error: any) {
      console.error('Career analysis error:', error)
      toast.error(error.message || 'Failed to analyze career path')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !user) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatting(true)

    try {
      const response = await fetch('/api/career/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: chatInput,
          conversationHistory: chatMessages
        })
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setIsChatting(false)
    }
  }

  const addGoal = async () => {
    if (!user || !newGoal.title) return

    try {
      const milestones = newGoal.milestones.split('\n').filter(m => m.trim())
      
      const { data, error } = await supabase
        .from('career_goals')
        .insert({
          user_id: user.id,
          title: newGoal.title,
          description: newGoal.description,
          target_date: newGoal.targetDate,
          milestones: JSON.stringify(milestones),
          progress: 0,
          completed: false
        })
        .select()
        .single()

      if (error) throw error

      setGoals(prev => [{
        ...data,
        milestones
      }, ...prev])
      
      setNewGoal({ title: '', description: '', targetDate: '', milestones: '' })
      setShowAddGoal(false)
      toast.success('Goal added successfully!')
    } catch (error: any) {
      console.error('Add goal error:', error)
      toast.error('Failed to add goal')
    }
  }

  const updateGoalProgress = async (goalId: string, progress: number) => {
    const { error } = await supabase
      .from('career_goals')
      .update({ progress, completed: progress >= 100 })
      .eq('id', goalId)

    if (!error) {
      setGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, progress, completed: progress >= 100 } : g
      ))
      toast.success('Progress updated!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pro Feature</h1>
          <p className="text-gray-600 mb-6">
            Career Coach is available to Pro users. Upgrade now to unlock AI-powered career guidance!
          </p>
          <button
            onClick={() => router.push('/subscription')}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Career Coach</h1>
              <p className="text-gray-600">Your personal career development assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('path')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'path'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Career Path
              </div>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Skills Gap
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Chat
              </div>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Path Tab */}
        {activeTab === 'path' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Career Path Analysis</h2>
              <p className="text-gray-600 mb-6">
                Discover your potential career trajectory and see where your skills can take you.
              </p>
              
              <button
                onClick={analyzeCareerPath}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze My Career Path
                  </>
                )}
              </button>
            </div>

            {careerPath && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Next Career Steps
                  </h3>
                  <div className="space-y-3">
                    {careerPath.nextRoles.map((role, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Timeline & Salary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Timeline</p>
                      <p className="text-lg font-semibold text-gray-900">{careerPath.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Salary Progression</p>
                      <p className="text-lg font-semibold text-gray-900">{careerPath.salaryProgression}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills Gap Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Gap Analysis</h2>
              
              {skillsGap.length > 0 ? (
                <div className="space-y-4">
                  {skillsGap.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          skill.priority === 'high' ? 'bg-red-100 text-red-700' :
                          skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {skill.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Current: {skill.current}%</span>
                            <span>Required: {skill.required}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${skill.current}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Analyze your career path first to see skills gap analysis</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ height: '600px' }}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-600" />
                AI Career Advisor
              </h2>
              <p className="text-sm text-gray-600 mt-1">Ask me anything about your career!</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Start a conversation with your AI Career Coach</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      "How can I improve my CV?",
                      "What skills should I learn next?",
                      "How do I negotiate salary?",
                      "What's the best way to change careers?"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(suggestion)}
                        className="p-3 text-left text-sm bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[70%] p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                  placeholder="Ask your career question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isChatting}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={isChatting || !chatInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {isChatting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Career Goals</h2>
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  Add Goal
                </button>
              </div>

              {showAddGoal && (
                <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <h3 className="font-semibold text-gray-900 mb-4">New Career Goal</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Goal title (e.g., 'Become Senior Developer')"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                      placeholder="Milestones (one per line)"
                      value={newGoal.milestones}
                      onChange={(e) => setNewGoal({ ...newGoal, milestones: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addGoal}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                      >
                        Save Goal
                      </button>
                      <button
                        onClick={() => setShowAddGoal(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {goal.title}
                          {goal.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        {goal.targetDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Milestones:</p>
                        <ul className="space-y-1">
                          {goal.milestones.map((milestone, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}

                {goals.length === 0 && !showAddGoal && (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No goals yet. Add your first career goal to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
