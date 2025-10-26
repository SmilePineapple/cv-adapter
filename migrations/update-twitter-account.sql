-- Update Twitter account username and posting time
-- Run this in Supabase SQL Editor

-- Update Twitter config with correct username
UPDATE social_media_config
SET 
  account_username = '@JPicklejak5299',
  updated_at = NOW()
WHERE platform = 'twitter';

-- Verify the update
SELECT 
  platform, 
  enabled, 
  posting_enabled, 
  account_username,
  daily_post_limit
FROM social_media_config 
WHERE platform = 'twitter';
