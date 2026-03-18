import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { OAuthHandler } from '@/components/OAuthHandler'
import { TrackingInitializer } from '@/components/TrackingInitializer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Free AI CV Builder UK | Get More Interviews in 2 Minutes | My CV Buddy',
  description: '✓ 10,000+ CVs created ✓ 95% ATS pass rate ✓ 2-minute setup. Upload your CV, paste any job description, get a perfectly tailored CV that beats ATS systems. Free to try - no credit card needed.',
  keywords: ['CV generator UK free', 'free CV builder', 'AI CV writer', 'ATS optimization', 'resume builder'],
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
              <span className="text-sm font-semibold">10,000+ users</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">
              Your CV.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Optimized.</span>
              <br />
              In 2 Minutes.
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              AI-powered CV tailoring that beats ATS systems.
              <br className="hidden sm:block" />
              <span className="text-white font-semibold">95% pass rate.</span> No fluff.
            </p>
            
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
