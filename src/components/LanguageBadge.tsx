'use client'

import { Globe } from 'lucide-react'
import { LANGUAGE_NAMES } from '@/lib/language-detection'

interface LanguageBadgeProps {
  languageCode: string
  showIcon?: boolean
  className?: string
}

export function LanguageBadge({ 
  languageCode, 
  showIcon = true, 
  className = '' 
}: LanguageBadgeProps) {
  const languageName = LANGUAGE_NAMES[languageCode] || 'English'
  
  // Color coding for different language families
  const getLanguageColor = (code: string) => {
    // European languages
    if (['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'sv', 'no', 'da', 'fi', 'cs', 'hu'].includes(code)) {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    }
    // Asian languages
    if (['zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'tl'].includes(code)) {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    }
    // Middle Eastern & South Asian languages
    if (['ar', 'he', 'ur', 'fa', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(code)) {
      return 'bg-amber-100 text-amber-700 border-amber-200'
    }
    // Slavic languages
    if (['ru', 'uk', 'pl', 'cs', 'sk'].includes(code)) {
      return 'bg-green-100 text-green-700 border-green-200'
    }
    // Default
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const colorClass = getLanguageColor(languageCode)

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}
      title={`Document language: ${languageName}`}
    >
      {showIcon && <Globe className="w-3 h-3" />}
      <span>{languageName}</span>
    </span>
  )
}
