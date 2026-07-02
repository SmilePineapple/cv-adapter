import { CVSection } from '@/types/database'
import { getSectionText, normalizeSectionType } from './cv-layout-validator'

export interface CVContentCapacity {
  // Source content metrics
  sourceChars: number
  experienceYears: number
  jobCount: number
  educationCount: number
  skillCount: number
  certificationCount: number
  hasProjects: boolean
  hasAchievements: boolean
  
  // Expansion potential
  maxTruthfulChars: number
  recommendedPageCount: number
  canSupport1Page: boolean
  canSupport2Page: boolean
  canSupport3Page: boolean
  canSupport4Page: boolean
  
  // Density profile
  bulletPointRatio: number
  avgBulletLength: number
  avgParagraphLength: number
  structuralOverhead: number
  
  // Content quality indicators
  hasQuantifiableAchievements: boolean
  detailLevel: 'sparse' | 'moderate' | 'detailed'
}

export interface PageCountRecommendation {
  recommended: number
  canSupport: number[]
  warnings: Record<number, string>
  confidence: 'high' | 'medium' | 'low'
}

const EXPANSION_FACTORS = {
  perJob: 1000,              // Each job can expand to ~1000 chars with detailed bullets
  summary: 1000,             // Summary can expand to ~1000 chars
  skills: 1200,              // Skills with context can reach ~1200 chars
  perEducation: 600,         // Each education entry can expand to ~600 chars
  perCertification: 400,     // Each cert can expand to ~400 chars
  projects: 1500,            // Projects section if relevant
  achievements: 1600         // Achievements section if relevant
}

const PAGE_THRESHOLDS = {
  min1Page: 3900,
  ideal1Page: 4800,
  max1Page: 5600,
  min2Page: 8000,
  ideal2Page: 10000,
  max2Page: 13000,
  min3Page: 16000,
  ideal3Page: 19000,
  max3Page: 23000,
  min4Page: 22000,
  ideal4Page: 26000,
  max4Page: 32000
}

export function analyzeContentCapacity(sections: CVSection[]): CVContentCapacity {
  const sourceChars = calculateTotalChars(sections)
  const jobCount = countJobs(sections)
  const educationCount = countEducation(sections)
  const certificationCount = countCertifications(sections)
  const skillCount = countSkills(sections)
  const experienceYears = estimateExperienceYears(sections)
  
  const hasProjects = sections.some(s => normalizeSectionType(s.type) === 'projects')
  const hasAchievements = sections.some(s => normalizeSectionType(s.type) === 'achievements')
  
  // Calculate maximum truthful expansion potential
  const maxJobExpansion = jobCount * EXPANSION_FACTORS.perJob
  const maxSummaryExpansion = EXPANSION_FACTORS.summary
  const maxSkillsExpansion = EXPANSION_FACTORS.skills
  const maxEducationExpansion = educationCount * EXPANSION_FACTORS.perEducation
  const maxCertExpansion = certificationCount * EXPANSION_FACTORS.perCertification
  
  // Optional sections (only if they can be truthfully inferred)
  const potentialProjectsExpansion = (jobCount >= 2 || experienceYears >= 3) ? EXPANSION_FACTORS.projects : 0
  const potentialAchievementsExpansion = (jobCount >= 2 || experienceYears >= 3) ? EXPANSION_FACTORS.achievements : 0
  
  const maxTruthfulChars = sourceChars + 
    maxJobExpansion + 
    maxSummaryExpansion + 
    maxSkillsExpansion + 
    maxEducationExpansion + 
    maxCertExpansion +
    potentialProjectsExpansion +
    potentialAchievementsExpansion
  
  // Determine recommended page count
  let recommendedPageCount = 1
  if (maxTruthfulChars >= PAGE_THRESHOLDS.min2Page) recommendedPageCount = 2
  if (maxTruthfulChars >= PAGE_THRESHOLDS.min3Page) recommendedPageCount = 3
  if (maxTruthfulChars >= PAGE_THRESHOLDS.min4Page) recommendedPageCount = 4
  
  // Analyze content density
  const bulletPointRatio = calculateBulletRatio(sections)
  const avgBulletLength = calculateAvgBulletLength(sections)
  const avgParagraphLength = calculateAvgParagraphLength(sections)
  const structuralOverhead = estimateStructuralOverhead(sections)
  
  // Quality indicators
  const hasQuantifiableAchievements = detectQuantifiableAchievements(sections)
  const detailLevel = determineDetailLevel(sections, sourceChars, jobCount)
  
  return {
    sourceChars,
    experienceYears,
    jobCount,
    educationCount,
    skillCount,
    certificationCount,
    hasProjects,
    hasAchievements,
    maxTruthfulChars,
    recommendedPageCount,
    canSupport1Page: maxTruthfulChars >= PAGE_THRESHOLDS.min1Page,
    canSupport2Page: maxTruthfulChars >= PAGE_THRESHOLDS.min2Page,
    canSupport3Page: maxTruthfulChars >= PAGE_THRESHOLDS.min3Page,
    canSupport4Page: maxTruthfulChars >= PAGE_THRESHOLDS.min4Page,
    bulletPointRatio,
    avgBulletLength,
    avgParagraphLength,
    structuralOverhead,
    hasQuantifiableAchievements,
    detailLevel
  }
}

export function getPageCountRecommendation(
  capacity: CVContentCapacity,
  requestedPageCount: number
): PageCountRecommendation {
  const canSupport: number[] = []
  if (capacity.canSupport1Page) canSupport.push(1)
  if (capacity.canSupport2Page) canSupport.push(2)
  if (capacity.canSupport3Page) canSupport.push(3)
  if (capacity.canSupport4Page) canSupport.push(4)
  
  const warnings: Record<number, string> = {}
  
  // Generate warnings for unrealistic page counts
  if (requestedPageCount === 2 && !capacity.canSupport2Page) {
    warnings[2] = `Your CV content (${capacity.sourceChars} chars, ${capacity.jobCount} jobs) is better suited for 1 page. A 2-page CV may have visible white space.`
  }
  
  if (requestedPageCount === 3 && !capacity.canSupport3Page) {
    warnings[3] = `Your CV content is better suited for ${capacity.recommendedPageCount} page(s). A 3-page CV may have significant white space.`
  }
  
  if (requestedPageCount === 4 && !capacity.canSupport4Page) {
    warnings[4] = `Your CV content is better suited for ${capacity.recommendedPageCount} page(s). A 4-page CV may have extensive white space.`
  }
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'high'
  if (capacity.detailLevel === 'sparse') confidence = 'medium'
  if (capacity.jobCount < 2) confidence = 'low'
  
  return {
    recommended: capacity.recommendedPageCount,
    canSupport,
    warnings,
    confidence
  }
}

function calculateTotalChars(sections: CVSection[]): number {
  return sections.reduce((sum, section) => {
    if (section.type === 'name' || section.type === 'contact') return sum
    return sum + getSectionText(section.content).length
  }, 0)
}

function countJobs(sections: CVSection[]): number {
  const experienceSection = sections.find(s => 
    normalizeSectionType(s.type) === 'experience'
  )
  
  if (!experienceSection) return 0
  
  const content = experienceSection.content
  
  // If content is an array, count array items
  if (Array.isArray(content)) {
    return content.length
  }
  
  // If content is a string, count job entries by looking for common patterns
  if (typeof content === 'string') {
    // Count lines that look like job titles (usually followed by company/dates)
    const lines = content.split('\n').filter(line => line.trim())
    // Heuristic: jobs typically have 3-10 lines each (title, company, bullets)
    return Math.max(1, Math.floor(lines.length / 5))
  }
  
  return 1
}

function countEducation(sections: CVSection[]): number {
  const educationSection = sections.find(s => 
    normalizeSectionType(s.type) === 'education'
  )
  
  if (!educationSection) return 0
  
  const content = educationSection.content
  if (Array.isArray(content)) return content.length
  
  // Heuristic: count degree-like keywords
  const text = getSectionText(content)
  const degreeKeywords = /\b(bachelor|master|phd|degree|diploma|certificate)\b/gi
  const matches = text.match(degreeKeywords)
  return matches ? Math.min(matches.length, 4) : 1
}

function countCertifications(sections: CVSection[]): number {
  const certSection = sections.find(s => 
    normalizeSectionType(s.type) === 'certifications'
  )
  
  if (!certSection) return 0
  
  const content = certSection.content
  if (Array.isArray(content)) return content.length
  
  // Count lines or bullet points
  const text = getSectionText(content)
  const lines = text.split('\n').filter(line => line.trim())
  return Math.max(1, lines.length)
}

function countSkills(sections: CVSection[]): number {
  const skillsSection = sections.find(s => 
    normalizeSectionType(s.type) === 'skills'
  )
  
  if (!skillsSection) return 0
  
  const text = getSectionText(skillsSection.content)
  
  // Count comma-separated items or bullet points
  const commaCount = (text.match(/,/g) || []).length
  const bulletCount = (text.match(/[•\-\*]/g) || []).length
  
  return Math.max(commaCount + 1, bulletCount, 1)
}

function estimateExperienceYears(sections: CVSection[]): number {
  const experienceSection = sections.find(s => 
    normalizeSectionType(s.type) === 'experience'
  )
  
  if (!experienceSection) return 0
  
  const text = getSectionText(experienceSection.content)
  
  // Look for year patterns (2020-2023, 2020-Present, etc.)
  const yearPattern = /\b(19|20)\d{2}\b/g
  const years = text.match(yearPattern)
  
  if (!years || years.length < 2) {
    // Fallback: estimate based on job count
    const jobCount = countJobs(sections)
    return jobCount * 2 // Assume 2 years per job
  }
  
  // Calculate range from earliest to latest year
  const yearNumbers = years.map(y => parseInt(y))
  const minYear = Math.min(...yearNumbers)
  const maxYear = Math.max(...yearNumbers)
  
  return maxYear - minYear
}

function calculateBulletRatio(sections: CVSection[]): number {
  let totalLines = 0
  let bulletLines = 0
  
  sections.forEach(section => {
    if (section.type === 'name' || section.type === 'contact') return
    
    const text = getSectionText(section.content)
    const lines = text.split('\n').filter(line => line.trim())
    
    totalLines += lines.length
    
    lines.forEach(line => {
      if (/^[\s]*[•\-\*\+]/.test(line)) {
        bulletLines++
      }
    })
  })
  
  return totalLines > 0 ? bulletLines / totalLines : 0
}

function calculateAvgBulletLength(sections: CVSection[]): number {
  const bullets: string[] = []
  
  sections.forEach(section => {
    if (section.type === 'name' || section.type === 'contact') return
    
    const text = getSectionText(section.content)
    const lines = text.split('\n')
    
    lines.forEach(line => {
      if (/^[\s]*[•\-\*\+]/.test(line)) {
        const cleanLine = line.replace(/^[\s]*[•\-\*\+][\s]*/, '').trim()
        if (cleanLine) bullets.push(cleanLine)
      }
    })
  })
  
  if (bullets.length === 0) return 0
  
  const totalChars = bullets.reduce((sum, bullet) => sum + bullet.length, 0)
  return Math.round(totalChars / bullets.length)
}

function calculateAvgParagraphLength(sections: CVSection[]): number {
  const paragraphs: string[] = []
  
  sections.forEach(section => {
    if (section.type === 'name' || section.type === 'contact') return
    
    const text = getSectionText(section.content)
    const lines = text.split('\n')
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !/^[\s]*[•\-\*\+]/.test(line) && trimmed.length > 50) {
        paragraphs.push(trimmed)
      }
    })
  })
  
  if (paragraphs.length === 0) return 0
  
  const totalChars = paragraphs.reduce((sum, para) => sum + para.length, 0)
  return Math.round(totalChars / paragraphs.length)
}

function estimateStructuralOverhead(sections: CVSection[]): number {
  // Each section heading takes ~15mm vertical space
  const headingOverhead = 15
  
  // Count sections (excluding name/contact)
  const sectionCount = sections.filter(s => 
    s.type !== 'name' && s.type !== 'contact'
  ).length
  
  return sectionCount * headingOverhead
}

function detectQuantifiableAchievements(sections: CVSection[]): boolean {
  const text = sections.map(s => getSectionText(s.content)).join(' ')
  
  // Look for numbers/percentages that indicate quantifiable achievements
  const quantifierPattern = /\b(\d+%|\d+x|\$\d+|£\d+|\d+\s*(users|customers|clients|projects|team|people|increase|decrease|improvement|growth))/gi
  
  const matches = text.match(quantifierPattern)
  return matches ? matches.length >= 2 : false
}

function determineDetailLevel(
  sections: CVSection[], 
  sourceChars: number, 
  jobCount: number
): 'sparse' | 'moderate' | 'detailed' {
  if (jobCount === 0) return 'sparse'
  
  const charsPerJob = sourceChars / jobCount
  
  if (charsPerJob < 300) return 'sparse'
  if (charsPerJob < 600) return 'moderate'
  return 'detailed'
}
