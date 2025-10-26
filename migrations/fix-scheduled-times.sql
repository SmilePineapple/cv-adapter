-- Fix scheduled post times from 10:00 AM to 2:00 PM (14:00)
-- Run this in Supabase SQL Editor

-- Update all scheduled posts to 2 PM instead of 10 AM
UPDATE social_media_posts
SET 
  scheduled_for = scheduled_for + INTERVAL '4 hours',
  updated_at = NOW()
WHERE 
  posted = FALSE
  AND EXTRACT(HOUR FROM scheduled_for) = 10;

-- Verify the update
SELECT 
  platform,
  content_type,
  TO_CHAR(scheduled_for, 'YYYY-MM-DD HH24:MI') as scheduled_time,
  posted
FROM social_media_posts
WHERE posted = FALSE
ORDER BY scheduled_for;
