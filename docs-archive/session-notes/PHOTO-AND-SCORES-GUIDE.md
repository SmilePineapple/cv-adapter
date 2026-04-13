# 📸 Photo Upload & Skill Scores - Complete Guide

## ✅ Issues Fixed

### 1. Personal Info Not Showing ✅ FIXED
**Problem**: Contact details (name, email, phone) not appearing in templates
**Root Cause**: Languages section was using 'skills' instead of 'languages'
**Fix**: Updated export API to correctly fetch languages section
**Status**: ✅ Deployed

### 2. Photo URL Not Passing ✅ FIXED  
**Problem**: Photos not showing in templates
**Root Cause**: photo_url not being fetched or passed to templates
**Fix**: 
- Added photo_url to database query
- Passed photoUrl to handlePdfExport function
- Templates now receive photoUrl
**Status**: ✅ Deployed

### 3. Skill Scores Editor ⚠️ NEEDS UI
**Problem**: No way for users to edit skill/language proficiency scores
**Status**: ❌ UI not built yet (see implementation below)

---

## 📍 Where Users Upload Photos

### Current Location:
**Dashboard > Overview Tab**

**How it works**:
1. User goes to Dashboard
2. Clicks "Overview" tab
3. PhotoUpload component shows for first CV
4. Upload photo (max 5MB)
5. Photo saved to Supabase Storage
6. Photo URL saved to `cvs.photo_url`

**Problem**: Not obvious, only shows for first CV

---

## 🎯 Better Solution: Add Photo Upload to Download Page

Users should be able to upload photos right before downloading! Here's how:

### Add to Download Page:

```typescript
// In src/app/download/[id]/page.tsx
// Add after the template slider, before preview

{generationData && generationData.cv_id && (
  <div className="max-w-5xl mx-auto mb-8">
    <PhotoUpload
      cvId={generationData.cv_id}
      currentPhotoUrl={(cvData as any)?.photo_url}
      onPhotoUploaded={() => {
        // Refresh preview
        generatePreview()
      }}
    />
  </div>
)}
```

**Benefits**:
- Upload photo right before download
- See photo in preview immediately
- More intuitive workflow

---

## 📊 Skill Scores Editor - Implementation Needed

### Where Users Need This:
All templates with skill meters/bars:
- Professional Metrics (circular meters)
- Teal Sidebar (skill bars)
- Soft Header (progress bars)
- Artistic Header (skill display)
- Bold Split (skill section)

### Current Behavior:
- Skills extracted from CV text
- Proficiency auto-detected from keywords:
  - "Native/Fluent" → 100%
  - "Advanced/Proficient" → 90%
  - "Intermediate" → 75%
  - "Basic/Beginner" → 50%
  - Default → 70%

### What's Missing:
**Manual override UI** - Users can't adjust scores

---

## 🛠️ Skill Scores Editor - Implementation Plan

### Option 1: Add to Edit Page

Create a new section in `/edit/[cvId]` page:

```typescript
// New component: src/components/SkillScoreEditor.tsx
'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider' // or custom slider

interface Skill {
  name: string
  level: number
}

export default function SkillScoreEditor({ 
  cvId, 
  skills, 
  onUpdate 
}: {
  cvId: string
  skills: Skill[]
  onUpdate: (skills: Skill[]) => void
}) {
  const [editedSkills, setEditedSkills] = useState(skills)

  const updateSkillLevel = (index: number, level: number) => {
    const updated = [...editedSkills]
    updated[index].level = level
    setEditedSkills(updated)
  }

  const handleSave = async () => {
    // Save to database
    const supabase = createSupabaseClient()
    await supabase
      .from('cv_sections')
      .upsert({
        cv_id: cvId,
        section_type: 'skill_scores',
        content: editedSkills
      })
    
    onUpdate(editedSkills)
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-bold mb-4">Adjust Skill Levels</h3>
      <div className="space-y-4">
        {editedSkills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Save Skill Levels
      </button>
    </div>
  )
}
```

### Option 2: Add to Download Page

Add skill editor right on download page for quick adjustments:

```typescript
// In src/app/download/[id]/page.tsx
// Add after photo upload, before preview

{generationData && (
  <div className="max-w-5xl mx-auto mb-8">
    <SkillScoreEditor
      cvId={generationData.cv_id}
      skills={extractedSkills}
      onUpdate={(skills) => {
        // Update preview with new scores
        generatePreview()
      }}
    />
  </div>
)}
```

---

## 🗄️ Database Schema for Skill Scores

### Option A: Store in cv_sections
```sql
-- Use existing cv_sections table
INSERT INTO cv_sections (cv_id, section_type, content)
VALUES (
  'cv-id',
  'skill_scores',
  '[{"name": "JavaScript", "level": 90}, {"name": "Python", "level": 75}]'::jsonb
);
```

### Option B: New table (better)
```sql
CREATE TABLE skill_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skill_scores_cv_id ON skill_scores(cv_id);
```

---

## 🎯 Priority Implementation Order

### High Priority (Do First):
1. ✅ **Fix personal info** - DONE
2. ✅ **Fix photo URL** - DONE
3. **Add photo upload to download page** (15 min)

### Medium Priority (Do Next):
4. **Create SkillScoreEditor component** (30 min)
5. **Add to edit page** (15 min)
6. **Database schema for scores** (10 min)

### Low Priority (Nice to Have):
7. Add language proficiency editor
8. Add visual skill preview
9. Bulk edit mode

---

## 📝 Quick Implementation Checklist

**To Add Photo Upload to Download Page**:
- [ ] Import PhotoUpload component
- [ ] Add after template slider
- [ ] Pass cvId and photo_url
- [ ] Refresh preview on upload

**To Add Skill Score Editor**:
- [ ] Create SkillScoreEditor component
- [ ] Add range sliders for each skill
- [ ] Save to database
- [ ] Update templates to use saved scores

---

## 🚀 Status

**Fixed**:
- ✅ Personal info now shows in templates
- ✅ Photo URL passed to templates
- ✅ Languages section correctly fetched

**Needs Implementation**:
- ❌ Photo upload on download page
- ❌ Skill score editor UI
- ❌ Language proficiency editor

**Time Estimate**:
- Photo upload: 15 minutes
- Skill editor: 1 hour total

---

**Next Steps**: Implement photo upload on download page, then skill score editor!
