-- Add interview prep tracking to usage_tracking table
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS interview_preps_used INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN usage_tracking.interview_preps_used IS 'Number of interview preps used (Free: 2, Pro: unlimited)';

-- Update existing users to 0
UPDATE usage_tracking 
SET interview_preps_used = 0 
WHERE interview_preps_used IS NULL;

-- Create interview_preps table to store generated preps
CREATE TABLE IF NOT EXISTS interview_preps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  job_description TEXT NOT NULL,
  company_research JSONB,
  interview_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE interview_preps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interview preps" 
  ON interview_preps FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview preps" 
  ON interview_preps FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interview preps" 
  ON interview_preps FOR DELETE 
  USING (auth.uid() = user_id);

-- Add index
CREATE INDEX IF NOT EXISTS interview_preps_user_id_idx ON interview_preps(user_id);
CREATE INDEX IF NOT EXISTS interview_preps_created_at_idx ON interview_preps(created_at DESC);
