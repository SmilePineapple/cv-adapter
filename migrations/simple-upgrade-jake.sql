-- Simple upgrade using only usage_tracking table (which exists)
-- IMPORTANT: Dashboard checks 'plan_type' column, not 'subscription_tier'!
UPDATE usage_tracking
SET 
  plan_type = 'pro',
  subscription_tier = 'pro_monthly',
  max_lifetime_generations = 999999,
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com'
);

-- Verify
SELECT 
  u.email,
  ut.plan_type,
  ut.subscription_tier,
  ut.generation_count,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  ut.job_scrapes_used,
  ut.interview_preps_used
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
WHERE u.email = 'jakedalerourke@gmail.com';
