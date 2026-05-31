import { CVSection } from '@/types/database'

export type SupportedPageCount = 1 | 2 | 3 | 4

export type CVSectionType = CVSection['type'] | 'profile' | 'achievements' | 'additional_information' | 'languages' | 'volunteering' | 'conferences'

export type LayoutMode = 'single-column' | 'two-column' | 'hybrid'

export interface SectionBudget {
  sectionType: CVSectionType
  minChars: number
  targetChars: number
  maxChars: number
  required: boolean
  preferredPage?: number
  allowGenerated?: boolean
}

export interface PageZone {
  id: string
  page: number
  layout: LayoutMode
  sectionTypes: CVSectionType[]
  minChars: number
  targetChars: number
  maxChars: number
}

export interface CVPageBlueprint {
  targetPages: SupportedPageCount
  minTotalChars: number
  targetTotalChars: number
  maxTotalChars: number
  zones: PageZone[]
  sectionBudgets: SectionBudget[]
}

export function normalizePageCount(pageCount?: number): SupportedPageCount {
  if (pageCount === 2 || pageCount === 3 || pageCount === 4) return pageCount
  return 1
}

export function getCVPageBlueprint(pageCount?: number): CVPageBlueprint {
  const targetPages = normalizePageCount(pageCount)
  return blueprints[targetPages]
}

export function getBudgetForSection(blueprint: CVPageBlueprint, sectionType: string): SectionBudget | undefined {
  return blueprint.sectionBudgets.find(budget => budget.sectionType === sectionType)
}

export function formatBlueprintForPrompt(blueprint: CVPageBlueprint): string {
  const zones = blueprint.zones.map(zone => {
    return `Page ${zone.page} (${zone.layout}) zone ${zone.id}: sections ${zone.sectionTypes.join(', ')}; target ${zone.targetChars} chars; acceptable ${zone.minChars}-${zone.maxChars} chars`
  }).join('\n')

  const budgets = blueprint.sectionBudgets.map(budget => {
    return `${budget.sectionType}: target ${budget.targetChars} chars; acceptable ${budget.minChars}-${budget.maxChars}; ${budget.required ? 'required' : 'optional'}${budget.allowGenerated ? '; may be generated if useful' : ''}`
  }).join('\n')

  return `Target pages: ${blueprint.targetPages}\nTotal target: ${blueprint.targetTotalChars} chars; acceptable ${blueprint.minTotalChars}-${blueprint.maxTotalChars} chars\n\nPage zones:\n${zones}\n\nSection budgets:\n${budgets}`
}

// Budget calibration notes (page-plan-renderer.ts default theme: 10px / line-height 1.36,
// ~11-12mm padding). Measured usable capacity per A4 page at this density:
//   - single-column full  ≈ 5,400 chars (~4,800 on page 1 after the name/contact header)
//   - two-column full      ≈ 7,200 chars
// Targets below aim for ~88-92% fill so generated content genuinely fills each page.
// The deterministic spacing-fill pass + render measurement absorb small residual gaps,
// and the AI condense pass handles the rare overflow case.
const blueprints: Record<SupportedPageCount, CVPageBlueprint> = {
  1: {
    targetPages: 1,
    minTotalChars: 3900,
    targetTotalChars: 4800,
    maxTotalChars: 5600,
    zones: [
      { id: 'single_page_core', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience', 'skills', 'education', 'certifications'], minChars: 3900, targetChars: 4800, maxChars: 5600 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 350, targetChars: 550, maxChars: 750, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 2400, targetChars: 2900, maxChars: 3500, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 450, targetChars: 650, maxChars: 900, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 200, targetChars: 400, maxChars: 650, required: false, preferredPage: 1 },
      { sectionType: 'certifications', minChars: 0, targetChars: 300, maxChars: 550, required: false, preferredPage: 1 }
    ]
  },
  2: {
    targetPages: 2,
    minTotalChars: 9800,
    targetTotalChars: 12000,
    maxTotalChars: 13600,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience'], minChars: 4000, targetChars: 4800, maxChars: 5600 },
      { id: 'page_2_supporting_sections', page: 2, layout: 'two-column', sectionTypes: ['experience', 'skills', 'education', 'certifications', 'projects', 'hobbies'], minChars: 5800, targetChars: 7200, maxChars: 8000 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 450, targetChars: 650, maxChars: 900, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 5500, targetChars: 7000, maxChars: 8500, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 700, targetChars: 1000, maxChars: 1400, required: true, preferredPage: 2 },
      { sectionType: 'education', minChars: 300, targetChars: 550, maxChars: 850, required: false, preferredPage: 2 },
      { sectionType: 'certifications', minChars: 200, targetChars: 450, maxChars: 750, required: false, preferredPage: 2 },
      { sectionType: 'projects', minChars: 0, targetChars: 750, maxChars: 1200, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 0, targetChars: 320, maxChars: 550, required: false, preferredPage: 2 }
    ]
  },
  3: {
    targetPages: 3,
    minTotalChars: 14000,
    targetTotalChars: 17000,
    maxTotalChars: 19200,
    zones: [
      { id: 'page_1_profile_primary_experience', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience'], minChars: 4000, targetChars: 4800, maxChars: 5600 },
      { id: 'page_2_experience_achievements', page: 2, layout: 'single-column', sectionTypes: ['experience', 'achievements', 'projects'], minChars: 4400, targetChars: 5400, maxChars: 6200 },
      { id: 'page_3_supporting_sections', page: 3, layout: 'two-column', sectionTypes: ['skills', 'education', 'certifications', 'projects', 'hobbies'], minChars: 5800, targetChars: 7000, maxChars: 8000 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 550, targetChars: 800, maxChars: 1100, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 7500, targetChars: 9200, maxChars: 11000, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 900, targetChars: 1300, maxChars: 1700, required: true, preferredPage: 3 },
      { sectionType: 'education', minChars: 350, targetChars: 650, maxChars: 950, required: false, preferredPage: 3 },
      { sectionType: 'certifications', minChars: 250, targetChars: 550, maxChars: 850, required: false, preferredPage: 3 },
      { sectionType: 'achievements', minChars: 0, targetChars: 1200, maxChars: 1700, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'projects', minChars: 0, targetChars: 1050, maxChars: 1500, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 0, targetChars: 380, maxChars: 650, required: false, preferredPage: 3 }
    ]
  },
  4: {
    targetPages: 4,
    minTotalChars: 20500,
    targetTotalChars: 25000,
    maxTotalChars: 28000,
    zones: [
      { id: 'page_1_work_experience', page: 1, layout: 'single-column', sectionTypes: ['experience'], minChars: 4000, targetChars: 4800, maxChars: 5600 },
      { id: 'page_2_profile_skills', page: 2, layout: 'two-column', sectionTypes: ['summary', 'skills'], minChars: 5800, targetChars: 7000, maxChars: 8000 },
      { id: 'page_3_achievements_projects', page: 3, layout: 'two-column', sectionTypes: ['achievements', 'projects', 'experience'], minChars: 5800, targetChars: 7000, maxChars: 8000 },
      { id: 'page_4_supporting_sections', page: 4, layout: 'two-column', sectionTypes: ['education', 'certifications', 'hobbies', 'additional_information'], minChars: 5800, targetChars: 7000, maxChars: 8000 }
    ],
    sectionBudgets: [
      { sectionType: 'experience', minChars: 8500, targetChars: 11000, maxChars: 13500, required: true, preferredPage: 1 },
      { sectionType: 'summary', minChars: 700, targetChars: 1000, maxChars: 1300, required: true, preferredPage: 2 },
      { sectionType: 'skills', minChars: 1200, targetChars: 1700, maxChars: 2200, required: true, preferredPage: 2 },
      { sectionType: 'education', minChars: 450, targetChars: 800, maxChars: 1200, required: false, preferredPage: 4 },
      { sectionType: 'certifications', minChars: 350, targetChars: 700, maxChars: 1100, required: false, preferredPage: 4 },
      { sectionType: 'achievements', minChars: 800, targetChars: 1600, maxChars: 2300, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'projects', minChars: 600, targetChars: 1400, maxChars: 2100, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'additional_information', minChars: 0, targetChars: 850, maxChars: 1400, required: false, preferredPage: 4, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 200, targetChars: 450, maxChars: 750, required: false, preferredPage: 4 }
    ]
  }
}
