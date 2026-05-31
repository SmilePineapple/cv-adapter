import { describe, expect, it } from 'vitest'
import { calculatePageOccupancy, computeFillScale, getActualPageCount, getPageBottomCoverage, getUnderfilledPages, RenderMeasurement } from '../cv-render-measurer'

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
    underfilledPages: [],
    clippedPages: [],
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
})
