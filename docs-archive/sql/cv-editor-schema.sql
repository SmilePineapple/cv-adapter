-- CV Editor Database Schema Extensions
-- Run this after the main supabase-setup.sql

-- Add missing columns to CVs table if they don't exist
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- CV Sections table for structured editing
CREATE TABLE IF NOT EXISTS cv_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  section_type TEXT NOT NULL CHECK (section_type IN (
    'name', 'contact', 'summary', 'experience', 'education', 
    'skills', 'certifications', 'projects', 'publications', 
    'hobbies', 'volunteer', 'awards', 'languages', 'custom'
  )),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{"private": false, "ai_generated": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV Versions table for version history
CREATE TABLE IF NOT EXISTS cv_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT,
  template_id TEXT DEFAULT 'modern',
  theme_settings JSONB DEFAULT '{"font": "Inter", "fontSize": 12, "colors": {"primary": "#2563eb", "secondary": "#64748b", "background": "#ffffff"}}',
  sections_snapshot JSONB NOT NULL,
  metadata JSONB DEFAULT '{"ai_options": {}, "tokens_used": 0, "model": "gpt-4o-mini"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV Section Entries table for atomic content management
CREATE TABLE IF NOT EXISTS cv_section_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_id UUID REFERENCES cv_sections(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  entry_type TEXT DEFAULT 'bullet' CHECK (entry_type IN ('bullet', 'heading', 'paragraph', 'date_range')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{"bold": false, "italic": false, "private": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE cv_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_section_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cv_sections
CREATE POLICY "Users can view own cv sections" ON cv_sections 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM cvs WHERE cvs.id = cv_sections.cv_id AND cvs.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own cv sections" ON cv_sections 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM cvs WHERE cvs.id = cv_sections.cv_id AND cvs.user_id = auth.uid())
  );

CREATE POLICY "Users can update own cv sections" ON cv_sections 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM cvs WHERE cvs.id = cv_sections.cv_id AND cvs.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own cv sections" ON cv_sections 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM cvs WHERE cvs.id = cv_sections.cv_id AND cvs.user_id = auth.uid())
  );

-- RLS Policies for cv_versions
CREATE POLICY "Users can view own cv versions" ON cv_versions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv versions" ON cv_versions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cv versions" ON cv_versions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cv versions" ON cv_versions 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cv_section_entries
CREATE POLICY "Users can view own cv section entries" ON cv_section_entries 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cv_sections 
      JOIN cvs ON cvs.id = cv_sections.cv_id 
      WHERE cv_sections.id = cv_section_entries.section_id 
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cv section entries" ON cv_section_entries 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_sections 
      JOIN cvs ON cvs.id = cv_sections.cv_id 
      WHERE cv_sections.id = cv_section_entries.section_id 
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cv section entries" ON cv_section_entries 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM cv_sections 
      JOIN cvs ON cvs.id = cv_sections.cv_id 
      WHERE cv_sections.id = cv_section_entries.section_id 
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own cv section entries" ON cv_section_entries 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM cv_sections 
      WHERE cv_sections.id = cv_section_entries.section_id 
      AND cvs.user_id = auth.uid()
    )
  );

-- AI Usage Tracking table
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('cv_rewrite', 'section_populate', 'cover_letter')),
  usage_date DATE DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_type, usage_date)
);

-- Enable RLS on AI usage tracking
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_usage_tracking
CREATE POLICY "Users can view own ai usage" ON ai_usage_tracking 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai usage" ON ai_usage_tracking 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai usage" ON ai_usage_tracking 
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cv_sections_cv_id ON cv_sections(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_sections_order ON cv_sections(cv_id, order_index);
CREATE INDEX IF NOT EXISTS idx_cv_versions_cv_id ON cv_versions(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_versions_user_id ON cv_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_section_entries_section_id ON cv_section_entries(section_id);
CREATE INDEX IF NOT EXISTS idx_cv_section_entries_order ON cv_section_entries(section_id, order_index);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_date ON ai_usage_tracking(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_feature ON ai_usage_tracking(user_id, feature_type, usage_date);

-- Function to migrate existing CVs to new structure
CREATE OR REPLACE FUNCTION migrate_cv_to_sections(cv_uuid UUID)
RETURNS VOID AS $$
DECLARE
  section_data JSONB;
  section_record RECORD;
  new_section_id UUID;
  order_idx INTEGER := 0;
BEGIN
  -- Get the parsed sections from existing CV
  SELECT parsed_sections INTO section_data 
  FROM cvs WHERE id = cv_uuid;
  
  -- Loop through each section in the parsed_sections
  FOR section_record IN 
    SELECT * FROM jsonb_array_elements(section_data->'sections') AS section
  LOOP
    -- Insert section into cv_sections
    INSERT INTO cv_sections (
      cv_id, 
      order_index, 
      section_type, 
      title, 
      content,
      metadata
    ) VALUES (
      cv_uuid,
      order_idx,
      COALESCE(section_record.section->>'type', 'custom'),
      COALESCE(section_record.section->>'type', 'Custom Section'),
      jsonb_build_object('content', section_record.section->>'content'),
      jsonb_build_object('ai_generated', false, 'private', false)
    ) RETURNING id INTO new_section_id;
    
    order_idx := order_idx + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create initial version for existing CVs
CREATE OR REPLACE FUNCTION create_initial_version(cv_uuid UUID)
RETURNS VOID AS $$
DECLARE
  cv_owner UUID;
  sections_data JSONB;
BEGIN
  -- Get CV owner
  SELECT user_id INTO cv_owner FROM cvs WHERE id = cv_uuid;
  
  -- Get sections as snapshot
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'type', section_type,
      'title', title,
      'content', content,
      'order', order_index
    ) ORDER BY order_index
  ) INTO sections_data
  FROM cv_sections WHERE cv_id = cv_uuid;
  
  -- Create initial version
  INSERT INTO cv_versions (
    cv_id,
    user_id,
    version_number,
    title,
    sections_snapshot,
    metadata
  ) VALUES (
    cv_uuid,
    cv_owner,
    1,
    'Initial Version',
    COALESCE(sections_data, '[]'::jsonb),
    jsonb_build_object('created_from', 'migration', 'tokens_used', 0)
  );
END;
$$ LANGUAGE plpgsql;

SELECT 'CV Editor schema created successfully' as status;
