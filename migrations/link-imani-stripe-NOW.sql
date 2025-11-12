-- Link Imani's Stripe subscription to her account
-- Customer ID: cus_TPDvWedBGniDgS
-- Subscription ID: sub_1SSPWCCmLcsbnd6z2P9L8yyL
-- Subscribed: Nov 11, 2025 at 9:54 PM
-- Next billing: Dec 11, 2025

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
  'cus_TPDvWedBGniDgS',
  'sub_1SSPWCCmLcsbnd6z2P9L8yyL',
  'active',
  '2025-11-11 21:54:00'::timestamptz,  -- Nov 11, 9:54 PM
  '2025-12-11 21:54:00'::timestamptz,  -- Dec 11, 9:54 PM (next billing)
  '2025-11-11 21:54:00'::timestamptz,
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

-- Verify it worked
SELECT 
  u.email,
  ut.subscription_tier,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status,
  s.current_period_end,
  CASE 
    WHEN s.stripe_subscription_id IS NOT NULL AND s.status = 'active' 
    THEN '💰 PAYING CUSTOMER' 
    ELSE '🎁 FREE' 
  END as customer_type
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'imanirenee@hotmail.com';
