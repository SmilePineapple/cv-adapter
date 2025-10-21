-- Create table to track AI improvements (1 free per user)
CREATE TABLE IF NOT EXISTS ai_improvements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE NOT NULL,
  improvements_applied JSONB,
  missing_sections_added JSONB,
  keywords_added JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE ai_improvements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own improvements
CREATE POLICY "Users can view own improvements"
  ON ai_improvements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own improvements
CREATE POLICY "Users can insert own improvements"
  ON ai_improvements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_ai_improvements_user_id ON ai_improvements(user_id);
CREATE INDEX idx_ai_improvements_generation_id ON ai_improvements(generation_id);

-- Add comment
COMMENT ON TABLE ai_improvements IS 'Tracks AI improvement applications - users get 1 free improvement';
