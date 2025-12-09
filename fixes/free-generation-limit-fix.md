# Free Generation Limit Fix - Dec 9, 2025

## Problem
New users were getting 2 free generations instead of 1 generation as intended.

**Evidence from Admin Dashboard:**
- `nataliyaportnova25@gmail.com` - Free - 0/2 (should be 0/1)
- `agichungu@gmail.com` - Free - 1/2 (should be 1/1)
- `anthonysarpong44@gmail.com` - Free - 0/2 (should be 0/1)

Older users correctly showed 0/1 or 1/1.

## Root Cause
Two configuration issues:

1. **`.env.local` (Line 23)**: `MAX_FREE_GENERATIONS=2` instead of `1`
2. **Database Trigger (`supabase-setup.sql` Line 228)**: The `handle_new_user()` function was setting `max_lifetime_generations` to `2` for new free users

## Files Fixed

### 1. `.env.local`
```diff
- MAX_FREE_GENERATIONS=2
+ MAX_FREE_GENERATIONS=1
```

### 2. `supabase-setup.sql`
```diff
VALUES (
  NEW.id,
  0,      -- Start with 0 generations used
  'free', -- New users start on free plan
- 2       -- Free plan gets 2 generations
+ 1       -- Free plan gets 1 generation
)
```

### 3. Created Migration
`migrations/fix-free-limit-to-1.sql` - Updates the production database trigger

## Deployment Steps

1. ✅ Updated `.env.local` (local environment)
2. ✅ Updated `supabase-setup.sql` (source of truth)
3. ⏳ **Run migration in Supabase SQL Editor:**
   - Open Supabase Dashboard → SQL Editor
   - Run `migrations/fix-free-limit-to-1.sql`
   - This updates the `handle_new_user()` trigger function

4. ⏳ **Optional: Fix existing users with 2 generations**
   - Uncomment the UPDATE statement in the migration
   - This will retroactively fix users who signed up with the bug

## Verification

After running the migration, test with a new user signup:

```sql
-- Check new user's limit
SELECT 
  u.email,
  ut.plan_type,
  ut.max_lifetime_generations,
  ut.lifetime_generation_count
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
WHERE u.email = 'test@example.com';
```

Expected result: `max_lifetime_generations = 1` for free users

## Impact
- **Future signups**: Will correctly get 1 free generation
- **Existing users**: Unaffected unless you run the optional UPDATE statement
- **Pro users**: No impact (unlimited generations)

## Status
✅ Code fixed
✅ Migration created
⏳ Needs deployment to production database
