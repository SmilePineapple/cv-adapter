-- Diagnose and fix signup issue (without touching auth.users directly)
-- Run this in Supabase SQL Editor

-- Step 1: Check if usage_tracking has the required columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- Step 2: Add missing columns if needed
DO $$ 
BEGIN
    -- Add lifetime_generation_count if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'lifetime_generation_count'
    ) THEN
        ALTER TABLE public.usage_tracking 
        ADD COLUMN lifetime_generation_count INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added lifetime_generation_count column';
    ELSE
        RAISE NOTICE 'lifetime_generation_count column already exists';
    END IF;

    -- Add plan_type if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE public.usage_tracking 
        ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'free';
        
        -- Add constraint separately
        ALTER TABLE public.usage_tracking 
        ADD CONSTRAINT usage_tracking_plan_type_check 
        CHECK (plan_type IN ('free', 'pro'));
        
        RAISE NOTICE 'Added plan_type column';
    ELSE
        RAISE NOTICE 'plan_type column already exists';
    END IF;

    -- Add max_lifetime_generations if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usage_tracking' 
        AND column_name = 'max_lifetime_generations'
    ) THEN
        ALTER TABLE public.usage_tracking 
        ADD COLUMN max_lifetime_generations INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added max_lifetime_generations column';
    ELSE
        RAISE NOTICE 'max_lifetime_generations column already exists';
    END IF;
END $$;

-- Step 3: Check current function definition
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- Step 4: Recreate the function (we CAN do this)
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
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, user_full_name)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = NOW();
    
    RAISE LOG 'Profile created for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;
  
  -- Insert into usage_tracking table with all required columns
  BEGIN
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
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create usage_tracking for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
      -- This is critical - if usage tracking fails, we should know about it
      -- But don't block user creation
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'ERROR in handle_new_user for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    -- Don't block user creation
    RETURN NEW;
END;
$$;

-- Step 5: Check if trigger exists and is enabled
SELECT 
    t.tgname as trigger_name,
    CASE 
        WHEN t.tgenabled = 'O' THEN 'ENABLED'
        WHEN t.tgenabled = 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND t.tgname = 'on_auth_user_created';

-- Step 6: Verify the columns are now in usage_tracking
SELECT 
    'Verification: usage_tracking columns' as check_name,
    column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- Step 7: Test the insert manually to see if it works
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE 'Testing insert with user_id: %', test_user_id;
    
    -- Test profiles insert
    BEGIN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (test_user_id, 'test@example.com', 'Test User');
        RAISE NOTICE '✓ Profiles insert successful';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '✗ Profiles insert failed: %', SQLERRM;
    END;
    
    -- Test usage_tracking insert with all columns
    BEGIN
        INSERT INTO public.usage_tracking (
            user_id,
            lifetime_generation_count,
            plan_type,
            max_lifetime_generations
        )
        VALUES (test_user_id, 0, 'free', 1);
        RAISE NOTICE '✓ Usage tracking insert successful';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '✗ Usage tracking insert failed: %', SQLERRM;
    END;
    
    -- Clean up test data
    DELETE FROM public.usage_tracking WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Test complete and cleaned up';
END $$;

SELECT 'Diagnosis and fix complete! Check the output above for any errors.' as result;
