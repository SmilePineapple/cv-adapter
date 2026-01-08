-- Fix CASCADE delete issue for generations
-- When a CV is deleted, generations should NOT be deleted
-- They are valuable user work and should be preserved

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

-- Verification query (run this to check)
-- SELECT 
--   tc.constraint_name,
--   tc.table_name,
--   kcu.column_name,
--   rc.delete_rule
-- FROM information_schema.table_constraints tc
-- JOIN information_schema.key_column_usage kcu 
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.referential_constraints rc 
--   ON tc.constraint_name = rc.constraint_name
-- WHERE tc.table_name = 'generations' 
--   AND kcu.column_name = 'cv_id';

SELECT 'Generation CASCADE delete fixed - generations will be preserved when CV is deleted' as status;
