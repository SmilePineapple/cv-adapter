import { describe, expect, it } from 'vitest'
import { calculatePageOccupancy, computeFillScale, computeShrinkScale, computeTemplateShrinkScale, computeTemplateFillScale, computeTemplateLastPageFillScale, getActualPageCount, getPageBottomCoverage, getUnderfilledPages, RenderMeasurement } from '../cv-render-measurer'

function createMeasurement(overrides: Partial<RenderMeasurement> = {}): RenderMeasurement {
  return {
    targetPages: 2,
    actualPages: 2,
    scrollHeight: 2000,
    pageHeight: 1000,
    pageOccupancy: [],
    sectionPlacements: [
      { type: 'summary', top: 0, bottom: 400, height: 400, pageStart: 1, pageEnd: 1 },
      { type: 'experience', top: 400, bottom: 800, height: 400, pageStart: 1, pageEnd: 1 },
      { type: 'skills', top: 1000, bottom: 1400, height: 400, pageStart: 2, pageEnd: 2 }
    ],
    columnPlacements: [],
    underfilledPages: [],
    clippedPages: [],
    clippedSections: [],
    overflowing: false,
    ...overrides
  }
}

describe('cv render measurer', () => {
  it('calculates actual page count from scroll height', () => {
    expect(getActualPageCount(0, 1000)).toBe(1)
    expect(getActualPageCount(999, 1000)).toBe(1)
    expect(getActualPageCount(1001, 1000)).toBe(2)
    expect(getActualPageCount(3000, 1000)).toBe(3)
  })

  it('calculates occupancy per page from section rectangles', () => {
    const occupancy = calculatePageOccupancy([
      { top: 0, bottom: 500, height: 500 },
      { top: 1000, bottom: 1500, height: 500 }
    ], 2, 1000)

    expect(occupancy).toEqual([
      { page: 1, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 },
      { page: 2, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 }
    ])
  })

  it('merges overlapping rectangles before calculating occupancy', () => {
    const occupancy = calculatePageOccupancy([
      { top: 100, bottom: 500, height: 400 },
      { top: 300, bottom: 700, height: 400 }
    ], 1, 1000)

    expect(occupancy[0].usedHeight).toBe(600)
    expect(occupancy[0].occupancy).toBe(0.6)
  })

  it('uses the shallower column, not the union of both, for two-column page occupancy', () => {
    // A page with a tall right column (e.g. hobbies) and a short left column (e.g.
    // certifications) must read as underfilled - the union-of-sections approach used to
    // report this as ~90% full just because SOMETHING (the right column) reached that far
    // down, even though the left column visibly stops much earlier.
    const occupancy = calculatePageOccupancy([
      { top: 0, bottom: 900, height: 900 }, // right column reaches 90% down
      { top: 0, bottom: 300, height: 300 }  // left column stops at 30%
    ], 1, 1000, [
      { side: 'left', top: 0, bottom: 300, height: 300, pageStart: 1, pageEnd: 1 },
      { side: 'right', top: 0, bottom: 900, height: 900, pageStart: 1, pageEnd: 1 }
    ])

    expect(occupancy[0].occupancy).toBe(0.3)
  })

  it('falls back to section-union occupancy when a page has no column data', () => {
    // Single-column pages (or pages with no zone-column divs) keep the old behaviour.
    const occupancy = calculatePageOccupancy([
      { top: 0, bottom: 500, height: 500 },
      { top: 300, bottom: 700, height: 400 }
    ], 1, 1000, [])

    expect(occupancy[0].usedHeight).toBe(700)
  })

  it('computes bottom coverage from the shallower column on a two-column page', () => {
    const coverage = getPageBottomCoverage({
      pageHeight: 1000,
      actualPages: 1,
      sectionPlacements: [
        { type: 'hobbies', top: 0, bottom: 900, height: 900, pageStart: 1, pageEnd: 1 },
        { type: 'certifications', top: 0, bottom: 300, height: 300, pageStart: 1, pageEnd: 1 }
      ],
      columnPlacements: [
        { side: 'left', top: 0, bottom: 300, height: 300, pageStart: 1, pageEnd: 1 },
        { side: 'right', top: 0, bottom: 900, height: 900, pageStart: 1, pageEnd: 1 }
      ]
    })

    expect(coverage).toEqual([0.3])
  })

  it('identifies underfilled pages', () => {
    const underfilled = getUnderfilledPages([
      { page: 1, occupancy: 0.9, usedHeight: 900, availableHeight: 1000 },
      { page: 2, occupancy: 0.4, usedHeight: 400, availableHeight: 1000 }
    ], 0.72)

    expect(underfilled.map(page => page.page)).toEqual([2])
  })

  it('computes how far content reaches down each page', () => {
    const coverage = getPageBottomCoverage(createMeasurement())
    expect(coverage).toEqual([0.8, 0.4])
  })

  it('returns a neutral fill scale for single-page targets', () => {
    expect(computeFillScale(createMeasurement({ targetPages: 1 }))).toBe(1)
  })

  it('does not fill when the CV is overflowing', () => {
    expect(computeFillScale(createMeasurement({ overflowing: true }))).toBe(1)
  })

  it('returns a fill scale greater than 1 for underfilled pages without overflowing', () => {
    const scale = computeFillScale(createMeasurement())
    // Fullest expected-full page reaches 0.8 coverage -> scale targets ~0.95 fill, capped safely.
    expect(scale).toBeGreaterThan(1)
    expect(scale).toBeLessThanOrEqual(1.3)
    // Must never push the fullest page past the overflow cap.
    expect(scale * 0.8).toBeLessThanOrEqual(0.97)
  })

  it('does not fill when pages are already near full', () => {
    const scale = computeFillScale(createMeasurement({
      sectionPlacements: [
        { type: 'experience', top: 0, bottom: 940, height: 940, pageStart: 1, pageEnd: 1 },
        { type: 'skills', top: 1000, bottom: 1940, height: 940, pageStart: 2, pageEnd: 2 }
      ]
    }))
    expect(scale).toBe(1)
  })

  it('computes a shrink scale that clears residual overflow after repair rounds are exhausted', () => {
    // pageHeight 1000, overflow 100px + 6px margin -> scale = 1000/1106 ~= 0.904
    const scale = computeShrinkScale(createMeasurement({
      clippedPages: [1],
      clippedSections: [{ type: 'experience', page: 1, overflowPx: 100 }]
    }))
    expect(scale).toBeCloseTo(1000 / 1106, 3)
    expect(scale).toBeLessThan(1)
  })

  it('does not shrink when there is no clipped section overflow', () => {
    expect(computeShrinkScale(createMeasurement({}))).toBe(1)
  })

  it('does not shrink when content genuinely needs more physical pages', () => {
    // Spacing compression can't reclaim a whole extra page - only clears a boundary overflow.
    const scale = computeShrinkScale(createMeasurement({
      targetPages: 2,
      actualPages: 3,
      clippedSections: [{ type: 'experience', page: 2, overflowPx: 400 }]
    }))
    expect(scale).toBe(1)
  })

  it('floors the shrink scale at minScale to keep text legible', () => {
    const scale = computeShrinkScale(createMeasurement({
      clippedSections: [{ type: 'experience', page: 1, overflowPx: 5000 }]
    }), { minScale: 0.85 })
    expect(scale).toBe(0.85)
  })

  it('computes a template shrink scale from total scroll overflow for single-page targets', () => {
    // pageHeight 1000, scrollHeight 1150 -> overflow 150px + 6px margin -> scale = 1000/1156 ~= 0.865
    const scale = computeTemplateShrinkScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      scrollHeight: 1150,
      pageHeight: 1000
    }))
    expect(scale).toBeCloseTo(1000 / 1156, 3)
    expect(scale).toBeLessThan(1)
  })

  it('does not apply a template shrink scale when the single page already fits', () => {
    expect(computeTemplateShrinkScale(createMeasurement({
      targetPages: 1,
      actualPages: 1,
      scrollHeight: 900,
      pageHeight: 1000
    }))).toBe(1)
  })

  it('does not apply a template shrink scale for multi-page targets', () => {
    // computeShrinkScale (clippedSections-based) owns the multi-page case instead.
    expect(computeTemplateShrinkScale(createMeasurement({
      targetPages: 2,
      actualPages: 3,
      scrollHeight: 3000,
      pageHeight: 1000
    }))).toBe(1)
  })

  it('floors the template shrink scale at minScale to keep text legible', () => {
    const scale = computeTemplateShrinkScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      scrollHeight: 5000,
      pageHeight: 1000
    }), { minScale: 0.82 })
    expect(scale).toBe(0.82)
  })

  it('computes a fill scale for an underfilled single page', () => {
    // occupancy 0.5 -> target 0.9 -> scale 1.8, capped at maxScale 1.18
    const scale = computeTemplateFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 1,
      overflowing: false,
      pageOccupancy: [{ page: 1, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 }]
    }))
    expect(scale).toBe(1.18)
  })

  it('does not fill a single page that is already reasonably full', () => {
    expect(computeTemplateFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 1,
      overflowing: false,
      pageOccupancy: [{ page: 1, occupancy: 0.85, usedHeight: 850, availableHeight: 1000 }]
    }))).toBe(1)
  })

  it('does not fill an overflowing page', () => {
    expect(computeTemplateFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      overflowing: true,
      pageOccupancy: [{ page: 1, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 }]
    }))).toBe(1)
  })

  it('does not fill for multi-page targets', () => {
    expect(computeTemplateFillScale(createMeasurement({
      targetPages: 2,
      actualPages: 2,
      overflowing: false,
      pageOccupancy: [{ page: 1, occupancy: 0.4, usedHeight: 400, availableHeight: 1000 }]
    }))).toBe(1)
  })

  it('fills the last page of a single-column overflow fallback despite targetPages being stale', () => {
    // Regression test: measurement.overflowing compares actualPages against the ORIGINAL
    // 1-page target, which is still true here (actualPages=2 > targetPages=1) even after the
    // caller has already accepted 2 pages via the single-column fallback. A prior version
    // gated on measurement.overflowing and so always returned 1 (no fill) in exactly this
    // scenario, silently disabling the fill for every overflow case it was built for.
    const scale = computeTemplateLastPageFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      overflowing: true,
      clippedPages: [],
      pageOccupancy: [
        { page: 1, occupancy: 0.91, usedHeight: 910, availableHeight: 1000 },
        { page: 2, occupancy: 0.24, usedHeight: 240, availableHeight: 1000 }
      ]
    }))
    expect(scale).toBeGreaterThan(1)
  })

  it('does not fill the last page when content is genuinely clipped', () => {
    expect(computeTemplateLastPageFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      overflowing: true,
      clippedPages: [2],
      pageOccupancy: [{ page: 2, occupancy: 0.3, usedHeight: 300, availableHeight: 1000 }]
    }))).toBe(1)
  })

  it('does not fill the last page when it is already reasonably full', () => {
    expect(computeTemplateLastPageFillScale(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      overflowing: true,
      clippedPages: [],
      pageOccupancy: [{ page: 2, occupancy: 0.8, usedHeight: 800, availableHeight: 1000 }]
    }))).toBe(1)
  })
})
