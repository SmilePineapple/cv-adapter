import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Buddy <noreply@mycvbuddy.com>'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'No authorization' }, { status: 401 })
    }

    const { to, subject, message, html } = await request.json()

    if (!to || !subject || (!message && !html)) {
      return NextResponse.json({ 
        error: 'Missing required fields: to, subject, and message/html' 
      }, { status: 400 })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      html: html || `
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
                        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">CV Buddy</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <div style="font-size: 16px; line-height: 26px; color: #333333; white-space: pre-wrap;">${message}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 40px 40px;">
                        <div style="font-size: 14px; line-height: 22px; color: #666666; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                          Best regards,<br>
                          The CV Buddy Team<br>
                          <a href="https://www.mycvbuddy.com" style="color: #4F46E5; text-decoration: none;">www.mycvbuddy.com</a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json({ 
        error: `Failed to send email: ${error.message}` 
      }, { status: 500 })
    }

    console.log('Admin email sent:', { to, subject, emailId: data?.id })

    return NextResponse.json({ 
      success: true,
      emailId: data?.id,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('Admin send email error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
