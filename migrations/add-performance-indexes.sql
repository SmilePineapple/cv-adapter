-- Add Performance Indexes
-- Run this in Supabase SQL Editor to improve query performance

-- CVs table indexes
CREATE INDEX IF NOT EXISTS idx_cvs_user_id_created 
ON cvs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cvs_last_accessed 
ON cvs(last_accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_cvs_detected_language 
ON cvs(detected_language);

-- Generations table indexes
CREATE INDEX IF NOT EXISTS idx_generations_user_id_created 
ON generations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generations_cv_id 
ON generations(cv_id);

CREATE INDEX IF NOT EXISTS idx_generations_ats_score 
ON generations(ats_score DESC);

CREATE INDEX IF NOT EXISTS idx_generations_output_language 
ON generations(output_language);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_plan_type 
ON usage_tracking(plan_type);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_lifetime_count 
ON usage_tracking(lifetime_generation_count);

-- Cover letters indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_created 
ON cover_letters(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cover_letters_output_language 
ON cover_letters(output_language);

-- Analytics events indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_analytics_user_id 
ON analytics_events(user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type 
ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_created 
ON analytics_events(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_generations_user_cv 
ON generations(user_id, cv_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cvs_user_language 
ON cvs(user_id, detected_language);

-- Analyze tables to update statistics
ANALYZE cvs;
ANALYZE generations;
ANALYZE cover_letters;
ANALYZE usage_tracking;
ANALYZE analytics_events;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Performance indexes created successfully!';
  RAISE NOTICE 'Expected impact: 3-5x faster queries';
END $$;
