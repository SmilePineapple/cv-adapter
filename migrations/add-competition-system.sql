-- Competition System for Pro Giveaway
-- Allows users to play games and compete for free Pro access

-- Table: competition_scores
CREATE TABLE IF NOT EXISTS competition_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  game_type VARCHAR(50) NOT NULL, -- 'cv_clicker', 'memory_match', etc.
  score INTEGER NOT NULL DEFAULT 0,
  
  -- Competition tracking
  competition_id VARCHAR(50) NOT NULL DEFAULT 'oct_2025', -- Track different competitions
  is_winner BOOLEAN DEFAULT FALSE,
  prize_claimed BOOLEAN DEFAULT FALSE,
  prize_type VARCHAR(50), -- 'pro_1month', 'pro_3months', etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_competition_scores_user ON competition_scores(user_id);
CREATE INDEX idx_competition_scores_email ON competition_scores(email);
CREATE INDEX idx_competition_scores_competition ON competition_scores(competition_id);
CREATE INDEX idx_competition_scores_leaderboard ON competition_scores(competition_id, score DESC);

-- Table: competitions
-- Track active competitions
CREATE TABLE IF NOT EXISTS competitions (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  game_type VARCHAR(50) NOT NULL,
  
  -- Competition settings
  max_winners INTEGER DEFAULT 5,
  prize_type VARCHAR(50) NOT NULL, -- 'pro_1month', 'pro_3months', etc.
  prize_description TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  winners_announced BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default competition
INSERT INTO competitions (
  id,
  name,
  description,
  game_type,
  max_winners,
  prize_type,
  prize_description,
  start_date,
  end_date
) VALUES (
  'oct_2025',
  'October Pro Giveaway',
  'Play CV Clicker and win 1 month of Pro access FREE! Top 5 scores win.',
  'cv_clicker',
  5,
  'pro_1month',
  '1 Month Pro Access (100 Generations + All Features)',
  NOW(),
  NOW() + INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- Function: Get leaderboard for a competition
CREATE OR REPLACE FUNCTION get_competition_leaderboard(
  p_competition_id VARCHAR(50) DEFAULT 'oct_2025',
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  rank BIGINT,
  email TEXT,
  score INTEGER,
  is_winner BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.created_at ASC) as rank,
    cs.email,
    cs.score,
    cs.is_winner,
    cs.created_at
  FROM competition_scores cs
  WHERE cs.competition_id = p_competition_id
  ORDER BY cs.score DESC, cs.created_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user's best score for a competition
CREATE OR REPLACE FUNCTION get_user_best_score(
  p_email TEXT,
  p_competition_id VARCHAR(50) DEFAULT 'oct_2025'
)
RETURNS TABLE (
  score INTEGER,
  rank BIGINT,
  total_players BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_scores AS (
    SELECT 
      cs.email,
      cs.score,
      ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.created_at ASC) as rank
    FROM competition_scores cs
    WHERE cs.competition_id = p_competition_id
  ),
  total_count AS (
    SELECT COUNT(DISTINCT email) as total
    FROM competition_scores
    WHERE competition_id = p_competition_id
  )
  SELECT 
    rs.score,
    rs.rank,
    tc.total
  FROM ranked_scores rs
  CROSS JOIN total_count tc
  WHERE rs.email = p_email
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Mark winners for a competition
CREATE OR REPLACE FUNCTION mark_competition_winners(
  p_competition_id VARCHAR(50) DEFAULT 'oct_2025'
)
RETURNS INTEGER AS $$
DECLARE
  v_max_winners INTEGER;
  v_winners_marked INTEGER;
BEGIN
  -- Get max winners for this competition
  SELECT max_winners INTO v_max_winners
  FROM competitions
  WHERE id = p_competition_id;

  -- Mark top scores as winners
  WITH top_scores AS (
    SELECT DISTINCT ON (email) id
    FROM competition_scores
    WHERE competition_id = p_competition_id
    ORDER BY email, score DESC, created_at ASC
  ),
  ranked_top_scores AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC, created_at ASC) as rank
    FROM competition_scores
    WHERE id IN (SELECT id FROM top_scores)
  )
  UPDATE competition_scores
  SET 
    is_winner = TRUE,
    updated_at = NOW()
  WHERE id IN (
    SELECT id FROM ranked_top_scores WHERE rank <= v_max_winners
  );

  GET DIAGNOSTICS v_winners_marked = ROW_COUNT;

  -- Update competition status
  UPDATE competitions
  SET 
    winners_announced = TRUE,
    updated_at = NOW()
  WHERE id = p_competition_id;

  RETURN v_winners_marked;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE competition_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Users can view all scores (for leaderboard)
CREATE POLICY "Anyone can view competition scores"
  ON competition_scores FOR SELECT
  USING (true);

-- Users can insert their own scores
CREATE POLICY "Users can insert their own scores"
  ON competition_scores FOR INSERT
  WITH CHECK (auth.email() = email);

-- Users can view all competitions
CREATE POLICY "Anyone can view competitions"
  ON competitions FOR SELECT
  USING (true);

-- Only admins can modify competitions
CREATE POLICY "Only admins can modify competitions"
  ON competitions FOR ALL
  USING (auth.email() IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Grant permissions
GRANT SELECT ON competition_scores TO authenticated, anon;
GRANT INSERT ON competition_scores TO authenticated;
GRANT SELECT ON competitions TO authenticated, anon;

-- Comments
COMMENT ON TABLE competition_scores IS 'Stores user scores for competitions and games';
COMMENT ON TABLE competitions IS 'Tracks active competitions and their settings';
COMMENT ON FUNCTION get_competition_leaderboard IS 'Returns top scores for a competition';
COMMENT ON FUNCTION get_user_best_score IS 'Returns user''s best score and rank';
COMMENT ON FUNCTION mark_competition_winners IS 'Marks top N players as winners';
