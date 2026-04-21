import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, FileText, Briefcase, GraduationCap, Code, Heart, Building2, TrendingUp, Users, Wrench, ShoppingBag, Palette, Shield, FlaskConical, Plane, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CV Examples UK 2026: 15+ Professional CV Samples by Industry',
  description: 'Browse 15+ real CV examples UK employers hire from (updated 2026, previously 2024). Marketing, IT, healthcare, finance & more. ATS-optimised UK format, free to view — no sign-up needed.',
  keywords: [
    'cv examples uk',
    'cv examples',
    'examples of cv uk',
    'cv sample uk',
    'cv samples uk',
    'cv template examples uk',
    'example cv uk',
    'examples cv uk',
    'cv uk example',
    'professional cv examples',
    'cv examples by industry',
    'best cv examples uk',
    'cv samples',
    'curriculum vitae examples uk',
    'cv layout examples uk',
    'cv template uk examples',
    'cv in uk examples',
    'great cv examples uk',
    'excellent cv examples uk',
    'simple cv examples uk',
    'free cv builder uk',
    'ats cv examples',
    'cv examples 2024',
    'cv examples 2025',
    'marketing cv examples uk',
    'british cv examples',
    'british cv example',
    'professional cv examples uk',
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/cv-examples',
  },
  openGraph: {
    title: 'CV Examples UK 2026: 15+ Professional CV Samples by Industry',
    description: 'Real CV examples UK employers hire from. Industry-specific samples for marketing, IT, healthcare, finance & more.',
    url: 'https://www.mycvbuddy.com/cv-examples',
    type: 'article',
    modifiedTime: '2026-04-20T00:00:00Z',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Examples by Industry',
      },
    ],
  },
}

const industries = [
  {
    icon: TrendingUp,
    name: 'Marketing & Communications',
    color: 'blue',
    examples: ['Digital Marketing Manager', 'Social Media Coordinator', 'Content Marketing Specialist']
  },
  {
    icon: Code,
    name: 'IT & Technology',
    color: 'purple',
    examples: ['Software Developer', 'Data Analyst', 'IT Project Manager']
  },
  {
    icon: Heart,
    name: 'Healthcare & Medical',
    color: 'red',
    examples: ['Registered Nurse', 'Healthcare Assistant', 'Medical Administrator']
  },
  {
    icon: Building2,
    name: 'Finance & Accounting',
    color: 'green',
    examples: ['Financial Analyst', 'Accountant', 'Finance Manager']
  },
  {
    icon: GraduationCap,
    name: 'Education & Teaching',
    color: 'yellow',
    examples: ['Primary Teacher', 'Secondary Teacher', 'Teaching Assistant']
  },
  {
    icon: Wrench,
    name: 'Engineering',
    color: 'orange',
    examples: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer']
  },
  {
    icon: ShoppingBag,
    name: 'Sales & Retail',
    color: 'pink',
    examples: ['Sales Manager', 'Retail Assistant', 'Business Development Manager']
  },
  {
    icon: Palette,
    name: 'Creative & Design',
    color: 'indigo',
    examples: ['Graphic Designer', 'UX/UI Designer', 'Creative Director']
  },
  {
    icon: Shield,
    name: 'Legal & Compliance',
    color: 'gray',
    examples: ['Solicitor', 'Legal Secretary', 'Compliance Officer']
  },
  {
    icon: FlaskConical,
    name: 'Science & Research',
    color: 'teal',
    examples: ['Research Scientist', 'Laboratory Technician', 'Clinical Research Associate']
  },
  {
    icon: Plane,
    name: 'Hospitality & Tourism',
    color: 'cyan',
    examples: ['Hotel Manager', 'Event Coordinator', 'Travel Consultant']
  },
  {
    icon: Users,
    name: 'Human Resources',
    color: 'violet',
    examples: ['HR Manager', 'Recruitment Consultant', 'HR Administrator']
  },
]

const cvExamples = [
  {
    title: 'Digital Marketing Manager CV',
    industry: 'Marketing & Communications',
    experience: '5-7 years',
    salary: '£35,000 - £50,000',
    description: 'Results-driven marketing professional with proven track record in digital campaigns, SEO, and social media management.',
    keyFeatures: [
      'Quantified achievements (150% engagement increase)',
      'Technical skills: Google Analytics, SEMrush, HubSpot',
      'Campaign portfolio highlights',
      'Certifications: Google Ads, Facebook Blueprint'
    ]
  },
  {
    title: 'Software Developer CV',
    industry: 'IT & Technology',
    experience: '3-5 years',
    salary: '£40,000 - £60,000',
    description: 'Full-stack developer specializing in React, Node.js, and cloud technologies with strong problem-solving skills.',
    keyFeatures: [
      'GitHub portfolio link',
      'Tech stack: React, Node.js, AWS, Docker',
      'Project highlights with metrics',
      'Open-source contributions'
    ]
  },
  {
    title: 'Registered Nurse CV',
    industry: 'Healthcare & Medical',
    experience: '2-4 years',
    salary: '£28,000 - £38,000',
    description: 'Compassionate and skilled registered nurse with experience in acute care and patient advocacy.',
    keyFeatures: [
      'NMC registration number',
      'Clinical specializations',
      'Patient care achievements',
      'Mandatory training certifications'
    ]
  },
  {
    title: 'Financial Analyst CV',
    industry: 'Finance & Accounting',
    experience: '4-6 years',
    salary: '£35,000 - £55,000',
    description: 'Detail-oriented financial analyst with expertise in forecasting, budgeting, and financial modeling.',
    keyFeatures: [
      'Financial modeling expertise',
      'Tools: Excel (Advanced), SAP, Tableau',
      'Cost savings achieved (£500K+)',
      'Professional qualifications: ACCA, CFA Level 2'
    ]
  },
  {
    title: 'Primary School Teacher CV',
    industry: 'Education & Teaching',
    experience: '3-5 years',
    salary: '£30,000 - £42,000',
    description: 'Dedicated primary teacher with QTS, experienced in Key Stage 1 and 2 curriculum delivery.',
    keyFeatures: [
      'QTS status and DBS check',
      'Curriculum specializations',
      'Student achievement metrics',
      'Safeguarding training'
    ]
  },
  {
    title: 'Mechanical Engineer CV',
    industry: 'Engineering',
    experience: '5-8 years',
    salary: '£38,000 - £58,000',
    description: 'Chartered mechanical engineer with expertise in product design, CAD, and project management.',
    keyFeatures: [
      'CEng status (IMechE)',
      'CAD software: SolidWorks, AutoCAD',
      'Project portfolio',
      'Cost reduction achievements'
    ]
  },
  {
    title: 'Sales Manager CV',
    industry: 'Sales & Retail',
    experience: '6-10 years',
    salary: '£35,000 - £55,000 + commission',
    description: 'High-performing sales manager with consistent record of exceeding targets and building strong client relationships.',
    keyFeatures: [
      'Sales achievements (200% of target)',
      'Team leadership experience',
      'CRM expertise: Salesforce, HubSpot',
      'Revenue growth metrics'
    ]
  },
  {
    title: 'Graphic Designer CV',
    industry: 'Creative & Design',
    experience: '3-5 years',
    salary: '£28,000 - £42,000',
    description: 'Creative graphic designer with strong portfolio in branding, digital design, and print media.',
    keyFeatures: [
      'Online portfolio link',
      'Adobe Creative Suite mastery',
      'Client list and projects',
      'Design awards and recognition'
    ]
  },
  {
    title: 'Solicitor CV',
    industry: 'Legal & Compliance',
    experience: '5-10 years',
    salary: '£45,000 - £75,000',
    description: 'Qualified solicitor specializing in commercial law with excellent client advocacy skills.',
    keyFeatures: [
      'SRA registration number',
      'Practice areas and specializations',
      'Case success rates',
      'Professional memberships'
    ]
  },
  {
    title: 'Research Scientist CV',
    industry: 'Science & Research',
    experience: '4-7 years',
    salary: '£32,000 - £48,000',
    description: 'PhD-qualified research scientist with publications in peer-reviewed journals and grant funding experience.',
    keyFeatures: [
      'Publications list (h-index)',
      'Research methodologies',
      'Grant funding secured',
      'Laboratory techniques'
    ]
  },
  {
    title: 'Hotel Manager CV',
    industry: 'Hospitality & Tourism',
    experience: '5-8 years',
    salary: '£30,000 - £45,000',
    description: 'Experienced hotel manager with proven track record in operations, guest satisfaction, and revenue management.',
    keyFeatures: [
      'Guest satisfaction scores (95%+)',
      'Revenue growth achievements',
      'Team management (50+ staff)',
      'Industry certifications'
    ]
  },
  {
    title: 'HR Manager CV',
    industry: 'Human Resources',
    experience: '6-10 years',
    salary: '£38,000 - £55,000',
    description: 'Strategic HR manager with expertise in talent acquisition, employee relations, and organizational development.',
    keyFeatures: [
      'CIPD Level 7 qualification',
      'Recruitment metrics',
      'Employee retention improvements',
      'HRIS systems: Workday, BambooHR'
    ]
  },
  {
    title: 'Graduate CV (No Experience)',
    industry: 'All Industries',
    experience: '0-1 years',
    salary: '£22,000 - £28,000',
    description: 'Recent graduate with strong academic background, internship experience, and transferable skills.',
    keyFeatures: [
      'Degree classification and modules',
      'Internships and placements',
      'University projects',
      'Transferable skills focus'
    ]
  },
  {
    title: 'Career Changer CV',
    industry: 'All Industries',
    experience: 'Varies',
    salary: 'Varies',
    description: 'Professional transitioning careers with transferable skills and relevant training/certifications.',
    keyFeatures: [
      'Transferable skills highlighted',
      'Relevant training/courses',
      'Skills-based format',
      'Career change narrative'
    ]
  },
  {
    title: 'Executive/Senior Manager CV',
    industry: 'All Industries',
    experience: '15+ years',
    salary: '£70,000 - £150,000+',
    description: 'Senior executive with strategic leadership experience, P&L responsibility, and board-level reporting.',
    keyFeatures: [
      'Executive summary',
      'Strategic achievements',
      'P&L and budget responsibility',
      'Board experience'
    ]
  },
]

export default function CVExamplesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">CV</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">My CV Buddy</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/auth/login" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 text-sm sm:text-base font-semibold transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Updated April 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              CV Examples UK 2026
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Browse 15+ real CV examples UK employers actually hire from. Industry-specific samples with actual CV text — free to read, no sign-up needed.
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              Each example shows the exact structure, phrasing, and layout that gets past ATS systems and lands interviews at UK companies.
            </p>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center hover:bg-blue-700 transition-colors">
              Tailor Your CV with AI — Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Marketing CV examples UK', 'IT CV examples UK', 'Graduate CV UK', 'British CV examples', 'Healthcare CV UK', 'Professional CV examples UK', 'Executive CV UK'].map(tag => (
                <span key={tag} className="bg-white border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Browse CV Examples by Industry</h2>
          <p className="text-gray-500 text-center mb-8">Select your industry to jump to relevant examples</p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <div key={industry.name} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                  <Icon className={`w-8 h-8 text-blue-600 mb-2`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{industry.name}</h3>
                  <p className="text-sm text-gray-500">{industry.examples.length} CV examples</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Real CV Examples — actual text samples */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Real UK CV Examples (With Full Text)</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">These are example CVs showing the exact language, structure, and quantified achievements that UK employers want to see.</p>

          {/* Example 1: Marketing Manager */}
          <div className="mb-12 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <span className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Marketing &amp; Communications</span>
              <h3 className="text-xl font-bold text-white mt-1">Digital Marketing Manager CV Example</h3>
              <p className="text-blue-200 text-sm mt-1">5–7 years experience · £35,000–£50,000 · London</p>
            </div>
            <div className="p-6 bg-gray-50 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
{`SARAH JOHNSON
sarah.johnson@email.com  |  07900 123456  |  London, UK  |  linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven Digital Marketing Manager with 6 years' experience driving 150%+
engagement growth through data-led campaigns. Proven expertise in SEO, paid media,
and content strategy across B2B and B2C sectors.

EXPERIENCE
Senior Digital Marketing Manager | TechStart Ltd, London | 2022–Present
• Increased organic traffic by 285% through targeted SEO strategy and content overhaul
• Managed £250K annual PPC budget achieving 3.2x ROAS across Google and Meta platforms
• Led a team of 5, introducing Agile workflow resulting in 40% faster campaign delivery
• Grew email subscriber list from 8,000 to 35,000 through lead magnet campaigns

Digital Marketing Executive | GrowthCo, London | 2019–2022
• Launched LinkedIn paid campaign generating 420 qualified B2B leads in first quarter
• Achieved 68% open rate on automated email sequences (industry average: 21%)
• Managed SEMrush-led keyword strategy, ranking 12 target pages on Google page 1

SKILLS
Google Analytics 4, SEMrush, HubSpot, Google Ads, Meta Ads Manager, Mailchimp

EDUCATION
BA (Hons) Marketing (2:1) | University of Leeds | 2015–2018`}
            </div>
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">✓ ATS-optimised  ·  ✓ Quantified achievements  ·  ✓ UK format</p>
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center">
                Use this as your starting point <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Example 2: Software Developer */}
          <div className="mb-12 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-purple-600 px-6 py-4">
              <span className="text-purple-100 text-sm font-semibold uppercase tracking-wide">IT &amp; Technology</span>
              <h3 className="text-xl font-bold text-white mt-1">Software Developer CV Example</h3>
              <p className="text-purple-200 text-sm mt-1">3–5 years experience · £40,000–£60,000 · Manchester</p>
            </div>
            <div className="p-6 bg-gray-50 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
{`JAMES CHEN
james.chen@email.com  |  07700 987654  |  Manchester, UK  |  github.com/jameschen

PROFESSIONAL SUMMARY
Full-stack Software Developer with 4 years' experience building scalable web
applications in React and Node.js. Passionate about clean code and performance
optimisation. Reduced page load times by 60% at current employer.

EXPERIENCE
Mid-Level Software Developer | FinanceHub Ltd, Manchester | 2022–Present
• Reduced page load times by 60% via code splitting, lazy loading & image optimisation
• Built real-time dashboard serving 10,000+ daily active users (React + WebSockets)
• Led migration from monolith to microservices, improving uptime from 98.5% to 99.9%
• Mentored 2 junior developers; introduced pair programming and code review practices

Junior Developer | WebAgency, Leeds | 2020–2022
• Delivered 8 client websites on time and within budget using React and Next.js
• Integrated third-party APIs (Stripe, Twilio, Google Maps) across 5 projects
• Reduced bug escape rate by 40% by introducing Jest unit testing from scratch

TECHNICAL SKILLS
React, Next.js, Node.js, TypeScript, PostgreSQL, AWS (EC2, S3, Lambda), Docker, Git

EDUCATION
BSc Computer Science (First Class) | University of Manchester | 2017–2020`}
            </div>
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">✓ GitHub portfolio linked  ·  ✓ Metrics-driven  ·  ✓ ATS keywords</p>
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center">
                Use this as your starting point <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Example 3: Graduate */}
          <div className="mb-12 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <span className="text-green-100 text-sm font-semibold uppercase tracking-wide">Graduate / No Experience</span>
              <h3 className="text-xl font-bold text-white mt-1">Graduate CV Example (No Experience)</h3>
              <p className="text-green-200 text-sm mt-1">0–1 years experience · £22,000–£28,000 · Any UK city</p>
            </div>
            <div className="p-6 bg-gray-50 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
{`EMMA WILLIAMS
emma.williams@email.com  |  07500 111222  |  Birmingham, UK  |  linkedin.com/in/emmawilliams

PERSONAL STATEMENT
Motivated Business Management graduate with a 2:1 from the University of Birmingham.
Proven ability to manage multiple priorities through internship experience at a fast-paced
marketing agency. Keen to develop a career in marketing or business development.

EDUCATION
BSc Business Management (2:1) | University of Birmingham | 2021–2024
Key modules: Marketing Strategy, Consumer Behaviour, Financial Analysis, Operations Mgmt
Dissertation: "The Impact of Social Media Influencers on Gen Z Purchase Decisions" (72%)

WORK EXPERIENCE
Marketing Intern | Midlands SME Agency, Birmingham | June–September 2023
• Managed 3 client social media accounts, growing combined followers by 2,400 in 3 months
• Conducted competitor analysis for 5 campaigns; presented findings to senior leadership
• Produced 40+ pieces of content with an average engagement rate of 6.8% (industry: 1.9%)

ADDITIONAL EXPERIENCE
Student Ambassador | University of Birmingham | 2022–2024
• Represented the university at 6 open days, guiding groups of 20+ prospective students

SKILLS
Microsoft Office (Advanced Excel), Canva, Hootsuite, Google Analytics, Mailchimp

ACHIEVEMENTS  •  Sports Captain, Women's Netball  •  First Aid Certified  •  Duke of Edinburgh Gold`}
            </div>
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">✓ Skills-led  ·  ✓ Internship highlighted  ·  ✓ UK graduate format</p>
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center">
                Use this as your starting point <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CV Examples by Role — directory cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">All CV Examples by Role</h2>
          <p className="text-gray-500 text-center mb-8">Each example includes structure guidance, key features, and typical salary ranges for UK roles.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {cvExamples.map((example, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{example.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{example.industry}</p>
                  </div>
                  <FileText className="w-6 h-6 text-gray-400 flex-shrink-0" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">Experience</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{example.experience}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">Salary Range</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{example.salary}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{example.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">What to include:</p>
                  <ul className="space-y-1">
                    {example.keyFeatures.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center">
                  Build this CV with AI
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Use These CV Examples</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">1. Choose Your Industry</h3>
              <p className="text-gray-600">Select the CV example that matches your target industry. Each template is optimised for specific sector requirements and expectations in the UK job market.</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">2. Adapt the Language</h3>
              <p className="text-gray-600">Replace the example content with your own experience, skills, and achievements. Keep the structure and phrasing style but make it personal to your background.</p>
            </div>
            <div className="bg-green-50 border border-green-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">3. Tailor to Each Job</h3>
              <p className="text-gray-600">Adjust keywords and achievements to match the specific job description. Generic CVs have 70% lower success rates — tailoring takes 5 minutes with AI.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">4. Check ATS Compatibility</h3>
              <p className="text-gray-600">Ensure your CV passes Applicant Tracking Systems by using standard formatting, avoiding tables, and including relevant keywords from the job posting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create Your Professional CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use our AI-powered CV builder to create a tailored CV in 2 minutes. Choose from industry-specific templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold text-lg inline-flex items-center justify-center">
              Start Building Your CV
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/cv-writing-guide" className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 font-semibold text-lg inline-flex items-center justify-center border-2 border-white">
              Read CV Writing Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related CV Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/cv-writing-guide" className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">CV Writing Guide</h3>
              <p className="text-gray-500 mb-4 text-sm">Complete step-by-step tutorial on writing a winning UK CV.</p>
              <span className="text-blue-600 font-semibold text-sm">Read Guide →</span>
            </Link>
            <Link href="/blog/cv-examples-by-industry-uk" className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">CV Examples by Industry</h3>
              <p className="text-gray-500 mb-4 text-sm">15 industry-specific CV examples that landed real interviews.</p>
              <span className="text-blue-600 font-semibold text-sm">See Examples →</span>
            </Link>
            <Link href="/blog" className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
              <Briefcase className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Career Blog</h3>
              <p className="text-gray-500 mb-4 text-sm">Expert tips and advice for your UK job search.</p>
              <span className="text-blue-600 font-semibold text-sm">Read Blog →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">My CV Buddy</h3>
              <p className="text-sm">Free AI CV builder trusted by thousands of UK professionals.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/upload" className="hover:text-white">Upload CV</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/cover-letter" className="hover:text-white">Cover Letters</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cv-writing-guide" className="hover:text-white">CV Writing Guide</Link></li>
                <li><Link href="/cv-examples" className="hover:text-white">CV Examples</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
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
            <p>&copy; 2026 My CV Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
