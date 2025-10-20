'use client'

import Link from 'next/link'
import { Sparkles, FileText, Zap, Globe, CheckCircle, ArrowRight } from 'lucide-react'

export default function HindiLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CV Adapter
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                English
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
              >
                मुफ्त में शुरू करें
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            हिंदी CV के लिए अनुकूलित
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI से अपना CV बदलें
            <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              हिंदी में
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            अपने CV को तुरंत किसी भी नौकरी के लिए अनुकूलित करें। 
            हमारा AI हिंदी में पेशेवर सामग्री बनाता है, ATS सिस्टम के लिए अनुकूलित।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              मुफ्त में आज़माएं
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200"
            >
              लॉग इन करें
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✨ 1 मुफ्त जनरेशन • क्रेडिट कार्ड की आवश्यकता नहीं
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              हिंदी में AI
            </h3>
            <p className="text-gray-600">
              हमारा AI सीधे हिंदी में पेशेवर सामग्री बनाता है। कोई अजीब अनुवाद नहीं, बस प्रामाणिक हिंदी।
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ATS अनुकूलन
            </h3>
            <p className="text-gray-600">
              भारतीय कंपनियों द्वारा उपयोग किए जाने वाले एप्लिकेंट ट्रैकिंग सिस्टम (ATS) के लिए अनुकूलित।
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              मल्टीपल एक्सपोर्ट
            </h3>
            <p className="text-gray-600">
              अपना CV PDF, DOCX या TXT में डाउनलोड करें। भर्तीकर्ताओं को भेजने के लिए तैयार।
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            अपना CV बदलने के लिए तैयार हैं?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            सैकड़ों भारतीय पेशेवरों के साथ जुड़ें जो CV Adapter का उपयोग करते हैं
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
          >
            मुफ्त में शुरू करें
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="mb-4">© 2025 CV Adapter. सर्वाधिकार सुरक्षित।</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-gray-900">
                गोपनीयता
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                शर्तें
              </Link>
              <Link href="/contact" className="hover:text-gray-900">
                संपर्क करें
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
