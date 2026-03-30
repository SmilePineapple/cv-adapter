import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Customize Your Resume for Each Job — Without Starting Over | My CV Buddy',
  description: 'AI customizes your resume for every job application in 60 seconds. No starting from scratch — it adapts your existing CV to match each role\'s keywords and requirements.',
  keywords: 'customize resume for each job, customise cv for each application, tailor resume for every job, personalize resume for job, job specific resume, resume customization tool',
  openGraph: {
    title: 'Customize Your Resume for Each Job — Without Starting From Scratch | My CV Buddy',
    description: 'AI adapts your existing resume for every job. 60 seconds, ATS-ready, no starting over.',
    type: 'website',
  },
}

export default function CustomizeResumePage() {
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
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">One CV. Adapted for every role.</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            Customize Your Resume<br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">for Each Job — Without Starting Over</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            You shouldn&apos;t need a different CV from scratch for every job. You need the same CV — intelligently customised for each application. That&apos;s exactly what My CV Buddy does.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Customise My Resume Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free customisation · No credit card · Works for UK CVs & US resumes</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">Why One Generic CV Doesn&apos;t Work</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">Recruiters can spot a generic CV. ATS systems definitely can. Each job description is different — your application should be too.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 pr-8 font-black text-lg">Scenario</th>
                  <th className="py-4 pr-8 font-black text-lg text-red-500">Generic CV</th>
                  <th className="py-4 font-black text-lg text-green-600">Customised CV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['ATS keyword match', 'Low — misses role-specific terms', 'High — mirrors the job description'],
                  ['Recruiter relevance', 'Reads as broad, unfocused', 'Reads as purpose-built for this role'],
                  ['Interview conversion', '~5% of applications', 'Significantly higher (user-reported)'],
                  ['Time to prepare', '45 mins of manual editing', '60 seconds with AI'],
                  ['Experience highlighted', 'Everything equally', 'Most relevant experience first'],
                ].map(([scenario, generic, custom]) => (
                  <tr key={scenario} className="hover:bg-gray-50">
                    <td className="py-4 pr-8 font-semibold text-gray-800">{scenario}</td>
                    <td className="py-4 pr-8 text-red-500">{generic}</td>
                    <td className="py-4 text-green-600">{custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">How Customisation Works</h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">The AI does the hard work. You review and apply.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                { title: 'Your master CV', body: 'Upload your CV once. It contains everything — every role, skill, achievement, and qualification you\'ve ever had.' },
                { title: 'The AI selects and prioritises', body: 'When you paste a job description, the AI picks the most relevant parts of your history for that specific role.' },
                { title: 'Bullet points rewritten', body: 'Your experience descriptions are rewritten to match the language, keywords, and focus of the job ad.' },
                { title: 'Instant download', body: 'DOCX, PDF, or TXT — professionally formatted and ready to send within 60 seconds.' },
              ].map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-1">{i + 1}</div>
                  <div>
                    <div className="font-black mb-1">{item.title}</div>
                    <div className="text-gray-400 text-sm leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">What stays the same</div>
              <ul className="space-y-3 mb-8">
                {['Your actual experience and employers', 'Your real qualifications and dates', 'Your genuine skills', 'Your authentic voice'].map(item => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-gray-300">{item}</span></li>
                ))}
              </ul>
              <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">What gets customised</div>
              <ul className="space-y-3">
                {['Bullet point wording and emphasis', 'Professional summary focus', 'Skills section ordering and keywords', 'Section ordering by relevance'].map(item => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /><span className="text-gray-300">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-500/15 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Every Application. Perfectly Fitted.<br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">In 60 Seconds.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Try your first customisation free — no credit card, no commitment. Just a better application.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Customise My Resume Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Join 10,000+ job seekers · 1 free generation included</p>
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
            <Link href="/resume-adapter" className="hover:text-white transition-colors">Resume Adapter</Link>
            <Link href="/rewrite-cv-for-job-application" className="hover:text-white transition-colors">Rewrite CV</Link>
            <Link href="/tailor-cv-to-job-description" className="hover:text-white transition-colors">CV Tailoring</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
