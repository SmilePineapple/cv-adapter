/**
 * AI-Powered PDF Layout Optimizer
 * Analyzes CV content and optimizes spacing to fit content efficiently
 */

import { CVSection } from '@/types/database'
import { advancedTemplateStyles, sectionIcons, hobbyIcons } from './advanced-templates'

interface LayoutMetrics {
  totalContentLength: number
  sectionCount: number
  averageSectionLength: number
  estimatedPages: number
  compressionLevel: 'none' | 'light' | 'medium' | 'heavy'
}

/**
 * Analyze CV content and determine optimal spacing
 */
export function analyzeContentDensity(sections: CVSection[]): LayoutMetrics {
  const totalContentLength = sections.reduce((sum, section) => {
    const content = getSectionContent(section.content)
    return sum + content.length
  }, 0)

  const sectionCount = sections.length
  const averageSectionLength = totalContentLength / sectionCount

  // Estimate pages based on character count
  // Average A4 page holds ~3000-3500 characters with normal spacing
  const estimatedPages = Math.ceil(totalContentLength / 3000)

  // Determine compression level
  let compressionLevel: 'none' | 'light' | 'medium' | 'heavy' = 'none'
  
  if (estimatedPages > 2.5) {
    compressionLevel = 'heavy'
  } else if (estimatedPages > 2) {
    compressionLevel = 'medium'
  } else if (estimatedPages > 1.5) {
    compressionLevel = 'light'
  }

  return {
    totalContentLength,
    sectionCount,
    averageSectionLength,
    estimatedPages,
    compressionLevel
  }
}

/**
 * Get optimized spacing values based on content density
 */
export function getOptimizedSpacing(metrics: LayoutMetrics) {
  const { compressionLevel } = metrics

  const spacingProfiles = {
    none: {
      bodyPadding: '25px',
      sectionMargin: '14px',
      lineHeight: '1.5',
      fontSize: '10px',
      headerMargin: '15px',
      contentSpacing: '8px'
    },
    light: {
      bodyPadding: '20px',
      sectionMargin: '10px',
      lineHeight: '1.4',
      fontSize: '9.5px',
      headerMargin: '12px',
      contentSpacing: '6px'
    },
    medium: {
      bodyPadding: '18px',
      sectionMargin: '8px',
      lineHeight: '1.35',
      fontSize: '9px',
      headerMargin: '10px',
      contentSpacing: '5px'
    },
    heavy: {
      bodyPadding: '15px',
      sectionMargin: '6px',
      lineHeight: '1.3',
      fontSize: '8.5px',
      headerMargin: '8px',
      contentSpacing: '4px'
    }
  }

  return spacingProfiles[compressionLevel]
}

/**
 * Generate optimized template CSS with dynamic spacing
 */
export function generateOptimizedTemplateCSS(
  templateId: string,
  spacing: ReturnType<typeof getOptimizedSpacing>
): string {
  const { bodyPadding, sectionMargin, lineHeight, fontSize, headerMargin, contentSpacing } = spacing

  const optimizedTemplates = {
    modern: `
      body { 
        font-family: 'Inter', 'Segoe UI', sans-serif; 
        line-height: ${lineHeight}; 
        color: #1e293b; 
        max-width: 100%; 
        margin: 0; 
        padding: ${bodyPadding}; 
        background: #fff; 
        font-size: ${fontSize}; 
      }
      .contact { 
        background: #3b82f6; 
        color: #fff; 
        padding: 8px 12px; 
        margin: -${bodyPadding} -${bodyPadding} ${headerMargin} -${bodyPadding}; 
        font-size: 0.85em; 
        line-height: 1.3; 
      }
      .header { 
        margin-bottom: ${headerMargin}; 
        border-left: 3px solid #3b82f6; 
        padding-left: 10px; 
      }
      .name { 
        font-size: 1.8em; 
        font-weight: 800; 
        color: #0f172a; 
        margin-bottom: ${contentSpacing}; 
        letter-spacing: -0.5px; 
        line-height: 1.1; 
      }
      .section { 
        margin-bottom: ${sectionMargin}; 
        padding-left: 10px; 
        border-left: 2px solid #93c5fd; 
        page-break-inside: avoid; 
      }
      .section-title { 
        font-size: 1.05em; 
        font-weight: 700; 
        color: #3b82f6; 
        margin-bottom: ${contentSpacing}; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
      }
      .content { 
        white-space: pre-wrap; 
        line-height: ${lineHeight}; 
      }
      @media print { 
        body { padding: ${bodyPadding}; font-size: ${fontSize}; } 
        .name { font-size: 1.7em; } 
      }
    `,
    classic: `
      body { 
        font-family: 'Garamond', 'Times New Roman', serif; 
        line-height: ${lineHeight}; 
        color: #1a1a1a; 
        max-width: 100%; 
        margin: 0; 
        padding: ${bodyPadding}; 
        background: #fffef8; 
        font-size: ${fontSize}; 
      }
      .contact { 
        text-align: center; 
        font-size: 0.8em; 
        padding: 8px; 
        background: #f5f5f0; 
        border-top: 1.5px solid #8b7355; 
        border-bottom: 1.5px solid #8b7355; 
        margin: -${bodyPadding} -${bodyPadding} ${headerMargin} -${bodyPadding}; 
        line-height: 1.3; 
      }
      .header { 
        text-align: center; 
        margin-bottom: ${headerMargin}; 
      }
      .name { 
        font-size: 2em; 
        font-weight: 700; 
        margin-bottom: ${contentSpacing}; 
        color: #2c2416; 
        letter-spacing: 1.5px; 
        line-height: 1.1; 
      }
      .section { 
        margin-bottom: ${sectionMargin}; 
        page-break-inside: avoid; 
      }
      .section-title { 
        font-size: 1.1em; 
        font-weight: 700; 
        margin-bottom: ${contentSpacing}; 
        border-bottom: 1.5px double #8b7355; 
        padding-bottom: 3px; 
        color: #2c2416; 
        font-variant: small-caps; 
      }
      .content { 
        white-space: pre-wrap; 
        text-align: justify; 
        line-height: ${lineHeight}; 
      }
      @media print { 
        body { padding: ${bodyPadding}; font-size: ${fontSize}; } 
      }
    `,
    minimal: `
      body { 
        font-family: 'Helvetica Neue', 'Arial', sans-serif; 
        line-height: ${lineHeight}; 
        color: #333; 
        max-width: 100%; 
        margin: 0; 
        padding: ${bodyPadding}; 
        background: #fff; 
        font-size: ${fontSize}; 
      }
      .contact { 
        font-size: 0.75em; 
        color: #666; 
        padding: 6px 0; 
        margin-bottom: ${headerMargin}; 
        border-bottom: 1px solid #e5e5e5; 
        line-height: 1.3; 
      }
      .header { 
        margin-bottom: ${headerMargin}; 
      }
      .name { 
        font-size: 1.7em; 
        font-weight: 200; 
        margin-bottom: ${contentSpacing}; 
        letter-spacing: 3px; 
        color: #1a1a1a; 
        line-height: 1.1; 
      }
      .section { 
        margin-bottom: ${sectionMargin}; 
        page-break-inside: avoid; 
      }
      .section-title { 
        font-size: 0.8em; 
        font-weight: 600; 
        margin-bottom: ${contentSpacing}; 
        color: #888; 
        text-transform: uppercase; 
        letter-spacing: 1.5px; 
      }
      .content { 
        white-space: pre-wrap; 
        font-size: 0.95em; 
        font-weight: 300; 
        line-height: ${lineHeight}; 
      }
      @media print { 
        body { padding: ${bodyPadding}; } 
      }
    `,
    // Add more optimized templates...
  }

  return optimizedTemplates[templateId as keyof typeof optimizedTemplates] || optimizedTemplates.modern
}

/**
 * Check if template uses advanced layout (two-column, icons, etc.)
 */
export function isAdvancedTemplate(templateId: string): boolean {
  return [
    'creative_modern', 
    'professional_columns',
    'professional-metrics',
    'teal-sidebar',
    'soft-header',
    'artistic-header',
    'bold-split'
  ].includes(templateId)
}

/**
 * Get advanced template style
 */
export function getAdvancedTemplateStyle(templateId: string): string | null {
  if (templateId === 'creative_modern') return advancedTemplateStyles.creative_modern
  if (templateId === 'professional_columns') return advancedTemplateStyles.professional_columns
  return null
}

/**
 * Helper to extract content from section
 */
function getSectionContent(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object') {
        return Object.values(item).filter(v => typeof v === 'string').join(' ')
      }
      return ''
    }).join(' ')
  }
  if (typeof content === 'object') {
    return Object.values(content).filter(v => typeof v === 'string').join(' ')
  }
  return String(content)
}
