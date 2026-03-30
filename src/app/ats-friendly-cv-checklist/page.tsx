import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ATS-Friendly CV Checklist: 12 Things to Check Before Applying | My CV Buddy',
  description: '12-point ATS-friendly CV checklist to verify before you submit any job application. Covers formatting, keywords, headers, and common mistakes that cause ATS rejections.',
  keywords: 'ats friendly cv checklist, ats cv checklist, ats resume checklist, ats optimised cv, cv ats check, how to make cv ats friendly, ats cv tips, beat ats checklist',
  openGraph: {
    title: 'ATS-Friendly CV Checklist: 12 Things to Check Before Applying | My CV Buddy',
    description: '12 quick checks that dramatically reduce ATS rejections. Plus a free AI tool that handles all of them automatically.',
    type: 'article',
  },
}

export default function ATSChecklistPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/15 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-500/15 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">12-point checklist · Check before every application</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            ATS-Friendly CV Checklist:<br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">12 Checks Before You Apply</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Over 75% of CVs are rejected by ATS systems before a human reads them. Most failures come down to 12 avoidable mistakes. Check these before you submit anything.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Auto-Fix My CV with AI</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">AI handles all 12 checks automatically · 1 free generation</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">The 12-Point ATS Checklist</h2>
          <p className="text-xl text-gray-600 mb-12">Run through these before submitting any application. Each one can be the difference between being filtered out or getting shortlisted.</p>
          <div className="space-y-4">
            {[
              { n: '01', cat: 'Keywords', title: 'Job description keywords are in your CV', detail: 'Identify 10–15 key terms from the job ad. Check they appear — verbatim — in your CV. ATS matches exact phrases, not just intent.' },
              { n: '02', cat: 'Keywords', title: 'Your job titles use standard terminology', detail: 'If you were a "Customer Success Ninja" but the role is "Account Manager", consider including the standard term. ATS looks for job title matches.' },
              { n: '03', cat: 'Formatting', title: 'No tables, columns, or text boxes', detail: 'These break most ATS parsers. The system reads left to right, top to bottom. Multi-column layouts scramble the order of your information.' },
              { n: '04', cat: 'Formatting', title: 'Standard section headers used', detail: 'Use "Experience", "Education", "Skills" — not creative variations like "My Journey" or "Where I\'ve Been". ATS looks for standard headers.' },
              { n: '05', cat: 'Formatting', title: 'No graphics, icons, or photos', detail: 'Images and icons are invisible to ATS. If your contact details or skills are in icons, the system won\'t read them.' },
              { n: '06', cat: 'Formatting', title: 'Font is simple and standard', detail: 'Calibri, Arial, Helvetica, Times New Roman. Decorative fonts can cause parsing errors in some systems.' },
              { n: '07', cat: 'Content', title: 'Professional summary mentions the role title', detail: 'A targeted summary that references the job title signals immediate relevance to both ATS and human reviewers.' },
              { n: '08', cat: 'Content', title: 'Bullet points are achievement-focused', detail: 'Lead with a strong verb and include a quantified outcome: "Increased X by Y% by doing Z". Duties-focused bullets score lower.' },
              { n: '09', cat: 'Content', title: 'Skills section matches job description language', detail: 'If the job says "Stakeholder management" and you wrote "Managing stakeholders" — add the exact phrase. ATS often matches on exact strings.' },
              { n: '10', cat: 'Content', title: 'All required qualifications are explicitly stated', detail: 'If a degree or certification is listed as required, make sure it appears clearly — don\'t assume it\'s implied by your experience.' },
              { n: '11', cat: 'File', title: 'File is saved as .docx or .pdf (no .pages, .odt)', detail: 'Not all ATS systems handle Apple Pages or OpenOffice files. DOCX is the safest. Some prefer plain text — check the job ad.' },
              { n: '12', cat: 'File', title: 'File name includes your name and the role', detail: '"Sarah_Mitchell_Product_Manager_CV.docx" is infinitely better than "CV_v2_FINAL.docx" — especially if the recruiter downloads it.' },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-7 h-7 text-green-500 mt-0.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-black text-lg leading-tight">{item.title}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded-full flex-shrink-0">{item.cat}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-black text-center mb-4 tracking-tight">Common ATS Mistakes</h2>
          <p className="text-xl text-gray-400 text-center mb-12">These are the most frequent causes of ATS rejection we see — and how to fix each one.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { mistake: 'Sending the same CV to every job', fix: 'Tailor the keywords and summary for every application. It takes 60 seconds with AI.' },
              { mistake: 'Using a creative CV template with columns', fix: 'Switch to a single-column layout. Pretty templates often fail ATS completely.' },
              { mistake: 'Listing responsibilities instead of achievements', fix: 'Rewrite each bullet as: "Did X, resulting in Y, by doing Z."' },
              { mistake: 'Missing the exact tools or skills mentioned', fix: 'If you have Salesforce experience but the job says "CRM software" — add both terms.' },
            ].map((item) => (
              <div key={item.mistake} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="font-black text-red-300">{item.mistake}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-500/15 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Skip the Checklist.<br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Let AI Handle It.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">My CV Buddy automatically handles all 12 checklist items — in 60 seconds. Upload your CV, paste the job description, and get an ATS-ready application.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Fix My CV with AI — Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation · No credit card · Handles all 12 checks automatically</p>
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
            <Link href="/ats-resume-rewrite" className="hover:text-white transition-colors">ATS Rewrite</Link>
            <Link href="/how-to-tailor-a-cv" className="hover:text-white transition-colors">How to Tailor</Link>
            <Link href="/tailor-cv-to-job-description" className="hover:text-white transition-colors">CV Tailoring</Link>
            <Link href="/ats-optimization-guide" className="hover:text-white transition-colors">ATS Guide</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
