-- Add LinkedIn imports tracking to usage_tracking table
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS linkedin_imports_used INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN usage_tracking.linkedin_imports_used IS 'Number of LinkedIn imports used (Free: 1, Pro: unlimited)';

-- Update existing users to 0
UPDATE usage_tracking 
SET linkedin_imports_used = 0 
WHERE linkedin_imports_used IS NULL;
