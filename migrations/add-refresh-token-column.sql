-- Add refresh_token and token_expires_at columns to social_media_config
-- Run this in Supabase SQL Editor

ALTER TABLE social_media_config
ADD COLUMN IF NOT EXISTS refresh_token TEXT,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'social_media_config'
  AND column_name IN ('refresh_token', 'token_expires_at')
ORDER BY column_name;
