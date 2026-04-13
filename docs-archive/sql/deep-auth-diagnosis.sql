-- Deep diagnosis of auth signup failure
-- Run this in Supabase SQL Editor

-- 1. Check if any users were created recently (even if failed)
SELECT 
    'Recent auth.users attempts' as check_name,
    id,
    email,
    created_at,
    confirmed_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data->>'full_name' as full_name
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check profiles - see if any were created
SELECT 
    'Recent profiles' as check_name,
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    CASE 
        WHEN u.id IS NULL THEN 'ORPHANED - No auth user'
        ELSE 'OK'
    END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Check usage_tracking - see if any were created
SELECT 
    'Recent usage_tracking' as check_name,
    ut.user_id,
    ut.plan_type,
    ut.lifetime_generation_count,
    ut.max_lifetime_generations,
    ut.created_at,
    CASE 
        WHEN u.id IS NULL THEN 'ORPHANED - No auth user'
        ELSE 'OK'
    END as status
FROM public.usage_tracking ut
LEFT JOIN auth.users u ON ut.user_id = u.id
ORDER BY ut.created_at DESC
LIMIT 10;

-- 4. Verify the trigger exists and is enabled
SELECT 
    'Trigger status' as check_name,
    t.tgname as trigger_name,
    CASE 
        WHEN t.tgenabled = 'O' THEN 'ENABLED'
        WHEN t.tgenabled = 'D' THEN 'DISABLED'
        WHEN t.tgenabled = 'R' THEN 'REPLICA'
        WHEN t.tgenabled = 'A' THEN 'ALWAYS'
        ELSE 'UNKNOWN: ' || t.tgenabled
    END as status,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgrelid = 'auth.users'::regclass
AND t.tgname LIKE '%user%';

-- 5. Check the actual function definition
SELECT 
    'Function definition' as check_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- 6. Verify usage_tracking columns exist
SELECT 
    'usage_tracking columns' as check_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- 7. Check for any constraints that might be failing
SELECT 
    'usage_tracking constraints' as check_name,
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.usage_tracking'::regclass;

-- 8. Check RLS policies on usage_tracking
SELECT 
    'usage_tracking RLS policies' as check_name,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'usage_tracking';

-- 9. Check if RLS is enabled
SELECT 
    'RLS status' as check_name,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'usage_tracking');

-- 10. Test manual insert to see exact error
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test-' || test_user_id::text || '@example.com';
    error_message TEXT;
    error_detail TEXT;
BEGIN
    RAISE NOTICE '=== TESTING MANUAL INSERT ===';
    RAISE NOTICE 'Test user ID: %', test_user_id;
    
    -- Test profiles insert
    BEGIN
        RAISE NOTICE 'Attempting profiles insert...';
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (test_user_id, test_email, 'Test User');
        RAISE NOTICE '✓ Profiles insert SUCCESS';
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS 
                error_message = MESSAGE_TEXT,
                error_detail = PG_EXCEPTION_DETAIL;
            RAISE WARNING '✗ Profiles insert FAILED: %', error_message;
            RAISE WARNING 'Detail: %', error_detail;
            RAISE WARNING 'SQLSTATE: %', SQLSTATE;
    END;
    
    -- Test usage_tracking insert with explicit columns
    BEGIN
        RAISE NOTICE 'Attempting usage_tracking insert...';
        INSERT INTO public.usage_tracking (
            user_id,
            lifetime_generation_count,
            plan_type,
            max_lifetime_generations
        )
        VALUES (
            test_user_id,
            0,
            'free',
            1
        );
        RAISE NOTICE '✓ Usage tracking insert SUCCESS';
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS 
                error_message = MESSAGE_TEXT,
                error_detail = PG_EXCEPTION_DETAIL;
            RAISE WARNING '✗ Usage tracking insert FAILED: %', error_message;
            RAISE WARNING 'Detail: %', error_detail;
            RAISE WARNING 'SQLSTATE: %', SQLSTATE;
    END;
    
    -- Clean up
    BEGIN
        DELETE FROM public.usage_tracking WHERE user_id = test_user_id;
        DELETE FROM public.profiles WHERE id = test_user_id;
        RAISE NOTICE '✓ Test data cleaned up';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Cleanup failed (might be OK if inserts failed)';
    END;
    
    RAISE NOTICE '=== TEST COMPLETE ===';
END $$;

-- 11. Final summary
SELECT 
    'DIAGNOSIS SUMMARY' as summary,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.usage_tracking) as total_usage_tracking,
    (SELECT COUNT(*) FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass AND tgname = 'on_auth_user_created') as trigger_exists;
