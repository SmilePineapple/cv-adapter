-- Fix free users to have 2 generations instead of 1
-- This fixes the bug where "limit reached" email was sent on 1st generation

-- Update all free users who have max_lifetime_generations = 1 to have 2
UPDATE usage_tracking
SET 
  max_lifetime_generations = 2,
  updated_at = NOW()
WHERE 
  plan_type = 'free' 
  AND subscription_tier = 'free'
  AND max_lifetime_generations = 1;

-- Verify the update
SELECT 
  COUNT(*) as updated_users,
  'Free users updated from 1 to 2 generations' as message
FROM usage_tracking
WHERE 
  plan_type = 'free' 
  AND subscription_tier = 'free'
  AND max_lifetime_generations = 2;

-- Show current distribution
SELECT 
  plan_type,
  subscription_tier,
  max_lifetime_generations,
  COUNT(*) as user_count
FROM usage_tracking
GROUP BY plan_type, subscription_tier, max_lifetime_generations
ORDER BY plan_type, subscription_tier, max_lifetime_generations;
