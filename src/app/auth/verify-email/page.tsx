'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    checkVerificationStatus()
    
    // Check every 3 seconds if email is verified
    const interval = setInterval(checkVerificationStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const checkVerificationStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    setEmail(user.email || '')
    
    // Check if email is verified
    if (user.email_confirmed_at) {
      setIsVerified(true)
      setIsChecking(false)
      toast.success('Email verified! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      setIsChecking(false)
    }
  }

  const resendVerificationEmail = async () => {
    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      toast.success('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      console.error('Resend error:', error)
      toast.error(error.message || 'Failed to resend email')
    } finally {
      setIsResending(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. Redirecting to dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification link to:
          </p>
          <p className="text-blue-600 font-medium mt-2">{email}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Check your inbox</p>
              <p>Click the verification link in the email we sent you. The page will automatically update once verified.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={resendVerificationEmail}
            disabled={isResending}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isResending ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            <p>Didn't receive the email?</p>
            <p className="mt-1">Check your spam folder or click the button above to resend.</p>
          </div>

          <div className="pt-4 border-t border-gray-200 text-center">
            <Link 
              href="/dashboard" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Skip for now (you can verify later)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
