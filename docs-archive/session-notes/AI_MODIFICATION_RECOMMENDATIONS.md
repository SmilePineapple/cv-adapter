# AI CV Modification - Current State & Recommendations

## Current Behavior

### Sections Currently Modified by AI:
- ✅ **Work Experience** - Descriptions/responsibilities are rewritten to match job

### Sections Currently Preserved (Unchanged):
- ❌ Professional Summary
- ❌ Skills
- ❌ Interests  
- ❌ Personal Details
- ❌ Certifications
- ❌ Education
- ❌ Job Titles & Company Names (preserved by design)

## Issues Identified

### 1. ATS Score Not Showing
**Problem**: ATS scores aren't being calculated or stored during CV generation

**Root Cause**: The `/api/rewrite` endpoint doesn't calculate ATS scores

**Solution Needed**:
```typescript
// Add ATS score calculation after AI generation
const atsScore = calculateATSScore(generatedSections, jobDescription)

// Save with generation
await supabase.from('generations').insert({
  ...generationData,
  ats_score: atsScore
})
```

**ATS Score Calculation Logic**:
- Keyword matching (40 points)
- Section completeness (20 points)
- Formatting quality (20 points)
- Length appropriateness (10 points)
- Action verbs usage (10 points)

### 2. Limited Section Modification
**Problem**: Only work experience is modified, missing opportunities to tailor:
- Professional summary
- Skills section

## Recommendations

### **Sections That SHOULD Be Modified:**

#### 1. Professional Summary ⭐ HIGH PRIORITY
**Why**: This is the first thing recruiters read
**How**: Rewrite to emphasize skills/experience relevant to target job
**Example**:
- Original: "Experienced professional with diverse background"
- Tailored: "Results-driven Spa Therapist with NVQ 2 & 3 certifications..."

#### 2. Skills Section ⭐ HIGH PRIORITY  
**Why**: ATS systems scan for keyword matches
**How**: Reorder skills to prioritize those in job description, add relevant keywords
**Example**:
- Original: [General skills list]
- Tailored: [Job-specific skills first, then supporting skills]

#### 3. Work Experience ✅ ALREADY DONE
**Current**: Descriptions rewritten to match job
**Keep**: This is working well

### **Sections That Should STAY Unchanged:**

#### 1. Interests ✅
**Why**: Personal preferences, not job-specific
**Exception**: Could be optional if user wants to show culture fit

#### 2. Certifications ✅
**Why**: These are facts that cannot be changed

#### 3. Education ✅
**Why**: These are facts that cannot be changed

#### 4. Personal Details ✅
**Why**: Contact information must remain accurate

#### 5. Job Titles & Company Names ✅
**Why**: These are verifiable facts (already preserved)

## Proposed Implementation

### Option 1: Automatic (Recommended for MVP)
**Modify by default**:
- Professional Summary
- Skills
- Work Experience

**Preserve**:
- Everything else

**Pros**: Simple, works for 90% of users
**Cons**: No customization

### Option 2: User Selection (Better UX)
**Add checkboxes on Generate page**:
```
☑ Modify Professional Summary
☑ Modify Skills  
☑ Modify Work Experience
☐ Modify Interests (optional)
```

**Pros**: User control, flexibility
**Cons**: More complex UI, more decisions for user

### Option 3: Smart Defaults + Override
**Default behavior**: Modify summary, skills, experience
**Add button**: "Advanced Options" → Show checkboxes

**Pros**: Best of both worlds
**Cons**: Slightly more complex

## Revert Functionality

### Current State
- ❌ No way to revert changes
- ❌ Original CV is preserved in database but not accessible

### Recommended Solution

#### 1. Add "Revert to Original" Button
**Location**: Review page (`/review/[id]`)

**Functionality**:
```typescript
const handleRevert = async (sectionType: string) => {
  // Fetch original section from cvs table
  const original = await getOriginalSection(cvId, sectionType)
  
  // Replace modified with original
  updateSection(sectionType, original)
  
  toast.success('Section reverted to original')
}
```

#### 2. Show Original vs Modified
**UI Enhancement**:
```
[Work Experience]
[Original] [Modified] [Revert]

Toggle to see:
- What was changed
- Revert individual sections
- Revert all
```

#### 3. Version History (Future Enhancement)
- Keep multiple versions
- Allow switching between them
- "Save as draft" before finalizing

## Implementation Priority

### Phase 1: Critical (Do Now)
1. ✅ Fix cover letter hallucinations (DONE)
2. ⏳ Add ATS score calculation
3. ⏳ Modify Professional Summary by default
4. ⏳ Modify Skills section by default

### Phase 2: Important (Next)
5. Add "Revert" buttons on review page
6. Show original vs modified comparison
7. Add section selection checkboxes

### Phase 3: Nice to Have (Later)
8. Version history
9. Save drafts
10. A/B testing different versions

## Code Changes Needed

### 1. Update `/api/rewrite` to Modify More Sections
```typescript
// Current: Only modifies experience
// New: Also modify summary and skills

const sectionsToModify = ['experience', 'summary', 'skills']

const prompt = `
Modify these sections to match the job:
1. Professional Summary - Rewrite to emphasize relevant experience
2. Skills - Reorder and highlight job-relevant skills
3. Work Experience - Tailor descriptions (already doing this)
`
```

### 2. Add ATS Score Calculation
```typescript
function calculateATSScore(sections, jobDescription): number {
  let score = 0
  
  // Keyword matching (40 points)
  const keywords = extractKeywords(jobDescription)
  const matchedKeywords = countMatches(sections, keywords)
  score += (matchedKeywords / keywords.length) * 40
  
  // Section completeness (20 points)
  const requiredSections = ['summary', 'experience', 'skills']
  const hasAllSections = requiredSections.every(s => sections[s])
  score += hasAllSections ? 20 : 10
  
  // Formatting (20 points)
  score += checkFormatting(sections)
  
  // Length (10 points)
  score += checkLength(sections)
  
  // Action verbs (10 points)
  score += countActionVerbs(sections)
  
  return Math.round(score)
}
```

### 3. Add Revert Functionality
```typescript
// On review page
const handleRevertSection = async (sectionType: string) => {
  const { data: originalCV } = await supabase
    .from('cvs')
    .select('parsed_sections')
    .eq('id', cvId)
    .single()
  
  const originalSection = originalCV.parsed_sections.sections
    .find(s => s.type === sectionType)
  
  // Update generation with original
  await updateGenerationSection(generationId, sectionType, originalSection)
}
```

## Summary

**Immediate Actions**:
1. Add ATS score calculation to fix dashboard display
2. Modify Professional Summary and Skills sections by default
3. Add simple "Revert to Original" button on review page

**Future Enhancements**:
4. Add section selection checkboxes
5. Show side-by-side comparison
6. Version history

This will give users more control while keeping the UX simple and intuitive.
