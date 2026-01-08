-- Increase free tier from 1 to 2 generations
-- Run this in Supabase SQL Editor

-- Update the default for new users
ALTER TABLE usage_tracking 
ALTER COLUMN max_lifetime_generations SET DEFAULT 2;

-- Update existing free users to have 2 generations
UPDATE usage_tracking
SET max_lifetime_generations = 2
WHERE (plan_type = 'free' OR plan_type IS NULL)
  AND max_lifetime_generations < 2;

-- Verify the update
SELECT 
  plan_type,
  COUNT(*) as user_count,
  AVG(max_lifetime_generations) as avg_max_gens,
  AVG(lifetime_generation_count) as avg_used
FROM usage_tracking
GROUP BY plan_type
ORDER BY plan_type;
