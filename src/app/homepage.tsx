import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Target, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { OAuthHandler } from '@/components/OAuthHandler'
import { TrackingInitializer } from '@/components/TrackingInitializer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My CV Buddy | AI CV Adapter | Tailor Your CV to Any Job Description',
  description: 'Upload your CV, paste the job description, and get a tailored ATS-optimised CV in seconds. My CV Buddy is the leading AI CV adapter for UK job seekers and US resume builders. 1 free generation included.',
  keywords: ['mycvbuddy', 'my cv buddy', 'mycv', 'cv adapter', 'ai cv adapter', 'tailor cv to job description', 'resume adapter', 'cv tailoring tool', 'ats cv adapter', 'adapt cv for job', 'customize cv for job application', 'cv rewriter', 'job specific cv', 'cv builder', 'free cv builder', 'resume builder', 'ai cv builder', 'ats cv checker', 'cv maker', 'free resume builder', 'cv templates uk'],
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
    title: 'My CV Buddy | AI CV Adapter | Tailor Your CV to Any Job Description',
    description: 'Upload your CV, paste the job description, and get a tailored ATS-optimised CV in seconds. The leading AI CV adapter for UK job seekers. 1 free generation included.',
    locale: 'en_GB',
    type: 'website',
    siteName: 'My CV Buddy - AI CV Adapter',
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
    title: 'My CV Buddy | AI CV Adapter | Tailor Your CV to Any Job Description',
    description: 'Upload your CV, paste the job description, and get a tailored ATS-optimised CV in seconds. The leading AI CV adapter for UK job seekers. 1 free generation included.',
    images: ['https://www.mycvbuddy.com/graph.png'],
  },
}

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
                <Link href="#pricing" className="text-gray-400 hover:text-white font-medium transition-colors">Pricing</Link>
                <Link href="/auth/login" className="text-gray-400 hover:text-white font-medium transition-colors">Login</Link>
                <Link href="/auth/signup" className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all font-bold">
                  Start Free
                </Link>
              </nav>
              
              <Link href="/auth/signup" className="md:hidden bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm">
                Start Free
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section - Bold & Minimalist */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-semibold">Rated 4.8/5 on Trustpilot</span>
            </div>
            
            {/* Trustpilot Widget - Client-side only to avoid hydration errors */}
            <div className="flex justify-center mb-8">
              <a 
                href="https://uk.trustpilot.com/review/mycvbuddy.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                View our Trustpilot reviews
              </a>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">
              Tailor Your CV to Any
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Job Description — in Seconds</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              Upload your CV, paste the job description, and let AI instantly adapt your application for ATS systems and recruiters.
              <br className="hidden sm:block" />
              <span className="text-white font-semibold">Works with UK CVs and US resumes.</span> 1 free generation — no card needed.
            </p>

            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 max-w-xl">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-200">Built to adapt your existing CV — not invent fake experience.</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/auth/signup" 
                className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                <span>Adapt My CV Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Keeps your formatting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>PDF &amp; Word supported</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>ATS keyword match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>UK CVs + US resumes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Adapts your real CV — not invented</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
          </div>
        </section>

        {/* Privacy Trust Strip */}
        <section className="py-5 bg-gray-900 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Your CV stays private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Delete your data anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Secure account storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>No AI training on your content</span>
              </div>
            </div>
          </div>
        </section>

        {/* Video Showcase Section */}
        <section className="py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  AI CV Adapter:
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">2-Minute CV Makeover</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Discover why 75% of CVs get rejected by ATS systems — and how our AI CV adapter tailors your application for that specific role in 2 minutes.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-800 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full px-4 py-1 text-xs text-gray-400 text-center">
                    mycvbuddy.com/dashboard
                  </div>
                </div>
                {/* Product UI mockup */}
                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-4">
                  {/* Input: Your CV */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Your CV</div>
                    <div className="bg-gray-700 rounded-lg p-3 font-mono leading-relaxed">
                      <div className="text-blue-300 text-xs font-bold mb-1">Sarah Mitchell</div>
                      <div className="text-gray-500 text-xs mb-2">Software Engineer</div>
                      <div className="text-gray-400 text-xs">• Responsible for code reviews</div>
                      <div className="text-gray-400 text-xs">• Worked on backend tasks</div>
                      <div className="text-gray-400 text-xs">• Collaborated with team members</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">CV_2024.pdf ✓ uploaded</div>
                  </div>
                  {/* Input: Job Description */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Job Description</div>
                    <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-400 leading-relaxed">
                      <div className="text-white font-semibold mb-1">Senior Developer @ Acme</div>
                      <div>...Python, CI/CD pipelines, microservices, Agile delivery, team leadership...</div>
                    </div>
                    <div className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg py-2 text-xs text-white text-center font-black">
                      Adapt My CV →
                    </div>
                  </div>
                  {/* Output: Tailored CV */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20">
                    <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-2">Tailored CV ✓</div>
                    <div className="bg-gray-700 rounded-lg p-3 font-mono leading-relaxed">
                      <div className="text-blue-300 text-xs font-bold mb-1">Sarah Mitchell</div>
                      <div className="text-gray-500 text-xs mb-2">Senior Python Developer</div>
                      <div className="text-green-300 text-xs">• Led code reviews for 8-person Agile team, reducing defects by 40%</div>
                      <div className="text-green-300 text-xs">• Built Python microservices cutting API latency by 25%</div>
                      <div className="text-green-300 text-xs">• Delivered 12+ CI/CD sprints across distributed teams</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-green-400 font-bold">ATS Score: 94% ↑</div>
                      <div className="text-xs text-gray-400">PDF · DOCX · TXT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-black text-white mb-2">75%</div>
                  <div className="text-sm text-gray-400">CVs rejected by ATS systems</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-black text-white mb-2">2 mins</div>
                  <div className="text-sm text-gray-400">To create a tailored CV</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-black text-white mb-2">95%</div>
                  <div className="text-sm text-gray-400">ATS pass rate achieved</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before / After Transformation */}
        <section className="py-24 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                  See the Difference
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Before &amp; After Adaptation</span>
                </h2>
                <p className="text-xl text-gray-400">The same experience — adapted to match a specific job description</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-8">
                  <div className="text-red-400 font-black text-sm uppercase tracking-wider mb-4">✗ Before — Generic CV</div>
                  <p className="text-gray-300 text-lg leading-relaxed italic">&quot;Responsible for managing team projects and improving processes.&quot;</p>
                  <div className="mt-4 text-xs text-gray-500">ATS match: low · No job-specific keywords · Vague impact</div>
                </div>

                <div className="bg-green-950/30 border border-green-500/30 rounded-2xl p-8">
                  <div className="text-green-400 font-black text-sm uppercase tracking-wider mb-4">✓ After — Adapted CV</div>
                  <p className="text-gray-300 text-lg leading-relaxed italic">&quot;Led cross-functional delivery of 12 client projects, reducing time-to-completion by 18% through Agile process improvements.&quot;</p>
                  <div className="mt-4 text-xs text-gray-500">ATS match: high · Keywords matched · Quantified impact</div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-lg font-black hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
                  <span>Adapt My CV Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Best For / Built to Adapt - Qualifier */}
        <section className="py-20 bg-black border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="text-blue-400 font-black text-sm uppercase tracking-widest mb-6">Best for</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Applying to multiple roles from one base CV</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Tailoring your CV to a specific job description</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>ATS keyword optimisation without the guesswork</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>UK CVs and US resumes — both fully supported</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Faster applications without starting from scratch</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-purple-400 font-black text-sm uppercase tracking-widest mb-6">Built to adapt — not invent</p>
                <p className="text-gray-200 text-xl leading-relaxed mb-5 font-medium">
                  My CV Buddy is not a blank-slate CV generator.
                </p>
                <p className="text-gray-400 text-base leading-relaxed mb-5">
                  It takes your <span className="text-white font-semibold">real, existing CV</span> and adapts it to match each job description — preserving your genuine experience while optimising keywords and language for that specific role.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Your experience stays yours. The AI just makes sure it speaks the right language for each job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Ultra Minimalist */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-6 tracking-tight">
                How the CV Adapter Works:
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Three Simple Steps</span>
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">1</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Upload Your Existing CV</h3>
                  <p className="text-xl text-gray-600">Upload your PDF or Word CV — we extract all your sections automatically. No reformatting needed.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">2</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Paste the Job Description</h3>
                  <p className="text-xl text-gray-600">Drop in the job ad and let the AI analyse keywords, requirements, and role fit for that specific position.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">3</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Get Your Tailored CV</h3>
                  <p className="text-xl text-gray-600">See exactly what changed, edit if needed, and download in DOCX, PDF, or TXT. Ready to apply in minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infographic Section - Visual Explanation */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
                  Why Choose the
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI CV Adapter?</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  See how our AI-powered CV adapter tailors your application and solves the ATS problem in 2 minutes
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <img 
                  src="/graph.png" 
                  alt="Beat the Robots: Optimize Your CV in 2 Minutes - Complete infographic showing ATS rejection problem, CV Buddy solution, and proven results"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>

              <div className="mt-12 text-center">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-lg font-black hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <span>Try CV Buddy Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Bold Stats */}
        <section className="py-32 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
                The Numbers
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Don't Lie.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">95%</div>
                <div className="text-lg text-gray-400">ATS Pass Rate</div>
                <div className="text-xs text-gray-600 mt-1">Internal ATS formatting tests</div>
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                <div className="text-lg text-gray-400">CVs Adapted</div>
                <div className="text-xs text-gray-600 mt-1">Since launch</div>
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">2min</div>
                <div className="text-lg text-gray-400">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">4.9</div>
                <div className="text-lg text-gray-400">Rating</div>
                <div className="text-xs text-gray-600 mt-1">Early user reviews</div>
              </div>
            </div>
            <p className="text-xs text-gray-700 text-center mt-8">Based on internal formatting tests and early user feedback.</p>
          </div>
        </section>

        {/* Testimonials - Minimalist */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-6 tracking-tight">
                  Real People.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Real Results.</span>
                </h2>
              </div>
              
              <div className="space-y-12">
                <div className="border-l-4 border-blue-600 pl-8">
                  <p className="text-2xl text-gray-800 mb-4 font-medium">&quot;3 interviews in one week. This thing actually works.&quot;</p>
                  <div className="text-gray-600">— Sarah J., Software Engineer</div>
                </div>
                
                <div className="border-l-4 border-purple-600 pl-8">
                  <p className="text-2xl text-gray-800 mb-4 font-medium">&quot;Saved me hours. The AI is scary good.&quot;</p>
                  <div className="text-gray-600">— Michael C., Marketing Manager</div>
                </div>
                
                <div className="border-l-4 border-pink-600 pl-8">
                  <p className="text-2xl text-gray-800 mb-4 font-medium">&quot;Got my dream job. Worth every penny.&quot;</p>
                  <div className="text-gray-600">— Emma W., Product Designer</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-8 text-center">Testimonials are user-reported outcomes.</p>
            </div>
          </div>
        </section>

        {/* Pricing - Dramatic & Simple */}
        <section id="pricing" className="py-32 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
                One Price.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Unlimited CVs.</span>
              </h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
                <div className="mb-8">
                  <div className="text-7xl sm:text-8xl font-black mb-4">£2.99</div>
                  <div className="text-2xl text-gray-400">per month</div>
                </div>
                
                <div className="space-y-4 mb-10 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-lg">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Unlimited CV generations</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Unlimited cover letters</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>12 professional templates</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
                
                <Link 
                  href="/auth/signup" 
                  className="block w-full bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl"
                >
                  Try 1 Free Generation
                </Link>
                
                <p className="text-gray-400 mt-6">No credit card required</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section - Internal Linking for SEO */}
        <section className="py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
                  Free <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CV Resources</span>
                </h2>
                <p className="text-xl text-gray-600">Expert guides to help you land your dream job</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <Link href="/ats-checker" className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                    <Target className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-green-600 transition-colors">Free ATS CV Checker</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Check if your CV will pass Applicant Tracking Systems. Get instant ATS score and recommendations.</p>
                  <span className="text-green-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Check ATS Score
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                
                <Link href="/templates" className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                    <FileText className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-purple-600 transition-colors">Free CV Templates UK</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Browse 12 professional, ATS-friendly CV templates for all industries. Modern, classic, and creative designs.</p>
                  <span className="text-purple-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Templates
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                
                <Link href="/ats-optimization-guide" className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-blue-600 transition-colors">ATS Optimization Guide</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Learn how to beat applicant tracking systems and get your CV past the robots. Complete guide with examples and best practices.</p>
                  <span className="text-blue-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link href="/cv-writing-guide" className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                    <CheckCircle className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-purple-600 transition-colors">CV Writing Guide</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Master the art of CV writing with our comprehensive guide. From structure to content, learn what recruiters want to see.</p>
                  <span className="text-purple-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link href="/cv-examples" className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-pink-500">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                    <Star className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-pink-600 transition-colors">CV Examples by Industry</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Browse real CV examples from successful candidates across different industries and career levels in the UK.</p>
                  <span className="text-pink-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Examples <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Link href="/blog/cv-examples-by-industry-uk" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-400">
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">15 CV Examples by Industry (UK)</h3>
                  <p className="text-gray-500 text-sm">Real CV examples across IT, marketing, healthcare, finance & more.</p>
                </Link>
                <Link href="/blog/cv-personal-statement-examples" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-indigo-400">
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-indigo-600 transition-colors">CV Personal Statement Examples</h3>
                  <p className="text-gray-500 text-sm">15 proven personal statement templates for every career level.</p>
                </Link>
                <Link href="/blog/graduate-cv-no-experience-uk" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-green-400">
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-green-600 transition-colors">Graduate CV: No Experience Guide</h3>
                  <p className="text-gray-500 text-sm">How to write a compelling CV when you have no work experience.</p>
                </Link>
              </div>

              <div className="mt-12 text-center">
                <Link href="/blog" className="inline-flex items-center gap-2 text-lg font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  <span>Browse All Career Resources</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Optimized */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600">Everything you need to know about creating the perfect CV</p>
              </div>
              
              <div className="space-y-6">
                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">Is My CV Buddy really free?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">Yes! My CV Buddy includes 1 free CV adaptation with no credit card required. Simply upload your existing CV, paste any job description, and get a perfectly tailored, ATS-optimised CV. For unlimited adaptations, cover letters, and interview prep tools, upgrade to Pro for just £2.99/month.</p>
                </details>

                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">How does the AI resume adapter work?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">Our AI resume adapter and CV generator analyzes your existing CV and the job description you provide. It identifies key requirements, matches relevant experience from your background, and optimizes keywords for Applicant Tracking Systems (ATS). The AI rewrites your CV sections to highlight the most relevant skills and achievements for each specific role, dramatically increasing your chances of getting past ATS filters and landing interviews. This intelligent resume adaptation ensures every application is perfectly tailored.</p>
                </details>

                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">Will my CV pass ATS systems?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">Absolutely! My CV Buddy creates ATS-optimized CVs with a 95% pass rate. We use clean formatting, proper keyword placement, standard section headers, and ATS-friendly fonts that applicant tracking systems can easily parse. Our AI matches keywords from the job description and strategically places them throughout your CV to maximize your ATS score while keeping it natural and readable for human recruiters.</p>
                </details>

                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">How long does it take to generate a CV?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">Our AI generates a fully tailored, ATS-optimized CV in just 30-60 seconds. Simply upload your existing CV (PDF or Word), paste the job description, and click generate. You can then review, edit, and download your new CV immediately. The entire process from upload to download takes about 2 minutes - perfect for applying to multiple jobs quickly.</p>
                </details>

                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">What file formats can I download?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">You can export your CV in multiple formats including PDF, DOCX (Microsoft Word), TXT, and HTML. All formats are ATS-friendly and professionally formatted. We recommend PDF for most applications as it preserves formatting across all devices, but DOCX is useful if employers specifically request Word documents.</p>
                </details>

                <details className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-black text-black">Do you offer professional CV templates?</h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">Yes! We offer 12+ professional CV templates optimized for UK and international job markets. All templates are ATS-friendly, modern, and can be customized to match your industry. Choose from minimalist, creative, executive, and traditional designs. Each template is designed by professional CV writers and tested with major ATS systems.</p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Who Uses Section - SEO Optimized */}
        <section className="py-32 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
                  Who Uses <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My CV Buddy?</span>
                </h2>
                <p className="text-xl text-gray-400">Trusted by job seekers across all industries and career levels</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-black mb-4">Recent Graduates</h3>
                  <p className="text-gray-300 leading-relaxed">Create your first professional CV with no experience. Our AI helps you highlight education, projects, internships, and transferable skills to land your first job in the UK job market.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-black mb-4">Career Changers</h3>
                  <p className="text-gray-300 leading-relaxed">Transitioning to a new industry? Our AI CV adapter identifies transferable skills and reframes your existing experience to match new career paths — perfect for professionals pivoting to tech, marketing, finance, or any field.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-black mb-4">Senior Professionals</h3>
                  <p className="text-gray-300 leading-relaxed">Showcase executive leadership and strategic achievements. Our AI helps senior managers, directors, and C-suite professionals create compelling CVs that highlight impact, leadership, and business results.</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-lg text-gray-400 mb-8">Popular for roles in: Software Engineering, Marketing, Finance, Healthcare, Education, Sales, Project Management, Data Science, HR, and more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Deep Dive - SEO Content */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
                  Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My CV Buddy?</span>
                </h2>
                <p className="text-xl text-gray-600">The UK's most advanced AI-powered CV adapter and tailoring tool</p>
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">ATS Optimization Technology</h3>
                    <p className="text-gray-700 leading-relaxed">Over 75% of CVs are rejected by ATS before a human ever sees them. My CV Buddy analyses the job description, extracts what the recruiter actually cares about, and adapts your CV to match — with the right keywords in the right places. Clean formatting, standard headers, and content that passes the robots so recruiters can actually read it.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">Intelligent Job Matching</h3>
                    <p className="text-gray-700 leading-relaxed">Paste a job description and the AI reads what actually matters for that role. It selects the most relevant parts of your existing experience, rewrites your bullet points in the employer’s language, and makes sure every section answers the question they’re really asking: <em>can this person do this specific job?</em> No invented skills. No fluff.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">Professional Templates & Formats</h3>
                    <p className="text-gray-700 leading-relaxed">Choose from 12+ professionally designed CV templates created by expert CV writers and recruiters. Every template is ATS-compatible, mobile-responsive, and optimized for UK job applications. Whether you need a minimalist design for tech roles, a creative layout for marketing positions, or a traditional format for corporate jobs, we have the perfect template. Export in PDF, DOCX, or other formats with one click.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-8 h-8 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">Cover Letters & Interview Prep</h3>
                    <p className="text-gray-700 leading-relaxed">A great CV is just the start. My CV Buddy also generates personalized cover letters that complement your CV and address specific job requirements. Our interview preparation tools help you practice common questions, prepare compelling answers based on your experience, and build confidence for your interviews. It's a complete job application toolkit in one platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Dramatic */}
        <section className="py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 tracking-tight">
              Stop Wasting Time.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Start Getting Interviews.</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join 10,000+ job seekers who transformed their CVs with AI.
            </p>
            
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
            >
              <span>Get Your Free Generation</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            <p className="text-gray-400 mt-6">1 free generation included • No credit card • Cancel anytime</p>
          </div>
        </section>

        {/* Footer - Minimal */}
        <footer className="py-12 bg-black text-gray-400 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg">CV</span>
                </div>
                <span className="text-xl font-black text-white">My CV Buddy</span>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link>
              <Link href="/cv-writing-guide" className="hover:text-white transition-colors">CV Writing</Link>
              <Link href="/cv-examples" className="hover:text-white transition-colors">Examples</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            
            <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
