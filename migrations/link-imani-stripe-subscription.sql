-- Link Imani's manual upgrade to her actual Stripe subscription
-- She paid via Stripe but webhook failed, so we manually upgraded her
-- Now we need to link her usage_tracking to her Stripe subscription

-- First, let's see what we have for Imani
SELECT 
  u.id as user_id,
  u.email,
  ut.subscription_tier,
  ut.plan_type,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status as subscription_status
FROM auth.users u
LEFT JOIN usage_tracking ut ON u.id = ut.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'imanirenee@hotmail.com';

-- If she has a Stripe subscription but it's not showing as active, we need to:
-- 1. Check Stripe Dashboard for her subscription details
-- 2. Get her stripe_customer_id and stripe_subscription_id
-- 3. Insert/update the subscriptions table

-- IMPORTANT: Before running the INSERT below, you need to:
-- 1. Go to Stripe Dashboard → Customers
-- 2. Search for: imanirenee@hotmail.com
-- 3. Copy her Customer ID (starts with cus_)
-- 4. Copy her Subscription ID (starts with sub_)
-- 5. Replace the placeholders below with actual values

-- Example INSERT (replace with actual Stripe IDs):
/*
INSERT INTO subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'cus_XXXXXXXXXX',  -- Replace with actual Stripe Customer ID
  'sub_XXXXXXXXXX',  -- Replace with actual Stripe Subscription ID
  'active',
  NOW() - INTERVAL '1 day',  -- Adjust to actual subscription start
  NOW() + INTERVAL '29 days',  -- Adjust to actual period end
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'imanirenee@hotmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  stripe_customer_id = EXCLUDED.stripe_customer_id,
  stripe_subscription_id = EXCLUDED.stripe_subscription_id,
  status = EXCLUDED.status,
  current_period_start = EXCLUDED.current_period_start,
  current_period_end = EXCLUDED.current_period_end,
  updated_at = NOW();
*/

-- Verify the link
SELECT 
  u.email,
  ut.subscription_tier,
  s.stripe_subscription_id,
  s.status,
  CASE 
    WHEN s.stripe_subscription_id IS NOT NULL AND s.status = 'active' 
    THEN 'PAYING' 
    ELSE 'FREE' 
  END as customer_type
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'imanirenee@hotmail.com';
