-- Get detailed error information from our trigger
-- This will show us exactly what's failing

-- Step 1: Check if any users were created in the last 5 minutes
SELECT 
    'Recent auth.users' as check_name,
    id,
    email,
    created_at,
    raw_user_meta_data->>'full_name' as full_name,
    confirmed_at,
    email_confirmed_at
FROM auth.users
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;

-- Step 2: Check if profiles were created for those users
SELECT 
    'Recent profiles' as check_name,
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    u.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.created_at > NOW() - INTERVAL '5 minutes'
ORDER BY p.created_at DESC;

-- Step 3: Check if usage_tracking was created
SELECT 
    'Recent usage_tracking' as check_name,
    ut.user_id,
    ut.plan_type,
    ut.lifetime_generation_count,
    ut.max_lifetime_generations,
    ut.created_at
FROM public.usage_tracking ut
WHERE ut.created_at > NOW() - INTERVAL '5 minutes'
ORDER BY ut.created_at DESC;

-- Step 4: Test the trigger function manually with detailed error reporting
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test-' || test_user_id::text || '@example.com';
    v_error_message TEXT;
    v_error_detail TEXT;
    v_error_hint TEXT;
    v_error_context TEXT;
BEGIN
    RAISE NOTICE '=== TESTING TRIGGER FUNCTION ===';
    RAISE NOTICE 'Test user ID: %', test_user_id;
    
    -- Test profiles insert
    BEGIN
        RAISE NOTICE 'Step 1: Testing profiles insert...';
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (test_user_id, test_email, 'Test User');
        RAISE NOTICE '✓ Profiles insert SUCCESS';
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS 
                v_error_message = MESSAGE_TEXT,
                v_error_detail = PG_EXCEPTION_DETAIL,
                v_error_hint = PG_EXCEPTION_HINT,
                v_error_context = PG_EXCEPTION_CONTEXT;
            RAISE WARNING '✗ Profiles insert FAILED';
            RAISE WARNING 'Message: %', v_error_message;
            RAISE WARNING 'Detail: %', v_error_detail;
            RAISE WARNING 'Hint: %', v_error_hint;
            RAISE WARNING 'SQLSTATE: %', SQLSTATE;
            RAISE WARNING 'Context: %', v_error_context;
    END;
    
    -- Test usage_tracking insert
    BEGIN
        RAISE NOTICE 'Step 2: Testing usage_tracking insert...';
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
                v_error_message = MESSAGE_TEXT,
                v_error_detail = PG_EXCEPTION_DETAIL,
                v_error_hint = PG_EXCEPTION_HINT,
                v_error_context = PG_EXCEPTION_CONTEXT;
            RAISE WARNING '✗ Usage tracking insert FAILED';
            RAISE WARNING 'Message: %', v_error_message;
            RAISE WARNING 'Detail: %', v_error_detail;
            RAISE WARNING 'Hint: %', v_error_hint;
            RAISE WARNING 'SQLSTATE: %', SQLSTATE;
            RAISE WARNING 'Context: %', v_error_context;
    END;
    
    -- Clean up
    DELETE FROM public.usage_tracking WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE '=== TEST COMPLETE ===';
END $$;

-- Step 5: Check the actual trigger function code
SELECT 
    'Current trigger function' as check_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- Step 6: Check trigger status
SELECT 
    'Trigger status' as check_name,
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
AND t.tgname = 'on_auth_user_created';

-- Step 7: Check for any other triggers on auth.users that might be failing
SELECT 
    'All auth.users triggers' as check_name,
    t.tgname as trigger_name,
    CASE 
        WHEN t.tgenabled::text = 'O' THEN 'ENABLED'
        WHEN t.tgenabled::text = 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status,
    p.proname as function_name,
    n.nspname as function_schema
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE t.tgrelid = 'auth.users'::regclass
ORDER BY t.tgname;
