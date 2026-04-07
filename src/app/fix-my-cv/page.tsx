import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, Zap, Target, FileText, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fix My CV Free — AI CV Fixer for UK Job Seekers | My CV Buddy',
  description: 'Fix your CV in 2 minutes with AI. Upload your CV, paste a job description — get a fixed, ATS-optimised CV tailored to the role. Free to try, no sign-up required.',
  keywords: ['fix my cv', 'fix my cv free', 'cv fixer', 'fix my resume', 'improve my cv', 'cv checker free', 'cv reviewer uk', 'fix cv for job application', 'cv optimizer free uk', 'cv fixer ai'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/fix-my-cv',
  },
  openGraph: {
    title: 'Fix My CV Free — AI CV Fixer in 2 Minutes',
    description: 'Upload your CV and get it fixed by AI. ATS-optimised, tailored to the job. Free to try.',
    type: 'website',
    url: 'https://www.mycvbuddy.com/fix-my-cv',
  },
}

export default function FixMyCVPage() {
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

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-green-300 font-medium">✓ Free to try — no sign-up required</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            Fix My CV<br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">in 2 Minutes, Free</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Upload your existing CV, paste a job description — our AI fixes and tailors your CV to beat ATS systems and land you interviews. Trusted by 10,000+ UK job seekers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/upload"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl"
            >
              Fix My CV Now
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white/20 transition-all"
            >
              Create Free Account
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />95% ATS pass rate</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />10,000+ CVs fixed</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />2-minute turnaround</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />No fake content added</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-white/5">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-16">How We Fix Your CV</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl font-black mb-2 text-blue-400">1. Upload</div>
              <p className="text-gray-400 leading-relaxed">Upload your current CV (PDF, DOCX, or paste text). Our AI reads every section.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-2xl font-black mb-2 text-purple-400">2. Paste Job</div>
              <p className="text-gray-400 leading-relaxed">Paste the job description. Our AI identifies the key requirements and ATS keywords.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-2xl font-black mb-2 text-green-400">3. Get Fixed CV</div>
              <p className="text-gray-400 leading-relaxed">Download your fixed, tailored CV — ATS-optimised and perfectly matched to the role.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What gets fixed */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-4">What Gets Fixed</h2>
          <p className="text-xl text-gray-400 text-center mb-16">Common CV problems our AI detects and fixes automatically</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { issue: 'Wrong keywords for the job', fix: 'AI matches your CV to exact keywords in the job description' },
              { issue: 'Failing ATS scans', fix: 'Reformats to ATS-friendly structure — no tables, columns or graphics' },
              { issue: 'Generic personal statement', fix: 'Rewrites your profile to match the specific role requirements' },
              { issue: 'Weak bullet points', fix: 'Strengthens achievements with measurable impact and relevant skills' },
              { issue: 'Missing industry keywords', fix: 'Adds sector-specific terminology recruiters search for' },
              { issue: 'Too long or too short', fix: 'Optimises length to industry standard (1-2 pages)' },
            ].map(({ issue, fix }) => (
              <div key={issue} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-semibold mb-1">{issue}</p>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-400 text-sm">{fix}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 px-4 bg-white/5">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-16">What Job Seekers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'Fixed my CV in 3 minutes. Got a call back the same week after months of silence.', name: 'Sarah M.', role: 'Marketing Manager, London' },
              { quote: 'My old CV was failing ATS. After using My CV Buddy I started getting interviews immediately.', name: 'James T.', role: 'Software Engineer, Manchester' },
              { quote: "Best free tool I've used. Completely rewrote my personal statement and it actually sounds like me.", name: 'Priya K.', role: 'Graduate, Birmingham' },
            ].map(({ quote, name, role }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-white">{name}</p>
                  <p className="text-gray-500 text-sm">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-black text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can you fix my CV for free?', a: 'Yes — My CV Buddy includes 1 free CV fix with no credit card required. Upload your CV, paste a job description, and get a fixed CV instantly.' },
              { q: 'How long does it take to fix my CV?', a: 'Under 2 minutes. Our AI reads your CV and the job description, then generates a tailored, ATS-optimised version immediately.' },
              { q: 'Will my CV still sound like me?', a: 'Absolutely. We only use your real experience and skills — we never invent achievements or fabricate content. We just present what you have in the best possible way.' },
              { q: 'Does it work for UK CVs?', a: 'Yes — My CV Buddy is built specifically for UK job seekers. We use UK spelling, UK CV format conventions, and we understand how UK ATS systems work.' },
              { q: 'What formats can I upload?', a: 'PDF, DOCX, and plain text. We support all common CV formats.' },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white/5 border border-white/10 rounded-2xl p-6">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-white pr-4">{q}</h3>
                  <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-green-900/30 to-blue-900/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">Fix Your CV Now — It&apos;s Free</h2>
          <p className="text-xl text-gray-400 mb-10">Join 10,000+ UK job seekers who fixed their CV with My CV Buddy.</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl"
          >
            Fix My CV Free
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-6 text-sm">No credit card required · 1 free fix included · Takes 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-gray-500 text-sm">© 2026 My CV Buddy. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/cv-writing-guide" className="hover:text-white transition-colors">CV Writing Guide</Link>
            <Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link>
            <Link href="/blog/cv-examples-by-industry-uk" className="hover:text-white transition-colors">CV Examples</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
