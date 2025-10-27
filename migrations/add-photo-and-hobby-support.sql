-- Migration: Add photo support and hobby icons to CVs
-- Date: October 27, 2025

-- Add photo_url column to cvs table
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add hobby_icons column to cv_sections table for storing selected hobby icons
ALTER TABLE cv_sections
ADD COLUMN IF NOT EXISTS hobby_icons JSONB DEFAULT '[]';

-- Add comment
COMMENT ON COLUMN cvs.photo_url IS 'URL to user profile photo for CV templates';
COMMENT ON COLUMN cv_sections.hobby_icons IS 'Array of selected hobby icons with names and emoji';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_sections_hobby_icons ON cv_sections USING GIN (hobby_icons);
