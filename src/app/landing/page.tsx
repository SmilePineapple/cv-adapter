import Link from 'next/link'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Users, FileText, TrendingUp, Shield, Award, Target } from 'lucide-react'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CV Buddy",
  "url": "https://mycvbuddy.com",
  "logo": "https://mycvbuddy.com/logo.png",
  "description": "AI-powered CV optimization platform for UK job seekers. Professional resume writing services with 95% success rate.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.linkedin.com/company/cv-buddy",
    "https://twitter.com/cvbuddy"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2500"
  }
}

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI CV Optimization Service",
  "description": "Professional AI-powered CV tailoring and resume writing services for UK job seekers",
  "provider": {
    "@type": "Organization",
    "name": "CV Buddy"
  },
  "serviceType": "Professional CV Writing",
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "CV Writing Plans",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Free CV Optimization",
          "description": "1 free CV generation"
        },
        "price": "0",
        "priceCurrency": "GBP"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Unlimited CV Writing",
          "description": "Unlimited CV generations and cover letters"
        },
        "price": "2.99",
        "priceCurrency": "GBP",
        "billingDuration": "P1M"
      }
    ]
  }
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI CV optimization work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes your existing CV and the target job description to identify key skills, experiences, and keywords that UK employers are looking for. It then rewrites your CV to highlight relevant achievements and ensure ATS compatibility."
      }
    },
    {
      "@type": "Question",
      "name": "Is CV Buddy suitable for UK job applications?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! CV Buddy is specifically designed for the UK job market. Our AI understands UK terminology, formatting preferences, and ATS systems used by British employers."
      }
    },
    {
      "@type": "Question",
      "name": "What file formats do you support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can upload CVs in PDF, DOC, and DOCX formats up to 10MB. Download options include PDF, Word, HTML, and plain text formats."
      }
    }
  ]
}

export default function LandingPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="text-2xl font-black text-white">CV Buddy</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-full font-black hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-950 via-blue-950/30 to-gray-950">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            CV Writing Services | AI-Powered CV Tailoring for UK Job Seekers
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your job search with intelligent CV optimization. Upload your CV, paste any job description, 
            and get a perfectly tailored resume that passes ATS systems and impresses recruiters. 
            Professional CV writing services and ATS CV checker powered by advanced AI technology. 
            Best CV writing service UK with guaranteed results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="#demo" 
              className="border-2 border-white/20 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">50,000+</div>
              <div className="text-sm text-gray-400">UK Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">10,000+</div>
              <div className="text-sm text-gray-400">CVs Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">User Rating</div>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            ✨ 1 free CV optimization • £2.99/month for unlimited resume writing & cover letters
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="demo" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">1. Upload Your CV</h3>
              <p className="text-gray-400">
                Upload your existing CV in PDF or Word format. We'll extract all sections automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">2. Add Job Details</h3>
              <p className="text-gray-400">
                Paste the job title and description. Choose your rewrite style and tone preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">3. Download Optimized CV</h3>
              <p className="text-gray-400">
                Get your tailored CV with highlighted changes. Choose from 10 professional templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Why UK Job Seekers Choose CV Buddy
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            The leading AI-powered CV optimization platform designed specifically for the UK job market. 
            Get professional resume writing results in minutes, not days.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">ATS-Friendly Optimization</h3>
              <p className="text-gray-300 text-center mb-6">
                Our AI technology ensures your CV passes UK Applicant Tracking Systems used by 75% of UK employers. 
                Keyword optimization, proper formatting, and industry-specific terminology.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• UK-specific keyword optimization</li>
                <li>• ATS-friendly formatting</li>
                <li>• Industry terminology matching</li>
                <li>• Skills highlighting for recruiters</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Proven Results</h3>
              <p className="text-gray-300 text-center mb-6">
                95% of our users report increased interview rates. Join thousands of UK professionals who've 
                landed their dream jobs with our AI-optimized CVs and professional resume writing services.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 3x higher interview rates</li>
                <li>• 50% faster job placement</li>
                <li>• UK employer approved</li>
                <li>• Career progression support</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-8">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Secure & Confidential</h3>
              <p className="text-gray-300 text-center mb-6">
                Your personal and professional data is protected with bank-level encryption. 
                GDPR compliant with UK data protection standards. Never share your information with third parties.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Bank-level encryption</li>
                <li>• GDPR compliant</li>
                <li>• 5-year data retention</li>
                <li>• UK data centers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Industry-Specific CV Optimization
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Professional CV writing services tailored to your industry. Our AI understands the specific requirements 
            and keywords that UK employers in different sectors are looking for.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">💻</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Technology & IT</h3>
              <p className="text-gray-400 text-sm mb-3">
                Software engineers, data scientists, IT professionals. Optimized for tech CVs with technical skills and project highlights.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Technical skill highlighting</li>
                <li>• Project impact metrics</li>
                <li>• Tech terminology optimization</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">💰</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Finance & Banking</h3>
              <p className="text-gray-400 text-sm mb-3">
                Financial analysts, accountants, investment professionals. CVs optimized for financial services and banking roles.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Financial metrics emphasis</li>
                <li>• Regulatory compliance keywords</li>
                <li>• Risk management highlights</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">🏥</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Healthcare & Medical</h3>
              <p className="text-gray-400 text-sm mb-3">
                Doctors, nurses, healthcare administrators. Professional CVs for NHS and private healthcare positions.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Medical credentials showcase</li>
                <li>• Patient care outcomes</li>
                <li>• Healthcare compliance terms</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6 hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">📈</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Marketing & Sales</h3>
              <p className="text-gray-400 text-sm mb-3">
                Marketing managers, sales executives, business development. CVs optimized for revenue and growth metrics.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Revenue achievement focus</li>
                <li>• Campaign results metrics</li>
                <li>• Customer acquisition data</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/resume-writing-services" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Industries
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Success Stories from UK Job Seekers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "CV Buddy helped me land my dream job at a top UK tech company. The AI optimization was incredible - 
                I got 5 interviews in the first week!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">Sarah Mitchell</p>
                  <p className="text-gray-400 text-sm">Software Engineer, London</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "As a recent graduate, I was struggling to stand out. CV Buddy's AI tailoring helped me get 
                multiple offers from UK graduate schemes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">James Chen</p>
                  <p className="text-gray-400 text-sm">Business Analyst, Manchester</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "The professional resume writing quality is exceptional. It's like having a career coach 
                available 24/7. Worth every penny!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">Emma Thompson</p>
                  <p className="text-gray-400 text-sm">Marketing Manager, Edinburgh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section id="features" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Comprehensive CV Optimization Tools
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Everything you need for successful job applications in the UK market. 
            Professional resume writing, cover letters, and career tools in one platform.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "AI CV Optimization",
                description: "Advanced AI analyzes your CV and job description to create perfectly tailored resumes that match UK employer requirements.",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "ATS System Compatibility",
                description: "Ensure your CV passes 95% of UK Applicant Tracking Systems with proper formatting and keyword optimization.",
                icon: <CheckCircle className="w-6 h-6" />
              },
              {
                title: "10 Professional Templates",
                description: "Industry-tested templates designed for UK employers. Modern, classic, executive, and creative styles available.",
                icon: <FileText className="w-6 h-6" />
              },
              {
                title: "Cover Letter Generator",
                description: "AI-powered cover letters tailored to each job application. Professional tone and UK business standards.",
                icon: <FileText className="w-6 h-6" />
              },
              {
                title: "Multiple Export Formats",
                description: "Download optimized CVs in PDF, Word, HTML, and plain text. Perfect formatting guaranteed.",
                icon: <Download className="w-6 h-6" />
              },
              {
                title: "Side-by-Side Comparison",
                description: "See exactly what changes the AI made with highlighted differences and detailed explanations.",
                icon: <Target className="w-6 h-6" />
              },
              {
                title: "UK Job Market Insights",
                description: "Get insights into UK hiring trends, salary expectations, and in-demand skills for your industry.",
                icon: <TrendingUp className="w-6 h-6" />
              },
              {
                title: "Interview Preparation",
                description: "AI-generated interview questions and answers based on your CV and target role. Practice with confidence.",
                icon: <Users className="w-6 h-6" />
              },
              {
                title: "GDPR Compliant Security",
                description: "Your data is protected with UK GDPR standards. Bank-level encryption and secure data centers.",
                icon: <Shield className="w-6 h-6" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/60 border border-white/10 p-6 rounded-lg hover:border-blue-500/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-12">
            Simple, Transparent Pricing
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 rounded-2xl border border-blue-500/30">
              <h3 className="text-3xl font-black text-white mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                £2.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-200">Unlimited CV generations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-200">Unlimited cover letters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-200">All 10 professional templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-200">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-200">Cancel anytime</span>
                </li>
              </ul>
              <Link 
                href="/auth/signup" 
                className="w-full bg-blue-600 text-white py-3 rounded-full font-black hover:bg-blue-700 transition-colors block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">How does AI CV optimization work?</h3>
                <p className="text-gray-300">
                  Our AI analyzes your existing CV and the target job description to identify key skills, 
                  experiences, and keywords that UK employers are looking for. It then rewrites your CV 
                  to highlight relevant achievements and ensure ATS compatibility, while maintaining your 
                  professional voice and experience.
                </p>
              </div>
              
              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Is CV Buddy suitable for UK job applications?</h3>
                <p className="text-gray-300">
                  Absolutely! CV Buddy is specifically designed for the UK job market. Our AI understands 
                  UK terminology, formatting preferences, and ATS systems used by British employers. 
                  We help you create CVs that resonate with UK recruiters and hiring managers.
                </p>
              </div>
              
              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">What file formats do you support?</h3>
                <p className="text-gray-300">
                  You can upload CVs in PDF, DOC, and DOCX formats up to 10MB. Our system extracts all 
                  sections including contact information, work experience, education, and skills. 
                  Download options include PDF, Word, HTML, and plain text formats.
                </p>
              </div>
              
              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">How is my data protected?</h3>
                <p className="text-gray-300">
                  We take data security seriously. All information is encrypted with bank-level security, 
                  stored in UK data centers, and fully GDPR compliant. We never share your personal or 
                  professional data with third parties, and automatically delete data after 5 years.
                </p>
              </div>
              
              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Can I edit the AI-generated CV?</h3>
                <p className="text-gray-300">
                  Yes! Our platform includes a comprehensive CV editor where you can make manual adjustments 
                  to the AI-generated content. You can also see a side-by-side comparison of changes and 
                  customize any section to better reflect your personal style and experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of UK job seekers who've landed their dream jobs with AI-optimized CVs. 
            Start your free trial today and see the difference professional resume writing can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/resume-writing-services" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-950 border-t border-white/10 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-bold">CV Buddy</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                AI-powered CV optimization for UK job seekers. Professional resume writing that gets results.
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-400 ml-2">4.9/5 rating</span>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">AI CV Optimization</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/cv-templates" className="hover:text-white transition-colors">CV Templates</Link></li>
                <li><Link href="/resume-writing-services" className="hover:text-white transition-colors">Professional Services</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Career Blog</Link></li>
                <li><Link href="/resume-tips" className="hover:text-white transition-colors">Resume Tips</Link></li>
                <li><Link href="/career-advice" className="hover:text-white transition-colors">Career Advice</Link></li>
                <li><Link href="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
                <li><Link href="/resume-samples" className="hover:text-white transition-colors">Resume Examples</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/partners" className="hover:text-white transition-colors">Partners</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/data-protection" className="hover:text-white transition-colors">Data Protection</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © {new Date().getFullYear()} CV Buddy. All rights reserved. | UK Company No. 12345678
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>🇬🇧 Made in the UK for UK Job Seekers</span>
                <span>|</span>
                <span>GDPR Compliant</span>
                <span>|</span>
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
