# Critical: Check Supabase Dashboard Settings

## The 500 error could be caused by several Supabase settings. Check these NOW:

### 1. Email Confirmation Settings
**Location:** Supabase Dashboard → Authentication → Providers → Email

**Check:**
- [ ] Is "Enable email confirmations" turned ON?
- [ ] If YES, this could be the issue - users need to confirm email before account is created
- [ ] Try turning it OFF temporarily to test

**Why this matters:** If email confirmation is required but the email service isn't configured properly, signup will fail with 500.

---

### 2. Auth Hooks/Webhooks
**Location:** Supabase Dashboard → Authentication → Hooks

**Check:**
- [ ] Are there ANY hooks configured?
- [ ] Look for: "Send a POST request" or "Custom access token"
- [ ] If you see a webhook URL pointing to your app, DISABLE it temporarily

**Common webhook URLs that would cause issues:**
- `http://localhost:3000/api/webhooks/auth` (unreachable from Supabase)
- `https://your-app.vercel.app/api/webhooks/auth` (might be failing)

---

### 3. SMTP/Email Provider
**Location:** Supabase Dashboard → Project Settings → Auth → SMTP Settings

**Check:**
- [ ] Is custom SMTP configured?
- [ ] If YES, is it working? Test it.
- [ ] If NO, Supabase uses their default (should work)

**Why this matters:** If email confirmation is ON and SMTP is broken, signup fails.

---

### 4. Rate Limiting
**Location:** Supabase Dashboard → Authentication → Rate Limits

**Check:**
- [ ] Are rate limits too strict?
- [ ] Try temporarily disabling or increasing limits

---

### 5. Database Triggers (from Supabase UI)
**Location:** Supabase Dashboard → Database → Triggers

**Check:**
- [ ] Look for trigger named `on_auth_user_created`
- [ ] Is it enabled?
- [ ] Click on it to see the function it calls

---

### 6. Check Logs (MOST IMPORTANT)
**Location:** Supabase Dashboard → Logs

**Check these log types:**

#### a) Auth Logs
- [ ] Go to Logs → Auth
- [ ] Try signing up again
- [ ] Look for the error message
- [ ] It will tell you EXACTLY what's failing

#### b) Postgres Logs  
- [ ] Go to Logs → Postgres
- [ ] Filter by last 5 minutes
- [ ] Look for errors related to `handle_new_user` or `usage_tracking`

#### c) Edge Function Logs (if applicable)
- [ ] Go to Logs → Edge Functions
- [ ] Check if any functions are being called during signup

---

## What to Look For in Logs

### If you see in Auth Logs:
- **"Email confirmation required"** → Disable email confirmation
- **"Webhook failed"** → Disable the webhook
- **"SMTP error"** → Fix SMTP or disable email confirmation
- **"Database error"** → Check Postgres logs for details

### If you see in Postgres Logs:
- **"column does not exist"** → Run the column migration SQL
- **"permission denied"** → Check RLS policies
- **"constraint violation"** → Check what constraint is failing

---

## Quick Test Checklist

Run these in order:

1. **Disable Email Confirmation**
   - Auth → Providers → Email → Turn OFF "Enable email confirmations"
   - Try signup again

2. **Disable Any Webhooks**
   - Auth → Hooks → Disable all hooks
   - Try signup again

3. **Check Logs**
   - Logs → Auth → Look for the actual error
   - Share the error message with me

4. **Run deep-auth-diagnosis.sql**
   - This will show if the database side is working
   - Share the results

---

## Most Likely Causes (in order)

1. **Email confirmation enabled but email service not working** (80% chance)
2. **Webhook configured but failing** (15% chance)
3. **Database trigger issue** (5% chance - we already fixed this)

---

## Next Steps

1. Go to Supabase Dashboard NOW
2. Check Auth → Providers → Email settings
3. Check Auth → Hooks for any webhooks
4. Check Logs → Auth for the actual error
5. Run `deep-auth-diagnosis.sql` and share results
6. Share what you find in the logs

The answer is in the Supabase Dashboard - we need to see the actual error message from the logs.
