-- Create cover_letters table if it doesn't exist
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

-- Enable RLS (ignore if already enabled)
DO $$ 
BEGIN
    ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Drop existing policies if they exist (ignore errors)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Users can insert own cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Users can update own cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Users can delete own cover letters" ON cover_letters;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create RLS policies (ignore if they exist)
DO $$ 
BEGIN
    CREATE POLICY "Users can view own cover letters" ON cover_letters FOR SELECT USING (auth.uid() = user_id);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Users can insert own cover letters" ON cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Users can update own cover letters" ON cover_letters FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Users can delete own cover letters" ON cover_letters FOR DELETE USING (auth.uid() = user_id);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_generation_id ON cover_letters(generation_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON cover_letters(created_at);
