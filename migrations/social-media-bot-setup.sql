-- Social Media Bot Database Schema
-- Stores scheduled posts, engagement metrics, and posting history

-- Table: social_media_posts
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
  content_type VARCHAR(30) NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  posted BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP WITH TIME ZONE,
  post_id VARCHAR(255), -- External platform post ID
  post_url TEXT, -- URL to the actual post
  
  -- Engagement metrics
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_social_posts_scheduled ON social_media_posts(scheduled_for) WHERE NOT posted;
CREATE INDEX idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_posts_posted ON social_media_posts(posted);
CREATE INDEX idx_social_posts_content_type ON social_media_posts(content_type);

-- Table: social_media_config
-- Stores API keys and configuration for each platform
CREATE TABLE IF NOT EXISTS social_media_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  
  -- API credentials (encrypted in production)
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  access_token_secret TEXT,
  
  -- Platform-specific settings
  account_id TEXT,
  account_username TEXT,
  posting_enabled BOOLEAN DEFAULT FALSE,
  
  -- Rate limiting
  daily_post_limit INTEGER DEFAULT 10,
  posts_today INTEGER DEFAULT 0,
  last_post_date DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: social_media_analytics
-- Daily aggregated analytics
CREATE TABLE IF NOT EXISTS social_media_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  platform VARCHAR(20) NOT NULL,
  
  -- Metrics
  posts_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Traffic to site
  website_clicks INTEGER DEFAULT 0,
  signups_from_social INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date, platform)
);

-- Table: social_media_content_performance
-- Track which content types perform best
CREATE TABLE IF NOT EXISTS social_media_content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(30) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  
  -- Performance metrics
  total_posts INTEGER DEFAULT 0,
  avg_likes DECIMAL(10,2) DEFAULT 0.00,
  avg_shares DECIMAL(10,2) DEFAULT 0.00,
  avg_comments DECIMAL(10,2) DEFAULT 0.00,
  avg_clicks DECIMAL(10,2) DEFAULT 0.00,
  avg_engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Best performing post
  best_post_id UUID REFERENCES social_media_posts(id),
  best_post_engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(content_type, platform)
);

-- Function: Update analytics daily
CREATE OR REPLACE FUNCTION update_social_media_analytics()
RETURNS void AS $$
BEGIN
  -- Update daily analytics for each platform
  INSERT INTO social_media_analytics (
    date,
    platform,
    posts_count,
    total_likes,
    total_shares,
    total_comments,
    total_clicks,
    total_impressions,
    avg_engagement_rate
  )
  SELECT
    CURRENT_DATE,
    platform,
    COUNT(*),
    SUM(likes),
    SUM(shares),
    SUM(comments),
    SUM(clicks),
    SUM(impressions),
    AVG(engagement_rate)
  FROM social_media_posts
  WHERE DATE(posted_at) = CURRENT_DATE
    AND posted = TRUE
  GROUP BY platform
  ON CONFLICT (date, platform) 
  DO UPDATE SET
    posts_count = EXCLUDED.posts_count,
    total_likes = EXCLUDED.total_likes,
    total_shares = EXCLUDED.total_shares,
    total_comments = EXCLUDED.total_comments,
    total_clicks = EXCLUDED.total_clicks,
    total_impressions = EXCLUDED.total_impressions,
    avg_engagement_rate = EXCLUDED.avg_engagement_rate,
    updated_at = NOW();
    
  -- Update content performance
  INSERT INTO social_media_content_performance (
    content_type,
    platform,
    total_posts,
    avg_likes,
    avg_shares,
    avg_comments,
    avg_clicks,
    avg_engagement_rate
  )
  SELECT
    content_type,
    platform,
    COUNT(*),
    AVG(likes),
    AVG(shares),
    AVG(comments),
    AVG(clicks),
    AVG(engagement_rate)
  FROM social_media_posts
  WHERE posted = TRUE
  GROUP BY content_type, platform
  ON CONFLICT (content_type, platform)
  DO UPDATE SET
    total_posts = EXCLUDED.total_posts,
    avg_likes = EXCLUDED.avg_likes,
    avg_shares = EXCLUDED.avg_shares,
    avg_comments = EXCLUDED.avg_comments,
    avg_clicks = EXCLUDED.avg_clicks,
    avg_engagement_rate = EXCLUDED.avg_engagement_rate,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Reset daily post count
CREATE OR REPLACE FUNCTION reset_daily_post_counts()
RETURNS void AS $$
BEGIN
  UPDATE social_media_config
  SET posts_today = 0
  WHERE last_post_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Insert default platform configurations
INSERT INTO social_media_config (platform, enabled, posting_enabled, daily_post_limit)
VALUES
  ('twitter', TRUE, FALSE, 10),
  ('linkedin', TRUE, FALSE, 5),
  ('facebook', TRUE, FALSE, 5),
  ('instagram', TRUE, FALSE, 3)
ON CONFLICT (platform) DO NOTHING;

-- Row Level Security (RLS)
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_content_performance ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin can view all social posts" ON social_media_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

CREATE POLICY "Admin can manage social posts" ON social_media_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

CREATE POLICY "Admin can view config" ON social_media_config
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

CREATE POLICY "Admin can manage config" ON social_media_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

CREATE POLICY "Admin can view analytics" ON social_media_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

CREATE POLICY "Admin can view performance" ON social_media_content_performance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'jakedalerourke@gmail.com'
    )
  );

-- Comments
COMMENT ON TABLE social_media_posts IS 'Stores all social media posts, scheduled and posted';
COMMENT ON TABLE social_media_config IS 'Platform configurations and API credentials';
COMMENT ON TABLE social_media_analytics IS 'Daily aggregated analytics per platform';
COMMENT ON TABLE social_media_content_performance IS 'Performance metrics by content type';
