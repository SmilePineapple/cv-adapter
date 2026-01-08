/**
 * ATS Optimizer - AI-powered CV optimization for better ATS scores
 * 
 * This module analyzes CV content and job descriptions to identify
 * ATS optimization opportunities and uses AI to improve the CV.
 */

import OpenAI from 'openai'
import { CVSection } from '@/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ATSAnalysis {
  currentScore: number
  issues: ATSIssue[]
  recommendations: string[]
  missingKeywords: string[]
  structureIssues: string[]
}

export interface ATSIssue {
  category: 'keywords' | 'structure' | 'formatting' | 'content' | 'skills'
  severity: 'high' | 'medium' | 'low'
  description: string
  impact: string
}

export interface OptimizationResult {
  optimizedSections: CVSection[]
  improvements: string[]
  beforeScore: number
  afterScore: number
  changesSummary: string
}

/**
 * Analyze CV for ATS issues
 */
export async function analyzeATSIssues(
  sections: CVSection[],
  jobDescription: string,
  currentScore: number
): Promise<ATSAnalysis> {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this CV and identify specific issues affecting its ATS score.

CURRENT ATS SCORE: ${currentScore}%

JOB DESCRIPTION:
${jobDescription}

CV SECTIONS:
${sections.map(s => `${s.type.toUpperCase()}: ${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n')}

Analyze the CV and provide a detailed breakdown of ATS issues. Return your analysis as JSON:

{
  "issues": [
    {
      "category": "keywords|structure|formatting|content|skills",
      "severity": "high|medium|low",
      "description": "Specific issue description",
      "impact": "How this affects ATS score"
    }
  ],
  "recommendations": ["Specific actionable recommendations"],
  "missingKeywords": ["Critical keywords from job description not in CV"],
  "structureIssues": ["Section organization problems"]
}

Focus on:
1. Missing keywords from job description
2. Weak action verbs
3. Lack of quantifiable achievements
4. Missing or poorly structured sections
5. Skills not explicitly listed
6. Generic statements instead of specific accomplishments`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS optimization consultant. Provide detailed, actionable analysis in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')

    return {
      currentScore,
      issues: analysis.issues || [],
      recommendations: analysis.recommendations || [],
      missingKeywords: analysis.missingKeywords || [],
      structureIssues: analysis.structureIssues || []
    }
  } catch (error) {
    console.error('Error analyzing ATS issues:', error)
    throw new Error('Failed to analyze ATS issues')
  }
}

/**
 * Optimize CV content for better ATS score
 */
export async function optimizeForATS(
  sections: CVSection[],
  jobDescription: string,
  analysis: ATSAnalysis
): Promise<OptimizationResult> {
  const prompt = `You are an expert CV writer specializing in ATS optimization. Rewrite this CV to dramatically improve its ATS score.

CURRENT ATS SCORE: ${analysis.currentScore}%
TARGET: 80%+ ATS score

JOB DESCRIPTION:
${jobDescription}

IDENTIFIED ISSUES:
${analysis.issues.map(i => `- [${i.severity.toUpperCase()}] ${i.description}`).join('\n')}

MISSING KEYWORDS:
${analysis.missingKeywords.join(', ')}

CURRENT CV SECTIONS:
${sections.map(s => `${s.type.toUpperCase()}: ${typeof s.content === 'string' ? s.content : JSON.stringify(s.content)}`).join('\n\n')}

OPTIMIZATION REQUIREMENTS:

1. **KEYWORDS**: Naturally incorporate ALL missing keywords from the job description
2. **QUANTIFY**: Add specific numbers, percentages, and metrics to achievements
3. **ACTION VERBS**: Use strong, ATS-friendly action verbs (Led, Managed, Developed, Implemented, etc.)
4. **SKILLS SECTION**: Create/enhance explicit skills section with exact terms from job description
5. **ACHIEVEMENTS**: Transform responsibilities into quantifiable achievements
6. **TERMINOLOGY**: Match exact terminology from job description
7. **STRUCTURE**: Ensure standard ATS-friendly section names
8. **SPECIFICITY**: Replace vague statements with concrete examples

Return optimized sections as JSON array:

{
  "sections": [
    {
      "type": "summary|experience|skills|education|etc",
      "content": "optimized content",
      "order": number
    }
  ],
  "improvements": ["List of specific improvements made"],
  "changesSummary": "Brief summary of major changes"
}

CRITICAL RULES:
1. Maintain all factual information. Only enhance presentation, add metrics where logical, and optimize language.
2. Do not fabricate experience.
3. **PRESERVE ALL SECTIONS**: You MUST include ALL sections from the current CV in your output, including:
   - Custom sections (volunteer_work, publications, awards, projects, languages, memberships, speaking, patents, research, teaching, community)
   - Standard sections (name, contact, summary, experience, education, skills, certifications, hobbies, groups, strengths, additional, interests)
4. For custom sections: COPY EXACTLY - do not modify their content
5. Only optimize: summary, experience, and skills sections

🚨 YOUR OUTPUT MUST HAVE THE SAME NUMBER OF SECTIONS AS THE INPUT! 🚨`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS optimization specialist. Rewrite CV content to maximize ATS scores while maintaining authenticity. Return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 4000
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      optimizedSections: result.sections || sections,
      improvements: result.improvements || [],
      beforeScore: analysis.currentScore,
      afterScore: 0, // Will be calculated after optimization
      changesSummary: result.changesSummary || 'CV optimized for ATS'
    }
  } catch (error) {
    console.error('Error optimizing for ATS:', error)
    throw new Error('Failed to optimize CV for ATS')
  }
}

/**
 * Full ATS optimization workflow
 */
export async function runATSOptimization(
  sections: CVSection[],
  jobDescription: string,
  currentScore: number
): Promise<OptimizationResult> {
  console.log(`🎯 Starting ATS optimization (current score: ${currentScore}%)`)

  // Step 1: Analyze issues
  console.log('📊 Analyzing ATS issues...')
  const analysis = await analyzeATSIssues(sections, jobDescription, currentScore)
  console.log(`Found ${analysis.issues.length} issues`)

  // Step 2: Optimize content
  console.log('✨ Optimizing CV content...')
  const result = await optimizeForATS(sections, jobDescription, analysis)
  console.log(`Applied ${result.improvements.length} improvements`)

  return result
}

/**
 * Calculate estimated ATS score improvement
 */
export function estimateScoreImprovement(analysis: ATSAnalysis): number {
  let improvement = 0

  // High severity issues: 10-15 points each
  const highIssues = analysis.issues.filter(i => i.severity === 'high').length
  improvement += highIssues * 12

  // Medium severity issues: 5-8 points each
  const mediumIssues = analysis.issues.filter(i => i.severity === 'medium').length
  improvement += mediumIssues * 6

  // Low severity issues: 2-4 points each
  const lowIssues = analysis.issues.filter(i => i.severity === 'low').length
  improvement += lowIssues * 3

  // Missing keywords: 2 points each
  improvement += analysis.missingKeywords.length * 2

  return Math.min(improvement, 100 - analysis.currentScore)
}
