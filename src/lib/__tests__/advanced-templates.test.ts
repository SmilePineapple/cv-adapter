import { describe, expect, it } from 'vitest'
import { renderExperienceEntries, generateProfessionalColumnsHTML, generateCreativeModernHTML } from '../advanced-templates'

const JOBS = [
  {
    job_title: 'Financial Director',
    company: 'Cherry Rain (P) Ltd',
    dates: '08/2022 - Present',
    responsibilities: 'Built the finance function from start-up.'
  },
  {
    job_title: 'CFO',
    company: 'Gable Mortgages Ltd',
    dates: '05/2024 - 04/2026',
    responsibilities: ['Partnered with founders.', 'Developed scalable reporting.']
  }
]

describe('renderExperienceEntries', () => {
  it('renders one structured entry per job with title/company/date headings', () => {
    const html = renderExperienceEntries(JOBS)
    expect(html.match(/class="experience-entry"/g)).toHaveLength(2)
    expect(html).toContain('<div class="job-title">Financial Director</div>')
    expect(html).toContain('<div class="company">Cherry Rain (P) Ltd</div>')
    expect(html).toContain('<div class="date-location">08/2022 - Present</div>')
    expect(html).toContain('<div class="job-title">CFO</div>')
  })

  it('renders array responsibilities as bullet lines', () => {
    const html = renderExperienceEntries(JOBS)
    expect(html).toContain('• Partnered with founders.')
    expect(html).toContain('• Developed scalable reporting.')
  })

  it('parses a JSON-stringified job array (legacy rows)', () => {
    const html = renderExperienceEntries(JSON.stringify(JOBS))
    expect(html.match(/class="experience-entry"/g)).toHaveLength(2)
    expect(html).toContain('<div class="job-title">Financial Director</div>')
  })

  it('falls back to a plain pre-wrap section-content div for free-text content', () => {
    const html = renderExperienceEntries('Just a plain paragraph of experience.')
    expect(html).toContain('class="section-content"')
    expect(html).toContain('Just a plain paragraph of experience.')
    expect(html).not.toContain('experience-entry')
  })

  it('escapes HTML in job fields', () => {
    const html = renderExperienceEntries([{ job_title: 'CTO <script>', company: 'A&B', dates: '2020' }])
    expect(html).toContain('CTO &lt;script&gt;')
    expect(html).toContain('A&amp;B')
    expect(html).not.toContain('<script>')
  })

  it('recognizes role/details field names (real-world upload shape, not just title/bullets)', () => {
    // Regression test: uploaded CVs commonly parse to { role, details: [...] } rather than
    // { title, bullets: [...] } - a prior version of this fallback only recognized title/
    // bullets and, for role/details, silently dropped the details array entirely, rendering
    // just the bare job name with no description bullets at all.
    const html = renderExperienceEntries([
      {
        role: 'Manual Work Experience',
        details: [
          'Experience using tools and working with hands-on tasks.',
          'Understanding of organization and stock handling.'
        ]
      }
    ])
    expect(html).toContain('<div class="job-title">Manual Work Experience</div>')
    expect(html).toContain('• Experience using tools and working with hands-on tasks.')
    expect(html).toContain('• Understanding of organization and stock handling.')
  })
})

describe('two-column template generators', () => {
  const sections = [
    { type: 'name', content: 'Test Person', order: 0 },
    { type: 'experience', content: JOBS, order: 1 },
    { type: 'skills', content: ['Leadership', 'Finance'], order: 2 }
  ]
  const contactInfo = { email: 'test@example.com' }

  it('professional columns uses structured experience entries, not a flat text blob', () => {
    const html = generateProfessionalColumnsHTML(sections, contactInfo)
    expect(html).toContain('class="experience-entry"')
    expect(html).toContain('<div class="job-title">Financial Director</div>')
    // The style block must actually define the chip + entry classes the markup relies on
    expect(html).toContain('.skill-tag')
    expect(html).toContain('.experience-entry')
    expect(html).toContain('.section-content')
  })

  it('creative modern uses structured experience entries in the two-column layout', () => {
    const html = generateCreativeModernHTML(sections, contactInfo, 1)
    expect(html).toContain('class="experience-entry"')
    expect(html).toContain('<div class="job-title">CFO</div>')
  })

  it('creative modern uses structured experience entries in the multi-page single-column layout', () => {
    const html = generateCreativeModernHTML(sections, contactInfo, 2)
    expect(html).toContain('class="experience-entry"')
    expect(html).toContain('<div class="job-title">Financial Director</div>')
  })
})

describe('empty-content sections are omitted, not rendered as bare headers', () => {
  // Regression test: CV parsers commonly emit a placeholder section for every known type
  // (e.g. { type: 'certifications', content: [] }) whether or not the user has that content.
  // A prior version gated rendering on "does this section exist" alone, which rendered a
  // colored header with nothing underneath - a visible strip of dead white space with no
  // way for the layout to reclaim it.
  const sectionsWithEmpties = [
    { type: 'name', content: 'Test Person', order: 0 },
    { type: 'experience', content: JOBS, order: 1 },
    { type: 'skills', content: ['Leadership'], order: 2 },
    { type: 'certifications', content: [], order: 3 },
    { type: 'volunteer', content: [], order: 4 },
    { type: 'summary', content: [], order: 5 }
  ]
  const contactInfo = { email: 'test@example.com' }

  it('creative modern omits empty certifications/volunteer/summary sections entirely', () => {
    const html = generateCreativeModernHTML(sectionsWithEmpties, contactInfo, 1)
    expect(html).not.toContain('>CERTIFICATIONS<')
    expect(html).not.toContain('>VOLUNTEER<')
    expect(html).not.toContain('>SUMMARY<')
    // The non-empty sections must still render
    expect(html).toContain('Work Experience')
  })

  it('professional columns omits empty certifications/volunteer/summary sections entirely', () => {
    const html = generateProfessionalColumnsHTML(sectionsWithEmpties, contactInfo)
    expect(html).not.toContain('>CERTIFICATIONS<')
    expect(html).not.toContain('>VOLUNTEER<')
    expect(html).not.toContain('>SUMMARY<')
    expect(html).toContain('Work Experience')
  })

  it('still renders a section whose content is a non-empty but falsy-looking value', () => {
    const html = generateCreativeModernHTML([
      { type: 'name', content: 'Test Person', order: 0 },
      { type: 'certifications', content: ['AWS Certified'], order: 1 }
    ], contactInfo, 1)
    expect(html).toContain('AWS Certified')
  })
})
