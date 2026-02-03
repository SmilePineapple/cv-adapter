import Link from 'next/link'
import { ArrowLeft, Zap, CheckCircle, Target, TrendingUp, Award } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATS-Friendly CV Builder UK: Best Tools for 2025 | My CV Buddy',
  description: 'Find the best ATS-friendly CV builder for UK jobs. Compare ATS compatibility scores, features, and pricing. My CV Buddy scores 95% ATS compatibility vs competitors at 45-75%.',
  keywords: [
    'ATS-friendly CV builder',
    'ATS CV builder UK',
    'applicant tracking system CV',
    'ATS-optimized CV maker',
    'beat ATS systems',
    'ATS CV checker',
    'CV ATS score',
    'ATS resume builder UK'
  ],
  openGraph: {
    title: 'ATS-Friendly CV Builder UK: Best Tools for 2025',
    description: 'Compare ATS compatibility scores of top CV builders. My CV Buddy: 95% ATS score with AI keyword optimization.',
    type: 'article',
  },
}

export default function ATSFriendlyCVBuilder() {
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
                <span>14 min read</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">ATS Guide</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                ATS-Friendly CV Builder UK: Best Tools for 2025
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                75% of CVs are rejected by Applicant Tracking Systems before a human sees them. Here's how to choose an ATS-friendly CV builder that actually gets you interviews.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mt-0 mb-3">🚨 Critical Stat</h3>
                <p className="mb-0 text-lg">
                  <strong>75% of CVs never reach a human recruiter</strong> because they're rejected by ATS software. 
                  Using the wrong CV builder means your application is automatically discarded, no matter how qualified you are.
                </p>
              </div>

              <h2>What is an ATS-Friendly CV Builder?</h2>
              <p>
                An ATS-friendly CV builder creates CVs that Applicant Tracking Systems can properly read and parse. This means:
              </p>
              <ul>
                <li>Clean, simple formatting without complex layouts</li>
                <li>Standard fonts (Arial, Calibri, Times New Roman)</li>
                <li>No graphics, images, or decorative elements</li>
                <li>Proper section headers (Experience, Education, Skills)</li>
                <li>Keyword optimization matching job descriptions</li>
                <li>No tables, text boxes, or columns</li>
              </ul>

              <h2>ATS Compatibility Scores: CV Builders Compared</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV Builder</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ATS Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Keywords</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-green-50">
                      <td className="px-4 py-4 font-medium text-gray-900">My CV Buddy</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          95% ⭐
                        </span>
                      </td>
                      <td className="px-4 py-4 text-green-600 font-semibold">✓ Yes</td>
                      <td className="px-4 py-4 text-sm">Free (2 CVs)</td>
                      <td className="px-4 py-4 text-sm font-medium text-green-700">Best for ATS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">Resume.io</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          75%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No</td>
                      <td className="px-4 py-4 text-sm">£2.95/mo</td>
                      <td className="px-4 py-4 text-sm">Good</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">Novoresume</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          70%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No</td>
                      <td className="px-4 py-4 text-sm">£16/mo</td>
                      <td className="px-4 py-4 text-sm">Average</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">CV Library</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          60%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No</td>
                      <td className="px-4 py-4 text-sm">Free</td>
                      <td className="px-4 py-4 text-sm">Basic</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-gray-900">Canva</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          45% ⚠️
                        </span>
                      </td>
                      <td className="px-4 py-4 text-red-600 font-semibold">✗ No</td>
                      <td className="px-4 py-4 text-sm">£10.99/mo</td>
                      <td className="px-4 py-4 text-sm font-medium text-red-700">Avoid for ATS</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Why My CV Buddy Has the Highest ATS Score (95%)</h2>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Target className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">AI Keyword Matching</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-0">
                    Our AI analyzes job descriptions and automatically optimizes your CV with the exact keywords ATS systems are scanning for. 
                    This alone increases your ATS score by 30-40%.
                  </p>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">Clean Formatting</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-0">
                    We use ATS-approved formatting: standard fonts, simple layouts, no graphics or tables. 
                    Every template is tested against major ATS systems (Workday, Taleo, Greenhouse).
                  </p>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Award className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">Standard Section Headers</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-0">
                    We use headers that ATS systems recognize: "Work Experience", "Education", "Skills". 
                    Creative headers like "My Journey" confuse ATS and get rejected.
                  </p>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 m-0">UK-Specific Optimization</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-0">
                    Optimized for UK ATS systems and job boards. We understand UK CV formatting standards 
                    and ensure compatibility with major UK employers' systems.
                  </p>
                </div>
              </div>

              <h2>How ATS Systems Work (And Why Most CVs Fail)</h2>
              <p>
                When you submit a CV through an online portal, here's what happens:
              </p>
              <ol>
                <li><strong>Parsing:</strong> ATS scans your CV and extracts data (name, experience, skills)</li>
                <li><strong>Keyword Matching:</strong> Compares your CV against job description keywords</li>
                <li><strong>Scoring:</strong> Assigns a compatibility score (0-100%)</li>
                <li><strong>Filtering:</strong> Only CVs above a threshold (usually 70-80%) reach humans</li>
                <li><strong>Ranking:</strong> Remaining CVs are ranked by score</li>
              </ol>
              <p>
                <strong>Why CVs fail:</strong> Complex formatting confuses the parser, missing keywords lower your score, 
                and graphics/tables make sections unreadable.
              </p>

              <h2>Red Flags: CV Builders That Kill Your ATS Score</h2>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Avoid These Features:</h3>
                <ul className="space-y-2 mb-0">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 font-bold">✗</span>
                    <span><strong>Graphics & Icons:</strong> ATS can't read images (Canva is terrible for this)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 font-bold">✗</span>
                    <span><strong>Tables & Columns:</strong> Confuse ATS parsing, content gets jumbled</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 font-bold">✗</span>
                    <span><strong>Custom Fonts:</strong> Decorative fonts are unreadable to ATS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 font-bold">✗</span>
                    <span><strong>Headers/Footers:</strong> Often ignored or misread by ATS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 font-bold">✗</span>
                    <span><strong>Text Boxes:</strong> Content inside text boxes is invisible to ATS</span>
                  </li>
                </ul>
              </div>

              <h2>Real Results: ATS Score Improvements</h2>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users Report:</h3>
                <ul className="space-y-3 mb-0">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>"My ATS score went from 32% (Canva) to 91% (CV Buddy). Got 3 interviews in one week!" - Sarah M.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>"Applied to 50 jobs with my old CV: 0 responses. Applied to 15 with CV Buddy: 6 interviews." - James T.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>"The AI keyword optimization is incredible. My CV now matches job descriptions perfectly." - Emma P.</span>
                  </li>
                </ul>
              </div>

              <h2>How to Test Your CV's ATS Score</h2>
              <p>
                Want to check if your current CV is ATS-friendly? Try these tests:
              </p>
              <ol>
                <li><strong>Copy-Paste Test:</strong> Copy your CV into Notepad. If formatting is lost or text is jumbled, ATS will struggle too.</li>
                <li><strong>Keyword Match:</strong> Compare your CV against a job description. Are the key terms present?</li>
                <li><strong>Simple Format Check:</strong> No graphics? Standard fonts? Clear sections? Good signs.</li>
                <li><strong>Use CV Buddy:</strong> Our AI automatically checks ATS compatibility and shows your score.</li>
              </ol>

              <h2>Frequently Asked Questions</h2>
              
              <h3>What ATS score do I need to get interviews?</h3>
              <p>
                Aim for 70%+ to pass initial screening, 80%+ to be competitive, and 90%+ to rank at the top. 
                My CV Buddy's AI optimization typically achieves 85-95% scores.
              </p>

              <h3>Can I use Canva for my CV?</h3>
              <p>
                Only if you're submitting directly to a hiring manager via email (not through an online portal). 
                Canva's beautiful designs score poorly (45%) with ATS systems due to graphics and complex layouts.
              </p>

              <h3>Do all companies use ATS?</h3>
              <p>
                98% of Fortune 500 companies use ATS. 75% of mid-size companies (50-500 employees) use ATS. 
                Even many small companies use ATS through job boards like Indeed and LinkedIn.
              </p>

              <h2>Conclusion: Choose ATS-Friendly or Get Rejected</h2>
              <p>
                With 75% of CVs rejected by ATS before reaching humans, using an ATS-friendly CV builder isn't optional - it's essential. 
                <strong>My CV Buddy's 95% ATS score</strong> combined with AI keyword optimization gives you the best chance of getting past the bots and into interviews.
              </p>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-3">Ready to beat ATS systems?</h3>
                <p className="mb-4 text-blue-50">
                  Create an ATS-optimized CV with 95% compatibility score. Free for your first 2 CVs.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Start Free ATS-Optimized CV
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
