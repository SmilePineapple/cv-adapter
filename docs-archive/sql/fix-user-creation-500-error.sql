-- Fix: Database error on user signup (500 error)
-- Issue: handle_new_user() trigger not inserting required lifetime payment columns
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create updated function with lifetime payment columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Log the attempt
  RAISE NOTICE 'Creating profile for user: %', NEW.id;
  
  -- Safely extract full_name from metadata
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
      -- This is critical - re-raise the error to prevent user creation
      RAISE;
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Verify the fix
SELECT 'Trigger updated successfully!' as status;

-- Show the trigger
SELECT 
    tgname as trigger_name,
    tgenabled as enabled
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
AND tgname = 'on_auth_user_created';

-- Test with a sample query (don't actually run this, just verify structure)
-- SELECT * FROM usage_tracking LIMIT 1;
