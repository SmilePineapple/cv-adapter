# Namecheap DNS Setup for Resend Inbound Emails

## 🎯 Quick Fix: Remove Conflicting MX Record

You have a conflicting MX record pointing to AWS SES that's preventing Resend from receiving emails.

## Step-by-Step Instructions

### 1. Log in to Namecheap

Go to: https://www.namecheap.com/myaccount/login/

### 2. Access Domain Management

1. Click **"Domain List"** in the left sidebar
2. Find **mycvbuddy.com**
3. Click **"Manage"** button

### 3. Go to Advanced DNS

Click the **"Advanced DNS"** tab at the top

### 4. Remove AWS SES MX Record

**Find this record and DELETE it:**
```
Type: MX Record
Host: @
Value: inbound-smtp.eu-west-1.amazonaws.com
Priority: 10
```

**How to delete:**
- Look for the MX record in the list
- Click the **trash can icon** (🗑️) on the right side
- Confirm deletion

### 5. Add Resend MX Records

**Check your Resend dashboard first** for the exact MX records they want you to add.

They should be listed in: **Resend Dashboard → Domains → mycvbuddy.com → Inbound → MX Records**

**Typical Resend MX records (verify in your dashboard):**

**Record 1:**
- Type: `MX Record`
- Host: `@` (or blank)
- Value: `mx1.resend.com` (or what Resend shows)
- Priority: `10`
- TTL: `Automatic`

**Record 2:**
- Type: `MX Record`
- Host: `@` (or blank)
- Value: `mx2.resend.com` (or what Resend shows)
- Priority: `20`
- TTL: `Automatic`

**How to add:**
1. Click **"Add New Record"** button
2. Select **"MX Record"** from dropdown
3. Fill in the fields as shown above
4. Click **"Save Changes"** (green checkmark)
5. Repeat for second MX record

### 6. Save and Wait

1. Click **"Save All Changes"** at the top
2. Wait **10-15 minutes** for DNS propagation

## What Your DNS Should Look Like After

```
Type        Host    Value                           Priority    TTL
------------------------------------------------------------------------
A Record    @       [Your Vercel IP]               -           Automatic
A Record    www     [Your Vercel IP]               -           Automatic
CNAME       *       cname.vercel-dns.com           -           Automatic
MX Record   @       mx1.resend.com                 10          Automatic
MX Record   @       mx2.resend.com                 20          Automatic
TXT Record  @       v=spf1 include:_spf.resend...  -           Automatic
```

**Important:** Keep all your existing A, CNAME, and TXT records. Only change MX records.

## Verify It's Working

### Method 1: Check DNS (After 10 minutes)

Go to: https://mxtoolbox.com/

Enter: `mycvbuddy.com`

Should show:
```
MX Priority: 10, MX: mx1.resend.com
MX Priority: 20, MX: mx2.resend.com
```

### Method 2: Check Resend Dashboard

1. Go back to Resend dashboard
2. Navigate to: Domains → mycvbuddy.com → Inbound
3. Should show green checkmarks for MX records
4. Status should change from "Conflicting" to "Verified"

### Method 3: Send Test Email

1. Send email from any account to: `support@mycvbuddy.com`
2. Subject: "Test Inbound Email"
3. Wait 30 seconds
4. Check `jakedalerourke@gmail.com` inbox
5. Should receive forwarded email with "[Forwarded]" in subject

## Troubleshooting

### DNS Not Updating

**Wait longer:** DNS can take up to 24 hours (usually 10-30 minutes)

**Clear DNS cache:**
```bash
ipconfig /flushdns
```

**Check with different tool:** https://dnschecker.org/

### Still Showing Conflicting

**Double-check you deleted the AWS MX record**
- Go back to Namecheap Advanced DNS
- Make sure NO MX record points to `inbound-smtp.eu-west-1.amazonaws.com`

**Verify new MX records are correct**
- Match exactly what Resend dashboard shows
- Priority should be 10 and 20
- Host should be `@` or blank

### Emails Not Arriving

**Check Resend dashboard:**
- Go to: Emails → Received
- Should see incoming emails listed

**Check Vercel logs:**
- Go to: https://vercel.com/dashboard
- Select your project
- Click "Logs" tab
- Filter by: `/api/webhooks/resend-inbound`
- Should see webhook calls

**Verify webhook secret:**
- Go to Vercel → Settings → Environment Variables
- Check `RESEND_WEBHOOK_SECRET` is set to: `whsec_+ZQSlFn4UCLhGQgZPAGAheR27S8mxbBL`

## After Setup Works

Once emails are flowing:

✅ **Use for Trustpilot:** Enter `support@mycvbuddy.com` for verification
✅ **Customer support:** All emails forward to your Gmail
✅ **Reply directly:** Reply-to is set to original sender
✅ **Attachments included:** All files are forwarded

## Quick Reference

**What to delete:**
- ❌ MX record → `inbound-smtp.eu-west-1.amazonaws.com`

**What to add:**
- ✅ MX record → `mx1.resend.com` (Priority 10)
- ✅ MX record → `mx2.resend.com` (Priority 20)

**Where:** Namecheap → Domain List → Manage → Advanced DNS

**Wait time:** 10-15 minutes

**Test:** Send email to `support@mycvbuddy.com`

---

**Current Status:** Waiting for you to update MX records in Namecheap
**Time Required:** 5 minutes to update + 10 minutes DNS propagation
**Priority:** HIGH - Needed for Trustpilot verification
