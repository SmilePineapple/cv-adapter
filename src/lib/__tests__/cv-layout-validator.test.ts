import { describe, expect, it } from 'vitest'
import { getCVPageBlueprint } from '../cv-page-blueprints'
import { validateCVLayout } from '../cv-layout-validator'
import { CVSection } from '@/types/database'

describe('cv layout validator', () => {
  it('flags underfilled multi-page CVs', () => {
    const sections: CVSection[] = [
      { type: 'summary', content: 'Short summary.', order: 1 },
      { type: 'experience', content: 'Short experience.', order: 2 },
      { type: 'skills', content: 'Short skills.', order: 3 }
    ]

    const result = validateCVLayout(sections, getCVPageBlueprint(3))

    expect(result.isValid).toBe(false)
    expect(result.issues.some(issue => issue.code === 'total_under_minimum')).toBe(true)
    expect(result.repairInstructions.length).toBeGreaterThan(0)
  })

  it('accepts content that fits a selected page budget', () => {
    const sections: CVSection[] = [
      { type: 'summary', content: 'S'.repeat(650), order: 1 },
      { type: 'experience', content: 'E'.repeat(3300), order: 2 },
      { type: 'skills', content: 'K'.repeat(800), order: 3 },
      { type: 'education', content: 'D'.repeat(300), order: 4 }
    ]

    const result = validateCVLayout(sections, getCVPageBlueprint(2))

    expect(result.isValid).toBe(true)
    expect(result.totalChars).toBe(5050)
  })

  it('normalizes profile and work experience section aliases', () => {
    const sections = [
      { type: 'profile', content: 'P'.repeat(500), order: 1 },
      { type: 'work_experience', content: 'E'.repeat(3200), order: 2 },
      { type: 'key_skills', content: 'S'.repeat(700), order: 3 },
      { type: 'education', content: 'D'.repeat(400), order: 4 },
      { type: 'certifications', content: 'C'.repeat(300), order: 5 }
    ] as CVSection[]

    const result = validateCVLayout(sections, getCVPageBlueprint(2))

    expect(result.issues.some(issue => issue.code === 'missing_required_section')).toBe(false)
  })
})
