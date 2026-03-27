-- Create tables for SEO automation features

-- 1. Social media queue
CREATE TABLE IF NOT EXISTS social_media_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_media_queue_status ON social_media_queue(status);

-- 2. Page speed metrics
CREATE TABLE IF NOT EXISTS page_speed_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_score DECIMAL(5,2),
  seo_score DECIMAL(5,2),
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_speed_checked_at ON page_speed_metrics(checked_at DESC);

-- 3. Blog ideas
CREATE TABLE IF NOT EXISTS blog_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  keyword TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'idea',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_blog_ideas_status ON blog_ideas(status);

-- 4. Email queue
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON email_queue(user_id);

-- 5. Meta tag recommendations
CREATE TABLE IF NOT EXISTS meta_tag_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEO automation log
CREATE TABLE IF NOT EXISTS seo_automation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actions JSONB NOT NULL,
  total_actions INTEGER NOT NULL,
  successful_actions INTEGER NOT NULL,
  failed_actions INTEGER NOT NULL,
  run_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_automation_log_run_at ON seo_automation_log(run_at DESC);

-- Enable RLS on all tables
ALTER TABLE social_media_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_speed_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_tag_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_automation_log ENABLE ROW LEVEL SECURITY;

-- Policies: Service role can do everything
CREATE POLICY "Service role full access social_media_queue"
  ON social_media_queue FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access page_speed_metrics"
  ON page_speed_metrics FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access blog_ideas"
  ON blog_ideas FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access email_queue"
  ON email_queue FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access meta_tag_recommendations"
  ON meta_tag_recommendations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access seo_automation_log"
  ON seo_automation_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies: Admins can read
CREATE POLICY "Admins can read social_media_queue"
  ON social_media_queue FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));

CREATE POLICY "Admins can read page_speed_metrics"
  ON page_speed_metrics FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));

CREATE POLICY "Admins can read blog_ideas"
  ON blog_ideas FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));

CREATE POLICY "Admins can read email_queue"
  ON email_queue FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));

CREATE POLICY "Admins can read meta_tag_recommendations"
  ON meta_tag_recommendations FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));

CREATE POLICY "Admins can read seo_automation_log"
  ON seo_automation_log FOR SELECT
  USING (auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com'));
