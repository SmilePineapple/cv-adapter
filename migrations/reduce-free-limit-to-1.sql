-- Migration: Reduce free user generation limit from 2 to 1
-- Date: December 8, 2025
-- Purpose: Increase conversion rate by creating urgency with only 1 free generation

-- Step 1: Update default value for new users
ALTER TABLE usage_tracking 
ALTER COLUMN max_lifetime_generations SET DEFAULT 1;

-- Step 2: Update existing free users who still have 2 generations
-- Only update users who:
-- 1. Are on free plan (plan_type = 'free')
-- 2. Currently have max_lifetime_generations = 2
-- 3. Haven't used any generations yet (lifetime_generation_count = 0)
UPDATE usage_tracking
SET max_lifetime_generations = 1
WHERE plan_type = 'free'
  AND max_lifetime_generations = 2
  AND lifetime_generation_count = 0;

-- Step 3: For free users who have already used 1 generation (out of 2)
-- Set their max to 1 so they've now used their only free generation
UPDATE usage_tracking
SET max_lifetime_generations = 1
WHERE plan_type = 'free'
  AND max_lifetime_generations = 2
  AND lifetime_generation_count = 1;

-- Step 4: For free users who have used 2 generations
-- Keep their max at 2 (they already used both, no need to change)
-- No action needed - they're already at limit

-- Verification queries:
-- Check how many users will be affected
SELECT 
  plan_type,
  max_lifetime_generations,
  lifetime_generation_count,
  COUNT(*) as user_count
FROM usage_tracking
WHERE plan_type = 'free'
GROUP BY plan_type, max_lifetime_generations, lifetime_generation_count
ORDER BY max_lifetime_generations, lifetime_generation_count;

-- Expected results after migration:
-- Free users with 0 generations used: max = 1 (can generate 1 more)
-- Free users with 1 generation used: max = 1 (already at limit)
-- Free users with 2 generations used: max = 2 (already at limit)
-- Pro users: unchanged (unlimited)

-- Rollback (if needed):
-- ALTER TABLE usage_tracking ALTER COLUMN max_lifetime_generations SET DEFAULT 2;
-- UPDATE usage_tracking SET max_lifetime_generations = 2 WHERE plan_type = 'free' AND max_lifetime_generations = 1;
