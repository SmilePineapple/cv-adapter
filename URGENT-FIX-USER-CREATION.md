# 🚨 URGENT: Fix User Creation Error

## Quick Fix Steps

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

### 2. Navigate to SQL Editor
- Click **SQL Editor** in the left sidebar
- Click **New query**

### 3. Copy & Paste This SQL
```sql
-- Fix for user creation trigger and update all triggers to modern syntax
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);
  
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, user_full_name)
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.usage_tracking (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update other triggers to modern syntax
DROP TRIGGER IF EXISTS update_activity_on_cv_access ON cvs;
DROP TRIGGER IF EXISTS update_activity_on_generation ON generations;

CREATE TRIGGER update_activity_on_cv_access
  AFTER INSERT OR UPDATE ON cvs
  FOR EACH ROW EXECUTE FUNCTION update_last_activity();

CREATE TRIGGER update_activity_on_generation
  AFTER INSERT ON generations
  FOR EACH ROW EXECUTE FUNCTION update_last_activity();

SELECT 'All triggers recreated successfully' as status;
```

### 4. Click "Run" Button

### 5. Test User Creation
Go to `http://localhost:3000/auth/signup` and try creating a new account.

## What This Fixes
- ✅ Handles NULL metadata gracefully
- ✅ Prevents duplicate insert errors
- ✅ Logs errors without failing user creation
- ✅ Uses modern PostgreSQL syntax

## Files Updated
- `database-schema.sql` - Updated for future deployments
- `supabase-setup.sql` - Updated for fresh setups
- `fix-user-creation-trigger.sql` - Standalone fix script
- `fixes/user-creation-500-error-fix.md` - Detailed documentation
