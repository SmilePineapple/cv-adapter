import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Target, BookOpen, Award, Lightbulb, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Career Advice & Professional Development | MyCVBuddy',
  description: 'Expert career advice for professional growth, job searching, and career advancement. Get actionable tips to accelerate your career development.',
  keywords: 'career advice, professional development, career growth, job search, career planning, career advancement',
}

export default function CareerAdvicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Career Advice & Professional Development
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Strategic guidance to help you navigate your career path and achieve professional success
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Career Planning */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-8 h-8 text-blue-600" />
                  Strategic Career Planning
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Define Your Career Goals</h3>
                    <p className="text-gray-700 mb-4">
                      Start by identifying where you want to be in 1, 3, and 5 years. Consider factors like 
                      role progression, industry changes, salary expectations, and work-life balance. 
                      Clear goals provide direction and motivation for your career journey.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-900 font-medium mb-2">Goal-Setting Framework:</p>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Specific: Clearly define what you want to achieve</li>
                        <li>• Measurable: Include metrics to track progress</li>
                        <li>• Achievable: Set realistic but challenging targets</li>
                        <li>• Relevant: Align with your values and long-term vision</li>
                        <li>• Time-bound: Set deadlines for each milestone</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills Gap Analysis</h3>
                    <p className="text-gray-700 mb-4">
                      Regularly assess your current skills against industry demands and future requirements. 
                      Identify technical skills, soft skills, and leadership capabilities you need to develop. 
                      Create a learning plan with specific courses, certifications, or experiences to bridge these gaps.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Your Personal Brand</h3>
                    <p className="text-gray-700 mb-4">
                      Your professional brand is how others perceive your expertise and value. Develop a consistent 
                      message across your resume, LinkedIn profile, and professional interactions. Share your 
                      knowledge through speaking engagements, writing, or mentoring to establish thought leadership.
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Search Strategies */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  Modern Job Search Strategies
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Networking</h3>
                    <p className="text-gray-700 mb-4">
                      Leverage LinkedIn and professional networks to connect with industry leaders and recruiters. 
                      Engage with content relevant to your field, join professional groups, and participate in 
                      discussions. Quality connections often lead to unadvertised opportunities.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Targeted Applications</h3>
                    <p className="text-gray-700 mb-4">
                      Quality over quantity is key in modern job searching. Research companies thoroughly and 
                      tailor each application. Use job alerts strategically, but focus on roles that genuinely 
                      match your skills and career goals. Personalized cover letters significantly increase response rates.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Preparation Excellence</h3>
                    <p className="text-gray-700 mb-4">
                      Success in interviews requires thorough preparation. Research the company, practice common 
                      questions, and prepare thoughtful questions for your interviewers. For comprehensive guidance, 
                      our <Link href="/interview-prep" className="underline font-semibold text-blue-600">interview preparation resources</Link> can help you excel in both virtual and in-person interviews.
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 mt-4">
                      <p className="text-green-900 font-medium mb-2">Interview Success Tips:</p>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• Research the company's recent achievements and challenges</li>
                        <li>• Prepare examples using the STAR method</li>
                        <li>• Practice virtual interview etiquette and setup</li>
                        <li>• Follow up with personalized thank-you notes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Growth */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  Continuous Professional Growth
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Lifelong Learning Mindset</h3>
                    <p className="text-gray-700 mb-4">
                      The most successful professionals maintain a growth mindset throughout their careers. 
                      Dedicate time to learning new skills, staying updated on industry trends, and adapting 
                      to technological changes. Consider online courses, workshops, and industry conferences.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Mentorship and Networking</h3>
                    <p className="text-gray-700 mb-4">
                      Seek mentors who can provide guidance based on their experience. Equally important, 
                      become a mentor to others. Teaching reinforces your knowledge and expands your professional 
                      network. Join professional associations and attend industry events to build meaningful connections.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Leadership Development</h3>
                    <p className="text-gray-700 mb-4">
                      Regardless of your current role, developing leadership skills is valuable for career advancement. 
                      Take initiative on projects, mentor junior colleagues, and seek opportunities to lead teams 
                      or initiatives. Leadership skills are transferable across industries and roles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Ready for Your Next Interview?</h3>
                <p className="mb-6 text-blue-100">
                  Prepare with our comprehensive interview prep tools and land your dream job.
                </p>
                <Link
                  href="/interview-prep"
                  className="inline-flex items-center w-full justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Interview Prep
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              {/* Career Stages */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Career Stage Advice</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Entry Level</h4>
                    <p className="text-sm text-gray-600">Focus on skill building and gaining diverse experience</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Mid-Career</h4>
                    <p className="text-sm text-gray-600">Develop specialization and leadership capabilities</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Senior Level</h4>
                    <p className="text-sm text-gray-600">Mentor others and drive strategic initiatives</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Executive</h4>
                    <p className="text-sm text-gray-600">Focus on vision, culture, and organizational impact</p>
                  </div>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Career Resources</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <Link href="/interview-prep" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Interview Preparation Guide
                      </Link>
                      <p className="text-gray-600 text-xs">Master virtual and in-person interviews</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <Link href="/resume-tips" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Resume Writing Tips
                      </Link>
                      <p className="text-gray-600 text-xs">Create standout resumes that get noticed</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <Link href="/resume-writing-services" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Professional Resume Services
                      </Link>
                      <p className="text-gray-600 text-xs">Expert help with your career documents</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Industry Insights */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Industry Insights
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">Tech Industry</p>
                    <p className="text-gray-700">AI and machine learning skills in high demand</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Healthcare</p>
                    <p className="text-gray-700">Telemedicine and digital health growing rapidly</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Finance</p>
                    <p className="text-gray-700">Fintech and sustainable finance on the rise</p>
                  </div>
                </div>
              </div>

              {/* Career Success Factors */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Success Factors</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Continuous learning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Strong network</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Adaptability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Emotional intelligence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Strategic thinking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Combine this career advice with our <Link href="/interview-prep" className="underline font-semibold">interview preparation tools</Link> to land your next opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create Your Resume
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/interview-prep"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Prepare for Interviews
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
