# URGENT: Auth Webhook Blocking User Signup

## Problem Identified
You have an auth webhook at `/api/webhooks/auth` that Supabase might be calling during user signup. If this webhook:
1. Is configured as **synchronous** (blocking)
2. Is failing or timing out
3. Is unreachable from Supabase

Then user creation will fail with a 500 error.

## Immediate Fix Options

### Option 1: Disable the Webhook (Quickest)
Go to Supabase Dashboard:
1. **Settings** → **Authentication** → **Hooks**
2. Look for any webhook configured for "User Created" or "Sign Up"
3. **Disable it temporarily** to test if this is the issue
4. Try signing up again

### Option 2: Check Webhook Configuration
In Supabase Dashboard → Settings → Authentication → Hooks:
- Check if webhook is set to **"Send a POST request"**
- Check the URL - should be: `https://your-domain.vercel.app/api/webhooks/auth`
- Check if it's **synchronous** (blocks user creation) or **asynchronous**
- If synchronous, change to asynchronous or disable

### Option 3: Fix the Webhook Endpoint
The webhook at `/api/webhooks/auth/route.ts` calls `sendWelcomeEmail()` which might be failing.

Check if `sendWelcomeEmail` function exists and works:

```typescript
// Check src/lib/email.ts
```

If the email function doesn't exist or is broken, the webhook will fail.

## Quick Test

### Test 1: Check if webhook is configured
Run this in Supabase SQL Editor:
```sql
-- This won't work directly, but check in Dashboard:
-- Settings → Authentication → Hooks
```

### Test 2: Disable webhook and test signup
1. Disable webhook in Supabase Dashboard
2. Try signing up
3. If it works, the webhook was the problem

### Test 3: Check if email function exists
```bash
# Check if email.ts exists
ls src/lib/email.ts
```

## Most Likely Solution
Based on the error pattern, I suspect:
1. Supabase has a webhook configured to call your app on user signup
2. The webhook is **synchronous** (blocking)
3. The webhook is either:
   - Failing because `sendWelcomeEmail` doesn't exist
   - Timing out because your app isn't deployed/reachable
   - Returning an error

**Action:** Go to Supabase Dashboard → Settings → Authentication → Hooks and **disable or remove** any webhooks temporarily to test.

## After Testing
Once you confirm the webhook is the issue:
1. Either remove the webhook entirely
2. Or fix the `sendWelcomeEmail` function
3. Or make the webhook asynchronous (non-blocking)
4. Or handle errors gracefully in the webhook

## Check Your Deployment
If the webhook URL points to `localhost:3000`, it will fail because Supabase can't reach localhost.
- Update webhook URL to your production domain
- Or disable webhook for local development
