import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, Sparkles } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free CV Templates UK 2026: 12 Professional ATS-Friendly Designs',
  description: 'Download free CV templates UK for 2026. 12 professional, ATS-optimized CV templates for all industries. Modern, classic, creative designs. Free CV builder with resume adapter. No sign up required to preview.',
  keywords: [
    'cv template uk free',
    'free cv templates uk',
    'cv templates uk',
    'professional cv templates',
    'ats cv templates',
    'free cv builder uk',
    'cv builder uk',
    'resume templates uk',
    'cv format uk',
    'cv design templates',
    'modern cv template',
    'creative cv template',
    'professional cv template uk',
    'ats friendly cv template'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/templates',
  },
  openGraph: {
    title: 'Free CV Templates UK 2026: 12 Professional Designs',
    description: 'Download free ATS-optimized CV templates for all industries. Modern, classic, creative designs.',
    url: 'https://www.mycvbuddy.com/templates',
    type: 'website',
  },
}

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
    },
    {
      id: 'graduate',
      name: 'Graduate',
      description: 'Perfect for recent graduates and entry-level positions',
      features: ['Education-focused', 'Skills highlight', 'Fresh and modern'],
      bestFor: 'Graduates, Entry-level, Internships',
      preview: '🎓'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Versatile template suitable for any industry',
      features: ['Balanced layout', 'Professional styling', 'Universal appeal'],
      bestFor: 'All industries, Mid-level roles',
      preview: '📋'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-black text-white">CV Templates</h1>
          </div>
          <p className="mt-2 text-gray-400">Choose from 12 professional, ATS-friendly CV templates designed for different industries and roles</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12">
          <div className="flex items-start space-x-4">
            <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-black text-white mb-2">Free CV Templates UK - How It Works</h2>
              <p className="text-gray-300 mb-4">
                All 12 professional CV templates are completely free with our CV builder UK. Simply upload your CV, use our AI resume adapter to tailor it to any job, 
                and choose your preferred template at the download stage. No sign up required to preview templates.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>All templates are ATS-friendly</span>
                <CheckCircle className="w-4 h-4 text-green-400 ml-4" />
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
                <h3 className="text-2xl font-black text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Features</p>
                  <ul className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Best For */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Best For</p>
                  <p className="text-sm text-blue-400 font-medium">{template.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect CV with Free Templates UK?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Use our free CV builder UK with AI resume adapter. Upload your CV, tailor it to any job, and export with any of our 12 professional templates.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
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
          <h2 className="text-3xl font-black text-white mb-6">Choosing the Right Template</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-black text-white mb-3">For Tech Roles</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Modern - Clean and contemporary</li>
                <li>• Technical - Code-inspired</li>
                <li>• Minimal - ATS-friendly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-white mb-3">For Corporate Roles</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Classic - Traditional format</li>
                <li>• Executive - Premium design</li>
                <li>• Corporate - Professional polish</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-white mb-3">For Creative Roles</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Creative - Bold and colorful</li>
                <li>• Designer - Visually striking</li>
                <li>• Startup - Dynamic and modern</li>
              </ul>
            </div>
          </div>

          {/* Helpful Resources */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-2xl font-black text-white mb-4">📚 CV Writing Resources</h3>
            <p className="text-gray-400 mb-4">Learn how to create a professional CV with our comprehensive guides:</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/cv-writing-guide" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-blue-400 hover:text-blue-700 font-semibold">CV Writing Guide 2026 →</p>
                <p className="text-sm text-gray-400 mt-1">Complete step-by-step tutorial</p>
              </Link>
              <Link href="/ats-optimization-guide" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-blue-400 hover:text-blue-700 font-semibold">ATS Optimization →</p>
                <p className="text-sm text-gray-400 mt-1">Beat applicant tracking systems</p>
              </Link>
              <Link href="/cv-examples" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-blue-400 hover:text-blue-700 font-semibold">CV Examples →</p>
                <p className="text-sm text-gray-400 mt-1">15+ industry-specific examples</p>
              </Link>
              <Link href="/interview-prep" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-blue-400 hover:text-blue-700 font-semibold">Interview Prep →</p>
                <p className="text-sm text-gray-400 mt-1">50+ questions and tips</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
