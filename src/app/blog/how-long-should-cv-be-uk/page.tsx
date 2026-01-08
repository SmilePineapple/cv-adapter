import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Long Should a CV Be? UK Standards & Guidelines (2025)',
  description: 'Complete guide to CV length in the UK. Learn the ideal CV length for graduates, professionals, and executives. Expert advice for 2025 job market.',
  keywords: ['how long should a CV be', 'CV length UK', 'two page CV', 'CV pages', 'UK CV length', 'how many pages CV'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/how-long-should-cv-be-uk'
  },
  openGraph: {
    title: 'How Long Should a CV Be? UK Standards (2025)',
    description: 'Expert guide to CV length for UK job applications. Learn the ideal length for your experience level.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function HowLongShouldCVBe() {
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
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Long Should a CV Be? UK Standards (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Quick Answer Box */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Answer:</h3>
            <p className="text-lg text-gray-800 mb-0">
              <strong>In the UK, your CV should typically be 2 pages (A4).</strong> Graduates and entry-level candidates can use 1-2 pages, while senior professionals may extend to 3 pages if necessary. Academic CVs can be longer (3+ pages).
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Standard UK CV Length</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Unlike US resumes (which are strictly 1 page), UK CVs are generally <strong>2 pages long</strong>. This gives you enough space to detail your work experience, education, and skills without overwhelming recruiters.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">📊 Recruiter Statistics</p>
            <p className="text-blue-800">
              UK recruiters spend an average of <strong>6-8 seconds</strong> on initial CV screening. A concise, well-structured 2-page CV is optimal for this quick review process.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CV Length by Experience Level</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Graduate / Entry-Level (0-3 years experience)</h3>
              <p className="text-gray-700 mb-3"><strong>Recommended length: 1-2 pages</strong></p>
              <p className="text-gray-600 mb-3">
                If you're a recent graduate or have limited work experience, aim for 1 page. You can extend to 2 pages if you have relevant internships, projects, or university achievements to showcase.
              </p>
              <div className="bg-green-50 rounded p-4">
                <p className="text-green-900 font-semibold mb-2">✅ What to Include:</p>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Education (detailed - include modules, dissertation topic)</li>
                  <li>• Internships and work placements</li>
                  <li>• University projects and achievements</li>
                  <li>• Relevant coursework and skills</li>
                  <li>• Societies, volunteering, part-time work</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mid-Level Professional (3-10 years experience)</h3>
              <p className="text-gray-700 mb-3"><strong>Recommended length: 2 pages</strong></p>
              <p className="text-gray-600 mb-3">
                This is the sweet spot for most UK professionals. Two pages allow you to detail your career progression, key achievements, and relevant skills without being too verbose.
              </p>
              <div className="bg-blue-50 rounded p-4">
                <p className="text-blue-900 font-semibold mb-2">✅ What to Include:</p>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Last 3-4 roles in detail (with achievements)</li>
                  <li>• Earlier roles summarized briefly</li>
                  <li>• Key skills and certifications</li>
                  <li>• Education (brief - just degree and grade)</li>
                  <li>• Professional development</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Senior / Executive (10+ years experience)</h3>
              <p className="text-gray-700 mb-3"><strong>Recommended length: 2-3 pages</strong></p>
              <p className="text-gray-600 mb-3">
                Senior professionals can extend to 3 pages if necessary to showcase extensive leadership experience and strategic achievements. However, keep it concise - quality over quantity.
              </p>
              <div className="bg-purple-50 rounded p-4">
                <p className="text-purple-900 font-semibold mb-2">✅ What to Include:</p>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Executive summary highlighting leadership impact</li>
                  <li>• Last 5-6 roles with strategic achievements</li>
                  <li>• Board positions and advisory roles</li>
                  <li>• Key metrics and business outcomes</li>
                  <li>• Professional qualifications and memberships</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Academic / Research (PhD, Postdoc, Lecturer)</h3>
              <p className="text-gray-700 mb-3"><strong>Recommended length: 3-6 pages (or more)</strong></p>
              <p className="text-gray-600 mb-3">
                Academic CVs are the exception to the 2-page rule. They can be much longer as they need to include publications, research projects, grants, teaching experience, and conference presentations.
              </p>
              <div className="bg-orange-50 rounded p-4">
                <p className="text-orange-900 font-semibold mb-2">✅ What to Include:</p>
                <ul className="text-orange-800 space-y-1 text-sm">
                  <li>• Publications (full list with citations)</li>
                  <li>• Research projects and grants</li>
                  <li>• Teaching experience and supervision</li>
                  <li>• Conference presentations</li>
                  <li>• Academic qualifications (detailed)</li>
                  <li>• Professional memberships and editorial boards</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">When to Use 1 Page vs 2 Pages</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Use 1 Page If:
              </h3>
              <ul className="text-green-800 space-y-2 text-sm">
                <li>• You're a recent graduate (0-2 years experience)</li>
                <li>• You're changing careers with limited relevant experience</li>
                <li>• You're applying for entry-level positions</li>
                <li>• You have gaps in employment you want to minimize</li>
                <li>• The job posting specifically requests a 1-page CV</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Use 2 Pages If:
              </h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• You have 3+ years of relevant work experience</li>
                <li>• You have multiple roles to showcase</li>
                <li>• You have significant achievements to highlight</li>
                <li>• You're applying for mid-senior level positions</li>
                <li>• You have relevant certifications and training</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common CV Length Mistakes</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-900 font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Mistakes to Avoid:
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Padding to Reach 2 Pages</p>
                <p className="text-red-800 text-sm">Don't add irrelevant information just to fill space. A strong 1-page CV is better than a weak 2-page CV.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Going Over 2 Pages Unnecessarily</p>
                <p className="text-red-800 text-sm">Unless you're senior-level or academic, keep it to 2 pages. Recruiters won't read beyond that.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Including Every Job Since School</p>
                <p className="text-red-800 text-sm">Focus on the last 10-15 years. Earlier roles can be summarized or omitted unless highly relevant.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Using Tiny Fonts to Fit More</p>
                <p className="text-red-800 text-sm">Never go below 10pt font. Readability is more important than fitting everything in.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Excessive White Space</p>
                <p className="text-red-800 text-sm">Use space efficiently. Large margins and spacing waste valuable CV real estate.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Reduce CV Length</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If your CV is too long, try these strategies:
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Remove Older Roles</h3>
                  <p className="text-gray-600">Jobs from 15+ years ago can be summarized in one line or removed entirely unless highly relevant.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Cut Irrelevant Information</h3>
                  <p className="text-gray-600">Remove hobbies, references, and skills that aren't relevant to the target role.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Use Bullet Points</h3>
                  <p className="text-gray-600">Replace paragraphs with concise bullet points. Aim for 3-5 bullets per role.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Simplify Education</h3>
                  <p className="text-gray-600">If you have 5+ years experience, just list degree, institution, and grade. No need for modules or dissertation details.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Optimize Formatting</h3>
                  <p className="text-gray-600">Reduce margins slightly (2cm instead of 2.5cm), use 11pt font, and minimize white space.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">UK vs USA: CV Length Differences</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Aspect</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">UK CV</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">USA Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Length</td>
                  <td className="px-6 py-4 text-sm text-gray-700">2 pages (standard)</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1 page (strict)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Detail Level</td>
                  <td className="px-6 py-4 text-sm text-gray-700">More detailed</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Very concise</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Personal Info</td>
                  <td className="px-6 py-4 text-sm text-gray-700">May include nationality</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Name, contact only</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Photo</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Generally no</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Never</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Senior Level</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Can extend to 3 pages</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Still 1 page (2 max)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Does CV Length Affect ATS?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Good news:</strong> Applicant Tracking Systems (ATS) don't penalize longer CVs. They scan for keywords and relevant information regardless of length.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            However, <strong>human recruiters</strong> do care about length. A concise, well-structured 2-page CV is easier to scan and more likely to hold their attention than a rambling 4-page document.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">💡 Pro Tip</p>
            <p className="text-blue-800">
              Focus on <strong>quality over quantity</strong>. A targeted 2-page CV with relevant achievements will always outperform a generic 3-page CV with filler content.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Let AI Optimize Your CV Length</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Struggling to fit your experience into 2 pages? <strong>My CV Buddy</strong> uses AI to automatically optimize your CV length while keeping all relevant information.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Perfect CV Length, Every Time</h3>
            <p className="text-blue-100 mb-6">
              Our AI analyzes your experience and the job description to create a perfectly-sized CV that highlights what matters most. No more cutting important achievements or padding with fluff.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-block"
              >
                Upload Your CV
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Standard UK CV length is 2 pages</strong> for most professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Graduates can use 1-2 pages</strong> depending on experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Senior professionals may extend to 3 pages</strong> if necessary</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Academic CVs can be 3+ pages</strong> with full publication lists</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Quality beats quantity</strong> - focus on relevant achievements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Tailor your CV</strong> for each application to maximize impact</span>
              </li>
            </ul>
          </div>

          {/* Related Articles */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/cv-template-uk-2025" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Template UK: 10 Free Templates</h4>
                <p className="text-gray-600 text-sm">Professional CV templates for UK job applications</p>
              </Link>
              <Link href="/blog/cv-writing-tips" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Writing Tips & Best Practices</h4>
                <p className="text-gray-600 text-sm">Expert advice to create a winning CV</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
