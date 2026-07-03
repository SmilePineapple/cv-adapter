import { CVSection } from '@/types/database'
import { RenderMeasurement } from './cv-render-measurer'
import { getSectionText, normalizeSectionType } from './cv-layout-validator'
import { CHARS_PER_COLUMN_PAGE } from './page-plan-renderer'

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
    const singlePageOccupancy = measurement.pageOccupancy[0]?.occupancy ?? 1

    // Single-page CV overflows — condense to fit within 1 page
    if (measurement.actualPages > 1 || measurement.clippedPages.length > 0) {
      const clippedTypes = getClippedSectionTypes(measurement)
      const overflowingSections = clippedTypes.length > 0 ? clippedTypes : getSectionsNearPage(measurement, 2)
      return {
        action: 'condense',
        shouldRepair: true,
        reason: `Single-page CV overflows onto ${measurement.actualPages} pages — must be condensed to fit exactly 1 page.`,
        targetPages: 1,
        actualPages: measurement.actualPages,
        underfilledPages,
        sectionTypesToAdjust: overflowingSections,
        instructions: [
          'Condense the CV so all content fits within exactly 1 page.',
          `Shorten these sections: ${formatSectionList(overflowingSections)}.`,
          'Remove repetition, trim bullets to 1 line each, shorten the summary to 2–3 sentences.',
          'Keep the strongest role-specific evidence; cut filler phrases.'
        ]
      }
    }

    // For single-page CVs, trigger expansion if the page is severely underfilled
    if (singlePageOccupancy < 0.6) {
      const expandableSections = getExpandableSections(measurement)
      return {
        action: 'expand',
        shouldRepair: true,
        reason: `Single-page CV is only ${Math.round(singlePageOccupancy * 100)}% full — content needs to be expanded to fill the page properly.`,
        targetPages: 1,
        actualPages: measurement.actualPages,
        underfilledPages,
        sectionTypesToAdjust: expandableSections,
        instructions: [
          'Expand the CV content so the single page looks full and professional (target 80–90% occupancy).',
          `Add factual depth to these sections: ${formatSectionList(expandableSections)}.`,
          'Expand bullet points with responsibilities, tools, outcomes, and measurable impact where supported.',
          'Expand the summary to 4–5 sentences. Add detail to each role. Do not invent facts.',
          'Avoid adding fake employers, dates, qualifications, or unverifiable claims.'
        ]
      }
    }

    return {
      action: 'none',
      shouldRepair: false,
      reason: 'Single-page CV fits well (60–100% occupancy).',
      targetPages,
      actualPages: measurement.actualPages,
      underfilledPages,
      sectionTypesToAdjust: [],
      instructions: []
    }
  }

  if (measurement.actualPages > targetPages || measurement.clippedPages.length > 0) {
    const clippedTypes = getClippedSectionTypes(measurement)
    const overflowingSections = clippedTypes.length > 0
      ? clippedTypes
      : measurement.clippedPages.length > 0
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
      instructions: clippedTypes.length > 0
        ? [
            `Condense ONLY the section(s) that actually overflow their page: ${formatClippedSections(measurement)}.`,
            'Do not shorten other sections that already fit within their page — cutting them would create empty space.',
            'Remove repetition, shorten bullets, and keep the strongest role-specific evidence.'
          ]
        : [
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
${createPageTargetInstructions(measurement, repairPlan, sections)}

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

function getClippedSectionTypes(measurement: RenderMeasurement): string[] {
  const types = (measurement.clippedSections ?? [])
    .map(section => cleanSectionType(section.type))
    .filter(type => type !== 'header' && type !== 'unknown')

  return Array.from(new Set(types))
}

function formatClippedSections(measurement: RenderMeasurement): string {
  const byType = new Map<string, number>()
  for (const section of measurement.clippedSections ?? []) {
    const type = cleanSectionType(section.type)
    if (type === 'header' || type === 'unknown') continue
    byType.set(type, Math.max(byType.get(type) ?? 0, section.overflowPx))
  }

  return Array.from(byType.entries())
    .map(([type, overflowPx]) => `${type} (~${Math.round(overflowPx)}px over the page)`)
    .join(', ') || 'the overflowing section'
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

// Trims by pixel-overflow alone are unquantified - the AI has no way to judge "how much
// is enough" and reliably overcorrects. Worse, if a repeated section (e.g. experience)
// gets condensed below CHARS_PER_COLUMN_PAGE * its current chunk count, splitSection's
// idealChunks calculation (page-plan-renderer.ts) drops it to fewer chunks entirely -
// not just shorter, but the whole spillover column vanishes, leaving the following page
// mostly empty. Converting the overflow to an exact character target, floored just above
// the chunk-count boundary, keeps the AI from accidentally trimming past that cliff.
function createCondenseCharTargets(measurement: RenderMeasurement, sections: CVSection[]): string {
  const clippedSections = measurement.clippedSections ?? []
  if (clippedSections.length === 0) return ''

  const byType = new Map<string, number>()
  for (const section of clippedSections) {
    const type = cleanSectionType(section.type)
    if (type === 'header' || type === 'unknown') continue
    byType.set(type, Math.max(byType.get(type) ?? 0, section.overflowPx))
  }

  const lines: string[] = []
  for (const [type, overflowPx] of byType.entries()) {
    const matchingSection = sections.find(s => normalizeSectionType(s.type) === type)
    if (!matchingSection) continue
    const currentChars = getSectionText(matchingSection.content).length
    const matchingPlacements = measurement.sectionPlacements.filter(p => cleanSectionType(p.type) === type)
    const currentHeight = matchingPlacements.reduce((sum, p) => sum + p.height, 0)
    if (currentChars <= 0 || currentHeight <= 0) continue

    const charsPerPx = currentChars / currentHeight
    // Trim a bit more than the raw overflow implies (15% margin) so the fix actually
    // clears the page instead of landing exactly on the edge after re-render.
    const rawTargetChars = Math.round(currentChars - overflowPx * charsPerPx * 1.15)

    const currentChunks = Math.max(1, Math.ceil(currentChars / CHARS_PER_COLUMN_PAGE))
    const chunkFloor = currentChunks > 1 ? (currentChunks - 1) * CHARS_PER_COLUMN_PAGE + 200 : 0
    const targetChars = Math.max(rawTargetChars, chunkFloor, Math.round(currentChars * 0.5))

    if (targetChars >= currentChars) continue

    lines.push(
      chunkFloor > 0
        ? `- ${type}: currently ~${currentChars} chars. Trim to approximately ${targetChars} chars — do NOT go below ~${chunkFloor} chars, since that would collapse it onto fewer pages/columns than intended and leave the following page emptier.`
        : `- ${type}: currently ~${currentChars} chars. Trim to approximately ${targetChars} chars.`
    )
  }

  return lines.join('\n')
}

function createPageTargetInstructions(measurement: RenderMeasurement, repairPlan: RenderRepairPlan, sections: CVSection[]): string {
  if (repairPlan.action === 'condense') {
    const charTargets = createCondenseCharTargets(measurement, sections)
    return charTargets
      ? charTargets
      : '- Reduce content that causes overflow while keeping the strongest role-specific evidence.'
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
