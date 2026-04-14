import React from 'react'
import { Resend } from 'resend'
import WelcomeEmail from '@/emails/WelcomeEmail'
import FirstGenerationEmail from '@/emails/FirstGenerationEmail'
import LimitReachedEmail from '@/emails/LimitReachedEmail'
import ReEngagementEmail from '@/emails/ReEngagementEmail'
import PromoEmail from '@/emails/PromoEmail'
import ThreeDayReminderEmail from '@/emails/ThreeDayReminderEmail'

/**
 * Lazy initialization of Resend client to avoid build-time errors
 * when RESEND_API_KEY is not available
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Buddy <support@mycvbuddy.com>'
const REPLY_TO = 'support@mycvbuddy.com'

/**
 * Send 3-day reminder email to users who haven't generated a CV yet
 */
export async function send3DayReminderEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: "Don't forget your free CV generation! 🚀",
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      react: React.createElement(ThreeDayReminderEmail, { name }),
    })

    if (error) {
      console.error('3-day reminder email error:', error)
      return { success: false, error }
    }

    console.log('3-day reminder email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('3-day reminder email exception:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const htmlContent = `
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
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #4F46E5; padding: 32px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 32px; margin: 0;">Welcome to CV Buddy! 🎉</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        Hi ${name || 'there'},
                      </p>
                      
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        Welcome aboard! We're thrilled to have you join thousands of job seekers who are landing their dream jobs with AI-powered CVs.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        <strong>You have 1 free CV generation to get started!</strong>
                      </p>
                      
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0; background-color: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <strong>⚠️ Important:</strong> If you signed up with email/password, you can log in immediately and start creating your CV. No email confirmation needed!
                      </p>
                      
                      <!-- Benefits Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 24px 0;">
                        <tr>
                          <td>
                            <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0 0 12px 0;">
                              What you can do with CV Buddy:
                            </p>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 8px 0;">✅ Generate ATS-optimized CVs in seconds</p>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 8px 0;">✅ Create personalized cover letters</p>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 8px 0;">✅ Prepare for interviews with AI</p>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 8px 0;">✅ Export to PDF, DOCX, or TXT</p>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 8px 0;">✅ Support for 50+ languages</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="https://www.mycvbuddy.com/dashboard" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                              Start Creating Your CV
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 20px 0;">
                        Need help? Just reply to this email and we'll be happy to assist you!
                      </p>
                      
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 20px 0 0 0;">
                        Best regards,<br>
                        The CV Buddy Team
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="font-size: 12px; line-height: 20px; color: #6b7280; text-align: center; margin: 0 0 8px 0;">
                        You're receiving this email because you signed up for CV Buddy.
                      </p>
                      <p style="font-size: 12px; line-height: 20px; color: #6b7280; text-align: center; margin: 0;">
                        <a href="https://www.mycvbuddy.com" style="color: #4F46E5; text-decoration: underline;">mycvbuddy.com</a>
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

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Welcome to CV Buddy - Your AI-Powered CV Assistant 🎉',
      html: htmlContent,
    })

    if (error) {
      console.error('Welcome email error:', error)
      return { success: false, error }
    }

    console.log('Welcome email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Welcome email exception:', error)
    return { success: false, error }
  }
}

/**
 * Send email after first CV generation
 */
export async function sendFirstGenerationEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    // Use HTML fallback for production stability
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f9fc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background-color: #4F46E5; padding: 32px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 32px; margin: 0;">Great Job! 🚀</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        Hi ${name || 'there'},
                      </p>
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        Congratulations on generating your first AI-powered CV! 🎉 You're one step closer to landing your dream job.
                      </p>
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        <strong>You've used your 1 free generation.</strong> Want to create more tailored CVs for different jobs?
                      </p>
                      <div style="background-color: #f0f9ff; border-left: 4px solid #4F46E5; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
                        <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 15px 0;">
                          <strong>🚀 Upgrade to Pro for just £2.99/month and unlock:</strong>
                        </p>
                        <ul style="font-size: 15px; line-height: 24px; color: #333333; margin: 0; padding-left: 20px;">
                          <li><strong>Unlimited CV generations</strong> - Create as many tailored CVs as you need</li>
                          <li><strong>AI Expert Review</strong> - Get professional feedback on your CV</li>
                          <li><strong>Cover Letter Generator</strong> - AI-powered cover letters for every application</li>
                          <li><strong>14 Premium Templates</strong> - Stand out with advanced designs</li>
                          <li><strong>All Export Formats</strong> - PDF, DOCX, HTML, and TXT</li>
                          <li><strong>No Watermarks</strong> - Professional exports every time</li>
                        </ul>
                      </div>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://www.mycvbuddy.com/subscription" style="background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                              Upgrade to Pro for Unlimited
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; line-height: 22px; color: #666666; margin: 30px 0 0 0;">
                        Best regards,<br>
                        The CV Buddy Team
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Great job on your first CV! 🚀',
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: htmlContent,
    })

    if (error) {
      console.error('First generation email error:', error)
      return { success: false, error }
    }

    console.log('First generation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('First generation email exception:', error)
    return { success: false, error }
  }
}

/**
 * Send email when user reaches generation limit
 */
export async function sendLimitReachedEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    // Use HTML fallback for production stability
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f9fc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background-color: #4F46E5; padding: 32px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 32px; margin: 0;">Upgrade to Pro! 🎯</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        Hi ${name || 'there'},
                      </p>
                      <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                        You've used your free CV generation! 🎯 Ready to take your job search to the next level?
                      </p>
                      <p style="font-size: 18px; line-height: 28px; color: #333333; margin: 0 0 10px 0;">
                        <strong>Upgrade to Pro for just £2.99/month</strong>
                      </p>
                      <p style="font-size: 14px; line-height: 22px; color: #666666; margin: 0 0 30px 0;">
                        That's less than a coffee! ☕ Or save 17% with our annual plan at £29.99/year.
                      </p>
                      <div style="background-color: #f0f9ff; border-left: 4px solid #4F46E5; padding: 25px; margin: 0 0 30px 0; border-radius: 4px;">
                        <p style="font-size: 16px; line-height: 26px; color: #333333; margin: 0 0 20px 0;">
                          <strong>🚀 What You'll Get:</strong>
                        </p>
                        <ul style="font-size: 15px; line-height: 26px; color: #333333; margin: 0; padding-left: 20px;">
                          <li><strong>∞ Unlimited CV Generations</strong> - Create tailored CVs for every job application</li>
                          <li><strong>🤖 AI Expert Review</strong> - Get professional feedback to improve your CV</li>
                          <li><strong>✉️ Cover Letter Generator</strong> - AI-powered cover letters that match your CV</li>
                          <li><strong>🎨 14 Premium Templates</strong> - Stand out with advanced, ATS-friendly designs</li>
                          <li><strong>📄 All Export Formats</strong> - PDF, DOCX, HTML, and TXT</li>
                          <li><strong>🚫 No Watermarks</strong> - Professional exports every time</li>
                          <li><strong>⚡ Priority Support</strong> - Get help when you need it most</li>
                          <li><strong>🎯 Advanced ATS Optimization</strong> - Beat applicant tracking systems</li>
                        </ul>
                      </div>
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
                        <p style="font-size: 15px; line-height: 24px; color: #92400e; margin: 0;">
                          <strong>💡 Pro Tip:</strong> Most users apply to 10-20 jobs before landing an interview. With Pro, you can create a perfectly tailored CV for each one!
                        </p>
                      </div>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://www.mycvbuddy.com/subscription" style="background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                              Upgrade to Pro Now
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; line-height: 22px; color: #666666; margin: 30px 0 0 0;">
                        Best regards,<br>
                        The CV Buddy Team
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'You\'ve used your free generation - Upgrade to Pro for £2.99/month! 🚀',
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: htmlContent,
    })

    if (error) {
      console.error('Limit reached email error:', error)
      return { success: false, error }
    }

    console.log('Limit reached email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Limit reached email exception:', error)
    return { success: false, error }
  }
}


/**
 * Send re-engagement email to inactive users
 */
export async function sendReEngagementEmail(
  email: string, 
  name: string, 
  daysAgo: number,
  remainingGenerations: number = 1
) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'We miss you! Come back and use your free CV generation 👋',
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      react: React.createElement(ReEngagementEmail, { name, daysAgo, remainingGenerations }),
    })

    if (error) {
      console.error('Re-engagement email error:', error)
      return { success: false, error }
    }

    console.log('Re-engagement email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Re-engagement email exception:', error)
    return { success: false, error }
  }
}

/**
 * Send upgrade confirmation email
 */
export async function sendUpgradeConfirmationEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Welcome to CV Buddy Pro! 🎉',
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <h1>Welcome to Pro!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for upgrading to CV Buddy Pro! You now have access to:</p>
        <ul>
          <li>100 CV Generations</li>
          <li>Unlimited Cover Letters</li>
          <li>Interview Preparation</li>
          <li>All Export Formats</li>
          <li>50+ Languages</li>
        </ul>
        <p>Start creating: <a href="https://www.mycvbuddy.com/dashboard">Go to Dashboard</a></p>
        <p>Best regards,<br>The CV Buddy Team</p>
      `,
    })

    if (error) {
      console.error('Upgrade confirmation email error:', error)
      return { success: false, error }
    }

    console.log('Upgrade confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Upgrade confirmation email exception:', error)
    return { success: false, error }
  }
}

/**
 * Send payment failed / dunning email to notify user of failed charge
 */
export async function sendPaymentFailedEmail(email: string, name: string, attemptCount: number, isLastAttempt: boolean) {
  try {
    const resend = getResendClient()
    const subject = isLastAttempt
      ? '⚠️ Your CV Buddy Pro subscription has been cancelled'
      : `⚠️ Payment failed for your CV Buddy Pro subscription (attempt ${attemptCount})`

    const bodyMessage = isLastAttempt
      ? `Unfortunately, after ${attemptCount} failed payment attempts, your Pro subscription has been cancelled and your account has been moved to the free plan. You can re-subscribe at any time from your account settings.`
      : `We were unable to process your subscription payment (attempt ${attemptCount} of 3). We will automatically retry. Please update your payment method to avoid losing Pro access.`

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject,
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f9fc;padding:40px 0;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="background-color:#DC2626;padding:32px;text-align:center;">
                      <h1 style="color:#ffffff;font-size:26px;margin:0;">Payment Failed ⚠️</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="font-size:16px;line-height:26px;color:#333333;margin:0 0 20px 0;">Hi ${name},</p>
                      <p style="font-size:16px;line-height:26px;color:#333333;margin:0 0 20px 0;">${bodyMessage}</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:20px 0;">
                            <a href="https://www.mycvbuddy.com/subscription" style="display:inline-block;padding:16px 32px;background:#4F46E5;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
                              ${isLastAttempt ? 'Re-subscribe Now →' : 'Update Payment Method →'}
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size:14px;line-height:22px;color:#6b7280;margin:20px 0 0 0;">
                        If you need help, reply to this email or contact us at support@mycvbuddy.com
                      </p>
                      <p style="font-size:16px;line-height:26px;color:#4b5563;margin:30px 0 0 0;">
                        Best regards,<br>The CV Buddy Team
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px;border-top:1px solid #e5e7eb;text-align:center;background-color:#f9fafb;">
                      <p style="font-size:14px;color:#6b7280;margin:4px 0;">CV Buddy · <a href="https://www.mycvbuddy.com/unsubscribe" style="color:#7c3aed;">Unsubscribe</a></p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Payment failed email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Payment failed email exception:', error)
    return { success: false, error }
  }
}

/**
 * Send promotional email (4 days left offer)
 * Using HTML for reliability
 */
export async function sendPromoEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: '💼 Get more from My CV Buddy',
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0;">💼 Still job hunting?</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">Hi ${name},</p>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 24px;">
                Applying to multiple roles? Each job is different — and your CV should be too. Upgrade to Pro and tailor your CV for every single application in minutes.
              </p>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 16px;">
                <strong>What you get with Pro — just £2.99/month:</strong>
              </p>
              
              <div style="margin: 16px 0 24px 0;">
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Unlimited CV Generations</strong> — one for every role</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Unlimited Cover Letters</strong></p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Interview Preparation</strong> with AI</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>All Export Formats</strong> (PDF, DOCX, HTML, TXT)</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>AI Review</strong> on every section</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Premium Templates</strong> — stand out from the crowd</p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.mycvbuddy.com/subscription" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Upgrade to Pro — £2.99/month →
                </a>
              </div>
              
              <p style="font-size: 15px; line-height: 24px; color: #6b7280; margin: 0;">
                Rooting for you,<br><br>
                Jake @ My CV Buddy
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 24px; border-top: 1px solid #e5e7eb; text-align: center; background-color: #f9fafb;">
              <p style="font-size: 13px; color: #9ca3af; margin: 4px 0;">My CV Buddy · <a href="https://www.mycvbuddy.com" style="color: #7c3aed; text-decoration: none;">mycvbuddy.com</a></p>
              <p style="font-size: 13px; color: #9ca3af; margin: 4px 0;"><a href="https://www.mycvbuddy.com/unsubscribe" style="color: #9ca3af;">Unsubscribe</a></p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Upgrade reminder email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Upgrade reminder email exception:', error)
    return { success: false, error }
  }
}

/**
 * Day 3 sequence: "Did you try Pro yet?" — sent to all free users on day 3
 * Focuses on social proof and what they're missing, not urgency
 */
export async function sendDay3ProNudgeEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `${name ? name + ', have' : 'Have'} you tried tailoring your CV yet? 🎯`,
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f9fc;padding:40px 0;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:36px;text-align:center;">
                      <h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:700;">Your CV is competing against 200+ others 📋</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 20px 0;">Hi ${name || 'there'},</p>
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 20px 0;">
                        For most job postings, recruiters spend <strong>just 6 seconds</strong> scanning a CV before deciding to read on or bin it. The ones that get read are tailored to match the job description — keyword for keyword.
                      </p>
                      <div style="background-color:#f0f9ff;border-left:4px solid #4F46E5;padding:20px;margin:0 0 28px 0;border-radius:4px;">
                        <p style="font-size:15px;line-height:24px;color:#1e40af;margin:0 0 12px 0;font-weight:600;">With My CV Buddy Pro you can:</p>
                        <p style="font-size:15px;line-height:26px;color:#334155;margin:6px 0;">✅ Generate unlimited tailored CVs for every application</p>
                        <p style="font-size:15px;line-height:26px;color:#334155;margin:6px 0;">✅ Get an AI expert review of your existing CV</p>
                        <p style="font-size:15px;line-height:26px;color:#334155;margin:6px 0;">✅ Create matching cover letters in one click</p>
                        <p style="font-size:15px;line-height:26px;color:#334155;margin:6px 0;">✅ Practice interview questions tailored to the role</p>
                        <p style="font-size:15px;line-height:26px;color:#334155;margin:6px 0;">✅ Download in DOCX, PDF, or TXT — no watermarks</p>
                      </div>
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 28px 0;">
                        All of that for <strong>£2.99/month</strong>. Less than a coffee, and it could land you a job worth tens of thousands more.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:4px 0 28px 0;">
                            <a href="https://www.mycvbuddy.com/subscription" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">
                              See Pro Plans →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:0 0 28px 0;">
                        <p style="font-size:14px;line-height:22px;color:#6b7280;margin:0 0 8px 0;font-style:italic;">
                          "I applied to 12 jobs in one week using My CV Buddy. Each CV was perfectly tailored. Got 4 interviews. Landed the one I actually wanted." — Sarah M., Marketing Manager
                        </p>
                      </div>
                      <p style="font-size:15px;line-height:24px;color:#6b7280;margin:0;">
                        Questions? Just reply to this email — we read every one.<br><br>
                        Jake @ My CV Buddy
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;background-color:#f9fafb;">
                      <p style="font-size:13px;color:#9ca3af;margin:4px 0;">My CV Buddy · <a href="https://www.mycvbuddy.com" style="color:#7c3aed;text-decoration:none;">mycvbuddy.com</a></p>
                      <p style="font-size:13px;color:#9ca3af;margin:4px 0;"><a href="https://www.mycvbuddy.com/unsubscribe" style="color:#9ca3af;">Unsubscribe</a></p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Day3 pro nudge email error:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Day3 pro nudge email exception:', error)
    return { success: false, error }
  }
}

/**
 * Day 7 sequence: time-limited discount offer for free users who haven't converted
 */
export async function sendDay7OfferEmail(email: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: '🎁 A little gift for you — exclusive offer inside',
      headers: {
        'List-Unsubscribe': '<https://www.mycvbuddy.com/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f9fc;padding:40px 0;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#f59e0b 0%,#ef4444 100%);padding:36px;text-align:center;">
                      <h1 style="color:#ffffff;font-size:30px;margin:0;font-weight:700;">🎁 This is for you, ${name || 'friend'}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 20px 0;">Hi ${name || 'there'},</p>
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 24px 0;">
                        You joined My CV Buddy a week ago. We want to make sure you actually land the job you're going for — so we're making it easier to go Pro.
                      </p>
                      <p style="font-size:16px;line-height:26px;color:#333;margin:0 0 20px 0;">
                        With Pro you get everything you need for a serious job search — unlimited tailored CVs, cover letters, interview prep, AI review, and premium templates. All for just <strong>£2.99/month</strong>.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:4px 0 28px 0;">
                            <a href="https://www.mycvbuddy.com/subscription" style="display:inline-block;padding:18px 40px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:800;font-size:18px;">
                              Upgrade to Pro — £2.99/month →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <div style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:0 0 28px 0;">
                        <p style="font-size:14px;line-height:22px;color:#166534;margin:0;">
                          💚 <strong>Risk-free:</strong> If Pro doesn't help you land more interviews in your first month, reply to this email and we'll extend your trial — no questions asked.
                        </p>
                      </div>
                      <p style="font-size:15px;line-height:24px;color:#6b7280;margin:0;">
                        Rooting for you,<br><br>
                        Jake @ My CV Buddy
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;background-color:#f9fafb;">
                      <p style="font-size:13px;color:#9ca3af;margin:4px 0;">My CV Buddy · <a href="https://www.mycvbuddy.com" style="color:#7c3aed;text-decoration:none;">mycvbuddy.com</a></p>
                      <p style="font-size:13px;color:#9ca3af;margin:4px 0;"><a href="https://www.mycvbuddy.com/unsubscribe" style="color:#9ca3af;">Unsubscribe</a></p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Day7 offer email error:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Day7 offer email exception:', error)
    return { success: false, error }
  }
}

/**
 * Test email sending (for development)
 */
export async function sendTestEmail(email: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Test Email from CV Buddy',
      html: '<h1>Test Email</h1><p>If you received this, email sending is working!</p>',
    })

    if (error) {
      console.error('Test email error:', error)
      return { success: false, error }
    }

    console.log('Test email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Test email exception:', error)
    return { success: false, error }
  }
}
