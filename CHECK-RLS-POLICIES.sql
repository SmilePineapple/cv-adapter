-- Check if RLS policies might be causing generations to be deleted

-- 1. Check RLS policies on generations table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename IN ('generations', 'cvs')
ORDER BY tablename, policyname;

-- 2. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('generations', 'cvs');

-- 3. List all constraints on generations (simpler view)
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  CASE con.contype
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 'c' THEN 'CHECK'
    WHEN 't' THEN 'TRIGGER'
  END AS constraint_type_name,
  CASE con.confdeltype
    WHEN 'a' THEN 'NO ACTION'
    WHEN 'r' THEN 'RESTRICT'
    WHEN 'c' THEN '❌ CASCADE'
    WHEN 'n' THEN '✅ SET NULL'
    WHEN 'd' THEN 'SET DEFAULT'
    ELSE 'N/A'
  END AS on_delete_action
FROM pg_constraint con
WHERE con.conrelid = 'generations'::regclass;
