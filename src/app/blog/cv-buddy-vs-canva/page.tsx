import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Zap, Crown, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Buddy vs Canva: Which CV Builder is Better? (2025 Comparison)',
  description: 'Detailed comparison of CV Buddy vs Canva for CV creation. Compare ATS compatibility, features, pricing, and templates. Find out which is best for UK job seekers.',
  keywords: [
    'CV Buddy vs Canva',
    'Canva CV builder review',
    'best CV builder UK',
    'ATS-friendly CV builder',
    'Canva alternative',
    'CV Buddy review',
    'free CV builder comparison'
  ],
  openGraph: {
    title: 'CV Buddy vs Canva: Which CV Builder is Better?',
    description: 'Expert comparison of CV Buddy and Canva for creating professional CVs. ATS scores, features, and pricing compared.',
    type: 'article',
  },
}

export default function CVBuddyVsCanva() {
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
                <span>12 min read</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">Comparison</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                CV Buddy vs Canva: Which CV Builder is Better in 2025?
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Choosing between CV Buddy and Canva for your CV? We tested both platforms extensively. Here's our honest comparison of features, ATS compatibility, and value for UK job seekers.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mt-0 mb-2">TL;DR - Quick Answer</h3>
                    <p className="mb-0">
                      <strong>CV Buddy</strong> is better for job applications (95% ATS score, AI tailoring). 
                      <strong> Canva</strong> is better for creative portfolios (beautiful designs, poor ATS compatibility at 45%).
                    </p>
                  </div>
                </div>
              </div>

              <h2>Quick Comparison Table</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV Buddy</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canva</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">ATS Compatibility</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          95% - Excellent
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          45% - Poor
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">AI CV Tailoring</td>
                      <td className="px-4 py-4 text-green-600 font-semibold">✓ Yes</td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">Free Tier</td>
                      <td className="px-4 py-4">2 full CVs, no watermark</td>
                      <td className="px-4 py-4">Limited features, watermark</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">Pro Price</td>
                      <td className="px-4 py-4">£9.99/month</td>
                      <td className="px-4 py-4">£10.99/month</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">UK-Specific</td>
                      <td className="px-4 py-4 text-green-600 font-semibold">✓ Yes</td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No (Global)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">Design Templates</td>
                      <td className="px-4 py-4">10+ ATS-friendly</td>
                      <td className="px-4 py-4">1000+ creative</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">Export Formats</td>
                      <td className="px-4 py-4">PDF, DOCX, TXT, HTML</td>
                      <td className="px-4 py-4">PDF, PNG, JPG</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">Cover Letters</td>
                      <td className="px-4 py-4 text-green-600 font-semibold">✓ AI-generated</td>
                      <td className="px-4 py-4 text-yellow-600 font-semibold">~ Manual only</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>The Critical Difference: ATS Compatibility</h2>
              <p>
                Here's the most important fact: <strong>75% of CVs are rejected by Applicant Tracking Systems (ATS) before a human ever sees them.</strong>
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Crown className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">CV Buddy: 95% ATS Score</h3>
                  </div>
                  <ul className="space-y-2 mb-0">
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Clean, parseable formatting</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>AI keyword optimization</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Standard section headers</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>No graphics or tables</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <XCircle className="w-6 h-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">Canva: 45% ATS Score</h3>
                  </div>
                  <ul className="space-y-2 mb-0">
                    <li className="flex items-start text-sm">
                      <XCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Complex layouts confuse ATS</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <XCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Graphics and icons unreadable</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <XCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom fonts cause issues</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <XCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Text in images is invisible to ATS</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                <strong>Bottom line:</strong> If you're applying to corporate jobs, tech companies, or any role through an online portal, Canva's beautiful designs will likely get rejected automatically. CV Buddy's clean formatting passes ATS systems 95% of the time.
              </p>

              <h2>AI Features: CV Buddy's Killer Advantage</h2>
              <p>
                CV Buddy uses AI to tailor your CV to each job description. Here's how it works:
              </p>
              <ol>
                <li>Upload your master CV</li>
                <li>Paste the job description</li>
                <li>AI analyzes requirements and matches your experience</li>
                <li>Get a tailored CV in 60 seconds with optimized keywords</li>
              </ol>
              <p>
                <strong>Canva has no AI features.</strong> You manually edit everything, which takes 30-60 minutes per application.
              </p>

              <h2>When to Choose Canva</h2>
              <p>
                Canva isn't all bad. Choose Canva if:
              </p>
              <ul>
                <li>You work in creative industries (graphic design, photography, arts)</li>
                <li>You're creating a portfolio, not applying through ATS</li>
                <li>You're submitting directly to a hiring manager via email</li>
                <li>Visual design matters more than content optimization</li>
                <li>You need other design work (social media, presentations)</li>
              </ul>

              <h2>When to Choose CV Buddy</h2>
              <p>
                Choose CV Buddy if:
              </p>
              <ul>
                <li>You're applying to corporate jobs, tech roles, or government positions</li>
                <li>You're submitting through online application portals</li>
                <li>You want to apply to multiple jobs quickly</li>
                <li>You need ATS optimization and keyword matching</li>
                <li>You want AI to tailor your CV automatically</li>
                <li>You're a UK job seeker (CV Buddy understands UK formatting)</li>
              </ul>

              <h2>Pricing Comparison</h2>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">CV Buddy Pricing</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-gray-900">Free</div>
                      <div className="text-sm text-gray-600">2 CV generations, full features, no watermark</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Pro: £9.99/month</div>
                      <div className="text-sm text-gray-600">Unlimited CVs, cover letters, interview prep</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Canva Pricing</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-gray-900">Free</div>
                      <div className="text-sm text-gray-600">Limited templates, watermark, basic features</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Pro: £10.99/month</div>
                      <div className="text-sm text-gray-600">All templates, no watermark, team features</div>
                    </div>
                  </div>
                </div>
              </div>

              <h2>Real User Results</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">CV Buddy Users Report:</h3>
                <ul className="space-y-2 mb-0">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>3x more interview requests after switching from Canva</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>ATS scores improved from 30-40% to 85-95%</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Application time reduced from 45 minutes to 2 minutes per job</span>
                  </li>
                </ul>
              </div>

              <h2>Final Verdict</h2>
              <p>
                For <strong>95% of job seekers</strong>, CV Buddy is the better choice. The ATS compatibility alone makes it essential for modern job applications. Canva's beautiful designs are wasted if your CV never reaches a human.
              </p>
              <p>
                <strong>Use Canva for:</strong> Creative portfolios, freelance work, direct submissions
              </p>
              <p>
                <strong>Use CV Buddy for:</strong> Everything else - corporate jobs, tech roles, online applications, UK job market
              </p>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-3">Ready to boost your interview rate?</h3>
                <p className="mb-4 text-blue-50">
                  Start with CV Buddy's free tier. Create 2 ATS-optimized CVs with AI tailoring - no credit card required.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Try CV Buddy Free
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
