-- Diagnostic script to check trigger and function status
-- Run this in Supabase SQL Editor to see what's wrong

-- 1. Check if the function exists
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- 2. Check if triggers exist on auth.users
SELECT 
    tgname as trigger_name,
    tgtype,
    tgenabled
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass;

-- 3. Check if profiles table exists and has correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Check if usage_tracking table exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- 5. Check recent auth.users entries (to see if any were created)
SELECT 
    id, 
    email, 
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check if profiles were created for recent users
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 5;
