-- Create table to store CV ratings
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.cv_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL,
  ats_score INTEGER NOT NULL,
  summary TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  improvements JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cv_id) -- One rating per CV
);

-- Enable RLS
ALTER TABLE public.cv_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own ratings" ON public.cv_ratings;
DROP POLICY IF EXISTS "Users can insert own ratings" ON public.cv_ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON public.cv_ratings;

CREATE POLICY "Users can view own ratings" ON public.cv_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings" ON public.cv_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.cv_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.cv_ratings TO authenticated;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cv_ratings_cv_id ON cv_ratings(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_ratings_user_id ON cv_ratings(user_id);

SELECT 'CV ratings table created successfully' as status;
