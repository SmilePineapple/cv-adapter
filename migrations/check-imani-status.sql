-- Quick check: What's Imani's current status?

-- 1. Check usage_tracking
SELECT 
  'usage_tracking' as table_name,
  user_id,
  subscription_tier,
  plan_type,
  max_lifetime_generations
FROM usage_tracking ut
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'imanirenee@hotmail.com'
);

-- 2. Check subscriptions table
SELECT 
  'subscriptions' as table_name,
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  current_period_end
FROM subscriptions s
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'imanirenee@hotmail.com'
);

-- 3. Check if she exists in subscriptions at all
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM subscriptions s
      JOIN auth.users u ON s.user_id = u.id
      WHERE u.email = 'imanirenee@hotmail.com'
    ) THEN 'Has subscription record'
    ELSE 'NO subscription record - this is the problem!'
  END as diagnosis;
