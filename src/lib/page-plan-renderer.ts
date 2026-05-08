import { CVSection } from '@/types/database'
import { CVPageBlueprint, CVSectionType, getCVPageBlueprint } from './cv-page-blueprints'
import { getSectionText, normalizeSectionType } from './cv-layout-validator'

export interface PlannedPageSection {
  type: string
  content: string
  order: number
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

  const assignedSectionIndexes = new Set<number>()
  const pages = Array.from({ length: blueprint.targetPages }, (_, index) => {
    const pageNumber = index + 1
    const pageZones = blueprint.zones.filter(zone => zone.page === pageNumber)

    return {
      page: pageNumber,
      zones: pageZones.map(zone => {
        const zoneSections = plannedSections.filter((section, sectionIndex) => {
          if (assignedSectionIndexes.has(sectionIndex)) return false
          return zone.sectionTypes.includes(section.type as CVSectionType)
        })

        zoneSections.forEach(section => {
          const indexToAssign = plannedSections.findIndex(candidate => candidate === section)
          if (indexToAssign >= 0) assignedSectionIndexes.add(indexToAssign)
        })

        return {
          id: zone.id,
          layout: zone.layout,
          sections: zoneSections.sort((a, b) => a.order - b.order)
        }
      })
    }
  })

  const unassignedSections = plannedSections.filter((_, index) => !assignedSectionIndexes.has(index))
  const finalPage = pages[pages.length - 1]
  const finalZone = finalPage?.zones[finalPage.zones.length - 1]
  if (finalZone) {
    finalZone.sections.push(...unassignedSections)
    finalZone.sections.sort((a, b) => a.order - b.order)
  }

  return {
    blueprint,
    pages,
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
  <style>${getPagePlanCSS()}</style>
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
    <h2>${escapeHtml(formatSectionTitle(section.type))}</h2>
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

function formatSectionTitle(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function getPagePlanCSS(): string {
  return `
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #e5e7eb; color: #111827; font-family: Inter, Arial, sans-serif; font-size: 10.5px; line-height: 1.42; }
    .cv-page { width: 210mm; min-height: 297mm; height: 297mm; margin: 0 auto; padding: 12mm 13mm; background: #ffffff; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; gap: 4mm; }
    .cv-page:last-child { page-break-after: auto; }
    .cv-header { border-bottom: 1.5px solid #2563eb; padding-bottom: 4mm; margin-bottom: 2mm; }
    .cv-header h1 { margin: 0 0 2mm; color: #111827; font-size: 24px; line-height: 1.1; letter-spacing: -0.02em; }
    .cv-contact { color: #4b5563; white-space: pre-wrap; font-size: 9.5px; }
    .page-zone { display: grid; gap: 3.5mm; min-height: 0; }
    .page-zone-single-column { grid-template-columns: 1fr; }
    .page-zone-two-column { grid-template-columns: 1fr 1fr; align-items: start; }
    .page-zone-hybrid { grid-template-columns: 1.25fr 0.75fr; align-items: start; }
    .cv-section { break-inside: avoid; page-break-inside: avoid; border-left: 2px solid #dbeafe; padding-left: 3mm; min-width: 0; }
    .cv-section h2 { margin: 0 0 1.8mm; color: #1d4ed8; font-size: 11px; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.08em; }
    .section-content { white-space: normal; overflow-wrap: anywhere; }
    .section-content p { margin: 0 0 1.5mm; }
    .section-content p:last-child { margin-bottom: 0; }
    @media print { body { background: #ffffff; } .cv-page { margin: 0; box-shadow: none; } }
  `
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
