-- ============================================
-- MANUALLY UPGRADE USER TO PRO (FREE TESTING)
-- ============================================

-- Step 1: Find the user by email
-- Replace 'tester@example.com' with actual email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'tester@example.com';

-- Step 2: Copy the user ID from above, then run this:
-- Replace [USER_ID] with the actual ID from Step 1
INSERT INTO subscriptions (
  user_id,
  status,
  plan,
  stripe_customer_id,
  stripe_subscription_id,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
) VALUES (
  '[USER_ID]',  -- Replace with actual user ID
  'active',
  'pro',
  'test_customer_manual',
  'test_sub_manual',
  NOW(),
  NOW() + INTERVAL '1 year',  -- Valid for 1 year
  false,
  NOW(),
  NOW()
)
ON CONFLICT (user_id) 
DO UPDATE SET
  status = 'active',
  plan = 'pro',
  current_period_end = NOW() + INTERVAL '1 year',
  cancel_at_period_end = false,
  updated_at = NOW();

-- Step 3: Verify the upgrade
SELECT 
  u.email,
  s.plan,
  s.status,
  s.current_period_end
FROM auth.users u
JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'tester@example.com';

-- ============================================
-- QUICK ONE-LINER (if you know the email)
-- ============================================
-- Just replace the email and run this:

WITH user_info AS (
  SELECT id FROM auth.users WHERE email = 'tester@example.com'
)
INSERT INTO subscriptions (
  user_id, status, plan, 
  stripe_customer_id, stripe_subscription_id,
  current_period_start, current_period_end, 
  cancel_at_period_end
)
SELECT 
  id, 'active', 'pro',
  'test_customer_manual', 'test_sub_manual',
  NOW(), NOW() + INTERVAL '1 year',
  false
FROM user_info
ON CONFLICT (user_id) 
DO UPDATE SET
  status = 'active',
  plan = 'pro',
  current_period_end = NOW() + INTERVAL '1 year',
  cancel_at_period_end = false;

-- ============================================
-- TO DOWNGRADE BACK TO FREE
-- ============================================
UPDATE subscriptions
SET 
  status = 'canceled',
  plan = 'free',
  cancel_at_period_end = true,
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'tester@example.com'
);
