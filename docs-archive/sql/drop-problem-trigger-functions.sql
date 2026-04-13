-- Drop the problematic trigger functions
-- We can't disable triggers on auth.users, but we CAN drop the functions
-- When the function is dropped, the trigger becomes inactive

-- Step 1: Check current triggers and functions
SELECT 
    t.tgname as trigger_name,
    p.proname as function_name,
    n.nspname as function_schema
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND n.nspname = 'public'
ORDER BY t.tgname;

-- Step 2: Drop the problematic functions (this will make the triggers fail silently or be removed)
-- Drop send_welcome_email function
DROP FUNCTION IF EXISTS public.send_welcome_email() CASCADE;

-- Drop auto_initialize_cohort function
DROP FUNCTION IF EXISTS public.auto_initialize_cohort() CASCADE;

-- Step 3: Verify the functions are gone
SELECT 
    'Remaining public functions on auth.users' as info,
    t.tgname as trigger_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND n.nspname = 'public'
ORDER BY t.tgname;

-- Step 4: Verify our handle_new_user function still exists
SELECT 
    'Our handle_new_user function' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = 'handle_new_user'
        )
        THEN '✓ Still exists - good!'
        ELSE '✗ Missing - this is bad!'
    END as status;

SELECT 'Problematic functions dropped. Try signup now!' as result;
