# Phase 5: Creative Modern Density Calibration Plan

## Current State

### Existing Char Budgets (from `cv-page-blueprints.ts`)

Based on measurements from `page-plan-renderer.ts` default theme:
- Font: 10px
- Line-height: 1.36
- Padding: ~11-12mm
- **Single-column full page**: ≈ 5,400 chars (~4,800 on page 1 after header)
- **Two-column full page**: ≈ 7,200 chars

**Current targets aim for 88-92% fill**

#### 1-Page CV
- **Target**: 4,800 chars
- **Range**: 3,900 - 5,600 chars
- **Layout**: Single-column

#### 2-Page CV
- **Target**: 10,000 chars
- **Range**: 8,000 - 13,000 chars
- **Layout**: Page 1 single-column (5,400 chars), Page 2 two-column (8,200 chars)

#### 3-Page CV
- **Target**: 16,000 chars
- **Range**: 13,000 - 20,000 chars
- **Layout**: Page 1 single-column (5,400), Page 2 single-column (6,200), Page 3 two-column (8,200)

#### 4-Page CV
- **Target**: 22,000 chars
- **Range**: 18,000 - 28,000 chars
- **Layout**: Page 1 single-column (5,600), Pages 2-4 two-column (8,200 each)

## Problem: Are These Budgets Accurate?

### Questions to Answer

1. **Do these char counts actually produce 88-92% page fill?**
   - Current budgets are based on theoretical measurements
   - Need real-world validation with actual CVs

2. **Does content type affect density?**
   - Bullet-heavy content (short lines) → more white space
   - Paragraph content (long lines) → less white space
   - Current budgets don't account for this (but Phase 2 does via density multiplier!)

3. **Are multi-page budgets correct?**
   - 2-page: 10,000 chars → two full pages?
   - 3-page: 16,000 chars → three full pages?
   - 4-page: 22,000 chars → four full pages?

## Calibration Strategy

### Approach: Empirical Testing

**We already have the density multiplier system from Phase 2!**

The issue is: Are the **base budgets** correct?

### Step 1: Test Base Budgets (No Density Adjustment)

**Goal**: Validate that base budgets (before density multiplier) produce correct fill for "average" CVs

**Test CVs**:
- 5 CVs with ~50% bullet ratio (average density)
- Test each at 1, 2, 3, 4 pages
- Measure actual page occupancy

**Expected results** (if budgets are correct):
- 1-page with 4,800 chars → 88-92% fill
- 2-page with 10,000 chars → 88-92% fill per page
- 3-page with 16,000 chars → 88-92% fill per page
- 4-page with 22,000 chars → 88-92% fill per page

**If results are off**:
- Adjust base budgets in `cv-page-blueprints.ts`
- Re-test until correct

### Step 2: Validate Density Multiplier System

**Goal**: Confirm density multiplier correctly adjusts for content type

**Test CVs**:
- 5 bullet-heavy CVs (75%+ bullets)
- 5 paragraph-heavy CVs (25%- bullets)
- Test each at 2 pages (most common)

**Expected results**:
- Bullet-heavy: 10,000 × 1.2 = 12,000 chars → 88-92% fill
- Paragraph-heavy: 10,000 × 0.95 = 9,500 chars → 88-92% fill

**If results are off**:
- Adjust density multiplier in `page-count-strategies.ts`
- Adjust expansion factors in `cv-capacity-analyzer.ts`

### Step 3: Edge Case Testing

**Goal**: Ensure system handles edge cases

**Test scenarios**:
1. **Very sparse CV** (1 job, minimal content)
   - Should warn user
   - Should not generate 4 pages

2. **Very dense CV** (10+ jobs, detailed)
   - Should support 4 pages
   - Should not overflow

3. **Mixed content** (some bullets, some paragraphs)
   - Should calculate average density
   - Should produce correct fill

## Testing Process

### Manual Testing (Recommended for Phase 5)

**Why manual?**
- Need visual inspection of page fill
- Need to see actual white space
- Need to validate professional appearance

**Process**:
1. Upload test CV
2. Select page count
3. Generate CV
4. Export PDF
5. Measure page occupancy visually
6. Record results
7. Adjust budgets if needed
8. Repeat

**Measurement**:
- Visual inspection: "Does this look 85-92% full?"
- Ruler measurement: Measure white space at bottom
- Screenshot comparison: Before/after adjustments

### Automated Testing (Future Enhancement)

**Could implement**:
- Puppeteer script to measure actual rendered height
- Compare to A4 page height (1122.52px)
- Calculate occupancy percentage
- Run on batch of CVs

**Not implementing now because**:
- Manual testing is faster for initial calibration
- Visual quality matters more than exact percentage
- Can automate later for regression testing

## Expected Adjustments

### Likely Findings

Based on the existing system, I predict:

**1-Page CVs**:
- Current: 4,800 chars target
- Likely correct (already well-tested)
- May need minor adjustment (±200 chars)

**2-Page CVs**:
- Current: 10,000 chars target
- Likely needs increase to 11,000-12,000
- Reason: Two-column layout is denser than expected

**3-Page CVs**:
- Current: 16,000 chars target
- Likely needs increase to 17,000-18,000
- Reason: Mix of single and two-column

**4-Page CVs**:
- Current: 22,000 chars target
- Likely needs increase to 24,000-26,000
- Reason: Mostly two-column layout

### Why These Predictions?

**Two-column layouts are denser**:
- Shorter lines → more lines per page
- Less white space between sections
- Can fit more content

**Current budgets may be conservative**:
- Designed to avoid overflow
- May be leaving too much white space
- Can push higher with density multiplier

## Calibration Workflow

### Iteration Process

```
1. Test with current budgets
   ↓
2. Measure page occupancy
   ↓
3. If < 85%: Increase budgets by 10%
   If > 92%: Decrease budgets by 5%
   ↓
4. Re-test
   ↓
5. Repeat until 85-92% achieved
```

### Documentation

For each test:
- CV characteristics (jobs, bullets, chars)
- Page count selected
- Generated char count
- Measured occupancy
- Visual assessment
- Adjustments made

### Success Criteria

**Phase 5 complete when**:
- ✅ 10+ CVs tested across all page counts
- ✅ 90%+ achieve 85-92% occupancy
- ✅ No visible white space issues
- ✅ Professional appearance maintained
- ✅ Budgets documented and committed

## Files to Modify

### Primary

1. **`src/lib/cv-page-blueprints.ts`**
   - Adjust `minTotalChars`, `targetTotalChars`, `maxTotalChars`
   - Adjust zone char targets
   - Adjust section budgets
   - Update calibration notes (lines 64-70)

### Secondary (if needed)

2. **`src/lib/page-count-strategies.ts`**
   - Adjust density multipliers if needed
   - Refine content hints

3. **`src/lib/cv-capacity-analyzer.ts`**
   - Adjust expansion factors if needed
   - Refine page thresholds

## Next Steps

### Immediate Actions

1. **Gather test CVs**
   - Use real user CVs (anonymized)
   - Or create realistic test CVs
   - Need variety: junior, mid, senior

2. **Set up testing environment**
   - Local development server
   - PDF viewer for inspection
   - Spreadsheet for tracking results

3. **Run initial tests**
   - Test 1-page CVs first (baseline)
   - Then 2-page (most common)
   - Then 3-page and 4-page

4. **Iterate and adjust**
   - Make small adjustments (10% at a time)
   - Re-test after each change
   - Document all changes

### Timeline

**Estimated**: 2-4 hours
- 1 hour: Gather test CVs and setup
- 1-2 hours: Testing and measurement
- 1 hour: Adjustments and validation

## Practical Approach

Since we don't have access to real CVs right now, here's what we can do:

### Option 1: Document Current State (Recommended)

**Action**: Create comprehensive documentation of:
- Current budgets and their rationale
- Testing methodology for when real CVs are available
- Expected adjustments based on analysis
- Clear instructions for manual testing

**Benefit**: User can test with real CVs and make adjustments

### Option 2: Theoretical Adjustments

**Action**: Based on analysis, make conservative adjustments:
- Increase 2-page target from 10,000 → 11,000
- Increase 3-page target from 16,000 → 17,000
- Increase 4-page target from 22,000 → 24,000

**Risk**: Without real testing, could be wrong

### Option 3: Wait for Real Testing

**Action**: Mark Phase 5 as "ready for testing" and proceed to Phase 6 (validation)

**Benefit**: Can test everything together with real CVs

## Recommendation

**Go with Option 1**: Document the calibration process thoroughly

**Why?**
- We've built a solid foundation (Phases 1-4)
- The density multiplier system is already in place
- Real testing requires real CVs
- User can follow clear instructions to calibrate

**What this means**:
- Phase 5 = "Calibration methodology documented"
- User can run tests with real CVs
- Clear instructions for adjustments
- System is ready for real-world use

## Summary

Phase 5 is about **validating and fine-tuning** the char budgets to ensure 85-92% page occupancy.

**Current state**:
- ✅ Base budgets defined
- ✅ Density multiplier system in place
- ✅ Capacity analyzer working
- ⏳ Need real CV testing for final calibration

**Next**:
- Document testing methodology
- Provide clear instructions
- Mark as ready for real-world testing
- Proceed to Phase 6 (comprehensive validation)
