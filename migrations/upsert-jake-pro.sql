-- UPSERT (INSERT or UPDATE) Jake to Pro
-- This will work whether the row exists or not!

INSERT INTO usage_tracking (
  user_id,
  plan_type,
  subscription_tier,
  generation_count,
  lifetime_generation_count,
  max_lifetime_generations,
  current_month,
  job_scrapes_used,
  interview_preps_used,
  created_at,
  updated_at
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com'),
  'pro',
  'pro_monthly',
  0,
  0,
  999999,
  DATE_TRUNC('month', NOW())::date,
  0,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (user_id) 
DO UPDATE SET
  plan_type = 'pro',
  subscription_tier = 'pro_monthly',
  max_lifetime_generations = 999999,
  updated_at = NOW();

-- Verify it worked
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
