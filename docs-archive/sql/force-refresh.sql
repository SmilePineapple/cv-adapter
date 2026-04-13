-- Force refresh Supabase schema cache
-- Run this in Supabase SQL Editor if the restart doesn't work

-- Method 1: Refresh schema cache (if function exists)
SELECT pg_notify('pgrst', 'reload schema');

-- Method 2: Force table recreation (more aggressive)
-- DROP TABLE IF EXISTS cover_letters CASCADE;

-- Recreate table to force schema refresh
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  length TEXT CHECK (length IN ('short', 'long')) DEFAULT 'short',
  tone TEXT CHECK (tone IN ('professional', 'friendly', 'enthusiastic', 'formal')) DEFAULT 'professional',
  hiring_manager_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Re-enable RLS and policies
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work
DROP POLICY IF EXISTS "Users can view own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can insert own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can update own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can delete own cover letters" ON cover_letters;

CREATE POLICY "Users can view own cover letters" ON cover_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cover letters" ON cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cover letters" ON cover_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover letters" ON cover_letters FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_generation_id ON cover_letters(generation_id);

-- Test the table works
SELECT 'cover_letters table is ready' as status;
