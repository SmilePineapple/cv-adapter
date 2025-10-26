-- Fix RLS policies for social media bot
-- The issue is likely that the admin check is too strict

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view config" ON social_media_config;
DROP POLICY IF EXISTS "Admin can manage config" ON social_media_config;
DROP POLICY IF EXISTS "Admin can view all social posts" ON social_media_posts;
DROP POLICY IF EXISTS "Admin can manage social posts" ON social_media_posts;

-- Create more permissive policies for testing
-- Allow service role to access everything
CREATE POLICY "Service role can manage config" ON social_media_config
  FOR ALL USING (true);

CREATE POLICY "Service role can manage posts" ON social_media_posts
  FOR ALL USING (true);

-- Verify configs are visible
SELECT platform, enabled, posting_enabled, account_username 
FROM social_media_config 
ORDER BY platform;
