-- ============================================
-- MANUAL UPGRADE: emukamba@outlook.com
-- ============================================
-- User paid for monthly subscription (£2.99/month)
-- Webhook failed with "Invalid subscription: missing or invalid current_period_end"
-- Manually upgrading to Pro monthly
-- Date: 2026-01-16
-- ============================================

-- Step 1: Get user ID
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'emukamba@outlook.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: emukamba@outlook.com';
  END IF;
  
  RAISE NOTICE 'User ID: %', v_user_id;
END $$;

-- Step 2: Update usage_tracking to Pro monthly
UPDATE usage_tracking
SET 
  plan_type = 'pro',
  subscription_tier = 'pro_monthly',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 month', -- Monthly subscription
  max_lifetime_generations = 999999, -- Unlimited generations
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'emukamba@outlook.com'
);

-- Step 3: Create purchase record for tracking
INSERT INTO purchases (
  user_id,
  amount,
  currency,
  status,
  payment_method,
  created_at
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'emukamba@outlook.com'),
  2.99,
  'gbp',
  'completed',
  'stripe_subscription',
  NOW()
);

-- Step 4: Verify the upgrade
SELECT 
  u.email,
  u.created_at as user_created,
  ut.plan_type,
  ut.subscription_tier,
  ut.subscription_start_date,
  ut.subscription_end_date,
  ut.max_lifetime_generations,
  ut.lifetime_generation_count
FROM auth.users u
JOIN usage_tracking ut ON ut.user_id = u.id
WHERE u.email = 'emukamba@outlook.com';

-- Expected result:
-- plan_type: 'pro'
-- subscription_tier: 'pro_monthly'
-- subscription_end_date: 1 month from now
-- max_lifetime_generations: 999999

-- ============================================
-- NOTES:
-- ============================================
-- - User signed up at 11:42 on Jan 16, 2026
-- - Checkout completed at 11:49
-- - Webhook failed twice (11:45:44 and 11:46:01)
-- - Error: "Invalid subscription: missing or invalid current_period_end"
-- - This is a Stripe API timing issue - subscription not fully created when webhook fired
-- - Webhook fix deployed to handle this in future
-- ============================================
