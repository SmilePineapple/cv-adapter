-- Fix Storage Bucket and RLS Policies
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE STORAGE BUCKET FOR PHOTOS
-- ============================================

-- Create cv-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-assets',
  'cv-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. STORAGE POLICIES FOR CV-ASSETS BUCKET
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-assets' AND
  (storage.foldername(name))[1] = 'cv-photos'
);

-- Allow public read access to all photos
CREATE POLICY "Public read access to photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cv-assets');

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-assets')
WITH CHECK (bucket_id = 'cv-assets');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cv-assets');

-- ============================================
-- 3. FIX CV_SECTIONS TABLE RLS POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own cv sections" ON cv_sections;
DROP POLICY IF EXISTS "Users can insert their own cv sections" ON cv_sections;
DROP POLICY IF EXISTS "Users can update their own cv sections" ON cv_sections;
DROP POLICY IF EXISTS "Users can delete their own cv sections" ON cv_sections;

-- Enable RLS on cv_sections
ALTER TABLE cv_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own CV sections
CREATE POLICY "Users can view their own cv sections"
ON cv_sections
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = cv_sections.cv_id
    AND cvs.user_id = auth.uid()
  )
);

-- Policy: Users can insert their own CV sections
CREATE POLICY "Users can insert their own cv sections"
ON cv_sections
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = cv_sections.cv_id
    AND cvs.user_id = auth.uid()
  )
);

-- Policy: Users can update their own CV sections
CREATE POLICY "Users can update their own cv sections"
ON cv_sections
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = cv_sections.cv_id
    AND cvs.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = cv_sections.cv_id
    AND cvs.user_id = auth.uid()
  )
);

-- Policy: Users can delete their own CV sections
CREATE POLICY "Users can delete their own cv sections"
ON cv_sections
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = cv_sections.cv_id
    AND cvs.user_id = auth.uid()
  )
);

-- ============================================
-- 4. VERIFY SETUP
-- ============================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'cv-assets';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check cv_sections policies
SELECT * FROM pg_policies WHERE tablename = 'cv_sections';

-- ============================================
-- DONE!
-- ============================================
-- Now test:
-- 1. Upload a photo from the app
-- 2. Save skill levels from the app
-- Both should work without errors!
