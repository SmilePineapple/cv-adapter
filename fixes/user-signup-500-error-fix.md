# User Signup 500 Error Fix

## Problem
Users were unable to sign up - receiving a 500 error from Supabase auth API:
```
vuslzrevbkuugqeiadnq.supabase.co/auth/v1/signup:1 Failed to load resource: the server responded with a status of 500 ()
```

## Root Cause
The database trigger `handle_new_user()` was trying to insert into `usage_tracking` table with only the `user_id` column:

```sql
INSERT INTO public.usage_tracking (user_id)
VALUES (NEW.id)
```

However, the table was migrated to include **required NOT NULL columns** for the lifetime payment model:
- `lifetime_generation_count` (default 0)
- `plan_type` (default 'free')  
- `max_lifetime_generations` (default 1)

The trigger was not updated after the payment migration, causing the insert to fail and the user creation to fail with a 500 error.

## Solution
Updated the `handle_new_user()` trigger function to explicitly insert all required columns:

```sql
INSERT INTO public.usage_tracking (
  user_id,
  lifetime_generation_count,
  plan_type,
  max_lifetime_generations
)
VALUES (
  NEW.id,
  0,      -- Start with 0 generations used
  'free', -- New users start on free plan
  1       -- Free plan gets 1 generation
)
```

## Files Modified
1. **`fix-user-creation-500-error.sql`** - SQL script to fix the trigger in Supabase
2. **`supabase-setup.sql`** - Updated main schema file with correct trigger and table structure

## How to Apply Fix
Run this SQL in Supabase SQL Editor:

```sql
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create updated function with lifetime payment columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  RAISE NOTICE 'Creating profile for user: %', NEW.id;
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);
  
  -- Insert into profiles table
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, user_full_name)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
  
  -- Insert into usage_tracking table WITH LIFETIME PAYMENT COLUMNS
  BEGIN
    INSERT INTO public.usage_tracking (
      user_id,
      lifetime_generation_count,
      plan_type,
      max_lifetime_generations
    )
    VALUES (
      NEW.id,
      0,      -- Start with 0 generations used
      'free', -- New users start on free plan
      1       -- Free plan gets 1 generation
    )
    ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE 'Usage tracking created for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create usage tracking for user %: %', NEW.id, SQLERRM;
      RAISE;
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Testing
After applying the fix:
1. Try signing up with a new email address
2. Verify no 500 error occurs
3. Check Supabase logs for "Profile created successfully" and "Usage tracking created" messages
4. Verify new user appears in `profiles` and `usage_tracking` tables with correct default values

## Prevention
- Always update database triggers when migrating table schemas
- Test user signup flow after any database changes
- Add NOT NULL constraints carefully - ensure all insert statements include those columns
- Keep trigger functions in sync with table structure

## Related Files
- `migrate-to-lifetime-payments.sql` - Original payment migration (missed trigger update)
- `complete-user-creation-fix.sql` - Previous trigger fix (outdated)
- `supabase-setup.sql` - Main database schema
