-- Temporarily disable Twitter posting due to ongoing Twitter API 503 outage
-- Twitter API has been down since Feb 27, 2026 affecting all developers
-- Re-enable when Twitter fixes their infrastructure

UPDATE social_media_config 
SET posting_enabled = FALSE 
WHERE platform = 'twitter';

-- Verify the change
SELECT 
  platform,
  posting_enabled,
  daily_post_limit,
  posts_today,
  last_post_date
FROM social_media_config
WHERE platform IN ('twitter', 'linkedin')
ORDER BY platform;
