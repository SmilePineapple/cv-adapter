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

  it('escapes section content', () => {
    const html = renderPagePlanHTML([
      { type: 'name', content: '<Alex>', order: 0 },
      { type: 'summary', content: '<script>alert("x")</script>', order: 1 }
    ], 2)

    expect(html).toContain('&lt;Alex&gt;')
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
  })
})
