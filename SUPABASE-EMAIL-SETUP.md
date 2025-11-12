# Supabase Email Configuration for Welcome Emails

## Option B: Use Supabase Built-in Email System

### Step 1: Configure SMTP in Supabase

1. **Go to Supabase Dashboard**
   - Project: https://supabase.com/dashboard/project/vuslzrevbkuugqeiadnq

2. **Navigate to Authentication → Email Templates**

3. **Configure SMTP Settings**
   - Click "Settings" → "SMTP Settings"
   - You have two options:

#### Option B1: Use Supabase Default SMTP (Easiest)
- Just leave SMTP settings as default
- Supabase will send emails from their servers
- **Limitation:** 4 emails per hour on free tier
- **From address:** Will be `noreply@mail.app.supabase.io`

#### Option B2: Use Custom SMTP with Resend (Recommended)
Since you already have Resend set up, use it for Supabase emails too:

**SMTP Settings:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your RESEND_API_KEY]
Sender Email: noreply@mycvbuddy.com
Sender Name: CV Buddy
```

### Step 2: Enable Email Confirmation (Optional)

**If you want users to verify their email:**
1. Go to **Authentication → Providers → Email**
2. Toggle ON: "Enable email confirmations"
3. Users will need to click a link in their email before they can log in

**If you want instant access (current setup):**
1. Keep "Enable email confirmations" OFF
2. Users can log in immediately after signup
3. More user-friendly, less secure

### Step 3: Customize Welcome Email Template

1. Go to **Authentication → Email Templates**
2. Click "Confirm signup" template
3. Customize the email content:

```html
<h2>Welcome to CV Buddy!</h2>
<p>Hi {{ .Name }},</p>
<p>Thanks for signing up! We're excited to help you create the perfect CV.</p>
<p>Click the link below to confirm your email and get started:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Best regards,<br>The CV Buddy Team</p>
```

### Step 4: Test Email Sending

1. Sign up with a test email
2. Check inbox (and spam folder)
3. Verify email arrives
4. Click confirmation link (if email confirmation is enabled)

---

## Current Setup (What We Changed)

### Application-Level Email (What we just implemented)
- ✅ Welcome email sent from Next.js app
- ✅ Uses Resend API directly
- ✅ More control over email content
- ✅ No dependency on Supabase email limits
- ✅ Already working!

### Supabase-Level Email (Option B)
- Uses Supabase's email system
- Triggered automatically on signup
- Less code in your application
- Subject to Supabase email limits

---

## Recommendation

**Keep the current application-level setup!** Here's why:

### Advantages of Current Setup:
1. ✅ **No Supabase email limits** - Resend has much higher limits
2. ✅ **Better email templates** - You control the React email templates
3. ✅ **More reliable** - Direct API call to Resend
4. ✅ **Already working** - No additional configuration needed
5. ✅ **Better analytics** - Track emails in Resend dashboard
6. ✅ **Professional emails** - From your domain (mycvbuddy.com)

### When to Use Supabase Email:
- If you need email confirmation for security
- If you want password reset emails
- If you want magic link authentication

---

## For Password Reset & Magic Links

You'll still need Supabase email configured for:
- Password reset emails
- Magic link login
- Email change confirmations

**Configure Resend SMTP in Supabase** (recommended):
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: [Your RESEND_API_KEY]
From: noreply@mycvbuddy.com
```

This ensures all Supabase system emails use your Resend account.

---

## Next Steps

1. ✅ Keep current welcome email setup (application-level)
2. ✅ Configure Resend SMTP in Supabase for system emails
3. ✅ Test password reset flow
4. ✅ Deploy to Vercel
