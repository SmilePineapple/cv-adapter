import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CV Writing Tips & Guides 2026 | My CV Buddy Blog',
  description: 'Expert CV writing tips, ATS optimization guides, and job search strategies. Learn how to create a winning CV that gets you interviews.',
  keywords: [
    'CV writing tips',
    'resume writing guide',
    'ATS optimization',
    'job search advice',
    'career tips',
    'CV best practices',
    'how to write a CV',
    'resume tips',
    'job application advice',
    'CV examples'
  ],
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black text-white">My CV Buddy</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog" 
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                Blog
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-4">
        <article className="max-w-4xl mx-auto">
          {children}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2026 My CV Buddy. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
