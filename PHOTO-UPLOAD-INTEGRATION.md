# 📸 Photo Upload Integration Guide

## ✅ Setup Complete

**Supabase Storage**: ✅ Bucket created
**Component**: ✅ PhotoUpload.tsx ready
**Database**: ✅ photo_url column exists

---

## 🚀 Quick Integration

### Option 1: Add to Dashboard (Recommended)

```typescript
// In src/app/dashboard/page.tsx
import PhotoUpload from '@/components/PhotoUpload'

// In the CVs tab, add a button to expand photo section:
<button
  onClick={() => setExpandedCvId(expandedCvId === cv.id ? null : cv.id)}
  className="text-sm text-blue-600 hover:text-blue-700"
>
  {expandedCvId === cv.id ? 'Hide' : 'Add'} Photo
</button>

// Then conditionally show PhotoUpload:
{expandedCvId === cv.id && (
  <div className="mt-4 pt-4 border-t">
    <PhotoUpload
      cvId={cv.id}
      currentPhotoUrl={cv.photo_url}
      onPhotoUploaded={(url) => {
        // Refresh CVs or update state
        fetchData()
      }}
    />
  </div>
)}
```

### Option 2: Add to Upload Page

```typescript
// In src/app/upload/page.tsx
// After CV is uploaded, show PhotoUpload component
{uploadedCvId && (
  <PhotoUpload
    cvId={uploadedCvId}
    currentPhotoUrl={null}
    onPhotoUploaded={(url) => {
      console.log('Photo uploaded:', url)
    }}
  />
)}
```

---

## 📝 Usage in Templates

Photos will automatically appear in templates that support them:
- Bold Split template
- Any future templates with photo support

The template checks for `data.photoUrl` and shows photo or placeholder.

---

## ✅ Testing

1. Go to dashboard
2. Click "Add Photo" on a CV
3. Upload image (max 5MB)
4. Generate CV with Bold Split template
5. Photo should appear in PDF!

---

**Status**: Ready to use! Just add the component where needed.
