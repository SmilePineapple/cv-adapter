# Section Deletion Bug Fix - Dec 9, 2025

## Problem
**Critical UX Issue**: When users delete sections (like "Groups" or "Hobbies") in the CV editor, the deleted sections reappear when they download the CV.

**Customer Impact**: 
- Paying customers frustrated ("Total waste of money")
- Requesting subscription cancellations
- Loss of trust in the product

## Root Cause
The export and download systems were using the wrong data source:

1. **Editor deletes section** → Removes from `cv_sections` table ✅
2. **Export API fetches data** → Uses `generation.output_sections` ❌
3. **Download page preview** → Merges `original` + `modified` sections ❌
4. **Result**: Deleted sections reappear because they still exist in `output_sections` ❌

### Why This Happened
The `cv_sections` table is the **source of truth** for edited CVs, but:
- Export API was using `generation.output_sections` as primary source
- Download page was merging original + modified sections
- Neither checked if sections were deleted in `cv_sections`

## Solution
Changed both export API and download preview to use `cv_sections` table as the **primary source of truth**:

### 1. Export API (`/api/export/route.ts`)
**Before:**
```typescript
// Started with generation.output_sections
const completeSections = [...modifiedSections]

// Then overrode specific sections (hobbies, skills)
if (latestHobbies) {
  // Override hobbies...
}
```

**After:**
```typescript
// Fetch ALL current sections from cv_sections
const { data: currentSections } = await supabase
  .from('cv_sections')
  .select('section_type, title, content, order_index, hobby_icons')
  .eq('cv_id', cvId)
  .order('order_index')

// Use cv_sections as primary source if available
if (currentSections && currentSections.length > 0) {
  completeSections = currentSections.map(section => ({
    type: section.section_type,
    content: section.hobby_icons || section.content,
    order: section.order_index
  }))
} else {
  // Fallback to generation output_sections
  completeSections = [...modifiedSections]
}
```

### 2. Download Preview (`/download/[id]/page.tsx`)
**Before:**
```typescript
// Merged original + modified sections
const mergedSections = originalSections.map(originalSection => {
  const modifiedSection = modifiedSections.find(...)
  return modifiedSection || originalSection
})

// Added new sections from modifications
modifiedSections.forEach(modSection => {
  if (!originalSections.find(...)) {
    mergedSections.push(modSection)
  }
})
```

**After:**
```typescript
// Fetch ALL current sections from cv_sections
const { data: currentSections } = await supabase
  .from('cv_sections')
  .select('section_type, title, content, order_index, hobby_icons')
  .eq('cv_id', generation.cv_id)
  .order('order_index')

if (currentSections && currentSections.length > 0) {
  // Use cv_sections as source of truth
  finalSections = currentSections.map(section => ({
    type: section.section_type,
    content: section.hobby_icons || section.content,
    order: section.order_index
  }))
} else {
  // Fallback to generation output_sections
  finalSections = generation.output_sections?.sections || []
}
```

## Files Modified
1. ✅ `src/app/api/export/route.ts` - Export API now uses cv_sections
2. ✅ `src/app/download/[id]/page.tsx` - Download preview uses cv_sections

## Testing Checklist
- [ ] Delete a section in editor (e.g., "Hobbies")
- [ ] Verify section is removed from cv_sections table
- [ ] Download CV as DOCX
- [ ] Verify deleted section does NOT appear in download
- [ ] Preview CV on download page
- [ ] Verify deleted section does NOT appear in preview
- [ ] Test with multiple section deletions
- [ ] Test with orphaned generations (cv_id = NULL)

## Expected Behavior After Fix
1. User deletes "Hobbies" section in editor
2. Section removed from `cv_sections` table
3. Download preview shows CV without "Hobbies" ✅
4. Downloaded DOCX does not include "Hobbies" ✅
5. User is happy, keeps subscription ✅

## Customer Communication
See `customer-response-section-deletion.md` for email template to affected customer.

## Prevention
- Always use `cv_sections` table as source of truth for edited CVs
- Only fall back to `generation.output_sections` if cv_sections is empty
- Add integration test for section deletion workflow
- Monitor customer feedback for similar issues

## Status
✅ Code fixed
✅ Documentation created
⏳ Needs deployment
⏳ Needs customer response
⏳ Needs testing verification
