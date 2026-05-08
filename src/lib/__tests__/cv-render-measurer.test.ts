import { describe, expect, it } from 'vitest'
import { calculatePageOccupancy, getActualPageCount, getUnderfilledPages } from '../cv-render-measurer'

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
})
