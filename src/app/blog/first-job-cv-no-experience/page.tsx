import Link from 'next/link'
import { ArrowLeft, GraduationCap, CheckCircle, Lightbulb } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'First Job CV: How to Write One with No Experience (UK 2025)',
  description: 'Complete guide to writing your first CV with no work experience. Learn what to include, how to highlight transferable skills, and see real examples.',
  keywords: ['first job CV', 'CV with no experience', 'first CV', 'entry level CV', 'CV for first job', 'how to write first CV'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/first-job-cv-no-experience'
  },
  openGraph: {
    title: 'First Job CV: How to Write One with No Experience (2025)',
    description: 'Expert guide to creating your first CV and landing your first job.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function FirstJobCVGuide() {
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
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Entry Level
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            First Job CV: How to Write One with No Experience (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>13 min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <GraduationCap className="w-6 h-6 text-green-600 inline mr-2" />
              Writing your first CV with no work experience can feel daunting, but everyone starts somewhere. This guide shows you exactly what to include, how to highlight your strengths, and provides real examples to help you land your first job.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Good News About Your First CV</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Employers hiring for entry-level positions <strong>don't expect extensive work experience</strong>. They're looking for potential, enthusiasm, transferable skills, and the right attitude. Your education, projects, volunteering, and part-time work all count as valuable experience.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">💡 Remember</p>
            <p className="text-blue-800">
              <strong>78% of employers</strong> say they value transferable skills and attitude over direct work experience for entry-level roles.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">First Job CV Structure</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-4">Recommended Order for First CV:</h3>
            <ol className="space-y-2 list-decimal pl-6">
              <li className="text-gray-700"><strong>Contact Information</strong> - Name, phone, email, location, LinkedIn</li>
              <li className="text-gray-700"><strong>Personal Statement</strong> - 3-4 sentences about your goals and strengths</li>
              <li className="text-gray-700"><strong>Education</strong> - Your strongest section - include details</li>
              <li className="text-gray-700"><strong>Work Experience</strong> - Part-time jobs, internships, volunteering</li>
              <li className="text-gray-700"><strong>Skills</strong> - Technical and soft skills relevant to the role</li>
              <li className="text-gray-700"><strong>Additional Sections</strong> - Projects, achievements, interests</li>
            </ol>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Section-by-Section Guide</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Personal Statement for First Job</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <p className="text-gray-700 mb-4">Your personal statement should focus on:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>What you're studying/studied</li>
              <li>Key skills you've developed</li>
              <li>Your career goals and enthusiasm</li>
              <li>What you can offer the employer</li>
            </ul>
            <div className="bg-purple-50 rounded p-4">
              <p className="text-purple-900 font-semibold mb-2">✅ Example:</p>
              <p className="text-purple-800 italic text-sm">
                "Motivated Business Management graduate from University of Manchester with First Class Honours. Developed strong analytical and communication skills through group projects and a 6-month internship at Deloitte. Passionate about pursuing a career in management consulting and eager to apply my problem-solving abilities and business acumen to support client success."
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Education Section (Your Strongest Asset)</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-gray-700 mb-4">For your first CV, education is your main selling point. Include MORE detail than you would later in your career:</p>
            
            <div className="bg-white rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">EDUCATION</p>
              
              <p className="font-semibold">First Class BA (Hons) Business Management</p>
              <p className="mb-2">University of Manchester | Sep 2021 - Jun 2024</p>
              <ul className="list-disc pl-6 mb-4 text-xs">
                <li>Relevant modules: Strategic Management (85%), Financial Analysis (82%), Marketing (78%)</li>
                <li>Dissertation: "Digital Transformation in UK Retail" (First Class - 78%)</li>
                <li>President of Business Society - organized 5 networking events with 200+ attendees</li>
                <li>Achieved Dean's List for academic excellence (top 10% of cohort)</li>
              </ul>
              
              <p className="font-semibold">A-Levels</p>
              <p className="mb-2">St Mary's Sixth Form College | 2019 - 2021</p>
              <p className="text-xs">Business Studies (A*), Mathematics (A), Economics (A)</p>
            </div>

            <div className="bg-blue-50 rounded p-4">
              <p className="text-blue-900 font-semibold mb-2">💡 What to Include:</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Degree classification and subject</li>
                <li>• Relevant modules with high grades</li>
                <li>• Dissertation/final project topic</li>
                <li>• University societies and leadership roles</li>
                <li>• Academic awards or achievements</li>
                <li>• A-Levels with grades (especially if strong)</li>
                <li>• GCSEs summary (e.g., "9 GCSEs including Maths & English (A*-B)")</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Work Experience (Even Without "Real" Jobs)</h3>
          <div className="bg-gray-50 border-l-4 border-orange-500 p-6 mb-6">
            <p className="text-gray-700 mb-4">Include ANY of these - they all count as experience:</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">✅ Counts as Experience:</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Internships (paid or unpaid)</li>
                  <li>• Part-time jobs (retail, hospitality)</li>
                  <li>• Volunteering</li>
                  <li>• Work placements</li>
                  <li>• Summer jobs</li>
                  <li>• Freelance work</li>
                  <li>• Babysitting/tutoring</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded p-4">
                <p className="font-semibold text-orange-900 mb-2">🎯 Focus On:</p>
                <ul className="text-orange-800 text-sm space-y-1">
                  <li>• Transferable skills gained</li>
                  <li>• Responsibilities handled</li>
                  <li>• Achievements (with numbers)</li>
                  <li>• Customer service experience</li>
                  <li>• Teamwork examples</li>
                  <li>• Problem-solving situations</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded p-4 font-mono text-sm">
              <p className="font-semibold mb-2">Example - Part-Time Retail Job:</p>
              <p className="font-bold">Sales Assistant | Tesco | Jun 2022 - Aug 2024</p>
              <ul className="list-disc pl-6 mt-2 text-xs">
                <li>Provided excellent customer service to 100+ customers daily in busy supermarket environment</li>
                <li>Handled cash transactions accurately, managing tills with £5,000+ daily turnover</li>
                <li>Trained 3 new staff members on store procedures and customer service standards</li>
                <li>Consistently achieved 95%+ customer satisfaction scores</li>
                <li>Promoted to supervisor role after 6 months due to strong performance</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Skills Section for Entry-Level</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <p className="text-gray-700 mb-4">Focus on skills you've gained through education, projects, and any work experience:</p>
            
            <div className="bg-white rounded p-4 font-mono text-sm">
              <p className="font-bold mb-2">SKILLS</p>
              
              <p className="font-semibold mb-1">Technical Skills:</p>
              <p className="mb-3 text-xs">Microsoft Office (Word, Excel, PowerPoint), Google Workspace, Basic HTML/CSS, Social Media Management</p>
              
              <p className="font-semibold mb-1">Soft Skills:</p>
              <p className="mb-3 text-xs">Communication, Teamwork, Time Management, Problem-Solving, Adaptability, Customer Service</p>
              
              <p className="font-semibold mb-1">Languages:</p>
              <p className="text-xs">English (Native), Spanish (Intermediate - B1)</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Additional Sections to Strengthen Your CV</h3>
          
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h4 className="text-xl font-bold text-gray-900 mb-3">University Projects</h4>
              <p className="text-gray-700 mb-3">Showcase academic projects that demonstrate relevant skills:</p>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-1">Marketing Campaign Project</p>
                <ul className="list-disc pl-6 text-xs">
                  <li>Led team of 4 to create comprehensive marketing strategy for local startup</li>
                  <li>Conducted market research with 200+ survey responses</li>
                  <li>Developed social media campaign that gained 1,000+ engagements</li>
                  <li>Achieved highest grade in class (85%)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Volunteering & Extracurricular</h4>
              <p className="text-gray-700 mb-3">Demonstrates initiative, commitment, and transferable skills:</p>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-1">Volunteer Tutor | Local Community Centre | Sep 2023 - Present</p>
                <ul className="list-disc pl-6 text-xs">
                  <li>Tutor GCSE Maths to 5 students weekly, improving their grades by average of 2 levels</li>
                  <li>Developed personalized learning plans for each student</li>
                  <li>Demonstrates patience, communication skills, and commitment to helping others</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Achievements & Awards</h4>
              <p className="text-gray-700 mb-3">Any recognition you've received:</p>
              <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                <li>Dean's List for Academic Excellence (2023, 2024)</li>
                <li>Winner, University Business Plan Competition (£1,000 prize)</li>
                <li>Duke of Edinburgh Gold Award</li>
                <li>Grade 8 Piano (Distinction)</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Complete First Job CV Example</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
            <div className="font-mono text-sm">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold mb-2">EMILY JOHNSON</p>
                <p className="text-xs">London, UK | 07700 900123 | emily.johnson@email.com | linkedin.com/in/emilyjohnson</p>
              </div>

              <div className="mb-6">
                <p className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-1">PERSONAL STATEMENT</p>
                <p className="text-xs">Motivated Business Management graduate from University of Manchester with First Class Honours. Developed strong analytical and communication skills through group projects and a 6-month internship at Deloitte. Passionate about pursuing a career in management consulting and eager to apply my problem-solving abilities and business acumen to support client success.</p>
              </div>

              <div className="mb-6">
                <p className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-1">EDUCATION</p>
                <p className="font-semibold">First Class BA (Hons) Business Management</p>
                <p className="text-xs mb-2">University of Manchester | Sep 2021 - Jun 2024</p>
                <ul className="list-disc pl-6 mb-4 text-xs">
                  <li>Relevant modules: Strategic Management (85%), Financial Analysis (82%), Marketing (78%)</li>
                  <li>Dissertation: "Digital Transformation in UK Retail" (First Class - 78%)</li>
                  <li>President of Business Society - organized 5 networking events with 200+ attendees</li>
                </ul>
                
                <p className="font-semibold">A-Levels</p>
                <p className="text-xs">St Mary's Sixth Form | 2019-2021: Business Studies (A*), Mathematics (A), Economics (A)</p>
              </div>

              <div className="mb-6">
                <p className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-1">WORK EXPERIENCE</p>
                
                <p className="font-semibold">Business Analyst Intern | Deloitte | Jun 2023 - Dec 2023</p>
                <ul className="list-disc pl-6 mb-4 text-xs">
                  <li>Supported consulting team in delivering £500K project for FTSE 100 client</li>
                  <li>Conducted market research and competitor analysis for 3 client projects</li>
                  <li>Created PowerPoint presentations for C-suite stakeholders</li>
                  <li>Analyzed financial data using Excel to identify cost-saving opportunities worth £150K</li>
                </ul>

                <p className="font-semibold">Sales Assistant | Waterstones | Sep 2021 - May 2023</p>
                <ul className="list-disc pl-6 text-xs">
                  <li>Provided customer service to 50+ customers daily in busy bookshop</li>
                  <li>Achieved 98% customer satisfaction rating</li>
                  <li>Managed stock inventory and visual merchandising</li>
                  <li>Trained 2 new staff members on till systems and customer service</li>
                </ul>
              </div>

              <div className="mb-6">
                <p className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-1">SKILLS</p>
                <p className="text-xs mb-2"><strong>Technical:</strong> Excel (Advanced), PowerPoint, Word, Tableau, SQL (Basic), Google Analytics</p>
                <p className="text-xs mb-2"><strong>Professional:</strong> Data Analysis, Market Research, Stakeholder Communication, Project Support</p>
                <p className="text-xs"><strong>Languages:</strong> English (Native), French (Intermediate - B1)</p>
              </div>

              <div>
                <p className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-1">ACHIEVEMENTS</p>
                <ul className="list-disc pl-6 text-xs">
                  <li>Winner, University Business Plan Competition 2023 (£1,000 prize)</li>
                  <li>Dean's List for Academic Excellence (2023, 2024)</li>
                  <li>Volunteer Tutor, Local Community Centre (2022-Present)</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Top Tips for First Job CVs</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900 font-semibold mb-1">✅ Keep It to 1-2 Pages</p>
              <p className="text-green-800 text-sm">One page is fine if you're truly entry-level. Two pages if you have internships and substantial university activities.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900 font-semibold mb-1">✅ Tailor to Each Job</p>
              <p className="text-green-800 text-sm">Customize your personal statement and highlight relevant skills for each application. Use keywords from the job description.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900 font-semibold mb-1">✅ Use Numbers Wherever Possible</p>
              <p className="text-green-800 text-sm">Even in part-time jobs: "Served 100+ customers daily", "Managed £5,000 daily till", "Trained 3 new staff"</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900 font-semibold mb-1">✅ Emphasize Transferable Skills</p>
              <p className="text-green-800 text-sm">Communication, teamwork, problem-solving, time management - these matter more than you think.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-900 font-semibold mb-1">✅ Proofread Multiple Times</p>
              <p className="text-green-800 text-sm">Typos are especially damaging on a first CV. Ask friends, family, or career services to review it.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What NOT to Include on Your First CV</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-900 font-semibold mb-4">❌ Avoid These:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <p className="text-red-900 font-semibold">Photo</p>
                  <p className="text-red-800 text-sm">Unless applying for acting/modeling, don't include a photo on UK CVs</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <p className="text-red-900 font-semibold">Personal Details</p>
                  <p className="text-red-800 text-sm">No date of birth, marital status, or National Insurance number</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <p className="text-red-900 font-semibold">Irrelevant Hobbies</p>
                  <p className="text-red-800 text-sm">"Watching Netflix" or "Socializing with friends" add no value</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <p className="text-red-900 font-semibold">Lies or Exaggerations</p>
                  <p className="text-red-800 text-sm">Be honest - employers will verify qualifications and references</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <p className="text-red-900 font-semibold">"References Available Upon Request"</p>
                  <p className="text-red-800 text-sm">This is assumed - don't waste space stating it</p>
                </div>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Create Your First CV with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Creating your first CV can be overwhelming. <strong>My CV Buddy</strong> helps you build a professional first CV by guiding you through what to include and formatting it perfectly.
          </p>
          
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered First CV Builder</h3>
            <p className="text-green-100 mb-6">
              Our AI helps you identify transferable skills from your education and any experience you have. It creates a professional, ATS-friendly CV that highlights your potential and gets you interviews for entry-level roles.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition inline-block"
              >
                Start Your First CV
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Education is your strength</strong> - include detailed information</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>All experience counts</strong> - part-time jobs, volunteering, projects</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Focus on transferable skills</strong> - communication, teamwork, problem-solving</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Quantify achievements</strong> - use numbers even for small accomplishments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Tailor for each job</strong> - customize your personal statement and skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Keep it professional</strong> - proofread carefully and use a clean format</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/graduate-cv-no-experience-uk" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">Graduate CV with No Experience</h4>
                <p className="text-gray-600 text-sm">Complete guide for recent graduates</p>
              </Link>
              <Link href="/blog/cv-personal-statement-examples" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">CV Personal Statement Examples</h4>
                <p className="text-gray-600 text-sm">15 examples including entry-level</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
