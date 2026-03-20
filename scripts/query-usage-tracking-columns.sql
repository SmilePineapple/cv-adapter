-- Query to see actual columns in usage_tracking table
-- Run this in Supabase SQL Editor to see the real schema

SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usage_tracking' 
AND table_schema = 'public'
ORDER BY ordinal_position;
