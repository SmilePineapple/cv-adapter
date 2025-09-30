-- Check usage tracking table and data
-- Run this in Supabase SQL Editor to debug

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- Check current data
SELECT 
  user_id,
  generation_count,
  current_month,
  last_reset_at,
  created_at,
  updated_at
FROM public.usage_tracking
ORDER BY updated_at DESC
LIMIT 10;

-- Check if RLS is blocking updates
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'usage_tracking';
