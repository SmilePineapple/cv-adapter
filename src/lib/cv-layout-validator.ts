import { CVSection } from '@/types/database'
import { CVPageBlueprint, CVSectionType, getBudgetForSection } from './cv-page-blueprints'

// These section types are instructed elsewhere (the main generation prompt) to be
// copied 100% exactly from the original CV with zero modifications - the AI has no
// truthful way to "expand" them with new characters, since it isn't allowed to add
// new facts. Flagging them as under-budget (even without an explicit repair
// instruction) still surfaces the shortfall in the repair prompt's metrics table,
// which is enough to pressure the AI into fabricating a plausible-sounding
// institution/certificate to close the gap - so these are excluded from the
// under-minimum check entirely, not just from the "expand" instruction.
const VERBATIM_SECTION_TYPES = new Set(['education', 'certifications', 'hobbies'])

export type LayoutIssueSeverity = 'error' | 'warning'
export type LayoutIssueCode = 'missing_required_section' | 'total_under_minimum' | 'total_over_maximum' | 'section_under_minimum' | 'section_over_maximum'

export interface SectionMetric {
  type: string
  chars: number
  budgetMin?: number
  budgetTarget?: number
  budgetMax?: number
}

export interface LayoutIssue {
  code: LayoutIssueCode
  severity: LayoutIssueSeverity
  message: string
  sectionType?: string
  charsNeeded?: number
  charsOver?: number
}

export interface LayoutValidationResult {
  isValid: boolean
  totalChars: number
  targetTotalChars: number
  minTotalChars: number
  maxTotalChars: number
  sectionMetrics: SectionMetric[]
  issues: LayoutIssue[]
  repairInstructions: string[]
}

export function getSectionText(content: unknown): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(item => getSectionText(item)).filter(Boolean).join('\n\n')
  }
  if (typeof content === 'object') {
    return Object.values(content as Record<string, unknown>).map(value => getSectionText(value)).filter(Boolean).join('\n')
  }
  return String(content)
}

export function normalizeSectionType(type: string): CVSectionType | string {
  if (type === 'profile' || type === 'professional_summary') return 'summary'
  if (type === 'work_experience') return 'experience'
  if (type === 'key_skills') return 'skills'
  if (type === 'licenses') return 'certifications'
  if (type === 'interests') return 'hobbies'
  return type
}

export function validateCVLayout(sections: CVSection[], blueprint: CVPageBlueprint): LayoutValidationResult {
  const normalizedSections = sections.map(section => ({
    ...section,
    normalizedType: normalizeSectionType(section.type)
  }))

  const totalChars = normalizedSections.reduce((sum, section) => sum + getSectionText(section.content).length, 0)
  const issues: LayoutIssue[] = []
  const sectionMetrics: SectionMetric[] = []

  for (const budget of blueprint.sectionBudgets) {
    const matchingSections = normalizedSections.filter(section => section.normalizedType === budget.sectionType)
    const chars = matchingSections.reduce((sum, section) => sum + getSectionText(section.content).length, 0)

    if (matchingSections.length > 0 || budget.required || chars > 0) {
      sectionMetrics.push({
        type: budget.sectionType,
        chars,
        budgetMin: budget.minChars,
        budgetTarget: budget.targetChars,
        budgetMax: budget.maxChars
      })
    }

    if (budget.required && matchingSections.length === 0) {
      issues.push({
        code: 'missing_required_section',
        severity: 'error',
        sectionType: budget.sectionType,
        charsNeeded: budget.targetChars,
        message: `${budget.sectionType} is required for a ${blueprint.targetPages}-page CV.`
      })
      continue
    }

    if (matchingSections.length > 0 && chars < budget.minChars && !VERBATIM_SECTION_TYPES.has(budget.sectionType)) {
      issues.push({
        code: 'section_under_minimum',
        severity: 'warning',
        sectionType: budget.sectionType,
        charsNeeded: budget.targetChars - chars,
        message: `${budget.sectionType} is under budget by ${budget.targetChars - chars} characters.`
      })
    }

    if (matchingSections.length > 0 && chars > budget.maxChars) {
      issues.push({
        code: 'section_over_maximum',
        severity: 'warning',
        sectionType: budget.sectionType,
        charsOver: chars - budget.maxChars,
        message: `${budget.sectionType} is over budget by ${chars - budget.maxChars} characters.`
      })
    }
  }

  if (totalChars < blueprint.minTotalChars) {
    issues.push({
      code: 'total_under_minimum',
      severity: 'error',
      charsNeeded: blueprint.targetTotalChars - totalChars,
      message: `CV is too short for ${blueprint.targetPages} pages by ${blueprint.targetTotalChars - totalChars} target characters.`
    })
  }

  if (totalChars > blueprint.maxTotalChars) {
    issues.push({
      code: 'total_over_maximum',
      severity: 'error',
      charsOver: totalChars - blueprint.maxTotalChars,
      message: `CV is too long for ${blueprint.targetPages} pages by ${totalChars - blueprint.maxTotalChars} characters.`
    })
  }

  return {
    isValid: !issues.some(issue => issue.severity === 'error'),
    totalChars,
    targetTotalChars: blueprint.targetTotalChars,
    minTotalChars: blueprint.minTotalChars,
    maxTotalChars: blueprint.maxTotalChars,
    sectionMetrics,
    issues,
    repairInstructions: createRepairInstructions(issues, blueprint)
  }
}

export function createLayoutRepairPrompt(sections: CVSection[], blueprint: CVPageBlueprint, validation: LayoutValidationResult): string {
  return `The generated CV does not yet satisfy the selected ${blueprint.targetPages}-page layout plan.

Layout target:
- Total characters: ${blueprint.targetTotalChars}
- Acceptable range: ${blueprint.minTotalChars}-${blueprint.maxTotalChars}
- Current total: ${validation.totalChars}

Current section metrics:
${validation.sectionMetrics.map(metric => `${metric.type}: ${metric.chars} chars (target ${metric.budgetTarget ?? 'n/a'}, acceptable ${metric.budgetMin ?? 'n/a'}-${metric.budgetMax ?? 'n/a'})`).join('\n')}

Required repairs:
${validation.repairInstructions.map(instruction => `- ${instruction}`).join('\n')}

Current CV sections:
${JSON.stringify(sections, null, 2)}

Return JSON only in this format:
{
  "sections": [
    { "type": "summary", "content": "...", "order": 1 }
  ]
}

Rules:
- Preserve real employers, dates, qualifications, and credentials from the original CV.
- Do not invent fake companies, dates, degrees, or certifications.
- Add truthful context, detail, responsibilities, tools, outcomes, and relevant achievements.
- If the CV is below the acceptable total range, the repaired output must be SIGNIFICANTLY longer than the current CV — aim to reach the target of ${blueprint.targetTotalChars} characters.
- EXPAND each job to at least 6 bullet points with 25-35 words each. ADD new bullets with relevant responsibilities, tools, and outcomes.
- EXPAND the summary to 5-8 sentences. EXPAND skills to 10-15 items with context.
- For 3/4-page CVs, generate permitted optional sections when existing content alone cannot fill the selected page count.
- Use transferable achievements, treatment/service outcomes, client-care strengths, relevant projects, tools, and professional context inferred from the CV and target role.
- If adding optional sections, only use sections permitted by the layout plan.
- Keep total content within the selected page budget.`
}

function createRepairInstructions(issues: LayoutIssue[], blueprint: CVPageBlueprint): string[] {
  const instructions: string[] = []

  for (const issue of issues) {
    if (issue.code === 'missing_required_section' && issue.sectionType) {
      const budget = getBudgetForSection(blueprint, issue.sectionType)
      instructions.push(`Add a ${issue.sectionType} section of around ${budget?.targetChars ?? issue.charsNeeded ?? 500} characters.`)
    }

    if (issue.code === 'section_under_minimum' && issue.sectionType && !VERBATIM_SECTION_TYPES.has(issue.sectionType)) {
      instructions.push(`Expand ${issue.sectionType} by about ${Math.max(issue.charsNeeded ?? 250, 150)} characters using relevant, factual detail.`)
    }

    if (issue.code === 'section_over_maximum' && issue.sectionType) {
      instructions.push(`Condense ${issue.sectionType} by about ${Math.max(issue.charsOver ?? 250, 150)} characters while preserving strongest evidence.`)
    }

    if (issue.code === 'total_under_minimum') {
      const generatedOptions = blueprint.sectionBudgets.filter(budget => budget.allowGenerated).map(budget => budget.sectionType)
      if (generatedOptions.length > 0) {
        instructions.push(`Add or expand optional sections where relevant: ${generatedOptions.join(', ')}.`)
      }
      instructions.push(`Increase overall content by about ${Math.max(issue.charsNeeded ?? 500, 300)} characters.`)
    }

    if (issue.code === 'total_over_maximum') {
      instructions.push(`Reduce overall content by about ${Math.max(issue.charsOver ?? 500, 300)} characters.`)
    }
  }

  return Array.from(new Set(instructions))
}
