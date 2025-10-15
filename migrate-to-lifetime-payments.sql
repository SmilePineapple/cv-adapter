-- Migration: Switch from monthly subscription to lifetime one-time payments
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns to usage_tracking for lifetime tracking
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS lifetime_generation_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS max_lifetime_generations INTEGER NOT NULL DEFAULT 1;

-- Step 2: Migrate existing data
-- Copy current generation_count to lifetime_generation_count for all users
UPDATE usage_tracking 
SET lifetime_generation_count = generation_count,
    plan_type = CASE 
      WHEN EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE subscriptions.user_id = usage_tracking.user_id 
        AND subscriptions.status = 'active'
      ) THEN 'pro'
      ELSE 'free'
    END,
    max_lifetime_generations = CASE 
      WHEN EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE subscriptions.user_id = usage_tracking.user_id 
        AND subscriptions.status = 'active'
      ) THEN 100
      ELSE 1
    END;

-- Step 3: Rename subscriptions table to purchases (since it's now one-time payments)
ALTER TABLE subscriptions RENAME TO purchases;

-- Step 4: Update purchases table structure for one-time payments
-- First, change the status column from enum to TEXT to avoid enum conflicts
ALTER TABLE purchases 
ALTER COLUMN status TYPE TEXT;

-- Now drop the old subscription-specific columns and add new payment columns
ALTER TABLE purchases 
DROP COLUMN IF EXISTS current_period_start,
DROP COLUMN IF EXISTS current_period_end,
DROP COLUMN IF EXISTS cancel_at_period_end,
DROP COLUMN IF EXISTS price_id,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS amount_paid INTEGER, -- in cents
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'gbp',
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMPTZ DEFAULT NOW();

-- Step 5: Update existing subscription statuses to payment statuses BEFORE adding constraint
-- Map old subscription statuses to new payment statuses
UPDATE purchases 
SET status = CASE 
    WHEN status IN ('active', 'trialing') THEN 'completed'
    WHEN status = 'incomplete' THEN 'pending'
    WHEN status IN ('canceled', 'past_due', 'unpaid') THEN 'failed'
    ELSE 'completed' -- Default to completed for any other status
  END,
  amount_paid = 500, -- £5 in pence
  currency = 'gbp',
  purchased_at = COALESCE(created_at, NOW());

-- Now add the constraint after all statuses are valid
ALTER TABLE purchases 
ADD CONSTRAINT purchases_status_check 
CHECK (status IN ('completed', 'pending', 'failed', 'refunded'));

-- Step 6: Drop the monthly reset function (no longer needed)
DROP FUNCTION IF EXISTS reset_monthly_usage();

-- Step 7: Update RLS policies for purchases table
DROP POLICY IF EXISTS "Users can view own subscription" ON purchases;
DROP POLICY IF EXISTS "Users can insert own subscription" ON purchases;
DROP POLICY IF EXISTS "Users can update own subscription" ON purchases;

CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own purchases" ON purchases FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_status ON purchases(user_id, status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_plan_type ON usage_tracking(plan_type);

-- Step 9: Create helper function to check if user can generate
CREATE OR REPLACE FUNCTION can_user_generate(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_usage usage_tracking%ROWTYPE;
BEGIN
  SELECT * INTO v_usage
  FROM usage_tracking
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  RETURN v_usage.lifetime_generation_count < v_usage.max_lifetime_generations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create function to upgrade user to pro
CREATE OR REPLACE FUNCTION upgrade_user_to_pro(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE usage_tracking
  SET plan_type = 'pro',
      max_lifetime_generations = 100,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verification queries (run these to check migration)
-- Check usage_tracking structure
SELECT 
  user_id,
  generation_count as old_monthly_count,
  lifetime_generation_count,
  plan_type,
  max_lifetime_generations
FROM usage_tracking
LIMIT 5;

-- Check purchases structure
SELECT 
  user_id,
  status,
  amount_paid,
  currency,
  purchased_at
FROM purchases
LIMIT 5;

-- Summary
SELECT 
  plan_type,
  COUNT(*) as user_count,
  AVG(lifetime_generation_count) as avg_generations_used
FROM usage_tracking
GROUP BY plan_type;
