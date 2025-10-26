-- Check LinkedIn configuration status
SELECT 
  platform, 
  enabled, 
  posting_enabled, 
  account_username,
  daily_post_limit,
  CASE 
    WHEN api_key IS NOT NULL AND api_key != 'YOUR_LINKEDIN_CLIENT_ID' 
    THEN '✓ API Key Set: ' || LEFT(api_key, 10) || '...'
    ELSE '✗ API Key Missing or Placeholder'
  END as api_key_status,
  CASE 
    WHEN api_secret IS NOT NULL AND api_secret != 'YOUR_LINKEDIN_CLIENT_SECRET'
    THEN '✓ API Secret Set'
    ELSE '✗ API Secret Missing or Placeholder'
  END as api_secret_status,
  CASE 
    WHEN access_token IS NOT NULL 
    THEN '✓ Access Token Set'
    ELSE '✗ Access Token Missing'
  END as access_token_status
FROM social_media_config 
WHERE platform = 'linkedin';
