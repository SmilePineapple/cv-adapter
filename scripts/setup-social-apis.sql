-- Script to add social media API keys to database
-- Run this in Supabase SQL Editor after getting API keys

-- Twitter/X Configuration
UPDATE social_media_config
SET 
  api_key = 'YOUR_TWITTER_API_KEY',
  api_secret = 'YOUR_TWITTER_API_SECRET',
  access_token = 'YOUR_TWITTER_ACCESS_TOKEN',
  access_token_secret = 'YOUR_TWITTER_ACCESS_TOKEN_SECRET',
  account_username = 'YOUR_TWITTER_USERNAME',
  posting_enabled = TRUE
WHERE platform = 'twitter';

-- LinkedIn Configuration
UPDATE social_media_config
SET 
  api_key = 'YOUR_LINKEDIN_CLIENT_ID',
  api_secret = 'YOUR_LINKEDIN_CLIENT_SECRET',
  access_token = 'YOUR_LINKEDIN_ACCESS_TOKEN',
  account_id = 'YOUR_LINKEDIN_COMPANY_ID',
  posting_enabled = TRUE
WHERE platform = 'linkedin';

-- Facebook Configuration
UPDATE social_media_config
SET 
  api_key = 'YOUR_FACEBOOK_APP_ID',
  api_secret = 'YOUR_FACEBOOK_APP_SECRET',
  access_token = 'YOUR_FACEBOOK_ACCESS_TOKEN',
  account_id = 'YOUR_FACEBOOK_PAGE_ID',
  posting_enabled = TRUE
WHERE platform = 'facebook';

-- Instagram Configuration
UPDATE social_media_config
SET 
  access_token = 'YOUR_INSTAGRAM_ACCESS_TOKEN',
  account_id = 'YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID',
  posting_enabled = TRUE
WHERE platform = 'instagram';

-- Verify configuration
SELECT 
  platform,
  enabled,
  posting_enabled,
  account_username,
  account_id,
  daily_post_limit,
  CASE 
    WHEN api_key IS NOT NULL THEN '✓ API Key Set'
    ELSE '✗ API Key Missing'
  END as api_key_status,
  CASE 
    WHEN access_token IS NOT NULL THEN '✓ Access Token Set'
    ELSE '✗ Access Token Missing'
  END as token_status
FROM social_media_config
ORDER BY platform;
