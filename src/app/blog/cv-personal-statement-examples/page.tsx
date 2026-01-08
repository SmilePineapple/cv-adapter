import Link from 'next/link'
import { ArrowLeft, User, CheckCircle, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Personal Statement: 15 Examples & Writing Guide (UK 2025)',
  description: 'Professional CV personal statement examples for all industries and experience levels. Learn how to write a compelling personal statement that gets interviews.',
  keywords: ['CV personal statement', 'personal statement examples', 'CV profile', 'professional summary', 'CV opening statement UK'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/cv-personal-statement-examples'
  },
  openGraph: {
    title: 'CV Personal Statement: 15 Examples & Writing Guide (2025)',
    description: 'Expert guide to writing CV personal statements with real examples for UK jobs.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function CVPersonalStatementExamples() {
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
          <div className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CV Personal Statement: 15 Examples & Writing Guide (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>14 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <User className="w-6 h-6 text-indigo-600 inline mr-2" />
              Your CV personal statement is the first thing recruiters read. A strong personal statement can increase your interview chances by 30%. This guide provides 15 real examples and expert tips for writing one that stands out.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What is a CV Personal Statement?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A CV personal statement (also called a professional summary or profile) is a <strong>3-5 sentence paragraph at the top of your CV</strong> that summarizes your key skills, experience, and career goals. It's your elevator pitch to recruiters.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-4">A Good Personal Statement Should:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Be <strong>50-150 words</strong> (3-5 sentences)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Highlight your <strong>most relevant skills and experience</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Include <strong>quantifiable achievements</strong> where possible</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Be <strong>tailored to the specific job</strong> you're applying for</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Use <strong>keywords from the job description</strong></span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Personal Statement Formula</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Follow this proven structure:
          </p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
            <p className="text-indigo-900 font-semibold mb-4">📝 The 3-Sentence Formula:</p>
            <div className="space-y-3 text-indigo-800">
              <p><strong>Sentence 1:</strong> Who you are + years of experience + key skill/qualification</p>
              <p><strong>Sentence 2:</strong> Your main achievements with numbers/results</p>
              <p><strong>Sentence 3:</strong> What you're looking for + how you'll add value</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">15 CV Personal Statement Examples</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Marketing Manager</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Results-driven Marketing Manager with 7+ years of experience leading digital campaigns for B2B SaaS companies. Proven track record of increasing lead generation by 250% and reducing customer acquisition costs by 40% through data-driven strategies. Seeking to leverage my expertise in marketing automation and team leadership to drive growth for an innovative tech company."
            </p>
            <div className="bg-green-50 rounded p-3 mt-3">
              <p className="text-green-900 text-sm font-semibold mb-1">✅ Why This Works:</p>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Specific job title and years of experience</li>
                <li>• Quantifiable achievements (250%, 40%)</li>
                <li>• Industry-specific keywords (B2B SaaS, marketing automation)</li>
                <li>• Clear value proposition</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Software Developer</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Full-stack Software Developer with 5 years of experience building scalable web applications using React, Node.js, and AWS. Successfully delivered 15+ projects on time and under budget, including a customer portal that improved user satisfaction scores by 35%. Passionate about clean code and seeking a challenging role where I can contribute to innovative products."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Recent Graduate (No Experience)</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Recent Business Management graduate from University of Manchester with First Class Honours. Completed a 6-month internship at Deloitte where I supported the consulting team in delivering a £500K project for a FTSE 100 client. Strong analytical and communication skills, with proficiency in Excel, PowerPoint, and Tableau. Eager to begin my career in management consulting."
            </p>
            <div className="bg-purple-50 rounded p-3 mt-3">
              <p className="text-purple-900 text-sm font-semibold mb-1">💡 Graduate Tip:</p>
              <p className="text-purple-800 text-sm">Emphasize education, internships, and transferable skills when you lack full-time work experience.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Project Manager</h3>
          <div className="bg-gray-50 border-l-4 border-orange-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "PMP-certified Project Manager with 8 years of experience delivering complex IT infrastructure projects worth up to £5M. Expert in Agile and Waterfall methodologies, with a 98% on-time delivery rate. Led cross-functional teams of up to 25 people and consistently achieved project goals within budget. Seeking a senior PM role in a fast-paced technology environment."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Sales Executive</h3>
          <div className="bg-gray-50 border-l-4 border-red-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "High-performing Sales Executive with 6 years of experience in B2B software sales. Consistently exceeded quarterly targets by 30%+ and closed deals worth over £2M annually. Skilled in consultative selling, CRM management (Salesforce), and building long-term client relationships. Looking to bring my proven sales expertise to a growing SaaS company."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Registered Nurse (NHS)</h3>
          <div className="bg-gray-50 border-l-4 border-pink-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Compassionate Registered Nurse with 4 years of experience in acute medical wards. NMC registered with post-registration qualifications in acute care. Experienced in patient assessment, medication administration, and care planning. Received 'Nurse of the Year' award in 2024 for outstanding patient care. Seeking a Band 6 position to further develop my clinical leadership skills."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Teacher (Primary)</h3>
          <div className="bg-gray-50 border-l-4 border-yellow-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Qualified Primary School Teacher with QTS and 5 years of experience teaching Key Stage 2. Proven ability to raise student attainment, with my Year 6 class achieving 92% pass rate in SATs (15% above national average). Skilled in differentiation, behaviour management, and creating engaging lesson plans. Passionate about fostering a love of learning in young children."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Accountant</h3>
          <div className="bg-gray-50 border-l-4 border-teal-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "ACCA-qualified Accountant with 6 years of experience in financial reporting and audit for mid-sized manufacturing companies. Expert in UK GAAP and IFRS, with strong proficiency in Sage, Xero, and Excel. Successfully led year-end audits resulting in zero material misstatements for 3 consecutive years. Seeking a Senior Accountant role with opportunities for progression to Financial Controller."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Career Changer (Teaching to HR)</h3>
          <div className="bg-gray-50 border-l-4 border-indigo-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Former Secondary School Teacher transitioning to HR with CIPD Level 5 qualification and 8 years of people management experience. Skilled in training delivery, performance management, and conflict resolution. Successfully mentored 15+ trainee teachers and improved staff retention by 20% through wellbeing initiatives. Eager to apply my people development expertise in a corporate HR environment."
            </p>
            <div className="bg-indigo-50 rounded p-3 mt-3">
              <p className="text-indigo-900 text-sm font-semibold mb-1">🔄 Career Change Tip:</p>
              <p className="text-indigo-800 text-sm">Highlight transferable skills and any relevant training/certifications for your new field.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Data Analyst</h3>
          <div className="bg-gray-50 border-l-4 border-cyan-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Data Analyst with 4 years of experience turning complex datasets into actionable business insights. Proficient in SQL, Python, Tableau, and Power BI. Built automated reporting dashboards that saved 20 hours per week and identified £300K in cost savings through data-driven recommendations. Seeking a senior analyst role in a data-driven organization."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Customer Service Manager</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Customer Service Manager with 7 years of experience leading teams of up to 30 agents in fast-paced call center environments. Improved customer satisfaction scores from 72% to 91% and reduced average handling time by 25% through process optimization and team training. Experienced in Zendesk, Salesforce Service Cloud, and workforce management."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Graphic Designer</h3>
          <div className="bg-gray-50 border-l-4 border-pink-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Creative Graphic Designer with 5 years of experience crafting compelling visual identities for B2C brands. Expert in Adobe Creative Suite, Figma, and brand strategy. Portfolio includes award-winning campaigns that increased brand engagement by 150%. Passionate about creating designs that tell stories and drive business results."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Operations Manager</h3>
          <div className="bg-gray-50 border-l-4 border-orange-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Operations Manager with 9 years of experience optimizing supply chain and logistics for e-commerce companies. Reduced operational costs by 30% and improved delivery times by 40% through process re-engineering and vendor negotiations. Lean Six Sigma Black Belt certified. Seeking a senior operations role in a high-growth environment."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. HR Business Partner</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Strategic HR Business Partner with 8 years of experience supporting C-suite executives in tech startups. CIPD Level 7 qualified with expertise in talent acquisition, employee relations, and organizational development. Successfully scaled HR operations through 3 funding rounds, growing headcount from 50 to 300 employees while maintaining 85%+ retention rate."
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Civil Engineer</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-gray-800 italic mb-3">
              "Chartered Civil Engineer (CEng MICE) with 10 years of experience delivering major infrastructure projects worth up to £50M. Specialist in structural design and project delivery using BIM and AutoCAD. Led the design team for a award-winning bridge project completed 10% under budget. Seeking a Principal Engineer role with a leading consultancy."
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Write Your Personal Statement</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Start with Your Job Title & Experience</h3>
                  <p className="text-gray-600 mb-2">Begin with your current or most recent job title and years of experience.</p>
                  <p className="text-gray-500 text-sm italic">Example: "Marketing Manager with 7+ years of experience..."</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Add Your Key Skills & Specialization</h3>
                  <p className="text-gray-600 mb-2">Mention 2-3 core skills or areas of expertise relevant to the target role.</p>
                  <p className="text-gray-500 text-sm italic">Example: "...specializing in digital marketing and data analytics..."</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Include Quantifiable Achievements</h3>
                  <p className="text-gray-600 mb-2">Add 1-2 specific achievements with numbers to prove your impact.</p>
                  <p className="text-gray-500 text-sm italic">Example: "...increased lead generation by 250% and reduced costs by 40%..."</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">State What You're Looking For</h3>
                  <p className="text-gray-600 mb-2">End with what type of role you're seeking and how you'll add value.</p>
                  <p className="text-gray-500 text-sm italic">Example: "...seeking to leverage my expertise to drive growth for an innovative tech company."</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes to Avoid</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Being Too Generic</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "Hard-working professional seeking a challenging role."</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Marketing Manager with 7 years of B2B experience, proven track record of 250% lead growth."</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Using First Person</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "I am a marketing manager with 7 years of experience..."</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Marketing Manager with 7 years of experience..."</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Being Too Long</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> A 200-word paragraph that recruiters won't read.</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> 3-5 concise sentences (50-150 words) that get to the point.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ No Numbers or Achievements</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "Experienced in sales with good results."</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Consistently exceeded targets by 30%+ and closed £2M in annual sales."</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Personal Statement vs Professional Summary</h2>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Aspect</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Personal Statement</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Professional Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Best For</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Graduates, career changers</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Experienced professionals</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Focus</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Skills, goals, potential</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Achievements, results, expertise</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Tone</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Aspirational</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Results-driven</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Length</td>
                  <td className="px-6 py-4 text-sm text-gray-700">3-5 sentences</td>
                  <td className="px-6 py-4 text-sm text-gray-700">3-5 sentences</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Generate Perfect Personal Statements with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Writing a compelling personal statement for each application is time-consuming. <strong>My CV Buddy</strong> uses AI to generate tailored personal statements that highlight your most relevant experience.
          </p>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered Personal Statement Generator</h3>
            <p className="text-indigo-100 mb-6">
              Upload your CV and paste the job description. Our AI analyzes both and creates a personalized statement that matches the role's requirements. Edit, refine, and use it in seconds.
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

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Keep it <strong>3-5 sentences (50-150 words)</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Start with <strong>job title + years of experience</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Include <strong>quantifiable achievements</strong> with numbers</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Tailor it</strong> to each job application</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Use <strong>keywords from the job description</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Avoid first person ("I am...") - write in <strong>third person</strong></span>
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
