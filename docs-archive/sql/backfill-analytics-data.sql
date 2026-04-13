-- Backfill Analytics Data from Existing Tables
-- This will populate analytics_events with historical data
-- Run this in Supabase SQL Editor AFTER running analytics-dashboard-setup.sql

-- 1. Backfill CV uploads from cvs table
INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
SELECT 
  user_id,
  'cv_upload' as event_type,
  jsonb_build_object(
    'detected_language', detected_language,
    'file_name', file_meta->>'name',
    'file_size', file_meta->>'size'
  ) as event_data,
  created_at
FROM cvs
WHERE NOT EXISTS (
  SELECT 1 FROM analytics_events ae 
  WHERE ae.user_id = cvs.user_id 
  AND ae.event_type = 'cv_upload' 
  AND ae.created_at = cvs.created_at
);

-- 2. Backfill CV generations from generations table
INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
SELECT 
  user_id,
  'cv_generation' as event_type,
  jsonb_build_object(
    'job_title', job_title,
    'output_language', output_language,
    'rewrite_style', rewrite_style,
    'tone', tone,
    'ats_score', ats_score
  ) as event_data,
  created_at
FROM generations
WHERE NOT EXISTS (
  SELECT 1 FROM analytics_events ae 
  WHERE ae.user_id = generations.user_id 
  AND ae.event_type = 'cv_generation' 
  AND ae.created_at = generations.created_at
);

-- 3. Backfill cover letter generations from cover_letters table
INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
SELECT 
  user_id,
  'cover_letter_generation' as event_type,
  jsonb_build_object(
    'job_title', job_title,
    'company_name', company_name,
    'output_language', output_language,
    'tone', tone,
    'length', length
  ) as event_data,
  created_at
FROM cover_letters
WHERE NOT EXISTS (
  SELECT 1 FROM analytics_events ae 
  WHERE ae.user_id = cover_letters.user_id 
  AND ae.event_type = 'cover_letter_generation' 
  AND ae.created_at = cover_letters.created_at
);

-- 4. Backfill payments from purchases table
INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
SELECT 
  user_id,
  'payment_completed' as event_type,
  jsonb_build_object(
    'amount_paid', amount_paid,
    'currency', currency,
    'status', status,
    'payment_intent_id', payment_intent_id
  ) as event_data,
  purchased_at as created_at
FROM purchases
WHERE status = 'completed'
AND purchased_at IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM analytics_events ae 
  WHERE ae.user_id = purchases.user_id 
  AND ae.event_type = 'payment_completed' 
  AND ae.created_at = purchases.purchased_at
);

-- 5. Refresh materialized view with new data
REFRESH MATERIALIZED VIEW daily_stats;

-- 6. Verify data was inserted
SELECT 
  event_type,
  COUNT(*) as count,
  MIN(created_at) as earliest,
  MAX(created_at) as latest
FROM analytics_events
GROUP BY event_type
ORDER BY count DESC;

-- Expected output:
-- event_type                  | count | earliest            | latest
-- cv_generation              | X     | 2024-XX-XX          | 2025-XX-XX
-- cv_upload                  | X     | 2024-XX-XX          | 2025-XX-XX
-- cover_letter_generation    | X     | 2024-XX-XX          | 2025-XX-XX
-- payment_completed          | X     | 2024-XX-XX          | 2025-XX-XX
