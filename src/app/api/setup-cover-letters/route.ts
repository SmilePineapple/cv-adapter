import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    // Create cover_letters table with service role key
    const createTableSQL = `
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
      
      -- Enable RLS
      ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
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
    `

    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      console.error('SQL execution error:', error)
      return NextResponse.json({ 
        error: 'Failed to create cover letters table', 
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Cover letters table created successfully'
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
