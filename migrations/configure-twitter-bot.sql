-- Configure Twitter API for Social Media Bot
-- Run this in Supabase SQL Editor

-- Update Twitter configuration with API credentials
UPDATE social_media_config
SET 
  api_key = 'vILXxoj08t5nFyYyVNNFn26CB',
  api_secret = 'nzaXvpFQq9g8l1RkyZa0tn95ugkLYHBCG67bVRpHzmVPg5PPcc',
  access_token = '1892580529913880576-f4M08clkLLsbaMzxNUHJhHAbofAsVK',
  access_token_secret = 'HzrsQmsfFeK2DM8Hh1EQzLfwFsgfIYAb6BqKJ9sQF6Wqw',
  account_username = '@mycvbuddy',
  enabled = TRUE,
  posting_enabled = TRUE,
  daily_post_limit = 10,
  updated_at = NOW()
WHERE platform = 'twitter';

-- Verify configuration
SELECT 
  platform,
  enabled,
  posting_enabled,
  account_username,
  daily_post_limit,
  posts_today,
  CASE 
    WHEN api_key IS NOT NULL THEN '✓ API Key Set'
    ELSE '✗ API Key Missing'
  END as api_key_status,
  CASE 
    WHEN access_token IS NOT NULL THEN '✓ Access Token Set'
    ELSE '✗ Access Token Missing'
  END as token_status
FROM social_media_config
WHERE platform = 'twitter';
