-- Debug: Check all paying users and their subscription states
-- Expected: 3 paying users (2×£2.99, 1×£9.99)

-- 1. Get all Pro users from usage_tracking (excluding admins)
SELECT 
  'Pro Users in usage_tracking' as check_type,
  u.email,
  ut.subscription_tier,
  ut.plan_type,
  ut.subscription_start_date,
  ut.subscription_end_date,
  CASE 
    WHEN ut.subscription_end_date IS NULL THEN 'Lifetime'
    WHEN ut.subscription_end_date::timestamp > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status
FROM usage_tracking ut
JOIN auth.users u ON ut.user_id = u.id
WHERE ut.subscription_tier IN ('pro_monthly', 'pro_annual')
  AND u.email NOT IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com', 'jake.rourke@btinternet.com')
ORDER BY ut.subscription_start_date DESC;

-- 2. Check subscriptions table for Stripe subscription IDs
SELECT 
  'Subscriptions table' as check_type,
  u.email,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.current_period_end,
  CASE 
    WHEN s.current_period_end IS NULL THEN 'No end date'
    WHEN s.current_period_end::timestamp > NOW() THEN 'Active'
    ELSE 'Expired'
  END as period_status
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email NOT IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com', 'jake.rourke@btinternet.com')
ORDER BY s.created_at DESC;

-- 3. Check purchases table for one-time payments
SELECT 
  'Purchases table' as check_type,
  u.email,
  p.stripe_customer_id,
  p.amount_paid,
  p.currency,
  p.status,
  p.plan,
  p.created_at
FROM purchases p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email NOT IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com', 'jake.rourke@btinternet.com')
ORDER BY p.created_at DESC;

-- 4. Specifically check imanirenee@hotmail.com
SELECT 
  'Imani Renee Status' as check_type,
  u.email,
  ut.subscription_tier,
  ut.subscription_end_date,
  s.stripe_subscription_id,
  s.status as subscription_status,
  s.current_period_end
FROM auth.users u
LEFT JOIN usage_tracking ut ON u.id = ut.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'imanirenee@hotmail.com';
