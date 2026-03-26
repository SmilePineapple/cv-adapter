import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Target, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { OAuthHandler } from '@/components/OAuthHandler'
import { TrackingInitializer } from '@/components/TrackingInitializer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Free CV Builder UK 2026: AI Resume Adapter & ATS Optimizer',
  description: '✓ 10,000+ CVs created ✓ 95% ATS pass rate ✓ 2-minute setup. Free CV builder UK with AI resume adapter. 12 professional templates. Beat ATS systems. Upload your CV, paste any job, get perfectly tailored results. Free to try, no sign up required.',
  keywords: ['free cv builder uk', 'cv builder uk', 'resume adapter', 'CV generator UK free', 'free CV builder', 'AI CV writer', 'ATS optimization', 'resume builder', 'ats cv optimizer', 'free cv builder no sign up', 'ai cv builder uk', 'cv template uk free', 'professional cv builder uk', 'ats cv checker'],
  openGraph: {
    title: 'Free AI CV Builder UK | Get More Interviews in 2 Minutes',
    description: '✓ 10,000+ CVs created ✓ 95% ATS pass rate. Upload your CV, paste any job, get a perfectly tailored CV instantly.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'My CV Buddy',
    url: 'https://www.mycvbuddy.com',
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
              AI Resume Adapter
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">& CV Builder UK</span>
              <br />
              In 2 Minutes.
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              AI-powered resume adapter & ATS CV optimizer that beats applicant tracking systems.
              <br className="hidden sm:block" />
              <span className="text-white font-semibold">95% pass rate.</span> Free to try.
            </p>

            {/* NotebookLLM Video - Hero */}
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
                <video 
                  controls 
                  preload="metadata"
                  className="w-full aspect-video"
                >
                  <source src="/videos/cv-makeover.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">
                🎙️ Listen: Why 75% of CVs get rejected & how to fix it in 2 minutes
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/auth/signup" 
                className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                <span>Start Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>2 min setup</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
          </div>
        </section>

        {/* Video Showcase Section */}
        <section className="py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  The 2-Minute
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CV Makeover</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Discover why 75% of CVs get rejected by robots—and how CV Buddy fixes it in 2 minutes.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <video 
                  controls 
                  preload="metadata"
                  className="w-full aspect-video bg-black"
                >
                  <source src="/videos/cv-makeover.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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

        {/* How It Works - Ultra Minimalist */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-6 tracking-tight">
                Three Steps.
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">That's It.</span>
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">1</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Upload</h3>
                  <p className="text-xl text-gray-600">Drop your CV. PDF or Word. Done.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">2</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Paste Job</h3>
                  <p className="text-xl text-gray-600">Copy the job description. AI does the rest.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black">3</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-black mb-3">Download</h3>
                  <p className="text-xl text-gray-600">Get your optimized CV. Apply with confidence.</p>
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
                  The Complete
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Picture</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  See how CV Buddy solves the ATS problem in 2 minutes
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
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                <div className="text-lg text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">2min</div>
                <div className="text-lg text-gray-400">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">4.9</div>
                <div className="text-lg text-gray-400">Rating</div>
              </div>
            </div>
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
                  Start Free Trial
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
                  <p className="mt-4 text-gray-700 leading-relaxed">Yes! My CV Buddy offers 2 free CV generations with no credit card required. Our free CV builder UK service lets you upload your CV, paste any job description, and get a perfectly tailored, ATS-optimized CV. For unlimited access to CV generation, cover letters, and interview prep tools, upgrade to Pro for just £2.99/month.</p>
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
                  <p className="text-gray-300 leading-relaxed">Transitioning to a new industry? Our AI CV builder identifies transferable skills and reframes your experience to match new career paths. Perfect for professionals pivoting to tech, marketing, finance, or any field.</p>
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
                <p className="text-xl text-gray-600">The UK's most advanced AI-powered CV builder</p>
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">ATS Optimization Technology</h3>
                    <p className="text-gray-700 leading-relaxed">Over 75% of CVs are rejected by Applicant Tracking Systems before a human ever sees them. Our AI CV generator uses advanced natural language processing to analyze job descriptions, extract key requirements, and optimize your CV with the right keywords in the right places. We achieve a 95% ATS pass rate by using clean formatting, standard section headers, and strategic keyword placement that both ATS systems and human recruiters love.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-3">Intelligent Job Matching</h3>
                    <p className="text-gray-700 leading-relaxed">Our AI doesn't just add keywords - it understands context. When you paste a job description, our system analyzes the role requirements, company culture, and industry standards. It then intelligently selects and highlights the most relevant experiences from your background, rewrites achievements to match the job's language, and ensures every section of your CV speaks directly to what the employer is looking for.</p>
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
              <span>Start Free Trial</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            <p className="text-gray-400 mt-6">No credit card • 2 minutes setup • Cancel anytime</p>
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
