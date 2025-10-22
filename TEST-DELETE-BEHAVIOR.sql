-- Test to understand the actual delete behavior

-- 1. First, let's see what happens when we look at a specific CV and its generations
-- Replace 'YOUR_CV_ID' with an actual CV ID you're about to delete
SELECT 
  'CV Info' as info_type,
  id as cv_id,
  user_id,
  created_at
FROM cvs
WHERE id = 'YOUR_CV_ID_HERE'
LIMIT 1;

-- 2. Find all generations for this CV
SELECT 
  'Generations for this CV' as info_type,
  id as generation_id,
  cv_id,
  user_id,
  job_title,
  created_at
FROM generations
WHERE cv_id = 'YOUR_CV_ID_HERE';

-- 3. Now let's understand the constraint chain
-- This shows what happens when a CV is deleted
SELECT 
  'Constraint Chain Analysis' as analysis,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND (tc.table_name = 'generations' OR ccu.table_name = 'cvs')
ORDER BY tc.table_name, kcu.column_name;

-- 4. Check if there are any other tables that reference CVs with CASCADE
SELECT 
  'Tables that CASCADE delete from CVs' as warning,
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'cvs'
  AND rc.delete_rule = 'CASCADE';
