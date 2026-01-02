-- Refund Process: Nevin Thomas (nevinthomas2020@ce.ajce.in)
-- Date: December 9, 2025
-- Amount: £49 (Annual Pro)
-- Reason: Product not meeting expectations

-- ============================================
-- STEP 1: Verify user exists and get details
-- ============================================
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.created_at as signup_date,
  ut.subscription_tier,
  ut.plan_type,
  ut.subscription_start_date,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status as stripe_status,
  -- Calculate days since signup
  EXTRACT(DAY FROM NOW() - p.created_at) as days_since_signup
FROM profiles p
JOIN usage_tracking ut ON p.id = ut.user_id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email = 'nevinthomas2020@ce.ajce.in';

-- Expected output: Should show Pro Annual subscription, signed up ~2 days ago

-- ============================================
-- STEP 2: Downgrade to free tier
-- ============================================
-- IMPORTANT: Only run this AFTER issuing refund in Stripe Dashboard!

-- Update usage_tracking
UPDATE usage_tracking
SET 
  subscription_tier = 'free',
  plan_type = 'free',
  max_lifetime_generations = 1,  -- Reset to free tier limit
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'nevinthomas2020@ce.ajce.in'
);

-- Delete from subscriptions table (or set to canceled)
DELETE FROM subscriptions
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'nevinthomas2020@ce.ajce.in'
);

-- Note: Removing Stripe data from subscriptions table

-- ============================================
-- STEP 3: Verify the downgrade
-- ============================================
SELECT 
  p.email,
  p.full_name,
  ut.subscription_tier,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  s.stripe_subscription_id,
  s.stripe_customer_id,
  ut.updated_at
FROM profiles p
JOIN usage_tracking ut ON p.id = ut.user_id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email = 'nevinthomas2020@ce.ajce.in';

-- Expected result:
-- subscription_tier: 'free'
-- plan_type: 'free'
-- max_lifetime_generations: 1
-- stripe_subscription_id: NULL (row deleted from subscriptions)
-- stripe_customer_id: NULL (row deleted from subscriptions)

-- ============================================
-- STEP 4: Check user's existing generations
-- ============================================
-- User should still be able to access their existing CV generations
SELECT 
  g.id,
  g.job_title,
  g.created_at,
  g.cv_id
FROM generations g
JOIN profiles p ON g.user_id = p.id
WHERE p.email = 'nevinthomas2020@ce.ajce.in'
ORDER BY g.created_at DESC;

-- ============================================
-- STEP 5: Log the refund (optional)
-- ============================================
-- If you have a refunds tracking table, insert here
-- Otherwise, just document in support system

-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================
-- [ ] Stripe refund issued (£49.00)
-- [ ] Stripe subscription canceled
-- [ ] This SQL script executed successfully
-- [ ] User downgraded to free tier
-- [ ] User can still access existing generations
-- [ ] Confirmation email sent to customer
-- [ ] No future charges will occur

-- ============================================
-- ROLLBACK (if needed - DO NOT RUN unless mistake)
-- ============================================
-- If you need to undo the downgrade (e.g., customer changes mind):
/*
UPDATE usage_tracking
SET 
  subscription_tier = 'pro_annual',
  subscription_status = 'active',
  stripe_subscription_id = '<original_subscription_id>',
  max_lifetime_generations = 999999,
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'nevinthomas2020@ce.ajce.in'
);
*/
