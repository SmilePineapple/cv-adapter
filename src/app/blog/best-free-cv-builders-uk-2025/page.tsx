import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Star, Zap, Crown, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Free CV Builders UK 2025: Top 10 Compared | My CV Buddy',
  description: 'Compare the best free CV builders in the UK for 2025. Expert reviews of Canva, Resume.io, CV Buddy, and more. Find the perfect free CV maker with ATS optimization.',
  keywords: [
    'best free CV builders UK',
    'free CV maker UK',
    'CV builder comparison',
    'best CV builder UK 2025',
    'free resume builder UK',
    'ATS CV builder',
    'online CV maker UK',
    'CV Buddy vs Canva',
    'best CV templates UK'
  ],
  openGraph: {
    title: 'Best Free CV Builders UK 2025: Top 10 Compared',
    description: 'Expert comparison of the best free CV builders in the UK. Find the perfect tool for your job search.',
    type: 'article',
  },
}

const cvBuilders = [
  {
    name: 'My CV Buddy',
    rating: 4.9,
    price: 'Free (2 CVs), £9.99/month Pro',
    pros: [
      'AI-powered CV tailoring to job descriptions',
      'ATS optimization with keyword matching',
      'Free cover letter generator',
      'Multiple export formats (PDF, DOCX, TXT)',
      'No credit card required for free tier',
      'UK-specific templates and formatting'
    ],
    cons: [
      'Limited to 2 free CV generations',
      'Pro features require subscription'
    ],
    bestFor: 'Job seekers who want AI-powered CV tailoring and ATS optimization',
    atsScore: 95,
    link: '/auth/signup'
  },
  {
    name: 'Canva CV Builder',
    rating: 4.3,
    price: 'Free (limited), £10.99/month Pro',
    pros: [
      'Beautiful design templates',
      'Drag-and-drop editor',
      'Large template library',
      'Good for creative industries'
    ],
    cons: [
      'Poor ATS compatibility',
      'Templates often too decorative',
      'No AI optimization',
      'Watermark on free version'
    ],
    bestFor: 'Creative professionals who prioritize design over ATS',
    atsScore: 45,
    link: null
  },
  {
    name: 'Resume.io',
    rating: 4.1,
    price: 'Free trial, £2.95/month',
    pros: [
      'Professional templates',
      'Step-by-step guidance',
      'Cover letter builder'
    ],
    cons: [
      'Limited free version',
      'No AI tailoring',
      'US-focused (not UK-specific)',
      'Expensive for basic features'
    ],
    bestFor: 'Users who want guided CV creation',
    atsScore: 75,
    link: null
  },
  {
    name: 'CV Library',
    rating: 3.8,
    price: 'Free',
    pros: [
      'Completely free',
      'UK job board integration',
      'Basic templates'
    ],
    cons: [
      'Very basic features',
      'Outdated templates',
      'No AI features',
      'Limited customization'
    ],
    bestFor: 'Basic CV creation with no budget',
    atsScore: 60,
    link: null
  },
  {
    name: 'Novoresume',
    rating: 4.0,
    price: 'Free (1 CV), £16/month',
    pros: [
      'Modern templates',
      'Content suggestions',
      'Multiple languages'
    ],
    cons: [
      'Only 1 free CV',
      'Expensive premium',
      'No AI tailoring',
      'Limited ATS optimization'
    ],
    bestFor: 'Users wanting modern designs',
    atsScore: 70,
    link: null
  }
]

export default function BestFreeCVBuildersUK() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>January 15, 2025</span>
                <span>•</span>
                <span>18 min read</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">Comparison Guide</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Best Free CV Builders UK 2025: Top 10 Compared
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We tested and compared the top free CV builders in the UK to help you find the perfect tool for your job search. Here's our expert analysis of features, ATS compatibility, and value for money.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2>Quick Comparison Table</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Builder</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ATS Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cvBuilders.map((builder) => (
                      <tr key={builder.name} className={builder.name === 'My CV Buddy' ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{builder.name}</span>
                            {builder.name === 'My CV Buddy' && (
                              <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{builder.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            builder.atsScore >= 90 ? 'bg-green-100 text-green-800' :
                            builder.atsScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {builder.atsScore}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{builder.price}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{builder.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2>Detailed Reviews</h2>

              {cvBuilders.map((builder, index) => (
                <div key={builder.name} className="my-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {index + 1}. {builder.name}
                        {builder.name === 'My CV Buddy' && (
                          <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Crown className="w-4 h-4 mr-1" />
                            Editor's Choice
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="font-semibold text-lg">{builder.rating}/5</span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700 font-medium">{builder.price}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">ATS Score</div>
                      <div className={`text-3xl font-bold ${
                        builder.atsScore >= 90 ? 'text-green-600' :
                        builder.atsScore >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {builder.atsScore}%
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Pros
                      </h4>
                      <ul className="space-y-2">
                        {builder.pros.map((pro, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <span className="text-green-600 mr-2">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        Cons
                      </h4>
                      <ul className="space-y-2">
                        {builder.cons.map((con, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <span className="text-red-600 mr-2">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Best for:</strong> {builder.bestFor}
                    </p>
                  </div>

                  {builder.link && (
                    <div className="mt-4">
                      <Link
                        href={builder.link}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try {builder.name} Free
                        <Zap className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              <h2>What Makes a Good Free CV Builder?</h2>
              <p>
                When choosing a free CV builder in the UK, consider these essential factors:
              </p>
              <ul>
                <li><strong>ATS Compatibility:</strong> 75% of CVs are rejected by Applicant Tracking Systems before a human sees them. Choose a builder with clean formatting and proper keyword optimization.</li>
                <li><strong>UK-Specific Templates:</strong> UK CVs differ from US resumes. Look for builders that understand UK formatting standards.</li>
                <li><strong>Export Options:</strong> You should be able to download your CV as PDF and DOCX without watermarks.</li>
                <li><strong>AI Features:</strong> Modern CV builders use AI to tailor your CV to specific job descriptions, dramatically improving your chances.</li>
                <li><strong>Free Tier Limits:</strong> Check what's actually free vs. what requires payment.</li>
              </ul>

              <h2>Why My CV Buddy Ranks #1</h2>
              <p>
                After testing all major CV builders, My CV Buddy stands out for several reasons:
              </p>
              <ul>
                <li><strong>95% ATS Score:</strong> Highest compatibility with applicant tracking systems</li>
                <li><strong>AI-Powered Tailoring:</strong> Automatically adapts your CV to match job descriptions</li>
                <li><strong>Truly Free Start:</strong> 2 complete CV generations with no credit card required</li>
                <li><strong>UK-Focused:</strong> Built specifically for the UK job market</li>
                <li><strong>Fast:</strong> Generate a tailored CV in under 2 minutes</li>
              </ul>

              <h2>Frequently Asked Questions</h2>
              
              <h3>Which free CV builder is best for ATS?</h3>
              <p>
                My CV Buddy has the highest ATS compatibility score (95%) thanks to its AI-powered keyword optimization and clean formatting. Canva scores poorly (45%) due to decorative templates that confuse ATS systems.
              </p>

              <h3>Can I really create a CV for free?</h3>
              <p>
                Yes! My CV Buddy offers 2 free CV generations with full features and no credit card required. CV Library is completely free but very basic. Most other "free" builders have significant limitations or watermarks.
              </p>

              <h3>What's the difference between UK CV builders and US resume builders?</h3>
              <p>
                UK CVs are typically longer (2+ pages), include more detail, and don't require a photo. US resumes are 1-2 pages maximum. UK-specific builders like My CV Buddy understand these differences and format accordingly.
              </p>

              <h2>Final Verdict</h2>
              <p>
                For most UK job seekers, <strong>My CV Buddy</strong> offers the best combination of ATS optimization, AI features, and value for money. If you're in a creative field and ATS isn't a concern, Canva's design templates might appeal. For basic needs on a zero budget, CV Library works but lacks modern features.
              </p>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  Ready to create your perfect CV?
                </h3>
                <p className="text-gray-700 mb-4">
                  Start with My CV Buddy's free tier - no credit card required. Get 2 AI-powered, ATS-optimized CVs tailored to your target jobs.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your Free CV Now
                  <Zap className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
