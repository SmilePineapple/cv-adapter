-- Add job scrapes tracking to usage_tracking table
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS job_scrapes_used INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN usage_tracking.job_scrapes_used IS 'Number of job scrapes used (Free: 3, Pro: unlimited)';

-- Update existing users to 0
UPDATE usage_tracking 
SET job_scrapes_used = 0 
WHERE job_scrapes_used IS NULL;
