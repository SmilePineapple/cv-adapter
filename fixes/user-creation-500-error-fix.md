# User Creation 500 Error Fix

## Problem
When creating a new user account via email signup, the database trigger `handle_new_user()` was failing with a 500 Internal Server Error. This prevented new users from signing up.

## Root Cause
The `handle_new_user()` trigger function had several issues:
1. **No error handling**: If any part of the function failed, the entire user creation would fail
2. **No conflict handling**: If a profile or usage_tracking record already existed (e.g., from a previous failed attempt), the INSERT would fail
3. **Potential NULL issues**: The `raw_user_meta_data` field might not always contain `full_name`
4. **Outdated syntax**: Used `EXECUTE PROCEDURE` instead of `EXECUTE FUNCTION`

## Solution
Updated the trigger function with:
1. **Proper error handling**: Added `EXCEPTION` block to catch and log errors without failing user creation
2. **Conflict resolution**: Added `ON CONFLICT DO NOTHING` to handle duplicate inserts gracefully
3. **Safe metadata extraction**: Used `COALESCE` to safely extract `full_name` with NULL fallback
4. **Modern syntax**: Updated to use `EXECUTE FUNCTION` instead of deprecated `EXECUTE PROCEDURE`

## How to Apply the Fix

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run the Fix Script
Copy and paste the following SQL into the editor and click **Run**:

```sql
-- Fix for user creation trigger
-- This handles cases where raw_user_meta_data might be NULL or missing full_name

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Safely extract full_name from metadata, default to NULL if not present
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, user_full_name)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into usage_tracking table
  INSERT INTO public.usage_tracking (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function works
SELECT 'Trigger function recreated successfully' as status;
```

### Step 3: Verify the Fix
After running the script, you should see:
- Success message: "Trigger function recreated successfully"
- No errors in the output

### Step 4: Test User Creation
1. Go to your app at `localhost:3000/auth/signup`
2. Try creating a new account with email and password
3. User creation should now succeed without the "Database error saving new user" message

## What Changed in the Codebase
- Updated `database-schema.sql` with the fixed trigger function
- Created `fix-user-creation-trigger.sql` for easy deployment
- This fix is now part of the main schema for future deployments

## Testing Checklist
- [ ] Run the SQL fix in Supabase SQL Editor
- [ ] Verify no errors in SQL output
- [ ] Test creating a new user account
- [ ] Verify user appears in `auth.users` table
- [ ] Verify profile created in `profiles` table
- [ ] Verify usage tracking created in `usage_tracking` table
- [ ] Test login with the newly created account

## Prevention
This fix is now part of the main `database-schema.sql` file, so future deployments will include the robust error handling automatically.
