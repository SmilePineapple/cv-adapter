-- Update Twitter API credentials in database with OAuth 1.0a keys
-- Run this in Supabase SQL Editor

UPDATE social_media_config
SET 
  api_key = 'tF6oW8oF4ESsxbSkav6BxEAtP',
  api_secret = 'zOpYaf3vHALVHFPXuGesoiYhsnLXNhqBhIcP8CX11SaHlEwoqZ',
  access_token = '1892580529913880576-byvu6zm5ntZRBaowSaiDFMSKnE2kvr',
  access_token_secret = 'r2oA88ijoUCkXI1I8jEwaXiJQYv9gFKxJOlHHEjBhsxqb',
  updated_at = NOW()
WHERE platform = 'twitter';

-- Verify the update
SELECT 
  platform,
  CASE 
    WHEN api_key IS NOT NULL THEN '✓ API Key Set: ' || LEFT(api_key, 10) || '...'
    ELSE '✗ API Key Missing'
  END as api_key_status,
  CASE 
    WHEN access_token IS NOT NULL THEN '✓ Access Token Set: ' || LEFT(access_token, 15) || '...'
    ELSE '✗ Access Token Missing'
  END as access_token_status,
  enabled,
  posting_enabled
FROM social_media_config 
WHERE platform = 'twitter';
