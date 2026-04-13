# Contact Form Setup Guide

## Overview
Contact form has been added to My CV Buddy with email functionality that sends messages to `jakedalerourke@gmail.com` without exposing the email address publicly.

---

## What's Been Added

### 1. Contact Page (`/contact`)
- **Location**: Accessible from homepage footer and dashboard header
- **Features**:
  - Professional contact form with name, email, subject, message
  - Subject dropdown (General Inquiry, Technical Support, Billing, Feature Request, Bug Report, Partnership, Other)
  - Success/error states with visual feedback
  - Responsive design
  - Loading states during submission

### 2. Dashboard Integration
- **"Contact Support" link** added to dashboard header (green icon)
- Located between "Subscription" and "Logout"
- Easy access for logged-in users

### 3. Homepage Integration
- **"Contact Us" link** added to footer under "Company" section
- Moved to top of the list for visibility

### 4. API Endpoint (`/api/contact`)
- Handles form submissions
- Validates email format and required fields
- Sends formatted emails via Resend API
- Includes reply-to functionality (replies go directly to the user)

---

## Email Setup (REQUIRED)

### Step 1: Get Resend API Key

1. **Sign up for Resend** (free tier includes 100 emails/day):
   - Go to https://resend.com
   - Sign up with your email
   - Verify your email address

2. **Get your API key**:
   - Go to https://resend.com/api-keys
   - Click "Create API Key"
   - Name it "My CV Buddy Contact Form"
   - Copy the API key (starts with `re_...`)

3. **Add domain (optional but recommended)**:
   - Go to https://resend.com/domains
   - Add `mycvbuddy.com`
   - Follow DNS setup instructions
   - This allows sending from `noreply@mycvbuddy.com`

### Step 2: Add API Key to Environment Variables

Add this to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_api_key_here
```

### Step 3: Deploy to Vercel

Add the environment variable to Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
   - **Environments**: Production, Preview, Development

---

## How It Works

### User Flow:
1. User fills out contact form at `/contact`
2. Form validates all fields
3. Submits to `/api/contact` endpoint
4. API sends email via Resend
5. Email arrives at `jakedalerourke@gmail.com`
6. User sees success message

### Email Format:
```
From: My CV Buddy <noreply@mycvbuddy.com>
To: jakedalerourke@gmail.com
Reply-To: user@example.com
Subject: [Contact Form] Technical Support

New Contact Form Submission

From: John Smith
Email: john@example.com
Subject: Technical Support

Message:
I'm having trouble uploading my CV...

[Reply to this email to respond directly to John Smith at john@example.com]
```

### Reply Functionality:
- When you reply to a contact form email, it goes directly to the user
- No need to copy/paste their email address
- Seamless communication

---

## Development Mode

If `RESEND_API_KEY` is not set:
- Form still works
- Messages are logged to console instead of sent
- Shows success message to user
- Useful for testing without email setup

---

## Testing

### Test the Contact Form:

1. **Local Testing**:
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000/contact
   - Fill out the form
   - Check console for logged message (if no API key)
   - Check email (if API key is set)

2. **Production Testing**:
   - Go to https://www.mycvbuddy.com/contact
   - Submit a test message
   - Check `jakedalerourke@gmail.com` for the email

### Test Cases:
- ✅ All fields filled correctly → Success
- ✅ Missing required field → Error
- ✅ Invalid email format → Error
- ✅ Long message (500+ words) → Success
- ✅ Special characters in message → Success

---

## Customization Options

### Change Recipient Email:
Edit `/src/app/api/contact/route.ts`:
```typescript
const CONTACT_EMAIL = 'newemail@example.com'
```

### Change Email Template:
Edit the HTML in `/src/app/api/contact/route.ts`:
```typescript
html: `
  <div>
    <!-- Your custom HTML here -->
  </div>
`
```

### Add More Subject Options:
Edit `/src/app/contact/page.tsx`:
```tsx
<option value="New Subject">New Subject</option>
```

### Change Form Fields:
Edit `/src/app/contact/page.tsx` to add/remove fields

---

## Cost Analysis

### Resend Pricing:
- **Free Tier**: 100 emails/day, 3,000/month
- **Pro Tier**: $20/month for 50,000 emails/month

### Expected Usage:
- **5 signups/day** = ~150 signups/month
- **Assume 10% contact rate** = 15 contact forms/month
- **Well within free tier** (3,000/month)

### When to Upgrade:
- If you get 100+ contact forms per day
- If you add email notifications for other features
- If you want dedicated IP address

---

## Alternative Email Services

If you prefer not to use Resend, you can easily switch to:

### SendGrid:
```typescript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: CONTACT_EMAIL }] }],
    from: { email: 'noreply@mycvbuddy.com' },
    subject: `[Contact Form] ${subject}`,
    content: [{ type: 'text/html', value: htmlContent }]
  })
})
```

### Mailgun:
```typescript
const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
  },
  body: new URLSearchParams({
    from: 'noreply@mycvbuddy.com',
    to: CONTACT_EMAIL,
    subject: `[Contact Form] ${subject}`,
    html: htmlContent
  })
})
```

---

## Security Features

### Built-in Protection:
- ✅ Email validation (regex check)
- ✅ Required field validation
- ✅ Rate limiting (via Resend)
- ✅ No email address exposed in frontend
- ✅ CORS protection
- ✅ Input sanitization

### Recommended Additions:
- Add CAPTCHA (Google reCAPTCHA or hCaptcha) to prevent spam
- Add rate limiting on API route (max 5 submissions per IP per hour)
- Add honeypot field to catch bots

---

## Troubleshooting

### "Failed to send message" Error:
1. Check `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for error logs
3. Verify domain is verified (if using custom domain)
4. Check console logs for detailed error

### Email Not Arriving:
1. Check spam folder
2. Verify recipient email is correct
3. Check Resend dashboard for delivery status
4. Verify API key has send permissions

### Form Not Submitting:
1. Check browser console for errors
2. Verify API route is accessible
3. Check network tab for failed requests
4. Ensure all required fields are filled

---

## Files Modified/Created

### New Files:
- `/src/app/contact/page.tsx` - Contact form page
- `/src/app/api/contact/route.ts` - API endpoint for form submission
- `CONTACT-FORM-SETUP.md` - This setup guide

### Modified Files:
- `/src/app/homepage.tsx` - Added contact link to footer
- `/src/app/dashboard/page.tsx` - Added "Contact Support" link to header
- `package.json` - Added `resend` dependency

---

## Next Steps

1. ✅ Contact form created
2. ✅ Dashboard integration added
3. ✅ Homepage link added
4. ⏳ **Get Resend API key** (5 minutes)
5. ⏳ **Add to .env.local** (1 minute)
6. ⏳ **Add to Vercel** (2 minutes)
7. ⏳ **Test the form** (2 minutes)
8. ⏳ **Deploy to production** (automatic)

**Total setup time: ~10 minutes**

---

## Support

If you have issues with the contact form setup, you can:
1. Check Resend documentation: https://resend.com/docs
2. Review the API logs in Resend dashboard
3. Check browser console for frontend errors
4. Review server logs in Vercel dashboard

The contact form is production-ready and will work as soon as you add the Resend API key!
