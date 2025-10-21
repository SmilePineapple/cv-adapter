'use client'

import { useState } from 'react'
import { X, Sparkles, Layout, Palette } from 'lucide-react'

interface TemplatePreviewProps {
  templateId: string
  onClose: () => void
}

const TEMPLATE_PREVIEWS = {
  creative_modern: {
    name: 'Creative Modern',
    image: '/previews/creative-modern.png',
    features: [
      'Decorative colored circles background',
      'Two-column layout for efficient space usage',
      'Section icons (briefcase, graduation cap, etc.)',
      'Hobby icon grid with auto-detection',
      'Gradient section headers',
      'Modern Inter font',
      'Skill tags with rounded corners'
    ],
    colors: ['#f6ad55', '#ed8936', '#4a5568', '#2d3748'],
    bestFor: ['Designers', 'Marketers', 'Content Creators', 'Creative Professionals']
  },
  professional_columns: {
    name: 'Professional Columns',
    image: '/previews/professional-columns.png',
    features: [
      'Blue gradient header bar',
      'Sidebar + main content layout (35% / 65%)',
      'Skill progress bars showing proficiency',
      'Hobby badges with icons',
      'Section headers with bottom borders',
      'Clean Roboto font',
      'Professional blue theme'
    ],
    colors: ['#2c5282', '#2b6cb0', '#4299e1', '#edf2f7'],
    bestFor: ['Corporate Professionals', 'Executives', 'Consultants', 'Finance/Legal']
  }
}

export default function TemplatePreview({ templateId, onClose }: TemplatePreviewProps) {
  const preview = TEMPLATE_PREVIEWS[templateId as keyof typeof TEMPLATE_PREVIEWS]
  
  if (!preview) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">{preview.name}</h2>
              <span className="px-3 py-1 text-xs font-bold bg-white/20 rounded-full">
                ADVANCED
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview Image Placeholder */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-[8.5/11] flex items-center justify-center border-2 border-gray-300">
            <div className="text-center">
              <Layout className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Template Preview</p>
              <p className="text-sm text-gray-500 mt-1">
                Export to see the full design with your content
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Key Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {preview.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              Color Palette
            </h3>
            <div className="flex gap-3">
              {preview.colors.map((color, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Perfect For</h3>
            <div className="flex flex-wrap gap-2">
              {preview.bestFor.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Visual Elements Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-bold text-gray-900 mb-2">What Makes This Template Special?</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {templateId === 'creative_modern' 
                ? 'This template features decorative circles, a two-column layout, and automatically detects hobbies from your CV to display them as beautiful icons. Perfect for standing out while maintaining professionalism.'
                : 'This template uses a sidebar layout with skill progress bars and hobby badges. The professional blue theme and structured layout make it ideal for corporate environments while still showing personality.'
              }
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Select This Template
          </button>
        </div>
      </div>
    </div>
  )
}
