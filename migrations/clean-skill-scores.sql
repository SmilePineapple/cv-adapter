-- ============================================
-- CLEAN UP MALFORMED SKILL SCORES
-- ============================================
-- This migration fixes skill_scores that have malformed JSON brackets in skill names
-- Example: '["Exceptional communication skills"' → 'Exceptional communication skills'

-- Step 1: Find all skill_scores with malformed names
SELECT 
  id,
  cv_id,
  content::jsonb
FROM cv_sections
WHERE section_type = 'skill_scores'
  AND content::text LIKE '%[""%'
LIMIT 5;

-- Step 2: Clean up skill names by removing brackets and quotes
UPDATE cv_sections
SET content = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', 
      -- Remove all brackets and quotes from skill names
      regexp_replace(
        (skill->>'name')::text,
        '[\[\]"]',  -- Remove [, ], and " characters
        '',
        'g'
      ),
      'level', 
      (skill->>'level')::int
    )
  )
  FROM jsonb_array_elements(content::jsonb) AS skill
)
WHERE section_type = 'skill_scores';

-- Step 3: Verify the cleanup
SELECT 
  id,
  cv_id,
  content::jsonb
FROM cv_sections
WHERE section_type = 'skill_scores'
LIMIT 5;

-- Expected result:
-- Before: [{"name": "[\"Exceptional communication skills\"", "level": 55}]
-- After:  [{"name": "Exceptional communication skills", "level": 55}]
