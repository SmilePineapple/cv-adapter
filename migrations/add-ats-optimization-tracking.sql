-- ATS Optimization Tracking Migration
-- Tracks ATS optimization history and usage for analytics

-- Create ATS optimization history table
CREATE TABLE IF NOT EXISTS ats_optimization_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE NOT NULL,
  before_score INTEGER NOT NULL CHECK (before_score >= 0 AND before_score <= 100),
  after_score INTEGER NOT NULL CHECK (after_score >= 0 AND after_score <= 100),
  improvements JSONB,
  changes_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_ats_optimization_user ON ats_optimization_history(user_id);
CREATE INDEX idx_ats_optimization_generation ON ats_optimization_history(generation_id);
CREATE INDEX idx_ats_optimization_created_at ON ats_optimization_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ats_optimization_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own optimization history"
  ON ats_optimization_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own optimization history"
  ON ats_optimization_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add usage tracking for ATS optimization feature
-- This integrates with existing ai_usage_tracking table
-- Feature type: 'ats_optimization'

-- Create view for ATS optimization analytics
CREATE OR REPLACE VIEW ats_optimization_stats AS
SELECT 
  DATE(created_at) as optimization_date,
  COUNT(*) as total_optimizations,
  AVG(before_score) as avg_before_score,
  AVG(after_score) as avg_after_score,
  AVG(after_score - before_score) as avg_improvement,
  COUNT(DISTINCT user_id) as unique_users
FROM ats_optimization_history
GROUP BY DATE(created_at)
ORDER BY optimization_date DESC;

-- Grant access to authenticated users
GRANT SELECT ON ats_optimization_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE ats_optimization_history IS 'Tracks ATS optimization attempts and results for analytics';
COMMENT ON COLUMN ats_optimization_history.before_score IS 'ATS score before optimization (0-100)';
COMMENT ON COLUMN ats_optimization_history.after_score IS 'ATS score after optimization (0-100)';
COMMENT ON COLUMN ats_optimization_history.improvements IS 'JSON array of improvements made by AI';
COMMENT ON COLUMN ats_optimization_history.changes_summary IS 'Brief summary of major changes';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ ATS Optimization tracking tables created successfully!';
  RAISE NOTICE '📊 View ats_optimization_stats for analytics';
  RAISE NOTICE '🔒 RLS policies enabled for data security';
END $$;
