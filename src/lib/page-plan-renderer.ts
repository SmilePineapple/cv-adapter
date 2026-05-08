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
  sections: PlannedPageSection[]
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
    finalZone.sections.push(...unassignedSections)
    finalZone.sections.sort((a, b) => a.order - b.order)
  }

  return {
    blueprint,
    pages: compactEmptyPages(pages),
    unassignedSections
  }
}

export function renderPagePlanHTML(sections: CVSection[], pageCount?: number, templateName: string = 'page-plan'): string {
  const plan = createPagePlan(sections, pageCount)
  const name = getSectionText(sections.find(section => section.type === 'name')?.content) || 'CV'
  const contact = getSectionText(sections.find(section => section.type === 'contact')?.content)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)}</title>
  <style>${getPagePlanCSS(templateName)}</style>
</head>
<body data-template="${escapeHtml(templateName)}" data-page-plan="${plan.blueprint.targetPages}">
  ${plan.pages.map(page => `
    <main class="cv-page" data-page="${page.page}">
      ${page.page === 1 ? renderHeader(name, contact) : ''}
      ${page.zones.map(zone => `
        <section class="page-zone page-zone-${escapeHtml(zone.layout)}" data-zone-id="${escapeHtml(zone.id)}" data-layout="${escapeHtml(zone.layout)}">
          ${zone.sections.map(section => renderSection(section)).join('')}
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

function getPagePlanCSS(templateName: string): string {
  const theme = getTemplateTheme(templateName)
  return `
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: ${theme.text}; font-family: ${theme.fontFamily}; font-size: ${theme.fontSize}; line-height: 1.36; }
    .cv-page { position: relative; width: 210mm; min-height: 297mm; height: 297mm; margin: 0 auto; padding: ${theme.pagePadding}; background: ${theme.background}; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; gap: 3.2mm; }
    .cv-page:last-child { page-break-after: auto; }
    .cv-header { border-bottom: 1.5px solid ${theme.accent}; padding-bottom: 3mm; margin-bottom: 1mm; }
    .cv-header h1 { margin: 0 0 2mm; color: ${theme.heading}; font-size: ${theme.nameSize}; line-height: 1.1; letter-spacing: -0.02em; }
    .cv-contact { color: ${theme.muted}; white-space: pre-wrap; font-size: ${theme.contactSize}; }
    .page-zone { display: grid; gap: 3.5mm; min-height: 0; }
    .page-zone-single-column { grid-template-columns: 1fr; }
    .page-zone-two-column { grid-template-columns: 1fr 1fr; align-items: start; }
    .page-zone-hybrid { grid-template-columns: 1.25fr 0.75fr; align-items: start; }
    .cv-section { break-inside: avoid; page-break-inside: avoid; border-left: 2px solid ${theme.accent}; padding-left: 3mm; min-width: 0; }
    .cv-section h2 { margin: 0 0 1.4mm; color: ${theme.accent}; font-size: ${theme.sectionTitleSize}; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.08em; }
    .section-content { white-space: normal; overflow-wrap: anywhere; }
    .section-content p { margin: 0 0 1.1mm; }
    .section-content p:last-child { margin-bottom: 0; }
    ${theme.extraCss}
    @media print { body { background: #ffffff; } .cv-page { margin: 0; box-shadow: none; } }
  `
}

function getRepeatedSectionTypes(zones: PageZone[]): Map<string, number> {
  const counts = new Map<string, number>()
  zones.forEach(zone => {
    zone.sectionTypes.forEach(sectionType => {
      counts.set(sectionType, (counts.get(sectionType) || 0) + 1)
    })
  })
  return counts
}

function splitSection(section: PlannedPageSection, count: number): PlannedPageSection[] {
  const paragraphs = section.content.split('\n').map(line => line.trim()).filter(Boolean)
  const chunks = Array.from({ length: count }, () => [] as string[])
  const chunkSize = Math.ceil(paragraphs.length / count)

  paragraphs.forEach((paragraph, index) => {
    const chunkIndex = Math.min(Math.floor(index / chunkSize), count - 1)
    chunks[chunkIndex].push(paragraph)
  })

  return chunks
    .map((chunk, index) => ({
      ...section,
      content: chunk.join('\n'),
      part: index + 1,
      totalParts: count
    }))
    .filter(chunk => chunk.content.trim().length > 0)
}

function compactEmptyPages(pages: PlannedPage[]): PlannedPage[] {
  const emptyPages = pages.filter(page => page.zones.every(zone => zone.sections.length === 0))
  if (emptyPages.length === 0) return pages

  const nonEmptyPages = pages.filter(page => page.zones.some(zone => zone.sections.length > 0))
  return nonEmptyPages.map((page, index) => ({
    ...page,
    page: index + 1
  }))
}

function getTemplateTheme(templateName: string) {
  if (templateName === 'creative_modern') {
    return {
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: '9px',
      pagePadding: '10mm 11mm',
      background: '#ffffff',
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
    }
  }

  return {
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
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
