import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle, Star, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Template UK: 10 Free Professional Templates for 2025 | My CV Buddy',
  description: 'Download free professional CV templates optimized for UK job applications. ATS-friendly designs for all industries. Updated for 2025.',
  keywords: ['CV template UK', 'free CV template', 'professional CV template', 'UK CV format', 'CV template download', 'British CV template', 'CV layout UK'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/cv-template-uk-2025'
  },
  openGraph: {
    title: 'CV Template UK: 10 Free Professional Templates (2025)',
    description: 'Free professional CV templates for UK jobs. ATS-friendly, industry-specific designs.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function CVTemplateUK2025() {
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
          <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Templates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CV Template UK: 10 Free Professional Templates (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <FileText className="w-6 h-6 text-blue-600 inline mr-2" />
              Looking for a professional CV template for UK job applications? This guide provides 10 free, ATS-friendly CV templates designed specifically for the British job market in 2025.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Makes a Good UK CV Template?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A professional UK CV template should be clean, easy to read, and optimized for both Applicant Tracking Systems (ATS) and human recruiters. Unlike US resumes, UK CVs are typically 2 pages long and include more detailed information about your career history.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Essential Elements of a UK CV Template:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Personal Details:</strong> Name, phone, email, location (city), LinkedIn profile</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Professional Summary:</strong> 3-4 lines highlighting your key strengths</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Work Experience:</strong> Reverse chronological order with achievements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Education:</strong> Qualifications with grades (A-Levels, GCSEs, degrees)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Skills:</strong> Technical and soft skills relevant to the role</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Additional Sections:</strong> Certifications, languages, interests (optional)</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">10 Best CV Templates for UK Jobs (2025)</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Classic Professional CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Corporate roles, finance, law, consulting
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            A traditional, clean layout with clear section headings. Uses a professional font (Calibri or Arial) and minimal formatting. Perfect for conservative industries where substance matters more than style.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-semibold mb-2">✨ Key Features:</p>
            <ul className="text-blue-800 space-y-1">
              <li>• Simple two-column layout</li>
              <li>• Professional color scheme (navy/grey)</li>
              <li>• ATS-friendly formatting</li>
              <li>• Clear section dividers</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Modern Creative CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Marketing, design, media, creative industries
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            A contemporary design with subtle color accents and modern typography. Balances creativity with professionalism, making your CV stand out while remaining readable by ATS systems.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Graduate/Entry-Level CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Recent graduates, career starters, internships
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Emphasizes education, projects, and transferable skills. Includes sections for university achievements, societies, and volunteer work to compensate for limited work experience.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Executive/Senior CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Senior managers, directors, C-suite roles
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            A sophisticated layout that highlights leadership experience and strategic achievements. Focuses on high-level accomplishments with quantifiable results.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Technical/IT CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Software developers, engineers, IT professionals
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Structured to showcase technical skills, programming languages, and project experience. Includes dedicated sections for certifications and technical proficiencies.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Healthcare/NHS CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Nurses, doctors, healthcare professionals
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Tailored for NHS applications with sections for clinical experience, registrations, and continuing professional development (CPD).
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Teaching/Education CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Teachers, lecturers, education professionals
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Highlights teaching experience, qualifications (QTS, PGCE), and subject expertise. Includes sections for curriculum development and student outcomes.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Sales/Business Development CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Sales professionals, account managers, BD roles
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Results-focused template emphasizing revenue growth, client acquisition, and performance metrics. Uses bold formatting to highlight key achievements.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Career Change CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Professionals switching industries
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Skills-based format that emphasizes transferable skills over job titles. Includes a strong personal statement explaining your career transition.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Academic/Research CV Template</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best for:</strong> Researchers, academics, PhD candidates
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Comprehensive format for academic CVs (often 3+ pages). Includes sections for publications, research projects, grants, and conference presentations.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">UK CV Format Guidelines (2025)</h2>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Length</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Standard:</strong> 2 pages (A4)<br/>
            <strong>Graduate/Entry-level:</strong> 1-2 pages<br/>
            <strong>Senior/Executive:</strong> 2-3 pages<br/>
            <strong>Academic:</strong> 3+ pages (as needed)
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Font & Formatting</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Font:</strong> Arial, Calibri, or Times New Roman</li>
            <li><strong>Size:</strong> 10-12pt for body text, 14-16pt for headings</li>
            <li><strong>Margins:</strong> 2.5cm (1 inch) on all sides</li>
            <li><strong>Line spacing:</strong> 1.15 or 1.5</li>
            <li><strong>File format:</strong> PDF (unless .docx requested)</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What NOT to Include</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h4 className="text-red-900 font-semibold mb-3">❌ Avoid These on UK CVs:</h4>
            <ul className="list-disc pl-6 text-red-800 space-y-2">
              <li>Photos (unless applying for acting/modeling)</li>
              <li>Date of birth (age discrimination laws)</li>
              <li>Marital status or number of children</li>
              <li>National Insurance number</li>
              <li>Salary expectations (save for cover letter)</li>
              <li>References (state "available upon request")</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Customize Your CV Template</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Tailor to the Job Description</h3>
                  <p className="text-gray-600">Match keywords from the job posting. If they want "project management," use that exact phrase in your CV.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Quantify Achievements</h3>
                  <p className="text-gray-600">Use numbers: "Increased sales by 35%" is better than "Improved sales performance."</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Use Action Verbs</h3>
                  <p className="text-gray-600">Start bullet points with: Managed, Developed, Implemented, Achieved, Led, Coordinated.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Keep It Current</h3>
                  <p className="text-gray-600">Update dates, remove outdated skills, add recent achievements. Your CV should evolve with your career.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">ATS-Friendly CV Template Tips</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            92% of UK recruiters use Applicant Tracking Systems (ATS) to screen CVs. Your template must be ATS-compatible:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>✅ Use standard section headings (Work Experience, Education, Skills)</li>
            <li>✅ Avoid tables, text boxes, and columns</li>
            <li>✅ Don't put important information in headers/footers</li>
            <li>✅ Use standard fonts (no fancy typography)</li>
            <li>✅ Save as .docx or PDF (check job posting)</li>
            <li>✅ Include relevant keywords from job description</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Get Your Perfect CV Template with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            While free templates are a great starting point, creating a truly tailored CV for each job application can be time-consuming. That's where <strong>My CV Buddy</strong> comes in.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Create Your Perfect UK CV in Minutes</h3>
            <p className="text-blue-100 mb-6">
              My CV Buddy uses AI to automatically tailor your CV to any UK job description. Choose from professional templates, optimize for ATS, and download in multiple formats.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/templates"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-block"
              >
                View Templates
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Should I use a CV template or create from scratch?</h3>
              <p className="text-gray-700">Use a template! It saves time and ensures proper formatting. Just make sure to customize it for each application.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Are free CV templates as good as paid ones?</h3>
              <p className="text-gray-700">Yes, if they're ATS-friendly and professionally designed. The content matters more than fancy design.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I use the same CV template for all applications?</h3>
              <p className="text-gray-700">Use the same template design, but always customize the content for each job. Tailor your skills, experience, and keywords to match the job description.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">What's the best file format for UK CVs?</h3>
              <p className="text-gray-700">PDF is generally best as it preserves formatting. However, some ATS systems prefer .docx, so check the job posting.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A professional CV template is your foundation for job search success in the UK. Choose a template that matches your industry and experience level, then customize it for each application to maximize your chances of landing interviews.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Remember: The best CV template is one that's ATS-friendly, easy to read, and showcases your unique value to employers. Focus on achievements, use keywords from job descriptions, and keep your formatting clean and professional.
          </p>

          {/* Related Articles */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/how-to-beat-ats-systems" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">How to Beat ATS Systems</h4>
                <p className="text-gray-600 text-sm">Optimize your CV to pass Applicant Tracking Systems</p>
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
