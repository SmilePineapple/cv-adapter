import { describe, expect, it } from 'vitest'
import { CVSection } from '@/types/database'
import { createPagePlan, renderPagePlanHTML, PlannedPageZone } from '../page-plan-renderer'

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

// Two-column zones keep left/right sections separate instead of a flat `sections` list.
function zoneSectionTypes(zone: PlannedPageZone): string[] {
  return [...zone.sections, ...(zone.leftSections ?? []), ...(zone.rightSections ?? [])].map(section => section.type)
}

describe('page plan renderer', () => {
  it('creates the selected number of planned pages', () => {
    const plan = createPagePlan(sections, 3)

    expect(plan.pages).toHaveLength(3)
    expect(plan.blueprint.targetPages).toBe(3)
  })

  it('assigns sections to blueprint zones', () => {
    const plan = createPagePlan(sections, 2)
    const zoneSections = plan.pages.flatMap(page => page.zones.flatMap(zoneSectionTypes))

    expect(zoneSections).toContain('summary')
    expect(zoneSections).toContain('experience')
    expect(zoneSections).toContain('skills')
    expect(zoneSections).toContain('education')
  })

  it('balances a short bonus section against long ones instead of leaving a column empty', () => {
    // certifications is short (one real credential); achievements/projects are long
    // (AI-generated bonus content). A fixed left/right split would leave certifications'
    // column mostly empty while achievements+projects stack up in the other - balancing
    // should pair certifications with one long section so both columns fill similarly.
    const longText = 'Detail. '.repeat(200)
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'summary', content: 'Summary', order: 1 },
      { type: 'experience', content: 'Short experience.', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 },
      { type: 'certifications', content: 'One real credential.', order: 4 },
      { type: 'achievements', content: longText, order: 5 } as unknown as CVSection,
      { type: 'projects', content: longText, order: 6 }
    ], 2)

    const page2 = plan.pages.find(page => page.page === 2)
    const zone = page2?.zones.find(z => z.id === 'page_2_bonus_sections')
    expect(zone).toBeDefined()

    const leftTypes = (zone?.leftSections ?? []).map(s => s.type)
    const rightTypes = (zone?.rightSections ?? []).map(s => s.type)

    // certifications must share its column with at least one other section - it should
    // never be left alone as the sole (short) occupant of an otherwise-empty column.
    const certColumn = leftTypes.includes('certifications') ? leftTypes : rightTypes
    expect(certColumn.length).toBeGreaterThan(1)
    expect(leftTypes).toEqual(['certifications', 'projects'])
    expect(rightTypes).toEqual(['achievements'])
  })

  it('still pins experience spillover to the right column when balancing bonus sections', () => {
    // Experience must keep reading-flow continuity from the previous page - it should
    // never get shuffled into the left column even when balancing bonus sections.
    const longExperience = Array.from({ length: 6 }, (_, i) =>
      `Role ${i + 1} | Company ${i + 1} | 20${10 + i}-20${11 + i}\n` + '• '.concat('Delivered measurable improvements across the team. '.repeat(20))
    ).join('\n')
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'summary', content: 'Summary', order: 1 },
      { type: 'experience', content: longExperience, order: 2 },
      { type: 'skills', content: 'Skills', order: 3 },
      { type: 'certifications', content: 'One real credential.', order: 4 }
    ], 2)

    const page2 = plan.pages.find(page => page.page === 2)
    const zone = page2?.zones.find(z => z.id === 'page_2_bonus_sections')
    const leftTypes = (zone?.leftSections ?? []).map(s => s.type)
    const rightTypes = (zone?.rightSections ?? []).map(s => s.type)

    expect(leftTypes).not.toContain('experience')
    expect(rightTypes[0]).toBe('experience')
  })

  it('renders fixed page containers and measurable section attributes', () => {
    // Give every page genuinely distinct content so none of the 4 pages compact away.
    const richSections: CVSection[] = [
      ...sections,
      { type: 'achievements', content: 'Raised attainment by 12% over two years.', order: 8 } as unknown as CVSection,
      { type: 'hobbies', content: 'Chess, hiking, amateur radio.', order: 9 },
      { type: 'additional_information', content: 'Full clean UK driving licence.', order: 10 } as unknown as CVSection
    ]
    const html = renderPagePlanHTML(richSections, 4, 'creative_modern')

    expect(html).toContain('data-page-plan="4"')
    expect(html.match(/class="cv-page"/g)).toHaveLength(4)
    expect(html).toContain('data-section-type="summary"')
    expect(html).toContain('data-section-type="experience"')
    expect(html).toContain('data-zone-id="page_1_profile_experience"')
  })

  it('splits repeated sections across repeated blueprint zones when content genuinely needs it', () => {
    // Long enough (well over one column's ~4,250-char capacity) that it must spill onto
    // a second right column - job-boundary formatted so splitByJobBoundary is exercised.
    const longExperience = Array.from({ length: 6 }, (_, i) =>
      `Role ${i + 1} | Company ${i + 1} | 20${10 + i}-20${11 + i}\n` + '• '.concat('Delivered measurable improvements across the team. '.repeat(20))
    ).join('\n')

    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'experience', content: longExperience, order: 1 },
      { type: 'summary', content: 'Summary', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 }
    ], 4)
    const pageTwoSections = plan.pages
      .find(page => page.page === 2)
      ?.zones.flatMap(zoneSectionTypes)

    expect(pageTwoSections).toContain('experience')
  })

  it('does not split short content across repeated blueprint zones', () => {
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'experience', content: 'Role one\nRole two\nRole three\nRole four', order: 1 },
      { type: 'summary', content: 'Summary', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 }
    ], 4)
    const pageOneRight = plan.pages.find(page => page.page === 1)?.zones.flatMap(zone => zone.rightSections ?? [])
    const laterPagesSections = plan.pages
      .filter(page => page.page !== 1)
      .flatMap(page => page.zones.flatMap(zoneSectionTypes))

    expect((pageOneRight ?? []).map(s => s.type)).toContain('experience')
    expect(laterPagesSections).not.toContain('experience')
  })

  it('normalizes interests into hobbies on supporting pages', () => {
    const plan = createPagePlan([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'experience', content: 'Experience', order: 1 },
      { type: 'summary', content: 'Summary', order: 2 },
      { type: 'skills', content: 'Skills', order: 3 },
      { type: 'interests', content: 'Travel and wellbeing', order: 4 } as unknown as CVSection
    ], 4)
    const allSections = plan.pages.flatMap(page => page.zones.flatMap(zoneSectionTypes))

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

  it('renders skills and hobbies as chip tags rather than paragraphs', () => {
    const html = renderPagePlanHTML([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'summary', content: 'Summary text.', order: 1 },
      { type: 'experience', content: 'Experience text.', order: 2 },
      { type: 'skills', content: 'JavaScript - strong\nReact - strong', order: 3 },
      { type: 'hobbies', content: 'Chess\nHiking', order: 4 }
    ], 2)

    expect(html).toContain('<div class="chip-list">')
    expect(html).toContain('<span class="chip">JavaScript - strong</span>')
    expect(html).toContain('<span class="chip">Chess</span>')
    // Skills/hobbies must not also fall through to plain paragraph rendering.
    expect(html).not.toContain('<p>JavaScript - strong</p>')
  })

  it('splits experience into dated entries with a divider, without misclassifying bullets', () => {
    const html = renderPagePlanHTML([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'summary', content: 'Summary text.', order: 1 },
      { type: 'experience', content: '10/2016 - 08/2022\nChild in Mind\nPlay Therapist\nDelivered sessions.\n01/2015 - 10/2016\nBarnardos\nPlay Therapist\nCoordinated sessions.', order: 2 },
      { type: 'skills', content: 'React', order: 3 }
    ], 2)

    expect(html).toContain('<div class="experience-entry"><p class="exp-date">10/2016 - 08/2022</p>')
    expect(html).toContain('<p>Child in Mind</p>')
    expect(html).toContain('<div class="experience-entry"><p class="exp-date">01/2015 - 10/2016</p>')
    // Only date lines get the highlighted treatment - company/title/bullets stay plain.
    expect(html).not.toContain('<p class="exp-date">Child in Mind</p>')
  })

  it('renders certifications as a bulleted list', () => {
    const html = renderPagePlanHTML([
      { type: 'name', content: 'Alex Teacher', order: 0 },
      { type: 'summary', content: 'Summary text.', order: 1 },
      { type: 'experience', content: 'Experience text.', order: 2 },
      { type: 'certifications', content: 'AWS Certified\nCKA', order: 3 }
    ], 2)

    expect(html).toContain('<ul class="bullet-list">')
    expect(html).toContain('<li>AWS Certified</li>')
    expect(html).toContain('<li>CKA</li>')
  })
})
