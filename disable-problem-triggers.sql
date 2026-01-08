-- Disable the triggers that are causing the 500 error
-- These triggers are trying to call net.http_post() which doesn't work properly

-- Step 1: Check which triggers exist
SELECT 
    t.tgname as trigger_name,
    CASE 
        WHEN t.tgenabled::text = 'O' THEN 'ENABLED'
        WHEN t.tgenabled::text = 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND p.pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY t.tgname;

-- Step 2: Disable the problematic triggers
-- These are trying to use net.http_post() which is causing the error

ALTER TABLE auth.users DISABLE TRIGGER on_user_created;
ALTER TABLE auth.users DISABLE TRIGGER trigger_auto_initialize_cohort;

-- Step 3: Verify our trigger is still enabled
SELECT 
    'After disabling problematic triggers' as status,
    t.tgname as trigger_name,
    CASE 
        WHEN t.tgenabled::text = 'O' THEN 'ENABLED ✓'
        WHEN t.tgenabled::text = 'D' THEN 'DISABLED ✗'
        ELSE 'UNKNOWN'
    END as current_status,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND p.pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY t.tgname;

-- Step 4: Check what these functions do (for reference)
SELECT 
    'send_welcome_email function' as info,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'send_welcome_email';

SELECT 
    'auto_initialize_cohort function' as info,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'auto_initialize_cohort';

SELECT 'Problematic triggers disabled. Try signup again!' as result;
