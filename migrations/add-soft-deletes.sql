-- Add Soft Deletes
-- Allows users to recover deleted CVs within 30 days

-- Add deleted_at columns
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE cover_letters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add indexes for deleted_at
CREATE INDEX IF NOT EXISTS idx_cvs_deleted_at ON cvs(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_generations_deleted_at ON generations(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cover_letters_deleted_at ON cover_letters(deleted_at) WHERE deleted_at IS NOT NULL;

-- Update RLS policies to exclude soft-deleted items
DROP POLICY IF EXISTS "Users can view own CVs" ON cvs;
CREATE POLICY "Users can view own CVs" 
ON cvs FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view own generations" ON generations;
CREATE POLICY "Users can view own generations" 
ON generations FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view own cover letters" ON cover_letters;
CREATE POLICY "Users can view own cover letters" 
ON cover_letters FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Add policy for viewing deleted items (for recovery)
CREATE POLICY "Users can view own deleted CVs" 
ON cvs FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Create function to permanently delete old soft-deleted items
CREATE OR REPLACE FUNCTION cleanup_deleted_data()
RETURNS void AS $$
BEGIN
  -- Delete CVs older than 30 days
  DELETE FROM cvs 
  WHERE deleted_at < NOW() - INTERVAL '30 days';
  
  -- Delete generations older than 30 days
  DELETE FROM generations 
  WHERE deleted_at < NOW() - INTERVAL '30 days';
  
  -- Delete cover letters older than 30 days
  DELETE FROM cover_letters 
  WHERE deleted_at < NOW() - INTERVAL '30 days';
  
  RAISE NOTICE 'Cleaned up soft-deleted items older than 30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to restore soft-deleted items
CREATE OR REPLACE FUNCTION restore_deleted_cv(cv_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE cvs 
  SET deleted_at = NULL 
  WHERE id = cv_id_param 
    AND user_id = auth.uid() 
    AND deleted_at IS NOT NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CV not found or already restored';
  END IF;
  
  RAISE NOTICE 'CV restored successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup to run monthly (requires pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('cleanup-deleted-data', '0 0 1 * *', 'SELECT cleanup_deleted_data()');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Soft deletes implemented successfully!';
  RAISE NOTICE 'Users can now recover deleted items within 30 days';
  RAISE NOTICE 'Run cleanup_deleted_data() monthly to permanently delete old items';
END $$;
