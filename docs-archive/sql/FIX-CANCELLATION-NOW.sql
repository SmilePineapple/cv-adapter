-- URGENT: Run this to fix cancellation
-- Copy and paste into Supabase SQL Editor and run

-- 1. Add cancel_at_period_end column
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- 2. Verify it was added
SELECT 'Column added successfully!' as status;

-- 3. Show your current subscription
SELECT 
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  price_id,
  cancel_at_period_end,
  current_period_end
FROM public.subscriptions
WHERE user_id = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid;
