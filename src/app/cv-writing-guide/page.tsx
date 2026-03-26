import Link from 'next/link'
import { Metadata } from 'next'
import { CheckCircle, ArrowRight, FileText, Target, Sparkles, Award, TrendingUp, Users } from 'lucide-react'
import { CVWritingGuideSchema } from '@/components/CVWritingGuideSchema'

export const metadata: Metadata = {
  title: 'Free CV Builder UK Guide 2026: Resume Adapter & CV Writing Tips',
  description: 'Master CV writing with our comprehensive 2026 guide. Free CV builder UK tips, resume adapter strategies, and ATS optimization. Learn how to write a winning CV and land more interviews with expert advice for UK job seekers.',
  keywords: [
    'free cv builder uk',
    'cv builder uk',
    'resume adapter',
    'CV writing guide',
    'how to write a CV',
    'CV writing tips',
    'CV guide UK',
    'free cv builder no sign up',
    'ai cv builder uk',
    'CV writing tutorial',
    'professional CV writing',
    'CV writing help',
    'CV writing advice',
    'best CV writing guide',
    'CV writing examples',
    'CV writing format',
    'ats cv optimizer',
    'ATS CV writing',
    'CV writing for beginners',
    'CV writing 2026'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/cv-writing-guide',
  },
  openGraph: {
    title: 'CV Writing Guide 2026: Complete Step-by-Step Tutorial',
    description: 'Master CV writing with our comprehensive guide. Learn how to write a winning CV, optimize for ATS, and land more interviews.',
    url: 'https://www.mycvbuddy.com/cv-writing-guide',
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Writing Guide 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Writing Guide 2026: Complete Tutorial',
    description: 'Master CV writing with our comprehensive guide. Learn how to write a winning CV and land more interviews.',
  },
}

export default function CVWritingGuidePage() {
  return (
    <>
      <CVWritingGuideSchema />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">CV</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">CV Adapter</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/auth/login" 
              className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black hover:bg-blue-700 text-sm sm:text-base font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Updated for 2026 Job Market</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              The Complete CV Writing Guide for 2026
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Master the art of CV writing with our comprehensive, step-by-step guide. Learn how to create a professional CV that gets you interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup" 
                className="bg-white text-black px-8 py-4 rounded-full font-black hover:bg-blue-700 font-semibold text-lg inline-flex items-center justify-center"
              >
                Create Your CV Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/blog" 
                className="bg-white text-gray-300 px-8 py-4 rounded-lg hover:bg-white/5 font-semibold text-lg border-2 border-white/10 inline-flex items-center justify-center"
              >
                Read More Guides
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-gray-400">CVs Created</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">2 min</div>
              <div className="text-sm sm:text-base text-gray-400">Average Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            
            {/* Table of Contents */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-12">
              <h2 className="text-3xl font-black text-white mb-4 mt-0">Table of Contents</h2>
              <ul className="space-y-2 mb-0">
                <li><a href="#what-is-cv" className="text-blue-400 hover:text-blue-700">1. What is a CV?</a></li>
                <li><a href="#cv-structure" className="text-blue-400 hover:text-blue-700">2. Essential CV Structure</a></li>
                <li><a href="#contact-info" className="text-blue-400 hover:text-blue-700">3. Contact Information</a></li>
                <li><a href="#personal-statement" className="text-blue-400 hover:text-blue-700">4. Personal Statement</a></li>
                <li><a href="#work-experience" className="text-blue-400 hover:text-blue-700">5. Work Experience</a></li>
                <li><a href="#education" className="text-blue-400 hover:text-blue-700">6. Education & Qualifications</a></li>
                <li><a href="#skills" className="text-blue-400 hover:text-blue-700">7. Skills Section</a></li>
                <li><a href="#ats-optimization" className="text-blue-400 hover:text-blue-700">8. ATS Optimization</a></li>
                <li><a href="#common-mistakes" className="text-blue-400 hover:text-blue-700">9. Common Mistakes to Avoid</a></li>
                <li><a href="#final-checklist" className="text-blue-400 hover:text-blue-700">10. Final Checklist</a></li>
              </ul>
            </div>

            {/* Section 1 */}
            <section id="what-is-cv" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">1. What is a CV?</h2>
              <p className="text-gray-300 text-lg mb-4">
                A Curriculum Vitae (CV) is a comprehensive document that showcases your professional history, skills, education, and achievements. In the UK, a CV is typically 2 pages long and is your primary tool for securing job interviews.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-800 font-semibold mb-2">💡 Pro Tip:</p>
                <p className="text-green-700 mb-0">Your CV should be tailored to each job application. Generic CVs have a 70% lower success rate than tailored ones.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="cv-structure" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">2. Essential CV Structure</h2>
              <p className="text-gray-300 text-lg mb-4">
                A well-structured CV follows this proven format:
              </p>
              <ol className="space-y-3 text-gray-300 text-lg">
                <li><strong>Contact Information</strong> - Name, phone, email, location, LinkedIn</li>
                <li><strong>Personal Statement</strong> - 3-4 sentences summarizing your value</li>
                <li><strong>Work Experience</strong> - Reverse chronological order with achievements</li>
                <li><strong>Education</strong> - Degrees, certifications, relevant training</li>
                <li><strong>Skills</strong> - Technical and soft skills relevant to the role</li>
                <li><strong>Additional Sections</strong> - Languages, volunteering, awards (optional)</li>
              </ol>
            </section>

            {/* Section 3 */}
            <section id="contact-info" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">3. Contact Information</h2>
              <p className="text-gray-300 text-lg mb-4">
                Your contact details should be clear and professional:
              </p>
              <div className="bg-white/5 p-6 rounded-lg mb-4">
                <p className="font-mono text-sm mb-2"><strong>John Smith</strong></p>
                <p className="font-mono text-sm mb-2">📧 john.smith@email.com</p>
                <p className="font-mono text-sm mb-2">📱 07700 900000</p>
                <p className="font-mono text-sm mb-2">📍 London, UK</p>
                <p className="font-mono text-sm mb-0">🔗 linkedin.com/in/johnsmith</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-800 font-semibold mb-2">❌ Avoid:</p>
                <ul className="text-red-700 mb-0 space-y-1">
                  <li>Unprofessional email addresses (e.g., partygirl123@email.com)</li>
                  <li>Full home address (city and postcode are sufficient)</li>
                  <li>Date of birth or age (unless specifically requested)</li>
                  <li>Photo (unless applying for acting/modeling roles)</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="personal-statement" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">4. Personal Statement</h2>
              <p className="text-gray-300 text-lg mb-4">
                Your personal statement is your elevator pitch. It should be 3-4 sentences that highlight:
              </p>
              <ul className="space-y-2 text-gray-300 text-lg mb-4">
                <li>✅ Your current role or status</li>
                <li>✅ Your key skills and experience</li>
                <li>✅ Your career goals and what you're looking for</li>
                <li>✅ Your unique value proposition</li>
              </ul>
              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <p className="font-black text-white mb-2">Example for Marketing Manager:</p>
                <p className="text-gray-300 italic mb-0">
                  "Results-driven Marketing Manager with 7+ years of experience in digital marketing and brand strategy. Proven track record of increasing online engagement by 150% and generating £2M+ in revenue through data-driven campaigns. Seeking to leverage my expertise in SEO, content marketing, and team leadership to drive growth for a forward-thinking tech company."
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="work-experience" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">5. Work Experience</h2>
              <p className="text-gray-300 text-lg mb-4">
                This is the most important section of your CV. Follow these rules:
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-white">Use the STAR method</p>
                    <p className="text-gray-300">Situation, Task, Action, Result - quantify achievements wherever possible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-white">Start with action verbs</p>
                    <p className="text-gray-300">Led, Managed, Developed, Increased, Reduced, Implemented, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-white">Include numbers and metrics</p>
                    <p className="text-gray-300">Percentages, revenue figures, team sizes, time saved, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-white">Tailor to the job description</p>
                    <p className="text-gray-300">Highlight relevant experience and use keywords from the job posting</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <p className="font-black text-white mb-3">Example Entry:</p>
                <p className="font-black text-white mb-1">Senior Marketing Manager | Tech Solutions Ltd</p>
                <p className="text-gray-400 mb-3 text-sm">January 2021 - Present | London, UK</p>
                <ul className="space-y-2 text-gray-300 mb-0">
                  <li>• Led a team of 8 marketers to deliver integrated campaigns across digital and traditional channels</li>
                  <li>• Increased organic website traffic by 200% through SEO optimization and content strategy</li>
                  <li>• Managed £500K annual marketing budget, achieving 25% cost reduction while improving ROI by 40%</li>
                  <li>• Launched new product line generating £1.2M revenue in first 6 months</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="education" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">6. Education & Qualifications</h2>
              <p className="text-gray-300 text-lg mb-4">
                List your education in reverse chronological order. Include:
              </p>
              <ul className="space-y-2 text-gray-300 text-lg mb-4">
                <li>✅ Degree title and classification (e.g., BSc Computer Science, First Class Honours)</li>
                <li>✅ University name and location</li>
                <li>✅ Graduation year (or expected graduation)</li>
                <li>✅ Relevant modules or dissertation topic (if recent graduate)</li>
                <li>✅ Professional certifications and training courses</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800 font-semibold mb-2">📚 Note:</p>
                <p className="text-yellow-700 mb-0">If you have 5+ years of work experience, keep education brief. For recent graduates, expand this section with relevant coursework and projects.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="skills" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">7. Skills Section</h2>
              <p className="text-gray-300 text-lg mb-4">
                Divide your skills into categories for better readability:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-black text-white mb-3">Technical Skills</h3>
                  <ul className="space-y-1 text-gray-300 mb-0">
                    <li>• Programming languages</li>
                    <li>• Software proficiency</li>
                    <li>• Tools and platforms</li>
                    <li>• Industry-specific skills</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-black text-white mb-3">Soft Skills</h3>
                  <ul className="space-y-1 text-gray-300 mb-0">
                    <li>• Leadership and management</li>
                    <li>• Communication</li>
                    <li>• Problem-solving</li>
                    <li>• Time management</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-800 font-semibold mb-2">💡 Pro Tip:</p>
                <p className="text-green-700 mb-0">Only list skills you can confidently discuss in an interview. Avoid generic terms like "Microsoft Office" - be specific (e.g., "Advanced Excel including VBA and pivot tables").</p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="ats-optimization" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">8. ATS Optimization</h2>
              <p className="text-gray-300 text-lg mb-4">
                75% of CVs are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Here's how to pass:
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                  <h3 className="font-black text-white mb-2">✅ Use Standard Section Headings</h3>
                  <p className="text-gray-300 mb-0">Stick to "Work Experience", "Education", "Skills" - avoid creative headings like "My Journey"</p>
                </div>
                <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                  <h3 className="font-black text-white mb-2">✅ Include Keywords from Job Description</h3>
                  <p className="text-gray-300 mb-0">Mirror the language used in the job posting - if they say "project management", use that exact phrase</p>
                </div>
                <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                  <h3 className="font-black text-white mb-2">✅ Use Simple Formatting</h3>
                  <p className="text-gray-300 mb-0">Avoid tables, text boxes, headers/footers, and images - stick to standard fonts and bullet points</p>
                </div>
                <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                  <h3 className="font-black text-white mb-2">✅ Save as .docx or PDF</h3>
                  <p className="text-gray-300 mb-0">Most ATS systems prefer .docx format, but PDF is also widely accepted</p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="common-mistakes" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">9. Common Mistakes to Avoid</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">❌ Spelling and Grammar Errors</p>
                  <p className="text-red-700 mb-0">Even one typo can get your CV rejected. Use spell-check and ask someone to proofread.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">❌ Too Long or Too Short</p>
                  <p className="text-red-700 mb-0">UK standard is 2 pages. One page looks inexperienced, three pages looks unfocused.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">❌ Generic Content</p>
                  <p className="text-red-700 mb-0">Sending the same CV to every job is a waste of time. Tailor each application.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">❌ Listing Duties Instead of Achievements</p>
                  <p className="text-red-700 mb-0">"Responsible for social media" vs "Grew Instagram following from 5K to 50K in 6 months"</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">❌ Unexplained Employment Gaps</p>
                  <p className="text-red-700 mb-0">Brief gaps are fine, but explain longer ones (travel, study, family care, etc.)</p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="final-checklist" className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">10. Final Checklist</h2>
              <p className="text-gray-300 text-lg mb-4">
                Before sending your CV, verify:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <ul className="space-y-3 mb-0">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Contact information is correct and professional</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Personal statement is tailored to the specific role</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Work experience includes quantified achievements</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Keywords from job description are included</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">No spelling or grammar errors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Formatting is clean and ATS-friendly</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">File is saved as "FirstName_LastName_CV.pdf"</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Someone else has proofread it</span>
                  </li>
                </ul>
              </div>
            </section>

          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create Your Perfect CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use our AI-powered CV builder to create a professional, ATS-optimized CV in just 2 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="bg-white text-blue-400 px-8 py-4 rounded-lg hover:bg-white/10 font-semibold text-lg inline-flex items-center justify-center"
            >
              Start Building Your CV
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/templates" 
              className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 font-semibold text-lg inline-flex items-center justify-center border-2 border-white"
            >
              View CV Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-black text-white mb-8 text-center">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/cv-format-best-layouts-uk" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">CV Format Guide</h3>
              <p className="text-gray-400 mb-4">Learn the best CV layouts and formatting tips for UK jobs.</p>
              <span className="text-blue-400 font-semibold">Read More →</span>
            </Link>
            <Link href="/blog/cv-personal-statement-examples" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Personal Statement Examples</h3>
              <p className="text-gray-400 mb-4">15 professional personal statement examples for your CV.</p>
              <span className="text-blue-400 font-semibold">Read More →</span>
            </Link>
            <Link href="/blog/first-job-cv-no-experience" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">First Job CV Guide</h3>
              <p className="text-gray-400 mb-4">How to write a CV with no work experience.</p>
              <span className="text-blue-400 font-semibold">Read More →</span>
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
              <p className="text-sm">AI-powered CV builder trusted by thousands of UK professionals.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/upload" className="hover:text-white">Upload CV</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/cover-letter" className="hover:text-white">Cover Letters</Link></li>
                <li><Link href="/subscription" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/cv-writing-guide" className="hover:text-white">CV Writing Guide</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CV Adapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
