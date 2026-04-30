-- Add max_pages column to generations table
-- This allows users to specify desired CV length in pages (1-4) which is then used during PDF export

ALTER TABLE generations ADD COLUMN IF NOT EXISTS max_pages INTEGER DEFAULT 1;

-- Add comment to document the column
COMMENT ON COLUMN generations.max_pages IS 'Desired CV length in pages (1-4). Used during PDF export to constrain output length.';

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'generations' 
  AND column_name = 'max_pages';
