-- Query to check which tables exist in the database
-- Run this in Supabase SQL Editor to see actual schema

-- List all tables in the public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check specific tables mentioned in reset script
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generations') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as generations,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cover_letters') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as cover_letters,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_preps') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as interview_preps,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'skills_assessments') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as skills_assessments,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cvs') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as cvs,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as activity_logs,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usage_tracking') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as usage_tracking,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as subscriptions,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'purchases') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as purchases,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as profiles;
