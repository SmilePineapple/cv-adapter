-- Update your existing Pro subscription with proper data
-- Run this in Supabase SQL Editor

UPDATE public.subscriptions
SET 
  price_id = 'price_pro',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE user_id = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid;

-- Verify the update
SELECT 
  user_id,
  status,
  price_id,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
FROM public.subscriptions
WHERE user_id = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid;
