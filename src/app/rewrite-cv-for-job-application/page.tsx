import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rewrite Your CV for Each Job Application — AI Tool | My CV Buddy',
  description: 'Stop manually rewriting your CV for every application. AI rewrites it in 60 seconds — tailored to the job, ATS-optimised, ready to send. 1 free rewrite included.',
  keywords: 'rewrite cv for job application, rewrite my cv, cv rewriter, update cv for job, customise cv for application, cv for each job, job specific cv rewrite',
  openGraph: {
    title: 'Stop Rewriting Your CV by Hand — Let AI Do It in 60 Seconds | My CV Buddy',
    description: 'AI rewrites your CV for each job application automatically. ATS-optimised and tailored to the role.',
    type: 'website',
  },
}

export default function RewriteCVPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/15 via-purple-600/20 to-blue-600/20"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">Save hours per application</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            Stop Rewriting Your CV<br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">by Hand. Let AI Do It.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Every job needs a tailored CV. Doing it manually takes hours. My CV Buddy rewrites yours — adapted to the specific role — in under a minute. Your real experience, expertly repositioned.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Rewrite My CV Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free rewrite · No credit card · 60 seconds per application</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">The Manual Rewrite Problem</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">You know you should tailor your CV for each role. You just don&apos;t have the time — or energy — to do it every time.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⏰', title: '45 minutes per application', body: 'The average job seeker spends 45 minutes tailoring a CV for each role. Multiply that by 20 applications and you\'ve lost 15 hours.' },
              { icon: '😩', title: 'Decision fatigue', body: 'Which bullet points to change? What keywords to add? Which experience to emphasise? Every rewrite demands mental energy you could spend elsewhere.' },
              { icon: '❌', title: 'Still not quite right', body: 'Even after all that effort, a manually rewritten CV may miss ATS keywords, use the wrong phrasing, or undersell your most relevant experience.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 tracking-tight">The AI-Assisted Alternative</h2>
          <div className="space-y-6">
            {[
              { time: '0:10', label: 'Upload your CV once', detail: 'PDF or Word. Done once. The AI stores your full professional history.' },
              { time: '0:15', label: 'Paste the job description', detail: 'Copy-paste the full job ad. No editing, no summarising.' },
              { time: '0:45', label: 'AI rewrites your CV', detail: 'The AI analyses both, selects the most relevant experience, rewrites bullet points to match the role\'s language and keywords.' },
              { time: '0:05', label: 'Review and download', detail: 'Check the output, make any final tweaks, and download in DOCX, PDF, or TXT. Ready to apply.' },
            ].map((step) => (
              <div key={step.label} className="flex items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl px-3 py-2 text-sm font-black flex-shrink-0">{step.time}</div>
                <div>
                  <div className="font-black text-lg mb-1">{step.label}</div>
                  <div className="text-gray-400">{step.detail}</div>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <div className="text-3xl font-black text-green-400">Total: ~75 seconds</div>
              <div className="text-gray-500 text-sm mt-1">vs 45 minutes manually</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-8">What the AI actually rewrites</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Bullet points — rewritten in the employer\'s language',
              'Professional summary — repositioned for the specific role',
              'Skills section — matched to the job description keywords',
              'Job titles — clarified where relevant',
              'Achievements — quantified and contextualised',
              'Section ordering — most relevant experience first',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">Your real experience. Accurately repositioned. Nothing invented.</p>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Apply More. Rewrite Less.<br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Get More Interviews.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Your first CV rewrite is free. No credit card, no commitment — just a better application in 60 seconds.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Rewrite My CV Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation included · Works with UK CVs & US resumes</p>
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
            <Link href="/customize-resume-for-each-job" className="hover:text-white transition-colors">Customise Resume</Link>
            <Link href="/how-to-tailor-a-cv" className="hover:text-white transition-colors">How to Tailor</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
