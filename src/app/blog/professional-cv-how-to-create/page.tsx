import Link from 'next/link'
import { ArrowLeft, Award, CheckCircle, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { DownloadResource } from '@/components/DownloadResource'

export const metadata: Metadata = {
  title: 'Professional CV: How to Create One That Gets Interviews (2025)',
  description: 'Complete guide to creating a professional CV for UK jobs. Learn formatting, content, and design tips that impress recruiters and pass ATS systems.',
  keywords: ['professional CV', 'professional CV UK', 'how to create a professional CV', 'professional CV format', 'professional CV template'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/professional-cv-how-to-create'
  },
  openGraph: {
    title: 'Professional CV: How to Create One That Gets Interviews (2025)',
    description: 'Expert guide to creating a professional CV that stands out to UK employers.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function ProfessionalCVGuide() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <div className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional CV: How to Create One That Gets Interviews (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>15 min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <Award className="w-6 h-6 text-indigo-600 inline mr-2" />
              A professional CV is your ticket to landing interviews. This comprehensive guide shows you exactly how to create a CV that impresses recruiters, passes ATS systems, and showcases your value to employers.
            </p>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">What Makes a CV "Professional"?</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            A professional CV is more than just a well-formatted document. It's a strategic marketing tool that presents your skills, experience, and achievements in a way that resonates with employers and demonstrates your professionalism.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-4">Key Characteristics of a Professional CV:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Clean, consistent formatting</strong> with clear hierarchy</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Tailored content</strong> matching the job requirements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Quantified achievements</strong> with measurable results</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>ATS-optimized</strong> with relevant keywords</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Error-free</strong> - no typos or grammatical mistakes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Appropriate length</strong> (2 pages for most UK professionals)</span>
              </li>
            </ul>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Professional CV Structure</h2>
          
          <h3 className="text-3xl font-black text-white mt-8 mb-4">1. Contact Information</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-gray-300 mb-3"><strong>What to Include:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Full name (larger font, bold)</li>
              <li>Phone number (UK mobile format: 07XXX XXXXXX)</li>
              <li>Professional email address (firstname.lastname@email.com)</li>
              <li>Location (City, UK - no full address needed)</li>
              <li>LinkedIn profile URL (optional but recommended)</li>
              <li>Portfolio/website (if relevant to your field)</li>
            </ul>
            <p className="text-gray-300 mb-2"><strong>What NOT to Include:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Date of birth or age</li>
              <li>Photo (unless applying for acting/modeling)</li>
              <li>Marital status or children</li>
              <li>National Insurance number</li>
            </ul>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">2. Professional Summary</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <p className="text-gray-300 mb-3">A 3-5 sentence paragraph at the top of your CV that summarizes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your job title and years of experience</li>
              <li>Key skills and areas of expertise</li>
              <li>1-2 major achievements with numbers</li>
              <li>What you're looking for (optional)</li>
            </ul>
            <div className="bg-green-50 rounded p-4">
              <p className="text-green-900 font-semibold mb-2">✅ Example:</p>
              <p className="text-green-800 italic text-sm">
                "Results-driven Marketing Manager with 7+ years of experience leading digital campaigns for B2B SaaS companies. Proven track record of increasing lead generation by 250% and reducing customer acquisition costs by 40% through data-driven strategies. Seeking to leverage expertise in marketing automation and team leadership to drive growth for an innovative tech company."
              </p>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">3. Work Experience</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <p className="text-gray-300 mb-3"><strong>Format for Each Role:</strong></p>
            <div className="bg-white rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold">Job Title | Company Name | Dates (Month Year - Present/Month Year)</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Achievement-focused bullet point with quantified result</li>
                <li>Another achievement showing impact with numbers</li>
                <li>Responsibility demonstrating key skills</li>
                <li>3-5 bullets per role (most recent roles get more detail)</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded p-4">
              <p className="text-purple-900 font-semibold mb-2">💡 Pro Tips:</p>
              <ul className="text-purple-800 space-y-1 text-sm">
                <li>• Start each bullet with action verbs (Led, Managed, Achieved, Implemented)</li>
                <li>• Use numbers wherever possible (%, £, team sizes, timeframes)</li>
                <li>• Focus on achievements, not just responsibilities</li>
                <li>• Tailor bullet points to match job description keywords</li>
                <li>• Most recent role should have 5-6 bullets, older roles 2-3</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">4. Education</h3>
          <div className="bg-gray-50 border-l-4 border-orange-500 p-6 mb-6">
            <p className="text-gray-300 mb-3"><strong>Format:</strong></p>
            <div className="bg-white rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold">Degree Classification | Degree Name | University Name | Year</p>
              <p className="mt-2">Example: First Class BA (Hons) Business Management | University of Manchester | 2018</p>
            </div>
            <p className="text-gray-300 mb-2"><strong>What to Include:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
              <li>Degree classification (First, 2:1, 2:2)</li>
              <li>A-Levels with grades (if graduate/recent grad)</li>
              <li>GCSEs summary (e.g., "9 GCSEs including Maths & English (A*-B)")</li>
              <li>Relevant modules or dissertation (only if recent graduate)</li>
            </ul>
            <p className="text-gray-400 text-sm italic">Note: If you have 5+ years experience, keep education brief - just degree, institution, and grade.</p>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">5. Skills Section</h3>
          <div className="bg-gray-50 border-l-4 border-red-500 p-6 mb-6">
            <p className="text-gray-300 mb-3">Organize skills into categories:</p>
            <div className="bg-white rounded p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2">Technical Skills:</p>
              <p className="text-gray-300 text-sm mb-3">Excel (Advanced), Salesforce, SQL, Python, Adobe Creative Suite, Sage 50</p>
              
              <p className="font-semibold text-gray-900 mb-2">Professional Skills:</p>
              <p className="text-gray-300 text-sm mb-3">Project Management, Data Analysis, Team Leadership, Stakeholder Management</p>
              
              <p className="font-semibold text-gray-900 mb-2">Languages:</p>
              <p className="text-gray-300 text-sm">English (Native), French (Fluent), Spanish (Conversational)</p>
            </div>
            <div className="bg-red-50 rounded p-4">
              <p className="text-red-900 font-semibold mb-2">❌ Avoid:</p>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• Generic skills like "hard worker" or "team player"</li>
                <li>• Outdated software (Windows XP, Internet Explorer)</li>
                <li>• Rating skills with bars or percentages</li>
                <li>• Skills not relevant to the target role</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">6. Additional Sections (Optional)</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">Certifications</h4>
              <p className="text-gray-400 text-sm mb-2">Include professional qualifications:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• PMP, PRINCE2</li>
                <li>• ACCA, CIMA</li>
                <li>• AWS Certified, Microsoft Certified</li>
                <li>• CIPD, CIM</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">Interests</h4>
              <p className="text-gray-400 text-sm mb-2">Only include if:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Relevant to the role</li>
                <li>• Shows leadership (captain of sports team)</li>
                <li>• Demonstrates unique skills</li>
                <li>• Provides conversation starters</li>
              </ul>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Professional CV Formatting Guidelines</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Typography & Layout:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-white font-semibold mb-2">Font Choices:</p>
                <ul className="text-gray-300 text-sm space-y-1 mb-4">
                  <li>• <strong>Professional:</strong> Arial, Calibri, Helvetica</li>
                  <li>• <strong>Traditional:</strong> Times New Roman, Georgia</li>
                  <li>• <strong>Modern:</strong> Lato, Roboto, Open Sans</li>
                  <li>• <strong>Size:</strong> 10-12pt body, 14-16pt headings</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-2">Spacing & Margins:</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Margins:</strong> 2-2.5cm all sides</li>
                  <li>• <strong>Line spacing:</strong> 1.15 or 1.5</li>
                  <li>• <strong>Section spacing:</strong> 12-18pt between sections</li>
                  <li>• <strong>Bullet spacing:</strong> 6-8pt between bullets</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">🎨 Color Guidelines</p>
            <p className="text-blue-800 mb-3">
              Professional CVs can use subtle color accents, but keep it minimal:
            </p>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• <strong>Conservative industries:</strong> Black/grey only (finance, law)</li>
              <li>• <strong>Creative industries:</strong> One accent color (navy, teal, burgundy)</li>
              <li>• <strong>Tech/Startups:</strong> Modern color palette acceptable</li>
              <li>• <strong>Avoid:</strong> Bright colors, multiple colors, colored backgrounds</li>
            </ul>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Professional CV Content Tips</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-2xl font-black text-white mb-3">Use the STAR Method</h3>
              <p className="text-gray-300 mb-3">Structure achievements using Situation, Task, Action, Result:</p>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-400 text-sm mb-2"><strong>Bad:</strong> "Responsible for managing social media"</p>
                <p className="text-green-800 text-sm"><strong>Good:</strong> "Increased social media engagement by 180% in 6 months by implementing data-driven content strategy and A/B testing, resulting in 5,000+ new followers and 50 qualified leads per month"</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-2xl font-black text-white mb-3">Quantify Everything</h3>
              <p className="text-gray-300 mb-3">Numbers make your achievements concrete and impressive:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Revenue:</strong> "Generated £2.5M in new business"</li>
                <li><strong>Percentages:</strong> "Reduced costs by 35%"</li>
                <li><strong>Team sizes:</strong> "Managed team of 12 developers"</li>
                <li><strong>Timeframes:</strong> "Delivered project 3 weeks ahead of schedule"</li>
                <li><strong>Volume:</strong> "Processed 500+ customer inquiries daily"</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <h3 className="text-2xl font-black text-white mb-3">Match Job Description Keywords</h3>
              <p className="text-gray-300 mb-3">ATS systems scan for specific keywords. Mirror the language used in the job posting:</p>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-400 text-sm mb-2"><strong>Job posting says:</strong> "Experience with stakeholder management"</p>
                <p className="text-orange-800 text-sm"><strong>Your CV should say:</strong> "Stakeholder management" (not "worked with clients")</p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Professional CV Checklist</h2>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Before Submitting, Check:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Content:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Tailored to specific job</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Achievements quantified</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Keywords from job description</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">No typos or errors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Appropriate length (2 pages)</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Formatting:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Consistent font and sizing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Clear section headings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Adequate white space</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Professional appearance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Saved as PDF</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Common Professional CV Mistakes</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Using "I" or "My"</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "I managed a team of 10 people"</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Managed team of 10 marketing specialists"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Listing Responsibilities Instead of Achievements</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "Responsible for customer service"</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Improved customer satisfaction scores from 72% to 91% through process optimization"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Using Unprofessional Email Address</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> partygirl123@hotmail.com</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> sarah.johnson@gmail.com</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Including Irrelevant Information</p>
              <p className="text-red-800 text-sm">Remove: hobbies that don't add value, outdated skills, jobs from 15+ years ago (unless highly relevant)</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Create Your Professional CV with AI</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Creating a professional CV from scratch can take hours. <strong>My CV Buddy</strong> uses AI to generate professional, ATS-optimized CVs in minutes.
          </p>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered Professional CV Generator</h3>
            <p className="text-indigo-100 mb-6">
              Upload your current CV and paste the job description. Our AI creates a professional CV with perfect formatting, quantified achievements, and industry-specific keywords. Choose from multiple professional templates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition inline-block"
              >
                Upload Your CV
              </Link>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Use <strong>clean, consistent formatting</strong> with professional fonts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Focus on <strong>achievements, not responsibilities</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Quantify everything</strong> with numbers and percentages</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Tailor your CV</strong> for each application with relevant keywords</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Keep it to <strong>2 pages</strong> for most UK professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Proofread multiple times</strong> - errors destroy professionalism</span>
              </li>
            </ul>
          </div>

          <DownloadResource 
            title="Free Professional CV Resources"
            description="Download our professional CV template and comprehensive writing checklist to create your perfect CV"
          />

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">What makes a CV professional?</h3>
                <p className="text-gray-300 leading-relaxed">A professional CV has clean formatting, quantified achievements, tailored content matching job requirements, ATS optimization with relevant keywords, and zero errors. It focuses on results rather than responsibilities and uses a consistent, easy-to-read layout.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">How long should a professional CV be?</h3>
                <p className="text-gray-300 leading-relaxed">For most UK professionals, 2 pages is the standard. Graduates can use 1 page if they have limited experience. Senior executives with 15+ years may extend to 3 pages, but only if every line adds significant value.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">Should I include a photo on my CV?</h3>
                <p className="text-gray-300 leading-relaxed">No, UK CVs should not include photos unless you're applying for acting, modeling, or similar roles where appearance is relevant. Photos can lead to unconscious bias and are not expected by UK employers.</p>
              </div>
              <div className="pb-0">
                <h3 className="text-2xl font-black text-white mb-3">What's the best font for a professional CV?</h3>
                <p className="text-gray-300 leading-relaxed">Professional fonts include Arial, Calibri, Helvetica (modern), Times New Roman, Georgia (traditional), or Lato, Roboto (contemporary). Use 10-12pt for body text and 14-16pt for headings. Stick to one font throughout for consistency.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-3xl font-black text-white mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/cv-template-uk-2025" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Template UK: 10 Free Templates</h4>
                <p className="text-gray-400 text-sm">Professional CV templates for UK job applications</p>
              </Link>
              <Link href="/blog/cv-examples-by-industry-uk" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Examples by Industry</h4>
                <p className="text-gray-400 text-sm">15 winning CV examples across industries</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes a CV professional?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A professional CV has clean formatting, quantified achievements, tailored content matching job requirements, ATS optimization with relevant keywords, and zero errors. It focuses on results rather than responsibilities and uses a consistent, easy-to-read layout."
                }
              },
              {
                "@type": "Question",
                "name": "How long should a professional CV be?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For most UK professionals, 2 pages is the standard. Graduates can use 1 page if they have limited experience. Senior executives with 15+ years may extend to 3 pages, but only if every line adds significant value."
                }
              },
              {
                "@type": "Question",
                "name": "Should I include a photo on my CV?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, UK CVs should not include photos unless you're applying for acting, modeling, or similar roles where appearance is relevant. Photos can lead to unconscious bias and are not expected by UK employers."
                }
              },
              {
                "@type": "Question",
                "name": "What's the best font for a professional CV?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Professional fonts include Arial, Calibri, Helvetica (modern), Times New Roman, Georgia (traditional), or Lato, Roboto (contemporary). Use 10-12pt for body text and 14-16pt for headings. Stick to one font throughout for consistency."
                }
              }
            ]
          })
        }}
      />
    </div>
  )
}
