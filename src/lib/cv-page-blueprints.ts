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
  // When true, leftSectionTypes/rightSectionTypes are treated as a combined pool for
  // page-plan-renderer.ts to greedily balance by estimated height instead of fixed
  // per-column lists - any 'experience' spillover still pins to the right column first
  // (preserving reading-flow continuity from the previous page), but the remaining
  // "bonus" types (certifications, achievements, projects, hobbies, etc.) go wherever
  // has less content so far. Use for zones whose right column mixes experience
  // continuation with bonus content - a fixed split there reliably produces one
  // overflowing column and one empty one, since bonus-section length varies a lot
  // more than the blueprint's static column assignment can account for.
  balancedColumns?: boolean
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
// 2-page: Page1 [L: summary, education, skills | R: experience]
//         Page2 [L: certifications, hobbies, languages*, volunteering*, (education/skills overflow) | R: experience overflow, achievements*, projects*]
//         (page 2's left/right split above is nominal - balancedColumns pools all of it
//         and assigns by estimated height, see buildBalancedZone in page-plan-renderer.ts)
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
//
// COLUMN CAPACITY CHECK (why the bonus-section budgets below are sized the way they are):
// For most real CVs, experience/education/skills fit entirely on page 1 without
// spilling onto later pages (confirmed live: a typical 2-page test CV rendered page 1
// at 94% occupancy using only its own left/right column content). That means page 2's
// ENTIRE occupancy comes from whatever budget is assigned to its own dedicated sections
// - there's no overflow to fall back on. A right column that isn't fully claimed by
// spillover needs its own sections' targets to sum to roughly CHARS_PER_COLUMN_PAGE
// (~4,250 chars, the same constant page-plan-renderer.ts uses to decide when experience
// needs a second column) or that column renders mostly empty. Previously
// achievements+projects on page 2's right column only targeted 900+1000 = 1,900 chars
// combined (~45% of a column) - that is the exact, measured cause of page 2 rendering
// at ~22-37% occupancy in production. Bumped to ~2,200 each (~4,400 combined, matching
// a full column) below. Certifications (page 2 left column) stays modest and verbatim
// - it's in VERBATIM_SECTION_TYPES in cv-layout-validator.ts and must never be padded
// with invented institutions, so its column will legitimately stay shorter for
// candidates with few real certifications; that's a content-truthfulness constraint,
// not a budget bug.
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
    minTotalChars: 10500,
    targetTotalChars: 14600,
    maxTotalChars: 18000,
    zones: [
      // hobbies moved off page 1 (see page_2_bonus_sections below): with skills now
      // rendering as chips, keeping hobbies in the same column as summary/education/skills
      // left it exactly one section too many for the column to reliably fit - and page 1
      // never lacked for fill (94% occupancy confirmed live) while page 2 was the page
      // repeatedly reported as having genuine leftover white space.
      { id: 'page_1_profile_experience', page: 1, layout: 'two-column', leftSectionTypes: ['summary', 'education', 'skills'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 5700, targetChars: 7100, maxChars: 8600 },
      // hobbies, languages, and volunteering are all short, verbatim-or-truthfully-inferred
      // "bonus" sections - pooling three of them here alongside certifications gives
      // balancedColumns real material to spread across the left column instead of just
      // certifications (often a single line) sitting alone next to a full achievements/
      // projects column. languages/volunteering are allowGenerated (see sectionBudgets
      // below) so the dedicated fill pass in rewrite/route.ts can add them, truthfully
      // inferred from the candidate's real experience and adapted to the target role,
      // when the original CV doesn't already have them.
      { id: 'page_2_bonus_sections', page: 2, layout: 'two-column', leftSectionTypes: ['certifications', 'hobbies', 'languages', 'volunteering', 'education', 'skills'], rightSectionTypes: ['experience', 'achievements', 'projects'], sectionTypes: [], balancedColumns: true, minChars: 6500, targetChars: 9500, maxChars: 12500 }
    ],
    sectionBudgets: [
      { sectionType: 'summary', minChars: 600, targetChars: 900, maxChars: 1300, required: true, preferredPage: 1 },
      { sectionType: 'experience', minChars: 2400, targetChars: 3800, maxChars: 7500, required: true, preferredPage: 1 },
      // Rendered as individual chip tags (page-plan-renderer.ts's CHIP_SECTION_TYPES) -
      // each item's border/padding/wrap overhead makes chips noticeably less space-dense
      // than plain paragraph text was when this budget was first calibrated. Trimmed
      // ~15% from the old 1500/2000 so hobbies (last item in the same left column)
      // reliably has room left at the bottom of the page instead of getting squeezed off.
      { sectionType: 'skills', minChars: 1000, targetChars: 1300, maxChars: 1700, required: true, preferredPage: 1 },
      { sectionType: 'education', minChars: 450, targetChars: 750, maxChars: 1200, required: false, preferredPage: 1 },
      // Moved to page 2 (see page_2_bonus_sections) to pool with certifications/languages/
      // volunteering instead of being the section that gets squeezed off page 1's left
      // column - still verbatim (VERBATIM_SECTION_TYPES in cv-layout-validator.ts), so this
      // budget can't be met by expansion, only by the candidate's real content.
      { sectionType: 'hobbies', minChars: 0, targetChars: 450, maxChars: 750, required: false, preferredPage: 2 },
      { sectionType: 'certifications', minChars: 300, targetChars: 900, maxChars: 1300, required: false, preferredPage: 2 },
      // New bonus sections for page 2's left-column pool alongside certifications/hobbies -
      // allowGenerated so the dedicated fill pass (rewrite/route.ts) can add them, truthfully
      // inferred from the candidate's real experience and adapted to the target role, when
      // the original CV doesn't already list them. Sized similarly to hobbies/certifications
      // (modest, not full achievements/projects-sized) since they're meant to round out a
      // short column rather than dominate it.
      { sectionType: 'languages', minChars: 0, targetChars: 500, maxChars: 800, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'volunteering', minChars: 0, targetChars: 600, maxChars: 900, required: false, preferredPage: 2, allowGenerated: true },
      // minChars raised from 500: live-observed generations were landing at ~1,300-1,400
      // chars for achievements and ~1,000-1,100 for projects - comfortably clearing the
      // old 500-char floor, so validateCVLayout's under-minimum check never fired even
      // though both sections were well short of the 2,200 target, leaving genuine white
      // space on page 2 that no repair pass ever addressed. A floor close to (but still
      // below) target reliably triggers the existing, already-proven repair/expansion
      // path instead of silently accepting an undershoot.
      { sectionType: 'achievements', minChars: 1700, targetChars: 2200, maxChars: 3000, required: false, preferredPage: 2, allowGenerated: true },
      { sectionType: 'projects', minChars: 1700, targetChars: 2200, maxChars: 3000, required: false, preferredPage: 2, allowGenerated: true }
    ]
  },
  3: {
    targetPages: 3,
    minTotalChars: 14000,
    targetTotalChars: 17500,
    maxTotalChars: 21000,
    zones: [
      { id: 'page_1_profile_experience', page: 1, layout: 'two-column', leftSectionTypes: ['summary', 'skills'], rightSectionTypes: ['experience'], sectionTypes: [], minChars: 6000, targetChars: 7500, maxChars: 9000 },
      { id: 'page_2_education_experience', page: 2, layout: 'two-column', leftSectionTypes: ['education', 'certifications'], rightSectionTypes: ['experience', 'achievements'], sectionTypes: [], balancedColumns: true, minChars: 7000, targetChars: 8500, maxChars: 10000 },
      { id: 'page_3_bonus_sections', page: 3, layout: 'two-column', leftSectionTypes: ['hobbies'], rightSectionTypes: ['projects', 'achievements'], sectionTypes: [], balancedColumns: true, minChars: 4000, targetChars: 6000, maxChars: 8000 }
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
      { id: 'page_3_achievements_projects', page: 3, layout: 'two-column', leftSectionTypes: ['certifications', 'achievements'], rightSectionTypes: ['experience', 'projects'], sectionTypes: [], balancedColumns: true, minChars: 6000, targetChars: 8500, maxChars: 10000 },
      { id: 'page_4_bonus_sections', page: 4, layout: 'two-column', leftSectionTypes: ['hobbies'], rightSectionTypes: ['projects', 'additional_information'], sectionTypes: [], balancedColumns: true, minChars: 4000, targetChars: 6500, maxChars: 9000 }
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
