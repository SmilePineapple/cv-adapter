'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com'] // Add your admin emails here

export default function AdminUpgradeUserPage() {
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      toast.error('Unauthorized - Admin access only')
      router.push('/dashboard')
      return
    }
    
    setIsAuthorized(true)
    setIsCheckingAuth(false)
  }

  const upgradeUser = async () => {
    if (!email && !userId) {
      toast.error('Please enter an email or user ID')
      return
    }

    setIsLoading(true)

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Not authenticated')
        router.push('/auth/login')
        return
      }

      // Call API route to upgrade user
      const response = await fetch('/api/admin/upgrade-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          email: email || undefined,
          userId: userId || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to upgrade user')
      } else {
        toast.success(`✅ ${data.email} upgraded to Pro!`)
        setEmail('')
        setUserId('')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Checking authorization...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin: Upgrade User to Pro
          </h1>
          <p className="text-gray-600 mb-8">
            Manually upgrade any user to Pro for free testing
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pameladalerourke@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="text-center text-gray-500 text-sm">OR</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="43db75c8-26a7-4403-9c6f-9a36e78e071e"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={upgradeUser}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Upgrading...' : 'Upgrade to Pro (Free)'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ Admin Authenticated</h3>
            <p className="text-sm text-green-800">
              Only users in ADMIN_EMAILS can access this page. Currently authorized: {ADMIN_EMAILS.join(', ')}
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 What This Does:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sets user plan to &quot;pro&quot;</li>
              <li>• Sets status to &quot;active&quot;</li>
              <li>• Valid for 1 year</li>
              <li>• No Stripe charges</li>
              <li>• Unlimited CV generations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
