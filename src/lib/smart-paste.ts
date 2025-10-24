/**
 * Smart Paste Detection for Job Descriptions
 * Automatically extracts job title and cleans up pasted content
 */

export interface SmartPasteResult {
  detectedTitle: string | null
  cleanedDescription: string
  confidence: 'high' | 'medium' | 'low'
  suggestions: string[]
}

/**
 * Analyzes pasted text and extracts job information
 */
export function analyzeJobPaste(text: string): SmartPasteResult {
  const lines = text.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    return {
      detectedTitle: null,
      cleanedDescription: text,
      confidence: 'low',
      suggestions: []
    }
  }

  // Try to detect job title from first few lines
  const detectedTitle = detectJobTitle(lines)
  
  // Clean up the description
  const cleanedDescription = cleanJobDescription(text, detectedTitle)
  
  // Generate suggestions
  const suggestions = generateSuggestions(text, detectedTitle)
  
  // Determine confidence
  const confidence = determineConfidence(detectedTitle, text)

  return {
    detectedTitle,
    cleanedDescription,
    confidence,
    suggestions
  }
}

/**
 * Attempts to detect job title from the first few lines
 */
function detectJobTitle(lines: string[]): string | null {
  // Common job title patterns
  const titlePatterns = [
    /^(Senior|Junior|Lead|Principal|Staff|Associate|Assistant)?\s*(Software|Full[- ]?Stack|Front[- ]?End|Back[- ]?End|Web|Mobile|DevOps|Data|Machine Learning|AI|Cloud)\s*(Engineer|Developer|Architect|Analyst|Scientist|Manager)/i,
    /^(Marketing|Sales|Product|Project|Program|Operations|HR|Finance|Customer Success)\s*(Manager|Director|Coordinator|Specialist|Executive|Lead|Associate)/i,
    /^(Chief|Head of|VP of|Director of)\s*\w+/i,
    /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,4}$/,  // Title case words (2-5 words)
  ]

  // Check first 3 lines
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim()
    
    // Skip if line is too long (likely not a title)
    if (line.length > 80) continue
    
    // Skip if line has too many lowercase words (likely description)
    if (line.split(' ').filter(w => w === w.toLowerCase()).length > 3) continue
    
    // Check against patterns
    for (const pattern of titlePatterns) {
      if (pattern.test(line)) {
        return line
      }
    }
    
    // If first line is short and title-case, likely a title
    if (i === 0 && line.length < 60 && /^[A-Z]/.test(line)) {
      return line
    }
  }

  return null
}

/**
 * Cleans up job description text
 */
function cleanJobDescription(text: string, detectedTitle: string | null): string {
  let cleaned = text

  // Remove detected title from description if found
  if (detectedTitle) {
    cleaned = cleaned.replace(detectedTitle, '').trim()
  }

  // Remove common header patterns
  cleaned = cleaned.replace(/^(Job Title|Position|Role|Company):\s*/gim, '')
  cleaned = cleaned.replace(/^(Location|Salary|Posted|Date):\s*[^\n]+\n/gim, '')
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * Generates helpful suggestions based on pasted content
 */
function generateSuggestions(text: string, detectedTitle: string | null): string[] {
  const suggestions: string[] = []

  if (detectedTitle) {
    suggestions.push(`Use "${detectedTitle}" as job title`)
  }

  // Check for common sections
  if (/responsibilities|duties|role/i.test(text)) {
    suggestions.push('Responsibilities section detected')
  }

  if (/requirements|qualifications|skills/i.test(text)) {
    suggestions.push('Requirements section detected')
  }

  if (/benefits|perks|compensation/i.test(text)) {
    suggestions.push('Benefits section detected')
  }

  // Check for salary information
  if (/\$\d+|£\d+|€\d+|\d+k/i.test(text)) {
    suggestions.push('Salary information detected')
  }

  // Check for remote/hybrid
  if (/remote|hybrid|work from home/i.test(text)) {
    suggestions.push('Remote work mentioned')
  }

  return suggestions
}

/**
 * Determines confidence level of detection
 */
function determineConfidence(detectedTitle: string | null, text: string): 'high' | 'medium' | 'low' {
  if (!detectedTitle) return 'low'

  let score = 0

  // Title detected
  score += 3

  // Has common job posting sections
  if (/responsibilities|requirements|qualifications/i.test(text)) {
    score += 2
  }

  // Has bullet points
  if (/[•\-\*]\s/g.test(text)) {
    score += 1
  }

  // Reasonable length
  if (text.length > 200 && text.length < 5000) {
    score += 1
  }

  if (score >= 5) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

/**
 * Extracts keywords from job description for ATS optimization
 */
export function extractKeywords(text: string): string[] {
  const keywords: string[] = []
  
  // Common technical skills
  const techSkills = /\b(JavaScript|TypeScript|Python|Java|React|Node\.js|AWS|Docker|Kubernetes|SQL|MongoDB|Git|Agile|Scrum|CI\/CD|REST|API|GraphQL|TDD|OOP)\b/gi
  const matches = text.match(techSkills)
  
  if (matches) {
    keywords.push(...new Set(matches.map(m => m.toLowerCase())))
  }

  return keywords
}
