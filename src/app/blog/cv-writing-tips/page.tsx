import Link from 'next/link'
import { ArrowLeft, CheckCircle, TrendingUp, Target, Zap, Star, Award } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Writing Tips & Best Practices | My CV Buddy',
  description: 'Expert advice to create a winning CV that gets you interviews. Learn the 6-second rule, action verbs, and proven strategies that work.',
  keywords: [
    'CV writing tips',
    'resume writing guide',
    'CV best practices',
    'how to write a CV',
    'CV advice',
    'professional CV tips',
    'CV structure',
    'CV mistakes to avoid'
  ],
}

export default function CVWritingTipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            CV Writing Tips & Best Practices
          </h1>
          <p className="text-xl text-gray-600 mb-4">Expert advice to create a winning CV that gets you interviews</p>
          <div className="flex items-center text-gray-600 space-x-4 text-sm">
            <span>October 10, 2025</span>
            <span>•</span>
            <span>6 min read</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Tips Banner */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">🎯 Quick Win: The 6-Second Rule</h2>
          <p className="text-lg mb-4">
            Recruiters spend an average of <strong>6 seconds</strong> reviewing each CV. 
            Make every second count with these proven strategies.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-700 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 mb-2" />
              <p className="font-semibold">Clear Structure</p>
              <p className="text-sm text-blue-100">Easy to scan sections</p>
            </div>
            <div className="bg-blue-700 rounded-lg p-4">
              <Target className="w-6 h-6 mb-2" />
              <p className="font-semibold">Tailored Content</p>
              <p className="text-sm text-blue-100">Match job requirements</p>
            </div>
            <div className="bg-blue-700 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 mb-2" />
              <p className="font-semibold">Quantified Results</p>
              <p className="text-sm text-blue-100">Numbers tell stories</p>
            </div>
          </div>
        </div>

        {/* Main Tips */}
        <div className="space-y-8 mb-12">
          
          {/* Tip 1 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tailor Your CV to Each Job</h3>
                <p className="text-gray-600 mb-4">
                  Generic CVs get rejected. Customize your CV for each application by:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Using keywords from the job description</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Highlighting relevant experience first</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Matching your skills to their requirements</span>
                  </li>
                </ul>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Pro Tip:</strong> Use <Link href="/auth/signup" className="underline">My CV Buddy</Link> to automatically tailor your CV to any job description in seconds!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Quantify Your Achievements</h3>
                <p className="text-gray-600 mb-4">
                  Numbers make your accomplishments tangible and memorable:
                </p>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-sm text-gray-500 mb-1">❌ Weak:</p>
                    <p className="text-gray-700">"Managed a team"</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm text-gray-500 mb-1">✅ Strong:</p>
                    <p className="text-gray-700">"Led team of 12 developers, delivering 15+ projects with 98% client satisfaction"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip 3 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Use Action Verbs</h3>
                <p className="text-gray-600 mb-4">
                  Start bullet points with powerful action verbs to show impact:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold mb-2">Leadership:</p>
                    <p>Led, Directed, Managed, Coordinated</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Achievement:</p>
                    <p>Achieved, Delivered, Exceeded, Surpassed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip 4 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Optimize for ATS</h3>
                <p className="text-gray-600 mb-4">
                  75% of CVs are rejected by ATS before a human sees them. Beat the bots:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use standard headings: "Work Experience" not "My Journey"</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include keywords from job posting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Save as .docx or PDF</span>
                  </li>
                </ul>
                <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>🎯 Read our complete guide:</strong> <Link href="/blog/how-to-beat-ats-systems" className="underline">How to Beat ATS Systems</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CV Structure Guide */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 text-blue-600 mr-3" />
            Perfect CV Structure
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="font-bold text-gray-900">1. Contact Information</h3>
              <p className="text-sm text-gray-600">Name, phone, email, LinkedIn, location</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="font-bold text-gray-900">2. Professional Summary</h3>
              <p className="text-sm text-gray-600">3-4 lines tailored to the role</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="font-bold text-gray-900">3. Key Skills</h3>
              <p className="text-sm text-gray-600">6-12 relevant skills</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="font-bold text-gray-900">4. Work Experience</h3>
              <p className="text-sm text-gray-600">Reverse chronological, 3-5 bullets per role</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="font-bold text-gray-900">5. Education</h3>
              <p className="text-sm text-gray-600">Degree, institution, year</p>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-red-50 border-l-4 border-red-600 p-8 mb-12">
          <h2 className="text-2xl font-bold text-red-900 mb-4">❌ Common CV Mistakes to Avoid</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-red-800">
              <li>• Spelling and grammar errors</li>
              <li>• Using personal pronouns (I, me, my)</li>
              <li>• Including a photo (unless required)</li>
              <li>• Listing references on CV</li>
              <li>• Using unprofessional email addresses</li>
            </ul>
            <ul className="space-y-2 text-red-800">
              <li>• Making it too long (&gt;2 pages)</li>
              <li>• Including irrelevant information</li>
              <li>• Using fancy fonts or colors</li>
              <li>• Lying or exaggerating</li>
              <li>• Forgetting to update dates</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect CV?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let AI do the heavy lifting. My CV Buddy tailors your CV to any job in seconds.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/templates"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View Templates
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
