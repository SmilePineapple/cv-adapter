# 🚀 Next Session Implementation Plan

## ✅ What We've Completed This Session

1. **Hobby Icons Export** - Working!
2. **Photo Support Database** - Ready!
3. **Smart Language Extraction** - Implemented!
4. **Sticky Header** - Done!
5. **Dashboard Button Top** - Fixed!

---

## 🎯 Next Session Tasks (In Order)

### Task 1: Side-by-Side Layout (30 minutes)
**Goal**: Templates on left, preview on right, no scrolling

**Implementation**:
```typescript
// Replace main content div with:
<div className="flex h-[calc(100vh-140px)]">
  {/* Left: Templates (320px fixed) */}
  <aside className="w-80 bg-white border-r overflow-y-auto">
    <div className="p-4">
      <h2>Templates</h2>
      {/* Template cards here */}
    </div>
  </aside>
  
  {/* Right: Preview (flex-1) */}
  <main className="flex-1 flex flex-col">
    <div className="flex-1 p-6 overflow-auto">
      <iframe srcDoc={previewHtml} className="w-full h-full" />
    </div>
    <div className="p-4 border-t bg-white">
      {/* Format selector */}
    </div>
  </main>
</div>
```

**Files**: `src/app/download/[id]/page.tsx`

---

### Task 2: Template Thumbnails (20 minutes)
**Goal**: Visual preview cards for each template

**Implementation**:
```typescript
// Template card component
<button
  onClick={() => setSelectedTemplate(template.id)}
  className={`
    w-full p-3 rounded-lg border-2 transition-all
    ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
  `}
>
  {/* Thumbnail */}
  <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
    <img 
      src={`/templates/${template.id}-thumb.png`} 
      alt={template.name}
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Info */}
  <div className="text-left">
    <h3 className="font-semibold text-sm">{template.name}</h3>
    <p className="text-xs text-gray-500">{template.category}</p>
  </div>
  
  {/* Badge */}
  {template.badge && (
    <span className="inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
      {template.badge}
    </span>
  )}
</button>
```

**Files**: 
- `src/app/download/[id]/page.tsx`
- `public/templates/` (add thumbnail images)

---

### Task 3: Instant Preview Updates (15 minutes)
**Goal**: Preview updates immediately when template selected

**Current Issue**: Preview updates but requires scroll

**Fix**:
```typescript
// Remove scroll-to-top logic
useEffect(() => {
  if (generationData) {
    generatePreview() // Just update, don't scroll
  }
}, [generationData, selectedTemplate])

// Preview is always visible in side-by-side layout
// No scrolling needed!
```

**Files**: `src/app/download/[id]/page.tsx`

---

### Task 4: Photo Upload UI (45 minutes)
**Goal**: Allow users to upload profile photo

**Implementation Steps**:

#### 4.1: Create Photo Upload Component
```typescript
// src/components/PhotoUpload.tsx
'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Camera, Upload, X } from 'lucide-react'

export default function PhotoUpload({ cvId, currentPhotoUrl, onPhotoUploaded }: {
  cvId: string
  currentPhotoUrl?: string
  onPhotoUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentPhotoUrl)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      const supabase = createSupabaseClient()
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${cvId}-${Date.now()}.${fileExt}`
      const filePath = `cv-photos/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cv-assets')
        .getPublicUrl(filePath)

      // Update CV record
      const { error: updateError } = await supabase
        .from('cvs')
        .update({ photo_url: publicUrl })
        .eq('id', cvId)

      if (updateError) throw updateError

      setPreview(publicUrl)
      onPhotoUploaded(publicUrl)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    const supabase = createSupabaseClient()
    await supabase.from('cvs').update({ photo_url: null }).eq('id', cvId)
    setPreview(undefined)
    onPhotoUploaded('')
  }

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
      </div>
    </div>
  )
}
```

#### 4.2: Add to Dashboard or Upload Page
```typescript
// In src/app/dashboard/page.tsx or src/app/upload/page.tsx
import PhotoUpload from '@/components/PhotoUpload'

// Add to UI:
<PhotoUpload 
  cvId={cv.id}
  currentPhotoUrl={cv.photo_url}
  onPhotoUploaded={(url) => {
    // Refresh data or update state
    console.log('Photo uploaded:', url)
  }}
/>
```

#### 4.3: Setup Supabase Storage
```sql
-- In Supabase Dashboard > Storage
-- Create bucket: cv-assets
-- Set to public
-- Add RLS policies:

-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cv-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cv-assets');
```

**Files**:
- `src/components/PhotoUpload.tsx` (NEW)
- `src/app/dashboard/page.tsx` (add component)
- Supabase Storage setup

---

## 📊 Implementation Order & Time Estimates

| Task | Time | Priority | Complexity |
|------|------|----------|------------|
| Side-by-Side Layout | 30min | HIGH | Medium |
| Instant Preview | 15min | HIGH | Low |
| Template Thumbnails | 20min | MEDIUM | Low |
| Photo Upload UI | 45min | MEDIUM | Medium |
| **Total** | **110min** | | |

---

## 🎨 Visual Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ [← Dashboard]    [Job Title]              [Export Button]   │ <- Sticky Header
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Templates   │              Live Preview                    │
│  (320px)     │              (Flex-1)                        │
│              │                                              │
│ ┌──────────┐ │  ┌────────────────────────────────────────┐ │
│ │Template 1│ │  │                                        │ │
│ │[Thumb]   │ │  │                                        │ │
│ │Selected  │ │  │        CV Preview                      │ │
│ └──────────┘ │  │        Updates Instantly               │ │
│              │  │                                        │ │
│ ┌──────────┐ │  │                                        │ │
│ │Template 2│ │  │                                        │ │
│ │[Thumb]   │ │  │                                        │ │
│ └──────────┘ │  └────────────────────────────────────────┘ │
│              │                                              │
│ [Scrollable] │  Format: ○ PDF  ○ DOCX  ○ HTML             │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

After implementation:
- [ ] Side-by-side layout works on desktop
- [ ] Template selection updates preview instantly
- [ ] No scrolling needed to see preview
- [ ] Template thumbnails load correctly
- [ ] Photo upload works
- [ ] Photo displays in templates
- [ ] Mobile responsive (stacked layout)
- [ ] All templates still export correctly

---

## 📝 Notes

- Keep existing functionality working
- Test on real CV data
- Mobile: Stack layout (preview on top)
- Add loading states
- Handle errors gracefully

---

**Status**: Ready to implement next session!
**Estimated Time**: ~2 hours total
**Priority**: HIGH - Major UX improvement
