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

  if (measurement.actualPages > targetPages || measurement.clippedPages.length > 0) {
    const overflowingSections = measurement.clippedPages.length > 0
      ? getSectionsNearPages(measurement, measurement.clippedPages)
      : getSectionsNearPage(measurement, targetPages + 1)
    const overflowReason = measurement.clippedPages.length > 0
      ? `Rendered CV has clipped content on page(s): ${measurement.clippedPages.join(', ')}.`
      : `Rendered CV exceeds selected ${targetPages}-page target with ${measurement.actualPages} actual pages.`
    return {
      action: 'condense',
      shouldRepair: true,
      reason: overflowReason,
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: overflowingSections,
      instructions: [
        `Condense the CV so all assigned content is visible within exactly ${targetPages} pages.`,
        `Prioritise shortening clipped or overflowing sections: ${formatSectionList(overflowingSections)}.`,
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

  const materiallyUnderfilledPages = measurement.underfilledPages.filter(page => page.occupancy < 0.75)
  if (materiallyUnderfilledPages.length > 0) {
    const expandableSections = getSectionsNearPages(measurement, materiallyUnderfilledPages.map(page => page.page))
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
        `Expand the actual sections on underfilled pages: ${formatSectionList(expandableSections)}.`,
        'If the selected page count is 3 or 4 and space remains, add relevant optional sections such as achievements, projects, or additional_information only when they can be truthfully inferred from the existing CV.',
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
- Clipped pages: ${measurement.clippedPages.length > 0 ? measurement.clippedPages.join(', ') : 'none'}

Page occupancy:
${measurement.pageOccupancy.map(page => `- Page ${page.page}: ${Math.round(page.occupancy * 100)}% occupied`).join('\n')}

Section placement:
${measurement.sectionPlacements.map(section => `- ${section.type}: page ${section.pageStart}${section.pageEnd !== section.pageStart ? `-${section.pageEnd}` : ''}, height ${Math.round(section.height)}px`).join('\n')}

Instructions:
${repairPlan.instructions.map(instruction => `- ${instruction}`).join('\n')}

Expansion/compression targets:
${createPageTargetInstructions(measurement, repairPlan)}

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
- For expansion, add truthful detail inferred from the existing content and job relevance until underfilled pages are materially fuller.
- For sparse 4-page CVs, prefer expanding all existing sections on their assigned pages before adding optional factual sections.
- You may add achievements, projects, or additional_information sections only from evidence already present in the CV content and job description context.
- For condensation, remove repetition before removing meaningful evidence.`
}

function getSectionsNearPage(measurement: RenderMeasurement, page: number): string[] {
  const sections = measurement.sectionPlacements
    .filter(section => section.pageStart <= page && section.pageEnd >= page)
    .map(section => cleanSectionType(section.type))
    .filter(Boolean)

  return Array.from(new Set(sections)).slice(0, 5)
}

function getSectionsNearPages(measurement: RenderMeasurement, pages: number[]): string[] {
  const sections = pages.flatMap(page => getSectionsNearPage(measurement, page))
  const preferredOrder = ['summary', 'skills', 'experience', 'education', 'certifications', 'hobbies', 'projects', 'achievements', 'additional_information']
  const uniqueSections = Array.from(new Set(sections)).filter(type => type !== 'header' && type !== 'unknown')
  const orderedPreferred = preferredOrder.filter(type => uniqueSections.includes(type))
  const fallback = uniqueSections.filter(type => !orderedPreferred.includes(type))

  return [...orderedPreferred, ...fallback].slice(0, 8)
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

function createPageTargetInstructions(measurement: RenderMeasurement, repairPlan: RenderRepairPlan): string {
  if (repairPlan.action === 'condense') {
    return '- Reduce content that causes overflow while keeping the strongest role-specific evidence.'
  }

  if (repairPlan.action !== 'expand') {
    return '- No content expansion or compression required.'
  }

  return measurement.pageOccupancy
    .filter(page => repairPlan.underfilledPages.includes(page.page))
    .map(page => {
      const sectionsOnPage = getSectionsNearPage(measurement, page.page).filter(type => type !== 'header' && type !== 'unknown')
      const currentPercent = Math.round(page.occupancy * 100)
      const targetPercent = page.page === repairPlan.targetPages ? 88 : 82
      return `- Page ${page.page}: currently ${currentPercent}% occupied; target roughly ${targetPercent}% by expanding ${formatSectionList(sectionsOnPage)}.`
    })
    .join('\n')
}
