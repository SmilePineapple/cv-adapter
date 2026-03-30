import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Tailor a CV to a Job Description | Step-by-Step Guide | My CV Buddy',
  description: 'Learn exactly how to tailor a CV to a job description — manually or with AI. Step-by-step guide covering keywords, bullet points, summary, and ATS formatting. With free AI tool.',
  keywords: 'how to tailor a cv, tailor cv to job description, cv tailoring guide, how to customise cv for job, cv writing tips, ats cv tips, tailor resume for job description',
  openGraph: {
    title: 'How to Tailor a CV to a Job Description — Step-by-Step Guide | My CV Buddy',
    description: 'Complete guide to tailoring your CV for every application — manually or with AI in 60 seconds.',
    type: 'article',
  },
}

export default function HowToTailorCVPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">Step-by-step guide · Manual & AI methods</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            How to Tailor a CV<br />
            <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">to a Job Description</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            A tailored CV gets 3× more interviews than a generic one. Here&apos;s exactly how to do it — the manual way and the AI-assisted way — with practical examples throughout.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Try AI Tailoring Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Skip the manual steps · 1 free generation · No credit card</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Why Tailoring Works</h2>
          <p className="text-xl text-gray-600 mb-12">A generic CV tries to appeal to everyone. A tailored CV speaks directly to one employer about one role. That specificity is what gets you interviews.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: '75%', label: 'of CVs rejected by ATS', note: 'Before a human reads them' },
              { stat: '6 secs', label: 'Average recruiter scan time', note: 'For an initial CV review' },
              { stat: '3×', label: 'More interviews', note: 'With a tailored CV vs generic' },
            ].map(s => (
              <div key={s.stat} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">{s.stat}</div>
                <div className="font-semibold">{s.label}</div>
                <div className="text-xs text-gray-500 mt-1">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">The Manual Method: 6 Steps</h2>
          <p className="text-xl text-gray-400 mb-12">If you prefer to tailor by hand, here&apos;s the process. (Or skip to the AI method below — it does all of this in 60 seconds.)</p>
          <div className="space-y-8">
            {[
              { n: '1', title: 'Read the job description three times', body: 'First for overall understanding. Second to identify required vs nice-to-have skills. Third to extract exact keywords and phrases the employer uses.' },
              { n: '2', title: 'Highlight keywords and requirements', body: 'Circle every skill, qualification, tool, and competency mentioned. These are the terms your CV must contain — in similar language to the job ad.' },
              { n: '3', title: 'Rewrite your professional summary', body: 'Your summary should answer the question: "Why am I the right person for this specific role?" Reference the job title, key skills, and your most relevant experience.' },
              { n: '4', title: 'Reorder and rewrite your bullet points', body: 'For each role, lead with the most relevant achievements. Rewrite bullet points to use the employer\'s language. Quantify wherever possible.' },
              { n: '5', title: 'Update your skills section', body: 'Match the keywords from the job description. Add tools and technologies mentioned if you have them. Remove skills that aren\'t relevant to this role.' },
              { n: '6', title: 'Check your formatting for ATS', body: 'Use standard section headers (Experience, Education, Skills). Avoid tables, columns, and graphics. Keep fonts simple. Test in a plain text editor.' },
            ].map(step => (
              <div key={step.n} className="flex gap-6">
                <div className="text-5xl font-black text-blue-400/40 flex-shrink-0 w-12 text-right">{step.n}</div>
                <div className="pt-2">
                  <h3 className="text-xl font-black mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-gray-400">⏱️ Manual tailoring time: <strong className="text-white">30–60 minutes per application</strong></p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">The AI Method: 3 Steps</h2>
          <p className="text-xl text-gray-400 mb-12">My CV Buddy does all 6 manual steps automatically — in about 60 seconds.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', color: 'text-blue-400', title: 'Upload your CV', body: 'PDF or Word. The AI reads and stores your full professional history.' },
              { n: '02', color: 'text-purple-400', title: 'Paste the job description', body: 'Drop in the full job ad. The AI extracts keywords, requirements, and role context.' },
              { n: '03', color: 'text-green-400', title: 'Download your tailored CV', body: 'Get an ATS-optimised, keyword-matched version of your real CV — ready to apply.' },
            ].map(step => (
              <div key={step.n} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className={`text-5xl font-black ${step.color} mb-4`}>{step.n}</div>
                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-green-950/30 border border-green-500/20 rounded-2xl p-6 text-center">
            <p className="text-green-300">⚡ AI tailoring time: <strong>~60 seconds per application</strong></p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Start Tailoring Smarter.<br />
            <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">Try It Free.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Let AI handle the manual steps. Your first tailored CV is free — no credit card needed.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Tailor My CV Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation · Works with UK CVs & US resumes · 60 seconds</p>
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
            <Link href="/ats-friendly-cv-checklist" className="hover:text-white transition-colors">ATS Checklist</Link>
            <Link href="/cv-vs-resume" className="hover:text-white transition-colors">CV vs Resume</Link>
            <Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
