import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, CheckCircle, Star, FileText, Search, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CV Templates - Free Professional Downloads | MyCVBuddy',
  description: 'Download professional CV templates for free. ATS-friendly formats, modern designs, and proven layouts that get you hired. Start your job search today.',
  keywords: 'CV templates, free CV templates, professional CV, curriculum vitae, ATS-friendly CV, CV download',
}

export default function CVTemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Free CV Templates
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Download professional CV templates for free. ATS-friendly designs that help you stand out and get hired faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create CV with AI
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              Browse All Templates
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates by industry, role, or style..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Template Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Popular CV Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Template 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Classic Professional</h3>
                <p className="text-sm text-gray-600 mb-3">Traditional format for corporate roles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(2.3k)</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-blue-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Modern Tech</h3>
                <p className="text-sm text-gray-600 mb-3">Clean design for tech professionals</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(1.8k)</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>

            {/* Template 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                PRO
              </div>
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-purple-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Creative Designer</h3>
                <p className="text-sm text-gray-600 mb-3">Eye-catching layout for creatives</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(956)</span>
                  </div>
                  <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Pro
                  </button>
                </div>
              </div>
            </div>

            {/* Template 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-green-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Executive Leader</h3>
                <p className="text-sm text-gray-600 mb-3">Premium format for senior roles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(1.2k)</span>
                  </div>
                  <button className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>

            {/* Template 5 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-red-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Sales Professional</h3>
                <p className="text-sm text-gray-600 mb-3">Results-focused for sales roles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(876)</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>

            {/* Template 6 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-yellow-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Recent Graduate</h3>
                <p className="text-sm text-gray-600 mb-3">Perfect for entry-level positions</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(1.5k)</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>

            {/* Template 7 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                PRO
              </div>
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-indigo-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Minimalist Chic</h3>
                <p className="text-sm text-gray-600 mb-3">Clean, modern, sophisticated</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(643)</span>
                  </div>
                  <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Pro
                  </button>
                </div>
              </div>
            </div>

            {/* Template 8 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-pink-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Healthcare Pro</h3>
                <p className="text-sm text-gray-600 mb-3">Specialized for medical roles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(523)</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Download className="w-3 h-3" />
                    Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our CV Templates?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ATS-Friendly</h3>
                <p className="text-sm text-gray-600">
                  All templates are optimized to pass applicant tracking systems and reach human recruiters
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
                <p className="text-sm text-gray-600">
                  Created by career experts to highlight your strengths and impress hiring managers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy to Customize</h3>
                <p className="text-sm text-gray-600">
                  Simple to edit in Word, Google Docs, or our online CV builder tool
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Need More Than a Template?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let our AI create a personalized CV tailored to your dream job
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Your AI CV
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
