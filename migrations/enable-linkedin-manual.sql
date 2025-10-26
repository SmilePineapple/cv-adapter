-- Enable LinkedIn for manual content generation
-- This allows you to generate LinkedIn posts in the dashboard
-- You'll copy/paste them manually to LinkedIn until API is approved

UPDATE social_media_config
SET 
  enabled = TRUE,
  posting_enabled = FALSE,  -- Manual posting (not automated)
  daily_post_limit = 5,
  account_username = 'CV Adapter',  -- Update this with your company page name
  updated_at = NOW()
WHERE platform = 'linkedin';

-- Verify
SELECT 
  platform, 
  enabled, 
  posting_enabled, 
  account_username,
  daily_post_limit
FROM social_media_config 
WHERE platform = 'linkedin';
