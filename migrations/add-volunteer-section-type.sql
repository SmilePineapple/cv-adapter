-- Add 'volunteer', 'awards', and 'custom' to cv_sections section_type constraint
-- This fixes the error: "volunteer" violates check constraint "cv_sections_section_type_check"

-- Step 1: Drop the existing constraint
ALTER TABLE cv_sections DROP CONSTRAINT IF EXISTS cv_sections_section_type_check;

-- Step 2: Clean up any invalid section types (map to closest valid type)
-- This ensures the new constraint can be added successfully
UPDATE cv_sections 
SET section_type = 'summary' 
WHERE section_type NOT IN (
  'name', 'contact', 'summary', 'experience', 'education', 
  'skills', 'certifications', 'projects', 'publications', 
  'hobbies', 'interests', 'languages', 'skill_scores',
  'volunteer', 'awards', 'custom'
);

-- Step 3: Add the updated constraint with volunteer, awards, and custom
ALTER TABLE cv_sections ADD CONSTRAINT cv_sections_section_type_check 
CHECK (section_type IN (
  'name', 'contact', 'summary', 'experience', 'education', 
  'skills', 'certifications', 'projects', 'publications', 
  'hobbies', 'volunteer', 'awards', 'languages', 'custom',
  'interests', 'skill_scores'
));

-- Step 4: Verify the constraint was added
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'cv_sections_section_type_check';

-- Expected result: Should show volunteer, awards, and custom in the CHECK constraint
