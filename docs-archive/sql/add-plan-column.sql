-- Add plan column to subscriptions table
-- Run this in Supabase SQL Editor

-- Add plan column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'plan'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
  END IF;
END $$;

-- Add cancel_at_period_end column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'cancel_at_period_end'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
AND column_name IN ('plan', 'cancel_at_period_end')
ORDER BY column_name;

SELECT 'Plan and cancel_at_period_end columns added successfully' as status;
