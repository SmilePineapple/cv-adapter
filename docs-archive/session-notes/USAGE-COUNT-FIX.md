# Usage Count Not Incrementing - Fix

## Problem
After generating a CV, the usage count on the dashboard still shows "3 remaining" instead of decrementing. The count is not being updated in the database.

## Root Causes
1. **RLS Policy Issue**: The `usage_tracking` table might not have proper UPDATE policies for authenticated users
2. **Dashboard Not Refreshing**: When returning from review page, dashboard doesn't refetch data
3. **Missing Logging**: No visibility into whether the update is succeeding

## Fixes Applied

### 1. Enhanced API Logging (`/api/rewrite/route.ts`)
Added detailed logging to track usage updates:
```typescript
console.log('Updating usage tracking:', {
  userId: user.id,
  oldCount: usage?.generation_count,
  newCount
})
```

This will show in the terminal/console when generating a CV.

### 2. Dashboard Auto-Refresh (`/dashboard/page.tsx`)
Added window focus event listener to refetch data when returning to dashboard:
```typescript
window.addEventListener('focus', handleFocus)
```

Now when you navigate back to the dashboard, it automatically refreshes the usage count.

### 3. RLS Policy Fix (`fix-usage-tracking-rls.sql`)
Created comprehensive RLS policies for usage_tracking table:
- SELECT policy for viewing own usage
- UPDATE policy for updating own usage  
- INSERT policy for creating own usage
- Proper permissions for authenticated users

## How to Apply the Fix

### Step 1: Run RLS Fix in Supabase
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `fix-usage-tracking-rls.sql`
3. Run the script
4. Verify "Usage tracking RLS policies updated successfully" message

### Step 2: Test the Fix
1. Go to dashboard and note current usage count
2. Generate a new CV
3. Complete the generation and return to dashboard
4. Dashboard should auto-refresh and show updated count

### Step 3: Check Logs (if still not working)
1. Open browser DevTools → Console
2. Generate a CV
3. Look for terminal logs showing:
   ```
   Updating usage tracking: { userId: '...', oldCount: X, newCount: X+1 }
   Usage tracking updated successfully: [...]
   ```
4. If you see an error, share it for further debugging

## Diagnostic Commands

### Check Current Usage Data
```sql
SELECT user_id, generation_count, updated_at
FROM public.usage_tracking
ORDER BY updated_at DESC;
```

### Check RLS Policies
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'usage_tracking';
```

### Manually Reset Usage (for testing)
```sql
UPDATE public.usage_tracking
SET generation_count = 0
WHERE user_id = 'YOUR_USER_ID';
```

## Expected Behavior After Fix
- ✅ Generate CV → Count increments immediately
- ✅ Return to dashboard → Count updates automatically
- ✅ Console shows update logs
- ✅ Database reflects correct count

## If Still Not Working
1. Check Supabase logs for errors
2. Verify user_id in usage_tracking matches auth.users
3. Check if usage_tracking row exists for the user
4. Share console logs and Supabase error logs
