-- Check your subscription data
-- Run this in Supabase SQL Editor

SELECT 
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  price_id,
  cancel_at_period_end,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
FROM public.subscriptions
WHERE user_id = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid;

-- Also check if cancel_at_period_end column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'subscriptions'
ORDER BY ordinal_position;
