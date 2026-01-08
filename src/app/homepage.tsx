import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Sparkles, Target, FileText, Award, Clock, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { OAuthHandler } from '@/components/OAuthHandler'
import { TrackingInitializer } from '@/components/TrackingInitializer'

// Force dynamic rendering to avoid Next.js 15 static generation bug
export const dynamic = 'force-dynamic'

// SEO Metadata - Optimized for mycvbuddy.com & mycvbuddy.co.uk
export const metadata: Metadata = {
  title: 'Free AI CV & Resume Builder | ATS-Optimized Resume Generator | My CV Buddy',
  description: 'Create professional CVs and resumes with AI in seconds. Upload your CV or resume, paste any job description, get ATS-optimized results instantly. Free AI-powered CV builder and resume maker for job seekers worldwide. Try free, then £2.99/month for unlimited access.',
  keywords: [
    // UK Terms - High Volume
    'CV generator UK free', 'free CV builder', 'CV template UK', 'professional CV', 
    'CV builder UK', 'CV generator', 'AI CV writer', 'CV writing tool', 
    'CV format', 'CV examples', 'CV template', 'professional CV template',
    'adapt my CV', 'tailor CV to job', 'CV optimizer UK', 'professional CV UK',
    'CV templates UK', 'ATS CV checker', 'curriculum vitae generator',
    'CV builder free UK', 'online CV maker', 'CV buddy', 'free CV template',
    'how to write a CV', 'CV skills', 'CV personal statement',
    
    // US Terms  
    'resume builder USA', 'resume generator', 'AI resume writer', 'resume writing tool',
    'customize resume', 'tailor resume to job', 'resume optimizer', 'professional resume',
    'resume templates US', 'ATS resume checker', 'resume builder free',
    'free resume builder', 'resume format', 'resume examples',
    
    // Universal
    'ATS optimization', 'applicant tracking system', 'cover letter generator',
    'job-specific CV', 'keyword optimization', 'resume parser', 'free CV builder',
    'AI CV generator', 'job application CV', 'career profile builder',
    'CV maker', 'resume maker', 'CV creator', 'resume creator',
    
    // Long-tail - From GSC Data
    'AI tool to adapt CV to job description', 'automatically generate resume for job',
    'create job-specific CV in minutes', 'free CV builder online',
    'AI resume writing service', 'tailor CV to job description free',
    'how to optimize CV for ATS', 'CV keywords for job application',
    'what to put on a CV', 'how long should a CV be', 'first job CV'
  ],
  authors: [{ name: 'My CV Buddy' }],
  openGraph: {
    title: 'AI CV & Resume Builder | Free ATS-Optimized CV Generator',
    description: 'Create ATS-optimized CVs & resumes with AI. Tailor your job application in seconds. Free for UK & US job seekers.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'My CV Buddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CV & Resume Builder | Free',
    description: 'Tailor your CV to any job with AI. ATS-optimized resumes in seconds.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://mycvbuddy.com',
    languages: {
      'en-GB': 'https://mycvbuddy.co.uk',
      'en-US': 'https://mycvbuddy.com',
      'x-default': 'https://mycvbuddy.com',
    },
  },
}

export default function LandingPage() {
  return (
    <>
      <OAuthHandler />
      <StructuredData />
      <TrackingInitializer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">CV</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">CV Adapter</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">Features</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">Blog</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">Pricing</Link>
            <Link href="/pricing-comparison" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">Compare Plans</Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">Login</Link>
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              Get Started
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <Link 
            href="/auth/signup" 
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-5xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-green-900">✨ 10,000+ CVs generated • 95% ATS pass rate</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Get Your Dream Job with an{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ATS-Optimized CV</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
            <strong>75% of CVs never reach human eyes.</strong> Don't let yours be one of them.
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Our AI tailors your CV to any job description in 2 minutes. <strong>Try free</strong> • No credit card required • Then £2.99/month or £29.99/year
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <Link 
              href="/auth/signup" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 sm:transform sm:hover:scale-105 flex items-center justify-center gap-2 min-h-[56px] touch-manipulation"
            >
              <Zap className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Create Your CV Now - Free</span>
            </Link>
            <Link 
              href="#demo" 
              className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 min-h-[56px] touch-manipulation"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">See How It Works</span>
            </Link>
          </div>

          {/* Free vs Pro Quick Comparison */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto mb-8 border-2 border-blue-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Quick Comparison</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Free Column */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-center mb-3">
                  <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">FREE</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1 CV generation</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All 12 templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>ATS optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No credit card required</span>
                  </li>
                </ul>
              </div>
              
              {/* Pro Column */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-500 relative">
                <div className="absolute -top-2 -right-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">POPULAR</span>
                </div>
                <div className="text-center mb-3">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">PRO - £2.99/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited CV generations</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited cover letters</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All 12 templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <div className="mt-3 text-center">
                  <Link 
                    href="/pricing-comparison" 
                    className="text-blue-600 hover:text-blue-700 text-xs font-semibold inline-flex items-center"
                  >
                    See full comparison
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto mb-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Your journey to a better CV:</span>
              <span className="text-xs text-gray-500">Takes 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div className="text-xs font-medium text-gray-700">Upload</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div className="text-xs font-medium text-gray-700">Paste Job</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div className="text-xs font-medium text-gray-700">Download</div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 max-w-3xl mx-auto border border-green-200">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">10,000+</div>
                <div className="text-sm text-gray-600">CVs generated this month</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                <div className="text-sm text-gray-600">ATS pass rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">2 min</div>
                <div className="text-sm text-gray-600">Average time to create</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="demo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Your CV</h3>
              <p className="text-gray-600">
                Upload your existing CV in PDF or Word format. We&apos;ll extract all sections automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Add Job Details</h3>
              <p className="text-gray-600">
                Paste the job title and description. Choose your rewrite style and tone preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Download Optimized CV</h3>
              <p className="text-gray-600">
                Get your tailored CV with highlighted changes. Choose from 10 professional templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">CVs Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2 mins</div>
              <div className="text-blue-100">Average Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose My CV Buddy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another CV builder. We're your personal AI career assistant, helping you create job-winning CVs and resumes that get past ATS systems and impress recruiters.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Designed for Job Seekers</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether you're a recent graduate, career changer, or experienced professional, My CV Buddy adapts to your needs. Our AI understands different industries, job levels, and career paths, ensuring your CV speaks the language recruiters want to hear.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Perfect for:</strong> UK job seekers, US resume writers, international applicants, career changers, graduates, professionals seeking promotions, and anyone applying to multiple positions.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">⚡ Save Hours of Work</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Stop spending hours tailoring your CV for each application. Our AI does the heavy lifting in seconds, analyzing job descriptions, matching your experience, and optimizing keywords automatically. What used to take 2-3 hours now takes 2 minutes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Time saved:</strong> Average users save 15+ hours per job search, allowing you to apply to more positions and focus on interview preparation instead of CV formatting.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔒 Your Data is Safe</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We take privacy seriously. Your CV data is encrypted, never shared with third parties, and you maintain full control. Delete your data anytime with one click. GDPR compliant, SOC 2 certified, and trusted by thousands of professionals worldwide.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Security features:</strong> Bank-level encryption, secure authentication, automatic data retention policies, and compliance with UK and EU data protection laws.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💰 Affordable Pricing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Unlike expensive CV writing services that charge £100-500 per CV, My CV Buddy costs just £2.99/month for unlimited generations. That's unlimited tailoring for dozens of job applications.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Value comparison:</strong> Professional CV writers: £150-300 per CV. CV writing services: £50-100 per revision. My CV Buddy: £2.99/month for unlimited CVs. The choice is clear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Across All Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI understands industry-specific terminology, requirements, and best practices. Whether you're in tech, healthcare, finance, or creative fields, we've got you covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Technology & IT", icon: "💻", desc: "Software engineers, developers, data scientists, IT managers" },
              { name: "Healthcare", icon: "🏥", desc: "Nurses, doctors, medical professionals, healthcare administrators" },
              { name: "Finance & Banking", icon: "💼", desc: "Accountants, financial analysts, investment bankers, auditors" },
              { name: "Marketing & Sales", icon: "📊", desc: "Digital marketers, sales managers, brand strategists, SEO specialists" },
              { name: "Education", icon: "📚", desc: "Teachers, professors, administrators, education consultants" },
              { name: "Engineering", icon: "⚙️", desc: "Mechanical, electrical, civil, chemical engineers" },
              { name: "Creative & Design", icon: "🎨", desc: "Graphic designers, UX/UI designers, content creators, copywriters" },
              { name: "Legal", icon: "⚖️", desc: "Lawyers, paralegals, legal assistants, compliance officers" },
              { name: "Human Resources", icon: "👥", desc: "HR managers, recruiters, talent acquisition, people ops" },
              { name: "Hospitality", icon: "🏨", desc: "Hotel managers, chefs, event planners, tourism professionals" },
              { name: "Construction", icon: "🏗️", desc: "Project managers, architects, site supervisors, contractors" },
              { name: "Retail & E-commerce", icon: "🛍️", desc: "Store managers, buyers, merchandisers, e-commerce specialists" }
            ].map((industry, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Don't see your industry? <strong>My CV Buddy works for all professions.</strong> Our AI adapts to any field, role, or career level.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try It Free Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI-driven features designed to help you stand out from the competition
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: "ATS Optimization",
                description: "Beat applicant tracking systems with AI-powered keyword optimization and formatting that recruiters love."
              },
              {
                icon: FileText,
                title: "10 Professional Templates",
                description: "Modern, classic, creative, and industry-specific templates. All ATS-friendly and beautifully designed."
              },
              {
                icon: Zap,
                title: "Instant CV Tailoring",
                description: "AI analyzes job descriptions and adapts your experience to match requirements in seconds."
              },
              {
                icon: Award,
                title: "Cover Letter Generator",
                description: "Generate personalized cover letters that complement your CV using the same job details."
              },
              {
                icon: Download,
                title: "Multiple Export Formats",
                description: "Download as PDF, Word, HTML, or TXT. Perfect formatting preserved across all formats."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Bank-level encryption. Your data is never shared. GDPR compliant with automatic data retention."
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See how CV Adapter helped others land their dream jobs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                content: "Got 3 interviews in the first week after using CV Adapter. The ATS optimization really works!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Marketing Manager",
                content: "Saved me hours of work. The AI perfectly adapted my CV for each application. Highly recommend!",
                rating: 5
              },
              {
                name: "Emma Williams",
                role: "Product Designer",
                content: "The templates are beautiful and professional. Finally landed my dream job at a top tech company!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Start free, upgrade when you need more
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                £2.99<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited CV generations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited cover letters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>All 12 professional templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-500 relative hover:border-blue-600 transition-all">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Save £6/year
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">
                £29.99<span className="text-lg text-gray-600">/year</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Just £2.50/month
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited CV generations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited cover letters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>All 12 professional templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Link to Detailed Comparison */}
          <div className="mt-8 text-center">
            <Link 
              href="/pricing-comparison" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              See detailed feature comparison
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of successful job seekers who transformed their CVs with AI
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center bg-white text-blue-600 px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-xl"
          >
            Start Free Trial Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • Try free • £2.99/month or £29.99/year
          </p>
        </div>
      </section>

      {/* Common CV Mistakes Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Avoid These Common CV Mistakes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't let these errors cost you your dream job. My CV Buddy automatically fixes these issues and ensures your CV is error-free and ATS-optimized.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "❌ Generic, One-Size-Fits-All CVs",
                problem: "Sending the same CV to every job application is the #1 reason for rejection.",
                solution: "My CV Buddy tailors your CV to each specific job description, matching keywords and highlighting relevant experience automatically."
              },
              {
                title: "❌ Poor ATS Optimization",
                problem: "75% of CVs are rejected by Applicant Tracking Systems before a human ever sees them.",
                solution: "Our AI ensures proper formatting, keyword placement, and ATS-friendly structure so your CV passes automated screening."
              },
              {
                title: "❌ Missing Keywords",
                problem: "Not including exact keywords from the job description means your CV won't match the requirements.",
                solution: "We analyze job postings and automatically integrate relevant keywords naturally throughout your CV."
              },
              {
                title: "❌ Weak Achievement Statements",
                problem: "Vague descriptions like 'responsible for managing team' don't demonstrate impact or value.",
                solution: "Our AI helps you quantify achievements with metrics, percentages, and concrete results that impress recruiters."
              },
              {
                title: "❌ Poor Formatting & Design",
                problem: "Complex layouts, tables, graphics, and unusual fonts break ATS parsers and look unprofessional.",
                solution: "Choose from 10 professionally designed, ATS-friendly templates that look great and work with all systems."
              },
              {
                title: "❌ Spelling & Grammar Errors",
                problem: "Even small typos can disqualify you. Recruiters see errors as lack of attention to detail.",
                solution: "Our AI checks for errors and ensures professional, polished language throughout your CV."
              },
              {
                title: "❌ Too Long or Too Short",
                problem: "CVs that are too lengthy (3+ pages) or too brief (less than 1 page) get rejected.",
                solution: "We optimize content length, keeping only relevant information that matches the job requirements."
              },
              {
                title: "❌ Outdated Information",
                problem: "Including irrelevant old jobs, outdated skills, or ancient education details wastes valuable space.",
                solution: "Our AI prioritizes recent, relevant experience and removes outdated information automatically."
              },
              {
                title: "❌ No Customization for Industry",
                problem: "Using generic language instead of industry-specific terminology makes you seem unqualified.",
                solution: "My CV Buddy understands industry jargon and adapts your CV to match the language recruiters expect."
              }
            ].map((mistake, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{mistake.title}</h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">The Problem:</p>
                  <p className="text-sm text-gray-600">{mistake.problem}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">Our Solution:</p>
                  <p className="text-sm text-gray-600">{mistake.solution}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl p-8 max-w-3xl mx-auto shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Let AI Fix Your CV Mistakes Automatically
              </h3>
              <p className="text-gray-600 mb-6">
                Stop worrying about CV errors. My CV Buddy identifies and fixes these common mistakes automatically, ensuring your CV is professional, ATS-optimized, and tailored to each job you apply for.
              </p>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Fix My CV Now - Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-gray-500">1 free generation • No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of job seekers who landed their dream jobs with My CV Buddy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "My ATS score went from 30% to 89% after using My CV Buddy. I got 3 interview requests in one week!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  SM
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">Marketing Manager, London</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I was applying to 50+ jobs with no responses. After optimizing my resume, I got callbacks from 15 companies."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  JT
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">James T.</p>
                  <p className="text-sm text-gray-600">Software Engineer, Manchester</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Saved me hours of work! The AI understood exactly what the job required and tailored my CV perfectly."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  EP
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Emily P.</p>
                  <p className="text-sm text-gray-600">Project Manager, Birmingham</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Everything you need to know about My CV Buddy</p>
            </div>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>What's the difference between a CV and a resume?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  A CV (Curriculum Vitae) is typically longer and used in the UK, Europe, and academia. 
                  A resume is shorter (1-2 pages) and common in the US. My CV Buddy works with both formats 
                  and helps you create the right document for your target market, whether you're applying 
                  for jobs in the UK, US, or internationally.
                </p>
              </details>

              {/* FAQ Item 2 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>How does AI CV tailoring work?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Upload your CV, paste a job description, and our AI analyzes both documents. 
                  It identifies key requirements, matches relevant experience, optimizes keywords 
                  for ATS systems, and generates a tailored version that highlights your most 
                  relevant qualifications for that specific role. The process takes just seconds!
                </p>
              </details>

              {/* FAQ Item 3 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Is My CV Buddy free to use?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Yes! We offer 2 free CV generations to try the service. This includes AI tailoring, 
                  multiple export formats (PDF, DOCX, TXT), and access to all templates. For unlimited 
                  generations and premium features, upgrade to Pro for just £5 one-time payment (100 lifetime generations).
                </p>
              </details>

              {/* FAQ Item 4 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Will my CV pass ATS systems?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Yes! My CV Buddy is specifically designed to create ATS-optimized CVs. 
                  We use clean formatting, proper keyword placement, and standard section headers 
                  that applicant tracking systems can easily parse. Our AI also ensures your CV 
                  includes relevant keywords from the job description, maximizing your chances of 
                  passing the initial screening.
                </p>
              </details>

              {/* FAQ Item 5 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>What file formats can I upload and download?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  <strong>Upload:</strong> PDF (.pdf) and Word documents (.doc, .docx) up to 10MB. 
                  <strong> Download:</strong> PDF, DOCX, TXT, and HTML formats. All exports maintain 
                  professional formatting and are ATS-compatible, ensuring your CV looks great and 
                  works with any application system.
                </p>
              </details>

              {/* FAQ Item 6 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Can I create cover letters too?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Absolutely! My CV Buddy includes an AI-powered cover letter generator. 
                  Select a CV, enter job details (company name, position, hiring manager), 
                  choose your tone (professional, friendly, enthusiastic, or formal) and length, 
                  and we'll create a personalized cover letter that complements your CV perfectly.
                </p>
              </details>

              {/* FAQ Item 7 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Is my data secure and private?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Yes! We use industry-standard encryption, secure authentication, and follow 
                  GDPR guidelines. Your data is encrypted in transit and at rest. We never share 
                  your personal information with third parties for marketing purposes, and you can 
                  delete your account and all data at any time from your settings.
                </p>
              </details>

              {/* FAQ Item 8 */}
              <details className="bg-gray-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>How do I optimize my CV for a specific job?</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  It's simple: 1) Upload your existing CV, 2) Paste the job description from the posting, 
                  3) Click "Generate". Our AI will analyze the job requirements and tailor your CV to match. 
                  It highlights relevant experience, adds missing keywords, restructures content to emphasize 
                  your most applicable qualifications, and ensures ATS compatibility. You can then edit and 
                  download your tailored CV in your preferred format.
                </p>
              </details>
            </div>

            {/* CTA in FAQ */}
            <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to create your perfect CV?</h3>
              <p className="text-gray-600 mb-6">Join thousands of job seekers who landed their dream jobs</p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-bold">CV Adapter</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered CV tailoring and resume optimization for job seekers worldwide.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/auth/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white">CV Writing Tips</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/api-docs" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="hover:text-white">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} CV Adapter. All rights reserved.</p>
            <p className="mt-2">
              Helping job seekers create ATS-optimized resumes and cover letters with AI technology.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
