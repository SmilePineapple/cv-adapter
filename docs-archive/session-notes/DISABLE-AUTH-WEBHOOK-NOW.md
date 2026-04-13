# 🚨 URGENT: Disable Auth Webhook

## The Real Problem

The error shows Supabase Auth is trying to call `net.http_post()` during signup:

```
ERROR: function net.http_post(url => unknown, headers => jsonb, body => text) does not exist
```

**This means you have a webhook configured that's trying to make an HTTP request during user creation.**

## Immediate Fix (2 minutes)

### Option A: Disable the Webhook (FASTEST)

1. **Go to Supabase Dashboard**
2. **Authentication → Hooks**
3. **Look for any hooks** (especially "Send a POST request" or "Custom access token")
4. **DISABLE or DELETE the hook**
5. **Try signup again**

This will immediately fix the issue.

---

### Option B: Fix pg_net (If you need webhooks)

If you actually need the webhook to work, run `fix-pg-net-functions.sql` and then contact Supabase support if functions are still missing.

---

## Why This is Happening

1. You have a webhook configured in Supabase Auth
2. The webhook tries to call your app at `/api/webhooks/auth` during signup
3. Supabase uses `net.http_post()` to make the HTTP request
4. But `pg_net` extension isn't fully installed
5. The function doesn't exist
6. Signup fails with 500

## The Webhook Code

You have this webhook handler in your app:
- File: `src/app/api/webhooks/auth/route.ts`
- Purpose: Send welcome email on signup
- Problem: Supabase can't call it because `net.http_post()` is missing

## Solutions (Pick One)

### Solution 1: Disable Webhook (Recommended for now)
✅ Fastest fix
✅ Signup will work immediately
✅ You can add welcome emails later via application code
❌ No automatic welcome emails

**Do this:** Supabase Dashboard → Authentication → Hooks → Disable all

---

### Solution 2: Fix pg_net Extension
✅ Keeps webhook functionality
✅ Welcome emails will work
❌ Requires Supabase support if functions missing
❌ Takes longer

**Do this:** 
1. Run `fix-pg-net-functions.sql`
2. If functions still missing, contact Supabase support
3. Request: "Please fully install pg_net extension with all functions"

---

### Solution 3: Move Welcome Email to Application
✅ More reliable
✅ Easier to debug
✅ No dependency on database webhooks
❌ Requires code changes

**Do this later:** 
- Send welcome email from signup page after successful signup
- Don't rely on database webhooks

---

## Recommended Action RIGHT NOW

**Go to Supabase Dashboard → Authentication → Hooks and disable any webhooks.**

This will let users sign up immediately while you decide how to handle welcome emails later.

---

## After Disabling Webhook

Once webhook is disabled:
1. Try signup again - should work
2. User will be created successfully
3. No welcome email will be sent (you can add this later)
4. Everything else will work normally

---

## Long-term Fix

After signup is working, you can:

1. **Option A:** Keep webhook disabled, send emails from app code
2. **Option B:** Contact Supabase support to fix pg_net
3. **Option C:** Use a different email trigger (like Supabase Edge Functions)

---

## Check Webhook Configuration

**Location:** Supabase Dashboard → Authentication → Hooks

**Look for:**
- Hook name: Something like "User Created" or "Send Welcome Email"
- Hook type: "Send a POST request"
- URL: Probably `https://mycvbuddy.com/api/webhooks/auth`
- Status: Enabled

**Action:** Click the toggle to DISABLE it or click DELETE to remove it.

---

## This Explains Everything

All the database fixes were correct. The issue is:
1. ✅ Database trigger works fine
2. ✅ Columns are correct
3. ✅ Function is correct
4. ❌ **Auth webhook is trying to call net.http_post() which doesn't exist**

Disable the webhook and signup will work immediately.
