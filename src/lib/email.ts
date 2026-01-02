import { Resend } from 'resend'
import WelcomeEmail from '@/emails/WelcomeEmail'
import FirstGenerationEmail from '@/emails/FirstGenerationEmail'
import LimitReachedEmail from '@/emails/LimitReachedEmail'
import ReEngagementEmail from '@/emails/ReEngagementEmail'
import PromoEmail from '@/emails/PromoEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Buddy <noreply@mycvbuddy.com>'

/**
 * Send welcome email to new users
 */
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
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
      subject: 'Great job on your first CV! 🚀',
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
      subject: 'You\'ve used your free generation - Upgrade to Pro for £2.99/month! 🚀',
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
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'We miss you! Come back and use your free CV generation 👋',
      react: ReEngagementEmail({ name, daysAgo, remainingGenerations }),
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
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to CV Buddy Pro! 🎉',
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
 * Send promotional email (4 days left offer)
 * Using HTML for reliability
 */
export async function sendPromoEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '⏰ Only 4 Days Left - 50% Off CV Buddy Pro!',
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
              <h1 style="color: #ffffff; font-size: 32px; margin: 0;">⏰ Only 4 Days Left!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">Hi ${name},</p>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 16px;">
                This is your <strong>final reminder</strong> – our launch promotion ends in just <strong style="color: #dc2626;">4 days</strong>!
              </p>
              
              <!-- Promo Box -->
              <div style="background-color: #fef3c7; border: 3px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <div style="font-size: 28px; font-weight: bold; color: #92400e; margin-bottom: 8px; letter-spacing: 1px;">
                  🎉 LAUNCH50MONTHLY
                </div>
                <div style="font-size: 16px; color: #78350f; margin-bottom: 16px;">
                  50% OFF Your First Month
                </div>
                <div style="font-size: 18px; color: #9ca3af; text-decoration: line-through; margin-bottom: 8px;">
                  £9.99/month
                </div>
                <div style="font-size: 32px; font-weight: bold; color: #dc2626;">
                  £4.99/month
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 16px;">
                <strong>What you get with Pro:</strong>
              </p>
              
              <div style="margin: 16px 0 24px 0;">
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Unlimited CV Generations</strong></p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Unlimited Cover Letters</strong></p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Interview Preparation</strong> with AI</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>All Export Formats</strong> (PDF, DOCX, HTML, TXT)</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>50+ Languages</strong> supported</p>
                <p style="font-size: 16px; line-height: 28px; color: #374151; margin: 8px 0;">✅ <strong>Priority Support</strong></p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.mycvbuddy.com" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Upgrade to Pro Now - Save 50%
                </a>
              </div>
              
              <!-- Urgency Box -->
              <div style="background-color: #fee2e2; color: #dc2626; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
                ⚠️ <strong>This offer expires in 4 days.</strong> After that, the price returns to £9.99/month.
              </div>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 16px;">
                Don't miss out on this limited-time opportunity to supercharge your job search!
              </p>
              
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 8px;">
                Best regards,
              </p>
              <p style="font-size: 16px; line-height: 26px; color: #4b5563; margin-bottom: 16px;">
                The CV Buddy Team
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 24px; border-top: 1px solid #e5e7eb; text-align: center; background-color: #f9fafb;">
              <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">
                CV Buddy - AI-Powered CV & Cover Letter Generator
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">
                <a href="https://www.mycvbuddy.com" style="color: #7c3aed; text-decoration: underline;">www.mycvbuddy.com</a>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">
                <a href="https://www.mycvbuddy.com/unsubscribe" style="color: #7c3aed; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Promo email error:', error)
      return { success: false, error }
    }

    console.log('Promo email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Promo email exception:', error)
    return { success: false, error }
  }
}

/**
 * Test email sending (for development)
 */
export async function sendTestEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
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
