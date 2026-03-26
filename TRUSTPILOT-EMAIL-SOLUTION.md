# Trustpilot Email Verification Solution

## The Problem

Trustpilot is asking for an email at `support@mycvbuddy.com` to verify domain ownership, but emails sent to that address aren't being forwarded to `jakedalerourke@gmail.com`.

## Why It's Not Working

**Resend requires inbound email setup to be configured in their dashboard first.** The webhook exists in your code (`/api/webhooks/resend-inbound`), but Resend needs to be configured to:

1. Accept inbound emails at `support@mycvbuddy.com`
2. Send webhooks to your endpoint when emails arrive

## Solution: Use Alternative Email for Trustpilot

**Recommended approach:** Use `jakedalerourke@gmail.com` directly for Trustpilot verification.

### Why This Works Better

1. **Immediate:** No Resend configuration needed
2. **Reliable:** Gmail receives emails instantly
3. **Simple:** Trustpilot just needs to verify you own the domain

### Steps to Complete Trustpilot Verification

1. **Use your personal email:**
   - When Trustpilot asks for email: Enter `jakedalerourke@gmail.com`
   - This is fine - Trustpilot allows this for verification

2. **Alternative DNS verification:**
   - If Trustpilot insists on domain email, use DNS TXT record verification instead
   - Trustpilot will provide a TXT record to add to your domain
   - Add it in your domain registrar (where mycvbuddy.com is registered)

3. **If you must use support@mycvbuddy.com:**
   - Go to Resend dashboard: https://resend.com/domains
   - Click on `mycvbuddy.com`
   - Go to "Inbound" tab
   - Click "Enable inbound emails"
   - Add webhook URL: `https://www.mycvbuddy.com/api/webhooks/resend-inbound`
   - Add webhook secret to your environment variables
   - Wait 5-10 minutes for DNS propagation
   - Then Trustpilot can send verification email

## Quick Fix: Use Gmail Alias

**Easiest solution right now:**

1. In Trustpilot, enter: `jakedalerourke+mycvbuddy@gmail.com`
2. Gmail will deliver to `jakedalerourke@gmail.com` automatically
3. Complete verification
4. Later, you can change the email in Trustpilot settings

## Setting Up Resend Inbound (For Future)

If you want `support@mycvbuddy.com` to work properly:

### 1. Enable Inbound in Resend Dashboard

```
1. Go to: https://resend.com/domains
2. Select: mycvbuddy.com
3. Click: "Inbound" tab
4. Click: "Enable inbound emails"
5. Add MX records to your domain (Resend will show you which ones)
```

### 2. Configure Webhook

```
Webhook URL: https://www.mycvbuddy.com/api/webhooks/resend-inbound
Events: email.received
```

### 3. Add Webhook Secret to Environment

```bash
# In Vercel dashboard or .env.local
RESEND_WEBHOOK_SECRET=your_webhook_secret_from_resend
```

### 4. Test It

```bash
# Send test email to support@mycvbuddy.com
# Check if it arrives at jakedalerourke@gmail.com
```

## Current Status

- ✅ Webhook code exists and is correct
- ❌ Resend inbound not configured in dashboard
- ❌ MX records not set up for inbound
- ✅ Outbound emails work fine (welcome emails, etc.)

## Recommendation

**For Trustpilot verification NOW:**
- Use `jakedalerourke@gmail.com` or `jakedalerourke+mycvbuddy@gmail.com`
- Complete verification in 2 minutes

**For long-term:**
- Set up Resend inbound properly (30 minutes)
- Then `support@mycvbuddy.com` will work for everything

---

**Bottom line:** Don't let email setup block your Trustpilot verification. Use your Gmail directly, get verified, collect reviews, and set up inbound emails later.
