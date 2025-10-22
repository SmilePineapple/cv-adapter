'use client'

import { useState } from 'react'
import { CVSection } from '@/types/database'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'

interface ComparisonViewProps {
  originalSections: CVSection[]
  generatedSections: CVSection[]
  improvedSections?: CVSection[]
  originalAtsScore?: number
  generatedAtsScore?: number
  improvedAtsScore?: number
}

export default function ComparisonView({
  originalSections,
  generatedSections,
  improvedSections,
  originalAtsScore,
  generatedAtsScore,
  improvedAtsScore
}: ComparisonViewProps) {
  const [activeView, setActiveView] = useState<'original' | 'generated' | 'improved'>('generated')

  const formatContent = (content: any): string => {
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object') {
          // Format experience objects
          if (item.job_title || item.title) {
            const parts = []
            const title = item.job_title || item.title
            const company = item.company || ''
            const dates = item.dates || ''
            if (company && dates) {
              parts.push(`${title} | ${company} | ${dates}`)
            } else {
              parts.push(title)
            }
            if (item.responsibilities && Array.isArray(item.responsibilities)) {
              item.responsibilities.forEach((resp: string) => {
                parts.push(`• ${resp}`)
              })
            }
            return parts.join('\n')
          }
          return JSON.stringify(item)
        }
        return String(item)
      }).join('\n\n')
    }
    return JSON.stringify(content)
  }

  const renderSections = (sections: CVSection[]) => {
    return sections.map((section, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
          {section.type.replace('_', ' ')}
        </h3>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {formatContent(section.content)}
        </div>
      </div>
    ))
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800'
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Mobile View Selector */}
      <div className="lg:hidden border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (activeView === 'generated') setActiveView('original')
              if (activeView === 'improved') setActiveView('generated')
            }}
            disabled={activeView === 'original'}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">
              {activeView === 'original' && 'Original CV'}
              {activeView === 'generated' && 'Generated CV'}
              {activeView === 'improved' && 'AI-Improved CV'}
            </div>
            {activeView === 'original' && originalAtsScore && (
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-1 ${getScoreColor(originalAtsScore)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                ATS: {originalAtsScore}%
              </div>
            )}
            {activeView === 'generated' && generatedAtsScore && (
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-1 ${getScoreColor(generatedAtsScore)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                ATS: {generatedAtsScore}%
              </div>
            )}
            {activeView === 'improved' && improvedAtsScore && (
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-1 ${getScoreColor(improvedAtsScore)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                ATS: {improvedAtsScore}%
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              if (activeView === 'original') setActiveView('generated')
              if (activeView === 'generated' && improvedSections) setActiveView('improved')
            }}
            disabled={activeView === 'improved' || (activeView === 'generated' && !improvedSections)}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('original')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
              activeView === 'original'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveView('generated')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
              activeView === 'generated'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Generated
          </button>
          {improvedSections && (
            <button
              onClick={() => setActiveView('improved')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'improved'
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI-Improved
            </button>
          )}
        </div>
      </div>

      {/* Desktop Three-Column View */}
      <div className="hidden lg:grid lg:grid-cols-3 divide-x divide-gray-200">
        {/* Original CV */}
        <div className="p-6">
          <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Original CV</h2>
            {originalAtsScore && (
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${getScoreColor(originalAtsScore)}`}>
                <TrendingUp className="w-4 h-4 mr-1.5" />
                ATS: {originalAtsScore}%
              </div>
            )}
          </div>
          <div className="space-y-6">
            {renderSections(originalSections)}
          </div>
        </div>

        {/* Generated CV */}
        <div className="p-6 bg-blue-50/30">
          <div className="sticky top-0 bg-blue-50/30 pb-4 mb-4 border-b border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Generated CV</h2>
            {generatedAtsScore && (
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${getScoreColor(generatedAtsScore)}`}>
                <TrendingUp className="w-4 h-4 mr-1.5" />
                ATS: {generatedAtsScore}%
              </div>
            )}
          </div>
          <div className="space-y-6">
            {renderSections(generatedSections)}
          </div>
        </div>

        {/* AI-Improved CV */}
        {improvedSections && (
          <div className="p-6 bg-green-50/30">
            <div className="sticky top-0 bg-green-50/30 pb-4 mb-4 border-b border-green-200">
              <h2 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>AI-Improved CV</span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
              </h2>
              {improvedAtsScore && (
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${getScoreColor(improvedAtsScore)}`}>
                    <TrendingUp className="w-4 h-4 mr-1.5" />
                    ATS: {improvedAtsScore}%
                  </div>
                  {generatedAtsScore && improvedAtsScore > generatedAtsScore && (
                    <div className="text-xs text-green-700 font-medium">
                      📈 +{improvedAtsScore - generatedAtsScore}% improvement
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-6">
              {renderSections(improvedSections)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Single Column View */}
      <div className="lg:hidden p-6">
        {activeView === 'original' && renderSections(originalSections)}
        {activeView === 'generated' && renderSections(generatedSections)}
        {activeView === 'improved' && improvedSections && renderSections(improvedSections)}
      </div>
    </div>
  )
}
