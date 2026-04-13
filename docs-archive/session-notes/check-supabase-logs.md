# Check Supabase Logs for Signup Error

## Steps to Debug

### 1. Check Supabase Logs
Go to your Supabase Dashboard:
1. Navigate to **Logs** → **Auth Logs**
2. Try to sign up again
3. Look for the error message that shows why the 500 error is happening

### 2. Check Postgres Logs
In Supabase Dashboard:
1. Go to **Logs** → **Postgres Logs**
2. Filter by time (last 5 minutes)
3. Look for any errors related to `handle_new_user` or `usage_tracking`

### 3. Common Issues to Look For

**Issue 1: Email Confirmation Required**
- Supabase might require email confirmation
- Check: Settings → Authentication → Email Auth → "Enable email confirmations"
- If enabled, users must confirm email before account is created

**Issue 2: Auth Webhook Failing**
- Check if there's a webhook configured that's failing
- Settings → Authentication → Hooks
- Look for any webhooks that might be blocking user creation

**Issue 3: RLS Policies Blocking Insert**
- The trigger runs as SECURITY DEFINER but RLS might still block
- Check if profiles/usage_tracking have overly restrictive RLS policies

**Issue 4: Database Trigger Still Using Old Function**
- The function might be cached
- Try restarting the Supabase instance or wait a few minutes

### 4. What to Share
Please share:
1. Any error messages from **Auth Logs**
2. Any error messages from **Postgres Logs** 
3. The output from the previous SQL (especially the "Testing insert" section)

### 5. Quick Test
Try this SQL to see if the trigger is actually being called:

```sql
-- Check recent auth.users to see if any were created
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if profiles were created for those users
SELECT p.id, p.email, p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 5;

-- Check if usage_tracking was created
SELECT ut.user_id, ut.plan_type, ut.lifetime_generation_count, ut.max_lifetime_generations
FROM public.usage_tracking ut
ORDER BY ut.created_at DESC
LIMIT 5;
```

This will show if users are being created but the trigger is failing, or if user creation itself is failing.
