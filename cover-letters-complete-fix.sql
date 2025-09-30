-- Complete fix for cover_letters table schema
-- Run this in Supabase SQL Editor

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add company_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'company_name') THEN
        ALTER TABLE cover_letters ADD COLUMN company_name TEXT;
        RAISE NOTICE 'Added company_name column';
    END IF;
    
    -- Add job_title if it doesn't exist (rename from position_title if needed)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cover_letters' AND column_name = 'position_title')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        ALTER TABLE cover_letters RENAME COLUMN position_title TO job_title;
        RAISE NOTICE 'Renamed position_title to job_title';
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        ALTER TABLE cover_letters ADD COLUMN job_title TEXT;
        RAISE NOTICE 'Added job_title column';
    END IF;
    
    -- Add hiring_manager_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'hiring_manager_name') THEN
        ALTER TABLE cover_letters ADD COLUMN hiring_manager_name TEXT;
        RAISE NOTICE 'Added hiring_manager_name column';
    END IF;
    
    -- Add length if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'length') THEN
        ALTER TABLE cover_letters ADD COLUMN length TEXT DEFAULT 'short';
        RAISE NOTICE 'Added length column';
    END IF;
    
    -- Add tone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'tone') THEN
        ALTER TABLE cover_letters ADD COLUMN tone TEXT DEFAULT 'professional';
        RAISE NOTICE 'Added tone column';
    END IF;
END $$;

-- Verify all columns exist
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'company_name') THEN
        missing_columns := missing_columns || 'company_name, ';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        missing_columns := missing_columns || 'job_title, ';
    END IF;
    
    IF missing_columns != '' THEN
        RAISE EXCEPTION 'Missing columns: %', missing_columns;
    ELSE
        RAISE NOTICE 'All required columns exist in cover_letters table';
    END IF;
END $$;
