# Page Count Strategy - Content Capacity Analysis

## The Problem

**User expectation**: "I want a 4-page CV"
**Reality**: User's CV only has 2 years of experience with 3,500 chars of content
**Result**: AI either generates fake content OR leaves massive white space

## The Solution: Smart Page Count Recommendation

### Step 1: Analyze Source CV Capacity

Before generation, analyze what the source CV can **truthfully** support:

```typescript
interface CVContentCapacity {
  // Source content metrics
  sourceChars: number
  experienceYears: number
  jobCount: number
  educationCount: number
  skillCount: number
  certificationCount: number
  
  // Expansion potential
  maxTruthfulChars: number      // Max chars without fake content
  recommendedPageCount: number   // Best page count for this CV
  canSupport1Page: boolean
  canSupport2Page: boolean
  canSupport3Page: boolean
  canSupport4Page: boolean
  
  // Density profile
  bulletPointRatio: number
  avgBulletLength: number
  structuralOverhead: number
}

function analyzeContentCapacity(sections: CVSection[]): CVContentCapacity {
  const sourceChars = calculateTotalChars(sections)
  const experienceYears = estimateExperienceYears(sections)
  const jobCount = countJobs(sections)
  
  // Calculate expansion potential
  // Each job can expand to ~800-1200 chars (detailed bullets + context)
  // Summary can expand to ~600-1200 chars
  // Skills can expand to ~800-1500 chars (with context)
  // Education can expand to ~400-800 chars per entry
  
  const maxJobExpansion = jobCount * 1000
  const maxSummaryExpansion = 1000
  const maxSkillsExpansion = 1200
  const maxEducationExpansion = educationCount * 600
  
  const maxTruthfulChars = sourceChars + maxJobExpansion + maxSummaryExpansion + 
                           maxSkillsExpansion + maxEducationExpansion
  
  // Recommend page count based on capacity
  let recommendedPageCount = 1
  if (maxTruthfulChars >= 8000) recommendedPageCount = 2
  if (maxTruthfulChars >= 14000) recommendedPageCount = 3
  if (maxTruthfulChars >= 20000) recommendedPageCount = 4
  
  return {
    sourceChars,
    experienceYears,
    jobCount,
    educationCount: countEducation(sections),
    skillCount: countSkills(sections),
    certificationCount: countCertifications(sections),
    maxTruthfulChars,
    recommendedPageCount,
    canSupport1Page: maxTruthfulChars >= 3900,
    canSupport2Page: maxTruthfulChars >= 8000,
    canSupport3Page: maxTruthfulChars >= 14000,
    canSupport4Page: maxTruthfulChars >= 20000,
    bulletPointRatio: calculateBulletRatio(sections),
    avgBulletLength: calculateAvgBulletLength(sections),
    structuralOverhead: estimateStructuralOverhead(sections)
  }
}
```

### Step 2: Warn User if Page Count is Unrealistic

**Before generation**, show warning if selected page count exceeds capacity:

```typescript
// In generate page UI
const capacity = analyzeContentCapacity(cvSections)

if (selectedPageCount > capacity.recommendedPageCount) {
  showWarning({
    title: "Page count may be too high",
    message: `Based on your CV content, we recommend ${capacity.recommendedPageCount} page(s). 
              A ${selectedPageCount}-page CV may have visible white space.`,
    action: "Use recommended page count",
    onConfirm: () => setPageCount(capacity.recommendedPageCount)
  })
}
```

### Step 3: Page-Count-Specific Density Adjustments

Each page count needs different density handling:

#### 1-Page CV Strategy

**Goal**: Fit everything on one page, no white space, no overflow

**Approach**:
- Target: 4,800 chars (80-90% occupancy)
- If source > 5,500 chars: Condense aggressively
- If source < 4,000 chars: Expand moderately
- Density adjustment: Minimal (content must fit)

```typescript
function get1PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  return {
    targetChars: 4800,
    minChars: 3900,
    maxChars: 5600,
    densityMultiplier: capacity.bulletPointRatio > 0.7 ? 1.15 : 1.0,
    contentHints: "Use concise bullets (15-20 words). Prioritize strongest achievements.",
    allowGeneration: false, // No optional sections
    compressionPriority: capacity.sourceChars > 5500
  }
}
```

#### 2-Page CV Strategy

**Goal**: Fill both pages evenly (85-92% each)

**Approach**:
- Target: 10,000 chars total
- Page 1: 5,400 chars (single-column)
- Page 2: 8,200 chars (two-column)
- If capacity < 8,000: Warn user or auto-downgrade to 1 page
- If capacity 8,000-13,000: Perfect fit
- If capacity > 13,000: Condense or suggest 3 pages

```typescript
function get2PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  if (capacity.maxTruthfulChars < 8000) {
    return {
      warning: "Your CV content is better suited for 1 page",
      autoDowngrade: true,
      targetPageCount: 1
    }
  }
  
  const densityMultiplier = capacity.bulletPointRatio > 0.7 ? 1.2 : 1.0
  
  return {
    targetChars: 10000,
    minChars: 8000,
    maxChars: 13000,
    densityMultiplier,
    contentHints: capacity.bulletPointRatio > 0.7
      ? "Use detailed bullets (30-40 words each). Expand each job with 5-7 comprehensive bullet points."
      : "Use paragraph format for experience. Add context and outcomes.",
    allowGeneration: true, // Can add projects, hobbies if needed
    page1Target: 5400,
    page2Target: 8200
  }
}
```

#### 3-Page CV Strategy

**Goal**: Fill pages 1-2 fully (85-92%), page 3 acceptably (70-85%)

**Approach**:
- Target: 16,000 chars total
- Page 1: 5,400 chars (single-column, summary + experience start)
- Page 2: 6,200 chars (single-column, experience continuation)
- Page 3: 8,200 chars (two-column, skills/education/certs/projects)
- If capacity < 14,000: Warn or suggest 2 pages
- If capacity 14,000-20,000: Good fit
- If capacity > 20,000: Suggest 4 pages

```typescript
function get3PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  if (capacity.maxTruthfulChars < 14000) {
    return {
      warning: "Your CV content is better suited for 2 pages",
      autoDowngrade: true,
      targetPageCount: 2
    }
  }
  
  const densityMultiplier = capacity.bulletPointRatio > 0.7 ? 1.25 : 1.05
  
  return {
    targetChars: 16000,
    minChars: 13000,
    maxChars: 20000,
    densityMultiplier,
    contentHints: "Expand experience with detailed context. Add achievements section with quantified results. Include relevant projects.",
    allowGeneration: true,
    optionalSections: ['achievements', 'projects'],
    page1Target: 5400,
    page2Target: 6200,
    page3Target: 8200
  }
}
```

#### 4-Page CV Strategy

**Goal**: Fill pages 1-3 fully (85-92%), page 4 acceptably (65-80%)

**Approach**:
- Target: 22,000 chars total
- Page 1: 5,600 chars (experience)
- Page 2: 8,200 chars (summary + skills, two-column)
- Page 3: 8,200 chars (achievements + projects, two-column)
- Page 4: 8,200 chars (education + certs + additional, two-column)
- If capacity < 20,000: Warn or suggest 3 pages
- If capacity >= 20,000: Good fit

```typescript
function get4PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  if (capacity.maxTruthfulChars < 20000) {
    return {
      warning: "Your CV content is better suited for 3 pages",
      autoDowngrade: true,
      targetPageCount: 3
    }
  }
  
  const densityMultiplier = capacity.bulletPointRatio > 0.7 ? 1.3 : 1.1
  
  return {
    targetChars: 22000,
    minChars: 18000,
    maxChars: 28000,
    densityMultiplier,
    contentHints: "Comprehensive detail for senior roles. Each job should have 7-10 detailed bullets. Add achievements, projects, and additional information sections.",
    allowGeneration: true,
    optionalSections: ['achievements', 'projects', 'additional_information'],
    page1Target: 5600,
    page2Target: 8200,
    page3Target: 8200,
    page4Target: 8200
  }
}
```

### Step 4: Template Simplification - Creative Modern Only

**Current state**: 14 templates, page-plan renderer overrides most for multi-page

**New approach**: Focus on Creative Modern template exclusively

**Benefits**:
1. Single template = predictable rendering
2. Can fine-tune density for this specific template
3. Simpler testing and validation
4. Faster iteration

**Template characteristics** (Creative Modern):
- Two-column layout for pages 2+
- Orange accent color (#f6ad55)
- Circular decorative elements
- Clean, modern typography
- 10px base font size

**Density calibration for Creative Modern**:
```typescript
const CREATIVE_MODERN_DENSITY = {
  singleColumnCharsPerPage: 5400,  // Page 1
  twoColumnCharsPerPage: 7200,     // Pages 2+
  headingOverhead: 15,             // mm per section heading
  bulletOverhead: 4,               // mm per bullet point
  paragraphDensity: 1.35,          // chars per mm for paragraphs
  bulletDensity: 0.95              // chars per mm for bullets
}
```

## Implementation Plan (Revised)

### Phase 1: Content Capacity Analyzer (3 days)

**File**: `src/lib/cv-capacity-analyzer.ts`

**Functions**:
1. `analyzeContentCapacity()` - Main analysis
2. `estimateExperienceYears()` - Parse dates
3. `countJobs()` - Count experience entries
4. `calculateMaxExpansion()` - Predict max truthful chars
5. `recommendPageCount()` - Suggest best page count

**Tests**: Test with 10 real CVs (junior, mid, senior)

### Phase 2: Page-Count-Specific Strategies (2 days)

**File**: `src/lib/page-count-strategies.ts`

**Functions**:
1. `get1PageStrategy()`
2. `get2PageStrategy()`
3. `get3PageStrategy()`
4. `get4PageStrategy()`
5. `getStrategyForPageCount()` - Router

**Integration**: Update `src/app/api/rewrite/route.ts` to use strategies

### Phase 3: UI Warning System (1 day)

**File**: `src/app/generate/[id]/page.tsx`

**Add**:
- Capacity analysis on page load
- Warning banner if selected page count > recommended
- "Use recommended" button
- Explanation tooltip

### Phase 4: Template Cleanup (1 day)

**Files to modify**:
- `src/app/download/[id]/page.tsx` - Show only Creative Modern
- `src/lib/page-plan-renderer.ts` - Remove other template themes
- `src/lib/advanced-templates.ts` - Keep only Creative Modern

**Remove**:
- Professional Columns template
- All industry templates
- All stunning templates

**Keep**:
- Creative Modern (primary)
- Page-plan renderer (for multi-page)

### Phase 5: Creative Modern Density Calibration (2 days)

**File**: `src/lib/creative-modern-density.ts`

**Calibrate**:
1. Measure actual rendering with 20 test CVs
2. Calculate chars-per-mm for bullets vs paragraphs
3. Measure heading overhead
4. Update density multipliers
5. Test with all page counts (1/2/3/4)

### Phase 6: Integration & Testing (3 days)

**Test matrix**:

| CV Type | Source Chars | Page Count | Expected Occupancy | Pass/Fail |
|---------|--------------|------------|-------------------|-----------|
| Junior  | 3,500        | 1          | 80-90%            |           |
| Junior  | 3,500        | 2          | Warning shown     |           |
| Mid     | 6,500        | 1          | Condensed         |           |
| Mid     | 6,500        | 2          | 85-92% both pages |           |
| Mid     | 6,500        | 3          | Warning shown     |           |
| Senior  | 12,000       | 2          | 85-92% both pages |           |
| Senior  | 12,000       | 3          | 85-92% pages 1-2  |           |
| Senior  | 12,000       | 4          | Warning shown     |           |
| Expert  | 18,000       | 3          | 85-92% pages 1-2  |           |
| Expert  | 18,000       | 4          | 85-92% pages 1-3  |           |

**Success criteria**: 90%+ of CVs hit target occupancy

## Timeline

- **Week 1**: Phases 1-2 (capacity analyzer + strategies)
- **Week 2**: Phases 3-5 (UI warnings + template cleanup + calibration)
- **Week 3**: Phase 6 (testing + refinement)
- **Week 4**: Production rollout + monitoring

**Total**: 3-4 weeks to complete solution

## Expected Results

### Before
- 2-page CV with 3,500 chars: 65%/45% occupancy ❌
- 3-page CV with 6,500 chars: 70%/65%/30% occupancy ❌
- User selects 4 pages for junior CV: Massive white space ❌

### After
- 2-page CV with 3,500 chars: **Warning shown**, suggests 1 page ✅
- 2-page CV with 8,500 chars: 88%/88% occupancy ✅
- 3-page CV with 15,000 chars: 88%/88%/75% occupancy ✅
- User selects 4 pages for junior CV: **Warning shown**, suggests 2 pages ✅

**Key improvement**: Users can't select unrealistic page counts that create white space!
