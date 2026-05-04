import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, Eye, CheckCircle, Star, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Professional CV Templates - Free Download | MyCVBuddy',
  description: 'Download professional CV templates for free. ATS-friendly, modern designs that get you hired.',
  keywords: 'CV templates, professional CV, free CV templates, ATS-friendly CV, curriculum vitae',
}

export default function CVTemplatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional CV Templates
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Download professionally designed CV templates that beat ATS systems and impress hiring managers
          </p>
        </div>

        {/* Best Practices Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices for Using CV Templates</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Using CV templates effectively requires more than simply filling in your details. The key is to maintain 
                professional standards while customizing the template to showcase your unique strengths. Always ensure 
                your contact information is current and prominently displayed at the top of your CV. Use a professional 
                email address rather than personal or outdated accounts.
              </p>
              <p className="text-gray-700 mb-4">
                When working with templates, focus on readability and consistency. Choose fonts that are professional 
                and easy to scan, such as Calibri, Arial, or Times New Roman in 10-12 point size. Maintain consistent 
                formatting throughout your document - use the same style for headings, bullet points, and spacing. 
                Avoid overcrowding your CV with too much text; use white space effectively to guide the reader's eye 
                to important information.
              </p>
              <p className="text-gray-700 mb-4">
                Customize each template for the specific job you're applying for. While the structure remains consistent, 
                adjust the content to highlight relevant skills and experiences that match the job description. Use 
                action verbs and quantifiable achievements to demonstrate your impact rather than simply listing duties. 
                Remember that ATS systems often scan for specific keywords, so incorporate relevant terms from the job 
                posting naturally throughout your CV.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-900 mb-3">Template Customization Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Keep your CV to 1-2 pages maximum, regardless of template length</li>
                  <li>• Use reverse chronological order for work experience</li>
                  <li>• Include specific metrics and achievements (e.g., "increased sales by 25%")</li>
                  <li>• Remove template placeholder text and examples completely</li>
                  <li>• Save as PDF unless specifically requested in another format</li>
                  <li>• Test readability on both desktop and mobile devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Template Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Choose Your CV Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Professional Template */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="w-24 h-24 text-gray-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Professional Classic</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Clean, traditional design perfect for corporate roles and conservative industries
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    ATS-friendly format
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Professional layout
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Easy to customize
                  </li>
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modern Template */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                <FileText className="w-24 h-24 text-blue-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Modern Creative</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Contemporary design with color accents ideal for creative and tech industries
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Eye-catching design
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Color customization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Skills section
                  </li>
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Executive Template */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                PRO
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center">
                <FileText className="w-24 h-24 text-purple-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Executive Elite</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Premium template for senior professionals and executive positions
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Executive summary
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Leadership focus
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Professional branding
                  </li>
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Pro Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Success Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Before You Start</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Gather all your employment dates and achievements</li>
                  <li>• Review the job description for keywords</li>
                  <li>• Choose a template that matches your industry</li>
                  <li>• Have someone proofread your final version</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Common Mistakes to Avoid</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Using template placeholder text</li>
                  <li>• Including irrelevant personal information</li>
                  <li>• Making the layout too complex</li>
                  <li>• Using inconsistent formatting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need a Custom CV?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let our AI-powered tool create a personalized CV based on your experience and target job
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your CV Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
