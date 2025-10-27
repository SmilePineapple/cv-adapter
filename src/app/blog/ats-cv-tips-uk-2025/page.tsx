import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Beat ATS Systems in the UK (2025 Guide) | CV Adapter',
  description: 'Learn how to optimize your CV for Applicant Tracking Systems (ATS) used by 92% of UK recruiters. Expert tips for 2025 job market.',
  keywords: 'ATS CV UK, applicant tracking system, CV optimization UK, ATS-friendly CV, UK job applications 2025',
  openGraph: {
    title: 'How to Beat ATS Systems in the UK (2025 Guide)',
    description: 'Expert guide to creating ATS-friendly CVs that get past automated screening in the UK job market.',
    type: 'article',
  }
}

export default function ATSCVTipsUK2025() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CV Adapter
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Try Free
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          How to Beat ATS Systems in the UK (2025 Guide)
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <time dateTime="2025-10-27">October 27, 2025</time>
          <span>•</span>
          <span>8 min read</span>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl mb-8 flex items-center justify-center">
          <p className="text-gray-500 text-lg">🤖 ATS Optimization Guide</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Did you know that <strong>92% of UK recruiters use Applicant Tracking Systems (ATS)</strong> to screen CVs? 
            If your CV isn't optimized for these systems, it might never reach human eyes—no matter how qualified you are.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What is an ATS?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            An Applicant Tracking System (ATS) is software that automatically scans, parses, and ranks CVs before a recruiter sees them. 
            In the UK, companies like Taleo, Workday, and Greenhouse are commonly used to manage hundreds or thousands of applications.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">💡 Quick Stat</p>
            <p className="text-blue-800">
              75% of CVs are rejected by ATS before a human ever sees them. Don't let yours be one of them!
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">10 ATS Optimization Tips for UK Job Seekers</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">1. Use Standard Section Headings</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            ATS systems look for specific section names. Use these UK-standard headings:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Personal Details</strong> or <strong>Contact Information</strong></li>
            <li><strong>Professional Summary</strong> or <strong>Personal Statement</strong></li>
            <li><strong>Work Experience</strong> or <strong>Employment History</strong></li>
            <li><strong>Education</strong> or <strong>Qualifications</strong></li>
            <li><strong>Skills</strong></li>
            <li><strong>Certifications</strong> (if applicable)</li>
          </ul>
          <p className="text-gray-600 italic mb-6">
            ❌ Avoid creative headings like "My Journey" or "What I Bring to the Table"
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">2. Include Keywords from the Job Description</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            ATS systems scan for specific keywords. Read the job posting carefully and include relevant terms naturally throughout your CV.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-900 font-semibold mb-2">✅ Example:</p>
            <p className="text-green-800">
              If the job requires "project management" and "stakeholder engagement," make sure these exact phrases appear in your CV.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">3. Use a Simple, Clean Format</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            ATS systems struggle with complex formatting. Follow these rules:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
            <li>Avoid tables, text boxes, and columns</li>
            <li>Don't use headers/footers for important information</li>
            <li>Save as .docx or .pdf (check job posting for preference)</li>
            <li>Avoid images, graphics, and logos</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">4. Spell Out Acronyms</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Always spell out acronyms the first time, then use the abbreviation. For example: 
            "Bachelor of Science (BSc)" or "Chartered Institute of Personnel and Development (CIPD)".
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">5. Include UK-Specific Qualifications</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have UK qualifications, make them prominent:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>A-Levels, GCSEs</li>
            <li>NVQs, BTECs</li>
            <li>Degree classifications (First Class, 2:1, 2:2)</li>
            <li>Professional certifications (ACCA, CIMA, CIPD, etc.)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">6. Use Action Verbs</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Start bullet points with strong action verbs that ATS systems recognize:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Managed</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Developed</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Implemented</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Achieved</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Delivered</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Coordinated</span>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">7. Quantify Your Achievements</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            ATS systems love numbers. Include metrics wherever possible: "Increased sales by 35%" or "Managed team of 12 staff members".
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">8. Include a Skills Section</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Create a dedicated "Skills" section with both hard and soft skills:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Technical Skills:</strong> Microsoft Excel, Salesforce, Python, Adobe Creative Suite</li>
            <li><strong>Soft Skills:</strong> Leadership, Communication, Problem-solving, Time management</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">9. Avoid Unusual Characters</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Stick to standard punctuation. Avoid symbols like ★, ●, or → as they can confuse ATS parsers.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">10. Test Your CV</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Before applying, test your CV with an ATS checker or upload it to a job board to see how it parses. 
            Better yet, use an AI-powered tool like <strong>CV Adapter</strong> to automatically optimize your CV for ATS systems.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Common ATS Mistakes to Avoid</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h4 className="text-red-900 font-semibold mb-3">❌ Don't Do This:</h4>
            <ul className="list-disc pl-6 text-red-800 space-y-2">
              <li>Using creative CV templates with graphics and colors</li>
              <li>Putting important information in headers/footers</li>
              <li>Using tables or text boxes for layout</li>
              <li>Submitting as a .pages or .odt file</li>
              <li>Using unusual fonts or font sizes below 10pt</li>
              <li>Including photos (unless specifically requested)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">UK vs. USA: CV Differences for ATS</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you're applying to UK companies, remember these differences:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Length:</strong> UK CVs are typically 2 pages (USA resumes are 1 page)</li>
            <li><strong>Personal Details:</strong> UK CVs may include date of birth, nationality (USA resumes don't)</li>
            <li><strong>Terminology:</strong> Use "CV" not "resume," "mobile" not "cell phone"</li>
            <li><strong>Spelling:</strong> Use British English (organised, not organized)</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">How CV Adapter Helps</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            CV Adapter uses AI to automatically optimize your CV for ATS systems. Our tool:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>✅ Formats your CV with ATS-friendly structure</li>
            <li>✅ Suggests relevant keywords from job descriptions</li>
            <li>✅ Removes problematic formatting</li>
            <li>✅ Optimizes for UK job market standards</li>
            <li>✅ Provides before/after comparison</li>
          </ul>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Beat the ATS?</h3>
            <p className="text-lg mb-6">
              Try CV Adapter free and get your CV past automated screening systems.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-xl transition-all"
            >
              Optimize My CV Now (2 Free Generations)
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Final Thoughts</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            In 2025, beating the ATS is essential for UK job seekers. By following these tips and using the right tools, 
            you can ensure your CV gets past automated screening and into the hands of real recruiters.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Remember: An ATS-optimized CV doesn't mean a boring CV. It means a <strong>smart CV</strong> that works with 
            modern recruitment technology while still showcasing your unique value.
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-gray-600 text-sm">
              <strong>About the Author:</strong> This guide was created by the CV Adapter team, specialists in AI-powered 
              CV optimization for the UK job market. We help thousands of job seekers get past ATS systems every month.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 CV Adapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
