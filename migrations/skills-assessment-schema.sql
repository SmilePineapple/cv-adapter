-- Skills Assessment Feature Database Schema
-- Created: January 8, 2026
-- Purpose: Store skill assessments, tests, and results for users

-- Main assessments table
CREATE TABLE IF NOT EXISTS skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_role TEXT NOT NULL,
  job_description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  total_questions INTEGER NOT NULL DEFAULT 10,
  time_limit_minutes INTEGER DEFAULT 30,
  status TEXT CHECK (status IN ('draft', 'in_progress', 'completed', 'expired')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions for each assessment
CREATE TABLE IF NOT EXISTS skill_assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'code', 'scenario')) NOT NULL,
  skill_category TEXT NOT NULL, -- e.g., 'technical', 'soft_skills', 'industry_knowledge'
  question_text TEXT NOT NULL,
  options JSONB, -- For multiple choice: ["Option A", "Option B", "Option C", "Option D"]
  correct_answer TEXT NOT NULL,
  explanation TEXT, -- Explanation of correct answer
  points INTEGER DEFAULT 10,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, question_number)
);

-- User answers
CREATE TABLE IF NOT EXISTS skill_assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES skill_assessment_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

-- Assessment results and analytics
CREATE TABLE IF NOT EXISTS skill_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage_score DECIMAL(5,2) NOT NULL,
  time_taken_minutes INTEGER,
  questions_correct INTEGER,
  questions_total INTEGER,
  skill_breakdown JSONB, -- {"technical": 80, "soft_skills": 90, "industry_knowledge": 70}
  strengths JSONB, -- ["Problem Solving", "Communication"]
  weaknesses JSONB, -- ["Time Management", "Technical Writing"]
  skill_gaps JSONB, -- [{"skill": "Python", "current_level": 60, "target_level": 80, "resources": [...]}]
  recommendations JSONB, -- AI-generated learning recommendations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id)
);

-- Learning resources recommendations
CREATE TABLE IF NOT EXISTS skill_learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('course', 'article', 'video', 'book', 'practice', 'certification')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  provider TEXT, -- e.g., "Coursera", "Udemy", "YouTube"
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  is_free BOOLEAN DEFAULT true,
  rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_status ON skill_assessments(status);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_created_at ON skill_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_assessment_questions_assessment_id ON skill_assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessment_answers_assessment_id ON skill_assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessment_results_user_id ON skill_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_learning_resources_skill_name ON skill_learning_resources(skill_name);

-- Row Level Security (RLS) Policies
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_learning_resources ENABLE ROW LEVEL SECURITY;

-- Users can only see their own assessments
CREATE POLICY "Users can view own assessments"
  ON skill_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON skill_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON skill_assessments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can view questions for their assessments
CREATE POLICY "Users can view questions for own assessments"
  ON skill_assessment_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM skill_assessments
      WHERE skill_assessments.id = skill_assessment_questions.assessment_id
      AND skill_assessments.user_id = auth.uid()
    )
  );

-- Users can submit answers for their assessments
CREATE POLICY "Users can submit answers for own assessments"
  ON skill_assessment_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM skill_assessments
      WHERE skill_assessments.id = skill_assessment_answers.assessment_id
      AND skill_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own answers"
  ON skill_assessment_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM skill_assessments
      WHERE skill_assessments.id = skill_assessment_answers.assessment_id
      AND skill_assessments.user_id = auth.uid()
    )
  );

-- Users can view their own results
CREATE POLICY "Users can view own results"
  ON skill_assessment_results FOR SELECT
  USING (auth.uid() = user_id);

-- Everyone can view learning resources (public)
CREATE POLICY "Anyone can view learning resources"
  ON skill_learning_resources FOR SELECT
  USING (true);

-- Admin policies (for service role)
CREATE POLICY "Service role can manage all assessments"
  ON skill_assessments FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all questions"
  ON skill_assessment_questions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all answers"
  ON skill_assessment_answers FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all results"
  ON skill_assessment_results FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage learning resources"
  ON skill_learning_resources FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skill_assessments_updated_at
  BEFORE UPDATE ON skill_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate assessment score
CREATE OR REPLACE FUNCTION calculate_assessment_score(assessment_uuid UUID)
RETURNS TABLE (
  total_score INTEGER,
  max_score INTEGER,
  percentage_score DECIMAL(5,2),
  questions_correct INTEGER,
  questions_total INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(a.points_earned), 0)::INTEGER as total_score,
    COALESCE(SUM(q.points), 0)::INTEGER as max_score,
    CASE
      WHEN SUM(q.points) > 0 THEN (SUM(a.points_earned)::DECIMAL / SUM(q.points)::DECIMAL * 100)
      ELSE 0
    END as percentage_score,
    COUNT(CASE WHEN a.is_correct THEN 1 END)::INTEGER as questions_correct,
    COUNT(*)::INTEGER as questions_total
  FROM skill_assessment_questions q
  LEFT JOIN skill_assessment_answers a ON q.id = a.question_id
  WHERE q.assessment_id = assessment_uuid;
END;
$$ LANGUAGE plpgsql;

-- Seed some common learning resources
INSERT INTO skill_learning_resources (skill_name, resource_type, title, description, url, provider, difficulty, estimated_hours, is_free, rating) VALUES
  ('Python', 'course', 'Python for Everybody', 'Complete Python course for beginners', 'https://www.coursera.org/specializations/python', 'Coursera', 'beginner', 40, true, 4.8),
  ('JavaScript', 'course', 'JavaScript: The Complete Guide', 'Modern JavaScript from beginner to advanced', 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/', 'Udemy', 'intermediate', 50, false, 4.7),
  ('React', 'course', 'React - The Complete Guide', 'Build powerful, fast, user-friendly React apps', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', 'Udemy', 'intermediate', 45, false, 4.6),
  ('SQL', 'course', 'SQL for Data Science', 'Learn SQL for data analysis and database management', 'https://www.coursera.org/learn/sql-for-data-science', 'Coursera', 'beginner', 15, true, 4.5),
  ('Communication', 'course', 'Effective Communication Skills', 'Master professional communication', 'https://www.coursera.org/learn/wharton-communication-skills', 'Coursera', 'beginner', 10, true, 4.7),
  ('Leadership', 'course', 'Inspiring Leadership through Emotional Intelligence', 'Develop leadership skills', 'https://www.coursera.org/learn/emotional-intelligence-leadership', 'Coursera', 'intermediate', 20, true, 4.8),
  ('Project Management', 'certification', 'Google Project Management Certificate', 'Professional certificate in project management', 'https://www.coursera.org/professional-certificates/google-project-management', 'Coursera', 'beginner', 120, false, 4.8),
  ('Data Analysis', 'course', 'Google Data Analytics Certificate', 'Complete data analytics program', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Coursera', 'beginner', 180, false, 4.8)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE skill_assessments IS 'Main table for skill assessments created by users';
COMMENT ON TABLE skill_assessment_questions IS 'Questions for each assessment, generated by AI';
COMMENT ON TABLE skill_assessment_answers IS 'User answers to assessment questions';
COMMENT ON TABLE skill_assessment_results IS 'Final results and analytics for completed assessments';
COMMENT ON TABLE skill_learning_resources IS 'Curated learning resources for skill development';
