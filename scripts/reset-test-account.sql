-- Reset test account: jake.rourke@btinternet.com
-- This script completely resets the account to simulate a new user signup

-- First, get the user ID
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Find the user ID for jake.rourke@btinternet.com
    SELECT id INTO test_user_id
    FROM auth.users
    WHERE email = 'jake.rourke@btinternet.com';

    IF test_user_id IS NOT NULL THEN
        -- Delete all user data in reverse dependency order
        
        -- 1. Delete generations
        DELETE FROM generations WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted generations for user %', test_user_id;
        
        -- 2. Delete cover letters
        DELETE FROM cover_letters WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted cover letters for user %', test_user_id;
        
        -- 3. Delete interview preps
        DELETE FROM interview_preps WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted interview preps for user %', test_user_id;
        
        -- 4. Delete CVs (this will also delete from storage)
        DELETE FROM cvs WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted CVs for user %', test_user_id;
        
        -- 5. Delete activity logs
        DELETE FROM activity_logs WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted activity logs for user %', test_user_id;
        
        -- 6. Reset usage tracking to fresh state
        UPDATE usage_tracking
        SET 
            plan_type = 'free',
            current_generations = 0,
            max_lifetime_generations = 1,
            last_generation_date = NULL,
            updated_at = NOW()
        WHERE user_id = test_user_id;
        RAISE NOTICE 'Reset usage tracking for user %', test_user_id;
        
        -- 7. Delete subscriptions
        DELETE FROM subscriptions WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted subscriptions for user %', test_user_id;
        
        -- 8. Delete purchases
        DELETE FROM purchases WHERE user_id = test_user_id;
        RAISE NOTICE 'Deleted purchases for user %', test_user_id;
        
        -- 9. Reset profile
        UPDATE profiles
        SET 
            onboarding_completed = FALSE,
            updated_at = NOW()
        WHERE id = test_user_id;
        RAISE NOTICE 'Reset profile onboarding for user %', test_user_id;
        
        RAISE NOTICE '✅ Account reset complete for jake.rourke@btinternet.com';
        RAISE NOTICE 'User can now test the complete onboarding flow as a new user';
    ELSE
        RAISE NOTICE '❌ User jake.rourke@btinternet.com not found';
    END IF;
END $$;

-- Verify the reset
SELECT 
    u.email,
    p.onboarding_completed,
    ut.plan_type,
    ut.current_generations,
    ut.max_lifetime_generations,
    (SELECT COUNT(*) FROM cvs WHERE user_id = u.id) as cv_count,
    (SELECT COUNT(*) FROM generations WHERE user_id = u.id) as generation_count
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN usage_tracking ut ON ut.user_id = u.id
WHERE u.email = 'jake.rourke@btinternet.com';
