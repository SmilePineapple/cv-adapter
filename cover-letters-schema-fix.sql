-- Fix cover letters table schema to match dashboard expectations
-- This migration renames position_title to job_title for consistency

-- Check if position_title exists and job_title doesn't
DO $$ 
BEGIN
    -- If position_title exists and job_title doesn't, rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cover_letters' AND column_name = 'position_title')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        ALTER TABLE cover_letters RENAME COLUMN position_title TO job_title;
        RAISE NOTICE 'Renamed position_title to job_title';
    END IF;
    
    -- If job_title already exists, we're good
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        RAISE NOTICE 'job_title column already exists';
    END IF;
    
    -- If neither exists, add job_title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cover_letters' AND column_name = 'job_title')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'cover_letters' AND column_name = 'position_title') THEN
        ALTER TABLE cover_letters ADD COLUMN job_title TEXT NOT NULL;
        RAISE NOTICE 'Added job_title column';
    END IF;
END $$;

-- Verify the final structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cover_letters' AND column_name = 'job_title') THEN
        RAISE NOTICE 'Cover letters table schema is correct with job_title column';
    ELSE
        RAISE EXCEPTION 'Failed to create job_title column';
    END IF;
END $$;
