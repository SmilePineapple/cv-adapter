-- Simple test to verify the fix is working

-- 1. Show current constraint status
SELECT 
  '1. Current Constraint Status' as test,
  conname as constraint_name,
  CASE confdeltype
    WHEN 'c' THEN '❌ CASCADE - Generations WILL be deleted'
    WHEN 'n' THEN '✅ SET NULL - Generations will be preserved'
    ELSE confdeltype::text
  END as status
FROM pg_constraint
WHERE conrelid = 'generations'::regclass
  AND contype = 'f'
  AND confrelid = 'cvs'::regclass;

-- 2. Show orphaned generations (proof SET NULL is working)
SELECT 
  '2. Orphaned Generations (cv_id is NULL)' as test,
  COUNT(*) as count,
  'These were preserved when their CV was deleted' as explanation
FROM generations
WHERE cv_id IS NULL;

-- 3. Show a sample CV with its generations
SELECT 
  '3. Sample CV with Generations' as test,
  c.id as cv_id,
  c.created_at as cv_created,
  COUNT(g.id) as generation_count
FROM cvs c
LEFT JOIN generations g ON g.cv_id = c.id
GROUP BY c.id, c.created_at
HAVING COUNT(g.id) > 0
ORDER BY c.created_at DESC
LIMIT 1;

-- 4. Instructions for manual test
SELECT 
  '4. MANUAL TEST INSTRUCTIONS' as test,
  'Upload a test CV, generate a version, then delete the CV' as step_1,
  'Check if the generation still exists in the Generations tab' as step_2,
  'If generation exists with NULL cv_id = SUCCESS!' as expected_result;
