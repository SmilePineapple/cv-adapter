-- Update Twitter Access Tokens with Read+Write permissions
-- Generated: March 16, 2026
-- For: @JPicklejak5299

UPDATE social_media_config 
SET 
  access_token = '1892580529913880576-ZMqcTdwnr3MhAkGFDR63EwS33i3WWd',
  access_token_secret = 'rQIEx2Liqd2pjdz31ThfKGoH675kBvBcs69nWyXTCeHwg'
WHERE platform = 'twitter';

-- Verify update:
SELECT platform, enabled, 
       LEFT(api_key, 10) || '...' as api_key_preview,
       LEFT(access_token, 20) || '...' as access_token_preview
FROM social_media_config 
WHERE platform = 'twitter';
