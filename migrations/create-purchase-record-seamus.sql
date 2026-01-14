-- ============================================
-- CREATE PURCHASE RECORD: Seamus Robertson
-- ============================================
-- User paid £2.99 for Pro but no purchase record was created
-- Email: seamusrobertson5@gmail.com
-- This allows the admin dashboard to count him as a paying customer

-- Insert purchase record for Seamus
INSERT INTO purchases (
  user_id,
  amount_paid,
  currency,
  status,
  plan,
  created_at,
  updated_at
)
SELECT 
  id as user_id,
  299 as amount_paid, -- £2.99 in pence
  'gbp' as currency,
  'completed' as status,
  'pro_lifetime' as plan,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'seamusrobertson5@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  amount_paid = 299,
  status = 'completed',
  plan = 'pro_lifetime',
  updated_at = NOW();

-- Verify the purchase record
SELECT 
  u.email,
  p.amount_paid,
  p.currency,
  p.status,
  p.plan,
  p.created_at
FROM auth.users u
JOIN purchases p ON p.user_id = u.id
WHERE u.email = 'seamusrobertson5@gmail.com';

-- Expected result:
-- amount_paid: 299 (£2.99)
-- status: 'completed'
-- plan: 'pro_lifetime'
