'use client'

import { useState } from 'react'
import { COLOR_SCHEMES, ColorScheme } from '@/lib/modern-templates'
import { Check } from 'lucide-react'

interface ColorSchemeSelectorProps {
  selectedScheme: string
  onSchemeChange: (schemeId: string) => void
}

export default function ColorSchemeSelector({ selectedScheme, onSchemeChange }: ColorSchemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-gray-200"
            style={{ 
              background: `linear-gradient(135deg, ${COLOR_SCHEMES.find(s => s.id === selectedScheme)?.primary || '#4ECDC4'} 0%, ${COLOR_SCHEMES.find(s => s.id === selectedScheme)?.secondary || '#95E1D3'} 100%)`
            }}
          />
          <span className="text-sm font-medium text-gray-700">
            {COLOR_SCHEMES.find(s => s.id === selectedScheme)?.name || 'Select Color'}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Color Scheme</h3>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      onSchemeChange(scheme.id)
                      setIsOpen(false)
                    }}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedScheme === scheme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)`
                        }}
                      />
                      <span className="text-xs font-medium text-gray-900">{scheme.name}</span>
                    </div>
                    
                    {/* Color swatches */}
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.primary }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.secondary }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.accent }} />
                    </div>

                    {/* Check mark */}
                    {selectedScheme === scheme.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
