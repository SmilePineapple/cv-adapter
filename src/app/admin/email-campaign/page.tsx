'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Mail, Send, Users, AlertCircle, CheckCircle, Loader2, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function EmailCampaignPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [subject, setSubject] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [testMode, setTestMode] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [excludeProUsers, setExcludeProUsers] = useState(false)
  const [excludedEmails, setExcludedEmails] = useState<string[]>([])

  useEffect(() => {
    checkAuth()
    fetchUserCount()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const adminUserId = '75ac6140-bedc-4bbd-84c3-8dfa07356766'
    if (user.id !== adminUserId) {
      router.push('/dashboard')
      toast.error('Admin access required')
      return
    }
  }

  const fetchUserCount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/admin/user-count', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserCount(data.count || 0)
      } else {
        console.error('Failed to fetch user count')
        setUserCount(0)
      }
    } catch (error) {
      console.error('Error fetching user count:', error)
      setUserCount(0)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = () => {
    setSubject('🎉 New Updates at My CV Buddy - Win Free Generations!')
    setHtmlContent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My CV Buddy Updates</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">My CV Buddy</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Exciting New Updates! 🎉</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi {name},
              </p>

              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                We've been working hard to make My CV Buddy even better for you! Here's what's new:
              </p>

              <!-- Feature 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px; font-weight: 600;">✨ More Professional Templates</h2>
                    <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.5;">
                      We've added brand new CV templates with modern designs, icons, and two-column layouts. Stand out from the crowd with our advanced templates!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px; font-weight: 600;">🎯 Better Job Matching</h2>
                    <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.5;">
                      Our AI now does an even better job of tailoring your CV to match job descriptions. Get more interviews with perfectly optimized CVs!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feature 3 - Competition -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 25px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 22px; font-weight: 700;">🏆 Win 20 Free Generations!</h2>
                    <p style="margin: 0 0 15px 0; color: #e0e7ff; font-size: 15px; line-height: 1.5;">
                      Play our monthly CV Clicker game and compete for the top 3 spots. Winners get 20 free CV generations added to their account!
                    </p>
                    <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 14px;">
                      <strong>Prize:</strong> 20 free CV generations (added to your account)<br>
                      <strong>Competition:</strong> Monthly - new winners each month!<br>
                      <strong>Winners:</strong> Top 3 scores
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin: 0;">
                      <tr>
                        <td style="background-color: #ffffff; border-radius: 6px; padding: 12px 30px;">
                          <a href="https://www.mycvbuddy.com/dashboard" style="color: #667eea; text-decoration: none; font-weight: 600; font-size: 16px;">Play Now →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 15px 40px;">
                          <a href="https://www.mycvbuddy.com/dashboard" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">Try New Features Now</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Thanks for being part of My CV Buddy!<br>
                <strong>The CV Adapter Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;">
                My CV Buddy - AI-Powered CV Generation
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://www.mycvbuddy.com" style="color: #667eea; text-decoration: none;">Visit Website</a> | 
                <a href="https://www.mycvbuddy.com/dashboard" style="color: #667eea; text-decoration: none;">Dashboard</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`)
    toast.success('Template loaded!')
  }

  const loadPricingTemplate = () => {
    setSubject('🎉 Big News: Lower Prices + Amazing New Features!')
    setExcludeProUsers(true)
    setExcludedEmails([
      'jakedalerourke@gmail.com',
      'smilepineapple118@gmail.com',
      'imanirenee@hotmail.com',
      'nevinthomas2020@ce.ajce.in',
      'jake.rourke@btinternet.com'
    ])
    setHtmlContent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 12px 0; font-weight: 800;">🎉 Exciting News!</h1>
              <p style="color: #e0e7ff; font-size: 18px; margin: 0;">We've reduced our prices & added amazing features</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; line-height: 28px; color: #1f2937; margin: 0 0 20px 0; font-weight: 600;">
                Hi {name},
              </p>
              
              <p style="font-size: 16px; line-height: 26px; color: #374151; margin: 0 0 24px 0;">
                We have some <strong>incredible news</strong> to share with you! We've been working hard to make My CV Buddy even better, and we're excited to announce:
              </p>
              
              <!-- Price Reduction Box -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px solid #f59e0b; border-radius: 12px; padding: 28px; text-align: center; margin: 0 0 32px 0;">
                <div style="font-size: 16px; color: #92400e; margin-bottom: 12px; font-weight: 600;">
                  🎊 MASSIVE PRICE REDUCTION 🎊
                </div>
                <div style="font-size: 24px; color: #78350f; text-decoration: line-through; margin-bottom: 8px;">
                  £9.99/month
                </div>
                <div style="font-size: 48px; font-weight: 900; color: #dc2626; margin-bottom: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                  £2.99/month
                </div>
                <div style="font-size: 18px; color: #92400e; font-weight: 600;">
                  That's 70% OFF! 🔥
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 26px; color: #374151; margin: 0 0 28px 0;">
                <strong>But that's not all!</strong> We've also added incredible new features to help you land your dream job:
              </p>
              
              <!-- Features Box -->
              <div style="background-color: #f0f9ff; border-left: 4px solid #4F46E5; padding: 28px; margin: 0 0 32px 0; border-radius: 8px;">
                <p style="font-size: 18px; line-height: 28px; color: #1e40af; margin: 0 0 20px 0; font-weight: 700;">
                  ✨ New Pro Features:
                </p>
                <div style="margin: 0;">
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">🎯 Interview Prep</strong> - AI-powered interview preparation tailored to your target role
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">🎭 Interview Scenarios</strong> - Practice with realistic interview simulations
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">🎨 More Templates</strong> - 14 stunning professional templates to choose from
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">∞ Unlimited Generations</strong> - Create as many CVs as you need
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">✉️ Cover Letters</strong> - AI-generated cover letters for every application
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">🚫 No Watermarks</strong> - Professional exports every time
                  </p>
                  <p style="font-size: 16px; line-height: 28px; color: #1f2937; margin: 12px 0;">
                    <strong style="color: #4F46E5;">📄 All Formats</strong> - Export to PDF, DOCX, HTML, and TXT
                  </p>
                </div>
              </div>
              
              <!-- Value Proposition -->
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 32px 0; border-radius: 8px;">
                <p style="font-size: 15px; line-height: 24px; color: #991b1b; margin: 0;">
                  <strong>💡 Think about it:</strong> For less than the price of a coffee, you get unlimited access to professional CV creation, interview prep, and all the tools you need to land your dream job. That's incredible value! ☕
                </p>
              </div>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.mycvbuddy.com/subscription" style="display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 10px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
                      Upgrade to Pro for £2.99/month →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Social Proof -->
              <div style="text-align: center; margin: 32px 0;">
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">
                  Join hundreds of users who've already upgraded
                </p>
                <div style="display: inline-block; background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 16px 24px;">
                  <p style="font-size: 16px; color: #166534; margin: 0; font-weight: 600;">
                    ⭐⭐⭐⭐⭐ "Best investment for my job search!"
                  </p>
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 26px; color: #374151; margin: 32px 0 0 0;">
                Ready to supercharge your job search? Click the button above to upgrade now!
              </p>
              
              <p style="font-size: 16px; line-height: 26px; color: #6b7280; margin: 24px 0 0 0;">
                Best regards,<br>
                <strong style="color: #1f2937;">The My CV Buddy Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <p style="font-size: 14px; line-height: 22px; color: #6b7280; text-align: center; margin: 0 0 8px 0;">
                My CV Buddy - AI-Powered CV & Cover Letter Generator
              </p>
              <p style="font-size: 14px; line-height: 22px; color: #6b7280; text-align: center; margin: 0 0 8px 0;">
                <a href="https://www.mycvbuddy.com" style="color: #4F46E5; text-decoration: underline;">mycvbuddy.com</a>
              </p>
              <p style="font-size: 12px; line-height: 20px; color: #9ca3af; text-align: center; margin: 0;">
                <a href="https://www.mycvbuddy.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`)
    toast.success('Pricing template loaded! Pro users and specified emails will be excluded.')
  }

  const handleSendCampaign = async () => {
    if (!subject || !htmlContent) {
      toast.error('Please fill in subject and content')
      return
    }

    const confirmMsg = testMode
      ? 'Send test email to yourself?'
      : `Send campaign to ${userCount} users? This will take ${Math.ceil(userCount * 5 / 60)} minutes.`

    if (!confirm(confirmMsg)) {
      return
    }

    try {
      setSending(true)
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          subject,
          htmlContent,
          testMode
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        console.log('Campaign results:', data.results)
      } else {
        toast.error(data.error || 'Failed to send campaign')
      }

    } catch (error: unknown) {
      console.error('Error sending campaign:', error)
      toast.error('Failed to send campaign')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Campaign</h1>
                <p className="text-sm text-gray-600">Send updates to all users</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">{userCount} users</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.ceil(userCount * 5 / 60)} minutes
              </p>
              <p className="text-xs text-gray-500">(5 sec delay per email)</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Emails are sent with a 5-second delay between each to respect rate limits. 
                Test mode sends only to your email. Disable test mode to send to all users.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-6">
            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Test Mode</p>
                <p className="text-sm text-gray-600">Send only to yourself for testing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Load Template Button */}
            <button
              onClick={loadTemplate}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Load Update Template
            </button>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* HTML Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Content
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter HTML content... Use {name} for personalization"
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Use <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> for user&apos;s name and <code className="bg-gray-100 px-1 rounded">{'{email}'}</code> for email
              </p>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>

            {/* Preview */}
            {showPreview && (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Email Preview:</p>
                <div 
                  className="bg-white p-4 rounded border border-gray-200 overflow-auto max-h-96"
                  dangerouslySetInnerHTML={{ __html: htmlContent.replace(/\{name\}/g, 'John').replace(/\{email\}/g, 'john@example.com') }}
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendCampaign}
              disabled={sending || !subject || !htmlContent}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>
                    {testMode ? 'Send Test Email' : `Send to ${userCount} Users`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Info */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Always test first! Enable test mode to send to yourself before sending to all users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
