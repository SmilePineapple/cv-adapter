# 🔧 Fix Photo Upload & Skill Save Errors

## 🚨 Issues Identified

### 1. Photo Upload Error
```
StorageApiError: Bucket not found
Failed to upload photo
```
**Cause**: The `cv-assets` storage bucket doesn't exist in Supabase

### 2. Skill Save Error
```
406 status on cv_sections table
Failed to save skill levels
```
**Cause**: Missing or incorrect RLS (Row Level Security) policies on `cv_sections` table

---

## ✅ Solution

### Step 1: Run SQL Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file: `migrations/fix-storage-and-rls.sql`
4. Copy all the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run**

### Step 2: Verify Setup

After running the migration, verify:

**Check Storage Bucket**:
```sql
SELECT * FROM storage.buckets WHERE id = 'cv-assets';
```
Should return 1 row with bucket details.

**Check Storage Policies**:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```
Should show 4 policies for cv-assets bucket.

**Check cv_sections Policies**:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'cv_sections';
```
Should show 4 policies (SELECT, INSERT, UPDATE, DELETE).

---

## 📝 What the Migration Does

### 1. Creates cv-assets Storage Bucket
- **Name**: `cv-assets`
- **Public**: Yes (for photo URLs)
- **Size Limit**: 5MB
- **Allowed Types**: JPEG, JPG, PNG, WebP

### 2. Sets Up Storage Policies
- ✅ Users can upload photos to `cv-photos/` folder
- ✅ Public read access to all photos
- ✅ Users can update their own photos
- ✅ Users can delete their own photos

### 3. Fixes cv_sections RLS Policies
- ✅ Users can view their own CV sections
- ✅ Users can insert their own CV sections
- ✅ Users can update their own CV sections
- ✅ Users can delete their own CV sections

All policies check that the CV belongs to the authenticated user via `cvs.user_id = auth.uid()`.

---

## 🧪 Testing

### Test Photo Upload:
1. Go to download page
2. Expand "📸 Upload Your Photo" section
3. Upload a photo
4. Should see success message
5. Photo should appear in preview

### Test Skill Save:
1. Go to download page (with skill-based template)
2. Expand "🎯 Adjust Skill Levels" section
3. Adjust some skill sliders
4. Click "Save"
5. Should see "Skill levels saved successfully!"

---

## 🔍 Troubleshooting

### If Photo Upload Still Fails:

**Check bucket exists**:
```sql
SELECT * FROM storage.buckets WHERE id = 'cv-assets';
```

**Check storage policies**:
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

**Manually create bucket** (if needed):
1. Go to Supabase Dashboard > Storage
2. Click "New bucket"
3. Name: `cv-assets`
4. Public: Yes
5. File size limit: 5242880 (5MB)
6. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp

### If Skill Save Still Fails:

**Check RLS is enabled**:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cv_sections';
```
`rowsecurity` should be `true`.

**Check policies exist**:
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'cv_sections';
```
Should show 4 policies.

**Check user has CVs**:
```sql
SELECT id, user_id 
FROM cvs 
WHERE user_id = auth.uid();
```
Should return at least 1 CV.

---

## 📊 Database Schema

### cv_sections Table
```sql
CREATE TABLE cv_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  content JSONB,
  hobby_icons JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Bucket
```
cv-assets/
  └── cv-photos/
      └── {cv_id}-{timestamp}.{ext}
```

---

## ✅ Expected Results

After running the migration:

1. **Photo Upload**: ✅ Works
2. **Skill Save**: ✅ Works
3. **No 406 errors**: ✅ Fixed
4. **No 400 errors**: ✅ Fixed
5. **No "Bucket not found"**: ✅ Fixed

---

## 🚀 Status

**Migration File**: `migrations/fix-storage-and-rls.sql`
**Ready to Run**: Yes
**Risk**: Low (only creates/updates policies)
**Time**: 30 seconds

**Run the migration in Supabase SQL Editor and both issues will be fixed!** 🎉
