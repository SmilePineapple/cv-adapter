import { CVContentCapacity } from './cv-capacity-analyzer'
import { CVPageBlueprint, getCVPageBlueprint, SupportedPageCount } from './cv-page-blueprints'

export interface GenerationStrategy {
  targetChars: number
  minChars: number
  maxChars: number
  densityMultiplier: number
  contentHints: string
  allowOptionalSections: boolean
  optionalSections?: string[]
  compressionPriority: boolean
  pageTargets?: number[]
  warning?: string
  autoDowngrade?: boolean
  suggestedPageCount?: number
}

export function getGenerationStrategy(
  capacity: CVContentCapacity,
  requestedPageCount: number
): GenerationStrategy {
  const pageCount = Math.min(4, Math.max(1, requestedPageCount)) as SupportedPageCount
  
  switch (pageCount) {
    case 1:
      return get1PageStrategy(capacity)
    case 2:
      return get2PageStrategy(capacity)
    case 3:
      return get3PageStrategy(capacity)
    case 4:
      return get4PageStrategy(capacity)
    default:
      return get1PageStrategy(capacity)
  }
}

function get1PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  const blueprint = getCVPageBlueprint(1)
  
  // If source content is too large, prioritize compression
  const compressionPriority = capacity.sourceChars > 5500
  
  // Adjust density based on bullet ratio
  // Bullet-heavy CVs need slightly more chars to fill the same visual space
  const densityMultiplier = capacity.bulletPointRatio > 0.7 ? 1.15 : 1.0
  
  return {
    targetChars: blueprint.targetTotalChars,
    minChars: blueprint.minTotalChars,
    maxChars: blueprint.maxTotalChars,
    densityMultiplier,
    contentHints: compressionPriority
      ? 'Use concise bullets (15-20 words each). Prioritize strongest achievements. Remove repetition.'
      : 'Use focused bullets (20-25 words each). Include key responsibilities and measurable outcomes.',
    allowOptionalSections: false,
    compressionPriority,
    pageTargets: [blueprint.targetTotalChars]
  }
}

function get2PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  const blueprint = getCVPageBlueprint(2)
  
  // Check if CV can support 2 pages
  if (!capacity.canSupport2Page) {
    return {
      targetChars: blueprint.targetTotalChars,
      minChars: blueprint.minTotalChars,
      maxChars: blueprint.maxTotalChars,
      densityMultiplier: 1.0,
      contentHints: '',
      allowOptionalSections: false,
      compressionPriority: false,
      warning: `Your CV content (${capacity.jobCount} job${capacity.jobCount !== 1 ? 's' : ''}, ${Math.round(capacity.sourceChars)} chars) is better suited for 1 page. A 2-page CV may have visible white space.`,
      autoDowngrade: true,
      suggestedPageCount: 1
    }
  }
  
  // Adjust density multiplier based on content structure
  let densityMultiplier = 1.0
  
  if (capacity.bulletPointRatio > 0.7) {
    // Bullet-heavy content needs more chars
    densityMultiplier = 1.2
  } else if (capacity.bulletPointRatio < 0.3) {
    // Paragraph-heavy content is denser
    densityMultiplier = 0.95
  }
  
  // If CV has many sections (high structural overhead), increase target
  if (capacity.structuralOverhead > 100) {
    densityMultiplier *= 1.1
  }
  
  const contentHints = capacity.bulletPointRatio > 0.7
    ? 'Use detailed bullets (30-40 words each). Expand each job with 5-7 comprehensive bullet points covering responsibilities, tools, and quantified outcomes.'
    : 'Use paragraph format for experience descriptions. Add context, methodologies, and measurable impact. Keep bullets for key achievements only.'
  
  return {
    targetChars: Math.round(blueprint.targetTotalChars * densityMultiplier),
    minChars: Math.round(blueprint.minTotalChars * densityMultiplier),
    maxChars: Math.round(blueprint.maxTotalChars * densityMultiplier),
    densityMultiplier,
    contentHints,
    allowOptionalSections: true,
    optionalSections: ['achievements', 'projects'],
    compressionPriority: false,
    pageTargets: [7500, 8500] // Page 1 (two-column), Page 2 (two-column)
  }
}

function get3PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  const blueprint = getCVPageBlueprint(3)
  
  // Check if CV can support 3 pages
  if (!capacity.canSupport3Page) {
    return {
      targetChars: blueprint.targetTotalChars,
      minChars: blueprint.minTotalChars,
      maxChars: blueprint.maxTotalChars,
      densityMultiplier: 1.0,
      contentHints: '',
      allowOptionalSections: false,
      compressionPriority: false,
      warning: `Your CV content is better suited for ${capacity.recommendedPageCount} page(s). A 3-page CV may have significant white space.`,
      autoDowngrade: true,
      suggestedPageCount: capacity.recommendedPageCount
    }
  }
  
  // Adjust density multiplier
  let densityMultiplier = 1.0
  
  if (capacity.bulletPointRatio > 0.7) {
    densityMultiplier = 1.25
  } else if (capacity.bulletPointRatio < 0.3) {
    densityMultiplier = 1.05
  }
  
  if (capacity.structuralOverhead > 120) {
    densityMultiplier *= 1.12
  }
  
  const contentHints = `Expand experience with detailed context and outcomes. Add achievements section with quantified results (e.g., "Increased efficiency by 40%", "Led team of 5"). Include relevant projects${capacity.hasProjects ? '' : ' that can be inferred from job experience'}.`
  
  return {
    targetChars: Math.round(blueprint.targetTotalChars * densityMultiplier),
    minChars: Math.round(blueprint.minTotalChars * densityMultiplier),
    maxChars: Math.round(blueprint.maxTotalChars * densityMultiplier),
    densityMultiplier,
    contentHints,
    allowOptionalSections: true,
    optionalSections: ['achievements', 'projects'],
    compressionPriority: false,
    pageTargets: [5400, 6200, 8200] // Pages 1-2 (single-column), Page 3 (two-column)
  }
}

function get4PageStrategy(capacity: CVContentCapacity): GenerationStrategy {
  const blueprint = getCVPageBlueprint(4)
  
  // Check if CV can support 4 pages
  if (!capacity.canSupport4Page) {
    return {
      targetChars: blueprint.targetTotalChars,
      minChars: blueprint.minTotalChars,
      maxChars: blueprint.maxTotalChars,
      densityMultiplier: 1.0,
      contentHints: '',
      allowOptionalSections: false,
      compressionPriority: false,
      warning: `Your CV content is better suited for ${capacity.recommendedPageCount} page(s). A 4-page CV may have extensive white space.`,
      autoDowngrade: true,
      suggestedPageCount: capacity.recommendedPageCount
    }
  }
  
  // Adjust density multiplier
  let densityMultiplier = 1.0
  
  if (capacity.bulletPointRatio > 0.7) {
    densityMultiplier = 1.3
  } else if (capacity.bulletPointRatio < 0.3) {
    densityMultiplier = 1.1
  }
  
  if (capacity.structuralOverhead > 140) {
    densityMultiplier *= 1.15
  }
  
  const contentHints = `Comprehensive detail for senior roles. Each job should have 7-10 detailed bullets covering responsibilities, technical stack, team leadership, and quantified business impact. Add achievements section with major career highlights. Include projects section with technical details and outcomes. Add additional information section if relevant (publications, speaking engagements, awards).`
  
  return {
    targetChars: Math.round(blueprint.targetTotalChars * densityMultiplier),
    minChars: Math.round(blueprint.minTotalChars * densityMultiplier),
    maxChars: Math.round(blueprint.maxTotalChars * densityMultiplier),
    densityMultiplier,
    contentHints,
    allowOptionalSections: true,
    optionalSections: ['achievements', 'projects', 'additional_information'],
    compressionPriority: false,
    pageTargets: [5600, 8200, 8200, 8200] // Page 1 (single), Pages 2-4 (two-column)
  }
}

export function formatStrategyForPrompt(strategy: GenerationStrategy): string {
  return `
Content generation strategy:
- Target total: ${strategy.targetChars} characters
- Acceptable range: ${strategy.minChars}-${strategy.maxChars} characters
- Density adjustment: ${(strategy.densityMultiplier * 100).toFixed(0)}% (${strategy.densityMultiplier > 1 ? 'more content needed for visual fill' : 'standard density'})

${strategy.contentHints}

${strategy.allowOptionalSections 
  ? `Optional sections allowed: ${strategy.optionalSections?.join(', ') || 'none'}. Add these only if they can be truthfully inferred from existing CV content and job context.`
  : 'Do not add optional sections. Focus on core sections only.'
}

${strategy.compressionPriority 
  ? 'PRIORITY: Condense content to fit within page limit. Remove repetition and keep only strongest evidence.'
  : 'PRIORITY: Expand content with factual detail to fill pages properly. Add context, tools, methodologies, and quantified outcomes.'
}

${strategy.pageTargets 
  ? `Page-specific targets:\n${strategy.pageTargets.map((target, i) => `  Page ${i + 1}: ~${target} chars`).join('\n')}`
  : ''
}
`.trim()
}
