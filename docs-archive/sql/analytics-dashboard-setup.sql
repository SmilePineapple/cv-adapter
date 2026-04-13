-- Analytics Dashboard Setup for CV Adapter
-- Run this in your Supabase SQL Editor

-- 1. Create analytics_events table to track all user actions
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for fast queries
  CONSTRAINT analytics_events_event_type_check CHECK (event_type IN (
    'cv_upload',
    'cv_generation',
    'cover_letter_generation',
    'cv_export',
    'cover_letter_export',
    'language_override',
    'template_selected',
    'payment_completed',
    'page_view'
  ))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data ON analytics_events USING gin(event_data);

-- 2. Create analytics summary view for quick stats
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  DATE(created_at) as date,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  event_data->>'language' as language,
  event_data->>'format' as format,
  event_data->>'template' as template
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), event_type, event_data->>'language', event_data->>'format', event_data->>'template'
ORDER BY date DESC;

-- 3. Create language usage stats view
CREATE OR REPLACE VIEW language_usage_stats AS
SELECT 
  COALESCE(event_data->>'detected_language', event_data->>'output_language', 'en') as language,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('day', created_at) as date
FROM analytics_events
WHERE event_type IN ('cv_generation', 'cover_letter_generation', 'cv_upload')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY language, DATE_TRUNC('day', created_at)
ORDER BY date DESC, usage_count DESC;

-- 4. Create export format stats view
CREATE OR REPLACE VIEW export_format_stats AS
SELECT 
  event_data->>'format' as format,
  COUNT(*) as export_count,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('day', created_at) as date
FROM analytics_events
WHERE event_type IN ('cv_export', 'cover_letter_export')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY format, DATE_TRUNC('day', created_at)
ORDER BY date DESC, export_count DESC;

-- 5. Create user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE event_type = 'cv_upload') as cvs_uploaded,
  COUNT(*) FILTER (WHERE event_type = 'cv_generation') as cvs_generated,
  COUNT(*) FILTER (WHERE event_type = 'cover_letter_generation') as cover_letters_generated,
  COUNT(*) FILTER (WHERE event_type = 'cv_export') as cvs_exported,
  COUNT(*) FILTER (WHERE event_type = 'cover_letter_export') as cover_letters_exported,
  MIN(created_at) as first_activity,
  MAX(created_at) as last_activity,
  COUNT(DISTINCT DATE(created_at)) as active_days
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY user_id;

-- 6. RLS Policies for analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY "Users can insert own analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own events
CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin can view all events (replace with your admin user ID)
CREATE POLICY "Admin can view all analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = '75ac6140-bedc-4bbd-84c3-8dfa07356766'::uuid);

-- 7. Function to track events easily
CREATE OR REPLACE FUNCTION track_analytics_event(
  p_event_type VARCHAR(50),
  p_event_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO analytics_events (user_id, event_type, event_data)
  VALUES (auth.uid(), p_event_type, p_event_data)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- 8. Create daily stats materialized view for performance
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'cv_upload') as cvs_uploaded,
  COUNT(*) FILTER (WHERE event_type = 'cv_generation') as cvs_generated,
  COUNT(*) FILTER (WHERE event_type = 'cover_letter_generation') as cover_letters_generated,
  COUNT(*) FILTER (WHERE event_type = 'payment_completed') as payments,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'payment_completed') as paying_users
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Function to refresh daily stats (run this daily via cron)
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_stats;
END;
$$;

-- 9. Comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks all user events for analytics and insights';
COMMENT ON VIEW analytics_summary IS 'Summary of events grouped by date and type';
COMMENT ON VIEW language_usage_stats IS 'Language usage statistics for multi-language support';
COMMENT ON VIEW export_format_stats IS 'Export format preferences and usage';
COMMENT ON VIEW user_activity_summary IS 'Per-user activity summary for engagement tracking';
COMMENT ON MATERIALIZED VIEW daily_stats IS 'Daily aggregated statistics for dashboard (refresh daily)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Analytics dashboard setup complete! ✅';
  RAISE NOTICE 'Tables created: analytics_events';
  RAISE NOTICE 'Views created: analytics_summary, language_usage_stats, export_format_stats, user_activity_summary';
  RAISE NOTICE 'Materialized view: daily_stats';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run this SQL in Supabase';
  RAISE NOTICE '2. Set up daily cron job to refresh daily_stats';
  RAISE NOTICE '3. Integrate analytics tracking in your app';
END $$;
