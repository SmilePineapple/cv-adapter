-- =====================================================
-- ANALYTICS TRACKING SYSTEM
-- Complete user journey and funnel analysis
-- =====================================================

-- 1. Analytics Events Table (if not exists)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT analytics_events_event_type_check CHECK (event_type IN (
    'page_view',
    'cv_upload',
    'cv_generation',
    'cover_letter_generation',
    'cv_export',
    'cover_letter_export',
    'language_override',
    'template_selected',
    'payment_completed',
    'signup',
    'login',
    'upgrade_clicked',
    'feature_used'
  ))
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON analytics_events(user_id, created_at DESC);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view own analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Admins can view all analytics events" ON analytics_events;

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

-- Admins can view all events
CREATE POLICY "Admins can view all analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com')
  );


-- =====================================================
-- 2. USER JOURNEY TRACKING
-- =====================================================

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  pages_viewed INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start ON user_sessions(session_start DESC);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;

CREATE POLICY "Users can manage own sessions"
  ON user_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 3. CONVERSION FUNNEL TRACKING
-- =====================================================

-- Funnel stages table
CREATE TABLE IF NOT EXISTS funnel_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  time_to_complete_seconds INTEGER,
  
  CONSTRAINT funnel_stages_stage_check CHECK (stage IN (
    'signup',
    'first_cv_upload',
    'first_generation',
    'first_export',
    'upgrade_viewed',
    'payment_initiated',
    'payment_completed'
  ))
);

CREATE INDEX IF NOT EXISTS idx_funnel_stages_user_id ON funnel_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_stages_stage ON funnel_stages(stage);
CREATE INDEX IF NOT EXISTS idx_funnel_stages_completed ON funnel_stages(completed_at DESC);

ALTER TABLE funnel_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own funnel stages" ON funnel_stages;

CREATE POLICY "Users can insert own funnel stages"
  ON funnel_stages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 4. COHORT ANALYSIS
-- =====================================================

-- User cohorts table
CREATE TABLE IF NOT EXISTS user_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_week DATE NOT NULL, -- Week user signed up
  cohort_month DATE NOT NULL, -- Month user signed up
  signup_source TEXT,
  first_feature_used TEXT,
  days_to_first_generation INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_week ON user_cohorts(cohort_week);
CREATE INDEX IF NOT EXISTS idx_user_cohorts_month ON user_cohorts(cohort_month);

ALTER TABLE user_cohorts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cohort" ON user_cohorts;

CREATE POLICY "Users can view own cohort"
  ON user_cohorts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);


-- =====================================================
-- 5. FEATURE ADOPTION TRACKING
-- =====================================================

-- Feature usage table
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  first_used_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 1,
  
  UNIQUE(user_id, feature_name)
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_name);

ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own feature usage" ON feature_usage;

CREATE POLICY "Users can manage own feature usage"
  ON feature_usage FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 6. ANALYTICS VIEWS
-- =====================================================

-- Daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Conversion funnel summary
CREATE OR REPLACE VIEW conversion_funnel AS
WITH funnel_data AS (
  SELECT 
    COUNT(DISTINCT CASE WHEN stage = 'signup' THEN user_id END) as signups,
    COUNT(DISTINCT CASE WHEN stage = 'first_cv_upload' THEN user_id END) as uploaded_cv,
    COUNT(DISTINCT CASE WHEN stage = 'first_generation' THEN user_id END) as generated_cv,
    COUNT(DISTINCT CASE WHEN stage = 'first_export' THEN user_id END) as exported_cv,
    COUNT(DISTINCT CASE WHEN stage = 'payment_completed' THEN user_id END) as paid_users
  FROM funnel_stages
  WHERE completed_at >= NOW() - INTERVAL '30 days'
)
SELECT 
  'Signups' as stage,
  signups as users,
  100.0 as conversion_rate,
  0 as drop_off
FROM funnel_data
UNION ALL
SELECT 
  'Uploaded CV' as stage,
  uploaded_cv as users,
  ROUND((uploaded_cv::numeric / NULLIF(signups, 0) * 100), 2) as conversion_rate,
  signups - uploaded_cv as drop_off
FROM funnel_data
UNION ALL
SELECT 
  'Generated CV' as stage,
  generated_cv as users,
  ROUND((generated_cv::numeric / NULLIF(signups, 0) * 100), 2) as conversion_rate,
  uploaded_cv - generated_cv as drop_off
FROM funnel_data
UNION ALL
SELECT 
  'Exported CV' as stage,
  exported_cv as users,
  ROUND((exported_cv::numeric / NULLIF(signups, 0) * 100), 2) as conversion_rate,
  generated_cv - exported_cv as drop_off
FROM funnel_data
UNION ALL
SELECT 
  'Paid Users' as stage,
  paid_users as users,
  ROUND((paid_users::numeric / NULLIF(signups, 0) * 100), 2) as conversion_rate,
  exported_cv - paid_users as drop_off
FROM funnel_data;

-- Feature adoption rates
CREATE OR REPLACE VIEW feature_adoption_rates AS
SELECT 
  feature_name,
  COUNT(DISTINCT user_id) as users_count,
  SUM(usage_count) as total_usage,
  ROUND(AVG(usage_count), 2) as avg_usage_per_user,
  MIN(first_used_at) as first_adoption,
  MAX(last_used_at) as last_usage
FROM feature_usage
GROUP BY feature_name
ORDER BY users_count DESC;

-- Cohort retention
CREATE OR REPLACE VIEW cohort_retention AS
WITH cohort_sizes AS (
  SELECT 
    cohort_month,
    COUNT(DISTINCT user_id) as cohort_size
  FROM user_cohorts
  GROUP BY cohort_month
),
monthly_activity AS (
  SELECT 
    uc.cohort_month,
    DATE_TRUNC('month', ae.created_at) as activity_month,
    COUNT(DISTINCT ae.user_id) as active_users
  FROM user_cohorts uc
  JOIN analytics_events ae ON uc.user_id = ae.user_id
  GROUP BY uc.cohort_month, DATE_TRUNC('month', ae.created_at)
)
SELECT 
  cs.cohort_month,
  cs.cohort_size,
  ma.activity_month,
  ma.active_users,
  ROUND((ma.active_users::numeric / cs.cohort_size * 100), 2) as retention_rate,
  EXTRACT(MONTH FROM AGE(ma.activity_month, cs.cohort_month)) as months_since_signup
FROM cohort_sizes cs
JOIN monthly_activity ma ON cs.cohort_month = ma.cohort_month
ORDER BY cs.cohort_month DESC, ma.activity_month DESC;


-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to track funnel stage completion
CREATE OR REPLACE FUNCTION track_funnel_stage(
  p_user_id UUID,
  p_stage TEXT
) RETURNS VOID AS $$
DECLARE
  v_signup_time TIMESTAMPTZ;
  v_time_diff INTEGER;
BEGIN
  -- Get user signup time
  SELECT created_at INTO v_signup_time
  FROM auth.users
  WHERE id = p_user_id;
  
  -- Calculate time to complete
  v_time_diff := EXTRACT(EPOCH FROM (NOW() - v_signup_time))::INTEGER;
  
  -- Insert funnel stage (ignore if already exists)
  INSERT INTO funnel_stages (user_id, stage, time_to_complete_seconds)
  VALUES (p_user_id, p_stage, v_time_diff)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update feature usage
CREATE OR REPLACE FUNCTION update_feature_usage(
  p_user_id UUID,
  p_feature_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO feature_usage (user_id, feature_name, usage_count)
  VALUES (p_user_id, p_feature_name, 1)
  ON CONFLICT (user_id, feature_name) 
  DO UPDATE SET 
    usage_count = feature_usage.usage_count + 1,
    last_used_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize user cohort
CREATE OR REPLACE FUNCTION initialize_user_cohort(
  p_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_signup_date TIMESTAMPTZ;
BEGIN
  -- Get user signup date
  SELECT created_at INTO v_signup_date
  FROM auth.users
  WHERE id = p_user_id;
  
  -- Insert cohort data
  INSERT INTO user_cohorts (
    user_id,
    cohort_week,
    cohort_month
  )
  VALUES (
    p_user_id,
    DATE_TRUNC('week', v_signup_date)::DATE,
    DATE_TRUNC('month', v_signup_date)::DATE
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- Auto-initialize cohort on user signup
DROP TRIGGER IF EXISTS trigger_auto_initialize_cohort ON auth.users;
DROP FUNCTION IF EXISTS auto_initialize_cohort();

CREATE OR REPLACE FUNCTION auto_initialize_cohort()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM initialize_user_cohort(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_initialize_cohort
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_initialize_cohort();


-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT ON daily_active_users TO authenticated;
GRANT SELECT ON conversion_funnel TO authenticated;
GRANT SELECT ON feature_adoption_rates TO authenticated;
GRANT SELECT ON cohort_retention TO authenticated;

-- =====================================================
-- DONE!
-- =====================================================

-- Verify setup
SELECT 'Analytics tracking system setup complete!' as status;
