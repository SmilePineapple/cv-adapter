import { getOpenAIClient } from '@/lib/openai-client'
import { CVSection } from '@/types/database'
import { getCVPageBlueprint } from './cv-page-blueprints'

/**
 * AI-powered content fill pass.
 * After initial generation, checks for remaining page space and asks AI
 * to generate additional relevant sections or expand existing ones.
 */

interface FillResult {
  sections: CVSection[]
  addedSections: string[]
}

/**
 * Estimate how many lines of content are missing to fill the CV.
 * Uses the blueprint target chars for the given page count.
 * For 1-page: checks left column fill (two-column layout).
 * For multi-page: checks total content vs blueprint target.
 */
function estimateMissingLines(sections: CVSection[], targetPageCount: number = 1): number {
  // Exclude name and contact - they're in the header, not the columns
  const contentSections = sections.filter(s => s.type !== 'name' && s.type !== 'contact')
  
  // Helper to extract rendered text length from content (not JSON length)
  const getTextLength = (content: CVSection['content']): number => {
    const c = content as unknown
    if (typeof c === 'string') return c.length
    if (Array.isArray(c)) {
      return c.map((item: unknown) => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null) {
          return Object.values(item).filter((v: unknown) => typeof v === 'string').join(' ')
        }
        return String(item)
      }).join(' ').length
    }
    if (typeof c === 'object' && c !== null) {
      return Object.values(c).filter((v: unknown) => typeof v === 'string').join(' ').length
    }
    return String(c || '').length
  }

  const blueprint = getCVPageBlueprint(targetPageCount)
  const totalChars = contentSections.reduce((sum, s) => sum + getTextLength(s.content), 0)
  const targetTotal = blueprint.targetTotalChars
  const missing = targetTotal - totalChars
  
  console.log(`🤖 estimateMissingLines: totalChars=${totalChars}, targetTotal=${targetTotal}, missing=${missing}, pages=${targetPageCount}`)
  
  if (missing <= 0) return 0
  
  // Rough: ~50 chars per line at our font size
  return Math.ceil(missing / 50)
}

/**
 * Check which sections from the original CV are NOT in the generated sections.
 * Also handles semantic duplicates (e.g. interests = hobbies).
 */
function findMissingOriginalSections(generated: CVSection[], original: CVSection[]): CVSection[] {
  const generatedTypes = new Set<string>(generated.map(s => s.type))
  // Semantic equivalents: if one exists, don't add the other
  const semanticMap: Record<string, string[]> = {
    hobbies: ['interests', 'hobbies'],
    interests: ['interests', 'hobbies'],
    skills: ['skills', 'competencies'],
    certifications: ['certifications', 'licenses', 'certificates'],
  }
  const hasSemanticMatch = (type: string): boolean => {
    if (generatedTypes.has(type)) return true
    const equivalents = semanticMap[type]
    if (equivalents) return equivalents.some(t => generatedTypes.has(t))
    return false
  }
  return original.filter(s => !hasSemanticMatch(s.type) && s.type !== 'name' && s.type !== 'contact')
}

/**
 * Ask AI to generate additional content to fill remaining page space.
 * Uses the job description and original CV to generate relevant new sections.
 */
export async function aiFillContent(
  generatedSections: CVSection[],
  originalSections: CVSection[],
  jobTitle: string,
  jobDescription?: string,
  targetPageCount: number = 1
): Promise<FillResult> {
  const missingLines = estimateMissingLines(generatedSections, targetPageCount)

  console.log(`🤖 AI fill estimate: missingLines=${missingLines}`)
  if (missingLines < 3) {
    return { sections: generatedSections, addedSections: [] }
  }

  const missingOriginal = findMissingOriginalSections(generatedSections, originalSections)

  // Build context from original CV sections that aren't in the generated CV
  const originalContext = missingOriginal.map(s => {
    const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content)
    return `${s.type}: ${content}`
  }).join('\n')

  const generatedContext = generatedSections.map(s => {
    const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content)
    return `${s.type}: ${content.substring(0, 200)}`
  }).join('\n')

  const prompt = `You are an expert CV writer. A ${targetPageCount}-page CV has been generated but has approximately ${missingLines} lines of empty space that need to be filled across ${targetPageCount} page(s).

CURRENT CV SECTIONS:
${generatedContext}

${originalContext ? `ORIGINAL CV SECTIONS NOT YET INCLUDED:\n${originalContext}\n` : ''}
TARGET JOB TITLE: ${jobTitle}
${jobDescription ? `TARGET JOB DESCRIPTION: ${jobDescription.substring(0, 500)}\n` : ''}

TASK:
Generate additional content to fill the empty space across ${targetPageCount} page(s). You should:
1. First, include any missing sections from the original CV that are relevant (e.g. certifications, projects, volunteer work, languages, achievements)
2. If no missing sections remain, generate NEW relevant sections that would strengthen this CV for the target job, such as:
   - "Key Achievements" - notable accomplishments relevant to the target role
   - "Professional Development" - relevant training, workshops, or CPD
   - "Areas of Expertise" - specific competencies aligned with the job
   - "Languages" - if applicable
   - "Volunteer Work" - if applicable
3. Ensure all content is truthful and based on the candidate's background
4. Each new section should have enough content to fill approximately ${missingLines} lines total
5. Limit to at most ${Math.max(1, Math.min(8, Math.floor(missingLines / (targetPageCount > 1 ? 20 : 15))))} sections to avoid overflowing the pages
6. Do NOT include sections that already exist in the CV (e.g. if "interests" exists, do not add "hobbies")

Provide your response in this exact JSON format:
{
  "sections": [
    {
      "type": "section_type_here",
      "content": "Section content here...",
      "order": 10
    }
  ]
}

Only include sections that add genuine value. Do not duplicate existing sections.`

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV writer who creates compelling, ATS-optimized CVs. Always provide responses in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: targetPageCount > 1 ? 2500 : 1500,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return { sections: generatedSections, addedSections: [] }
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { sections: generatedSections, addedSections: [] }
    }

    const parsed = JSON.parse(jsonMatch[0])
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return { sections: generatedSections, addedSections: [] }
    }

    // Convert to CVSection format and filter out duplicates
    // Also cap the number of sections based on missingLines to prevent overflow
    // Each section takes ~15-20 lines (title + content + spacing), so use conservative estimate
    // For multi-page, cap harder since sections spread across pages with column layout overhead
    const linesPerSection = targetPageCount > 1 ? 20 : 15
    const maxSections = Math.max(1, Math.min(8, Math.floor(missingLines / linesPerSection)))
    const existingTypes = new Set<string>(generatedSections.map(s => s.type))
    // Semantic equivalents to prevent duplicate hobbies/interests etc.
    const semanticEquivalents: Record<string, string[]> = {
      hobbies: ['interests', 'hobbies'],
      interests: ['interests', 'hobbies'],
      skills: ['skills', 'competencies'],
      certifications: ['certifications', 'licenses', 'certificates'],
    }
    const hasSemanticDup = (type: string): boolean => {
      if (existingTypes.has(type)) return true
      const equivs = semanticEquivalents[type]
      if (equivs) return equivs.some(t => existingTypes.has(t))
      return false
    }
    const newSections: CVSection[] = []
    const addedSections: string[] = []

    for (const s of parsed.sections) {
      if (!s.type || !s.content) continue
      if (hasSemanticDup(s.type)) continue
      if (newSections.length >= maxSections) break

      newSections.push({
        type: s.type,
        content: s.content,
        order: s.order || (generatedSections.length + newSections.length + 1)
      })
      addedSections.push(s.type)
    }

    if (newSections.length === 0) {
      return { sections: generatedSections, addedSections: [] }
    }

    console.log(`✅ AI fill pass added ${newSections.length} sections: ${addedSections.join(', ')}`)

    return {
      sections: [...generatedSections, ...newSections],
      addedSections
    }
  } catch (error) {
    console.error('AI fill pass failed:', error)
    return { sections: generatedSections, addedSections: [] }
  }
}
