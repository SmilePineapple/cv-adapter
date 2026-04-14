import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Target, FileText, Sparkles, Shield, Clock, Award, Users, ChevronRight, Play, Crown } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { OAuthHandler } from '@/components/OAuthHandler'
import { TrackingInitializer } from '@/components/TrackingInitializer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Resume & CV Adapter | Tailor Your Resume to Any Job in 60 Seconds | My CV Buddy',
  description: 'Upload your resume or CV, paste the job description, and get a tailored ATS-optimized result in 60 seconds. The #1 AI resume adapter for US and UK job seekers. 1 free generation included.',
  keywords: ['resume adapter', 'ai resume adapter', 'resume adapter ai', 'resume buddy', 'resume tailoring tool', 'tailor resume to job description', 'mycvbuddy', 'my cv buddy', 'cv adapter', 'ai cv adapter', 'tailor cv to job description', 'cv tailoring tool', 'ats resume adapter', 'ats cv adapter', 'adapt resume for job', 'customize resume for job application', 'resume rewriter', 'job specific resume', 'resume builder', 'free resume builder', 'ai resume builder', 'cv builder', 'free cv builder', 'ats checker', 'cv maker', 'cv templates uk', 'optimize my resume', 'resume optimizer', 'fix my resume'],
  authors: [{ name: 'My CV Buddy' }],
  creator: 'My CV Buddy',
  publisher: 'My CV Buddy',
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
    canonical: 'https://www.mycvbuddy.com/',
  },
  openGraph: {
    title: 'AI Resume & CV Adapter | Tailor Your Resume to Any Job in 60 Seconds | My CV Buddy',
    description: 'Upload your resume or CV, paste any job description — get a perfectly tailored, ATS-optimized result in 60 seconds. Works for US resumes & UK CVs. 1 free generation included.',
    locale: 'en_US',
    type: 'website',
    siteName: 'My CV Buddy - AI Resume & CV Adapter',
    url: 'https://www.mycvbuddy.com/',
    images: [
      {
        url: 'https://www.mycvbuddy.com/graph.png',
        width: 1200,
        height: 630,
        alt: 'My CV Buddy - Tailor Your CV to Any Job Description in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Resume & CV Adapter | My CV Buddy — Tailor Your Resume in 60 Seconds',
    description: 'Upload your resume or CV, paste any job description — get an ATS-optimized, tailored result in 60 seconds. Free to try. Works for US resumes & UK CVs.',
    images: ['https://www.mycvbuddy.com/graph.png'],
  },
}

// Template preview data
const TEMPLATES = [
  { id: 'professional-metrics', name: 'Professional Metrics', color: 'from-blue-500 to-indigo-600', badge: 'Popular' },
  { id: 'teal-sidebar', name: 'Teal Sidebar', color: 'from-teal-500 to-cyan-600', badge: 'Modern' },
  { id: 'soft-header', name: 'Soft Header', color: 'from-purple-500 to-pink-600', badge: 'Creative' },
  { id: 'artistic-header', name: 'Artistic Header', color: 'from-pink-500 to-rose-600', badge: 'Bold' },
]

// Features data
const FEATURES = [
  {
    icon: Shield,
    title: 'ATS Optimised',
    description: 'CVs rigorously tested against major ATS systems to guarantee complete parsability',
    color: 'blue'
  },
  {
    icon: Sparkles,
    title: 'AI CV Tailoring',
    description: 'Quickly ensure your CV includes key skills and experiences by pasting the job advert',
    color: 'purple'
  },
  {
    icon: FileText,
    title: '20+ CV Sections',
    description: 'Express your professional history without limitations or concern about how your CV looks',
    color: 'green'
  },
  {
    icon: Target,
    title: 'CV Score Checker',
    description: 'Gain understanding of how effective your CV truly is with AI-powered insights',
    color: 'orange'
  }
]

// Steps data
const STEPS = [
  {
    number: '01',
    title: 'Upload Your CV',
    description: 'Upload your existing CV in PDF or Word format. We extract all sections automatically.',
    icon: Upload
  },
  {
    number: '02',
    title: 'Paste Job Description',
    description: 'Drop in the job ad and let AI analyze keywords, requirements, and role fit.',
    icon: FileText
  },
  {
    number: '03',
    title: 'Download & Apply',
    description: 'Get your tailored CV with highlighted changes. Ready to apply in 2 minutes.',
    icon: Download
  }
]

// Testimonials
const TESTIMONIALS = [
  {
    quote: "3 interviews in one week after using My CV Buddy. The AI tailoring actually works!",
    author: "Sarah Mitchell",
    role: "Software Engineer",
    avatar: "SM",
    color: "blue"
  },
  {
    quote: "Saved me hours of manual editing. The ATS optimization helped me get past the filters.",
    author: "James Cooper",
    role: "Marketing Manager",
    avatar: "JC",
    color: "purple"
  },
  {
    quote: "Best £2.99 I ever spent. Landed my dream job within 2 weeks of upgrading.",
    author: "Emma Watson",
    role: "Product Designer",
    avatar: "EW",
    color: "pink"
  }
]

export default function LandingPage() {
  return (
    <>
      <OAuthHandler />
      <StructuredData />
      <TrackingInitializer />
      
      <div className="min-h-screen bg-black text-white">
        {/* Minimalist Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg">CV</span>
                </div>
                <span className="text-2xl font-black tracking-tight">My CV Buddy</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#templates" className="text-gray-400 hover:text-white font-medium transition-colors">Templates</Link>
                <Link href="#features" className="text-gray-400 hover:text-white font-medium transition-colors">Features</Link>
                <Link href="#pricing" className="text-gray-400 hover:text-white font-medium transition-colors">Pricing</Link>
                <Link href="/auth/login" className="text-gray-400 hover:text-white font-medium transition-colors">Login</Link>
                <Link href="/auth/signup" className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all font-bold">
                  Get Started
                </Link>
              </nav>
              
              <Link href="/auth/signup" className="md:hidden bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm">
                Start Free
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section - Enhancv Inspired */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-semibold">Rated 4.8/5 by 10,000+ users</span>
            </div>
            
            {/* Main Headline - Enhancv Style */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter">
              Land Roles at Leading
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Companies</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto font-light">
              Upload your CV, paste the job description, and let AI instantly adapt your application for ATS systems and recruiters.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              <span className="text-white font-semibold">1 free generation included.</span> Works with UK CVs and{' '}
              <Link href="/resume-adapter" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">US resumes</Link>.
            </p>

            {/* Two CTAs - Enhancv Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/signup" 
                className="group bg-white text-black px-10 py-5 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                <span>Build Your CV Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                href="/ats-checker" 
                className="group border-2 border-white/30 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-3"
              >
                <Target className="w-6 h-6" />
                <span>Get Your CV Score</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>1 free generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
          </div>
        </section>

        {/* Template Showcase Section - Enhancv Inspired */}
        <section id="templates" className="py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                Professional Templates for
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Every Career</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Choose from 12+ ATS-friendly designs. All templates tested with major applicant tracking systems.
              </p>
            </div>

            {/* Template Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              {TEMPLATES.map((template) => (
                <div key={template.id} className="group relative">
                  <div className={`bg-gradient-to-br ${template.color} rounded-2xl p-1 transition-transform hover:scale-105`}>
                    <div className="bg-gray-900 rounded-2xl p-6 h-full">
                      {/* Template Preview Mock */}
                      <div className="bg-white/5 rounded-xl p-4 mb-4 aspect-[3/4] relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20`}></div>
                        <div className="relative space-y-3">
                          <div className="h-3 bg-white/20 rounded w-3/4"></div>
                          <div className="h-2 bg-white/10 rounded w-1/2"></div>
                          <div className="h-2 bg-white/10 rounded w-2/3"></div>
                          <div className="mt-6 space-y-2">
                            <div className="h-2 bg-white/10 rounded"></div>
                            <div className="h-2 bg-white/10 rounded w-5/6"></div>
                            <div className="h-2 bg-white/10 rounded w-4/5"></div>
                          </div>
                        </div>
                        {/* Badge */}
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                          <span className="text-xs font-bold">{template.badge}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-400">ATS-optimized • Professional</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link 
                href="/templates" 
                className="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-blue-400 transition-colors"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights - Enhancv Style Grid */}
        <section id="features" className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                Everything You Need to
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Land the Job</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {FEATURES.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group">
                  <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Visual Steps */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                How the CV Adapter
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-xl text-gray-400">Three simple steps to your perfect CV</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {STEPS.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 -z-10"></div>
                    )}
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-5xl font-black text-white/10 mb-2">{step.number}</div>
                      <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">95%</div>
                <div className="text-lg text-gray-400">ATS Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                <div className="text-lg text-gray-400">CVs Adapted</div>
              </div>
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black mb-2 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">2min</div>
                <div className="text-lg text-gray-400">Per CV</div>
              </div>
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">4.8</div>
                <div className="text-lg text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Demo - Before/After */}
        <section className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                  See the
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Transformation</span>
                </h2>
                <p className="text-xl text-gray-400">Same experience, tailored for the specific role</p>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-800 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full px-4 py-1 text-xs text-gray-400 text-center">
                    mycvbuddy.com/adapt
                  </div>
                </div>
                {/* Product UI mockup */}
                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-4">
                  {/* Input: Your CV */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Your CV</div>
                    <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs leading-relaxed">
                      <div className="text-blue-300 font-bold mb-1">Sarah Mitchell</div>
                      <div className="text-gray-500 mb-2">Software Engineer</div>
                      <div className="text-gray-400">• Responsible for code reviews</div>
                      <div className="text-gray-400">• Worked on backend tasks</div>
                      <div className="text-gray-400">• Collaborated with team</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">CV_2024.pdf ✓ uploaded</div>
                  </div>
                  {/* Input: Job Description */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Job Description</div>
                    <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-400 leading-relaxed">
                      <div className="text-white font-semibold mb-1">Senior Developer @ TechCorp</div>
                      <div>...Python, CI/CD pipelines, microservices, Agile delivery...</div>
                    </div>
                    <div className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg py-2 text-xs text-white text-center font-black">
                      Adapt My CV →
                    </div>
                  </div>
                  {/* Output: Tailored CV */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-green-500/30">
                    <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-2">Tailored CV ✓</div>
                    <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs leading-relaxed">
                      <div className="text-blue-300 font-bold mb-1">Sarah Mitchell</div>
                      <div className="text-gray-500 mb-2">Senior Python Developer</div>
                      <div className="text-green-300">• Led code reviews for 8-person Agile team</div>
                      <div className="text-green-300">• Built Python microservices</div>
                      <div className="text-green-300">• Delivered 12+ CI/CD sprints</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-green-400 font-bold">ATS Score: 94% ↑</div>
                      <div className="text-xs text-gray-400">PDF • DOCX</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Cards */}
        <section className="py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                Real People.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Real Results.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {TESTIMONIALS.map((testimonial, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${testimonial.color}-500/20 rounded-full flex items-center justify-center`}>
                      <span className={`text-${testimonial.color}-400 font-bold`}>{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                Simple Pricing.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Unlimited Value.</span>
              </h2>
              <p className="text-xl text-gray-400">One plan, everything included</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center">
                <div className="mb-2">
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold">Pro Plan</span>
                </div>
                <div className="mb-6">
                  <div className="text-6xl font-black">£2.99</div>
                  <div className="text-gray-400">per month</div>
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Unlimited CV generations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Unlimited cover letters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>12+ professional templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>ATS optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Interview prep tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </div>
                </div>

                <Link 
                  href="/auth/signup" 
                  className="block w-full bg-white text-black px-8 py-4 rounded-full text-lg font-black hover:bg-gray-100 transition-all shadow-xl"
                >
                  Try 1 Free Generation
                </Link>

                <p className="text-gray-400 mt-4 text-sm">No credit card required</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-black mb-4">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Is My CV Buddy really free?",
                    a: "Yes! You get 1 free CV adaptation with no credit card required. Upload your CV, paste any job description, and get a tailored, ATS-optimised CV instantly. For unlimited adaptations, upgrade to Pro for just £2.99/month."
                  },
                  {
                    q: "How does the AI CV adapter work?",
                    a: "Our AI analyzes your existing CV and the job description you provide. It identifies key requirements, matches relevant experience from your background, and optimizes keywords for ATS systems. The AI rewrites your CV sections to highlight the most relevant skills for each specific role."
                  },
                  {
                    q: "Will my CV pass ATS systems?",
                    a: "Absolutely! My CV Buddy creates ATS-optimized CVs with a 95% pass rate. We use clean formatting, proper keyword placement, and ATS-friendly fonts that applicant tracking systems can easily parse."
                  },
                  {
                    q: "How long does it take?",
                    a: "Our AI generates a fully tailored CV in just 30-60 seconds. The entire process from upload to download takes about 2 minutes - perfect for applying to multiple jobs quickly."
                  }
                ].map((faq, index) => (
                  <details key={index} className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <summary className="flex justify-between items-center cursor-pointer p-6 hover:bg-white/5 transition-colors">
                      <h3 className="text-lg font-bold pr-4">{faq.q}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
              Ready to Land Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dream Job?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join 10,000+ job seekers who transformed their CVs with AI. Start free today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup" 
                className="bg-white text-black px-10 py-5 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center justify-center gap-3"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            <p className="text-gray-500 mt-6">1 free generation • No credit card • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-black border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto mb-12">
              <div>
                <Link href="/" className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-lg">CV</span>
                  </div>
                  <span className="text-xl font-black">My CV Buddy</span>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AI-powered CV adapter that tailors your application to any job description in seconds.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/resume-adapter" className="hover:text-white transition-colors">Resume Adapter</Link></li>
                  <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                  <li><Link href="/ats-checker" className="hover:text-white transition-colors">ATS Checker</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/resume-builder-usa" className="hover:text-white transition-colors">Resume Builder USA</Link></li>
                  <li><Link href="/blog/resume-vs-cv-difference" className="hover:text-white transition-colors">Resume vs CV</Link></li>
                  <li><Link href="/cv-examples" className="hover:text-white transition-colors">CV Examples</Link></li>
                  <li><Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
