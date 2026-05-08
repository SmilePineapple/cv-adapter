import { describe, expect, it } from 'vitest'
import { createRenderRepairPlan } from '../cv-render-repair'
import { RenderMeasurement } from '../cv-render-measurer'

function createMeasurement(overrides: Partial<RenderMeasurement>): RenderMeasurement {
  return {
    targetPages: 2,
    actualPages: 2,
    scrollHeight: 2000,
    pageHeight: 1000,
    pageOccupancy: [
      { page: 1, occupancy: 0.9, usedHeight: 900, availableHeight: 1000 },
      { page: 2, occupancy: 0.8, usedHeight: 800, availableHeight: 1000 }
    ],
    sectionPlacements: [
      { type: 'summary', top: 0, bottom: 300, height: 300, pageStart: 1, pageEnd: 1 },
      { type: 'experience', top: 300, bottom: 1400, height: 1100, pageStart: 1, pageEnd: 2 },
      { type: 'skills', top: 1400, bottom: 1800, height: 400, pageStart: 2, pageEnd: 2 }
    ],
    underfilledPages: [],
    overflowing: false,
    ...overrides
  }
}

describe('cv render repair', () => {
  it('plans no repair for acceptable rendered output', () => {
    const plan = createRenderRepairPlan(createMeasurement({}))

    expect(plan.shouldRepair).toBe(false)
    expect(plan.action).toBe('none')
  })

  it('plans condensation when rendered pages exceed target', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 2,
      actualPages: 3,
      overflowing: true,
      sectionPlacements: [
        { type: 'experience', top: 1700, bottom: 2300, height: 600, pageStart: 2, pageEnd: 3 },
        { type: 'skills', top: 2300, bottom: 2600, height: 300, pageStart: 3, pageEnd: 3 }
      ]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('condense')
    expect(plan.sectionTypesToAdjust).toContain('experience')
  })

  it('plans expansion when rendered pages are below target', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 4,
      actualPages: 3
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('expand')
    expect(plan.reason).toContain('too short')
  })

  it('plans expansion for materially underfilled final page', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 2,
      actualPages: 2,
      underfilledPages: [
        { page: 2, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 }
      ]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('expand')
    expect(plan.underfilledPages).toEqual([2])
  })
})
