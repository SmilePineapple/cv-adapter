'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  Sparkles, 
  Crown,
  Building2,
  Globe,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

interface Message {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface InterviewSession {
  id?: string
  company_name: string
  company_website: string
  job_description: string
  messages: Message[]
  status: 'active' | 'completed'
  created_at: Date
}

export default function InterviewSimulatorPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Setup form
  const [showSetup, setShowSetup] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  
  // Interview session
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        .select('plan_type')
        .eq('user_id', user.id)
        .single()

      const isProUser = usage?.plan_type === 'pro'
      setIsPro(isProUser)

      if (!isProUser) {
        toast.error('Interview Simulator is a Pro feature. Please upgrade to continue.', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscription')
          }
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/signin')
    }
  }

  const startInterview = async () => {
    if (!companyName.trim() || !jobDescription.trim()) {
      toast.error('Please fill in company name and job description')
      return
    }

    if (!isPro) {
      toast.error('Interview Simulator is a Pro feature')
      router.push('/subscription')
      return
    }

    setIsSending(true)

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Authentication required')
        router.push('/auth/signin')
        return
      }

      // Call API to start interview
      const response = await fetch('/api/interview-simulator/start', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          company_name: companyName,
          company_website: companyWebsite,
          job_description: jobDescription
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start interview')
      }

      const data = await response.json()

      // Set initial message from AI
      const initialMessage: Message = {
        role: 'assistant',
        content: data.initialMessage,
        timestamp: new Date()
      }

      setMessages([initialMessage])
      setSession({
        company_name: companyName,
        company_website: companyWebsite,
        job_description: jobDescription,
        messages: [initialMessage],
        status: 'active',
        created_at: new Date()
      })
      setShowSetup(false)
      setInterviewStarted(true)
    } catch (error) {
      console.error('Start interview error:', error)
      toast.error('Failed to start interview. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isSending) return

    const userMessage: Message = {
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsSending(true)

    try {
      // Get auth token
      const { data: { session: authSession } } = await supabase.auth.getSession()
      if (!authSession) {
        toast.error('Authentication required')
        router.push('/auth/signin')
        return
      }

      const response = await fetch('/api/interview-simulator/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`
        },
        body: JSON.stringify({
          company_name: session?.company_name,
          company_website: session?.company_website,
          job_description: session?.job_description,
          messages: [...messages, userMessage]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Send message error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const endInterview = () => {
    if (session) {
      setSession({ ...session, status: 'completed' })
    }
    toast.success('Interview session ended. Great practice!')
  }

  const startNewInterview = () => {
    setShowSetup(true)
    setInterviewStarted(false)
    setMessages([])
    setSession(null)
    setCompanyName('')
    setCompanyWebsite('')
    setJobDescription('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro Feature</h2>
          <p className="text-gray-600 mb-6">
            Interview Simulator is available exclusively to Pro users. Upgrade now to practice with AI-powered interview simulations!
          </p>
          <Link
            href="/subscription"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Interview Simulator
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">PRO</span>
                </h1>
                <p className="text-sm text-gray-600">Practice with AI-powered interview simulations</p>
              </div>
            </div>
            {interviewStarted && (
              <button
                onClick={endInterview}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                End Interview
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSetup ? (
          /* Setup Form */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Start Interview Simulation</h2>
                    <p className="text-gray-600">Provide details about the role you're interviewing for</p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Our AI will act as a professional interviewer for your target role</li>
                        <li>Answer questions naturally as you would in a real interview</li>
                        <li>The AI will ask follow-up questions based on your responses</li>
                        <li>Practice as many times as you need to build confidence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Company Website */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Company Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Helps AI understand company context</p>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Job Description *
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here... Include responsibilities, requirements, and any specific skills mentioned."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">The AI will tailor questions based on this description</p>
                </div>

                {/* Start Button */}
                <button
                  onClick={startInterview}
                  disabled={isSending || !companyName.trim() || !jobDescription.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Interview Simulation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Interview Chat */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Interview Info Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{session?.company_name}</h3>
                    <p className="text-sm text-purple-100">Interview Simulation in Progress</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">AI Interviewer</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your answer..."
                    disabled={isSending}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isSending || !currentMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Answer naturally and provide specific examples from your experience
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={startNewInterview}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
