-- Migration: Create user_growth_stats table
-- Purpose: Preserve aggregate user signup/deletion counts for admin reporting
-- even after users are hard-deleted for GDPR compliance.
-- No personally identifiable information is stored here.

CREATE TABLE IF NOT EXISTS public.user_growth_stats (
  year_month  TEXT        PRIMARY KEY,  -- Format: 'YYYY-MM', e.g. '2025-10'
  new_signups INTEGER     NOT NULL DEFAULT 0,
  deletions   INTEGER     NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.user_growth_stats IS 'Aggregate monthly user signup and deletion counts. Contains no PII.';
COMMENT ON COLUMN public.user_growth_stats.year_month  IS 'ISO year-month string (YYYY-MM)';
COMMENT ON COLUMN public.user_growth_stats.new_signups IS 'Number of new user accounts created in this month';
COMMENT ON COLUMN public.user_growth_stats.deletions   IS 'Number of user accounts permanently deleted in this month';

-- Only the service role (used by cron jobs and admin API) can read/write this table.
ALTER TABLE public.user_growth_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.user_growth_stats
  USING (auth.role() = 'service_role');
