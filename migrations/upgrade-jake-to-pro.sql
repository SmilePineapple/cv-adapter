-- Upgrade jakedalerourke@gmail.com to Pro for testing
UPDATE usage_tracking
SET 
  subscription_tier = 'pro_monthly',
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com'
);

-- Verify the update
SELECT 
  u.email,
  ut.subscription_tier,
  ut.generation_count,
  ut.job_scrapes_used,
  ut.interview_preps_used
FROM auth.users u
JOIN usage_tracking ut ON u.id = ut.user_id
WHERE u.email = 'jakedalerourke@gmail.com';
