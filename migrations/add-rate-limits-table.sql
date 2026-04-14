-- Persistent rate limiting table
-- Replaces the in-memory Map that reset on every serverless cold start
-- Uses Postgres upsert for atomic increment to prevent race conditions

CREATE TABLE IF NOT EXISTS rate_limits (
  identifier TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (identifier)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_rate_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rate_limits_updated_at ON rate_limits;
CREATE TRIGGER rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_rate_limits_updated_at();

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits (reset_at);

-- RLS: no user access — only service role (server-side only)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies: only reachable via service role key (server-side API routes)
-- This is intentional — rate_limits should never be readable/writable by end users

-- Cleanup function: delete expired entries (call periodically or via pg_cron)
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE reset_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic upsert + increment function called by the rate limiter
-- Returns { count, reset_at } — count is the new value after increment
CREATE OR REPLACE FUNCTION upsert_rate_limit(
  p_identifier TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER,
  p_reset_at TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_count INTEGER;
  v_reset_at TIMESTAMPTZ;
BEGIN
  -- Check if an active (non-expired) row exists
  SELECT count, reset_at
  INTO v_count, v_reset_at
  FROM rate_limits
  WHERE identifier = p_identifier
    AND reset_at > NOW()
  FOR UPDATE;  -- Lock the row to prevent race conditions

  IF NOT FOUND THEN
    -- No active row: insert fresh at count=1
    INSERT INTO rate_limits (identifier, count, reset_at)
    VALUES (p_identifier, 1, p_reset_at)
    ON CONFLICT (identifier) DO UPDATE
      SET count = 1, reset_at = p_reset_at, updated_at = NOW();
    v_count := 1;
    v_reset_at := p_reset_at;
  ELSE
    -- Active row exists: increment
    UPDATE rate_limits
    SET count = count + 1, updated_at = NOW()
    WHERE identifier = p_identifier
    RETURNING count INTO v_count;
  END IF;

  RETURN json_build_object('count', v_count, 'reset_at', v_reset_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
