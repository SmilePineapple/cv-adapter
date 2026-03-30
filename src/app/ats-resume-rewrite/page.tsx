import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ATS Resume Rewrite — Get Past the Bots | My CV Buddy',
  description: 'AI rewrites your resume to pass ATS filters. Keyword-optimised, properly formatted, and matched to the specific job description. 95% ATS pass rate. 1 free rewrite.',
  keywords: 'ats resume rewrite, ats cv rewrite, rewrite cv for ats, ats optimise cv, ats friendly resume, beat ats system, ats keyword optimisation',
  openGraph: {
    title: 'ATS Resume Rewrite: Get Your CV Past the Robots | My CV Buddy',
    description: 'AI rewrites your resume to pass ATS filters with a 95% pass rate. Keyword-matched to any job description.',
    type: 'website',
  },
}

export default function ATSRewritePage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href="/#pricing" className="text-gray-400 hover:text-white font-medium transition-colors">Pricing</Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white font-medium transition-colors">Login</Link>
              <Link href="/auth/signup" className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all font-bold">Start Free</Link>
            </nav>
            <Link href="/auth/signup" className="md:hidden bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm">Start Free</Link>
          </div>
        </div>
      </header>

      <section className="relative pt-36 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">95% ATS pass rate · Internal formatting tests</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            ATS Resume Rewrite:<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">Get Past the Robots</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            75% of CVs are rejected by ATS before a human reads them. Our AI rewrites yours to pass — matched to the specific job description, formatted correctly, keywords in the right places.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Rewrite My CV for ATS</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free rewrite · No credit card · 60 seconds</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">What Causes ATS Rejections</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">Most rejections aren&apos;t because you&apos;re underqualified. They&apos;re because your CV doesn&apos;t speak the right language for that specific role.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Wrong keywords', body: 'ATS systems search for exact terms from the job description. If you wrote "staff management" but the job says "team leadership", you may not match.' },
              { title: 'Poor formatting', body: 'Tables, columns, headers, text boxes, and graphics confuse most ATS parsers. They need clean, linear text with standard section names.' },
              { title: 'Generic language', body: 'ATS scores your CV against the job description. A generic CV that could fit any role will score poorly against a specific one.' },
              { title: 'Missing requirements', body: 'If the job asks for specific qualifications or tools and your CV doesn\'t mention them (even if you have them), ATS marks you as non-matching.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-black mb-3 text-red-600">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">What Our ATS Rewrite Fixes</h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">My CV Buddy doesn&apos;t just check your CV — it rewrites it to pass.</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Extracts and integrates keywords from the job description',
              'Rewrites bullet points to match role requirements',
              'Uses standard section headers ATS systems recognise',
              'Formats content in clean, parseable linear structure',
              'Quantifies achievements where possible',
              'Prioritises the most relevant experience for that role',
              'Removes formatting elements that break ATS parsing',
              'Adapts your real CV — never invents experience',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black mb-8">ATS Pass Rate Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl font-black text-red-400 mb-2">~25%</div>
              <div className="text-gray-300 font-semibold">Generic CV</div>
              <div className="text-xs text-gray-600 mt-1">Sent to every role</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl font-black text-yellow-400 mb-2">~60%</div>
              <div className="text-gray-300 font-semibold">Manually edited CV</div>
              <div className="text-xs text-gray-600 mt-1">Human keyword matching</div>
            </div>
            <div className="bg-white/5 border border-green-500/20 rounded-2xl p-6">
              <div className="text-4xl font-black text-green-400 mb-2">~95%</div>
              <div className="text-gray-300 font-semibold">AI-rewritten CV</div>
              <div className="text-xs text-gray-600 mt-1">Internal ATS formatting tests</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Stop Getting Filtered Out.<br />
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Get Your CV Read.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Let AI rewrite your resume to pass the bots and impress the humans. 1 free rewrite, no credit card needed.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Rewrite My CV Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Works for UK CVs & US resumes · PDF & Word supported</p>
        </div>
      </section>

      <footer className="py-12 bg-black text-gray-400 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">CV</span>
              </div>
              <span className="text-xl font-black text-white">My CV Buddy</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/tailor-cv-to-job-description" className="hover:text-white transition-colors">CV Tailoring</Link>
            <Link href="/ats-friendly-cv-checklist" className="hover:text-white transition-colors">ATS Checklist</Link>
            <Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
