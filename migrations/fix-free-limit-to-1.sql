-- Fix: New users getting 2 free generations instead of 1
-- Date: Dec 9, 2025
-- Issue: Database trigger was setting max_lifetime_generations to 2 instead of 1

-- Step 1: Update the trigger function to set max_lifetime_generations to 1
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Log the attempt
  RAISE NOTICE 'Creating profile for user: %', NEW.id;
  
  -- Safely extract full_name from metadata, default to NULL if not present
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
  
  -- Insert into usage_tracking table with lifetime payment columns
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
      1       -- Free plan gets 1 generation (FIXED from 2)
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Usage tracking created for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create usage tracking for user %: %', NEW.id, SQLERRM;
      -- Re-raise to prevent user creation if usage tracking fails
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

-- Step 2: Optionally update existing free users who have 2 generations to 1
-- (Only run this if you want to retroactively fix existing users)
-- UPDATE public.usage_tracking
-- SET max_lifetime_generations = 1
-- WHERE plan_type = 'free' 
-- AND max_lifetime_generations = 2
-- AND lifetime_generation_count = 0;

-- Step 3: Verify the fix
SELECT 'Trigger function updated - new free users will get 1 generation' as status;
