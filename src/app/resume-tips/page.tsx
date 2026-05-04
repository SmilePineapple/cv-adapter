import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Lightbulb, CheckCircle, Star, Target, FileText, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resume Tips & Career Advice - Expert Guidance | MyCVBuddy',
  description: 'Expert resume tips and career advice to help you land your dream job. Professional guidance on resume writing, job search, and interview preparation.',
  keywords: 'resume tips, career advice, resume writing, job search tips, interview preparation, career guidance',
}

export default function ResumeTipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Expert Resume Tips & Career Advice
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional guidance to help you create standout resumes and advance your career
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resume Writing Tips */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  Essential Resume Writing Tips
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Tailor Your Resume for Each Job</h3>
                    <p className="text-gray-700 mb-4">
                      One of the most critical resume tips is customization. Generic resumes get overlooked. 
                      Study the job description and mirror the language, keywords, and requirements. Highlight 
                      the skills and experiences that directly relate to the position you're applying for.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-900 font-medium mb-2">Pro Tip:</p>
                      <p className="text-blue-800 text-sm">
                        Create a master resume with all your experiences, then customize it for each application. 
                        For expert help with customization, consider our <Link href="/resume-writing-services" className="underline font-semibold">professional resume writing services</Link>.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Use Action Verbs and Quantify Achievements</h3>
                    <p className="text-gray-700 mb-4">
                      Instead of saying "Responsible for managing a team," say "Led a team of 5 professionals, 
                      increasing productivity by 30%." Use strong action verbs like "achieved," "implemented," 
                      "developed," and "managed." Numbers make your impact concrete and memorable.
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Increased sales revenue by 45% in Q4 2023</li>
                      <li>• Managed a budget of $500,000 with 98% accuracy</li>
                      <li>• Reduced customer complaints by 60% through process improvements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Optimize for ATS Systems</h3>
                    <p className="text-gray-700 mb-4">
                      Most large companies use Applicant Tracking Systems (ATS) to screen resumes. Use standard 
                      section headings (Experience, Education, Skills), avoid tables and columns, and include 
                      relevant keywords from the job description. Save your resume as a .docx or PDF to ensure 
                      proper parsing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Keep It Concise and Relevant</h3>
                    <p className="text-gray-700 mb-4">
                      For most professionals, a one-page resume is ideal. Two pages are acceptable only if you 
                      have extensive, relevant experience. Remove outdated information and focus on the last 
                      10-15 years of your career. Every line should add value and relevance to your target role.
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Advancement Tips */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-8 h-8 text-green-600" />
                  Career Advancement Strategies
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Networking Best Practices</h3>
                    <p className="text-gray-700 mb-4">
                      Build meaningful professional relationships before you need them. Attend industry events, 
                      join professional associations, and engage on platforms like LinkedIn. Remember that networking 
                      is about building genuine connections, not just asking for favors.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Learning</h3>
                    <p className="text-gray-700 mb-4">
                      Stay current in your field by pursuing certifications, attending workshops, and reading 
                      industry publications. Highlight recent learning experiences on your resume to show 
                      commitment to professional growth.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Branding</h3>
                    <p className="text-gray-700 mb-4">
                      Develop a consistent professional brand across all platforms. Your LinkedIn profile, 
                      personal website, and resume should all tell the same story about your expertise and 
                      career goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interview Preparation */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-8 h-8 text-purple-600" />
                  Interview Success Tips
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Research and Preparation</h3>
                    <p className="text-gray-700 mb-4">
                      Research the company thoroughly before your interview. Understand their products, 
                      services, culture, and recent news. Prepare thoughtful questions that show your 
                      interest and knowledge about the organization.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">STAR Method for Behavioral Questions</h3>
                    <p className="text-gray-700 mb-4">
                      Use the STAR method (Situation, Task, Action, Result) to structure your answers to 
                      behavioral questions. This framework helps you provide comprehensive, compelling 
                      responses that demonstrate your capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Need Professional Help?</h3>
                <p className="mb-6 text-blue-100">
                  Let our experts craft a winning resume that gets you noticed by recruiters and ATS systems.
                </p>
                <Link
                  href="/resume-writing-services"
                  className="inline-flex items-center w-full justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Professional Help
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              {/* Quick Tips */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Resume Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Proofread multiple times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Use consistent formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Include a professional summary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Customize for each application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Save as PDF unless specified otherwise</span>
                  </li>
                </ul>
              </div>

              {/* Related Resources */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/resume-writing-services" className="text-blue-600 hover:text-blue-700 font-medium">
                      Professional Resume Writing Services →
                    </Link>
                  </li>
                  <li>
                    <Link href="/cv-template" className="text-blue-600 hover:text-blue-700 font-medium">
                      CV Template Best Practices →
                    </Link>
                  </li>
                  <li>
                    <Link href="/interview-prep" className="text-blue-600 hover:text-blue-700 font-medium">
                      Interview Preparation Guide →
                    </Link>
                  </li>
                  <li>
                    <Link href="/career-advice" className="text-blue-600 hover:text-blue-700 font-medium">
                      Career Advice & Planning →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Following these resume tips helped me land three interviews in one week! The advice on 
                  quantifying achievements was game-changing."
                </p>
                <p className="text-gray-900 font-semibold">- Sarah T., Marketing Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Combine these tips with our professional <Link href="/resume-writing-services" className="underline font-semibold">resume writing services</Link> for maximum impact
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
