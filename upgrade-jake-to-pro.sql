-- Upgrade jake.rourke@btinternet.com to Pro
-- Run this in Supabase SQL Editor

-- First, get the user_id
-- SELECT id FROM auth.users WHERE email = 'jake.rourke@btinternet.com';

-- Update usage_tracking to Pro
UPDATE usage_tracking
SET 
  subscription_tier = 'pro_monthly',
  plan_type = 'pro',
  max_lifetime_generations = 999999,
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'jake.rourke@btinternet.com'
);

-- Verify the update
SELECT 
  u.email,
  ut.subscription_tier,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
WHERE u.email = 'jake.rourke@btinternet.com';
