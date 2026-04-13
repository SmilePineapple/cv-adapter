# Complete Signup 500 Error Troubleshooting Guide

## Current Status
- ✅ Database trigger updated with lifetime payment columns
- ✅ Function `handle_new_user()` exists and is correct
- ✅ Trigger is enabled on `auth.users`
- ❌ Still getting 500 error on signup

## The 500 Error is NOT from our database trigger
The trigger is working fine. The error is happening **before** the trigger even runs, which means it's a Supabase Auth configuration issue.

---

## Step-by-Step Debugging

### STEP 1: Check Supabase Auth Logs (CRITICAL)
This will tell us the EXACT error.

1. Go to **Supabase Dashboard**
2. Click **Logs** in left sidebar
3. Click **Auth** tab
4. Keep this tab open
5. In another tab, try to sign up
6. Immediately switch back to Auth logs
7. Look for the error message

**What you're looking for:**
- Red error entries
- Status code 500
- Error message explaining why signup failed

**Share this error message with me - it will tell us exactly what's wrong.**

---

### STEP 2: Check Email Confirmation Settings

**Location:** Authentication → Providers → Email

**Issue:** If "Enable email confirmations" is ON but email isn't configured, signup fails.

**Fix:**
1. Go to Authentication → Providers → Email
2. Find "Enable email confirmations"
3. Turn it **OFF** temporarily
4. Try signing up again

**If this fixes it:** Email confirmation was the issue. You can either:
- Leave it off (users don't need to confirm email)
- Or configure SMTP properly to send confirmation emails

---

### STEP 3: Check for Webhooks

**Location:** Authentication → Hooks

**Issue:** If a webhook is configured to call your app on signup, and it fails, signup fails.

**Fix:**
1. Go to Authentication → Hooks
2. Look for ANY hooks (especially "User Created" or "Sign Up")
3. **Disable ALL hooks** temporarily
4. Try signing up again

**Common webhook issues:**
- Webhook URL points to `localhost` (unreachable from Supabase)
- Webhook URL points to your app but app is down
- Webhook returns an error (like missing Resend API key)

---

### STEP 4: Check SMTP Configuration

**Location:** Project Settings → Auth → SMTP Settings

**Issue:** If custom SMTP is configured but broken, and email confirmation is required, signup fails.

**Fix:**
1. Go to Project Settings → Auth
2. Scroll to SMTP Settings
3. If custom SMTP is configured, test it
4. Or switch to "Use Supabase SMTP" (default)

---

### STEP 5: Run Database Diagnostic

Run `deep-auth-diagnosis.sql` in Supabase SQL Editor.

This will show:
- If any users were created (even partially)
- If profiles/usage_tracking are being created
- If the trigger is working
- What the exact database error is (if any)

**Share the output with me.**

---

### STEP 6: Check for Rate Limiting

**Location:** Authentication → Rate Limits

**Issue:** Too strict rate limits might be blocking signup.

**Fix:**
1. Go to Authentication → Rate Limits
2. Temporarily increase or disable limits
3. Try signing up again

---

## Common Causes & Solutions

### Cause 1: Email Confirmation Required (Most Common)
**Symptom:** 500 error, no user created
**Solution:** Disable email confirmation in Auth settings
**Why:** Email service not configured or failing

### Cause 2: Webhook Failing (Second Most Common)
**Symptom:** 500 error, user might be created but webhook fails
**Solution:** Disable webhooks in Auth → Hooks
**Why:** Webhook URL unreachable or returns error

### Cause 3: SMTP Not Configured
**Symptom:** 500 error when email confirmation is ON
**Solution:** Use Supabase SMTP or configure custom SMTP properly
**Why:** Can't send confirmation email

### Cause 4: Database Trigger Issue
**Symptom:** User created in auth.users but not in profiles/usage_tracking
**Solution:** Already fixed with our SQL scripts
**Status:** ✅ Fixed

---

## What to Share With Me

Please provide:

1. **Auth Logs Error Message**
   - The exact error from Supabase Dashboard → Logs → Auth

2. **Email Confirmation Status**
   - Is it ON or OFF?

3. **Webhook Status**
   - Are there any webhooks configured?
   - What are the webhook URLs?

4. **Database Diagnostic Results**
   - Output from `deep-auth-diagnosis.sql`

5. **SMTP Configuration**
   - Using Supabase SMTP or custom?

---

## Quick Fix Attempts (Try in Order)

### Attempt 1: Disable Email Confirmation (30 seconds)
```
1. Supabase Dashboard → Authentication → Providers → Email
2. Turn OFF "Enable email confirmations"
3. Try signup
```

### Attempt 2: Disable Webhooks (30 seconds)
```
1. Supabase Dashboard → Authentication → Hooks
2. Disable all hooks
3. Try signup
```

### Attempt 3: Check Logs (1 minute)
```
1. Supabase Dashboard → Logs → Auth
2. Try signup
3. Read the error message
4. Share it with me
```

---

## The Answer is in the Logs

The Supabase Auth logs will tell us **exactly** why the 500 error is happening. 

**Please check the logs and share the error message.**

Without seeing the actual error from Supabase, we're guessing. The logs will give us the definitive answer.
