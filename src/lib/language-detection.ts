/**
 * Language Detection Utility
 * Detects language from text content and provides language metadata
 */

import { franc } from 'franc-min'

// Language code mapping (ISO 639-3 to ISO 639-1)
const LANGUAGE_MAP: Record<string, string> = {
  'eng': 'en',  // English
  'fra': 'fr',  // French
  'spa': 'es',  // Spanish
  'ara': 'ar',  // Arabic
  'hin': 'hi',  // Hindi
  'por': 'pt',  // Portuguese
  'deu': 'de',  // German
  'ita': 'it',  // Italian
  'nld': 'nl',  // Dutch
  'pol': 'pl',  // Polish
  'rus': 'ru',  // Russian
  'jpn': 'ja',  // Japanese
  'kor': 'ko',  // Korean
  'cmn': 'zh',  // Chinese (Mandarin)
  'tur': 'tr',  // Turkish
  'vie': 'vi',  // Vietnamese
  'tha': 'th',  // Thai
  'ron': 'ro',  // Romanian
  'urd': 'ur',  // Urdu
  'ben': 'bn',  // Bengali
  'tam': 'ta',  // Tamil
  'tel': 'te',  // Telugu
  'mar': 'mr',  // Marathi
  'guj': 'gu',  // Gujarati
  'pan': 'pa',  // Punjabi
  'swe': 'sv',  // Swedish
  'nor': 'no',  // Norwegian
  'dan': 'da',  // Danish
  'fin': 'fi',  // Finnish
  'ces': 'cs',  // Czech
  'hun': 'hu',  // Hungarian
  'ukr': 'uk',  // Ukrainian
  'ell': 'el',  // Greek
  'heb': 'he',  // Hebrew
  'ind': 'id',  // Indonesian
  'msa': 'ms',  // Malay
  'fil': 'tl',  // Filipino/Tagalog
}

// Language names for display
export const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'fr': 'French',
  'es': 'Spanish',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'pt': 'Portuguese',
  'de': 'German',
  'it': 'Italian',
  'nl': 'Dutch',
  'pl': 'Polish',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'ro': 'Romanian',
  'ur': 'Urdu',
  'bn': 'Bengali',
  'ta': 'Tamil',
  'te': 'Telugu',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'pa': 'Punjabi',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'cs': 'Czech',
  'hu': 'Hungarian',
  'uk': 'Ukrainian',
  'el': 'Greek',
  'he': 'Hebrew',
  'id': 'Indonesian',
  'ms': 'Malay',
  'tl': 'Filipino',
}

export interface LanguageDetectionResult {
  code: string // ISO 639-1 code (e.g., 'en', 'fr')
  name: string // Language name (e.g., 'English', 'French')
  confidence: 'high' | 'medium' | 'low'
  rawCode?: string // Original ISO 639-3 code from franc
}

/**
 * Detect language from text content
 * @param text - Text content to analyze
 * @param minLength - Minimum text length required for detection (default: 50)
 * @returns Language detection result
 */
export function detectLanguage(text: string, minLength: number = 50): LanguageDetectionResult {
  // Clean and normalize text
  const cleanText = text.trim()
  
  // Default to English if text is too short
  if (cleanText.length < minLength) {
    return {
      code: 'en',
      name: 'English',
      confidence: 'low'
    }
  }

  try {
    // Detect language using franc (returns ISO 639-3 code)
    const detected = franc(cleanText, { minLength: 10 })
    
    // Handle 'und' (undetermined)
    if (detected === 'und') {
      return {
        code: 'en',
        name: 'English',
        confidence: 'low',
        rawCode: detected
      }
    }

    // Map to ISO 639-1 code
    const languageCode = LANGUAGE_MAP[detected] || 'en'
    const languageName = LANGUAGE_NAMES[languageCode] || 'English'
    
    // Determine confidence based on text length
    let confidence: 'high' | 'medium' | 'low' = 'high'
    if (cleanText.length < 200) {
      confidence = 'medium'
    }
    if (cleanText.length < 100) {
      confidence = 'low'
    }

    return {
      code: languageCode,
      name: languageName,
      confidence,
      rawCode: detected
    }
  } catch (error) {
    console.error('Language detection error:', error)
    // Fallback to English on error
    return {
      code: 'en',
      name: 'English',
      confidence: 'low'
    }
  }
}

/**
 * Get language-specific AI instructions
 * @param languageCode - ISO 639-1 language code
 * @returns AI instruction string
 */
export function getLanguageInstruction(languageCode: string): string {
  const languageName = LANGUAGE_NAMES[languageCode] || 'English'
  
  if (languageCode === 'en') {
    return 'Generate the output in English.'
  }
  
  return `CRITICAL: The input CV is in ${languageName}. You MUST generate ALL output content in ${languageName}. Do not translate to English. Maintain the same language throughout the entire response.`
}

/**
 * Get language-specific formatting guidance
 * @param languageCode - ISO 639-1 language code
 * @returns Formatting guidance string
 */
export function getLanguageFormattingGuidance(languageCode: string): string {
  const rtlLanguages = ['ar', 'he', 'ur', 'fa'] // Right-to-left languages
  
  if (rtlLanguages.includes(languageCode)) {
    return 'Note: This is a right-to-left (RTL) language. Ensure proper text direction in the output.'
  }
  
  return ''
}

/**
 * Validate if a language code is supported
 * @param languageCode - ISO 639-1 language code
 * @returns boolean
 */
export function isLanguageSupported(languageCode: string): boolean {
  return languageCode in LANGUAGE_NAMES
}
