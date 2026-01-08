import Link from 'next/link'
import { ArrowLeft, Target, CheckCircle, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Skills Section: What to Include + Examples (UK 2025)',
  description: 'Complete guide to writing a CV skills section that impresses recruiters. Learn which skills to include, how to format them, and see real examples.',
  keywords: ['CV skills section', 'CV skills examples', 'what skills to put on CV', 'CV skills list', 'technical skills CV', 'soft skills CV'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/cv-skills-section-guide'
  },
  openGraph: {
    title: 'CV Skills Section: What to Include + Examples (2025)',
    description: 'Expert guide to creating a skills section that gets you interviews.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
  },
}

export default function CVSkillsSectionGuide() {
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
          <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CV Skills Section: What to Include + Examples (2025)
          </h1>
          <div className="flex items-center space-x-6 text-gray-600 text-sm">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>11 min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-l-4 border-teal-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-800 font-medium mb-0">
              <Target className="w-6 h-6 text-teal-600 inline mr-2" />
              Your CV skills section is crucial for passing ATS systems and catching recruiters' attention. This guide shows you exactly which skills to include, how to format them, and provides real examples for different industries.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why Your Skills Section Matters</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The skills section is one of the first places recruiters and ATS systems look. It provides a quick snapshot of your capabilities and helps match you to job requirements. <strong>92% of recruiters</strong> use ATS systems that scan for specific skills keywords.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">📊 Research Shows</p>
            <p className="text-blue-800">
              CVs with a well-structured skills section are <strong>40% more likely to pass ATS screening</strong> and get reviewed by human recruiters.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Types of Skills to Include</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Technical Skills (Hard Skills)</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-purple-500">
            <p className="text-gray-700 mb-4">Specific, teachable abilities that can be measured and verified:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Technology:</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Programming languages (Python, JavaScript, Java)</li>
                  <li>• Software (Excel, Salesforce, Adobe Creative Suite)</li>
                  <li>• Databases (SQL, MongoDB, PostgreSQL)</li>
                  <li>• Cloud platforms (AWS, Azure, Google Cloud)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Professional:</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Data analysis & visualization</li>
                  <li>• Financial modeling & forecasting</li>
                  <li>• Project management methodologies</li>
                  <li>• Digital marketing (SEO, PPC, Analytics)</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Soft Skills (Transferable Skills)</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
            <p className="text-gray-700 mb-4">Personal attributes and interpersonal abilities:</p>
            <div className="bg-green-50 rounded p-4 mb-4">
              <p className="text-green-900 font-semibold mb-2">✅ Include These (with evidence):</p>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• Leadership & team management</li>
                <li>• Communication & presentation skills</li>
                <li>• Problem-solving & critical thinking</li>
                <li>• Stakeholder management</li>
                <li>• Time management & organization</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded p-4">
              <p className="text-red-900 font-semibold mb-2">❌ Avoid Generic Claims:</p>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• "Hard worker" - too vague</li>
                <li>• "Team player" - overused cliché</li>
                <li>• "Fast learner" - everyone says this</li>
                <li>• "Detail-oriented" - prove it instead</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Industry-Specific Skills</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-orange-500">
            <p className="text-gray-700 mb-4">Skills unique to your field or sector:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Healthcare:</p>
                <p className="text-gray-700 text-sm">Patient assessment, medication administration, clinical documentation, infection control</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Finance:</p>
                <p className="text-gray-700 text-sm">Financial reporting, audit, UK GAAP, IFRS, VAT compliance, risk management</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Marketing:</p>
                <p className="text-gray-700 text-sm">SEO/SEM, content marketing, marketing automation, Google Analytics, A/B testing</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Education:</p>
                <p className="text-gray-700 text-sm">Curriculum planning, differentiation, behavior management, assessment, safeguarding</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Format Your Skills Section</h2>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Format Option 1: Categorized List (Recommended)</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-6">
            <div className="font-mono text-sm">
              <p className="font-bold mb-3">SKILLS</p>
              
              <p className="font-semibold mb-1">Technical Skills:</p>
              <p className="mb-3">Python, SQL, Tableau, Power BI, Excel (Advanced), Google Analytics, Salesforce</p>
              
              <p className="font-semibold mb-1">Project Management:</p>
              <p className="mb-3">Agile, Scrum, PRINCE2, Jira, Confluence, Risk Management, Stakeholder Engagement</p>
              
              <p className="font-semibold mb-1">Languages:</p>
              <p>English (Native), French (Fluent - C1), Spanish (Conversational - B1)</p>
            </div>
            <div className="bg-blue-50 rounded p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-2">✅ Why This Works:</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Easy for ATS to scan</li>
                <li>• Clear organization by category</li>
                <li>• Highlights most relevant skills first</li>
                <li>• Includes proficiency levels where appropriate</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Format Option 2: Simple List</h3>
          <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6">
            <div className="font-mono text-sm">
              <p className="font-bold mb-3">KEY SKILLS</p>
              <p>JavaScript • React • Node.js • AWS • Docker • PostgreSQL • Git • CI/CD • Agile • TDD</p>
            </div>
            <div className="bg-green-50 rounded p-4 mt-4">
              <p className="text-green-900 font-semibold mb-2">✅ Best For:</p>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• Technical roles with many tools/technologies</li>
                <li>• When space is limited</li>
                <li>• Skills that don't need categorization</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Format Option 3: Skills with Context</h3>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-6">
            <div className="font-mono text-sm">
              <p className="font-bold mb-3">CORE COMPETENCIES</p>
              
              <p className="font-semibold mb-1">• Data Analysis & Visualization</p>
              <p className="text-xs mb-2 ml-2">Expert in SQL, Python, Tableau - built 20+ dashboards for C-suite</p>
              
              <p className="font-semibold mb-1">• Project Management</p>
              <p className="text-xs mb-2 ml-2">PMP certified - delivered 15+ projects worth £10M+ on time and under budget</p>
              
              <p className="font-semibold mb-1">• Team Leadership</p>
              <p className="text-xs ml-2">Managed cross-functional teams of up to 25 people across 3 countries</p>
            </div>
            <div className="bg-purple-50 rounded p-4 mt-4">
              <p className="text-purple-900 font-semibold mb-2">✅ Best For:</p>
              <ul className="text-purple-800 space-y-1 text-sm">
                <li>• Senior-level positions</li>
                <li>• When you want to add credibility</li>
                <li>• Highlighting major achievements</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Skills Section Examples by Industry</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Software Developer</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-2">Technical Skills:</p>
                <p className="mb-3">JavaScript, TypeScript, React, Node.js, Python, Java, SQL, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, Git, CI/CD</p>
                
                <p className="font-semibold mb-2">Frameworks & Tools:</p>
                <p className="mb-3">Next.js, Express.js, Django, Spring Boot, Jest, Cypress, Jenkins, Terraform</p>
                
                <p className="font-semibold mb-2">Methodologies:</p>
                <p>Agile, Scrum, TDD, Microservices Architecture, RESTful APIs, GraphQL</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Manager</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-2">Digital Marketing:</p>
                <p className="mb-3">SEO, SEM, PPC, Content Marketing, Email Marketing, Social Media Marketing, Marketing Automation</p>
                
                <p className="font-semibold mb-2">Tools & Platforms:</p>
                <p className="mb-3">Google Analytics, Google Ads, HubSpot, Salesforce, Mailchimp, Hootsuite, SEMrush, Ahrefs</p>
                
                <p className="font-semibold mb-2">Skills:</p>
                <p>Campaign Strategy, Data Analysis, A/B Testing, Budget Management, Team Leadership</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accountant</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-2">Accounting:</p>
                <p className="mb-3">Financial Reporting, Management Accounts, Audit, Budgeting & Forecasting, Cash Flow Management</p>
                
                <p className="font-semibold mb-2">Software:</p>
                <p className="mb-3">Sage 50/200, Xero, QuickBooks, Excel (Advanced - VLOOKUPs, Pivot Tables, Macros)</p>
                
                <p className="font-semibold mb-2">Standards & Compliance:</p>
                <p>UK GAAP, IFRS, VAT, Corporation Tax, FRS 102</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Project Manager</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <p className="font-semibold mb-2">Methodologies:</p>
                <p className="mb-3">Agile, Scrum, Waterfall, PRINCE2, Lean, Six Sigma</p>
                
                <p className="font-semibold mb-2">Tools:</p>
                <p className="mb-3">Jira, Confluence, MS Project, Asana, Trello, Smartsheet</p>
                
                <p className="font-semibold mb-2">Core Skills:</p>
                <p>Risk Management, Stakeholder Management, Resource Planning, Budget Control, Team Leadership</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Choose Which Skills to Include</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-teal-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Read the Job Description Carefully</h3>
                  <p className="text-gray-600">Highlight all skills mentioned. These are your ATS keywords - include them if you have them.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-teal-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Prioritize Relevant Skills</h3>
                  <p className="text-gray-600">List skills most relevant to the target role first. Less relevant skills go at the end or are omitted.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-teal-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Be Honest About Proficiency</h3>
                  <p className="text-gray-600">Only include skills you can confidently discuss in an interview. Don't lie - you'll be found out.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-teal-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Remove Outdated Skills</h3>
                  <p className="text-gray-600">Delete obsolete technologies (Windows XP, Flash, outdated programming languages) unless specifically requested.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-teal-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Include Certifications</h3>
                  <p className="text-gray-600">Professional qualifications add credibility: PMP, ACCA, AWS Certified, CIPD, etc.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Skills Section Mistakes</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Using Skill Rating Bars</p>
              <p className="text-red-800 text-sm">ATS systems can't read graphics. Use text only: "Advanced", "Intermediate", "Proficient"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Listing Too Many Skills</p>
              <p className="text-red-800 text-sm">Quality over quantity. 10-15 relevant skills is better than 50 generic ones.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Being Too Vague</p>
              <p className="text-red-800 text-sm mb-2"><strong>Bad:</strong> "Computer skills"</p>
              <p className="text-green-800 text-sm"><strong>Good:</strong> "Excel (Advanced), Salesforce, SQL, Python"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-1">❌ Including Obvious Skills</p>
              <p className="text-red-800 text-sm">Don't list "Microsoft Word" or "Email" unless it's a very entry-level role. These are assumed.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Should You Include Soft Skills?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Yes, but with caution.</strong> Soft skills are important, but they need to be backed up with evidence in your work experience section.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Good Approach:
              </h3>
              <p className="text-green-800 text-sm mb-3">List soft skills in your skills section, then prove them in work experience:</p>
              <div className="bg-white rounded p-3">
                <p className="text-gray-700 text-sm mb-2"><strong>Skills:</strong> Leadership, Stakeholder Management</p>
                <p className="text-gray-700 text-sm"><strong>Experience:</strong> "Led cross-functional team of 12 across 3 departments, managing C-suite stakeholders for £5M project"</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-bold text-red-900 mb-3">❌ Bad Approach:</h3>
              <p className="text-red-800 text-sm mb-3">Listing generic soft skills with no evidence:</p>
              <div className="bg-white rounded p-3">
                <p className="text-gray-700 text-sm">Hard worker, Team player, Fast learner, Detail-oriented, Self-motivated</p>
                <p className="text-red-600 text-xs mt-2 italic">These are clichés that everyone claims. Prove them instead.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Generate Your Perfect Skills Section with AI</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Identifying the right skills and formatting them properly can be challenging. <strong>My CV Buddy</strong> uses AI to analyze job descriptions and automatically create optimized skills sections.
          </p>
          
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered Skills Optimization</h3>
            <p className="text-teal-100 mb-6">
              Upload your CV and paste the job description. Our AI extracts relevant skills from both, matches them to ATS keywords, and creates a perfectly formatted skills section that passes screening systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 transition inline-block"
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
                <span className="text-gray-700"><strong>Match job description keywords</strong> for ATS optimization</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Use <strong>categorized format</strong> for clarity and scannability</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Include <strong>technical skills, industry skills, and relevant soft skills</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Be specific</strong> - "Python, SQL" not "computer skills"</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Prove soft skills</strong> with evidence in work experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700"><strong>Update regularly</strong> - remove outdated skills, add new ones</span>
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
              <Link href="/blog/how-to-beat-ats-systems" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">How to Beat ATS Systems</h4>
                <p className="text-gray-600 text-sm">Optimize your CV for applicant tracking systems</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
