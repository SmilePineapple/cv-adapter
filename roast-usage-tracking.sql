-- Add roast usage tracking to usage_tracking table
-- Pro users get 10 roasts per month

-- Add columns for roast tracking
ALTER TABLE usage_tracking
ADD COLUMN IF NOT EXISTS roast_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS roast_last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_usage_tracking_roast ON usage_tracking(user_id, roast_count, roast_last_reset);

-- Function to reset roast count monthly
CREATE OR REPLACE FUNCTION reset_roast_count_if_needed()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if last reset was more than 30 days ago
  IF NEW.roast_last_reset IS NULL OR 
     (CURRENT_TIMESTAMP - NEW.roast_last_reset) > INTERVAL '30 days' THEN
    NEW.roast_count := 0;
    NEW.roast_last_reset := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-reset monthly
DROP TRIGGER IF EXISTS trigger_reset_roast_count ON usage_tracking;
CREATE TRIGGER trigger_reset_roast_count
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION reset_roast_count_if_needed();

-- Comment
COMMENT ON COLUMN usage_tracking.roast_count IS 'Number of roasts used this month (resets every 30 days)';
COMMENT ON COLUMN usage_tracking.roast_last_reset IS 'Last time roast count was reset';
