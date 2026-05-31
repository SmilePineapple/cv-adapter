import { describe, expect, it } from 'vitest'
import { CVSection } from '@/types/database'
import { createPagePlan, renderPagePlanHTML } from '../page-plan-renderer'

const sections: CVSection[] = [
  { type: 'name', content: 'Alex Teacher', order: 0 },
  { type: 'contact', content: 'alex@example.com', order: 1 },
  { type: 'summary', content: 'Experienced teacher and curriculum leader.', order: 2 },
  { type: 'experience', content: 'Led teaching and learning improvements across school.', order: 3 },
  { type: 'skills', content: 'Curriculum planning, assessment, safeguarding.', order: 4 },
  { type: 'education', content: 'PGCE Education', order: 5 },
  { type: 'certifications', content: 'QTS', order: 6 },
  { type: 'projects', content: 'Whole-school assessment project.', order: 7 }
]

describe('page plan renderer', () => {
  it('creates the selected number of planned pages', () => {
    const plan = createPagePlan(sections, 3)

    expect(plan.pages).toHaveLength(3)
    expect(plan.blueprint.targetPages).toBe(3)
  })

  it('assigns sections to blueprint zones', () => {
    const plan = createPagePlan(sections, 2)
    const zoneSections = plan.pages.flatMap(page => page.zones.flatMap(zone => zone.sections.map(section => section.type)))

    expect(zoneSections).toContain('summary')
    expect(zoneSections).toContain('experience')
    expect(zoneSections).toContain('skills')
    expect(zoneSections).toContain('education')
  })

  it('renders fixed page containers and measurable section attributes', () => {
    const html = renderPagePlanHTML(sections, 4, 'creative_modern')

    expect(html).toContain('data-page-plan="4"')
    expect(html.match(/class="cv-page"/g)).toHaveLength(4)
    expect(html).toContain('data-section-type="summary"')
    expect(html).toContain('data-section-type="experience"')
    expect(html).toContain('data-zone-id="page_1_work_experience"')
  })

  it('splits repeated sections across repeated blueprint zones', () => {
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'experience', content: 'Role one\nRole two\nRole three\nRole four', order: 1 },
      { type: 'summary', content: 'Summary', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 }
    ], 4)
    const pageThreeSections = plan.pages
      .find(page => page.page === 3)
      ?.zones.flatMap(zone => zone.sections.map(section => section.type))

    expect(pageThreeSections).toContain('experience')
  })

  it('normalizes interests into hobbies on supporting pages', () => {
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'experience', content: 'Experience', order: 1 },
      { type: 'summary', content: 'Summary', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 },
      { type: 'interests', content: 'Travel and wellbeing', order: 4 } as unknown as CVSection
    ], 4)
    const allSections = plan.pages.flatMap(page => page.zones.flatMap(zone => zone.sections.map(section => section.type)))

    expect(allSections).toContain('hobbies')
  })

  it('uses creative modern theme colours for creative modern multi-page PDFs', () => {
    const html = renderPagePlanHTML(sections, 4, 'creative_modern')

    expect(html).toContain('#f6ad55')
    expect(html).toContain('#2d3748')
    expect(html).not.toContain('#1d4ed8')
  })

  it('maps each selectable template to its own accent colour', () => {
    const accentByTemplate: Record<string, string> = {
      'professional-metrics': '#4f46e5',
      'teal-sidebar': '#14b8a6',
      'soft-header': '#8b5cf6',
      'artistic-header': '#ec4899',
      'bold-split': '#06b6d4',
      professional_columns: '#3b82f6'
    }

    for (const [templateId, accent] of Object.entries(accentByTemplate)) {
      const html = renderPagePlanHTML(sections, 2, templateId)
      expect(html).toContain(accent)
      // Non-default templates must not silently fall back to the base blue accent.
      expect(html).not.toContain('#2563eb')
    }
  })

  it('falls back to the base theme for unknown templates', () => {
    const html = renderPagePlanHTML(sections, 2, 'totally-unknown-template')
    expect(html).toContain('#2563eb')
  })

  it('escapes section content', () => {
    const html = renderPagePlanHTML([
      { type: 'name', content: '<Alex>', order: 0 },
      { type: 'summary', content: '<script>alert("x")</script>', order: 1 }
    ], 2)

    expect(html).toContain('&lt;Alex&gt;')
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
  })
})
