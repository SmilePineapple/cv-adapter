-- Create SEO metrics tracking table
CREATE TABLE IF NOT EXISTS seo_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_users INTEGER NOT NULL,
  new_users_24h INTEGER NOT NULL,
  new_users_7d INTEGER NOT NULL,
  active_users_30d INTEGER NOT NULL,
  total_generations INTEGER NOT NULL,
  generations_7d INTEGER NOT NULL,
  conversion_rate DECIMAL(5,2) NOT NULL,
  avg_generations_per_user DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_seo_metrics_date ON seo_metrics(date DESC);

-- Enable RLS
ALTER TABLE seo_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can read SEO metrics" ON seo_metrics;
DROP POLICY IF EXISTS "System can insert SEO metrics" ON seo_metrics;

-- Policy: Only specific admin emails can read
CREATE POLICY "Admins can read SEO metrics"
  ON seo_metrics
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com')
  );

-- Policy: Service role can insert (for automated monitoring)
CREATE POLICY "Service role can insert SEO metrics"
  ON seo_metrics
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.jwt() ->> 'email' IN ('jakedalerourke@gmail.com', 'smilepineapple118@gmail.com')
  );
