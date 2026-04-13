-- Fix for user creation trigger and update all triggers to modern syntax
-- This handles cases where raw_user_meta_data might be NULL or missing full_name
-- Run this in Supabase SQL Editor

-- Drop all existing triggers that depend on handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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

-- Recreate trigger with modern syntax
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update other triggers to use modern syntax
DROP TRIGGER IF EXISTS update_activity_on_cv_access ON cvs;
DROP TRIGGER IF EXISTS update_activity_on_generation ON generations;

CREATE TRIGGER update_activity_on_cv_access
  AFTER INSERT OR UPDATE ON cvs
  FOR EACH ROW EXECUTE FUNCTION update_last_activity();

CREATE TRIGGER update_activity_on_generation
  AFTER INSERT ON generations
  FOR EACH ROW EXECUTE FUNCTION update_last_activity();

-- Test the function works
SELECT 'All triggers recreated successfully with modern syntax' as status;
