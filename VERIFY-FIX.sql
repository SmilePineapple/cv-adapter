-- Run this to verify the CASCADE delete fix actually worked

-- Check 1: Verify the constraint exists and has SET NULL
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  rc.delete_rule,
  CASE 
    WHEN rc.delete_rule = 'SET NULL' THEN '✅ CORRECT - Generations will be preserved'
    WHEN rc.delete_rule = 'CASCADE' THEN '❌ WRONG - Generations will still be deleted!'
    ELSE '⚠️ UNEXPECTED - Check manually'
  END as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc 
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'generations' 
  AND kcu.column_name = 'cv_id';

-- Check 2: Verify cv_id is nullable
SELECT 
  column_name,
  is_nullable,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ CORRECT - cv_id can be NULL'
    WHEN is_nullable = 'NO' THEN '❌ WRONG - cv_id cannot be NULL (migration failed!)'
  END as status
FROM information_schema.columns
WHERE table_name = 'generations' 
  AND column_name = 'cv_id';

-- Check 3: Test with actual data (safe - doesn't delete anything)
-- This shows how many generations would be affected
SELECT 
  COUNT(*) as total_generations,
  COUNT(cv_id) as generations_with_cv,
  COUNT(*) - COUNT(cv_id) as orphaned_generations
FROM generations;
