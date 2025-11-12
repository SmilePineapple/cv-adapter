'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { Mail, Send, ArrowLeft } from 'lucide-react'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

// Pre-defined email templates
const EMAIL_TEMPLATES = {
  payment_issue: {
    subject: 'Your CV Buddy Pro Account - Payment Issue Resolved',
    message: `Hi there,

We noticed that you recently upgraded to CV Buddy Pro, but your account wasn't automatically upgraded due to a technical issue.

We sincerely apologize for this inconvenience. Your payment has been processed successfully, and we've now manually activated your Pro account.

Your Pro features are now active:
✅ Unlimited CV generations
✅ All premium templates
✅ Priority support
✅ Advanced ATS optimization

If you have any questions or concerns, please don't hesitate to reply to this email.

Thank you for your patience and for choosing CV Buddy!`
  },
  welcome_pro: {
    subject: 'Welcome to CV Buddy Pro! 🎉',
    message: `Hi there,

Welcome to CV Buddy Pro! We're thrilled to have you on board.

Your Pro account is now active with:
✅ Unlimited CV generations
✅ All premium templates
✅ Priority support
✅ Advanced ATS optimization

Get started by uploading your CV or creating a new one from scratch at:
https://www.mycvbuddy.com/dashboard

If you need any help, just reply to this email - we're here to help!`
  },
  custom: {
    subject: '',
    message: ''
  }
}

export default function AdminSendEmailPage() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [template, setTemplate] = useState<keyof typeof EMAIL_TEMPLATES>('custom')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Update subject and message when template changes
    if (template !== 'custom') {
      setSubject(EMAIL_TEMPLATES[template].subject)
      setMessage(EMAIL_TEMPLATES[template].message)
    }
  }, [template])

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

  const sendEmail = async () => {
    if (!recipientEmail || !subject || !message) {
      toast.error('Please fill in all fields')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Not authenticated')
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          to: recipientEmail,
          subject: subject,
          message: message
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to send email')
      } else {
        toast.success(`✅ Email sent to ${recipientEmail}!`)
        // Reset form
        setRecipientEmail('')
        setTemplate('custom')
        setSubject('')
        setMessage('')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error('Send email error:', error)
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Send Email to User
              </h1>
              <p className="text-gray-600">
                Send personalized emails from noreply@mycvbuddy.com
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as keyof typeof EMAIL_TEMPLATES)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="custom">Custom Email</option>
                <option value="payment_issue">Payment Issue Resolved</option>
                <option value="welcome_pro">Welcome to Pro</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Email message content..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                The message will be wrapped in a professional email template with CV Buddy branding
              </p>
            </div>

            {/* Send Button */}
            <button
              onClick={sendEmail}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📧 Email Details:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>From:</strong> CV Buddy &lt;noreply@mycvbuddy.com&gt;</li>
              <li>• <strong>Reply-To:</strong> User can reply directly to their email</li>
              <li>• <strong>Template:</strong> Professional HTML email with branding</li>
              <li>• <strong>Delivery:</strong> Sent via Resend (reliable delivery)</li>
            </ul>
          </div>

          {/* Warning Box */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Double-check the recipient email before sending</li>
              <li>• Be professional and courteous in all communications</li>
              <li>• Users can reply to these emails - check your inbox</li>
              <li>• All emails are logged for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
