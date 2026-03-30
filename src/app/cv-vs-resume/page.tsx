import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CV vs Resume: What\'s the Difference? | My CV Buddy',
  description: 'CV vs resume — what\'s the actual difference, when to use each, and how length and format differ between UK and US job applications. Plus: My CV Buddy works with both.',
  keywords: 'cv vs resume, difference between cv and resume, what is a cv, what is a resume, cv or resume uk, cv resume difference, when to use cv vs resume',
  openGraph: {
    title: 'CV vs Resume: What\'s the Difference and Which Do You Need? | My CV Buddy',
    description: 'Clear breakdown of CV vs resume differences, when to use each, and how AI can optimise both for any job.',
    type: 'website',
  },
}

export default function CVvsResumePage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">Works with both · UK CVs & US resumes</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            CV vs Resume:<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">What&apos;s the Difference?</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            The short answer: it depends on where you&apos;re applying. The long answer is below — plus why it matters less than you think if you&apos;re tailoring both correctly.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Adapt My CV or Resume Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Works for UK CVs & US resumes · 1 free generation</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 tracking-tight">The Core Differences</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 rounded-2xl p-8 border-t-4 border-blue-500">
              <div className="text-3xl mb-4">🇬🇧</div>
              <h3 className="text-2xl font-black mb-4">CV (Curriculum Vitae)</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Used primarily in the UK, Europe, and academia',
                  'Typically 2 pages (more for senior/academic roles)',
                  'Includes a personal statement at the top',
                  'Lists all roles in reverse chronological order',
                  'May include interests and references',
                  'Format: clean, professional, text-focused',
                ].map(item => <li key={item} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-8 border-t-4 border-red-500">
              <div className="text-3xl mb-4">🇺🇸</div>
              <h3 className="text-2xl font-black mb-4">Resume</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Used primarily in the US and Canada',
                  'Strictly 1 page (2 max for senior roles)',
                  'Concise summary or objective statement',
                  'Tailored to the specific job (highly selective)',
                  'No photos, no personal details beyond contact',
                  'Format: concise, achievement-focused, metric-heavy',
                ].map(item => <li key={item} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black mb-3">The real answer</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">In the UK, people use &quot;CV&quot; and &quot;resume&quot; interchangeably. In the US, &quot;resume&quot; is always the right term. If you&apos;re applying internationally, check what the job posting says — or default to &quot;CV&quot; for UK roles and &quot;resume&quot; for US roles.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">The Bigger Issue: Tailoring</h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">Whether it&apos;s called a CV or a resume, the format matters less than how well it&apos;s tailored to the specific job description.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'ATS systems don\'t care what you call it', body: 'Applicant Tracking Systems evaluate keyword match and format quality — not whether you titled the document "CV" or "resume". Both need to be optimised.' },
              { icon: '🎯', title: 'Both need to be role-specific', body: 'A generic UK CV performs just as poorly as a generic US resume. Both formats need to be customised to each job description to perform well.' },
              { icon: '⚡', title: 'AI handles both formats', body: 'My CV Buddy adapts both CVs and resumes. Upload either format, and the AI will tailor it for the specific role while preserving the appropriate format.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            CV or Resume — We Adapt Both.<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">In 60 Seconds.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Whatever format you need, My CV Buddy tailors it to the job description automatically. UK CV or US resume — just upload and go.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Try It Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation · UK CVs & US resumes · No credit card</p>
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
            <Link href="/tailor-cv-to-job-description" className="hover:text-white transition-colors">Tailor CV</Link>
            <Link href="/how-to-tailor-a-cv" className="hover:text-white transition-colors">How to Tailor</Link>
            <Link href="/ats-friendly-cv-checklist" className="hover:text-white transition-colors">ATS Checklist</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
