import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Free CV Builders UK 2025 | Expert Review',
  description: 'Compare the best free CV builders in the UK for 2025. Expert reviews, features, and recommendations to help you create a professional CV.',
  keywords: ['free cv builder', 'cv builder uk', 'best cv builder', 'free resume builder'],
}

export default function BestFreeCVBuildersPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Best Free CV Builders UK 2025
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expert comparison of the top free CV builders available in the UK
        </p>

        <div className="prose prose-lg max-w-none">
          <h2>Why Use a Free CV Builder?</h2>
          <p>
            Creating a professional CV doesn't have to cost money. Free CV builders offer powerful features
            that can help you stand out in the UK job market without breaking the bank.
          </p>

          <h2>Top Free CV Builders for UK Job Seekers</h2>
          
          <h3>1. My CV Buddy (Best Overall)</h3>
          <p>
            <strong>Rating: ⭐⭐⭐⭐⭐</strong>
          </p>
          <ul>
            <li>✅ AI-powered CV adaptation</li>
            <li>✅ ATS optimization built-in</li>
            <li>✅ 12 professional templates</li>
            <li>✅ 2-minute setup</li>
            <li>✅ Completely free to start</li>
          </ul>
          <p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-bold">
              Try My CV Buddy Free →
            </Link>
          </p>

          <h3>2. Canva CV Builder</h3>
          <p>
            <strong>Rating: ⭐⭐⭐⭐</strong>
          </p>
          <ul>
            <li>✅ Beautiful design templates</li>
            <li>✅ Easy drag-and-drop interface</li>
            <li>❌ Limited ATS optimization</li>
            <li>❌ Premium features behind paywall</li>
          </ul>

          <h3>3. Indeed CV Builder</h3>
          <p>
            <strong>Rating: ⭐⭐⭐</strong>
          </p>
          <ul>
            <li>✅ Integrated with job applications</li>
            <li>✅ Simple and straightforward</li>
            <li>❌ Basic templates only</li>
            <li>❌ No AI features</li>
          </ul>

          <h2>What to Look for in a Free CV Builder</h2>
          <ol>
            <li><strong>ATS Compatibility:</strong> Ensure your CV passes applicant tracking systems</li>
            <li><strong>Professional Templates:</strong> UK-appropriate designs</li>
            <li><strong>Easy Editing:</strong> Quick updates for different jobs</li>
            <li><strong>Export Options:</strong> PDF and Word formats</li>
            <li><strong>No Hidden Costs:</strong> Truly free features</li>
          </ol>

          <h2>Conclusion</h2>
          <p>
            For UK job seekers in 2025, <strong>My CV Buddy</strong> stands out as the best free CV builder
            thanks to its AI-powered optimization and ATS-friendly templates. Whether you're a recent graduate
            or an experienced professional, having the right CV builder can make all the difference.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Build Your CV?</h3>
            <p className="text-gray-700 mb-4">
              Create a professional, ATS-optimized CV in just 2 minutes with My CV Buddy.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
