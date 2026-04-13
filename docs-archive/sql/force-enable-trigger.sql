-- Force enable the trigger and verify it's working
-- Run this in Supabase SQL Editor

-- Step 1: Check current trigger status
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    CASE 
        WHEN tgenabled = 'O' THEN 'ENABLED'
        WHEN tgenabled = 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status_text
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
AND tgname = 'on_auth_user_created';

-- Step 2: Check if the function exists and is correct
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- Step 3: Verify usage_tracking table has the required columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- Step 4: If columns are missing, add them
DO $$ 
BEGIN
    -- Add lifetime_generation_count if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'lifetime_generation_count'
    ) THEN
        ALTER TABLE usage_tracking 
        ADD COLUMN lifetime_generation_count INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added lifetime_generation_count column';
    END IF;

    -- Add plan_type if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE usage_tracking 
        ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro'));
        RAISE NOTICE 'Added plan_type column';
    END IF;

    -- Add max_lifetime_generations if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'max_lifetime_generations'
    ) THEN
        ALTER TABLE usage_tracking 
        ADD COLUMN max_lifetime_generations INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added max_lifetime_generations column';
    END IF;
END $$;

-- Step 5: Drop and recreate the trigger completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 6: Create the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Log the attempt
  RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
  
  -- Safely extract full_name from metadata
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, user_full_name)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = NOW();
  
  RAISE LOG 'Profile created for user: %', NEW.id;
  
  -- Insert into usage_tracking table with all required columns
  INSERT INTO public.usage_tracking (
    user_id,
    lifetime_generation_count,
    plan_type,
    max_lifetime_generations
  )
  VALUES (
    NEW.id,
    0,
    'free',
    1
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RAISE LOG 'Usage tracking created for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'ERROR in handle_new_user for user %: % - %', NEW.id, SQLERRM, SQLSTATE;
    -- Don't block user creation, just log the error
    RETURN NEW;
END;
$$;

-- Step 7: Create the trigger with explicit ENABLE
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Explicitly enable the trigger (should be enabled by default, but force it)
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Step 9: Verify trigger is now enabled
SELECT 
    tgname as trigger_name,
    CASE 
        WHEN tgenabled = 'O' THEN 'ENABLED ✓'
        WHEN tgenabled = 'D' THEN 'DISABLED ✗'
        ELSE 'UNKNOWN'
    END as status
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
AND tgname = 'on_auth_user_created';

-- Step 10: Test the function manually (optional - comment out if you don't want to test)
-- DO $$
-- DECLARE
--     test_user_id UUID := gen_random_uuid();
-- BEGIN
--     -- This simulates what happens during user creation
--     RAISE NOTICE 'Testing with user_id: %', test_user_id;
--     
--     INSERT INTO public.profiles (id, email, full_name)
--     VALUES (test_user_id, 'test@example.com', 'Test User')
--     ON CONFLICT (id) DO NOTHING;
--     
--     INSERT INTO public.usage_tracking (
--         user_id,
--         lifetime_generation_count,
--         plan_type,
--         max_lifetime_generations
--     )
--     VALUES (test_user_id, 0, 'free', 1)
--     ON CONFLICT (user_id) DO NOTHING;
--     
--     RAISE NOTICE 'Test successful! Cleaning up...';
--     
--     -- Clean up test data
--     DELETE FROM public.usage_tracking WHERE user_id = test_user_id;
--     DELETE FROM public.profiles WHERE id = test_user_id;
-- END $$;

SELECT 'Setup complete! Trigger should now be enabled and working.' as result;
