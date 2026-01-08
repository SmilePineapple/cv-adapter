import Link from 'next/link'
import { ArrowLeft, List, CheckCircle, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What to Put on a CV: Complete Guide for UK Jobs (2025)',
  description: 'Comprehensive guide to what you should (and shouldn\'t) include on your CV. Learn exactly what to put on a CV for UK job applications with examples.',
  keywords: ['what to put on a CV', 'what to include on CV', 'CV content guide', 'what goes on a CV', 'CV sections UK'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/what-to-put-on-cv-complete-guide'
  },
  openGraph: {
    title: 'What to Put on a CV: Complete Guide (2025)',
    description: 'Expert guide to CV content - what to include and what to leave out.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function WhatToPutOnCVGuide() {
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
          <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Content
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What to Put on a CV: Complete Guide for UK Jobs (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>16 min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-l-4 border-emerald-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <List className="w-6 h-6 text-emerald-600 inline mr-2" />
              Knowing what to put on your CV (and what to leave out) is crucial for landing interviews. This comprehensive guide covers every section of a UK CV with examples, so you can create a winning application.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Essential CV Sections (Must Include)</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Contact Information</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
            <p className="text-gray-700 mb-4"><strong>What to Include:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Full Name</strong> - Use your professional name (larger font, bold)</li>
              <li><strong>Phone Number</strong> - UK mobile format: 07XXX XXXXXX</li>
              <li><strong>Email Address</strong> - Professional: firstname.lastname@email.com</li>
              <li><strong>Location</strong> - City, UK (no full address needed)</li>
              <li><strong>LinkedIn Profile</strong> - Optional but recommended</li>
              <li><strong>Portfolio/Website</strong> - If relevant to your field</li>
            </ul>
            <div className="bg-red-50 rounded p-4">
              <p className="text-red-900 font-semibold mb-2">❌ Don't Include:</p>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• Date of birth or age (age discrimination laws)</li>
                <li>• Photo (unless acting/modeling)</li>
                <li>• Full home address (city is enough)</li>
                <li>• Marital status or children</li>
                <li>• National Insurance number</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Professional Summary / Personal Statement</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
            <p className="text-gray-700 mb-4"><strong>What to Include (3-5 sentences):</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your job title and years of experience</li>
              <li>Key skills and areas of expertise</li>
              <li>1-2 major achievements with quantified results</li>
              <li>What you're looking for (optional)</li>
            </ul>
            <div className="bg-green-50 rounded p-4">
              <p className="text-green-900 font-semibold mb-2">✅ Example:</p>
              <p className="text-green-800 italic text-sm">
                "Results-driven Marketing Manager with 7+ years of experience leading digital campaigns for B2B SaaS companies. Proven track record of increasing lead generation by 250% and reducing customer acquisition costs by 40% through data-driven strategies. Seeking to leverage expertise in marketing automation and team leadership to drive growth for an innovative tech company."
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Work Experience</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-purple-500">
            <p className="text-gray-700 mb-4"><strong>What to Include for Each Role:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Job Title</strong> - Your official position</li>
              <li><strong>Company Name</strong> - Include location if not well-known</li>
              <li><strong>Dates</strong> - Month Year to Month Year (or Present)</li>
              <li><strong>Achievements</strong> - 3-6 bullet points with quantified results</li>
              <li><strong>Key Responsibilities</strong> - Focus on impact, not just duties</li>
            </ul>
            <div className="bg-purple-50 rounded p-4 mb-4">
              <p className="text-purple-900 font-semibold mb-2">✅ Good Example:</p>
              <div className="font-mono text-xs text-purple-800">
                <p className="font-semibold">Marketing Manager | TechCorp Solutions | Jan 2021 - Present</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Increased qualified leads by 250% through data-driven digital marketing strategy</li>
                  <li>Managed £500K annual marketing budget across 5 channels with 4:1 average ROAS</li>
                  <li>Reduced customer acquisition cost by 40% through campaign optimization</li>
                  <li>Built and led team of 4 marketing specialists, achieving 95% retention rate</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-50 rounded p-4">
              <p className="text-red-900 font-semibold mb-2">❌ Bad Example:</p>
              <div className="font-mono text-xs text-red-800">
                <p className="font-semibold">Marketing Manager | TechCorp Solutions | 2021 - Present</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Responsible for marketing activities</li>
                  <li>Managed social media accounts</li>
                  <li>Worked with team members</li>
                </ul>
              </div>
              <p className="text-red-800 text-xs mt-2">Too vague, no numbers, focuses on responsibilities not achievements</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Education</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-orange-500">
            <p className="text-gray-700 mb-4"><strong>What to Include:</strong></p>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">For Graduates (0-3 years):</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Degree classification and subject</li>
                  <li>• University name and dates</li>
                  <li>• Relevant modules with grades</li>
                  <li>• Dissertation topic</li>
                  <li>• University achievements</li>
                  <li>• A-Levels with grades</li>
                  <li>• GCSEs summary</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">For Experienced (5+ years):</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Degree classification and subject</li>
                  <li>• University name and year</li>
                  <li>• A-Levels (optional)</li>
                  <li>• That's it - keep it brief</li>
                </ul>
              </div>
            </div>
            <div className="bg-orange-50 rounded p-4">
              <p className="text-orange-900 font-semibold mb-2">📝 Format:</p>
              <p className="text-orange-800 text-sm font-mono">First Class BA (Hons) Business Management | University of Manchester | 2024</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Skills</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-teal-500">
            <p className="text-gray-700 mb-4"><strong>What to Include:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Technical Skills</strong> - Software, programming languages, tools</li>
              <li><strong>Professional Skills</strong> - Industry-specific abilities</li>
              <li><strong>Soft Skills</strong> - With evidence in work experience</li>
              <li><strong>Languages</strong> - With proficiency levels</li>
              <li><strong>Certifications</strong> - Professional qualifications</li>
            </ul>
            <div className="bg-teal-50 rounded p-4">
              <p className="text-teal-900 font-semibold mb-2">✅ Example:</p>
              <div className="font-mono text-xs text-teal-800">
                <p className="mb-2"><strong>Technical Skills:</strong> Python, SQL, Tableau, Power BI, Excel (Advanced), Google Analytics</p>
                <p className="mb-2"><strong>Professional Skills:</strong> Data Analysis, Project Management, Stakeholder Engagement</p>
                <p><strong>Languages:</strong> English (Native), French (Fluent - C1), Spanish (Intermediate - B1)</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Optional CV Sections (Include If Relevant)</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certifications & Qualifications</h3>
              <p className="text-gray-700 text-sm mb-3">Include professional certifications that add credibility:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• PMP, PRINCE2, Agile certifications</li>
                <li>• ACCA, CIMA, ACA (accounting)</li>
                <li>• AWS, Microsoft, Google Cloud certified</li>
                <li>• CIPD, CIM (HR/Marketing)</li>
                <li>• Industry-specific licenses</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteering</h3>
              <p className="text-gray-700 text-sm mb-3">Include if it demonstrates relevant skills:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Leadership roles in charities</li>
                <li>• Skills-based volunteering</li>
                <li>• Long-term commitments</li>
                <li>• Relevant to target role</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Projects</h3>
              <p className="text-gray-700 text-sm mb-3">Especially for technical roles or graduates:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• University projects with results</li>
                <li>• Personal coding projects (GitHub)</li>
                <li>• Freelance work</li>
                <li>• Portfolio pieces</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Awards & Achievements</h3>
              <p className="text-gray-700 text-sm mb-3">Recognition that demonstrates excellence:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Industry awards</li>
                <li>• Academic honors (Dean's List)</li>
                <li>• Sales/performance awards</li>
                <li>• Published articles or research</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Memberships</h3>
              <p className="text-gray-700 text-sm mb-3">Membership in professional bodies:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Chartered status (CEng, MICE)</li>
                <li>• Professional associations</li>
                <li>• Industry bodies</li>
                <li>• Alumni networks</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interests & Hobbies</h3>
              <p className="text-gray-700 text-sm mb-3">Only include if they:</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Demonstrate leadership (team captain)</li>
                <li>• Show relevant skills</li>
                <li>• Are unique/conversation starters</li>
                <li>• Relate to company culture</li>
              </ul>
              <p className="text-red-600 text-xs mt-2">❌ Skip: "Reading, watching TV, socializing"</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What NOT to Put on Your CV</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-900 font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Never Include These:
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Photo</p>
                <p className="text-red-800 text-sm">UK CVs don't include photos (unless acting/modeling). It can lead to unconscious bias.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Date of Birth / Age</p>
                <p className="text-red-800 text-sm">Protected by age discrimination laws. Never include your age or DOB.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Marital Status / Children</p>
                <p className="text-red-800 text-sm">Personal information that's irrelevant to your ability to do the job.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ National Insurance Number</p>
                <p className="text-red-800 text-sm">Only provide this after you're hired, not on your CV.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Salary Expectations</p>
                <p className="text-red-800 text-sm">Discuss salary during interviews, not on your CV.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ "References Available Upon Request"</p>
                <p className="text-red-800 text-sm">This is assumed. Don't waste space stating the obvious.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Reasons for Leaving Jobs</p>
                <p className="text-red-800 text-sm">Save this for interviews if asked. Don't explain on your CV.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Irrelevant Work Experience</p>
                <p className="text-red-800 text-sm">Jobs from 15+ years ago or completely unrelated roles can be omitted.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Generic Hobbies</p>
                <p className="text-red-800 text-sm">"Reading, watching films, socializing" add no value. Either make them specific or remove them.</p>
              </div>
              <div>
                <p className="text-red-900 font-semibold mb-1">❌ Lies or Exaggerations</p>
                <p className="text-red-800 text-sm">Employers verify qualifications and references. Be honest.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How Much Detail to Include</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Detail Level by Experience:</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-sm">0-3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Graduate / Entry-Level (0-3 years)</h4>
                  <p className="text-gray-600 text-sm">MORE detail on education, projects, university activities. LESS on work experience (you don't have much yet).</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3-10</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Mid-Level (3-10 years)</h4>
                  <p className="text-gray-600 text-sm">MORE detail on recent roles (5-6 bullets). LESS on education (just degree and grade). Older roles get 2-3 bullets.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">10+</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Senior (10+ years)</h4>
                  <p className="text-gray-600 text-sm">Focus on strategic achievements and leadership. Summarize or omit roles from 15+ years ago. Education is one line.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CV Content Checklist</h2>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Before Submitting, Check:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-3">✅ Must Have:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Contact information (name, phone, email, location)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Professional summary (3-5 sentences)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Work experience with achievements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Education with qualifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Skills relevant to target role</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">❌ Must NOT Have:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Photo, age, or date of birth</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Marital status or children</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">National Insurance number</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Salary expectations</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Generic hobbies or clichés</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Tailoring Your CV Content</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The most important rule: <strong>tailor your CV for each application</strong>. Don't send the same CV to every job.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">How to Tailor:</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Read Job Description Carefully</h4>
                  <p className="text-gray-600 text-sm">Highlight key requirements, skills, and keywords mentioned multiple times.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Match Keywords</h4>
                  <p className="text-gray-600 text-sm">Use exact phrases from the job posting in your professional summary and skills section.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Reorder Bullet Points</h4>
                  <p className="text-gray-600 text-sm">Put most relevant achievements first in each role. Recruiters scan top bullets.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Adjust Skills Section</h4>
                  <p className="text-gray-600 text-sm">Prioritize skills mentioned in the job description. Remove irrelevant ones.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Customize Professional Summary</h4>
                  <p className="text-gray-600 text-sm">Rewrite your opening paragraph to align with the specific role and company.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Create Your Perfect CV with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Knowing what to include is one thing - actually writing it all is another. <strong>My CV Buddy</strong> uses AI to help you create comprehensive, tailored CVs in minutes.
          </p>
          
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered CV Content Generator</h3>
            <p className="text-emerald-100 mb-6">
              Upload your current CV and paste the job description. Our AI analyzes both and automatically includes the right content, removes what shouldn't be there, and tailors everything to match the role's requirements. Get a professional CV with all the right sections in the right order.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition inline-block"
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
                <span className="text-gray-700"><strong>Essential sections:</strong> Contact info, professional summary, work experience, education, skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Focus on achievements</strong> with quantified results, not just responsibilities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Never include:</strong> Photo, age, marital status, salary expectations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Tailor for each job</strong> - match keywords and prioritize relevant content</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Detail level varies</strong> by experience - graduates need more education detail</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Optional sections</strong> only if they add value and are relevant</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/professional-cv-how-to-create" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">Professional CV: How to Create One</h4>
                <p className="text-gray-600 text-sm">Complete guide to creating a professional CV</p>
              </Link>
              <Link href="/blog/cv-examples-by-industry-uk" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Examples by Industry</h4>
                <p className="text-gray-600 text-sm">15 winning CV examples to inspire you</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
