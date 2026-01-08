import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

const ADMIN_USER_ID = '75ac6140-bedc-4bbd-84c3-8dfa07356766'

const EXCLUDED_EMAILS = [
  'jakedalerourke@gmail.com',
  'smilepineapple118@gmail.com',
  'imanirenee@hotmail.com',
  'nevinthomas2020@ce.ajce.in',
  'jake.rourke@btinternet.com'
]

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user || user.id !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { testMode = false } = body

    // Fetch all users from auth
    console.log('Fetching users from auth.admin.listUsers()...')
    const { data: authData, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json(
        { error: 'Failed to fetch users: ' + usersError.message },
        { status: 500 }
      )
    }

    const authUsers = authData?.users || []
    console.log(`Found ${authUsers.length} total auth users`)

    // Get profiles for full names
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')

    const profilesMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

    // Get usage tracking to identify Pro users
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('user_id, subscription_tier')

    const proUserIds = new Set(
      usageData
        ?.filter(u => u.subscription_tier === 'pro_monthly' || u.subscription_tier === 'pro_annual')
        .map(u => u.user_id) || []
    )

    console.log(`Found ${proUserIds.size} Pro users`)

    // Filter users: confirmed emails, not Pro, not in exclusion list
    const eligibleUsers = authUsers
      .filter(u => {
        if (!u.email || !u.email_confirmed_at) return false
        if (EXCLUDED_EMAILS.includes(u.email.toLowerCase())) return false
        if (proUserIds.has(u.id)) return false
        return true
      })
      .map(u => ({
        email: u.email!,
        full_name: profilesMap.get(u.id) || null
      }))

    console.log(`Filtered to ${eligibleUsers.length} eligible non-Pro users`)

    // Test mode: only send to admin (if not excluded)
    const recipients = testMode 
      ? eligibleUsers.filter(u => u.email === 'jakedalerourke@gmail.com').slice(0, 1)
      : eligibleUsers

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        message: testMode 
          ? 'No test recipients available (admin email may be excluded)'
          : 'No eligible recipients found'
      })
    }

    console.log(`Sending campaign to ${recipients.length} users (test mode: ${testMode})`)

    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Send emails with 2-second delay between each
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]
      
      try {
        const name = recipient.full_name || 'there'
        
        await resend.emails.send({
          from: 'CV Buddy <updates@mycvbuddy.com>',
          to: recipient.email,
          subject: '🎉 Big News: Lower Prices + Amazing New Features!',
          headers: {
            'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
          html: `
            <!DOCTYPE html>
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
                            Hi ${name},
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
            </html>
          `
        })

        results.sent++
        console.log(`✓ Sent to ${recipient.email} (${i + 1}/${recipients.length})`)

      } catch (error: unknown) {
        results.failed++
        const errorMsg = `Failed to send to ${recipient.email}: ${(error as Error).message}`
        results.errors.push(errorMsg)
        console.error(errorMsg)
      }

      // Wait 2 seconds before next email (rate limiting)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pricing campaign sent to ${results.sent}/${results.total} non-Pro users`,
      results,
      excluded: {
        proUsers: proUserIds.size,
        excludedEmails: EXCLUDED_EMAILS.length
      }
    })

  } catch (error: unknown) {
    console.error('Pricing campaign error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
