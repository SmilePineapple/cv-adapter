import { CVSection } from '@/types/database'
import { RenderMeasurement } from './cv-render-measurer'

export type RenderRepairAction = 'expand' | 'condense' | 'none'

export interface RenderRepairPlan {
  action: RenderRepairAction
  shouldRepair: boolean
  reason: string
  targetPages?: number
  actualPages: number
  underfilledPages: number[]
  sectionTypesToAdjust: string[]
  instructions: string[]
}

export function createRenderRepairPlan(measurement: RenderMeasurement): RenderRepairPlan {
  const targetPages = measurement.targetPages
  const underfilledPages = measurement.underfilledPages.map(page => page.page)

  if (!targetPages || targetPages <= 1) {
    return {
      action: 'none',
      shouldRepair: false,
      reason: 'No multi-page target was selected.',
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: [],
      instructions: []
    }
  }

  if (measurement.actualPages > targetPages) {
    const overflowingSections = getSectionsNearPage(measurement, targetPages + 1)
    return {
      action: 'condense',
      shouldRepair: true,
      reason: `Rendered CV exceeds selected ${targetPages}-page target with ${measurement.actualPages} actual pages.`,
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: overflowingSections,
      instructions: [
        `Condense the CV so it renders within exactly ${targetPages} pages.`,
        `Prioritise shortening sections spilling onto page ${targetPages + 1}: ${formatSectionList(overflowingSections)}.`,
        'Remove repetition, shorten bullets, and keep the strongest role-specific evidence.'
      ]
    }
  }

  if (measurement.actualPages < targetPages) {
    const expandableSections = getExpandableSections(measurement)
    return {
      action: 'expand',
      shouldRepair: true,
      reason: `Rendered CV is too short: selected ${targetPages} pages but rendered ${measurement.actualPages}.`,
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: expandableSections,
      instructions: [
        `Expand the CV so it renders closer to exactly ${targetPages} pages.`,
        `Add factual depth to these existing sections first: ${formatSectionList(expandableSections)}.`,
        'Use truthful context, responsibilities, tools, outcomes, quantified impact where supported, and job-relevant detail.'
      ]
    }
  }

  const materiallyUnderfilledPages = measurement.underfilledPages.filter(page => page.page === targetPages || page.occupancy < 0.55)
  if (materiallyUnderfilledPages.length > 0) {
    const expandableSections = getSectionsNearPage(measurement, materiallyUnderfilledPages[0].page)
    return {
      action: 'expand',
      shouldRepair: true,
      reason: `Rendered CV has underfilled page(s): ${materiallyUnderfilledPages.map(page => page.page).join(', ')}.`,
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: expandableSections,
      instructions: [
        `Fill underused page space while staying within ${targetPages} pages.`,
        `Expand sections around the underfilled page(s): ${formatSectionList(expandableSections)}.`,
        'Avoid adding fake employers, dates, qualifications, or unverifiable claims.'
      ]
    }
  }

  return {
    action: 'none',
    shouldRepair: false,
    reason: 'Rendered CV is within the selected page target and has acceptable occupancy.',
    targetPages,
    actualPages: measurement.actualPages,
    underfilledPages,
    sectionTypesToAdjust: [],
    instructions: []
  }
}

export function createRenderRepairPrompt(sections: CVSection[], measurement: RenderMeasurement, repairPlan: RenderRepairPlan): string {
  return `The CV has been rendered and measured in a real browser. Repair the content to satisfy the selected page count.

Render diagnosis:
- Target pages: ${repairPlan.targetPages ?? 'not specified'}
- Actual rendered pages: ${repairPlan.actualPages}
- Repair action: ${repairPlan.action}
- Reason: ${repairPlan.reason}
- Underfilled pages: ${repairPlan.underfilledPages.length > 0 ? repairPlan.underfilledPages.join(', ') : 'none'}

Page occupancy:
${measurement.pageOccupancy.map(page => `- Page ${page.page}: ${Math.round(page.occupancy * 100)}% occupied`).join('\n')}

Section placement:
${measurement.sectionPlacements.map(section => `- ${section.type}: page ${section.pageStart}${section.pageEnd !== section.pageStart ? `-${section.pageEnd}` : ''}, height ${Math.round(section.height)}px`).join('\n')}

Instructions:
${repairPlan.instructions.map(instruction => `- ${instruction}`).join('\n')}

Current sections:
${JSON.stringify(sections, null, 2)}

Return JSON only:
{
  "sections": [
    { "type": "summary", "content": "...", "order": 1 }
  ]
}

Rules:
- Return the full sections array, not only changed sections.
- Keep section types compatible with the existing CV structure.
- Preserve all real employers, dates, qualifications, certification names, and contact details.
- Do not invent fake jobs, education, dates, certifications, companies, or metrics.
- For expansion, add truthful detail inferred from the existing content and job relevance.
- For condensation, remove repetition before removing meaningful evidence.`
}

function getSectionsNearPage(measurement: RenderMeasurement, page: number): string[] {
  const sections = measurement.sectionPlacements
    .filter(section => section.pageStart <= page && section.pageEnd >= page)
    .map(section => cleanSectionType(section.type))
    .filter(Boolean)

  return Array.from(new Set(sections)).slice(0, 5)
}

function getExpandableSections(measurement: RenderMeasurement): string[] {
  const preferred = ['experience', 'summary', 'skills', 'projects', 'achievements', 'education', 'certifications']
  const measured = measurement.sectionPlacements.map(section => cleanSectionType(section.type))
  const availablePreferred = preferred.filter(type => measured.includes(type))
  const fallback = measured.filter(type => type !== 'header' && type !== 'unknown')

  return Array.from(new Set([...availablePreferred, ...fallback])).slice(0, 5)
}

function cleanSectionType(type: string): string {
  return type
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/section/g, '')
    .replace(/[^a-z0-9_-]/g, '') || 'unknown'
}

function formatSectionList(sectionTypes: string[]): string {
  return sectionTypes.length > 0 ? sectionTypes.join(', ') : 'summary, experience, skills'
}
