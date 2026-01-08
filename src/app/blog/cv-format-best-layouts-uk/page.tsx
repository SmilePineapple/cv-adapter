import Link from 'next/link'
import { ArrowLeft, Layout, CheckCircle, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Format: Best Layouts for UK Jobs (2025 Guide)',
  description: 'Complete guide to CV formatting for UK job applications. Learn the best layouts, fonts, spacing, and design tips that impress recruiters and pass ATS.',
  keywords: ['CV format', 'CV layout', 'CV format UK', 'best CV format', 'CV formatting guide', 'professional CV format'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/cv-format-best-layouts-uk'
  },
  openGraph: {
    title: 'CV Format: Best Layouts for UK Jobs (2025)',
    description: 'Expert guide to CV formatting that gets you interviews.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function CVFormatGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            CV Formatting
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CV Format: Best Layouts for UK Jobs (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>14 min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <Layout className="w-6 h-6 text-blue-600 inline mr-2" />
              Your CV format can make or break your job application. A well-formatted CV is easy to scan, passes ATS systems, and makes a professional impression. This guide covers everything you need to know about CV formatting for UK jobs in 2025.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why CV Format Matters</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Recruiters spend an average of <strong>6-8 seconds</strong> on initial CV screening. A clean, professional format helps them quickly find the information they need. Poor formatting can get your CV rejected before anyone reads the content.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">📊 Research Shows</p>
            <p className="text-blue-800">
              <strong>75% of CVs are rejected</strong> due to poor formatting or ATS incompatibility, even when candidates are qualified for the role.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3 Main CV Format Types</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Reverse Chronological (Most Common)</h3>
              <p className="text-gray-700 mb-4">Lists work experience from most recent to oldest. <strong>Best for:</strong> Most professionals with consistent work history.</p>
              <div className="bg-green-50 rounded p-4">
                <p className="text-green-900 font-semibold mb-2">✅ Advantages:</p>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Most familiar to recruiters</li>
                  <li>• Shows clear career progression</li>
                  <li>• ATS-friendly</li>
                  <li>• Easy to scan quickly</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Skills-Based (Functional)</h3>
              <p className="text-gray-700 mb-4">Emphasizes skills over work history. <strong>Best for:</strong> Career changers, employment gaps, or varied experience.</p>
              <div className="bg-purple-50 rounded p-4">
                <p className="text-purple-900 font-semibold mb-2">⚠️ Use Carefully:</p>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Some recruiters are skeptical of this format</li>
                  <li>• Can be harder for ATS to parse</li>
                  <li>• May raise questions about work history</li>
                  <li>• Best combined with chronological elements</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Combination (Hybrid)</h3>
              <p className="text-gray-700 mb-4">Highlights skills at the top, followed by chronological work history. <strong>Best for:</strong> Senior professionals or career changers with relevant skills.</p>
              <div className="bg-orange-50 rounded p-4">
                <p className="text-orange-900 font-semibold mb-2">💡 Best of Both:</p>
                <ul className="text-orange-800 space-y-1 text-sm">
                  <li>• Showcases key skills immediately</li>
                  <li>• Maintains chronological work history</li>
                  <li>• Good for highlighting transferable skills</li>
                  <li>• Works well for senior roles</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Professional CV Layout Guidelines</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Typography & Fonts</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-3">✅ Professional Fonts:</p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li><strong>Traditional:</strong> Times New Roman, Georgia</li>
                  <li><strong>Modern:</strong> Arial, Calibri, Helvetica</li>
                  <li><strong>Contemporary:</strong> Lato, Roboto, Open Sans</li>
                  <li><strong>Creative:</strong> Garamond, Gill Sans (use sparingly)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">❌ Fonts to Avoid:</p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>Comic Sans (unprofessional)</li>
                  <li>Papyrus (outdated)</li>
                  <li>Brush Script (hard to read)</li>
                  <li>Decorative fonts (ATS can't read)</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 rounded p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-2">📏 Font Size Guidelines:</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• <strong>Name/Header:</strong> 18-24pt</li>
                <li>• <strong>Section Headings:</strong> 14-16pt (bold)</li>
                <li>• <strong>Body Text:</strong> 10-12pt</li>
                <li>• <strong>Minimum:</strong> Never go below 10pt</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Margins & Spacing</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-3">Margins:</p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li><strong>Standard:</strong> 2.5cm (1 inch) all sides</li>
                  <li><strong>Minimum:</strong> 2cm (0.8 inch)</li>
                  <li><strong>Maximum:</strong> 3cm (1.2 inch)</li>
                  <li>Keep consistent on all sides</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">Line Spacing:</p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li><strong>Body text:</strong> 1.15 or 1.5</li>
                  <li><strong>Between sections:</strong> 12-18pt</li>
                  <li><strong>Between bullets:</strong> 6-8pt</li>
                  <li>Use white space strategically</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Color Scheme</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <p className="text-gray-700 mb-4">Color can enhance your CV, but use it sparingly:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded p-4 border-l-4 border-gray-600">
                <p className="font-semibold text-gray-900 mb-2">Conservative</p>
                <p className="text-gray-700 text-sm mb-2">Finance, Law, Accounting</p>
                <p className="text-gray-600 text-xs">Black & grey only</p>
              </div>
              <div className="bg-blue-50 rounded p-4 border-l-4 border-blue-600">
                <p className="font-semibold text-gray-900 mb-2">Professional</p>
                <p className="text-gray-700 text-sm mb-2">Most corporate roles</p>
                <p className="text-gray-600 text-xs">One accent color (navy, teal, burgundy)</p>
              </div>
              <div className="bg-purple-50 rounded p-4 border-l-4 border-purple-600">
                <p className="font-semibold text-gray-900 mb-2">Creative</p>
                <p className="text-gray-700 text-sm mb-2">Design, Marketing, Media</p>
                <p className="text-gray-600 text-xs">Modern color palette acceptable</p>
              </div>
            </div>
            <div className="bg-red-50 rounded p-4 mt-4">
              <p className="text-red-900 font-semibold mb-2">❌ Color Mistakes:</p>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• Using multiple bright colors</li>
                <li>• Colored backgrounds (hard to print)</li>
                <li>• Low contrast text (hard to read)</li>
                <li>• Neon or fluorescent colors</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CV Layout Examples</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layout 1: Classic Professional</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <div className="bg-white rounded p-4 font-mono text-xs">
              <div className="text-center mb-4 pb-4 border-b-2 border-gray-300">
                <p className="text-lg font-bold">YOUR NAME</p>
                <p>Location | Phone | Email | LinkedIn</p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 border-b border-gray-300">PROFESSIONAL SUMMARY</p>
                <p className="text-xs">3-4 sentences about your experience and key achievements...</p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 border-b border-gray-300">WORK EXPERIENCE</p>
                <p className="font-semibold text-xs">Job Title | Company | Dates</p>
                <ul className="list-disc pl-4 text-xs">
                  <li>Achievement with quantified result</li>
                  <li>Another achievement with numbers</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 border-b border-gray-300">EDUCATION</p>
                <p className="text-xs">Degree | University | Year</p>
              </div>
              <div>
                <p className="font-bold text-sm mb-2 border-b border-gray-300">SKILLS</p>
                <p className="text-xs">Technical Skills: List here...</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-2">✅ Best For:</p>
              <p className="text-blue-800 text-sm">Traditional industries, mid-senior professionals, straightforward career paths</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layout 2: Modern Two-Column</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <div className="bg-white rounded p-4">
              <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                <div className="col-span-1 bg-gray-100 p-3">
                  <p className="font-bold text-sm mb-2">CONTACT</p>
                  <p className="text-xs mb-3">Phone<br/>Email<br/>LinkedIn</p>
                  
                  <p className="font-bold text-sm mb-2">SKILLS</p>
                  <p className="text-xs mb-3">• Skill 1<br/>• Skill 2<br/>• Skill 3</p>
                  
                  <p className="font-bold text-sm mb-2">EDUCATION</p>
                  <p className="text-xs">Degree<br/>University<br/>Year</p>
                </div>
                <div className="col-span-2 p-3">
                  <p className="text-lg font-bold mb-2">YOUR NAME</p>
                  <p className="text-xs mb-4">Professional title or summary...</p>
                  
                  <p className="font-bold text-sm mb-2">EXPERIENCE</p>
                  <p className="font-semibold text-xs">Job Title | Company</p>
                  <p className="text-xs mb-2">Dates</p>
                  <ul className="list-disc pl-4 text-xs">
                    <li>Achievement 1</li>
                    <li>Achievement 2</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded p-4 mt-4">
              <p className="text-purple-900 font-semibold mb-2">✅ Best For:</p>
              <p className="text-purple-800 text-sm">Tech, creative industries, professionals wanting modern look</p>
              <p className="text-purple-900 font-semibold mt-3 mb-2">⚠️ Caution:</p>
              <p className="text-purple-800 text-sm">Some ATS systems struggle with columns - test before sending</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layout 3: Skills-First Hybrid</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <div className="bg-white rounded p-4 font-mono text-xs">
              <div className="text-center mb-4 pb-4 border-b-2 border-gray-300">
                <p className="text-lg font-bold">YOUR NAME</p>
                <p>Professional Title</p>
                <p>Contact Information</p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 border-b border-gray-300">CORE COMPETENCIES</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>• Leadership & Management</div>
                  <div>• Strategic Planning</div>
                  <div>• Budget Management</div>
                  <div>• Stakeholder Engagement</div>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 border-b border-gray-300">PROFESSIONAL EXPERIENCE</p>
                <p className="font-semibold text-xs">Job Title | Company | Dates</p>
                <ul className="list-disc pl-4 text-xs">
                  <li>Achievement demonstrating core competencies</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 rounded p-4 mt-4">
              <p className="text-green-900 font-semibold mb-2">✅ Best For:</p>
              <p className="text-green-800 text-sm">Career changers, senior professionals, highlighting transferable skills</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">ATS-Friendly Formatting Rules</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-700 mb-4">92% of UK recruiters use ATS systems. Follow these rules to ensure your CV passes:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Use Standard Section Headings</p>
                  <p className="text-gray-600 text-sm">"Work Experience" not "Where I've Worked" - ATS looks for standard terms</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Avoid Tables, Text Boxes, Columns</p>
                  <p className="text-gray-600 text-sm">ATS can't read complex layouts - stick to simple formatting</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Don't Put Info in Headers/Footers</p>
                  <p className="text-gray-600 text-sm">ATS often ignores header/footer content</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Use Standard Bullet Points</p>
                  <p className="text-gray-600 text-sm">Simple bullets (•) work best - avoid fancy symbols</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Save as .docx or PDF</p>
                  <p className="text-gray-600 text-sm">Check job posting - most accept both, some prefer .docx</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Include Keywords from Job Description</p>
                  <p className="text-gray-600 text-sm">Use exact phrases from the posting throughout your CV</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common CV Formatting Mistakes</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Inconsistent Formatting</p>
              <p className="text-red-800 text-sm">Using different fonts, sizes, or bullet styles throughout - looks unprofessional</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Too Much Bold/Italics/Underline</p>
              <p className="text-red-800 text-sm">Overuse of formatting makes CV hard to read - use sparingly for emphasis</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Cramming Too Much Content</p>
              <p className="text-red-800 text-sm">Tiny fonts and narrow margins to fit everything - edit content instead</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Using Graphics or Images</p>
              <p className="text-red-800 text-sm">Charts, graphs, or icons look nice but ATS can't read them</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Inconsistent Date Formatting</p>
              <p className="text-red-800 text-sm">Pick one format (Month Year or MM/YYYY) and use it throughout</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CV Format Checklist</h2>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Before Sending Your CV:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Layout:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Clean, professional appearance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Consistent formatting throughout</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Adequate white space</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">2 pages maximum (UK standard)</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Technical:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">ATS-friendly (no tables/columns)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Saved as PDF or .docx</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">File name: FirstName_LastName_CV.pdf</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Test print to check appearance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Get Perfectly Formatted CVs with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Formatting a CV correctly can be time-consuming. <strong>My CV Buddy</strong> automatically formats your CV to professional standards while ensuring ATS compatibility.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered CV Formatting</h3>
            <p className="text-blue-100 mb-6">
              Upload your CV and our AI automatically applies professional formatting, optimizes for ATS systems, and ensures consistent styling throughout. Choose from multiple layout options designed for UK job applications.
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
                <span className="text-gray-700">Use <strong>reverse chronological format</strong> for most applications</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Choose <strong>professional fonts</strong> (Arial, Calibri, Times New Roman)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Keep <strong>consistent formatting</strong> throughout your CV</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Ensure <strong>ATS compatibility</strong> - avoid tables and columns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Use <strong>adequate white space</strong> for readability</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Stick to <strong>2 pages</strong> for UK CVs</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/cv-template-uk-2025" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Template UK: 10 Free Templates</h4>
                <p className="text-gray-600 text-sm">Professional CV templates with perfect formatting</p>
              </Link>
              <Link href="/blog/how-to-beat-ats-systems" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">How to Beat ATS Systems</h4>
                <p className="text-gray-600 text-sm">Complete guide to ATS optimization</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
