-- Insert initial platform configurations
-- Run this BEFORE configure-twitter-bot.sql

-- Insert platform configs if they don't exist
INSERT INTO social_media_config (platform, enabled, posting_enabled, daily_post_limit)
VALUES 
  ('twitter', TRUE, FALSE, 10),
  ('linkedin', FALSE, FALSE, 5),
  ('facebook', FALSE, FALSE, 10),
  ('instagram', FALSE, FALSE, 10)
ON CONFLICT (platform) DO NOTHING;

-- Verify
SELECT platform, enabled, posting_enabled, daily_post_limit, posts_today
FROM social_media_config
ORDER BY platform;
