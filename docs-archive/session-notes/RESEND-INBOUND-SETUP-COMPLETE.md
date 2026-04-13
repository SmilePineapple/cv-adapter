# Resend Inbound Email Setup - Complete Guide

## Current Status

✅ **Webhook Created:** https://www.mycvbuddy.com/api/webhooks/resend-inbound
✅ **Webhook Secret:** `whsec_+ZQSlFn4UCLhGQgZPAGAheR27S8mxbBL`
✅ **Listening for:** `email.received`
⚠️ **MX Records:** Conflicting with AWS SES

## The Problem

Resend detected conflicting MX records pointing to AWS SES (Simple Email Service):
- Current MX: `inbound-smtp.eu-west-1.amazonaws.com`
- Priority: 10

This prevents Resend from receiving emails because emails are being routed to AWS instead of Resend.

## Solution: Update MX Records in Namecheap

### Step 1: Remove AWS SES MX Record

1. **Log in to Namecheap:**
   - Go to: https://www.namecheap.com/
   - Sign in to your account

2. **Go to Domain List:**
   - Click "Domain List" in left sidebar
   - Find `mycvbuddy.com`
   - Click "Manage"

3. **Go to Advanced DNS:**
   - Click "Advanced DNS" tab

4. **Find and Delete AWS MX Record:**
   - Look for MX record with value: `inbound-smtp.eu-west-1.amazonaws.com`
   - Click the trash/delete icon next to it
   - Confirm deletion

### Step 2: Add Resend MX Records

Resend should have provided you with MX records. They typically look like:

**If Resend gave you specific MX records, use those. Otherwise, use these standard Resend MX records:**

1. **Add MX Record 1:**
   - Type: `MX Record`
   - Host: `@` (or leave blank for root domain)
   - Value: `mx1.resend.com`
   - Priority: `10`
   - TTL: `Automatic` or `300`

2. **Add MX Record 2:**
   - Type: `MX Record`
   - Host: `@`
   - Value: `mx2.resend.com`
   - Priority: `20`
   - TTL: `Automatic` or `300`

**Important:** Check your Resend dashboard for the exact MX records they want you to add. They should be listed under the "Inbound" section.

### Step 3: Verify DNS Changes

After adding MX records in Namecheap:

1. **Wait 5-10 minutes** for DNS propagation
2. **Check DNS with online tool:**
   - Go to: https://mxtoolbox.com/
   - Enter: `mycvbuddy.com`
   - Should show Resend MX records

3. **Verify in Resend Dashboard:**
   - Go back to Resend
   - Check if MX records are verified
   - Should show green checkmark

## Step 4: Add Webhook Secret to Vercel

You mentioned you already did this, but let's verify:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project (cv-adapter)

2. **Go to Settings:**
   - Click "Settings" tab
   - Click "Environment Variables"

3. **Add/Verify Variable:**
   - **Key:** `RESEND_WEBHOOK_SECRET`
   - **Value:** `whsec_+ZQSlFn4UCLhGQgZPAGAheR27S8mxbBL`
   - **Environments:** Production, Preview, Development (check all)

4. **Redeploy (if needed):**
   - If you just added the variable, redeploy
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## Step 5: Test Inbound Email

Once MX records are updated and webhook secret is set:

1. **Send test email to:** `support@mycvbuddy.com`
2. **Check if it arrives at:** `jakedalerourke@gmail.com`
3. **Check Vercel logs:**
   - Go to Vercel dashboard
   - Click "Logs" tab
   - Look for webhook calls to `/api/webhooks/resend-inbound`

## Namecheap DNS Configuration Example

Your Namecheap Advanced DNS should look like this after changes:

```
Type        Host    Value                   Priority    TTL
-------------------------------------------------------------
A Record    @       76.76.21.21            -           Automatic
A Record    www     76.76.21.21            -           Automatic
CNAME       *       mycvbuddy.com          -           Automatic
MX Record   @       mx1.resend.com         10          Automatic
MX Record   @       mx2.resend.com         20          Automatic
TXT Record  @       v=spf1 include:...     -           Automatic
```

**Remove:**
- ❌ MX Record pointing to `inbound-smtp.eu-west-1.amazonaws.com`

**Keep:**
- ✅ All A records (for website)
- ✅ All CNAME records (for www, etc.)
- ✅ SPF/DKIM TXT records (for sending emails)

## Troubleshooting

### MX Records Not Updating

**Problem:** DNS changes not propagating
**Solution:**
- Wait 15-30 minutes
- Clear DNS cache: `ipconfig /flushdns` (Windows)
- Check with different DNS checker: https://dnschecker.org/

### Emails Still Not Arriving

**Problem:** Emails sent to support@mycvbuddy.com not forwarding
**Solution:**
1. Check Resend dashboard for incoming emails
2. Check Vercel logs for webhook calls
3. Verify webhook secret is correct
4. Test webhook manually with Resend test tool

### Webhook Not Triggering

**Problem:** Webhook not being called
**Solution:**
1. Verify webhook URL is correct: `https://www.mycvbuddy.com/api/webhooks/resend-inbound`
2. Check webhook is listening for `email.received`
3. Check Vercel logs for errors
4. Verify webhook secret in environment variables

### 500 Error in Webhook

**Problem:** Webhook returns 500 error
**Solution:**
1. Check Vercel logs for error details
2. Verify `RESEND_API_KEY` is set
3. Verify `RESEND_WEBHOOK_SECRET` is set
4. Check webhook code for errors

## Expected Behavior

Once everything is set up correctly:

1. **Email sent to:** `support@mycvbuddy.com`
2. **Resend receives it** (via MX records)
3. **Resend triggers webhook** to your endpoint
4. **Your webhook forwards it** to `jakedalerourke@gmail.com`
5. **You receive email** with "[Forwarded]" in subject

## Testing Commands

### Check MX Records
```bash
nslookup -type=mx mycvbuddy.com
```

Should show:
```
mycvbuddy.com   MX preference = 10, mail exchanger = mx1.resend.com
mycvbuddy.com   MX preference = 20, mail exchanger = mx2.resend.com
```

### Test Email Sending
Send test email from any email client to `support@mycvbuddy.com` with subject "Test Inbound"

### Check Vercel Logs
```bash
# In Vercel dashboard
Logs > Filter by "/api/webhooks/resend-inbound"
```

## Environment Variables Checklist

Verify these are set in Vercel:

- ✅ `RESEND_API_KEY` - Your Resend API key
- ✅ `RESEND_WEBHOOK_SECRET` - `whsec_+ZQSlFn4UCLhGQgZPAGAheR27S8mxbBL`
- ✅ `RESEND_FROM_EMAIL` - `CV Buddy <support@mycvbuddy.com>`

## What Happens After Setup

Once inbound emails work:

1. **Trustpilot verification emails** will arrive at your Gmail
2. **Customer support emails** will be forwarded automatically
3. **You can reply directly** from Gmail (reply-to is set to original sender)
4. **All attachments** are forwarded
5. **Email history** is preserved

## Summary

**What you need to do:**

1. ✅ Go to Namecheap Advanced DNS
2. ✅ Delete AWS SES MX record
3. ✅ Add Resend MX records (check Resend dashboard for exact values)
4. ✅ Wait 10 minutes for DNS propagation
5. ✅ Send test email to support@mycvbuddy.com
6. ✅ Check if it arrives at jakedalerourke@gmail.com

**Then you can:**
- Use `support@mycvbuddy.com` for Trustpilot verification
- Receive customer support emails
- Reply directly from Gmail

---

**Status:** Waiting for MX records to be updated in Namecheap
**Priority:** HIGH - Needed for Trustpilot verification
**Time Required:** 10 minutes setup + 10 minutes DNS propagation
**Expected Result:** Emails to support@mycvbuddy.com forward to Gmail
