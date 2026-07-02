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
  // Used for 'single-column' zones - all sections stack in reading order.
  sectionTypes: CVSectionType[]
  // Used for 'two-column' zones instead of sectionTypes - each column stacks
  // independently so column composition is explicit (mirrors the proven
  // 1-page template's left-column/right-column split) rather than relying on
  // CSS grid auto-placement to interleave a flat list unpredictably.
  leftSectionTypes?: CVSectionType[]
  rightSectionTypes?: CVSectionType[]
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
    const sectionsDescription = zone.layout === 'two-column' && (zone.leftSectionTypes || zone.rightSectionTypes)
      ? `left column: ${(zone.leftSectionTypes ?? []).join(', ') || 'none'}; right column: ${(zone.rightSectionTypes ?? []).join(', ') || 'none'}`
      : `sections ${zone.sectionTypes.join(', ')}`
    return `Page ${zone.page} (${zone.layout}) zone ${zone.id}: ${sectionsDescription}; target ${zone.targetChars} chars; acceptable ${zone.minChars}-${zone.maxChars} chars`
  }).join('\n')

  const budgets = blueprint.sectionBudgets.map(budget => {
    return `${budget.sectionType}: target ${budget.targetChars} chars; acceptable ${budget.minChars}-${budget.maxChars}; ${budget.required ? 'required' : 'optional'}${budget.allowGenerated ? '; may be generated if useful' : ''}`
  }).join('\n')

  return `Target pages: ${blueprint.targetPages}\nTotal target: ${blueprint.targetTotalChars} chars; acceptable ${blueprint.minTotalChars}-${blueprint.maxTotalChars} chars\n\nPage zones:\n${zones}\n\nSection budgets:\n${budgets}`
}

// 🎯 PHASE 5 CALIBRATION (Creative Modern template only)
// Budget calibration notes (page-plan-renderer.ts default theme: 10px / line-height 1.36,
// ~11-12mm padding). Measured usable capacity per A4 page at this density:
//   - single-column full  ≈ 5,400 chars (~4,800 on page 1 after the name/contact header)
//   - two-column full      ≈ 8,500 chars (increased from 7,200 - two-column is denser)
//   - two-column per column ≈ 4,250 chars (half of the above; page 1's columns get
//     somewhat less since the header eats into that page's usable height)
//
// 🎯 PHASE 6: Explicit left/right columns, every page mirrors the 1-page template's
// proven layout (left: summary/education/skills/hobbies, right: experience) instead
// of page 1 being single-column (summary+experience) and page 2 being an
// unpredictable CSS-grid-ordered two-column dump of everything else. Experience only
// ever lives in right columns and only spills onto a second right column when the
// content genuinely needs it (see splitByJobBoundary's idealChunks calculation in
// page-plan-renderer.ts) - these zone lists are available slots, not a mandate to
// fill every one of them.
//
// Targets aim for 85-92% fill. The density multiplier (Phase 2) adjusts for content type.
// Deterministic spacing-fill + render measurement absorb small gaps.
//
// PAGE MAP (the actual per-page-count column assignment - keep in sync with the zones below):
//
// 2-page: Page1 [L: summary, education, skills, hobbies | R: experience]
//         Page2 [L: certifications, (education/skills overflow) | R: experience overflow, achievements*, projects*]
// 3-page: Page1 [L: summary, skills | R: experience]
//         Page2 [L: education, certifications | R: experience overflow, achievements*]
//         Page3 [L: hobbies | R: projects*, achievements* overflow]
// 4-page: Page1 [L: summary, skills | R: experience]
//         Page2 [L: education | R: experience overflow]
//         Page3 [L: certifications, achievements* | R: experience overflow, projects*]
//         Page4 [L: hobbies | R: projects* overflow, additional_information*]
//
// * = allowGenerated: true - the AI is asked to generate these truthfully from the
// candidate's real experience when the original CV doesn't have them. This is what
// fills the "bonus" pages/columns beyond what a 1-page CV would show. Getting this to
// actually happen reliably (not just when a repair pass happens to remember to add it)
// is handled by the dedicated fill pass in rewrite/route.ts, not by hoping a generic
// "expand everything" repair instruction covers it.
// AI condense pass handles rare overflow cases.
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
    minTotalChars: 9000,
    targetTotalChars: 11500,
    maxTotalChars: 14000,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'two-column', leftSectionTypes: ['summary', 'education', 'skills', 'hobbies'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 6000, targetChars: 7500, maxChars: 9000 },
      { id: 'page_2_bonus_sections', page: 2, layout: 'two-column', leftSectionTypes: ['certifications', 'education', 'skills'], rightSectionTypes: ['experience', 'achievements', 'projects'], sectionTypes: [], minChars: 7000, targetChars: 8500, maxChars: 10000 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 600, targetChars: 900, maxChars: 1300, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 2400, targetChars: 3800, maxChars: 7500, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 1000, targetChars: 1500, maxChars: 2000, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 450, targetChars: 750, maxChars: 1200, required: false, preferredPage: 1 },
      { sectionType: 'hobbies', minChars: 0, targetChars: 450, maxChars: 750, required: false, preferredPage: 1 },
      { sectionType: 'certifications', minChars: 300, targetChars: 650, maxChars: 1000, required: false, preferredPage: 2 },
      { sectionType: 'achievements', minChars: 0, targetChars: 900, maxChars: 1500, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'projects', minChars: 0, targetChars: 1000, maxChars: 1600, required: false, preferredPage: 2, allowGenerated: true }
    ]
  },
  3: {
    targetPages: 3,
    minTotalChars: 14000,
    targetTotalChars: 17500,
    maxTotalChars: 21000,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'two-column', leftSectionTypes: ['summary', 'skills'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 6000, targetChars: 7500, maxChars: 9000 },
      { id: 'page_2_education_experience', page: 2, layout: 'two-column', leftSectionTypes: ['education', 'certifications'], rightSectionTypes: ['experience', 'achievements'], sectionTypes: [], minChars: 7000, targetChars: 8500, maxChars: 10000 },
      { id: 'page_3_bonus_sections', page: 3, layout: 'two-column', leftSectionTypes: ['hobbies'], rightSectionTypes: ['projects', 'achievements'], sectionTypes: [], minChars: 4000, targetChars: 6000, maxChars: 8000 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 700, targetChars: 1100, maxChars: 1500, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 4500, targetChars: 8500, maxChars: 13000, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 1200, targetChars: 1800, maxChars: 2400, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 450, targetChars: 850, maxChars: 1300, required: false, preferredPage: 2 },
      { sectionType: 'certifications', minChars: 350, targetChars: 750, maxChars: 1200, required: false, preferredPage: 2 },
      { sectionType: 'achievements', minChars: 0, targetChars: 1700, maxChars: 2400, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'projects', minChars: 0, targetChars: 1500, maxChars: 2200, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 0, targetChars: 550, maxChars: 900, required: false, preferredPage: 3 }
    ]
  },
  4: {
    targetPages: 4,
    minTotalChars: 19500,
    targetTotalChars: 24500,
    maxTotalChars: 30000,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'two-column', leftSectionTypes: ['summary', 'skills'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 6000, targetChars: 7500, maxChars: 9000 },
      { id: 'page_2_education_experience', page: 2, layout: 'two-column', leftSectionTypes: ['education'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 6000, targetChars: 8500, maxChars: 10000 },
      { id: 'page_3_achievements_projects', page: 3, layout: 'two-column', leftSectionTypes: ['certifications', 'achievements'], rightSectionTypes: ['experience', 'projects'], sectionTypes: [], minChars: 6000, targetChars: 8500, maxChars: 10000 },
      { id: 'page_4_bonus_sections', page: 4, layout: 'two-column', leftSectionTypes: ['hobbies'], rightSectionTypes: ['projects', 'additional_information'], sectionTypes: [], minChars: 4000, targetChars: 6500, maxChars: 9000 }
    ],
    sectionBudgets: [
      { sectionType: 'experience', minChars: 6000, targetChars: 11000, maxChars: 18000, required: true, preferredPage: 1 },
      { sectionType: 'summary', minChars: 900, targetChars: 1400, maxChars: 1900, required: true, preferredPage: 1 },
      { sectionType: 'skills', minChars: 1600, targetChars: 2400, maxChars: 3100, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 600, targetChars: 1100, maxChars: 1700, required: false, preferredPage: 2 },
      { sectionType: 'certifications', minChars: 500, targetChars: 1000, maxChars: 1600, required: false, preferredPage: 3 },
      { sectionType: 'achievements', minChars: 1100, targetChars: 2200, maxChars: 3100, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'projects', minChars: 1100, targetChars: 2000, maxChars: 2900, required: false, preferredPage: 3, allowGenerated: true },
      { sectionType: 'additional_information', minChars: 0, targetChars: 1200, maxChars: 2000, required: false, preferredPage: 4, allowGenerated: true },
      { sectionType: 'hobbies', minChars: 300, targetChars: 650, maxChars: 1100, required: false, preferredPage: 4 }
    ]
  }
}
