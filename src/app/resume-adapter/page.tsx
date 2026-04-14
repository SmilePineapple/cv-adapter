import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'AI Resume Adapter: Tailor Your Resume to Any Job in 60 Seconds | My CV Buddy',
  description: 'The #1 AI resume adapter for UK and US job seekers. Upload your resume, paste any job description — get a perfectly tailored, ATS-optimised resume in 60 seconds. No made-up content. Free to try.',
  keywords: ['resume adapter', 'ai resume adapter', 'resume adapter ai', 'resume adapter.com', 'resume tailoring tool', 'customize resume for job', 'job specific resume', 'resume optimizer', 'resume rewriter', 'tailor resume to job description', 'cv adapter uk', 'resume buddy'],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/resume-adapter',
    languages: {
      'en-US': 'https://www.mycvbuddy.com/resume-adapter',
      'en-GB': 'https://www.mycvbuddy.com/resume-adapter',
      'x-default': 'https://www.mycvbuddy.com/resume-adapter',
    },
  },
  openGraph: {
    title: 'AI Resume Adapter: Tailor Your Resume to Any Job in 60 Seconds',
    description: 'Upload your resume once, paste any job description — get a perfectly tailored, ATS-ready resume in 60 seconds. Free to try.',
    type: 'website',
    url: 'https://www.mycvbuddy.com/resume-adapter',
  },
}

const resumeAdapterSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'AI Resume Adapter',
  description: 'The #1 AI resume adapter for US and UK job seekers. Upload your resume, paste any job description — get a perfectly tailored, ATS-optimized resume in 60 seconds.',
  url: 'https://www.mycvbuddy.com/resume-adapter',
  inLanguage: ['en-US', 'en-GB'],
  about: {
    '@type': 'SoftwareApplication',
    name: 'My CV Buddy Resume Adapter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free resume adaptation — no credit card required',
      availability: 'https://schema.org/InStock',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mycvbuddy.com' },
      { '@type': 'ListItem', position: 2, name: 'Resume Adapter', item: 'https://www.mycvbuddy.com/resume-adapter' },
    ],
  },
  mainEntity: [
    { '@type': 'Question', name: 'What is a resume adapter?', acceptedAnswer: { '@type': 'Answer', text: 'A resume adapter takes your existing resume and tailors it to a specific job description — rewriting bullet points in the employer\'s language and matching ATS keywords — without making anything up.' } },
    { '@type': 'Question', name: 'How do I tailor my resume to a job description?', acceptedAnswer: { '@type': 'Answer', text: 'Upload your resume to My CV Buddy, paste the job description, and our AI adapts your resume in 60 seconds — highlighting relevant experience and matching the employer\'s keywords.' } },
    { '@type': 'Question', name: 'Does this work for US resumes?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. My CV Buddy works with US resumes and UK CVs. The AI understands American resume format and adjusts language, length, and style accordingly.' } },
    { '@type': 'Question', name: 'Is the resume adapter free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — 1 free resume adaptation is included with no credit card required. Upgrade to Pro for unlimited adaptations from $3.99/month.' } },
  ],
}

export default function ResumeAdapterPage() {
  return (
    <>
    <Script id="resume-adapter-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeAdapterSchema) }} />
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-sm text-gray-300">Not a CV builder — a CV adapter</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            AI Resume Adapter:<br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">One Resume for Every Job</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Upload your resume once. Paste any job description. Get a perfectly adapted, ATS-ready version in under a minute — every time you apply.
          </p>
          <Link href="/auth/signup" className="group bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            <span>Try Resume Adapter Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free adaptation · No credit card · Works for UK CVs & US resumes</p>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">A Resume Adapter Is Not a Resume Builder</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">You already have a resume. The problem is it&apos;s generic. An adapter takes what you already have and reshapes it — specifically for each role you apply to.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-red-300">
              <h3 className="text-xl font-black mb-4">Resume Builder (What most tools do)</h3>
              <ul className="space-y-3 text-gray-600">
                {['Helps you create a CV from scratch', 'Gives you a generic template to fill in', 'Same CV sent to every job', 'High ATS rejection risk on specialist roles', 'Time-consuming to maintain'].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-green-500">
              <h3 className="text-xl font-black mb-4">Resume Adapter (What My CV Buddy does)</h3>
              <ul className="space-y-3 text-gray-600">
                {['Adapts your existing resume for each role', 'Matches keywords from the specific job ad', 'Highlights the experience that matters most', 'Achieves 95%+ ATS match rate (internal tests)', 'Ready in 60 seconds'].map(i => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 tracking-tight">How the Resume Adapter Works</h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            {[
              { n: '01', color: 'text-blue-400', title: 'AI reads your existing resume', body: 'Upload PDF or Word. The AI extracts every section, bullet point, and skill — understanding what you\'ve actually done.' },
              { n: '02', color: 'text-purple-400', title: 'AI analyses the job description', body: 'It identifies required skills, preferred keywords, role-specific language, and what this employer values most.' },
              { n: '03', color: 'text-pink-400', title: 'AI adapts — not invents', body: 'Your real experience gets reframed to match the role. Bullet points are rewritten in the employer\'s language. Nothing is made up.' },
              { n: '04', color: 'text-green-400', title: 'Download and apply', body: 'Get your tailored resume in DOCX, PDF, or TXT — ATS-optimised, formatted, and ready to send.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <div className={`text-5xl font-black ${step.color} flex-shrink-0 w-16`}>{step.n}</div>
                <div>
                  <h3 className="text-xl font-black mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '60s', label: 'Per adaptation', sub: 'Average generation time' },
              { stat: '95%', label: 'ATS pass rate', sub: 'Internal formatting tests' },
              { stat: '10K+', label: 'Resumes adapted', sub: 'Since launch' },
              { stat: '4.9', label: 'Rating', sub: 'Early user reviews' },
            ].map((s) => (
              <div key={s.stat}>
                <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{s.stat}</div>
                <div className="text-gray-300 font-semibold">{s.label}</div>
                <div className="text-xs text-gray-600 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            Your Resume. Every Job.<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Perfectly Adapted.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Stop sending the same resume everywhere. Start adapting it for every role in 60 seconds.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
            <span>Get Your Free Adaptation</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">1 free generation included · No credit card required</p>
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
            <Link href="/ats-resume-rewrite" className="hover:text-white transition-colors">ATS Rewrite</Link>
            <Link href="/cv-vs-resume" className="hover:text-white transition-colors">CV vs Resume</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} My CV Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  )
}
