# Resend Inbound Email Setup Guide

## Overview
This guide explains how to set up inbound email forwarding for `support@mycvbuddy.com` to forward all replies to `jakedalerourke@gmail.com`.

---

## ✅ What's Been Done (Code Changes)

### 1. Created Webhook Endpoint
- **File:** `src/app/api/webhooks/resend-inbound/route.ts`
- **Purpose:** Receives inbound emails from Resend and forwards them to Jake's Gmail
- **Features:**
  - Verifies webhook signature for security
  - Downloads and forwards email attachments
  - Sets `replyTo` header so Jake's replies go back to original sender
  - Adds forwarding metadata to email

### 2. Updated Email Configuration
- **File:** `src/lib/email.ts`
- **Changes:**
  - Changed `FROM_EMAIL` from `noreply@mycvbuddy.com` to `support@mycvbuddy.com`
  - Added `REPLY_TO` constant: `support@mycvbuddy.com`
  - Added `replyTo` parameter to all 8 email sending functions

### 3. Activated Social Media Cron Job
- **File:** `vercel.json`
- **Changes:**
  - Added social media cron: `/api/social-bot/cron` (runs hourly)
  - Kept reminder email cron: `/api/cron/send-reminder-emails` (runs daily at 10 AM)

---

## 🔧 Setup Steps (You Need to Do These)

### Step 1: Add DNS Records for Inbound Email

1. Go to **Resend Dashboard** → **Domains** → `mycvbuddy.com`
2. Click **"Enable Inbound"** or **"Inbound Email"**
3. Add the MX records Resend provides to your Namecheap DNS:

**Example MX Records:**
```
Type: MX
Host: @ (or mycvbuddy.com)
Value: inbound-smtp.resend.com
Priority: 10
```

**Note:** Resend will show you the exact records. If you already have MX records for sending, you may need to use a subdomain like `inbound.mycvbuddy.com` instead.

### Step 2: Create Resend Webhook

1. Go to **Resend Dashboard** → **Webhooks**
2. Click **"Add Webhook"**
3. Configure:
   - **URL:** `https://www.mycvbuddy.com/api/webhooks/resend-inbound`
   - **Events:** Select `email.received`
   - **Status:** Active
4. Copy the **Webhook Secret** (starts with `whsec_...`)

### Step 3: Add Environment Variable

Add to your Vercel environment variables:

```
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
```

**How to add:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable: `RESEND_WEBHOOK_SECRET`
3. Paste the webhook secret from Resend
4. Select: Production, Preview, Development
5. Save

### Step 4: Deploy Changes

The code changes are ready to commit. After you deploy:
1. Resend will start forwarding emails to the webhook
2. Webhook will forward to `jakedalerourke@gmail.com`

---

## 📧 How Email Flow Works

### When Someone Emails support@mycvbuddy.com:

1. **Email arrives at Resend** (via MX records)
2. **Resend triggers webhook** → `POST /api/webhooks/resend-inbound`
3. **Webhook processes email:**
   - Verifies it's from Resend (security)
   - Downloads email content + attachments
   - Forwards to `jakedalerourke@gmail.com`
   - Sets `replyTo` to original sender's email
4. **Jake receives email in Gmail** with:
   - Subject: `[Forwarded] Original Subject`
   - From: `support@mycvbuddy.com`
   - Reply-To: `original-sender@example.com`
   - Body: Original email with metadata header

### When Jake Replies:

1. **Jake hits "Reply" in Gmail**
2. **Email goes to:** `original-sender@example.com` (not support@mycvbuddy.com)
3. **Sender receives reply from:** `jakedalerourke@gmail.com`

**Important:** When you reply, it will show your personal Gmail address (`jakedalerourke@gmail.com`), NOT `support@mycvbuddy.com`.

---

## 🤔 Reply Behavior Explained

### Question: "What happens if I reply to the reply, does it show my email account or will it show support@mycvbuddy.com?"

**Answer:** It will show **your Gmail address** (`jakedalerourke@gmail.com`).

**Why:**
- The forwarded email sets `replyTo: original-sender@example.com`
- When you click "Reply" in Gmail, it replies directly to the original sender
- Your Gmail sends the reply, so it comes from `jakedalerourke@gmail.com`

**If you want replies to come from support@mycvbuddy.com:**
You would need to:
1. Set up Gmail to send mail through Resend SMTP
2. Add `support@mycvbuddy.com` as a "Send mail as" address in Gmail
3. Configure SMTP settings with Resend credentials

**But this is unnecessary** - users won't mind seeing replies from your personal email. It's more personal!

---

## 🧪 Testing the Setup

### Test 1: Send Email to support@mycvbuddy.com

1. From any email account, send a test email to `support@mycvbuddy.com`
2. Check `jakedalerourke@gmail.com` inbox
3. You should receive: `[Forwarded] Your Subject`

### Test 2: Reply to Forwarded Email

1. Open the forwarded email in Gmail
2. Click "Reply"
3. Notice the "To" field shows the original sender's email
4. Send the reply
5. Original sender receives reply from `jakedalerourke@gmail.com`

### Test 3: Check Webhook Logs

1. Go to Resend Dashboard → Webhooks
2. Click on your webhook
3. View recent deliveries
4. Should show successful `200` responses

---

## 🔍 Troubleshooting

### Emails Not Being Forwarded

**Check:**
1. MX records are correct in Namecheap DNS
2. Webhook is active in Resend Dashboard
3. `RESEND_WEBHOOK_SECRET` is set in Vercel
4. Check Vercel function logs for errors

### Webhook Failing

**Check:**
1. Webhook secret matches environment variable
2. Endpoint is publicly accessible: `https://www.mycvbuddy.com/api/webhooks/resend-inbound`
3. Check Resend webhook delivery logs for error messages

### Attachments Not Working

**Check:**
1. Resend API key has proper permissions
2. Check function logs for download errors
3. Verify attachment encoding is working

---

## 📊 Current Email Configuration

**All outgoing emails now:**
- **From:** `CV Buddy <support@mycvbuddy.com>`
- **Reply-To:** `support@mycvbuddy.com`
- **Forwards to:** `jakedalerourke@gmail.com`

**Email functions updated:**
1. ✅ `send3DayReminderEmail`
2. ✅ `sendWelcomeEmail`
3. ✅ `sendFirstGenerationEmail`
4. ✅ `sendLimitReachedEmail`
5. ✅ `sendReEngagementEmail`
6. ✅ `sendUpgradeConfirmationEmail`
7. ✅ `sendPromoEmail`
8. ✅ `sendTestEmail`

---

## 💰 Cost

**Resend Inbound Email:** FREE
- Included in all Resend plans
- No additional cost for forwarding
- No limit on inbound emails

---

## 🎯 Next Steps

1. ✅ Deploy code changes (commit + push)
2. ⏳ Add MX records in Namecheap DNS
3. ⏳ Create webhook in Resend Dashboard
4. ⏳ Add `RESEND_WEBHOOK_SECRET` to Vercel
5. ⏳ Test email forwarding
6. ⏳ Verify replies work correctly

---

## 📚 Resources

- [Resend Inbound Email Docs](https://resend.com/docs/dashboard/emails/inbound-emails)
- [Resend Webhooks Docs](https://resend.com/docs/dashboard/webhooks/introduction)
- [Avoiding MX Record Conflicts](https://resend.com/docs/knowledge-base/how-do-i-avoid-conflicting-with-my-mx-records)
