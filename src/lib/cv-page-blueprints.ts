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

const blueprints: Record<SupportedPageCount, CVPageBlueprint> = {
  1: {
    targetPages: 1,
    minTotalChars: 2600,
    targetTotalChars: 3300,
    maxTotalChars: 4200,
    zones: [
      { id: 'single_page_core', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience', 'skills', 'education', 'certifications'], minChars: 2600, targetChars: 3300, maxChars: 4200 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 250, targetChars: 400, maxChars: 550, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 1500, targetChars: 2000, maxChars: 2600, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 350, targetChars: 500, maxChars: 700, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 150, targetChars: 250, maxChars: 450, required: false, preferredPage: 1 },
      { sectionType: 'certifications', minChars: 0, targetChars: 150, maxChars: 300, required: false, preferredPage: 1 }
    ]
  },
  2: {
    targetPages: 2,
    minTotalChars: 5000,
    targetTotalChars: 6000,
    maxTotalChars: 7200,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience'], minChars: 2800, targetChars: 3400, maxChars: 4100 },
      { id: 'page_2_supporting_sections', page: 2, layout: 'two-column', sectionTypes: ['experience', 'skills', 'education', 'certifications', 'projects', 'hobbies'], minChars: 2200, targetChars: 2600, maxChars: 3100 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 450, targetChars: 600, maxChars: 800, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 3000, targetChars: 3700, maxChars: 4500, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 600, targetChars: 800, maxChars: 1050, required: true, preferredPage: 2 },
      { sectionType: 'education', minChars: 250, targetChars: 400, maxChars: 650, required: false, preferredPage: 2 },
      { sectionType: 'certifications', minChars: 150, targetChars: 300, maxChars: 500, required: false, preferredPage: 2 },
      { sectionType: 'projects', minChars: 0, targetChars: 450, maxChars: 700, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 0, targetChars: 180, maxChars: 350, required: false, preferredPage: 2 }
    ]
  },
  3: {
    targetPages: 3,
    minTotalChars: 7600,
    targetTotalChars: 8800,
    maxTotalChars: 10200,
    zones: [
      { id: 'page_1_profile_primary_experience', page: 1, layout: 'single-column', sectionTypes: ['summary', 'experience'], minChars: 2900, targetChars: 3400, maxChars: 4000 },
      { id: 'page_2_experience_achievements', page: 2, layout: 'single-column', sectionTypes: ['experience', 'achievements', 'projects'], minChars: 2600, targetChars: 3100, maxChars: 3600 },
      { id: 'page_3_supporting_sections', page: 3, layout: 'two-column', sectionTypes: ['skills', 'education', 'certifications', 'projects', 'hobbies'], minChars: 2100, targetChars: 2300, maxChars: 2600 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 600, targetChars: 750, maxChars: 950, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 4600, targetChars: 5400, maxChars: 6300, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 800, targetChars: 1050, maxChars: 1300, required: true, preferredPage: 3 },
      { sectionType: 'education', minChars: 350, targetChars: 550, maxChars: 800, required: false, preferredPage: 3 },
      { sectionType: 'certifications', minChars: 250, targetChars: 450, maxChars: 700, required: false, preferredPage: 3 },
      { sectionType: 'achievements', minChars: 0, targetChars: 700, maxChars: 1000, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'projects', minChars: 0, targetChars: 650, maxChars: 950, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 0, targetChars: 250, maxChars: 450, required: false, preferredPage: 3 }
    ]
  },
  4: {
    targetPages: 4,
    minTotalChars: 10500,
    targetTotalChars: 12000,
    maxTotalChars: 13800,
    zones: [
      { id: 'page_1_work_experience', page: 1, layout: 'single-column', sectionTypes: ['experience'], minChars: 3000, targetChars: 3500, maxChars: 4100 },
      { id: 'page_2_profile_skills', page: 2, layout: 'two-column', sectionTypes: ['summary', 'skills'], minChars: 2400, targetChars: 2800, maxChars: 3300 },
      { id: 'page_3_achievements_projects', page: 3, layout: 'two-column', sectionTypes: ['achievements', 'projects', 'experience'], minChars: 2500, targetChars: 3000, maxChars: 3500 },
      { id: 'page_4_supporting_sections', page: 4, layout: 'two-column', sectionTypes: ['education', 'certifications', 'hobbies', 'additional_information'], minChars: 2600, targetChars: 2700, maxChars: 2900 }
    ],
    sectionBudgets: [
      { sectionType: 'experience', minChars: 5000, targetChars: 6100, maxChars: 7200, required: true, preferredPage: 1 },
      { sectionType: 'summary', minChars: 700, targetChars: 900, maxChars: 1100, required: true, preferredPage: 2 },
      { sectionType: 'skills', minChars: 1000, targetChars: 1300, maxChars: 1600, required: true, preferredPage: 2 },
      { sectionType: 'education', minChars: 450, targetChars: 700, maxChars: 950, required: false, preferredPage: 4 },
      { sectionType: 'certifications', minChars: 350, targetChars: 650, maxChars: 900, required: false, preferredPage: 4 },
      { sectionType: 'achievements', minChars: 600, targetChars: 1000, maxChars: 1400, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'projects', minChars: 500, targetChars: 900, maxChars: 1300, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'additional_information', minChars: 0, targetChars: 500, maxChars: 800, required: false, preferredPage: 4, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 150, targetChars: 300, maxChars: 500, required: false, preferredPage: 4 }
    ]
  }
}
