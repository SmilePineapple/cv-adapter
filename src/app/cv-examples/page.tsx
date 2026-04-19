import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, FileText, Briefcase, GraduationCap, Code, Heart, Building2, TrendingUp, Users, Wrench, ShoppingBag, Palette, Shield, FlaskConical, Plane, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CV Examples UK 2026: 15+ Free Templates by Industry | My CV Buddy',
  description: '15+ free CV examples UK — real templates for marketing, IT, healthcare, finance, engineering & more. Copy proven UK CV formats that pass ATS and land interviews. Updated April 2026.',
  keywords: [
    'cv examples uk',
    'cv examples',
    'cv sample uk',
    'cv uk example',
    'example of cv uk',
    'examples of cv uk',
    'examples cv uk',
    'good cv examples uk',
    'good cv examples',
    'best cv examples uk',
    'best cv examples',
    'it cv examples uk',
    'executive cv examples uk',
    'cv examples 2024',
    'cv examples 2026',
    'curriculum vitae uk example',
    'cv template examples uk',
    'example uk cv',
    'professional cv examples uk',
    'free cv examples uk'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/cv-examples',
  },
  openGraph: {
    title: 'CV Examples UK 2026: 15+ Free Templates by Industry',
    description: '15+ free UK CV examples across every industry. Real templates that pass ATS and land interviews — copy and customize instantly.',
    url: 'https://www.mycvbuddy.com/cv-examples',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Examples UK by Industry',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'CV Examples UK 2026 by Industry',
  description: '15+ free professional CV examples for UK job seekers across every major industry',
  url: 'https://www.mycvbuddy.com/cv-examples',
  numberOfItems: 15,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Digital Marketing Manager CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 2, name: 'Software Developer CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 3, name: 'Registered Nurse CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 4, name: 'Financial Analyst CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 5, name: 'Primary School Teacher CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 6, name: 'Mechanical Engineer CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 7, name: 'Sales Manager CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 8, name: 'Graphic Designer CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 9, name: 'Solicitor CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 10, name: 'Research Scientist CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 11, name: 'Hotel Manager CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 12, name: 'HR Manager CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 13, name: 'Graduate CV Example UK (No Experience)', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 14, name: 'Career Changer CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
    { '@type': 'ListItem', position: 15, name: 'Executive CV Example UK', url: 'https://www.mycvbuddy.com/cv-examples' },
  ]
}

export default function CVExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <Link href="/auth/login" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black hover:bg-blue-700 text-sm sm:text-base font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              CV Examples UK 2026
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Browse 15+ professional UK CV examples across every industry. Real templates used by thousands of UK job seekers — copy, customize and download for free.
            </p>
            <Link href="/auth/signup" className="bg-white text-black px-8 py-4 rounded-full font-black hover:bg-blue-700 font-semibold text-lg inline-flex items-center">
              Create Your CV Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-black text-white mb-8 text-center">Browse UK CV Examples by Industry</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <div key={industry.name} className="bg-white/5 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Icon className={`w-8 h-8 text-${industry.color}-600 mb-2`} />
                  <h3 className="font-black text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-400">{industry.examples.length} examples</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CV Examples */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-black text-white mb-8 text-center">Professional UK CV Examples &amp; Templates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cvExamples.map((example, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{example.title}</h3>
                    <p className="text-sm text-blue-400 font-medium">{example.industry}</p>
                  </div>
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Experience:</span>
                    <p className="font-bold text-white">{example.experience}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Salary Range:</span>
                    <p className="font-bold text-white">{example.salary}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{example.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Key Features:</p>
                  <ul className="space-y-1">
                    {example.keyFeatures.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-700 font-semibold text-sm inline-flex items-center">
                  Use This Template
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
          <h2 className="text-4xl font-black text-white mb-8 text-center">How to Use These CV Examples</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-2">1. Choose Your Industry</h3>
              <p className="text-gray-300">Select the CV example that matches your target industry. Each template is optimized for specific sector requirements and expectations.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-2">2. Customize the Content</h3>
              <p className="text-gray-300">Replace the example content with your own experience, skills, and achievements. Keep the structure but make it personal.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-2">3. Tailor to Each Job</h3>
              <p className="text-gray-300">Adjust keywords and achievements to match the specific job description. Generic CVs have 70% lower success rates.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-2">4. Optimize for ATS</h3>
              <p className="text-gray-300">Ensure your CV passes Applicant Tracking Systems by using standard formatting and including relevant keywords from the job posting.</p>
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
            <Link href="/auth/signup" className="bg-white text-blue-400 px-8 py-4 rounded-lg hover:bg-white/10 font-semibold text-lg inline-flex items-center justify-center">
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
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-black text-white mb-8 text-center">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/cv-writing-guide" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">CV Writing Guide</h3>
              <p className="text-gray-400 mb-4">Complete step-by-step tutorial on writing a winning CV.</p>
              <span className="text-blue-400 font-semibold">Read Guide →</span>
            </Link>
            <Link href="/templates" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">CV Templates</h3>
              <p className="text-gray-400 mb-4">Professional CV templates ready to customize.</p>
              <span className="text-blue-400 font-semibold">View Templates →</span>
            </Link>
            <Link href="/blog" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Briefcase className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Career Blog</h3>
              <p className="text-gray-400 mb-4">Expert tips and advice for your job search.</p>
              <span className="text-blue-400 font-semibold">Read Blog →</span>
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
            <p>&copy; 2026 CV Adapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
