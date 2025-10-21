-- Add support for custom hobby icons
-- The hobbies section content can now be:
-- 1. A string (for auto-detection) - backward compatible
-- 2. An array of {name, icon} objects (for custom selection)

-- No schema changes needed! JSONB already supports both formats.
-- This migration is just for documentation purposes.

-- Example usage:

-- Auto-detection (existing):
-- UPDATE cv_sections 
-- SET content = 'I enjoy traveling, photography, and fitness'
-- WHERE section_type = 'hobbies';

-- Custom icons (new):
-- UPDATE cv_sections 
-- SET content = '[
--   {"name": "Travel", "icon": "✈️"},
--   {"name": "Photography", "icon": "📷"},
--   {"name": "Fitness", "icon": "💪"}
-- ]'::jsonb
-- WHERE section_type = 'hobbies';

-- The advanced templates will automatically detect which format is used
-- and render accordingly.

COMMENT ON COLUMN cv_sections.content IS 'JSONB content - can be string (auto-detect hobbies) or array of {name, icon} objects (custom hobbies)';
