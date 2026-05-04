-- ============================================
-- SUPABASE USAGE CHECK QUERY
-- Run this in Supabase SQL Editor to check your usage
-- ============================================

-- FIRST: Check what columns actually exist in usage_tracking
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usage_tracking' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1. Check database size
SELECT 
    pg_size_pretty(pg_database_size('postgres')) as database_size,
    pg_size_pretty(pg_total_relation_size('public.cvs')) as cvs_table_size,
    pg_size_pretty(pg_total_relation_size('public.generations')) as generations_table_size,
    pg_size_pretty(pg_total_relation_size('public.usage_tracking')) as usage_tracking_size;

-- 2. Check user counts (using only confirmed columns)
SELECT 
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT CASE WHEN subscription_tier = 'pro_monthly' OR subscription_tier = 'pro_annual' THEN user_id END) as pro_users,
    COUNT(DISTINCT CASE WHEN subscription_tier = 'free' THEN user_id END) as free_users
FROM usage_tracking;

-- 3. Check generation counts
SELECT 
    COUNT(*) as total_generations,
    COUNT(DISTINCT user_id) as users_with_generations,
    MIN(created_at) as first_generation,
    MAX(created_at) as last_generation
FROM generations;

-- 4. Check storage usage
SELECT 
    bucket_id,
    COUNT(*) as file_count,
    SUM((metadata->>'size')::bigint) as total_bytes,
    pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size
FROM storage.objects
GROUP BY bucket_id;

-- 5. HISTORICAL ANALYSIS: Daily generation counts (last 30 days)
-- This shows traffic patterns to estimate compute hour usage
SELECT 
    DATE(created_at) as date,
    COUNT(*) as generations_per_day,
    COUNT(DISTINCT user_id) as unique_users_per_day
FROM generations
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 6. HISTORICAL ANALYSIS: Peak traffic days (last 90 days)
-- Identifies your highest traffic days to see if free tier would handle them
SELECT 
    DATE(created_at) as date,
    COUNT(*) as generations,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) * 0.5 as estimated_compute_hours_used
FROM generations
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY generations DESC
LIMIT 10;

-- 7. HISTORICAL ANALYSIS: Weekly traffic patterns
-- Shows if traffic is consistent or sporadic
SELECT 
    DATE_TRUNC('week', created_at) as week_start,
    COUNT(*) as weekly_generations,
    COUNT(DISTINCT user_id) as weekly_unique_users,
    ROUND(COUNT(*) * 0.5 / 7, 2) as avg_daily_compute_hours
FROM generations
WHERE created_at > NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- 8. Compute hour estimation based on generation patterns
-- Estimate: ~0.5 compute hours per generation (includes user session time)
WITH daily_usage AS (
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as generations,
        COUNT(DISTINCT user_id) as users
    FROM generations
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
)
SELECT 
    AVG(generations) as avg_daily_generations,
    MAX(generations) as peak_daily_generations,
    SUM(generations) as total_generations_30_days,
    SUM(generations) * 0.5 as estimated_compute_hours_30_days,
    MAX(generations) * 0.5 as peak_daily_compute_hours,
    CASE 
        WHEN MAX(generations) * 0.5 > 5 THEN 'HIGH TRAFFIC DAY - Free tier might struggle'
        WHEN MAX(generations) * 0.5 > 2 THEN 'MODERATE TRAFFIC - Free tier should be OK'
        ELSE 'LOW TRAFFIC - Free tier definitely OK'
    END as free_tier_assessment
FROM daily_usage;

-- 9. Check subscription tiers breakdown
SELECT 
    subscription_tier,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM usage_tracking
GROUP BY subscription_tier
ORDER BY user_count DESC;

-- 10. Activity logs analysis (if table exists)
-- Check if you have activity logs to track API calls
SELECT 
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activity_logs'
    ) as activity_logs_exist;
