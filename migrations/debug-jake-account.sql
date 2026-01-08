-- Debug: Check Jake's account status in all tables

-- 1. Check auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'jakedalerourke@gmail.com';

-- 2. Check usage_tracking
SELECT 
  user_id,
  subscription_tier,
  generation_count,
  job_scrapes_used,
  interview_preps_used,
  updated_at
FROM usage_tracking
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com');

-- 3. Check if subscriptions table exists and has data
SELECT 
  user_id,
  status,
  plan,
  current_period_end
FROM subscriptions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com');

-- 4. Check purchases table
SELECT 
  user_id,
  status,
  amount_paid,
  created_at
FROM purchases
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com');
