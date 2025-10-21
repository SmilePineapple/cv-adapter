import { CVSection } from '@/types/database'

/**
 * Calculate ATS (Applicant Tracking System) score for a CV
 * Score is based on keyword matching, section completeness, content quality, and formatting
 */
export function calculateATSScore(sections: CVSection[], jobDescription: string): number {
  let score = 0
  
  // Extract keywords from job description (simple approach)
  const jobKeywords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'have', 'will', 'your', 'their'].includes(word))
  
  const uniqueKeywords = [...new Set(jobKeywords)]
  
  // Combine all section content
  const cvContent = sections
    .map(s => {
      if (typeof s.content === 'string') {
        return s.content
      } else if (Array.isArray(s.content)) {
        return JSON.stringify(s.content)
      } else if (typeof s.content === 'object') {
        return JSON.stringify(s.content)
      }
      return ''
    })
    .join(' ')
    .toLowerCase()
  
  // 1. Keyword Matching (40 points)
  const matchedKeywords = uniqueKeywords.filter(keyword => 
    cvContent.includes(keyword)
  ).length
  
  const keywordScore = uniqueKeywords.length > 0 
    ? (matchedKeywords / uniqueKeywords.length) * 40 
    : 20
  score += keywordScore
  
  // 2. Section Completeness (20 points)
  const hasExperience = sections.some(s => s.type === 'experience' && s.content)
  const hasSkills = sections.some(s => s.type === 'skills' && s.content)
  const hasSummary = sections.some(s => s.type === 'summary' && s.content)
  
  if (hasExperience) score += 8
  if (hasSkills) score += 6
  if (hasSummary) score += 6
  
  // 3. Content Length (15 points)
  const totalLength = cvContent.length
  if (totalLength > 1000 && totalLength < 5000) {
    score += 15
  } else if (totalLength > 500) {
    score += 10
  } else {
    score += 5
  }
  
  // 4. Action Verbs (15 points)
  const actionVerbs = [
    'achieved', 'managed', 'led', 'developed', 'created', 'improved',
    'increased', 'decreased', 'delivered', 'implemented', 'designed',
    'coordinated', 'executed', 'optimized', 'streamlined', 'launched'
  ]
  
  const actionVerbCount = actionVerbs.filter(verb => 
    cvContent.includes(verb)
  ).length
  
  score += Math.min(actionVerbCount * 2, 15)
  
  // 5. Formatting Quality (10 points)
  const hasBulletPoints = sections.some(s => {
    const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content)
    return content.includes('•') || content.includes('-')
  })
  if (hasBulletPoints) score += 10
  
  return Math.min(Math.round(score), 100)
}
