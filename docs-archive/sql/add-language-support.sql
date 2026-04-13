-- Add language support to CV Adapter
-- Run this in your Supabase SQL Editor

-- Add detected_language column to cvs table
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS detected_language VARCHAR(10) DEFAULT 'en';

-- Add output_language column to generations table
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS output_language VARCHAR(10) DEFAULT 'en';

-- Add output_language column to cover_letters table
ALTER TABLE cover_letters 
ADD COLUMN IF NOT EXISTS output_language VARCHAR(10) DEFAULT 'en';

-- Add index for language queries
CREATE INDEX IF NOT EXISTS idx_cvs_detected_language ON cvs(detected_language);
CREATE INDEX IF NOT EXISTS idx_generations_output_language ON generations(output_language);

-- Add comment for documentation
COMMENT ON COLUMN cvs.detected_language IS 'ISO 639-1 language code detected from uploaded CV (e.g., en, fr, es, ar, hi)';
COMMENT ON COLUMN generations.output_language IS 'ISO 639-1 language code for generated CV output';
COMMENT ON COLUMN cover_letters.output_language IS 'ISO 639-1 language code for generated cover letter';
