-- FINAL FIX: Ensure ALL connections use the new constraint

-- The issue might be that some database connections are cached
-- This script will:
-- 1. Verify current state
-- 2. Force refresh all constraints
-- 3. Verify again

-- ============================================
-- STEP 1: Current State
-- ============================================
SELECT '=== CURRENT STATE ===' as step;

SELECT 
  conname as constraint_name,
  CASE confdeltype
    WHEN 'c' THEN '❌ CASCADE (WRONG!)'
    WHEN 'n' THEN '✅ SET NULL (CORRECT!)'
    ELSE confdeltype::text
  END as delete_action
FROM pg_constraint
WHERE conrelid = 'generations'::regclass
  AND contype = 'f'
  AND confrelid = 'cvs'::regclass;

-- ============================================
-- STEP 2: Drop and Recreate (Force Refresh)
-- ============================================
SELECT '=== FORCING CONSTRAINT REFRESH ===' as step;

-- Drop the constraint
ALTER TABLE generations 
DROP CONSTRAINT IF EXISTS generations_cv_id_fkey CASCADE;

-- Ensure cv_id is nullable
ALTER TABLE generations 
ALTER COLUMN cv_id DROP NOT NULL;

-- Recreate with SET NULL
ALTER TABLE generations 
ADD CONSTRAINT generations_cv_id_fkey 
FOREIGN KEY (cv_id) 
REFERENCES cvs(id) 
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ============================================
-- STEP 3: Verify New State
-- ============================================
SELECT '=== VERIFICATION ===' as step;

SELECT 
  conname as constraint_name,
  CASE confdeltype
    WHEN 'c' THEN '❌ CASCADE (STILL WRONG!)'
    WHEN 'n' THEN '✅ SET NULL (FIXED!)'
    ELSE confdeltype::text
  END as delete_action,
  CASE 
    WHEN confdeltype = 'n' THEN '✅ Generations will be preserved when CV is deleted'
    ELSE '❌ Generations will still be deleted!'
  END as result
FROM pg_constraint
WHERE conrelid = 'generations'::regclass
  AND contype = 'f'
  AND confrelid = 'cvs'::regclass;

-- ============================================
-- STEP 4: Kill All Cached Connections (Optional - be careful!)
-- ============================================
-- Uncomment this if you want to force all connections to refresh
-- WARNING: This will disconnect all active database connections!
-- Only run this if you're sure no critical operations are running

-- SELECT '=== KILLING CACHED CONNECTIONS ===' as step;
-- 
-- SELECT pg_terminate_backend(pid)
-- FROM pg_stat_activity
-- WHERE datname = current_database()
--   AND pid <> pg_backend_pid()
--   AND application_name LIKE '%supabase%';

-- ============================================
-- FINAL MESSAGE
-- ============================================
SELECT '✅ CONSTRAINT REFRESHED - Test by deleting a CV now!' as final_message;
