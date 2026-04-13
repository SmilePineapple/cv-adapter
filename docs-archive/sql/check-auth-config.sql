-- Check authentication configuration and potential blockers
-- Run this in Supabase SQL Editor

-- 1. Check if there are any auth hooks configured
SELECT 
    id,
    hook_name,
    enabled
FROM supabase_functions.hooks
WHERE hook_name LIKE '%auth%'
ORDER BY created_at DESC;

-- 2. Check recent auth attempts (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name = 'audit_log_entries'
    ) THEN
        RAISE NOTICE 'Checking recent auth audit logs...';
        PERFORM * FROM auth.audit_log_entries 
        ORDER BY created_at DESC 
        LIMIT 5;
    ELSE
        RAISE NOTICE 'Auth audit log table not accessible';
    END IF;
END $$;

-- 3. Check if any users were recently created
SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check profiles for recent users
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    u.email as auth_email,
    u.created_at as auth_created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 5. Check usage_tracking for recent users
SELECT 
    ut.user_id,
    ut.plan_type,
    ut.lifetime_generation_count,
    ut.max_lifetime_generations,
    ut.created_at,
    u.email
FROM public.usage_tracking ut
LEFT JOIN auth.users u ON ut.user_id = u.id
ORDER BY ut.created_at DESC
LIMIT 5;

-- 6. Check if there are orphaned profiles (profile exists but no auth.user)
SELECT 
    p.id,
    p.email,
    p.created_at,
    'ORPHANED - No auth.user' as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL
LIMIT 5;

-- 7. Check for any database errors in the logs (if accessible)
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNOSTIC COMPLETE ===';
    RAISE NOTICE 'Check the results above to see:';
    RAISE NOTICE '1. If users are being created in auth.users';
    RAISE NOTICE '2. If profiles are being created';
    RAISE NOTICE '3. If usage_tracking is being created';
    RAISE NOTICE '4. Any orphaned records';
END $$;

-- 8. Test if we can manually create a user record (simulating what the trigger does)
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'manual-test-' || test_user_id::text || '@example.com';
BEGIN
    RAISE NOTICE 'Testing manual user creation with ID: %', test_user_id;
    
    -- Try to insert into profiles
    BEGIN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (test_user_id, test_email, 'Manual Test User');
        RAISE NOTICE '✓ Successfully inserted into profiles';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '✗ Failed to insert into profiles: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    END;
    
    -- Try to insert into usage_tracking
    BEGIN
        INSERT INTO public.usage_tracking (
            user_id,
            lifetime_generation_count,
            plan_type,
            max_lifetime_generations
        )
        VALUES (test_user_id, 0, 'free', 1);
        RAISE NOTICE '✓ Successfully inserted into usage_tracking';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '✗ Failed to insert into usage_tracking: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    END;
    
    -- Clean up
    DELETE FROM public.usage_tracking WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE '✓ Test complete and cleaned up';
END $$;
