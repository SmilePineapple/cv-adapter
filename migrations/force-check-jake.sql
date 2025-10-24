-- Force check Jake's actual data
SELECT 
  u.id as user_id,
  u.email,
  ut.plan_type,
  ut.subscription_tier,
  ut.generation_count,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations
FROM auth.users u
LEFT JOIN usage_tracking ut ON u.id = ut.user_id
WHERE u.email = 'jakedalerourke@gmail.com';

-- If no row in usage_tracking, we need to INSERT not UPDATE!
-- Check if usage_tracking row exists:
SELECT COUNT(*) as row_count
FROM usage_tracking
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jakedalerourke@gmail.com');
