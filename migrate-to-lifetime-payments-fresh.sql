-- Migration: Switch to lifetime one-time payments (for fresh install without subscriptions table)
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns to usage_tracking for lifetime tracking
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS lifetime_generation_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS max_lifetime_generations INTEGER NOT NULL DEFAULT 1;

-- Step 2: Set existing users' lifetime counts from their current generation_count
UPDATE usage_tracking 
SET lifetime_generation_count = generation_count,
    plan_type = 'free',  -- All existing users start as free
    max_lifetime_generations = 1;

-- Step 3: Create purchases table (since subscriptions doesn't exist)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  amount_paid INTEGER, -- in cents (e.g., 500 for £5.00)
  currency TEXT DEFAULT 'gbp',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create indexes for purchases table
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON purchases(status);
CREATE INDEX IF NOT EXISTS purchases_stripe_customer_id_idx ON purchases(stripe_customer_id);

-- Step 5: Enable RLS on purchases table
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for purchases table
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;

CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 7: Drop the monthly reset function if it exists (no longer needed)
DROP FUNCTION IF EXISTS reset_monthly_usage();

-- Step 8: Create helper function to check if user can generate
CREATE OR REPLACE FUNCTION can_user_generate(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_type TEXT;
  v_lifetime_count INTEGER;
  v_max_generations INTEGER;
BEGIN
  SELECT plan_type, lifetime_generation_count, max_lifetime_generations
  INTO v_plan_type, v_lifetime_count, v_max_generations
  FROM usage_tracking
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  RETURN v_lifetime_count < v_max_generations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create helper function to upgrade user to pro
CREATE OR REPLACE FUNCTION upgrade_user_to_pro(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE usage_tracking
  SET plan_type = 'pro',
      max_lifetime_generations = 100,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Verify the migration
SELECT 
  'Migration Complete!' as status,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE plan_type = 'free') as free_users,
  COUNT(*) FILTER (WHERE plan_type = 'pro') as pro_users
FROM usage_tracking;

-- Step 11: Show sample data
SELECT 
  user_id,
  plan_type,
  lifetime_generation_count,
  max_lifetime_generations,
  generation_count as old_monthly_count
FROM usage_tracking
LIMIT 5;
