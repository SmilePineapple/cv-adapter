import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, Sparkles } from 'lucide-react'

export default function TemplatesPage() {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design perfect for tech and creative roles',
      features: ['Blue accent colors', 'Left-aligned sections', 'Professional fonts'],
      bestFor: 'Tech, Marketing, Design',
      preview: '🎨'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional format ideal for corporate positions',
      features: ['Serif fonts', 'Centered header', 'Conservative styling'],
      bestFor: 'Finance, Law, Corporate',
      preview: '📄'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant with focus on content over design',
      features: ['Lots of white space', 'Sans-serif fonts', 'Subtle accents'],
      bestFor: 'Any industry, ATS-friendly',
      preview: '✨'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and eye-catching for creative professionals',
      features: ['Colorful sections', 'Modern layout', 'Visual hierarchy'],
      bestFor: 'Design, Media, Arts',
      preview: '🎭'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Code-inspired design for developers and engineers',
      features: ['Monospace fonts', 'Dark theme option', 'Tech aesthetic'],
      bestFor: 'Software, Engineering, IT',
      preview: '💻'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Premium design for senior-level professionals',
      features: ['Sophisticated styling', 'Bold headers', 'Professional colors'],
      bestFor: 'C-Level, Senior Management',
      preview: '👔'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Research-focused format for academic positions',
      features: ['Publication-friendly', 'Traditional fonts', 'Detailed sections'],
      bestFor: 'Research, Academia, Education',
      preview: '🎓'
    },
    {
      id: 'startup',
      name: 'Startup',
      description: 'Dynamic and innovative for fast-paced environments',
      features: ['Modern colors', 'Flexible layout', 'Impact-focused'],
      bestFor: 'Startups, Scale-ups, Innovation',
      preview: '🚀'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional and polished for established companies',
      features: ['Traditional structure', 'Professional colors', 'Conservative'],
      bestFor: 'Corporate, Consulting, Banking',
      preview: '🏢'
    },
    {
      id: 'designer',
      name: 'Designer',
      description: 'Visually striking for creative portfolios',
      features: ['Bold typography', 'Creative layout', 'Visual elements'],
      bestFor: 'Graphic Design, UX/UI, Creative',
      preview: '🎨'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">CV Templates</h1>
          </div>
          <p className="mt-2 text-gray-600">Choose from 10 professional templates designed for different industries and roles</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12">
          <div className="flex items-start space-x-4">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">How It Works</h2>
              <p className="text-gray-700 mb-4">
                All templates are available when you export your CV. Simply upload your CV, tailor it to a job, 
                and choose your preferred template at the download stage.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>All templates are ATS-friendly</span>
                <CheckCircle className="w-4 h-4 text-green-600 ml-4" />
                <span>Export as PDF, DOCX, or TXT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
              {/* Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center text-6xl">
                {template.preview}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Features</p>
                  <ul className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Best For */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Best For</p>
                  <p className="text-sm text-blue-600 font-medium">{template.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect CV?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Upload your CV, tailor it with AI, and export with any template
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Get Started Free
            </Link>
            <Link 
              href="/blog"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              CV Writing Tips
            </Link>
          </div>
        </div>

        {/* Template Comparison */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choosing the Right Template</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">For Tech Roles</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Modern - Clean and contemporary</li>
                <li>• Technical - Code-inspired</li>
                <li>• Minimal - ATS-friendly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">For Corporate Roles</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Classic - Traditional format</li>
                <li>• Executive - Premium design</li>
                <li>• Corporate - Professional polish</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">For Creative Roles</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Creative - Bold and colorful</li>
                <li>• Designer - Visually striking</li>
                <li>• Startup - Dynamic and modern</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
