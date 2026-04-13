-- Deep diagnostic to find out WHY generations are still being deleted

-- 1. Verify the constraint is REALLY set to SET NULL
SELECT 
  '1. CONSTRAINT CHECK' as diagnostic,
  conname as constraint_name,
  contype as type,
  confdeltype as delete_type_code,
  CASE confdeltype
    WHEN 'a' THEN 'NO ACTION'
    WHEN 'r' THEN 'RESTRICT'
    WHEN 'c' THEN '❌ CASCADE'
    WHEN 'n' THEN '✅ SET NULL'
    WHEN 'd' THEN 'SET DEFAULT'
  END as delete_action
FROM pg_constraint
WHERE conrelid = 'generations'::regclass
  AND contype = 'f';

-- 2. Check if cv_id is actually nullable
SELECT 
  '2. COLUMN NULLABILITY' as diagnostic,
  column_name,
  is_nullable,
  data_type,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ Can be NULL'
    ELSE '❌ Cannot be NULL - THIS IS THE PROBLEM!'
  END as status
FROM information_schema.columns
WHERE table_name = 'generations' 
  AND column_name = 'cv_id';

-- 3. Check ALL triggers on both tables
SELECT 
  '3. TRIGGERS' as diagnostic,
  trigger_name,
  event_object_table as table_name,
  event_manipulation as event,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('cvs', 'generations')
ORDER BY event_object_table, trigger_name;

-- 4. Check if there's a DELETE trigger that might be deleting generations
SELECT 
  '4. DELETE TRIGGERS ON CVS' as diagnostic,
  tgname as trigger_name,
  pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgrelid = 'cvs'::regclass
  AND tgname NOT LIKE 'RI_%'; -- Exclude referential integrity triggers

-- 5. Check for any CASCADE delete paths
SELECT 
  '5. ALL CASCADE PATHS' as diagnostic,
  tc.table_name as from_table,
  kcu.column_name,
  ccu.table_name AS references_table,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND rc.delete_rule = 'CASCADE'
  AND (tc.table_name = 'generations' OR ccu.table_name = 'cvs')
ORDER BY tc.table_name;

-- 6. Check the actual table definition
SELECT 
  '6. GENERATIONS TABLE STRUCTURE' as diagnostic,
  a.attname as column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
  a.attnotnull as not_null,
  CASE 
    WHEN a.attnotnull THEN '❌ NOT NULL - Cannot be set to NULL!'
    ELSE '✅ Nullable'
  END as nullable_status
FROM pg_attribute a
WHERE a.attrelid = 'generations'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND a.attname = 'cv_id';
