import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Career Change CV: How to Switch Industries in the UK (2025) | CV Adapter',
  description: 'Complete guide to writing a career change CV in the UK. Learn how to highlight transferable skills and land your dream role in a new industry.',
  keywords: 'career change CV UK, switching careers, transferable skills CV, career transition UK, change industry CV',
  openGraph: {
    title: 'Career Change CV: How to Switch Industries in the UK (2025)',
    description: 'Expert strategies for creating a compelling career change CV that gets interviews in your new industry.',
    type: 'article',
  }
}

export default function CareerChangeCVGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CV Adapter
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Try Free
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Career Change CV: How to Switch Industries in the UK (2025)
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <time dateTime="2025-11-09">November 9, 2025</time>
          <span>•</span>
          <span>12 min read</span>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl mb-8 flex items-center justify-center">
          <p className="text-gray-500 text-lg">🔄 Career Change Guide</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Thinking about switching careers? You're not alone. <strong>Nearly 60% of UK workers</strong> have considered 
            a career change in 2025, but many struggle with one crucial question: <em>How do I write a CV when I have no 
            experience in my target industry?</em>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The good news? With the right approach, you can create a compelling career change CV that highlights your 
            transferable skills and convinces employers you're the perfect fit—even without direct industry experience.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">💡 Key Insight</p>
            <p className="text-blue-800">
              Employers hiring career changers aren't looking for industry experience—they're looking for <strong>transferable 
              skills, adaptability, and genuine motivation</strong>. Your CV needs to showcase these qualities.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Why Career Changes Are More Common Than Ever</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The UK job market has transformed dramatically:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Remote work revolution:</strong> Geographic barriers have disappeared, opening new opportunities</li>
            <li><strong>Skills-based hiring:</strong> Employers increasingly value skills over traditional qualifications</li>
            <li><strong>Economic shifts:</strong> Industries like tech, green energy, and healthcare are booming</li>
            <li><strong>Life priorities:</strong> Post-pandemic, workers prioritize work-life balance and meaningful work</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Career Change CV Structure</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A career change CV requires a different approach than a traditional CV. Here's the winning structure:
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">1. Professional Summary (Critical!)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your professional summary is your elevator pitch. It must immediately address the elephant in the room: 
            why you're changing careers and what value you bring.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-900 font-semibold mb-3">✅ Strong Career Change Summary:</p>
            <p className="text-green-800 italic mb-4">
              "Results-driven Marketing Manager with 8+ years in retail, transitioning to digital marketing. Proven track 
              record of increasing customer engagement by 45% through data-driven campaigns. Completed Google Digital Marketing 
              Certificate and managed £200K+ marketing budgets. Seeking to leverage analytical skills and customer insights 
              in a Digital Marketing Specialist role."
            </p>
            <p className="text-green-900 font-semibold mb-2">Why it works:</p>
            <ul className="list-disc pl-6 text-green-800 space-y-1">
              <li>Acknowledges the career change upfront</li>
              <li>Highlights transferable achievements with numbers</li>
              <li>Shows commitment (certification)</li>
              <li>Clearly states target role</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-900 font-semibold mb-3">❌ Weak Career Change Summary:</p>
            <p className="text-red-800 italic mb-4">
              "Experienced professional looking for new opportunities in a different field. Hard worker with good 
              communication skills and team player attitude."
            </p>
            <p className="text-red-900 font-semibold mb-2">Why it fails:</p>
            <ul className="list-disc pl-6 text-red-800 space-y-1">
              <li>Vague and generic</li>
              <li>No specific achievements or skills</li>
              <li>Doesn't explain the career change</li>
              <li>No target role mentioned</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">2. Skills Section (Your Secret Weapon)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Place your skills section prominently—right after your professional summary. This immediately shows 
            employers you have what they need, regardless of your previous job titles.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Organize skills into categories:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Technical Skills:</strong> Software, tools, platforms relevant to your target role</li>
            <li><strong>Transferable Skills:</strong> Project management, data analysis, stakeholder communication</li>
            <li><strong>Industry Knowledge:</strong> Certifications, courses, or self-study you've completed</li>
          </ul>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <p className="text-purple-900 font-semibold mb-3">💼 Example: Teacher → UX Designer</p>
            <p className="text-purple-800 mb-2"><strong>Technical Skills:</strong></p>
            <p className="text-purple-800 mb-4">Figma, Adobe XD, User Research, Wireframing, Prototyping, Usability Testing</p>
            <p className="text-purple-800 mb-2"><strong>Transferable Skills:</strong></p>
            <p className="text-purple-800 mb-4">Curriculum Design (Information Architecture), Student Feedback Analysis (User Research), 
            Classroom Management (Stakeholder Management), Lesson Planning (Project Planning)</p>
            <p className="text-purple-800 mb-2"><strong>Certifications:</strong></p>
            <p className="text-purple-800">Google UX Design Professional Certificate, Nielsen Norman Group UX Certification</p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">3. Work Experience (Reframed for Relevance)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Don't hide your previous career—reframe it! For each role, emphasize responsibilities and achievements 
            that align with your target industry.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>The STAR Method for Career Changers:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Situation:</strong> Brief context</li>
            <li><strong>Task:</strong> What you needed to achieve</li>
            <li><strong>Action:</strong> Transferable skills you used</li>
            <li><strong>Result:</strong> Quantifiable outcome</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900 font-semibold mb-3">📊 Example: Sales → Data Analyst</p>
            <p className="text-blue-800 mb-2"><strong>Before (Sales-focused):</strong></p>
            <p className="text-blue-800 italic mb-4">
              "Sold software solutions to enterprise clients. Met quarterly targets and built strong client relationships."
            </p>
            <p className="text-blue-800 mb-2"><strong>After (Data-focused):</strong></p>
            <p className="text-blue-800 italic">
              "Analyzed customer data using Salesforce and Excel to identify high-value prospects, resulting in 35% increase 
              in conversion rates. Created weekly performance dashboards tracking 15+ KPIs to optimize sales strategy. 
              Collaborated with product team to interpret customer feedback data, influencing 3 major feature releases."
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">4. Education & Professional Development</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            This section is crucial for career changers. Include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Relevant certifications:</strong> Google, AWS, HubSpot, professional bodies</li>
            <li><strong>Online courses:</strong> Coursera, Udemy, LinkedIn Learning (with completion dates)</li>
            <li><strong>Bootcamps:</strong> Coding bootcamps, UX design programs, data science courses</li>
            <li><strong>Traditional education:</strong> Degrees (even if unrelated, they show you can learn)</li>
            <li><strong>Self-directed learning:</strong> Personal projects, GitHub repositories, portfolio work</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Top 10 Transferable Skills Employers Value</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These skills transfer across virtually any industry:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">1. Project Management</h4>
              <p className="text-sm text-gray-600">Planning, organizing, and delivering projects on time and budget</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">2. Data Analysis</h4>
              <p className="text-sm text-gray-600">Interpreting data to make informed business decisions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">3. Communication</h4>
              <p className="text-sm text-gray-600">Written and verbal communication with diverse stakeholders</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">4. Problem-Solving</h4>
              <p className="text-sm text-gray-600">Identifying issues and implementing creative solutions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">5. Leadership</h4>
              <p className="text-sm text-gray-600">Managing teams, mentoring, and driving results</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">6. Budget Management</h4>
              <p className="text-sm text-gray-600">Financial planning and resource allocation</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">7. Customer Service</h4>
              <p className="text-sm text-gray-600">Understanding and meeting client/user needs</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">8. Process Improvement</h4>
              <p className="text-sm text-gray-600">Streamlining workflows and increasing efficiency</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">9. Stakeholder Management</h4>
              <p className="text-sm text-gray-600">Building relationships and managing expectations</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">10. Adaptability</h4>
              <p className="text-sm text-gray-600">Learning quickly and thriving in changing environments</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Common Career Change Mistakes to Avoid</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #1: Apologizing for Your Background</h4>
              <p className="text-red-800">
                Never write "Although I don't have direct experience..." or "Despite my background in...". 
                Frame your experience as an asset, not a liability.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #2: Using Generic Job Descriptions</h4>
              <p className="text-red-800">
                Don't copy-paste your old job descriptions. Rewrite every bullet point to highlight skills 
                relevant to your target industry.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #3: Ignoring Keywords</h4>
              <p className="text-red-800">
                Career changers must be extra careful with ATS optimization. Study job descriptions and 
                include relevant keywords naturally throughout your CV.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #4: Sending the Same CV Everywhere</h4>
              <p className="text-red-800">
                Career changers need hyper-targeted CVs. Customize your CV for each application, emphasizing 
                different transferable skills based on the job requirements.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Real Career Change Success Stories</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-green-900 font-bold mb-2">📚 Teacher → Software Developer</h4>
              <p className="text-green-800 mb-3">
                <strong>Sarah, 34, London</strong>
              </p>
              <p className="text-green-800 mb-3">
                "I taught secondary school maths for 10 years. I highlighted my problem-solving skills, 
                logical thinking, and experience breaking down complex concepts. I completed a coding bootcamp 
                and built 3 portfolio projects. Within 2 months, I landed a junior developer role at £45K."
              </p>
              <p className="text-green-800 text-sm italic">
                Key transferable skills: Problem-solving, communication, patience, continuous learning
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-green-900 font-bold mb-2">🏥 Nurse → HR Manager</h4>
              <p className="text-green-800 mb-3">
                <strong>James, 41, Manchester</strong>
              </p>
              <p className="text-green-800 mb-3">
                "After 15 years in nursing, I wanted better work-life balance. I reframed my experience: 
                patient care became 'stakeholder management,' shift coordination became 'resource planning,' 
                and training junior nurses became 'talent development.' I got my CIPD Level 5 and now earn £52K in HR."
              </p>
              <p className="text-green-800 text-sm italic">
                Key transferable skills: People management, conflict resolution, compliance, training
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-green-900 font-bold mb-2">💼 Accountant → Product Manager</h4>
              <p className="text-green-800 mb-3">
                <strong>Priya, 29, Birmingham</strong>
              </p>
              <p className="text-green-800 mb-3">
                "I was bored with spreadsheets and wanted to build products. I emphasized my analytical skills, 
                stakeholder communication, and project management. I took a Product Management course and 
                volunteered to help a startup with their roadmap. Now I'm a PM at a fintech company earning £65K."
              </p>
              <p className="text-green-800 text-sm italic">
                Key transferable skills: Data analysis, strategic thinking, cross-functional collaboration
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">How to Address Employment Gaps</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Many career changers have gaps while retraining. Here's how to handle them:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Be honest:</strong> Don't try to hide gaps—employers will notice</li>
            <li><strong>Show productivity:</strong> "Career transition period: Completed Google Data Analytics Certificate, 
            built 5 portfolio projects, volunteered as data analyst for local charity"</li>
            <li><strong>Use years only:</strong> "2020-2023" instead of "March 2020 - November 2023" to minimize gap appearance</li>
            <li><strong>Freelance/consulting:</strong> If you did any freelance work, include it as legitimate experience</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Cover Letter: Your Secret Weapon</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            For career changers, a compelling cover letter is non-negotiable. Use it to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Explain your "why":</strong> What motivated your career change? (Keep it positive and professional)</li>
            <li><strong>Connect the dots:</strong> Explicitly link your past experience to the target role</li>
            <li><strong>Show commitment:</strong> Mention courses, certifications, or projects that prove you're serious</li>
            <li><strong>Express enthusiasm:</strong> Genuine passion for the new field can overcome lack of direct experience</li>
          </ul>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Make Your Career Change CV Stand Out</h3>
            <p className="text-lg mb-6">
              CV Adapter's AI automatically highlights your transferable skills and optimizes your CV for your target industry. 
              Get past ATS systems and land interviews in your new career.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-xl transition-all"
            >
              Create Your Career Change CV (Free)
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Final Checklist for Career Change CVs</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="text-blue-900 font-semibold mb-4">✅ Before You Apply:</h4>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Professional summary clearly states your career change and target role</li>
              <li>✓ Skills section prominently displays transferable skills</li>
              <li>✓ Every work experience bullet point emphasizes relevant skills</li>
              <li>✓ Quantifiable achievements included (numbers, percentages, £ amounts)</li>
              <li>✓ Relevant certifications and courses listed</li>
              <li>✓ Keywords from job description naturally incorporated</li>
              <li>✓ ATS-friendly formatting (no tables, graphics, or unusual fonts)</li>
              <li>✓ Tailored for each specific application</li>
              <li>✓ Proofread for spelling and grammar</li>
              <li>✓ Saved as .docx or .pdf (check job posting preference)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Conclusion: Your Career Change Starts Here</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Switching careers in the UK is challenging but absolutely achievable with the right CV strategy. Remember:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Your past experience is an <strong>asset</strong>, not a liability</li>
            <li>Transferable skills are more valuable than industry experience</li>
            <li>Continuous learning shows commitment and adaptability</li>
            <li>Every CV should be tailored to the specific role and company</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            The UK job market in 2025 values skills, potential, and cultural fit over traditional career paths. 
            With a well-crafted career change CV, you can convince employers that your unique background makes you 
            the perfect candidate for their role.
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-gray-600 text-sm">
              <strong>About the Author:</strong> This guide was created by the CV Adapter team, specialists in AI-powered 
              CV optimization. We've helped thousands of UK professionals successfully transition to new careers by 
              highlighting their transferable skills and creating ATS-optimized CVs.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 CV Adapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
