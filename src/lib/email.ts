import { Resend } from 'resend'
import WelcomeEmail from '@/emails/WelcomeEmail'
import FirstGenerationEmail from '@/emails/FirstGenerationEmail'
import LimitReachedEmail from '@/emails/LimitReachedEmail'
import ReEngagementEmail from '@/emails/ReEngagementEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Buddy <noreply@mycvbuddy.com>'

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to CV Buddy - Your AI-Powered CV Assistant 🎉',
      react: WelcomeEmail({ name, email }),
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
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Great job on your first CV! 🚀',
      react: FirstGenerationEmail({ name }),
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
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You\'ve used your free generations - Upgrade to Pro! 🎯',
      react: LimitReachedEmail({ name }),
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
