-- Manual upgrade script for your account
-- Run this in Supabase SQL Editor to upgrade yourself to Pro

-- 1. Find your user ID (replace with your email)
SELECT id, email FROM auth.users WHERE email = 'jakedalerourke@gmail.com';

-- 2. Upgrade to Pro (replace YOUR_USER_ID with the ID from step 1)
UPDATE usage_tracking
SET plan_type = 'pro',
    max_lifetime_generations = 100,
    updated_at = NOW()
WHERE user_id = 'YOUR_USER_ID';

-- 3. Create a purchase record (replace YOUR_USER_ID)
INSERT INTO purchases (user_id, stripe_customer_id, payment_intent_id, status, amount_paid, currency, purchased_at, created_at, updated_at)
VALUES (
  'YOUR_USER_ID',
  'manual_upgrade',
  'manual_' || gen_random_uuid()::text,
  'completed',
  500,
  'gbp',
  NOW(),
  NOW(),
  NOW()
);

-- 4. Verify the upgrade
SELECT 
  ut.user_id,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  p.status,
  p.amount_paid
FROM usage_tracking ut
LEFT JOIN purchases p ON p.user_id = ut.user_id
WHERE ut.user_id = 'YOUR_USER_ID';
