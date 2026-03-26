-- Calculate OpenAI Costs from Database
-- Run this in Supabase SQL Editor to estimate costs

-- 1. Count total generations since Oct 1, 2025
SELECT 
  COUNT(*) as total_generations,
  COUNT(*) * 2000 as estimated_input_tokens,
  COUNT(*) * 1500 as estimated_output_tokens,
  -- Cost calculation (GPT-4o-mini pricing)
  (COUNT(*) * 2000 * 0.15 / 1000000) as input_cost_usd,
  (COUNT(*) * 1500 * 0.60 / 1000000) as output_cost_usd,
  (COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000) as total_cost_usd,
  -- Convert to GBP (approximate rate: 1 USD = 0.79 GBP)
  ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 as total_cost_gbp
FROM cv_generations
WHERE created_at >= '2025-10-01'::timestamp;

-- 2. Breakdown by month
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as generations,
  COUNT(*) * 2000 as input_tokens,
  COUNT(*) * 1500 as output_tokens,
  ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) as cost_usd,
  ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 as cost_gbp
FROM cv_generations
WHERE created_at >= '2025-10-01'::timestamp
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 3. Breakdown by day (last 30 days)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as generations,
  ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 as cost_gbp
FROM cv_generations
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 4. Total revenue vs cost analysis
WITH costs AS (
  SELECT 
    ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 as total_cost_gbp
  FROM cv_generations
  WHERE created_at >= '2025-10-01'::timestamp
)
SELECT 
  64.51 as total_revenue_gbp,
  total_cost_gbp,
  64.51 - total_cost_gbp as profit_gbp,
  ((64.51 - total_cost_gbp) / 64.51 * 100)::numeric(10,2) as profit_margin_percent
FROM costs;

-- 5. Average cost per generation
SELECT 
  COUNT(*) as total_generations,
  ((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 as total_cost_gbp,
  (((COUNT(*) * 2000 * 0.15 / 1000000) + (COUNT(*) * 1500 * 0.60 / 1000000)) * 0.79 / COUNT(*))::numeric(10,4) as cost_per_generation_gbp
FROM cv_generations
WHERE created_at >= '2025-10-01'::timestamp;

-- Notes:
-- - These are ESTIMATES based on average token usage
-- - Actual costs may vary based on:
--   * Actual token usage per generation
--   * Model used (GPT-4o-mini vs GPT-4o)
--   * Failed generations (still cost tokens)
--   * Cover letters, interview prep, etc.
-- - For exact costs, check OpenAI dashboard: https://platform.openai.com/usage
