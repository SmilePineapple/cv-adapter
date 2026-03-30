import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, Upload, FileText, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Tailor Your CV to a Job Description | My CV Buddy',
  description: 'Upload your CV, paste any job description, and AI automatically tailors your application in 60 seconds. ATS-optimised, keyword-matched, ready to send. 1 free generation.',
  keywords: 'tailor cv to job description, tailor your cv, cv tailoring, customise cv for job, job specific cv, cv for job application, cv adaptation',
  openGraph: {
    title: 'Tailor Your CV to Any Job Description — Automatically | My CV Buddy',
    description: 'AI tailors your existing CV to match any job description in 60 seconds. ATS-optimised and ready to apply.',
    type: 'website',
  },
}

export default function TailorCVPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">AI CV Adapter · 1 Free Generation</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            Tailor Your CV to Any<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Job Description — Automatically</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Paste a job ad, upload your CV, and get a tailored, ATS-optimised version in 60 seconds. Built to adapt your real CV — not invent fake experience.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Tailor My CV Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation · No credit card · Works in 60 seconds</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">Why CV Tailoring Matters</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">Over 75% of CVs are rejected by ATS software before a human ever reads them — usually because the CV doesn't match the job description closely enough.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'ATS filters are real', body: 'Most large employers use Applicant Tracking Systems that score your CV against the job description. A generic CV scores low. A tailored one passes through.' },
              { icon: '🔑', title: 'Keywords are everything', body: 'Recruiters search by keywords from the job ad. If your CV doesn\'t reflect those terms, it won\'t surface — even if you\'re the perfect candidate.' },
              { icon: '⏱️', title: 'You apply to many jobs', body: 'Manually rewriting your CV for every application is exhausting. AI tailoring takes 60 seconds and improves your chances significantly for each one.' },
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
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 tracking-tight">Three Steps to a Tailored CV</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: Upload, color: 'text-blue-400', title: 'Upload Your Existing CV', body: 'PDF or Word — our AI extracts every section automatically. No reformatting, no copy-pasting.' },
              { step: '2', icon: FileText, color: 'text-purple-400', title: 'Paste the Job Description', body: 'Drop in the full job ad. The AI identifies keywords, required skills, and role-specific language.' },
              { step: '3', icon: Download, color: 'text-green-400', title: 'Download Your Tailored CV', body: 'Get a version of your real CV — adapted, keyword-optimised, ATS-ready. In DOCX, PDF, or TXT.' },
            ].map((item) => (
              <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className={`text-5xl font-black ${item.color} mb-4`}>{item.step}</div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-black text-center mb-12 tracking-tight">Before & After: CV Tailoring in Action</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-2xl p-8 border border-white/10">
              <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-4">Before — Generic CV Bullet</div>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">"Responsible for managing customer accounts and handling queries."</p>
              <div className="mt-4 text-xs text-gray-600">❌ No quantification · No keywords · Vague language</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-green-500/20">
              <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-4">After — Tailored by AI</div>
              <p className="text-green-300 font-mono text-sm leading-relaxed">"Managed a portfolio of 80+ enterprise accounts, resolving 95% of queries within SLA using Salesforce CRM — directly matching the client success requirements of this role."</p>
              <div className="mt-4 text-xs text-green-600">✓ Quantified · ✓ Keyword-matched · ✓ ATS-optimised</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Start Tailoring Your CV.<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">1 Free Generation Included.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">No credit card. No setup. Just upload your CV and a job description and see what AI can do.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Tailor My CV Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Join 10,000+ job seekers · Works with UK CVs & US resumes</p>
        </div>
      </section>

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
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/resume-adapter" className="hover:text-white transition-colors">Resume Adapter</Link>
            <Link href="/ats-friendly-cv-checklist" className="hover:text-white transition-colors">ATS Checklist</Link>
            <Link href="/cv-vs-resume" className="hover:text-white transition-colors">CV vs Resume</Link>
            <Link href="/how-to-tailor-a-cv" className="hover:text-white transition-colors">Tailoring Guide</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
