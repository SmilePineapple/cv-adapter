-- Fix Section Type Constraint and AI Generation Issues
-- Date: October 23, 2025
-- Issues: 
--   1. Database rejects 'hobbies/interests' section type
--   2. AI is creating fake jobs instead of adapting real ones
--   3. AI is modifying education section

-- PART 1: Fix database constraint to allow more section types
-- First, check current constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'cv_sections'::regclass 
AND contype = 'c';

-- Drop old constraint if it exists
ALTER TABLE cv_sections 
DROP CONSTRAINT IF EXISTS cv_sections_section_type_check;

-- Add new constraint with all valid section types
ALTER TABLE cv_sections
ADD CONSTRAINT cv_sections_section_type_check
CHECK (section_type IN (
    'name',
    'contact',
    'summary',
    'experience',
    'work_experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'certificates',
    'licenses',
    'languages',
    'volunteer',
    'awards',
    'publications',
    'hobbies',
    'interests',
    'hobbies_interests',
    'hobbies/interests',
    'groups',
    'strengths',
    'additional',
    'custom'
));

-- PART 2: Update existing 'hobbies/interests' sections to 'hobbies'
UPDATE cv_sections
SET section_type = 'hobbies',
    updated_at = NOW()
WHERE section_type = 'hobbies/interests';

-- Verify the fix
SELECT section_type, COUNT(*) as count
FROM cv_sections
GROUP BY section_type
ORDER BY count DESC;
