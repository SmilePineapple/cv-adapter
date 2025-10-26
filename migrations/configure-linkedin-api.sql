-- Configure LinkedIn API credentials
-- Run this in Supabase SQL Editor

-- IMPORTANT: Replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with actual values from LinkedIn Developer App
UPDATE social_media_config
SET 
  api_key = 'YOUR_LINKEDIN_CLIENT_ID',
  api_secret = 'YOUR_LINKEDIN_CLIENT_SECRET',
  account_username = 'CV Adapter',  -- Update with your LinkedIn company page name
  enabled = TRUE,
  posting_enabled = FALSE,  -- Keep FALSE until OAuth is complete
  daily_post_limit = 5,
  updated_at = NOW()
WHERE platform = 'linkedin';

-- Verify the configuration
SELECT 
  platform, 
  enabled, 
  posting_enabled, 
  account_username,
  daily_post_limit,
  CASE 
    WHEN api_key IS NOT NULL THEN '✓ API Key Set'
    ELSE '✗ API Key Missing'
  END as api_key_status,
  CASE 
    WHEN api_secret IS NOT NULL THEN '✓ API Secret Set'
    ELSE '✗ API Secret Missing'
  END as api_secret_status
FROM social_media_config 
WHERE platform = 'linkedin';
