import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, Eye, FileText, Briefcase, GraduationCap, Code, Heart, Users, Star, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resume Samples & Examples by Industry | MyCVBuddy',
  description: 'Explore professional resume samples and examples across various industries. Download real resume examples to guide your job application.',
  keywords: 'resume samples, resume examples, professional resume, CV examples, sample resumes, industry resumes',
}

export default function ResumeSamplesPage() {
  const resumeSamples = [
    {
      category: 'Technology',
      icon: Code,
      samples: [
        { title: 'Software Engineer', rating: 4.8, downloads: 15234 },
        { title: 'Data Scientist', rating: 4.9, downloads: 12456 },
        { title: 'Product Manager', rating: 4.7, downloads: 10234 },
        { title: 'DevOps Engineer', rating: 4.6, downloads: 8765 }
      ]
    },
    {
      category: 'Healthcare',
      icon: Heart,
      samples: [
        { title: 'Registered Nurse', rating: 4.9, downloads: 18765 },
        { title: 'Medical Doctor', rating: 4.8, downloads: 14567 },
        { title: 'Healthcare Administrator', rating: 4.7, downloads: 9876 },
        { title: 'Medical Assistant', rating: 4.6, downloads: 7654 }
      ]
    },
    {
      category: 'Business',
      icon: Briefcase,
      samples: [
        { title: 'Marketing Manager', rating: 4.8, downloads: 16234 },
        { title: 'Financial Analyst', rating: 4.7, downloads: 13456 },
        { title: 'Sales Representative', rating: 4.6, downloads: 11234 },
        { title: 'HR Manager', rating: 4.8, downloads: 9876 }
      ]
    },
    {
      category: 'Education',
      icon: GraduationCap,
      samples: [
        { title: 'Teacher', rating: 4.9, downloads: 14567 },
        { title: 'Academic Researcher', rating: 4.7, downloads: 8765 },
        { title: 'School Administrator', rating: 4.6, downloads: 6543 },
        { title: 'College Professor', rating: 4.8, downloads: 5432 }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Resume Samples & Examples
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore real resume examples across industries. Get inspired by proven formats that land interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your Resume
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/cv-templates"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Featured Samples */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Featured Resume Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resumeSamples.map((category) => (
              <div key={category.category} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <category.icon className="w-6 h-6" />
                    <h3 className="font-bold text-lg">{category.category}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {category.samples.map((sample, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{sample.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">{sample.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">({sample.downloads.toLocaleString()})</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All {category.category} Samples →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Showcase */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sample Resume Breakdown</h2>
            
            {/* Sample Resume Preview */}
            <div className="border-2 border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Software Engineer Resume Example</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              
              {/* Resume Content Preview */}
              <div className="bg-white rounded-lg p-4 text-sm">
                <div className="border-b pb-2 mb-2">
                  <p className="font-bold text-lg">JOHN DOE</p>
                  <p className="text-gray-600">john.doe@email.com | +1 (555) 123-4567 | San Francisco, CA</p>
                  <p className="text-gray-600">LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe</p>
                </div>
                
                <div className="mb-3">
                  <p className="font-bold text-gray-900 mb-1">PROFESSIONAL SUMMARY</p>
                  <p className="text-gray-700">
                    Senior Software Engineer with 5+ years of experience developing scalable web applications. 
                    Proficient in React, Node.js, and cloud technologies. Led cross-functional teams to deliver 
                    products that increased user engagement by 40%.
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="font-bold text-gray-900 mb-1">TECHNICAL SKILLS</p>
                  <p className="text-gray-700">
                    JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, MongoDB, PostgreSQL
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="font-bold text-gray-900 mb-1">PROFESSIONAL EXPERIENCE</p>
                  <p className="font-semibold">Senior Software Engineer | Tech Corp | San Francisco, CA</p>
                  <p className="text-gray-600 text-sm">June 2020 - Present</p>
                  <ul className="text-gray-700 text-sm mt-1 space-y-1">
                    <li>• Developed and launched 3 major features using React and Node.js</li>
                    <li>• Improved application performance by 35% through code optimization</li>
                    <li>• Mentored 3 junior developers and conducted code reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Elements Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">What Makes This Resume Effective:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Clear contact information with professional links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Quantified achievements (40% increase, 35% improvement)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Relevant technical skills prominently displayed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Action verbs and measurable results</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Customization Tips:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Tailor skills to match job description keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Include projects relevant to target company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Adjust summary to highlight relevant experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Keep resume to 1-2 pages maximum</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Industry-Specific Tips */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Industry-Specific Resume Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Technology Resumes</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Include GitHub profile and tech portfolio links</li>
                <li>• List technical skills by proficiency level</li>
                <li>• Highlight specific technologies mentioned in job postings</li>
                <li>• Include metrics for system performance and user impact</li>
                <li>• Showcase contributions to open-source projects</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Healthcare Resumes</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Include licenses, certifications, and specializations</li>
                <li>• Highlight patient care outcomes and satisfaction scores</li>
                <li>• Emphasize compliance with healthcare regulations</li>
                <li>• Include experience with electronic health records</li>
                <li>• Showcase continuing education and training</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Business Resumes</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Focus on revenue growth and cost savings</li>
                <li>• Include leadership and team management experience</li>
                <li>• Highlight strategic planning and execution</li>
                <li>• Quantify business impact with specific metrics</li>
                <li>• Emphasize cross-functional collaboration</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Education Resumes</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Include teaching philosophy and methodology</li>
                <li>• Highlight student achievement improvements</li>
                <li>• Showcase curriculum development experience</li>
                <li>• Include professional development and certifications</li>
                <li>• Emphasize technology integration in education</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Statistics */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Resume Samples</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">#1</div>
                <p className="text-sm text-gray-700">Software Engineer</p>
                <p className="text-xs text-gray-500">15.2k downloads</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">#2</div>
                <p className="text-sm text-gray-700">Marketing Manager</p>
                <p className="text-xs text-gray-500">16.2k downloads</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">#3</div>
                <p className="text-sm text-gray-700">Registered Nurse</p>
                <p className="text-xs text-gray-500">18.8k downloads</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">#4</div>
                <p className="text-sm text-gray-700">Data Scientist</p>
                <p className="text-xs text-gray-500">12.5k downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Use our AI-powered tool to create a tailored resume based on proven samples and industry best practices
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Resume Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
