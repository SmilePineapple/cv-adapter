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
    clippedPages: [],
    clippedSections: [],
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

  it('plans condensation when fixed page content is clipped', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 2,
      actualPages: 2,
      clippedPages: [2],
      overflowing: true
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('condense')
    expect(plan.reason).toContain('clipped content')
    expect(plan.sectionTypesToAdjust).toContain('experience')
    expect(plan.sectionTypesToAdjust).toContain('skills')
  })

  it('targets only the section that actually overflows when clip details are available', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 2,
      actualPages: 2,
      clippedPages: [1],
      clippedSections: [{ type: 'education', page: 1, overflowPx: 186 }],
      overflowing: true,
      sectionPlacements: [
        { type: 'summary', top: 0, bottom: 200, height: 200, pageStart: 1, pageEnd: 1 },
        { type: 'skills', top: 200, bottom: 700, height: 500, pageStart: 1, pageEnd: 1 },
        { type: 'education', top: 700, bottom: 1186, height: 486, pageStart: 1, pageEnd: 1 },
        { type: 'experience', top: 0, bottom: 900, height: 900, pageStart: 1, pageEnd: 1 }
      ]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('condense')
    expect(plan.sectionTypesToAdjust).toEqual(['education'])
    expect(plan.sectionTypesToAdjust).not.toContain('experience')
    expect(plan.sectionTypesToAdjust).not.toContain('summary')
    expect(plan.instructions.join(' ')).toContain('186px')
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

  it('plans no repair for single-page CV with adequate occupancy', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 1,
      actualPages: 1,
      pageOccupancy: [{ page: 1, occupancy: 0.75, usedHeight: 750, availableHeight: 1000 }],
      underfilledPages: []
    }))

    expect(plan.shouldRepair).toBe(false)
    expect(plan.action).toBe('none')
  })

  it('plans condensation for single-page CV that overflows to 2 pages', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 1,
      actualPages: 2,
      overflowing: true,
      pageOccupancy: [
        { page: 1, occupancy: 0.94, usedHeight: 940, availableHeight: 1000 },
        { page: 2, occupancy: 0.11, usedHeight: 110, availableHeight: 1000 }
      ],
      underfilledPages: [{ page: 2, occupancy: 0.11, usedHeight: 110, availableHeight: 1000 }],
      sectionPlacements: [
        { type: 'summary', top: 0, bottom: 300, height: 300, pageStart: 1, pageEnd: 1 },
        { type: 'experience', top: 300, bottom: 1050, height: 750, pageStart: 1, pageEnd: 2 },
        { type: 'skills', top: 1050, bottom: 1160, height: 110, pageStart: 2, pageEnd: 2 }
      ]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('condense')
    expect(plan.reason).toContain('overflows')
  })

  it('plans expansion for severely underfilled single-page CV (< 60%)', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 1,
      actualPages: 1,
      pageOccupancy: [{ page: 1, occupancy: 0.43, usedHeight: 430, availableHeight: 1000 }],
      underfilledPages: [{ page: 1, occupancy: 0.43, usedHeight: 430, availableHeight: 1000 }]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('expand')
    expect(plan.reason).toContain('43%')
    expect(plan.sectionTypesToAdjust.length).toBeGreaterThan(0)
  })

  it('plans expansion across all materially underfilled pages', () => {
    const plan = createRenderRepairPlan(createMeasurement({
      targetPages: 2,
      actualPages: 2,
      underfilledPages: [
        { page: 1, occupancy: 0.52, usedHeight: 520, availableHeight: 1000 },
        { page: 2, occupancy: 0.5, usedHeight: 500, availableHeight: 1000 }
      ]
    }))

    expect(plan.shouldRepair).toBe(true)
    expect(plan.action).toBe('expand')
    expect(plan.sectionTypesToAdjust).toEqual(expect.arrayContaining(['summary', 'experience', 'skills']))
  })
})
