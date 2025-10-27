import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'USA Resume Builder - AI-Powered Resume Generator for American Job Market | CV Adapter',
  description: 'Create ATS-optimized resumes tailored for US employers. AI-powered resume builder with American English, US formatting, and templates trusted by American professionals. Try 2 free generations!',
  keywords: 'USA resume builder, resume generator USA, American resume template, ATS resume USA, professional resume USA, resume writing service USA, AI resume builder USA',
  openGraph: {
    title: 'USA Resume Builder - Professional Resumes for the American Job Market',
    description: 'AI-powered resume builder optimized for US employers. ATS-friendly, American English, US formatting. Only $7 for lifetime access.',
    type: 'website',
  }
}

export default function USAResumeBuilder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CV Adapter
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Log In
              </Link>
              <Link 
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              🇺🇸 Optimized for US Job Market
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Resume Builder<br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              for American Job Seekers
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create ATS-optimized resumes tailored for US employers. AI-powered tool with American formatting, 
            US English, and templates trusted by thousands of American professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:shadow-xl transition-all"
            >
              Start Free (2 Generations) →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-200 hover:border-purple-600 transition-all"
            >
              See How It Works
            </Link>
          </div>

          <p className="text-gray-500 text-sm">
            ✓ No credit card required  ✓ 2 free resume generations  ✓ Only $7 for lifetime access
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Fortune 500 Use ATS</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1 Page</div>
              <div className="text-gray-600">Standard US Resume Length</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$7</div>
              <div className="text-gray-600">Lifetime Access</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Resume Generations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why US Specific Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose a US-Specific Resume Builder?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🇺🇸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">American English</h3>
            <p className="text-gray-600">
              Proper US spelling (organized, not organised), terminology (cell phone, not mobile), 
              and professional language expected by American employers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">US Resume Format</h3>
            <p className="text-gray-600">
              1-page standard length, proper sections (Summary, Experience, Education, Skills), 
              and US-specific formatting (no photo, no personal details like age/marital status).
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS Optimized</h3>
            <p className="text-gray-600">
              Formatted for US ATS systems (Taleo, Workday, iCIMS). Passes automated screening 
              used by 98% of Fortune 500 companies.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your existing resume in .docx or .pdf format. Our AI analyzes your content and structure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Optimization</h3>
              <p className="text-gray-600">
                Our AI rewrites your resume for US employers, adds keywords, fixes formatting, and ensures ATS compatibility.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Download & Apply</h3>
              <p className="text-gray-600">
                Download your optimized resume in multiple formats (.docx, .pdf, .txt) and start applying with confidence!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* US Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Built for the American Job Market
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">US Education Format</h3>
              <p className="text-gray-600">Properly formats GPA, Bachelor's/Master's degrees, and US university names</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">American Professional Certifications</h3>
              <p className="text-gray-600">Recognizes CPA, PMP, CFA, and other US professional certifications</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">US Employment Law Compliant</h3>
              <p className="text-gray-600">Follows US resume best practices (no photo, no age, no marital status)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">All 50 States</h3>
              <p className="text-gray-600">Suitable for jobs across all US states and territories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl mb-12 opacity-90">
            No subscriptions. No hidden fees. Just $7 for lifetime access.
          </p>

          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-5xl font-bold text-purple-600 mb-2">$7</div>
            <div className="text-gray-600 mb-6">One-time payment</div>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>100 resume generations (lifetime)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>All US templates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>ATS optimization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Multiple export formats</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Cover letter generator</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>No expiry, no renewals</span>
              </li>
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
            >
              Start Free Trial (2 Generations)
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Try 2 free generations before upgrading
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Trusted by American Professionals
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-4">
              "Finally, a resume builder that gets American formatting right! Got past the ATS and landed interviews at 3 Fortune 500 companies."
            </p>
            <div className="font-semibold text-gray-900">Michael S.</div>
            <div className="text-gray-500 text-sm">Product Manager, San Francisco</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-4">
              "The 1-page format and American English made all the difference. Best $7 I've ever spent on my career!"
            </p>
            <div className="font-semibold text-gray-900">Jennifer L.</div>
            <div className="text-gray-500 text-sm">Software Engineer, Austin</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-4">
              "As a recent grad, I needed help making my resume stand out. This tool made it professional and ATS-friendly instantly."
            </p>
            <div className="font-semibold text-gray-900">David K.</div>
            <div className="text-gray-500 text-sm">Recent Graduate, New York</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Is this specifically for US job applications?</h3>
              <p className="text-gray-600">
                Yes! Our tool uses American English, US resume formatting standards, and is optimized for ATS systems 
                commonly used by US employers (Taleo, Workday, iCIMS).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What's the difference between a US resume and a UK CV?</h3>
              <p className="text-gray-600">
                US resumes are typically 1 page, exclude personal details like age/photo, use American English spelling, 
                and follow different formatting conventions. Our tool ensures your resume meets US standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Do I get 2 free generations?</h3>
              <p className="text-gray-600">
                Yes! Every new user gets 2 free resume generations to try the service. No credit card required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What happens after I use my 2 free generations?</h3>
              <p className="text-gray-600">
                You can upgrade to Pro for a one-time payment of $7, which gives you 100 lifetime generations. 
                No subscription, no recurring fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Will my resume pass ATS systems?</h3>
              <p className="text-gray-600">
                Yes! Our AI optimizes your resume for ATS compatibility, using clean formatting, proper keywords, 
                and standard section headings that ATS systems can parse correctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Land Your Dream Job in the USA?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of American professionals who've upgraded their resumes with CV Adapter. 
          Start with 2 free generations today!
        </p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:shadow-xl transition-all"
        >
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                CV Adapter
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered resume builder for American professionals
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/auth/signup">Sign Up</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/subscription">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/blog/ats-cv-tips-uk-2025">ATS Tips</Link></li>
                <li><Link href="/blog">Resume Writing Guide</Link></li>
                <li><Link href="/uk-cv-builder">UK CV Builder</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>© 2025 CV Adapter. All rights reserved. Made for America 🇺🇸</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
