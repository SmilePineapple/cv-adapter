import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Globe, Briefcase, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume vs CV: What\'s the Difference? | My CV Buddy',
  description: 'Understand the key differences between a resume and CV. Learn when to use each for US, UK, and international job applications.',
  keywords: ['resume vs cv', 'cv or resume', 'difference between cv and resume', 'resume for US jobs', 'cv for UK jobs'],
}

export default function ResumeVsCVPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/blog"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
            <Link 
              href="/"
              className="text-xl font-bold text-gray-900"
            >
              My CV Buddy
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Career Advice</span>
            <span>•</span>
            <span>October 21, 2025</span>
            <span>•</span>
            <span>7 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resume vs CV: What's the Difference?
          </h1>
          
          <p className="text-xl text-gray-600">
            Applying for jobs in the US vs UK? Understanding the difference between a resume and CV could make or break your application.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          
          {/* Quick Answer Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 not-prose">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Answer</h3>
            <p className="text-gray-700">
              <strong>Resume:</strong> 1-2 pages, used in the US, focuses on relevant experience<br/>
              <strong>CV:</strong> 2+ pages, used in UK/Europe, comprehensive career history
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Confusion is Real</h2>
          
          <p>
            You're applying for a job and the posting asks for a "CV." But you're in the US and only have a resume. 
            Can you send your resume? Or do you need to create something different?
          </p>

          <p>
            The terms "resume" and "CV" are often used interchangeably, but they're actually quite different depending 
            on where you're applying. Let's clear up the confusion once and for all.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What is a Resume?</h2>

          <div className="bg-white border rounded-lg p-6 mb-6 not-prose">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resume (US)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Length:</strong> 1-2 pages maximum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Content:</strong> Tailored to specific job</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Focus:</strong> Relevant experience only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Used in:</strong> United States, Canada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p>
            A <strong>resume</strong> is a concise, targeted document that highlights your most relevant qualifications 
            for a specific job. Think of it as your "greatest hits" - you only include the experience and skills that 
            matter for the role you're applying to.
          </p>

          <p>
            In the US, resumes are expected to be brief. Hiring managers spend an average of 6 seconds scanning each 
            resume, so you need to make every word count.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What is a CV?</h2>

          <div className="bg-white border rounded-lg p-6 mb-6 not-prose">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">CV (Curriculum Vitae)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Length:</strong> 2+ pages (no limit)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Content:</strong> Complete career history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Focus:</strong> All experience and achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Used in:</strong> UK, Europe, Asia, Australia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p>
            A <strong>CV</strong> (Curriculum Vitae, Latin for "course of life") is a comprehensive document that 
            includes your entire career history. It's longer, more detailed, and doesn't change much between applications.
          </p>

          <p>
            In the UK and most of Europe, "CV" is the standard term for what Americans call a resume. However, a UK CV 
            is typically longer and more detailed than a US resume.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Key Differences at a Glance</h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden not-prose">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Feature</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Resume (US)</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">CV (UK/Europe)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Length</td>
                  <td className="px-6 py-4 text-gray-700">1-2 pages</td>
                  <td className="px-6 py-4 text-gray-700">2+ pages</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Content</td>
                  <td className="px-6 py-4 text-gray-700">Tailored to job</td>
                  <td className="px-6 py-4 text-gray-700">Complete history</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Customization</td>
                  <td className="px-6 py-4 text-gray-700">Changes per job</td>
                  <td className="px-6 py-4 text-gray-700">Mostly static</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Photo</td>
                  <td className="px-6 py-4 text-gray-700">Never include</td>
                  <td className="px-6 py-4 text-gray-700">Sometimes expected</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Personal Info</td>
                  <td className="px-6 py-4 text-gray-700">Minimal</td>
                  <td className="px-6 py-4 text-gray-700">More detailed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">When to Use Each</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use a Resume When:</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying for jobs in the <strong>United States</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying for jobs in <strong>Canada</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>The job posting specifically asks for a <strong>"resume"</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying to <strong>private sector</strong> jobs</span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use a CV When:</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying for jobs in the <strong>UK, Europe, Asia, or Australia</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying for <strong>academic positions</strong> anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Applying for <strong>research positions</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>The job posting specifically asks for a <strong>"CV"</strong></span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">How to Convert Between Resume and CV</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CV → Resume (Moving to US)</h3>
          
          <p>If you have a UK CV and need a US resume:</p>

          <ol className="space-y-3 mb-6">
            <li><strong>Cut it down:</strong> Remove anything not directly relevant to the job</li>
            <li><strong>Remove personal info:</strong> No photo, date of birth, marital status</li>
            <li><strong>Tailor it:</strong> Customize for each application</li>
            <li><strong>Use action verbs:</strong> "Led," "Managed," "Increased"</li>
            <li><strong>Quantify achievements:</strong> Add numbers and percentages</li>
          </ol>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resume → CV (Moving to UK)</h3>
          
          <p>If you have a US resume and need a UK CV:</p>

          <ol className="space-y-3 mb-6">
            <li><strong>Expand it:</strong> Include all relevant experience</li>
            <li><strong>Add detail:</strong> More comprehensive job descriptions</li>
            <li><strong>Include education:</strong> All qualifications, not just recent</li>
            <li><strong>Add references:</strong> "References available upon request"</li>
            <li><strong>Consider a photo:</strong> Check if it's expected in that country</li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Common Mistakes to Avoid</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-600 rounded not-prose">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-1">Sending a 4-page CV to a US employer</p>
                <p className="text-gray-700 text-sm">US employers expect 1-2 pages max. They'll likely stop reading after page 1.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-600 rounded not-prose">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-1">Sending a 1-page resume to a UK employer</p>
                <p className="text-gray-700 text-sm">UK employers expect more detail. A 1-page document may look incomplete.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-600 rounded not-prose">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-1">Including a photo on a US resume</p>
                <p className="text-gray-700 text-sm">This is a major red flag in the US and can lead to immediate rejection.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-600 rounded not-prose">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-1">Using the wrong terminology</p>
                <p className="text-gray-700 text-sm">Don't say "CV" when applying in the US, or "resume" when applying in the UK.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Bottom Line</h2>

          <p>
            The difference between a resume and CV isn't just semantics - it's about understanding what employers in 
            different regions expect. Use the wrong format, and your application might be rejected before anyone even 
            reads it.
          </p>

          <p className="font-bold text-lg">
            Remember: Resume = US (short, tailored), CV = UK/Europe (long, comprehensive)
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Need Help Converting Your Resume or CV?</h2>

          <p>
            Whether you're moving from the US to UK or vice versa, our AI-powered tool can help you create the perfect 
            document for your target market.
          </p>

        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Create Your Perfect Resume or CV?</h3>
          <p className="mb-6 text-blue-100">
            Our AI tool automatically formats your document for US or UK standards. Get started in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/upload"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Create Resume (US)
            </Link>
            <Link 
              href="/upload"
              className="inline-flex items-center justify-center bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition border-2 border-white"
            >
              Create CV (UK)
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/blog/how-to-beat-ats-systems"
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">How to Beat ATS Systems</h4>
              <p className="text-gray-600 text-sm">Learn how to optimize your resume or CV for Applicant Tracking Systems.</p>
            </Link>
            <Link 
              href="/blog/cv-writing-tips"
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">CV Writing Tips & Best Practices</h4>
              <p className="text-gray-600 text-sm">Expert advice to create a winning CV that gets you interviews.</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
