import { CVSection } from '@/types/database'
import { CVPageBlueprint, PageZone, getCVPageBlueprint } from './cv-page-blueprints'
import { getSectionText, normalizeSectionType } from './cv-layout-validator'

export interface PlannedPageSection {
  type: string
  content: string
  order: number
  part?: number
  totalParts?: number
}

export interface PlannedPageZone {
  id: string
  layout: string
  // Used for single-column zones.
  sections: PlannedPageSection[]
  // Used for two-column zones - each column stacks independently instead of
  // relying on CSS grid auto-placement to interleave a flat list.
  leftSections?: PlannedPageSection[]
  rightSections?: PlannedPageSection[]
}

export interface PlannedPage {
  page: number
  zones: PlannedPageZone[]
}

export interface PagePlan {
  blueprint: CVPageBlueprint
  pages: PlannedPage[]
  unassignedSections: PlannedPageSection[]
}

export function createPagePlan(sections: CVSection[], pageCount?: number): PagePlan {
  const blueprint = getCVPageBlueprint(pageCount)
  const plannedSections = sections
    .filter(section => section.type !== 'contact' && section.type !== 'name')
    .map(section => ({
      type: normalizeSectionType(section.type),
      content: getSectionText(section.content),
      order: section.order
    }))
    .filter(section => section.content.trim().length > 0)

  const repeatedSectionTypes = getRepeatedSectionTypes(blueprint.zones)
  const sectionQueues = new Map<string, PlannedPageSection[]>()

  plannedSections.forEach(section => {
    const repeatedCount = repeatedSectionTypes.get(section.type) || 1
    const segments = repeatedCount > 1
      ? splitSection(section, repeatedCount)
      : [section]

    sectionQueues.set(section.type, [
      ...(sectionQueues.get(section.type) || []),
      ...segments
    ])
  })

  const pages = Array.from({ length: blueprint.targetPages }, (_, index) => {
    const pageNumber = index + 1
    const pageZones = blueprint.zones.filter(zone => zone.page === pageNumber)

    return {
      page: pageNumber,
      zones: pageZones.map(zone => {
        if (zone.leftSectionTypes || zone.rightSectionTypes) {
          const leftSections = (zone.leftSectionTypes ?? [])
            .flatMap(sectionType => sectionQueues.get(sectionType)?.shift() || [])
            .sort((a, b) => a.order - b.order)
          const rightSections = (zone.rightSectionTypes ?? [])
            .flatMap(sectionType => sectionQueues.get(sectionType)?.shift() || [])
            .sort((a, b) => a.order - b.order)

          return {
            id: zone.id,
            layout: zone.layout,
            sections: [],
            leftSections,
            rightSections
          }
        }

        const zoneSections = zone.sectionTypes
          .flatMap(sectionType => sectionQueues.get(sectionType)?.shift() || [])

        return {
          id: zone.id,
          layout: zone.layout,
          sections: zoneSections.sort((a, b) => a.order - b.order)
        }
      })
    }
  })

  const unassignedSections = Array.from(sectionQueues.values()).flat()
  const finalPage = pages[pages.length - 1]
  const finalZone = finalPage?.zones[finalPage.zones.length - 1]
  if (finalZone) {
    const targetList = finalZone.rightSections ?? finalZone.sections
    targetList.push(...unassignedSections)
    targetList.sort((a, b) => a.order - b.order)
  }

  return {
    blueprint,
    pages: compactEmptyPages(pages),
    unassignedSections
  }
}

export function renderPagePlanHTML(sections: CVSection[], pageCount?: number, templateName: string = 'page-plan', fillScale: number = 1): string {
  const plan = createPagePlan(sections, pageCount)
  const name = getSectionText(sections.find(section => section.type === 'name')?.content) || 'CV'
  const contact = getSectionText(sections.find(section => section.type === 'contact')?.content)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)}</title>
  <style>${getPagePlanCSS(templateName, fillScale)}</style>
</head>
<body data-template="${escapeHtml(templateName)}" data-page-plan="${plan.blueprint.targetPages}">
  ${plan.pages.map(page => `
    <main class="cv-page" data-page="${page.page}">
      ${page.page === 1 ? renderHeader(name, contact) : ''}
      ${page.zones.map(zone => `
        <section class="page-zone page-zone-${escapeHtml(zone.layout)}" data-zone-id="${escapeHtml(zone.id)}" data-layout="${escapeHtml(zone.layout)}">
          ${zone.leftSections || zone.rightSections ? `
            <div class="zone-column zone-column-left">${(zone.leftSections ?? []).map(section => renderSection(section)).join('')}</div>
            <div class="zone-column zone-column-right">${(zone.rightSections ?? []).map(section => renderSection(section)).join('')}</div>
          ` : zone.sections.map(section => renderSection(section)).join('')}
        </section>
      `).join('')}
    </main>
  `).join('')}
</body>
</html>`
}

function renderHeader(name: string, contact: string): string {
  return `<header class="cv-header" data-section-type="header">
    <h1>${escapeHtml(name)}</h1>
    ${contact ? `<div class="cv-contact">${escapeHtml(contact)}</div>` : ''}
  </header>`
}

function renderSection(section: PlannedPageSection): string {
  return `<article class="cv-section section" data-section-type="${escapeHtml(section.type)}" data-type="${escapeHtml(section.type)}">
    <h2>${escapeHtml(formatSectionTitle(section))}</h2>
    <div class="section-content">${formatContent(section.content)}</div>
  </article>`
}

function formatContent(content: string): string {
  return escapeHtml(content)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${line}</p>`)
    .join('')
}

function formatSectionTitle(section: PlannedPageSection): string {
  const title = section.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  return section.totalParts && section.totalParts > 1 ? `${title} (${section.part}/${section.totalParts})` : title
}

function getPagePlanCSS(templateName: string, fillScale: number = 1): string {
  const theme = getTemplateTheme(templateName)
  // Clamp the fill scale so the page never overflows and text stays readable.
  const scale = Math.min(Math.max(fillScale, 1), 1.5)
  // Line-height is scaled more gently than structural spacing to preserve legibility.
  const lineScale = Math.min(scale, 1.18)
  const pageGap = (3.2 * scale).toFixed(2)
  const zoneGap = (3.5 * scale).toFixed(2)
  const headerPad = (3 * scale).toFixed(2)
  const headerMargin = (1 * scale).toFixed(2)
  const h2Margin = (1.4 * scale).toFixed(2)
  const pMargin = (1.1 * scale).toFixed(2)
  const bodyLineHeight = (1.36 * lineScale).toFixed(3)
  return `
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: ${theme.text}; font-family: ${theme.fontFamily}; font-size: ${theme.fontSize}; line-height: ${bodyLineHeight}; }
    .cv-page { position: relative; width: 210mm; min-height: 297mm; height: 297mm; margin: 0 auto; padding: ${theme.pagePadding}; background: ${theme.background}; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; gap: ${pageGap}mm; }
    .cv-page:last-child { page-break-after: auto; }
    .cv-header { border-bottom: 1.5px solid ${theme.accent}; padding-bottom: ${headerPad}mm; margin-bottom: ${headerMargin}mm; flex-shrink: 0; }
    .cv-header h1 { margin: 0 0 2mm; color: ${theme.heading}; font-size: ${theme.nameSize}; line-height: 1.1; letter-spacing: -0.02em; }
    .cv-contact { color: ${theme.muted}; white-space: pre-wrap; font-size: ${theme.contactSize}; }
    .page-zone { display: grid; gap: ${zoneGap}mm; min-height: 0; }
    .page-zone:last-child { flex: 1 1 0; align-content: space-between; min-height: auto; }
    .page-zone-single-column { grid-template-columns: 1fr; }
    .page-zone-two-column { grid-template-columns: 1fr 1fr; align-items: start; }
    .page-zone-hybrid { grid-template-columns: 1.25fr 0.75fr; align-items: start; }
    .zone-column { display: flex; flex-direction: column; gap: ${zoneGap}mm; min-width: 0; }
    .cv-section { break-inside: avoid; page-break-inside: avoid; border-left: 2px solid ${theme.accent}; padding-left: 3mm; min-width: 0; }
    .cv-section h2 { margin: 0 0 ${h2Margin}mm; color: ${theme.accent}; font-size: ${theme.sectionTitleSize}; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.08em; }
    .section-content { white-space: normal; overflow-wrap: anywhere; }
    .section-content p { margin: 0 0 ${pMargin}mm; }
    .section-content p:last-child { margin-bottom: 0; }
    ${theme.extraCss}
    @media print { body { background: #ffffff; } .cv-page { margin: 0; box-shadow: none; } }
  `
}

function getRepeatedSectionTypes(zones: PageZone[]): Map<string, number> {
  const counts = new Map<string, number>()
  const countType = (sectionType: string) => counts.set(sectionType, (counts.get(sectionType) || 0) + 1)
  zones.forEach(zone => {
    zone.sectionTypes.forEach(countType)
    zone.leftSectionTypes?.forEach(countType)
    zone.rightSectionTypes?.forEach(countType)
  })
  return counts
}

// Roughly how many characters fit in one column's worth of a full page height, derived
// from the blueprint's own calibration note ("two-column full ≈ 8,500 chars" per page,
// i.e. ~4,250 per column). Used to decide how many chunks a section actually needs,
// rather than always producing exactly as many chunks as there are zone slots for it -
// a short section referenced by two page zones should only occupy the first one.
const CHARS_PER_COLUMN_PAGE = 4250

function splitSection(section: PlannedPageSection, maxCount: number): PlannedPageSection[] {
  const idealCount = Math.max(1, Math.min(maxCount, Math.ceil(section.content.length / CHARS_PER_COLUMN_PAGE)))

  // Experience content is a sequence of jobs, each with its own header line — splitting by
  // raw line count can cut a job's bullets in half across a page with no repeated header.
  // Split on job boundaries instead so continuation pages never start mid-job.
  if (section.type === 'experience') {
    return splitByJobBoundary(section, idealCount)
  }
  return splitByLine(section, idealCount)
}

function splitByLine(section: PlannedPageSection, count: number): PlannedPageSection[] {
  const paragraphs = section.content.split('\n').map(line => line.trim()).filter(Boolean)
  const chunks = Array.from({ length: count }, () => [] as string[])
  const chunkSize = Math.ceil(paragraphs.length / count)

  paragraphs.forEach((paragraph, index) => {
    const chunkIndex = Math.min(Math.floor(index / chunkSize), count - 1)
    chunks[chunkIndex].push(paragraph)
  })

  return finalizeSplitChunks(section, chunks, count)
}

function splitByJobBoundary(section: PlannedPageSection, count: number): PlannedPageSection[] {
  const lines = section.content.split('\n').map(line => line.trim()).filter(Boolean)
  const isJobHeader = (line: string) => line.includes('|') && !/^[•\-*]/.test(line)

  const jobBlocks: string[][] = []
  lines.forEach(line => {
    if (isJobHeader(line) || jobBlocks.length === 0) {
      jobBlocks.push([line])
    } else {
      jobBlocks[jobBlocks.length - 1].push(line)
    }
  })

  // No header lines detected (or only one job) — nothing to split on job boundaries, fall
  // back to a line-based split so every page still gets something.
  if (jobBlocks.length <= 1) {
    return splitByLine(section, count)
  }

  const blockLengths = jobBlocks.map(block => block.join('\n').length)
  const totalLength = blockLengths.reduce((sum, len) => sum + len, 0)
  const targetChunkLength = totalLength / count

  const chunks: string[][] = Array.from({ length: count }, () => [])
  let chunkIndex = 0
  let currentChunkLength = 0

  jobBlocks.forEach((block, index) => {
    const blockLength = blockLengths[index]
    const wouldOverflow = currentChunkLength > 0 && currentChunkLength + blockLength > targetChunkLength
    if (wouldOverflow && chunkIndex < count - 1) {
      chunkIndex++
      currentChunkLength = 0
    }
    chunks[chunkIndex].push(...block)
    currentChunkLength += blockLength
  })

  return finalizeSplitChunks(section, chunks, count)
}

function finalizeSplitChunks(section: PlannedPageSection, chunks: string[][], count: number): PlannedPageSection[] {
  return chunks
    .map((chunk, index) => ({
      ...section,
      content: chunk.join('\n'),
      part: index + 1,
      totalParts: count
    }))
    .filter(chunk => chunk.content.trim().length > 0)
}

function isZoneEmpty(zone: PlannedPageZone): boolean {
  return zone.sections.length === 0 && (zone.leftSections?.length ?? 0) === 0 && (zone.rightSections?.length ?? 0) === 0
}

function compactEmptyPages(pages: PlannedPage[]): PlannedPage[] {
  const emptyPages = pages.filter(page => page.zones.every(isZoneEmpty))
  if (emptyPages.length === 0) return pages

  const nonEmptyPages = pages.filter(page => page.zones.some(zone => !isZoneEmpty(zone)))
  return nonEmptyPages.map((page, index) => ({
    ...page,
    page: index + 1
  }))
}

interface PagePlanTheme {
  fontFamily: string
  fontSize: string
  pagePadding: string
  background: string
  text: string
  heading: string
  muted: string
  accent: string
  nameSize: string
  contactSize: string
  sectionTitleSize: string
  extraCss: string
}

const BASE_THEME: PagePlanTheme = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '10px',
  pagePadding: '11mm 12mm',
  background: '#ffffff',
  text: '#111827',
  heading: '#111827',
  muted: '#4b5563',
  accent: '#2563eb',
  nameSize: '24px',
  contactSize: '9px',
  sectionTitleSize: '10.5px',
  extraCss: ''
}

// Each selectable template (see TEMPLATES in the download page) maps to its own theme so
// multi-page CVs keep the template's visual identity (accent colour, fonts, header style)
// while sharing the deterministic page-plan layout that fixes white space.
const TEMPLATE_THEMES: Record<string, Partial<PagePlanTheme>> = {
  creative_modern: {
    fontFamily: "'Inter', Arial, sans-serif",
    fontSize: '9px',
    pagePadding: '10mm 11mm',
    text: '#2d3748',
    heading: '#2d3748',
    muted: '#4a5568',
    accent: '#f6ad55',
    nameSize: '22px',
    contactSize: '8.8px',
    sectionTitleSize: '10px',
    extraCss: `
      .cv-page::before { content: ''; position: absolute; width: 38mm; height: 38mm; border-radius: 50%; background: #f6ad55; top: -15mm; right: 18mm; opacity: 0.82; }
      .cv-page::after { content: ''; position: absolute; width: 28mm; height: 28mm; border-radius: 50%; background: #4a5568; top: 5mm; right: -8mm; opacity: 0.78; }
      .cv-header, .page-zone { position: relative; z-index: 1; }
      .cv-section { border-left-color: #f6ad55; }
      .cv-section h2 { color: #2d3748; }
    `
  },
  professional_columns: {
    accent: '#3b82f6',
    heading: '#1e3a8a',
    extraCss: `
      .cv-header { border-bottom-width: 3px; border-bottom-color: #3b82f6; }
      .cv-header h1 { color: #1e3a8a; }
    `
  },
  'professional-metrics': {
    accent: '#4f46e5',
    heading: '#312e81',
    extraCss: `
      .cv-header { border-bottom-color: #4f46e5; }
      .cv-header h1 { color: #312e81; }
      .cv-section h2 { color: #4f46e5; }
    `
  },
  'teal-sidebar': {
    accent: '#14b8a6',
    heading: '#115e59',
    extraCss: `
      .cv-header { border-bottom-color: #14b8a6; }
      .cv-header h1 { color: #115e59; }
      .cv-section h2 { color: #0f766e; }
    `
  },
  'soft-header': {
    accent: '#8b5cf6',
    heading: '#5b21b6',
    extraCss: `
      .cv-header { border-bottom: 0; padding-bottom: 4mm; background: linear-gradient(90deg, rgba(139,92,246,0.16), rgba(96,165,250,0.16)); padding: 4mm; border-radius: 2mm; }
      .cv-header h1 { color: #5b21b6; }
      .cv-section h2 { color: #7c3aed; }
    `
  },
  'artistic-header': {
    accent: '#ec4899',
    heading: '#9d174d',
    extraCss: `
      .cv-header { border-bottom-color: #ec4899; background-image: radial-gradient(rgba(236,72,153,0.18) 1.2px, transparent 1.2px); background-size: 6px 6px; padding-bottom: 4mm; }
      .cv-header h1 { color: #9d174d; }
      .cv-section h2 { color: #db2777; }
    `
  },
  'bold-split': {
    accent: '#06b6d4',
    heading: '#0e7490',
    fontSize: '10.5px',
    extraCss: `
      .cv-header { border-bottom-width: 3px; border-bottom-color: #0e7490; }
      .cv-header h1 { color: #0e7490; font-weight: 800; }
      .cv-section { border-left-width: 3px; border-left-color: #06b6d4; }
      .cv-section h2 { color: #0e7490; font-weight: 800; }
    `
  }
}

function getTemplateTheme(templateName: string): PagePlanTheme {
  const override = TEMPLATE_THEMES[templateName]
  return override ? { ...BASE_THEME, ...override } : { ...BASE_THEME }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
