import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Target, FileText, TrendingUp, Award } from 'lucide-react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Free Resume Builder for USA | AI-Powered ATS Optimizer 2026',
  description: '✓ 10,000+ resumes created ✓ 95% ATS pass rate ✓ 2-minute setup. Free resume builder designed for USA job seekers. Beat applicant tracking systems with AI-powered optimization. 12 professional templates. No credit card required.',
  keywords: ['free resume builder', 'resume builder', 'resume maker', 'ats resume optimizer', 'professional resume builder', 'resume template free', 'ai resume builder', 'resume creator', 'ats friendly resume', 'free resume builder no sign up', 'best resume builder', 'resume builder for students'],
  authors: [{ name: 'CV Buddy' }],
  creator: 'CV Buddy',
  publisher: 'CV Buddy',
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
    canonical: 'https://www.mycvbuddy.com/resume-builder-usa',
  },
  openGraph: {
    title: 'Free Resume Builder for USA | 95% ATS Pass Rate',
    description: '✓ 10,000+ resumes created ✓ 95% ATS pass rate. AI-powered resume builder designed for USA job seekers. Free to try, no credit card required.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CV Buddy - Resume Builder',
    url: 'https://www.mycvbuddy.com/resume-builder-usa',
    images: [
      {
        url: 'https://www.mycvbuddy.com/graph.png',
        width: 1200,
        height: 630,
        alt: 'Free Resume Builder for USA - Beat ATS Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder for USA | 95% ATS Pass Rate',
    description: '✓ 10,000+ resumes created ✓ 95% ATS pass rate. AI-powered resume builder designed for USA job seekers.',
    images: ['https://www.mycvbuddy.com/graph.png'],
  },
}

export default function USAResumePage() {
  return (
    <>
      <StructuredData />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">Trusted by 10,000+ USA Job Seekers</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">
            Free Resume Builder
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">for USA Job Seekers</span>
            <br />
            In 2 Minutes.
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            AI-powered resume builder that beats applicant tracking systems (ATS).
            <br className="hidden sm:block" />
            <span className="text-white font-semibold">95% pass rate.</span> Free to try. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/auth/signup" 
              className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center justify-center gap-3"
            >
              <span>Create Free Resume</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="/templates" 
              className="group bg-transparent border-2 border-white text-white px-12 py-6 rounded-full text-xl font-black hover:bg-white hover:text-black transition-all inline-flex items-center justify-center gap-3"
            >
              <span>View Templates</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>95% ATS pass rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>2-minute setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why USA Job Seekers Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              Built for the <span className="text-blue-600">USA Job Market</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI understands USA resume formats, ATS systems used by American companies, and what recruiters in the United States look for.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">ATS Optimization</h3>
              <p className="text-gray-600 mb-4">
                Beat applicant tracking systems used by 75% of USA companies. Our AI ensures your resume passes automated screening.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Keyword optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ATS-friendly formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>95% pass rate</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Tailoring</h3>
              <p className="text-gray-600 mb-4">
                Upload your resume, paste any USA job posting, and get a perfectly tailored resume in seconds.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Job description matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Skills highlighting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>2-minute turnaround</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional Templates</h3>
              <p className="text-gray-600 mb-4">
                12 USA-style resume templates designed by recruiters. Clean, modern, and ATS-friendly.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Harvard Business School format</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Silicon Valley tech style</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Export to PDF/DOCX</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              Create Your Resume in <span className="text-blue-600">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600">
              From upload to download in under 2 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Upload Resume</h3>
              <p className="text-gray-600">
                Upload your existing resume or start from scratch with our templates
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Paste Job Description</h3>
              <p className="text-gray-600">
                Copy and paste the job posting from any USA company
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Download & Apply</h3>
              <p className="text-gray-600">
                Get your ATS-optimized resume and start applying to jobs
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Start Building Your Resume</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* USA Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              Trusted by <span className="text-blue-600">USA Job Seekers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div>
              <div className="text-5xl font-black text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-5xl font-black text-pink-600 mb-2">2 min</div>
              <div className="text-gray-600">Average Time</div>
            </div>
            <div>
              <div className="text-5xl font-black text-green-600 mb-2">Free</div>
              <div className="text-gray-600">No Credit Card</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join 10,000+ USA job seekers who've created winning resumes with CV Buddy
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <span>Create Your Free Resume</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 95% ATS pass rate • 2-minute setup
          </p>
        </div>
      </section>
    </>
  )
}
