-- Fix for free users who have more than 1 generation
-- This ensures all free users have max_lifetime_generations = 1

-- Step 1: Ensure columns exist
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS lifetime_generation_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS max_lifetime_generations INTEGER NOT NULL DEFAULT 1;

-- Step 2: Fix any free users who don't have max_lifetime_generations set
UPDATE usage_tracking
SET max_lifetime_generations = 1
WHERE plan_type = 'free' 
AND (max_lifetime_generations IS NULL OR max_lifetime_generations != 1);

-- Step 3: Ensure lifetime_generation_count is synced with generation_count for users who don't have it set
UPDATE usage_tracking
SET lifetime_generation_count = generation_count
WHERE lifetime_generation_count = 0 AND generation_count > 0;

-- Step 4: Check the specific user mentioned (josegre1987@gmail.com)
SELECT 
  ut.user_id,
  p.email,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  ut.generation_count,
  COUNT(g.id) as actual_generations
FROM usage_tracking ut
JOIN profiles p ON p.id = ut.user_id
LEFT JOIN generations g ON g.user_id = ut.user_id
WHERE p.email = 'josegre1987@gmail.com'
GROUP BY ut.user_id, p.email, ut.plan_type, ut.lifetime_generation_count, ut.max_lifetime_generations, ut.generation_count;

-- Step 5: Show all free users with their generation counts
SELECT 
  ut.user_id,
  p.email,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  COUNT(g.id) as actual_generations
FROM usage_tracking ut
JOIN profiles p ON p.id = ut.user_id
LEFT JOIN generations g ON g.user_id = ut.user_id
WHERE ut.plan_type = 'free'
GROUP BY ut.user_id, p.email, ut.plan_type, ut.lifetime_generation_count, ut.max_lifetime_generations
ORDER BY actual_generations DESC;
