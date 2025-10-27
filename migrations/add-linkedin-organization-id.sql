-- Add organization_id column for LinkedIn company page posting
-- Run this in Supabase SQL Editor

ALTER TABLE social_media_config
ADD COLUMN IF NOT EXISTS organization_id TEXT;

-- Set the organization ID for My CV Buddy company page
-- Organization ID: 109509220 (from your company page URL)
UPDATE social_media_config
SET organization_id = '109509220'
WHERE platform = 'linkedin';

-- Verify
SELECT 
  platform,
  organization_id,
  account_username
FROM social_media_config
WHERE platform = 'linkedin';
