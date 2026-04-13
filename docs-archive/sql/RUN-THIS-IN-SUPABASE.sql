-- 🚨 CRITICAL: RUN THIS IN SUPABASE SQL EDITOR NOW! 🚨
-- This fixes the CASCADE delete issue where generations get deleted with CVs

-- ============================================
-- STEP-BY-STEP INSTRUCTIONS:
-- ============================================
-- 1. Go to your Supabase project
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this ENTIRE file
-- 5. Click "Run" button
-- 6. You should see: "Generation CASCADE delete fixed"
-- ============================================

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE generations 
DROP CONSTRAINT IF EXISTS generations_cv_id_fkey;

-- Step 2: Make cv_id nullable (optional reference)
ALTER TABLE generations 
ALTER COLUMN cv_id DROP NOT NULL;

-- Step 3: Add new foreign key with SET NULL instead of CASCADE
ALTER TABLE generations 
ADD CONSTRAINT generations_cv_id_fkey 
FOREIGN KEY (cv_id) 
REFERENCES cvs(id) 
ON DELETE SET NULL;

-- Step 4: Add comment explaining the change
COMMENT ON COLUMN generations.cv_id IS 
'Reference to original CV. NULL if original CV was deleted. Generations are preserved even when source CV is deleted.';

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this query to verify the fix worked:
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  rc.delete_rule as current_delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc 
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'generations' 
  AND kcu.column_name = 'cv_id';

-- Expected result: current_delete_rule should be "SET NULL" (not "CASCADE")

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '✅ Generation CASCADE delete fixed - generations will be preserved when CV is deleted' as status;

-- ============================================
-- WHAT THIS DOES:
-- ============================================
-- BEFORE: Delete CV → All generations CASCADE deleted (DATA LOSS!)
-- AFTER:  Delete CV → Generations preserved, cv_id set to NULL
--
-- This means users can delete their original uploaded CV
-- without losing all the tailored versions they generated!
-- ============================================
