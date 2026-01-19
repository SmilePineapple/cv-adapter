import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Resend, type ListAttachmentsResponseSuccess } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Webhook endpoint for Resend inbound emails
 * Forwards emails received at support@mycvbuddy.com to jakedalerourke@gmail.com
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw request text to verify the webhook
    const payload = await req.text()
    const id = req.headers.get('svix-id')
    const timestamp = req.headers.get('svix-timestamp')
    const signature = req.headers.get('svix-signature')

    if (!id || !timestamp || !signature) {
      return new NextResponse('Missing headers', { status: 400 })
    }

    // Verify the webhook is from Resend
    const result = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    })

    // Only process email.received events
    if (result.type !== 'email.received') {
      return NextResponse.json({ message: 'Invalid event' }, { status: 200 })
    }

    console.log('[Resend Inbound] Received email:', {
      emailId: result.data.email_id,
      from: result.data.from,
      to: result.data.to,
      subject: result.data.subject
    })

    // Get the incoming email's content
    const { data: email, error: emailError } = await resend.emails.receiving.get(
      result.data.email_id
    )

    if (emailError) {
      throw new Error(`Failed to fetch email: ${emailError.message}`)
    }

    // Download and encode any attachments
    const { data: attachmentsData, error: attachmentsError } = 
      await resend.emails.receiving.attachments.list({
        emailId: result.data.email_id,
      })

    if (attachmentsError) {
      throw new Error(`Failed to fetch attachments: ${attachmentsError.message}`)
    }

    const attachments = attachmentsData?.data as ListAttachmentsResponseSuccess['data'] & {
      content: string
    }[]

    if (attachments && attachments.length > 0) {
      // Download the attachments and encode them in base64
      for (const attachment of attachments) {
        const response = await fetch(attachment.download_url)
        const buffer = Buffer.from(await response.arrayBuffer())
        attachment.content = buffer.toString('base64')
      }
    }

    // Forward the email to Jake's personal email
    const { data, error: sendError } = await resend.emails.send({
      from: 'CV Buddy Support <support@mycvbuddy.com>',
      to: ['jakedalerourke@gmail.com'],
      subject: `[Forwarded] ${result.data.subject}`,
      html: `
        <div style="border-left: 4px solid #3b82f6; padding-left: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            <strong>From:</strong> ${result.data.from}<br>
            <strong>To:</strong> ${result.data.to.join(', ')}<br>
            <strong>Date:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
        ${email.html || `<pre>${email.text}</pre>`}
      `,
      text: `
From: ${result.data.from}
To: ${result.data.to.join(', ')}
Date: ${new Date().toLocaleString()}

---

${email.text}
      `,
      attachments,
      // Set reply-to so when Jake replies, it goes back to the original sender
      replyTo: result.data.from,
    })

    if (sendError) {
      throw new Error(`Failed to forward email: ${sendError.message}`)
    }

    console.log('[Resend Inbound] Email forwarded successfully:', data?.id)

    return NextResponse.json({ 
      message: 'Email forwarded successfully', 
      data 
    })

  } catch (error) {
    console.error('[Resend Inbound] Error:', error)
    return new NextResponse(`Error: ${error}`, { status: 500 })
  }
}
