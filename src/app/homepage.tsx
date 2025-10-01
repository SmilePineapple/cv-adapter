import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Sparkles, Target, FileText, Award, Clock, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

// Force dynamic rendering to avoid Next.js 15 static generation bug
export const dynamic = 'force-dynamic'

// SEO Metadata - Optimized for mycvbuddy.com & mycvbuddy.co.uk
export const metadata: Metadata = {
  title: 'AI CV & Resume Builder | ATS-Optimised CV Generator UK & US | Free',
  description: 'Upload your CV or resume, paste job description, and instantly generate an ATS-friendly CV with AI. 100 free generations/month. Used by job seekers in UK, US & worldwide.',
  keywords: [
    // UK Terms
    'CV builder UK', 'CV generator', 'AI CV writer', 'CV writing tool', 
    'adapt my CV', 'tailor CV to job', 'CV optimizer UK', 'professional CV UK',
    'CV templates UK', 'ATS CV checker', 'curriculum vitae generator',
    'CV builder free UK', 'online CV maker', 'CV buddy',
    
    // US Terms  
    'resume builder USA', 'resume generator', 'AI resume writer', 'resume writing tool',
    'customize resume', 'tailor resume to job', 'resume optimizer', 'professional resume',
    'resume templates US', 'ATS resume checker', 'resume builder free',
    
    // Universal
    'ATS optimization', 'applicant tracking system', 'cover letter generator',
    'job-specific CV', 'keyword optimization', 'resume parser', 'free CV builder',
    'AI CV generator', 'job application CV', 'career profile builder',
    
    // Long-tail
    'AI tool to adapt CV to job description', 'automatically generate resume for job',
    'create job-specific CV in minutes', 'free CV builder online',
    'AI resume writing service', 'tailor CV to job description free',
    'how to optimize CV for ATS', 'CV keywords for job application'
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
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CV Adapter</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-5xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Trusted by 10,000+ job seekers</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Land Your Dream Job with an{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Tailored CV</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your resume, paste any job description, and get an ATS-optimized CV that passes applicant tracking systems and impresses recruiters. <strong>100% free to start.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/auth/signup" 
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              Start Free - No Credit Card
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#demo" 
              className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Watch Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              100 free generations/month
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Cancel anytime
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

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
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
          
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                £5<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>100 CV generations per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited cover letters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>All 10 professional templates</span>
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
            No credit card required • 100 free generations • Cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Everything you need to know about My CV Buddy
            </p>

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
                  Yes! We offer 100 free CV generations per month. This includes AI tailoring, 
                  multiple export formats (PDF, DOCX, TXT), and access to all templates. For unlimited 
                  generations and premium features like AI section population, upgrade to Pro for just £5/month.
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
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="hover:text-white">GDPR</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
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
