-- Update Competition Prize to 20 Free Generations
-- Change from 1 month Pro to 20 generations added to account

-- Update existing competition
UPDATE competitions
SET 
  max_winners = 3,
  prize_type = 'free_generations_20',
  prize_description = '20 Free CV Generations',
  description = 'Play CV Clicker and win! Top 3 scores each month get 20 free CV generations added to their account.',
  name = 'Monthly CV Clicker Competition'
WHERE id = 'oct_2025';

-- Add function to grant free generations to winners
CREATE OR REPLACE FUNCTION grant_free_generations_to_winners(
  p_competition_id VARCHAR(50) DEFAULT 'oct_2025',
  p_generations_to_add INTEGER DEFAULT 20
)
RETURNS TABLE (
  user_email TEXT,
  generations_added INTEGER,
  new_total INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH winners AS (
    SELECT DISTINCT ON (cs.email) 
      cs.user_id,
      cs.email,
      cs.id as score_id
    FROM competition_scores cs
    WHERE cs.competition_id = p_competition_id
      AND cs.is_winner = true
      AND cs.prize_claimed = false
      AND cs.user_id IS NOT NULL
    ORDER BY cs.email, cs.score DESC
  )
  UPDATE usage_tracking ut
  SET 
    max_lifetime_generations = ut.max_lifetime_generations + p_generations_to_add,
    updated_at = NOW()
  FROM winners w
  WHERE ut.user_id = w.user_id
  RETURNING 
    w.email,
    p_generations_to_add as generations_added,
    ut.max_lifetime_generations as new_total;
END;
$$ LANGUAGE plpgsql;

-- Comment
COMMENT ON FUNCTION grant_free_generations_to_winners IS 'Grants free generations to competition winners by increasing their max_lifetime_generations';

-- Update prize description for clarity
UPDATE competitions
SET prize_description = '20 Free CV Generations (added to your account)'
WHERE id = 'oct_2025';
