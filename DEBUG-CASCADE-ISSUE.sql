-- Debug script to find out why generations are still being deleted

-- 1. Check ALL foreign key constraints on generations table
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  rc.delete_rule,
  rc.update_rule
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.referential_constraints rc 
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'generations'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 2. Check if there are multiple cv_id foreign keys (there shouldn't be!)
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  confdeltype as delete_action,
  CASE confdeltype
    WHEN 'a' THEN 'NO ACTION'
    WHEN 'r' THEN 'RESTRICT'
    WHEN 'c' THEN '❌ CASCADE (BAD!)'
    WHEN 'n' THEN '✅ SET NULL (GOOD!)'
    WHEN 'd' THEN 'SET DEFAULT'
  END as delete_action_name
FROM pg_constraint
WHERE conrelid = 'generations'::regclass
  AND contype = 'f'; -- foreign keys only

-- 3. Show the actual table definition
SELECT 
  a.attname as column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
  a.attnotnull as not_null,
  COALESCE(pg_get_expr(d.adbin, d.adrelid), '') as default_value
FROM pg_attribute a
LEFT JOIN pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
WHERE a.attrelid = 'generations'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;

-- 4. Check if there are any triggers that might be deleting generations
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'generations'
   OR event_object_table = 'cvs';
