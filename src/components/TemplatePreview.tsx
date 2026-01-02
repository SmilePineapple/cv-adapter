'use client'

import { useState } from 'react'
import { X, Sparkles, Layout, Palette } from 'lucide-react'

interface TemplatePreviewProps {
  templateId: string
  onClose: () => void
  screenshot?: string
  colors?: string[]
}

const TEMPLATE_PREVIEWS: Record<string, {
  name: string
  image: string
  features: string[]
  colors: string[]
  bestFor: string[]
  description: string
}> = {
  'professional-metrics': {
    name: 'Professional Metrics',
    image: '/templates/professional-metrics.png',
    features: [
      'Two-column layout (30% sidebar, 70% main)',
      'Circular skill meters for visual appeal',
      'Section icons for clear hierarchy',
      'Professional blue color scheme',
      'Clean, modern typography',
      'ATS-friendly structure',
      'Print-optimized spacing'
    ],
    colors: ['#4F46E5', '#6366F1', '#818CF8'],
    bestFor: ['Software Engineers', 'Data Scientists', 'Project Managers', 'Business Analysts'],
    description: 'Perfect for technical professionals who want to showcase their skills with visual metrics while maintaining a professional appearance. The circular skill meters make your expertise immediately visible.'
  },
  'teal-sidebar': {
    name: 'Teal Sidebar',
    image: '/templates/teal-sidebar.png',
    features: [
      'Icon-based sidebar navigation',
      'Teal accent color for modern look',
      'Horizontal skill progress bars',
      'Section icons in sidebar',
      'Clean, organized layout',
      'Professional typography',
      'Mobile-responsive design'
    ],
    colors: ['#14B8A6', '#2DD4BF', '#5EEAD4'],
    bestFor: ['UX Designers', 'Product Managers', 'Marketing Managers', 'Tech Leads'],
    description: 'A modern template with a distinctive teal accent that makes your CV stand out. The sidebar layout efficiently organizes information while the skill bars provide clear visual representation of your abilities.'
  },
  'soft-header': {
    name: 'Soft Header',
    image: '/templates/soft-header.png',
    features: [
      'Gradient header (purple to blue)',
      'Skill progress bars',
      'Clean, modern layout',
      'Good visual hierarchy',
      'Section dividers',
      'Professional spacing',
      'Print-safe colors'
    ],
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    bestFor: ['Designers', 'Creative Directors', 'Brand Managers', 'Content Strategists'],
    description: 'Features a beautiful gradient header that creates a memorable first impression. The soft purple tones convey creativity while maintaining professionalism, perfect for creative roles.'
  },
  'artistic-header': {
    name: 'Artistic Header',
    image: '/templates/artistic-header.png',
    features: [
      'Decorative pattern in header',
      'Pink accent color',
      'Creative, eye-catching design',
      'Balanced layout',
      'Hobby icon grid',
      'Professional structure',
      'Unique visual appeal'
    ],
    colors: ['#EC4899', '#F472B6', '#F9A8D4'],
    bestFor: ['Graphic Designers', 'Illustrators', 'Art Directors', 'Fashion Designers'],
    description: 'Stand out with a decorative pattern header and vibrant pink accents. This template is perfect for creative professionals who want to showcase their artistic sensibility while maintaining a structured, professional format.'
  },
  'bold-split': {
    name: 'Bold Split',
    image: '/templates/bold-split.png',
    features: [
      '50/50 split layout',
      'Dark sidebar with cyan accents',
      'High contrast for readability',
      'Bold, modern design',
      'Professional typography',
      'Accessibility-friendly',
      'Unique visual impact'
    ],
    colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
    bestFor: ['Tech Professionals', 'Developers', 'Cybersecurity', 'System Architects'],
    description: 'Make a bold statement with high-contrast design. The dark/light split creates immediate visual impact while the cyan accents add a modern tech feel. Perfect for standing out in competitive tech roles.'
  },
  creative_modern: {
    name: 'Creative Modern',
    image: '/templates/creative-modern.png',
    features: [
      'Decorative colored circles background',
      'Two-column layout for efficient space usage',
      'Section icons (briefcase, graduation cap, etc.)',
      'Hobby icon grid with auto-detection',
      'Gradient section headers',
      'Modern Inter font',
      'Skill tags with rounded corners'
    ],
    colors: ['#7C3AED', '#8B5CF6', '#A78BFA'],
    bestFor: ['Designers', 'Marketers', 'Content Creators', 'Creative Professionals'],
    description: 'This template features decorative circles, a two-column layout, and automatically detects hobbies from your CV to display them as beautiful icons. Perfect for standing out while maintaining professionalism.'
  },
  professional_columns: {
    name: 'Professional Columns',
    image: '/templates/professional-columns.png',
    features: [
      'Blue gradient header bar',
      'Sidebar + main content layout (35% / 65%)',
      'Skill progress bars showing proficiency',
      'Hobby badges with icons',
      'Section headers with bottom borders',
      'Clean Roboto font',
      'Professional blue theme'
    ],
    colors: ['#3B82F6', '#60A5FA', '#93C5FD'],
    bestFor: ['Corporate Professionals', 'Executives', 'Consultants', 'Finance/Legal'],
    description: 'This template uses a sidebar layout with skill progress bars and hobby badges. The professional blue theme and structured layout make it ideal for corporate environments while still showing personality.'
  }
}

export default function TemplatePreview({ templateId, onClose, screenshot, colors }: TemplatePreviewProps) {
  const preview = TEMPLATE_PREVIEWS[templateId]
  
  if (!preview) return null
  
  // Use provided colors or fall back to template defaults
  const displayColors = colors || preview.colors

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
          {/* Preview Image */}
          {screenshot ? (
            <div className="rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
              <img 
                src={screenshot} 
                alt={`${preview.name} template preview`}
                className="w-full h-auto"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[8.5/11] flex items-center justify-center">
                <div className="text-center">
                  <Layout className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Template Preview</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Export to see the full design with your content
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-[8.5/11] flex items-center justify-center border-2 border-gray-300">
              <div className="text-center">
                <Layout className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Template Preview</p>
                <p className="text-sm text-gray-500 mt-1">
                  Export to see the full design with your content
                </p>
              </div>
            </div>
          )}

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
              {displayColors.map((color, index) => (
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
              {preview.description}
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
