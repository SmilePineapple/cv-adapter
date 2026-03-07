import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, XCircle, AlertTriangle, Target, Zap, FileText, Search, Award, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ATS Optimization Guide 2026: Beat Applicant Tracking Systems | My CV Buddy',
  description: 'Complete guide to optimizing your CV for ATS systems. Learn how to beat applicant tracking systems, pass ATS scans, and get your CV seen by recruiters. Includes ATS-friendly formatting tips and keyword strategies.',
  keywords: [
    'ATS optimization',
    'ATS friendly CV',
    'beat ATS systems',
    'applicant tracking system',
    'ATS CV checker',
    'ATS resume optimization',
    'pass ATS scan',
    'ATS keywords',
    'ATS formatting',
    'ATS compatible CV',
    'how to beat ATS',
    'ATS optimization tips',
    'ATS CV format',
    'ATS software',
    'resume ATS optimization'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/ats-optimization-guide',
  },
  openGraph: {
    title: 'ATS Optimization Guide 2026: Beat Applicant Tracking Systems',
    description: 'Master ATS optimization and get your CV past applicant tracking systems. Complete guide with formatting tips and keyword strategies.',
    url: 'https://www.mycvbuddy.com/ats-optimization-guide',
    type: 'article',
  },
}

export default function ATSOptimizationGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">CV</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">CV Adapter</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/auth/login" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span>75% of CVs Rejected by ATS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              ATS Optimization Guide 2026
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Master the art of beating Applicant Tracking Systems. Learn how to format your CV, choose the right keywords, and get past the robots to reach human recruiters.
            </p>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg inline-flex items-center">
              Optimize My CV for ATS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">75%</div>
              <div className="text-sm sm:text-base text-gray-600">CVs Rejected by ATS</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm sm:text-base text-gray-600">Fortune 500 Use ATS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-sm sm:text-base text-gray-600">Higher Interview Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            
            {/* What is ATS */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What is an ATS?</h2>
              <p className="text-gray-700 text-lg mb-4">
                An Applicant Tracking System (ATS) is software that automates the hiring process by scanning, parsing, and ranking CVs before they reach human recruiters. In 2026, over 98% of Fortune 500 companies and 66% of large organizations use ATS to filter applications.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <p className="text-blue-900 font-semibold mb-2">💡 Key Insight:</p>
                <p className="text-blue-800 mb-0">Your CV needs to be optimized for BOTH robots (ATS) and humans (recruiters). A CV that passes ATS but looks terrible to humans won't get you interviews.</p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How ATS Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-900">Parsing</p>
                    <p className="text-gray-700">ATS extracts information from your CV (name, contact, experience, education, skills)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-900">Keyword Matching</p>
                    <p className="text-gray-700">Compares your CV against job description keywords and required qualifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Scoring & Ranking</p>
                    <p className="text-gray-700">Assigns a match score (0-100%) and ranks candidates accordingly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <p className="font-semibold text-gray-900">Filtering</p>
                    <p className="text-gray-700">Only top-scoring CVs (typically 75%+ match) reach human recruiters</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ATS-Friendly Formatting */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">ATS-Friendly Formatting Rules</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-green-900">DO THIS</h3>
                  </div>
                  <ul className="space-y-2 text-green-800">
                    <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
                    <li>• Stick to 10-12pt font size</li>
                    <li>• Use standard section headings</li>
                    <li>• Save as .docx or PDF</li>
                    <li>• Use simple bullet points</li>
                    <li>• Include phone number and email</li>
                    <li>• Use reverse chronological order</li>
                    <li>• Spell out acronyms first time</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <h3 className="font-bold text-red-900">AVOID THIS</h3>
                  </div>
                  <ul className="space-y-2 text-red-800">
                    <li>• Tables and text boxes</li>
                    <li>• Headers and footers</li>
                    <li>• Images, logos, or graphics</li>
                    <li>• Fancy fonts or colors</li>
                    <li>• Columns (use single column)</li>
                    <li>• Special characters (★, ●, ►)</li>
                    <li>• Creative section names</li>
                    <li>• Embedded charts or graphs</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Warning:</p>
                <p className="text-yellow-700 mb-0">Even if your CV looks beautiful with graphics and tables, if the ATS can't parse it, you'll be automatically rejected. Simplicity wins.</p>
              </div>
            </section>

            {/* Keyword Optimization */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Keyword Optimization Strategy</h2>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Extract Keywords from Job Description</h3>
              <p className="text-gray-700 text-lg mb-4">
                Read the job posting carefully and identify:
              </p>
              <ul className="space-y-2 text-gray-700 text-lg mb-6">
                <li><strong>Hard Skills:</strong> Software, tools, certifications (e.g., "Python", "Google Analytics", "PMP")</li>
                <li><strong>Soft Skills:</strong> Leadership, communication, problem-solving</li>
                <li><strong>Required Qualifications:</strong> Degree level, years of experience, licenses</li>
                <li><strong>Industry Terms:</strong> Specific jargon or methodologies (e.g., "Agile", "GDPR compliance")</li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="font-semibold text-gray-900 mb-3">Example Job Description Analysis:</p>
                <p className="text-sm text-gray-600 mb-3 italic">"Seeking Digital Marketing Manager with 5+ years experience in SEO, Google Ads, and social media marketing. Must have Google Analytics certification and proven track record of increasing organic traffic."</p>
                <p className="font-semibold text-gray-900 mb-2">Keywords to Include:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Digital Marketing Manager</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">SEO</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google Ads</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Social Media Marketing</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google Analytics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Organic Traffic</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Mirror the Language</h3>
              <p className="text-gray-700 text-lg mb-4">
                Use the EXACT same phrases from the job description. If they say "project management", don't say "managing projects". ATS looks for exact matches.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">❌ Wrong:</p>
                  <p className="text-red-800 text-sm">"Managed social media accounts and created content"</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ Correct:</p>
                  <p className="text-green-800 text-sm">"Social media marketing experience including content creation and community management"</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Strategic Keyword Placement</h3>
              <p className="text-gray-700 text-lg mb-4">
                Place keywords in these high-impact sections:
              </p>
              <ol className="space-y-3 text-gray-700 text-lg">
                <li><strong>1. Personal Statement</strong> - Include 3-5 key skills and job title</li>
                <li><strong>2. Skills Section</strong> - List all relevant technical and soft skills</li>
                <li><strong>3. Work Experience</strong> - Weave keywords naturally into bullet points</li>
                <li><strong>4. Job Titles</strong> - Match your previous titles to target role when accurate</li>
              </ol>
            </section>

            {/* Section Headings */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Standard Section Headings</h2>
              <p className="text-gray-700 text-lg mb-4">
                ATS software is trained to recognize standard section headings. Use these exact headings:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">✅ ATS-Friendly:</p>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Work Experience</li>
                    <li>• Professional Experience</li>
                    <li>• Education</li>
                    <li>• Skills</li>
                    <li>• Certifications</li>
                    <li>• Professional Summary</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">❌ Avoid:</p>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• My Journey</li>
                    <li>• Where I've Been</li>
                    <li>• What I Know</li>
                    <li>• My Toolkit</li>
                    <li>• Credentials</li>
                    <li>• About Me</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* File Format */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">File Format Best Practices</h2>
              
              <div className="space-y-4">
                <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Best: .docx (Microsoft Word)
                  </h3>
                  <p className="text-gray-700">Most ATS systems prefer .docx format. It's easily parsed and maintains formatting.</p>
                </div>

                <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    Good: .pdf
                  </h3>
                  <p className="text-gray-700">PDF works with most modern ATS systems. Ensure it's a text-based PDF, not a scanned image.</p>
                </div>

                <div className="bg-white border-2 border-red-200 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    Avoid: .jpg, .png, .pages
                  </h3>
                  <p className="text-gray-700">Image files and Mac-specific formats often can't be parsed by ATS.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-6">
                <p className="text-blue-900 font-semibold mb-2">💡 Pro Tip:</p>
                <p className="text-blue-800 mb-0">Save your CV as "FirstName_LastName_CV.docx" - this makes it easy for recruiters to find and shows professionalism.</p>
              </div>
            </section>

            {/* Common ATS Mistakes */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7 Common ATS Mistakes That Kill Your Application</h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">1. Using Tables for Layout</h3>
                  <p className="text-red-800">ATS often can't read tables correctly, jumbling your information or missing it entirely.</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">2. Putting Important Info in Headers/Footers</h3>
                  <p className="text-red-800">Most ATS systems ignore headers and footers. Keep contact info in the main body.</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">3. Using Uncommon Abbreviations</h3>
                  <p className="text-red-800">Spell out acronyms the first time: "Search Engine Optimization (SEO)" not just "SEO".</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">4. Keyword Stuffing</h3>
                  <p className="text-red-800">Don't list keywords 20 times or hide white text. ATS and humans both detect this.</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">5. Using Images for Text</h3>
                  <p className="text-red-800">ATS can't read text in images. All content must be actual text.</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">6. Inconsistent Date Formatting</h3>
                  <p className="text-red-800">Use consistent format throughout: "January 2020 - Present" not mixing "Jan 2020" and "01/2020".</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-red-900 mb-2">7. Missing Contact Information</h3>
                  <p className="text-red-800">Always include phone number, email, and location (city). LinkedIn is optional but recommended.</p>
                </div>
              </div>
            </section>

            {/* Testing Your CV */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Test Your CV for ATS Compatibility</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Method 1: Plain Text Test</h3>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Copy all text from your CV</li>
                    <li>2. Paste into Notepad (Windows) or TextEdit (Mac)</li>
                    <li>3. Check if information is readable and in correct order</li>
                    <li>4. If it's jumbled or missing sections, your formatting needs work</li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Method 2: Use Our ATS Checker</h3>
                  <p className="text-gray-700 mb-4">Upload your CV to CV Adapter for instant ATS compatibility analysis:</p>
                  <Link href="/auth/signup" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center">
                    Check My CV for ATS
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Method 3: Keyword Match Test</h3>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Highlight all keywords from the job description</li>
                    <li>2. Search for each keyword in your CV (Ctrl+F)</li>
                    <li>3. Aim for 70-80% keyword match</li>
                    <li>4. Add missing keywords naturally where relevant</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* ATS Checklist */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Final ATS Optimization Checklist</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Used standard fonts (Arial, Calibri, Times New Roman)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Saved as .docx or PDF (not image file)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No tables, text boxes, headers, or footers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Standard section headings (Work Experience, Education, Skills)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Keywords from job description included naturally</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Acronyms spelled out on first use</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Contact information in main body (not header)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Consistent date formatting throughout</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Passed plain text test (readable in Notepad)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">70-80% keyword match with job description</span>
                  </li>
                </ul>
              </div>
            </section>

          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Optimize Your CV for ATS in 2 Minutes
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our AI-powered CV builder automatically formats your CV for ATS compatibility while keeping it beautiful for human recruiters.
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold text-lg inline-flex items-center">
            Start Building ATS-Friendly CV
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/cv-writing-guide" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">CV Writing Guide</h3>
              <p className="text-gray-600 mb-4">Complete guide to writing a professional CV.</p>
              <span className="text-blue-600 font-semibold">Read Guide →</span>
            </Link>
            <Link href="/cv-examples" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">CV Examples</h3>
              <p className="text-gray-600 mb-4">15+ industry-specific CV examples.</p>
              <span className="text-blue-600 font-semibold">View Examples →</span>
            </Link>
            <Link href="/templates" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Zap className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ATS Templates</h3>
              <p className="text-gray-600 mb-4">Pre-optimized ATS-friendly templates.</p>
              <span className="text-blue-600 font-semibold">Get Templates →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">CV Adapter</h3>
              <p className="text-sm">AI-powered CV builder with built-in ATS optimization.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/upload" className="hover:text-white">Upload CV</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/subscription" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cv-writing-guide" className="hover:text-white">CV Writing Guide</Link></li>
                <li><Link href="/ats-optimization-guide" className="hover:text-white">ATS Guide</Link></li>
                <li><Link href="/cv-examples" className="hover:text-white">CV Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CV Adapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
