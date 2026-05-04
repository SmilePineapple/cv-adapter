-- ============================================
-- SUPABASE DATABASE BACKUP SCRIPT
-- Run this in Supabase SQL Editor to backup your data
-- ============================================

-- This script exports all your important data as INSERT statements
-- Copy the output and save it as a .sql file for backup

-- 1. Backup usage_tracking table
SELECT 'INSERT INTO usage_tracking (user_id, subscription_tier, subscription_start_date, subscription_end_date, features_unlocked, generations_used, job_scrapes_used, interview_preps_used) VALUES ' as backup_line
UNION ALL
SELECT 
    '(' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(subscription_tier) || ', ' ||
    CASE WHEN subscription_start_date IS NOT NULL THEN quote_literal(subscription_start_date::text) ELSE 'NULL' END || ', ' ||
    CASE WHEN subscription_end_date IS NOT NULL THEN quote_literal(subscription_end_date::text) ELSE 'NULL' END || ', ' ||
    quote_literal(features_unlocked::text) || ', ' ||
    generations_used || ', ' ||
    job_scrapes_used || ', ' ||
    interview_preps_used ||
    '),'
FROM usage_tracking;

-- 2. Backup cvs table
SELECT 'INSERT INTO cvs (id, user_id, template_id, content, created_at, updated_at) VALUES ' as backup_line
UNION ALL
SELECT 
    '(' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(template_id) || ', ' ||
    quote_literal(content::text) || ', ' ||
    quote_literal(created_at::text) || ', ' ||
    quote_literal(updated_at::text) ||
    '),'
FROM cvs
LIMIT 100; -- Limit to prevent huge outputs, adjust as needed

-- 3. Backup generations table
SELECT 'INSERT INTO generations (id, user_id, cv_id, job_title, job_description, generated_cv, created_at) VALUES ' as backup_line
UNION ALL
SELECT 
    '(' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(cv_id::text) || ', ' ||
    quote_literal(job_title) || ', ' ||
    quote_literal(job_description) || ', ' ||
    quote_literal(generated_cv::text) || ', ' ||
    quote_literal(created_at::text) ||
    '),'
FROM generations
LIMIT 100; -- Limit to prevent huge outputs, adjust as needed

-- 4. Backup interview_preps table
SELECT 'INSERT INTO interview_preps (id, user_id, job_title, job_description, questions_answers, company_research, created_at) VALUES ' as backup_line
UNION ALL
SELECT 
    '(' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(job_title) || ', ' ||
    quote_literal(job_description) || ', ' ||
    quote_literal(questions_answers::text) || ', ' ||
    quote_literal(company_research::text) || ', ' ||
    quote_literal(created_at::text) ||
    '),'
FROM interview_preps;

-- 5. Backup cover_letters table
SELECT 'INSERT INTO cover_letters (id, user_id, cv_id, job_title, company_name, content, created_at) VALUES ' as backup_line
UNION ALL
SELECT 
    '(' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(cv_id::text) || ', ' ||
    quote_literal(job_title) || ', ' ||
    quote_literal(company_name) || ', ' ||
    quote_literal(content::text) || ', ' ||
    quote_literal(created_at::text) ||
    '),'
FROM cover_letters;

-- ============================================
-- ALTERNATIVE: Use pg_dump for full backup
-- Run this from your local machine with Supabase connection string
-- ============================================

/*
-- Full database backup (run from command line):
pg_dump "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" > backup.sql

-- Backup specific tables only:
pg_dump -t cvs -t generations -t usage_tracking "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" > backup.sql

-- Backup schema only (no data):
pg_dump --schema-only "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" > schema.sql

-- Backup data only (no schema):
pg_dump --data-only "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" > data.sql
*/
