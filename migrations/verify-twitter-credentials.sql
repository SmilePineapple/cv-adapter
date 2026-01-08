-- Verify Twitter credentials in database match environment variables
-- Run this in Supabase SQL Editor

SELECT 
  platform,
  api_key,
  api_secret,
  access_token,
  access_token_secret,
  LENGTH(api_key) as api_key_length,
  LENGTH(api_secret) as api_secret_length,
  LENGTH(access_token) as access_token_length,
  LENGTH(access_token_secret) as access_token_secret_length
FROM social_media_config 
WHERE platform = 'twitter';
