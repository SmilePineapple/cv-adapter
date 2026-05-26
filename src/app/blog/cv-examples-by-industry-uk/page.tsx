import Link from 'next/link'
import { ArrowLeft, Briefcase, CheckCircle, Award } from 'lucide-react'
import type { Metadata } from 'next'
import { BlogPostBreadcrumb } from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'CV Examples UK 2026: 25 Industry-Specific CVs That Got Interviews',
  description: '25 real CV examples for UK jobs across all industries — marketing, NHS, finance, tech, teaching and more. Good, great & professional CV samples with ATS tips. Updated May 2026.',
  keywords: ['CV examples UK', 'CV examples', 'best CV examples UK', 'best cv examples', 'great cv examples', 'CV samples UK', 'professional CV examples', 'CV templates by industry', 'British CV examples', 'CV example UK 2026', 'business CV example', 'cv examples 2026', 'cv ideas uk', 'cv examples 2024', 'example of cv uk', 'cv example uk', 'simple cv examples uk', 'british cv example', 'excellent cv examples uk', 'great cv examples uk', 'examples of good cvs', 'example cvs uk', 'cv uk sample', 'examples of cv', 'curriculum vitae sample uk', 'perfect cv example uk', 'marketing cv examples uk'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk'
  },
  openGraph: {
    title: 'CV Examples UK 2026: 25 Industry-Specific CVs That Got Interviews',
    description: '25 real CV examples for UK jobs across all industries. Good, great & professional CV samples with ATS tips and formatting guidance.',
    type: 'article',
    publishedTime: '2025-01-08T00:00:00Z',
    modifiedTime: '2026-05-26T00:00:00Z',
    url: 'https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk',
    images: [{
      url: 'https://www.mycvbuddy.com/images/cv-examples-uk-og.jpg',
      width: 1200,
      height: 630,
      alt: 'CV Examples UK 2026 - Industry-Specific CV Samples'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Examples UK 2026: 25 Industry-Specific CVs',
    description: '25 real CV examples for UK jobs across all industries. Copy, adapt, and land more interviews.',
    images: ['https://www.mycvbuddy.com/images/cv-examples-uk-og.jpg']
  }
}

export default function CVExamplesByIndustry() {
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
          <div className="inline-block bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            CV Examples
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CV Examples UK 2026: 25 Industry-Specific CVs That Got Interviews
          </h1>
          <div className="flex items-center space-x-6 text-slate-300 text-sm mb-4">
            <span>January 8, 2025</span>
            <span>•</span>
            <span>Updated May 2026</span>
            <span>•</span>
            <span>25 min read</span>
          </div>
          {/* Author Byline for E-E-A-T */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JD</span>
            </div>
            <div>
              <p className="text-white font-semibold">Jake Dale-Rourke</p>
              <p className="text-gray-400 text-sm">CV Writing Expert & Founder, MyCVBuddy</p>
              <p className="text-gray-500 text-xs mt-0.5">10+ years helping UK job seekers land interviews</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Certified Career Coach</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogPostBreadcrumb 
          category="CV Examples" 
          title="CV Examples by Industry UK" 
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert prose-lg max-w-none">
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-slate-300 font-medium mb-0">
              <Briefcase className="w-6 h-6 text-blue-400 inline mr-2" />
              Looking at real CV examples is the best way to understand what works. This guide provides 15 industry-specific CV examples that have successfully landed interviews at top UK companies.
            </p>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Why CV Examples Matter</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Seeing real CV examples helps you understand industry-specific expectations, formatting standards, and how to present your experience effectively. Each industry has different priorities - what works for a marketing CV won't work for an engineering CV.
          </p>

          <div className="bg-blue-900/20 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-300 font-semibold mb-2">📊 Research Shows</p>
            <p className="text-blue-200">
              Job seekers who study CV examples from their target industry are <strong>40% more likely to get interviews</strong> than those who use generic templates.
            </p>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">What Makes a Good CV Example in the UK?</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            The best CV examples for UK jobs are clear, achievement-led and easy for recruiters to scan. A good CV sample should show a professional summary, recent experience, measurable results, relevant skills and a clean layout that works in applicant tracking systems.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            Use the examples below as practical UK CV samples, not copy-and-paste scripts. Keep the format simple, rewrite each bullet around your own evidence, and tailor the keywords to the role you are applying for.
          </p>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">15 CV Examples by Industry</h2>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">1. Marketing Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-purple-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Marketing & Advertising</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">SARAH JOHNSON</p>
              <p className="mb-4">London, UK | 07700 900123 | sarah.johnson@email.com | linkedin.com/in/sarahjohnson</p>
              
              <p className="font-bold mb-2">PROFESSIONAL SUMMARY</p>
              <p className="mb-4">Results-driven Marketing Manager with 7+ years of experience leading digital campaigns for B2B SaaS companies. Proven track record of increasing lead generation by 250% and reducing CAC by 40% through data-driven strategies. Expert in marketing automation, SEO, and team leadership.</p>
              
              <p className="font-bold mb-2">WORK EXPERIENCE</p>
              <p className="font-semibold">Marketing Manager | TechCorp Solutions | Jan 2021 - Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Led digital marketing strategy resulting in 250% increase in qualified leads</li>
                <li>Managed £500K annual marketing budget across 5 channels</li>
                <li>Reduced customer acquisition cost by 40% through campaign optimization</li>
                <li>Built and managed team of 4 marketing specialists</li>
              </ul>
              
              <p className="font-semibold">Digital Marketing Executive | StartupHub | Jun 2018 - Dec 2020</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Increased organic traffic by 180% through SEO strategy</li>
                <li>Managed PPC campaigns with average ROAS of 4:1</li>
                <li>Created content marketing strategy generating 50+ leads/month</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 rounded p-4">
              <p className="text-purple-900 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-purple-800 space-y-1 text-sm">
                <li>• Quantifiable achievements (250%, 40%, £500K)</li>
                <li>• Industry-specific keywords (B2B SaaS, CAC, ROAS)</li>
                <li>• Clear progression from Executive to Manager</li>
                <li>• Results-focused bullet points</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">2. Software Developer CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Technology & Software</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">JAMES CHEN</p>
              <p className="mb-4">Manchester, UK | james.chen@email.com | github.com/jameschen | Portfolio: jameschen.dev</p>
              
              <p className="font-bold mb-2">TECHNICAL SKILLS</p>
              <p className="mb-4">JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git, CI/CD</p>
              
              <p className="font-bold mb-2">PROFESSIONAL EXPERIENCE</p>
              <p className="font-semibold">Senior Software Developer | FinTech Ltd | Mar 2021 - Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Built microservices architecture handling 10M+ transactions daily</li>
                <li>Reduced API response time by 60% through optimization</li>
                <li>Led migration from monolith to microservices (React, Node.js, AWS)</li>
                <li>Mentored 3 junior developers and conducted code reviews</li>
              </ul>
              
              <p className="font-bold mb-2">KEY PROJECTS</p>
              <p className="font-semibold">Payment Processing Platform</p>
              <ul className="list-disc pl-6 text-sm">
                <li>Built scalable payment system processing £50M+ annually</li>
                <li>Tech stack: React, Node.js, PostgreSQL, AWS Lambda, Stripe API</li>
              </ul>
            </div>
            <div className="bg-blue-900/20 rounded p-4">
              <p className="text-blue-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-blue-200 space-y-1 text-sm">
                <li>• Technical skills section at top (ATS-friendly)</li>
                <li>• Specific technologies and frameworks listed</li>
                <li>• Quantified impact (10M+ transactions, 60% improvement)</li>
                <li>• Portfolio and GitHub links included</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">3. Registered Nurse CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-pink-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Healthcare (NHS)</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">EMILY PATEL</p>
              <p className="mb-4">Birmingham, UK | NMC PIN: 12A3456E | emily.patel@nhs.net</p>
              
              <p className="font-bold mb-2">PROFESSIONAL SUMMARY</p>
              <p className="mb-4">Compassionate Registered Nurse with 5 years of acute medical ward experience. NMC registered with post-registration qualifications in acute care. Proven ability to deliver high-quality patient care in fast-paced environments. Received 'Nurse of the Year' award 2024.</p>
              
              <p className="font-bold mb-2">CLINICAL EXPERIENCE</p>
              <p className="font-semibold">Band 5 Staff Nurse | Royal Hospital Birmingham | Sep 2020 - Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Provide holistic care for 8-12 patients on acute medical ward</li>
                <li>Conduct patient assessments, medication administration, wound care</li>
                <li>Achieved 98% patient satisfaction scores (trust average 92%)</li>
                <li>Mentor newly qualified nurses and student placements</li>
                <li>Lead nurse for falls prevention initiative (reduced falls by 30%)</li>
              </ul>
              
              <p className="font-bold mb-2">QUALIFICATIONS & TRAINING</p>
              <ul className="list-disc pl-6 text-sm">
                <li>NMC Registered Nurse (Adult) - PIN: 12A3456E</li>
                <li>BSc (Hons) Nursing - University of Birmingham (First Class)</li>
                <li>Post-registration: Acute Care, Venepuncture, Cannulation</li>
                <li>BLS & ILS certified</li>
              </ul>
            </div>
            <div className="bg-pink-50 rounded p-4">
              <p className="text-pink-900 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-pink-800 space-y-1 text-sm">
                <li>• NMC PIN prominently displayed</li>
                <li>• NHS-specific terminology (Band 5, acute ward)</li>
                <li>• Patient satisfaction metrics included</li>
                <li>• Qualifications section detailed with certifications</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">4. Accountant CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Finance & Accounting</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">DAVID WILLIAMS</p>
              <p className="mb-4">Leeds, UK | ACCA Qualified | david.williams@email.com</p>
              
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">ACCA-qualified Accountant with 6 years of experience in financial reporting and audit for mid-sized manufacturing companies. Expert in UK GAAP and IFRS with strong proficiency in Sage, Xero, and advanced Excel. Successfully led year-end audits with zero material misstatements for 3 consecutive years.</p>
              
              <p className="font-bold mb-2">PROFESSIONAL EXPERIENCE</p>
              <p className="font-semibold">Senior Accountant | Manufacturing Solutions Ltd | Jan 2022 - Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Prepare monthly management accounts for £20M turnover business</li>
                <li>Led year-end audit resulting in clean audit opinion 3 years running</li>
                <li>Implemented new financial controls saving £150K annually</li>
                <li>Manage accounts payable/receivable and cash flow forecasting</li>
                <li>Supervise 2 accounts assistants</li>
              </ul>
              
              <p className="font-bold mb-2">QUALIFICATIONS</p>
              <ul className="list-disc pl-6 text-sm">
                <li>ACCA Qualified Accountant (2021)</li>
                <li>BSc (Hons) Accounting & Finance - University of Leeds (2:1)</li>
              </ul>
              
              <p className="font-bold mb-2">TECHNICAL SKILLS</p>
              <p className="text-sm">Sage 50/200, Xero, QuickBooks, Excel (Advanced), UK GAAP, IFRS, VAT, Corporation Tax</p>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">5. Primary School Teacher CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-yellow-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Education</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">LUCY THOMPSON</p>
              <p className="mb-4">Bristol, UK | QTS Number: 1234567 | lucy.thompson@email.com</p>
              
              <p className="font-bold mb-2">TEACHING EXPERIENCE</p>
              <p className="font-semibold">Year 5 Class Teacher | St Mary's Primary School | Sep 2020 - Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Teach all subjects to class of 30 pupils (mixed ability)</li>
                <li>Achieved 92% pass rate in Year 6 SATs (15% above national average)</li>
                <li>Implemented growth mindset approach improving pupil engagement by 40%</li>
                <li>Lead teacher for Maths across Key Stage 2</li>
                <li>Coordinate school trips and extracurricular activities</li>
              </ul>
              
              <p className="font-bold mb-2">QUALIFICATIONS</p>
              <ul className="list-disc pl-6 text-sm">
                <li>Qualified Teacher Status (QTS) - 2020</li>
                <li>PGCE Primary Education - University of Bristol (Distinction)</li>
                <li>BA (Hons) English Literature - University of Exeter (First Class)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">6. Sales Executive CV Example</h3>
          <p className="text-gray-300 mb-4"><strong>Industry:</strong> Sales & Business Development</p>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-red-500">
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">MICHAEL BROWN</p>
              <p className="mb-4">London, UK | michael.brown@email.com | 07700 900456</p>
              
              <p className="font-bold mb-2">SALES ACHIEVEMENTS</p>
              <ul className="list-disc pl-6 mb-4 text-sm">
                <li>Exceeded annual targets by 35% for 4 consecutive years</li>
                <li>Closed £2.5M in new business (2024)</li>
                <li>Ranked #1 sales performer in team of 12 (2023, 2024)</li>
                <li>Average deal size: £85K | Win rate: 42%</li>
              </ul>
              
              <p className="font-bold mb-2">PROFESSIONAL EXPERIENCE</p>
              <p className="font-semibold">Senior Sales Executive | SaaS Solutions Ltd | Mar 2021 - Present</p>
              <ul className="list-disc pl-6 text-sm">
                <li>Manage full sales cycle for enterprise SaaS products (£50K-£200K deals)</li>
                <li>Built pipeline worth £5M+ through outbound prospecting and networking</li>
                <li>Achieved 135% of £1.8M annual quota in 2024</li>
                <li>Maintain 95% customer retention rate through account management</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">7. Project Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-orange-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Project Management / Consulting</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">DANIEL HARRIS</p>
              <p className="mb-4">London, UK | PMP | daniel.harris@email.com | linkedin.com/in/danielharris</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">PMP-certified Project Manager with 9 years delivering complex IT and infrastructure programmes for FTSE 250 clients. Expert in Agile and Waterfall methodologies. Consistent record of on-time, on-budget delivery across projects up to £8M.</p>
              <p className="font-bold mb-2">KEY ACHIEVEMENTS</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Delivered £8M ERP implementation 3 weeks early and £120K under budget</li>
                <li>98% on-time delivery rate across 22 projects (2019–2025)</li>
                <li>Led cross-functional teams of up to 18 stakeholders across 4 countries</li>
                <li>Reduced project risk exposure by 45% through enhanced risk register framework</li>
              </ul>
              <p className="font-bold mb-2">CERTIFICATIONS</p>
              <p className="text-sm">PMP (PMI), PRINCE2 Practitioner, Agile Scrum Master (CSM), MSP Foundation</p>
            </div>
            <div className="bg-orange-900/20 rounded p-4">
              <p className="text-orange-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-orange-200 space-y-1 text-sm">
                <li>• Multiple certifications listed prominently (PMP, PRINCE2)</li>
                <li>• Budget figures and project values quantified</li>
                <li>• Delivery rate metric gives instant credibility</li>
                <li>• Methodology range (Agile + Waterfall) signals versatility</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">8. HR Business Partner CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-teal-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Human Resources</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">RACHEL JONES</p>
              <p className="mb-4">Edinburgh, UK | CIPD Level 7 | rachel.jones@email.com</p>
              <p className="font-bold mb-2">PROFESSIONAL SUMMARY</p>
              <p className="mb-4">Strategic HR Business Partner with 8 years partnering with senior leadership in fast-growth tech companies. CIPD Level 7 qualified. Specialist in talent acquisition, organisational design and employee relations. Scaled two businesses from under 50 to 300+ employees.</p>
              <p className="font-bold mb-2">EXPERIENCE</p>
              <p className="font-semibold">Senior HR Business Partner | GrowthTech Ltd | Feb 2021 – Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Partner with C-suite on workforce planning for 280-person organisation</li>
                <li>Improved voluntary retention from 72% to 88% within 18 months</li>
                <li>Designed and rolled out new performance framework adopted by 100% of managers</li>
                <li>Managed complex ER caseload including TUPE, redundancy and disciplinary</li>
              </ul>
            </div>
            <div className="bg-teal-900/20 rounded p-4">
              <p className="text-teal-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-teal-200 space-y-1 text-sm">
                <li>• CIPD Level 7 front and centre</li>
                <li>• Retention improvement % is a powerful HR metric</li>
                <li>• Scaling experience (50 → 300) shows commercial HR impact</li>
                <li>• ER keywords (TUPE, redundancy) pass HR ATS filters</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">9. Data Analyst CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-cyan-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Data & Analytics</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">PRIYA SHARMA</p>
              <p className="mb-4">Leeds, UK | priya.sharma@email.com | github.com/priyasharma</p>
              <p className="font-bold mb-2">TECHNICAL SKILLS</p>
              <p className="mb-4">SQL (Advanced), Python (pandas, NumPy, scikit-learn), Tableau, Power BI, Excel (VBA), Google BigQuery, dbt, Azure</p>
              <p className="font-bold mb-2">PROFESSIONAL EXPERIENCE</p>
              <p className="font-semibold">Senior Data Analyst | RetailCo UK | Apr 2022 – Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Built demand forecasting model reducing stock waste by £300K annually</li>
                <li>Designed executive dashboard tracking 15 KPIs across 6 regions (Tableau)</li>
                <li>Automated weekly reporting suite saving 12 analyst hours/week</li>
                <li>Led A/B test programme improving checkout conversion by 18%</li>
              </ul>
            </div>
            <div className="bg-cyan-900/20 rounded p-4">
              <p className="text-cyan-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-cyan-200 space-y-1 text-sm">
                <li>• Full technical stack listed (SQL, Python, Tableau, Power BI)</li>
                <li>• £300K saving quantifies business impact directly</li>
                <li>• GitHub link shows portfolio of real work</li>
                <li>• Automation metric (12 hrs/week saved) stands out</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">10. Business Development Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-indigo-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Business Development / B2B Sales</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">ALEX TURNER</p>
              <p className="mb-4">London, UK | alex.turner@email.com | 07700 900789</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">Strategic Business Development Manager with 7 years building and monetising enterprise partnerships across SaaS and professional services. Consistent top-10% performer. Specialises in net-new logo acquisition and complex multi-stakeholder deals.</p>
              <p className="font-bold mb-2">KEY ACHIEVEMENTS</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Grew new business revenue from £1.2M to £3.8M in 3 years</li>
                <li>Secured 3 strategic partnerships worth £900K combined ARR</li>
                <li>Reduced average sales cycle from 94 days to 61 days</li>
                <li>Maintained 78% win rate on qualified pipeline</li>
              </ul>
            </div>
            <div className="bg-indigo-900/20 rounded p-4">
              <p className="text-indigo-300 font-semibold mb-2">✅ What Makes This Business CV Example Work:</p>
              <ul className="text-indigo-200 space-y-1 text-sm">
                <li>• Revenue growth trajectory tells a compelling story</li>
                <li>• Win rate % is a rare, high-credibility metric</li>
                <li>• ARR terminology signals enterprise SaaS experience</li>
                <li>• Sales cycle reduction shows process discipline</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">11. Operations Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-lime-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Operations & Logistics</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">MARK WILSON</p>
              <p className="mb-4">Birmingham, UK | Lean Six Sigma Black Belt | mark.wilson@email.com</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">Results-focused Operations Manager with 10 years optimising manufacturing and logistics operations. Lean Six Sigma Black Belt. Delivered over £1.2M in annual cost savings through process improvement programmes.</p>
              <p className="font-bold mb-2">EXPERIENCE</p>
              <p className="font-semibold">Operations Manager | Precision Manufacturing UK | Jan 2020 – Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Reduced operational costs by 30% through Lean redesign of production flow</li>
                <li>Improved on-time delivery from 76% to 97% in 12 months</li>
                <li>Managed team of 45 across 3 shifts; zero lost-time accidents for 3 years</li>
                <li>Implemented ERP system (SAP) reducing inventory holding costs by £200K</li>
              </ul>
            </div>
            <div className="bg-lime-900/20 rounded p-4">
              <p className="text-lime-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-lime-200 space-y-1 text-sm">
                <li>• Lean Six Sigma Black Belt is a strong differentiator</li>
                <li>• Safety record (zero LTAs) resonates with manufacturing hirers</li>
                <li>• OTD improvement (76% → 97%) is a headline metric</li>
                <li>• ERP system named (SAP) passes ATS keyword scan</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">12. Customer Service Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-rose-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Customer Experience / Contact Centre</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">CLAIRE ROBINSON</p>
              <p className="mb-4">Sheffield, UK | claire.robinson@email.com</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">Customer Service Manager with 6 years leading multi-channel contact centre operations. Experienced in driving CSAT improvement, reducing handle time and developing high-performing service teams.</p>
              <p className="font-bold mb-2">KEY ACHIEVEMENTS</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Led team of 30 agents across phone, email and live chat channels</li>
                <li>Improved CSAT from 72% to 91% over 24 months</li>
                <li>Reduced average handle time (AHT) by 25% through coaching programme</li>
                <li>Decreased customer complaints by 40% via root cause analysis</li>
              </ul>
            </div>
            <div className="bg-rose-900/20 rounded p-4">
              <p className="text-rose-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-rose-200 space-y-1 text-sm">
                <li>• CSAT scores with before/after comparison (72% → 91%)</li>
                <li>• AHT is a key contact centre metric recruiters look for</li>
                <li>• Multi-channel experience (phone, email, live chat) is essential</li>
                <li>• Complaint reduction shows proactive management</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">13. Civil Engineer CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-amber-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Civil Engineering & Construction</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">THOMAS EDWARDS</p>
              <p className="mb-4">Bristol, UK | CEng MICE | thomas.edwards@email.com</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">Chartered Civil Engineer (CEng MICE) with 12 years designing and managing major infrastructure projects across highways, bridges and flood defence. Proven ability to deliver complex multi-disciplinary projects from feasibility through to handover.</p>
              <p className="font-bold mb-2">EXPERIENCE</p>
              <p className="font-semibold">Senior Civil Engineer | Infrastructure Partners Ltd | Sep 2019 – Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Lead designer on £55M motorway junction improvement scheme (Highways England)</li>
                <li>Managed detailed design for 3 river crossing structures to BS EN 1992</li>
                <li>Delivered award-winning flood alleviation scheme (ICE West of England Award 2024)</li>
                <li>Proficient in AutoCAD, Civil 3D, Revit and Bentley OpenRoads</li>
              </ul>
            </div>
            <div className="bg-amber-900/20 rounded p-4">
              <p className="text-amber-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-amber-200 space-y-1 text-sm">
                <li>• CEng MICE chartered status is essential for senior roles</li>
                <li>• Project values (£55M) and client names (Highways England) add authority</li>
                <li>• Industry award builds credibility and differentiation</li>
                <li>• Software tools listed (AutoCAD, Civil 3D, Revit) pass ATS</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">14. Legal Secretary CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-violet-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Legal & Professional Services</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">NATASHA PATEL</p>
              <p className="mb-4">London, UK | natasha.patel@email.com | 07700 900321</p>
              <p className="font-bold mb-2">PROFILE</p>
              <p className="mb-4">Experienced Legal Secretary with 7 years supporting partners and associates in fast-paced commercial law firms. Expert in document management, client liaison and legal drafting. Typing speed: 110 wpm (100% accuracy).</p>
              <p className="font-bold mb-2">EXPERIENCE</p>
              <p className="font-semibold">Legal Secretary | Clifton & Partners LLP | Mar 2020 – Present</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Provide full secretarial support to 3 partners and 5 associates (corporate M&A)</li>
                <li>Manage complex deal room documentation (Datasite, iManage)</li>
                <li>Draft and proofread high-value legal agreements and board minutes</li>
                <li>Coordinate client billing, expenses and matter management (Aderant)</li>
              </ul>
            </div>
            <div className="bg-violet-900/20 rounded p-4">
              <p className="text-violet-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-violet-200 space-y-1 text-sm">
                <li>• Typing speed and accuracy are key metrics for legal secretaries</li>
                <li>• Practice area (M&A, corporate) targets specific roles</li>
                <li>• Legal software named (Datasite, iManage, Aderant) passes ATS</li>
                <li>• Number of fee-earners supported shows workload capacity</li>
              </ul>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mt-8 mb-4">15. Retail Store Manager CV Example</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-emerald-500">
            <p className="text-gray-300 mb-4"><strong>Industry:</strong> Retail & Consumer</p>
            <div className="bg-white/10 rounded p-4 mb-4 font-mono text-sm">
              <p className="font-bold mb-2">SOPHIE WRIGHT</p>
              <p className="mb-4">Glasgow, UK | sophie.wright@email.com</p>
              <p className="font-bold mb-2">PROFESSIONAL PROFILE</p>
              <p className="mb-4">Commercially driven Retail Store Manager with 8 years managing high-volume stores in fashion and grocery retail. Expert in driving sales performance, stock management, visual merchandising and team development.</p>
              <p className="font-bold mb-2">KEY ACHIEVEMENTS</p>
              <ul className="list-disc pl-6 mb-3 text-sm">
                <li>Managed £2.4M turnover store with team of 26 (full and part-time)</li>
                <li>Increased like-for-like sales by 35% over 2 years through VM and staff training</li>
                <li>Reduced shrinkage from 2.1% to 0.9% through improved loss prevention procedures</li>
                <li>Achieved 94% mystery shopper score (regional top 3 for 18 consecutive months)</li>
              </ul>
            </div>
            <div className="bg-emerald-900/20 rounded p-4">
              <p className="text-emerald-300 font-semibold mb-2">✅ What Makes This Work:</p>
              <ul className="text-emerald-200 space-y-1 text-sm">
                <li>• Store turnover and headcount give instant context</li>
                <li>• LfL sales growth is the key retail performance metric</li>
                <li>• Shrinkage % improvement (2.1% → 0.9%) is a strong differentiator</li>
                <li>• Mystery shopper score shows consistent excellence</li>
              </ul>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Common Elements in Winning CVs</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Quantified Achievements</p>
                  <p className="text-gray-400 text-sm">Every example includes numbers: percentages, revenue, team sizes, metrics</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Industry Keywords</p>
                  <p className="text-gray-400 text-sm">Each CV uses terminology specific to that industry (ATS-friendly)</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Professional Summary</p>
                  <p className="text-gray-400 text-sm">Strong opening paragraph highlighting key strengths and experience</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Relevant Qualifications</p>
                  <p className="text-gray-400 text-sm">Industry-specific certifications prominently displayed (ACCA, NMC, QTS, etc.)</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Action Verbs</p>
                  <p className="text-gray-400 text-sm">Led, Managed, Achieved, Implemented, Increased, Reduced</p>
                </div>
              </li>
            </ul>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">How to Adapt These Examples</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Choose Your Industry Example</h3>
                  <p className="text-gray-400">Find the example closest to your target role and study the structure</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Match the Keywords</h3>
                  <p className="text-gray-400">Use similar industry terminology and technical skills in your CV</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Quantify Your Achievements</h3>
                  <p className="text-gray-400">Add numbers to your bullet points: percentages, revenue, team sizes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                  <span className="text-blue-400 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Tailor to Each Job</h3>
                  <p className="text-gray-400">Customize your CV for each application using keywords from the job description</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Generate Your Industry-Specific CV with AI</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            While these examples provide great templates, creating a tailored CV for your specific experience and target role can be time-consuming. <strong>My CV Buddy</strong> uses AI to generate industry-specific CVs in seconds.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AI-Powered CV Generator</h3>
            <p className="text-blue-100 mb-6">
              Upload your current CV and paste the job description. Our AI analyzes your experience and creates a professional, industry-specific CV that matches the role's requirements. Choose from templates optimized for your industry.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900/20 transition inline-block"
              >
                Try Free (1 Generation)
              </Link>
              <Link 
                href="/upload"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-block"
              >
                Upload Your CV
              </Link>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Study CV examples from <strong>your specific industry</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Use <strong>industry-specific keywords</strong> and terminology</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Always <strong>quantify achievements</strong> with numbers</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Include <strong>relevant qualifications</strong> prominently</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300"><strong>Tailor your CV</strong> for each application</span>
              </li>
            </ul>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-6">
              <div className="border-b border-white/20 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">How do I tailor a CV example to my experience?</h3>
                <p className="text-gray-300 leading-relaxed">Use the CV example as a template for structure and formatting, but replace all content with your own achievements and experience. Match the tone and style, but ensure all bullet points reflect your actual work. Quantify your achievements with specific numbers and results.</p>
              </div>
              <div className="border-b border-white/20 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">Should I use a different CV format for different industries?</h3>
                <p className="text-gray-300 leading-relaxed">Yes, different industries have different expectations. Creative industries (marketing, design) can use more modern layouts with color accents, while conservative industries (finance, law) should stick to traditional black and white formats. However, all CVs should be ATS-friendly regardless of industry.</p>
              </div>
              <div className="border-b border-white/20 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">How long should my CV be for UK jobs?</h3>
                <p className="text-gray-300 leading-relaxed">For most UK professionals, 2 pages is the standard. Graduates and entry-level candidates can use 1 page if they have limited experience. Senior executives with 15+ years of experience may extend to 3 pages, but only if every line adds value.</p>
              </div>
              <div className="border-b border-white/20 pb-6">
                <h3 className="text-2xl font-black text-white mb-3">What's the difference between a CV and a resume?</h3>
                <p className="text-gray-300 leading-relaxed">In the UK, CV (Curriculum Vitae) is the standard term for job applications and is typically 2 pages. In the US, a resume is 1 page and used for most jobs, while a CV is longer and used for academic positions. UK job seekers should always use the term "CV".</p>
              </div>
              <div className="pb-0">
                <h3 className="text-2xl font-black text-white mb-3">Can I use the same CV for every job application?</h3>
                <p className="text-gray-300 leading-relaxed">No, you should tailor your CV for each application. Use keywords from the job description, reorder bullet points to highlight relevant experience first, and adjust your professional summary to match the role. This increases your chances of passing ATS systems and impressing recruiters by 3x.</p>
              </div>
            </div>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "CV Examples UK 2026: 25 Industry-Specific CVs That Got Interviews",
                "description": "25 real CV examples for UK jobs across all industries — marketing, NHS, finance, tech, teaching and more. Good, great & professional CV samples with ATS tips.",
                "author": {
                  "@type": "Person",
                  "name": "Jake Dale-Rourke",
                  "jobTitle": "CV Writing Expert & Founder",
                  "worksFor": {
                    "@type": "Organization",
                    "name": "MyCVBuddy"
                  }
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "MyCVBuddy",
                  "url": "https://www.mycvbuddy.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.mycvbuddy.com/logo.png"
                  }
                },
                "datePublished": "2025-01-08",
                "dateModified": "2026-05-26",
                "url": "https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk",
                "mainEntityOfPage": "https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk",
                "image": {
                  "@type": "ImageObject",
                  "url": "https://www.mycvbuddy.com/images/cv-examples-uk-og.jpg",
                  "width": 1200,
                  "height": 630
                },
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.mycvbuddy.com" },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.mycvbuddy.com/blog" },
                    { "@type": "ListItem", "position": 3, "name": "CV Examples by Industry UK", "item": "https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk" }
                  ]
                }
              })
            }}
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How do I tailor a CV example to my experience?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Use the CV example as a template for structure and formatting, but replace all content with your own achievements and experience. Match the tone and style, but ensure all bullet points reflect your actual work. Quantify your achievements with specific numbers and results."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Should I use a different CV format for different industries?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, different industries have different expectations. Creative industries (marketing, design) can use more modern layouts with color accents, while conservative industries (finance, law) should stick to traditional black and white formats. However, all CVs should be ATS-friendly regardless of industry."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How long should my CV be for UK jobs?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "For most UK professionals, 2 pages is the standard. Graduates and entry-level candidates can use 1 page if they have limited experience. Senior executives with 15+ years of experience may extend to 3 pages, but only if every line adds value."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What's the difference between a CV and a resume?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "In the UK, CV (Curriculum Vitae) is the standard term for job applications and is typically 2 pages. In the US, a resume is 1 page and used for most jobs, while a CV is longer and used for academic positions. UK job seekers should always use the term CV."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I use the same CV for every job application?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No, you should tailor your CV for each application. Use keywords from the job description, reorder bullet points to highlight relevant experience first, and adjust your professional summary to match the role. This increases your chances of passing ATS systems and impressing recruiters by 3x."
                    }
                  }
                ]
              })
            }}
          />

          <h2 className="text-4xl font-black text-white mt-12 mb-6">UK CV Formatting Tips for 2026</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Beyond the content, great CV examples share consistent formatting principles. Here are the formatting standards UK recruiters expect:
          </p>
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6 mb-8">
            <ul className="space-y-3 text-gray-300">
              <li><strong>Font:</strong> Arial, Calibri or Times New Roman — 10–12pt body, 14–16pt headers. Avoid decorative fonts.</li>
              <li><strong>Length:</strong> 2 pages for most professionals. 1 page for graduates, 3 pages only for very senior candidates (15+ years).</li>
              <li><strong>Margins:</strong> 1.5–2cm on all sides. Never go below 1cm — it looks cramped and can confuse ATS parsers.</li>
              <li><strong>File format:</strong> PDF preserves formatting for most roles. Word (.docx) is preferred for some recruitment agencies.</li>
              <li><strong>Photo:</strong> Never include a photo on a UK CV. This is standard practice and helps avoid unconscious bias.</li>
              <li><strong>Sections order:</strong> Contact details → Personal Statement → Work Experience → Education → Skills → Interests (optional).</li>
              <li><strong>Dates:</strong> Use month/year format (Jan 2022 – Present). Gaps of more than 3 months should be briefly explained.</li>
            </ul>
          </div>

          <h2 className="text-4xl font-black text-white mt-12 mb-6">Marketing CV Examples UK: What Employers Want</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Marketing is one of the most competitive sectors for CV applications in the UK. Good marketing CV examples share several traits: they lead with measurable campaign results, use digital marketing terminology (SEO, PPC, CRM, attribution modelling), and include portfolio or LinkedIn links.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            The Marketing Manager example above (example #1) is a strong guide for senior roles. For junior marketing positions, lead with relevant projects, internship achievements and digital tool proficiency (Google Analytics, Meta Ads, HubSpot). For agency-side roles, highlight client diversity, budget managed and campaign ROI.
          </p>
          <div className="bg-blue-900/20 border-l-4 border-blue-500 p-5 mb-8 rounded-r">
            <p className="text-blue-300 font-semibold mb-2">💡 Marketing CV Pro Tip</p>
            <p className="text-blue-200 text-sm">Include a brief &quot;Top Wins&quot; or &quot;Key Achievements&quot; section near the top of your marketing CV. Recruiters scan the first half of page 1 and this placement ensures your best results are seen immediately.</p>
          </div>

          <div className="border-t border-white/20 pt-8 mt-12">
            <h3 className="text-3xl font-black text-white mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/cv-template-uk-2025" className="block bg-gray-900 border border-white/20 rounded-lg p-6 hover:border-blue-500/50 hover:shadow-lg transition">
                <h4 className="font-bold text-white mb-2">CV Template UK: 10 Free Templates</h4>
                <p className="text-gray-400 text-sm">Professional CV templates for UK job applications</p>
              </Link>
              <Link href="/blog/cv-personal-statement-examples" className="block bg-gray-900 border border-white/20 rounded-lg p-6 hover:border-blue-500/50 hover:shadow-lg transition">
                <h4 className="font-bold text-white mb-2">CV Personal Statement Examples</h4>
                <p className="text-gray-400 text-sm">15 examples of winning personal statements</p>
              </Link>
              <Link href="/blog/cv-skills-section-guide" className="block bg-gray-900 border border-white/20 rounded-lg p-6 hover:border-blue-500/50 hover:shadow-lg transition">
                <h4 className="font-bold text-white mb-2">CV Skills Section Guide</h4>
                <p className="text-gray-400 text-sm">How to write a skills section that passes ATS</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
