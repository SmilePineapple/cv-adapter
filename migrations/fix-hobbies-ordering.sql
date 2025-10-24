-- Fix Hobbies Section Ordering
-- Date: October 23, 2025
-- Issue: Hobbies sections appearing too early (order_index = 6-8)
-- Solution: Set hobbies to order_index = 50 (near end, after all main sections)

-- Standard section order:
-- 1-2: Name, Contact
-- 3: Summary
-- 4: Experience
-- 5: Education
-- 6: Skills
-- 7-12: Projects, Certifications, Languages, Volunteer, Awards, Publications
-- 50+: Hobbies/Interests (should be last)

-- Update all hobbies/interests sections to appear at the end
UPDATE cv_sections 
SET order_index = 50,
    updated_at = NOW()
WHERE section_type IN ('hobbies', 'interests', 'hobbies_interests', 'hobbies/interests')
AND order_index < 50;

-- Verify the fix
SELECT 
    cv_id,
    section_type,
    title,
    order_index,
    updated_at
FROM cv_sections 
WHERE section_type IN ('hobbies', 'interests', 'hobbies_interests', 'hobbies/interests')
ORDER BY cv_id, order_index;

-- Optional: Reorder all sections for a specific CV to be sequential
-- Uncomment and replace 'your-cv-id' with actual CV ID if needed
/*
WITH ordered_sections AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY cv_id ORDER BY 
            CASE section_type
                WHEN 'name' THEN 1
                WHEN 'contact' THEN 2
                WHEN 'summary' THEN 3
                WHEN 'experience' THEN 4
                WHEN 'education' THEN 5
                WHEN 'skills' THEN 6
                WHEN 'projects' THEN 7
                WHEN 'certifications' THEN 8
                WHEN 'languages' THEN 9
                WHEN 'volunteer' THEN 10
                WHEN 'awards' THEN 11
                WHEN 'publications' THEN 12
                WHEN 'hobbies' THEN 13
                WHEN 'interests' THEN 14
                ELSE 15
            END,
            order_index
        ) as new_order
    FROM cv_sections
    WHERE cv_id = 'your-cv-id'
)
UPDATE cv_sections
SET order_index = ordered_sections.new_order,
    updated_at = NOW()
FROM ordered_sections
WHERE cv_sections.id = ordered_sections.id;
*/
