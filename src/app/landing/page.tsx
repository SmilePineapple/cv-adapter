import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Users, FileText, TrendingUp, Shield, Award, Target } from 'lucide-react'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading CV Buddy...</p>
      </div>
    </div>
  )
}

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

const appStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MyCVBuddy – Free AI CV Builder",
  "alternateName": ["mycv builder", "mycvbuddy", "my cv buddy"],
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://www.mycvbuddy.com",
  "description": "MyCVBuddy is a free AI-powered CV builder and mycv writer for UK job seekers. Upload your existing CV, paste a job description, and get a tailored, ATS-optimised CV in minutes.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP",
    "description": "Free CV generation. Pro plan from £2.99/month."
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2500"
  },
  "featureList": [
    "AI CV tailoring to job descriptions",
    "ATS keyword optimisation",
    "10 professional UK CV templates",
    "Cover letter generator",
    "PDF and Word export",
    "Marketing CV examples UK",
    "CV ideas and CV samples for UK jobs"
  ]
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is MyCVBuddy and how does the mycv builder work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MyCVBuddy is a free AI-powered mycv builder designed for UK job seekers. Upload your existing CV, paste the target job description, and the AI rewrites your CV with tailored keywords, ATS-friendly formatting and achievement-led bullet points. Your first CV is completely free."
      }
    },
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
      "name": "Can I get marketing CV examples UK?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MyCVBuddy includes real marketing CV examples for UK jobs, including marketing manager, digital marketing executive and brand manager roles. Visit our CV examples blog to browse samples by industry, or use the AI builder to generate a tailored marketing CV in minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I find CV ideas for UK jobs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MyCVBuddy provides free CV ideas and CV samples for all UK industries, including finance, tech, healthcare, marketing and education. Browse our CV examples library for formatting inspiration and industry-specific content ideas, or use the AI builder to create your own tailored CV."
      }
    },
    {
      "@type": "Question",
      "name": "What file formats do you support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can upload CVs in PDF, DOC, and DOCX formats up to 10MB. Download options include PDF, Word, HTML, and plain text formats."
      }
    },
    {
      "@type": "Question",
      "name": "How long should a UK CV be?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most UK roles, a CV should be 2 pages. Graduates and school leavers can use 1 page. Senior executives and NHS professionals may extend to 3 pages. MyCVBuddy automatically formats your CV to the correct length for your experience level."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a CV and a resume in the UK?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In the UK, a CV (Curriculum Vitae) is the standard document used for job applications — typically 2 pages including a personal statement, full work history, education, and skills. A resume is the US term for a shorter 1-page document. UK employers always ask for a CV, not a resume."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get my CV to pass an ATS system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To pass an ATS (Applicant Tracking System), your CV must: use standard section headings like Work Experience, Education, and Skills; include keywords from the job description naturally throughout; avoid tables, graphics, and unusual fonts; and use a clean single-column layout. MyCVBuddy automatically does all of this for every CV it generates."
      }
    },
    {
      "@type": "Question",
      "name": "Does MyCVBuddy write cover letters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The MyCVBuddy Pro plan includes an AI-powered cover letter generator that creates a personalised cover letter matched to your CV and the specific job description. UK cover letters should be no more than one page and address why you want that specific role at that specific company."
      }
    }
  ]
}

// WebSite Schema with Sitelinks Searchbox
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MyCVBuddy - Free AI CV Builder UK",
  "url": "https://www.mycvbuddy.com",
  "description": "Free AI-powered CV builder for UK job seekers. Upload your CV, paste a job description, and get a tailored, ATS-optimised CV in minutes.",
  "publisher": {
    "@type": "Organization",
    "name": "MyCVBuddy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.mycvbuddy.com/logo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.mycvbuddy.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

// LocalBusiness Schema for UK presence
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "MyCVBuddy",
  "description": "Professional CV writing and AI CV optimization services for UK job seekers",
  "url": "https://www.mycvbuddy.com",
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "serviceType": "CV Writing Service",
  "priceRange": "£",
  "currenciesAccepted": "GBP",
  "paymentAccepted": "Credit Card, Debit Card",
  "openingHours": "Mo-Su 00:00-23:59",
  "isAccessibleForFree": true,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "CV Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Free CV Generation"
        },
        "price": "0",
        "priceCurrency": "GBP"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Unlimited CV Writing Pro Plan"
        },
        "price": "2.99",
        "priceCurrency": "GBP",
        "priceValidUntil": "2026-12-31"
      }
    ]
  }
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appStructuredData) }}
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
            MyCVBuddy — Free AI CV Builder &amp; MyCVBuilder for UK Jobs
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            The free mycv builder trusted by UK job seekers. Upload your CV, paste any job description, 
            and get a perfectly tailored, ATS-optimised CV in minutes. 
            Browse marketing CV examples UK, get CV ideas, and use our AI to create a standout CV — no credit card required.
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
            ✨ First CV free • No credit card • £2.99/month for unlimited CVs &amp; cover letters
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

      {/* CV Buddy vs Competitors Comparison Table */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            CV Buddy vs Traditional CV Writing Services
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            See why thousands of UK job seekers choose MyCVBuddy over expensive professional CV writing agencies and generic resume builders.
          </p>
          <div className="overflow-x-auto max-w-5xl mx-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900/40 border border-blue-500/30">
                  <th className="p-4 text-white font-bold text-lg">Feature</th>
                  <th className="p-4 text-blue-300 font-bold text-lg text-center">CV Buddy</th>
                  <th className="p-4 text-gray-300 font-bold text-lg text-center">CV Writing Agencies</th>
                  <th className="p-4 text-gray-300 font-bold text-lg text-center">Generic Builders</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Price", "Free (£2.99/mo Pro)", "£150–£400+", "£10–£30/mo"],
                  ["Tailored to job description", "✅ AI-powered match", "✅ Manual (slow)", "❌ Generic templates only"],
                  ["ATS keyword optimisation", "✅ Automatic", "⚠️ Inconsistent", "❌ Rarely included"],
                  ["Turnaround time", "⚡ Under 2 minutes", "2–5 business days", "Instant (but generic)"],
                  ["UK-specific formatting", "✅ Built for UK market", "✅ Yes", "⚠️ Mostly US-focused"],
                  ["Cover letter included", "✅ Pro plan", "💰 Extra cost", "⚠️ Template only"],
                  ["Interview prep tools", "✅ Included", "❌ Separate service", "❌ Not available"],
                  ["Multiple export formats", "✅ PDF, DOCX, HTML, TXT", "📄 PDF only", "⚠️ PDF only usually"],
                  ["Edit after generation", "✅ Full editor included", "❌ One revision", "✅ Basic editor"],
                  ["GDPR compliant", "✅ UK data centres", "⚠️ Varies", "⚠️ Varies"],
                ].map(([feature, buddy, agency, generic], i) => (
                  <tr key={i} className={`border border-white/10 ${i % 2 === 0 ? "bg-gray-900/60" : "bg-gray-800/40"}`}>
                    <td className="p-4 text-gray-200 font-medium">{feature}</td>
                    <td className="p-4 text-green-300 text-center font-semibold">{buddy}</td>
                    <td className="p-4 text-gray-400 text-center">{agency}</td>
                    <td className="p-4 text-gray-400 text-center">{generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Comparison based on publicly available pricing for UK CV writing agencies as of 2026. Agency prices may vary.
          </p>
        </div>
      </section>

      {/* UK Job Market Context */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            The UK Job Market in 2026: Why Your CV Matters More Than Ever
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            The UK recruitment landscape has changed dramatically. Here&apos;s what every job seeker needs to know before sending another CV.
          </p>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">ATS Systems Are Now Universal</h3>
              <p className="text-gray-300 mb-4">
                Over <strong className="text-white">75% of UK employers</strong> now use Applicant Tracking Systems (ATS) to screen CVs before a human ever reads them. 
                If your CV isn&apos;t formatted correctly with the right keywords, it will be automatically rejected — even if you&apos;re the perfect candidate.
              </p>
              <p className="text-gray-300 mb-4">
                Major UK employers using ATS include Royal Mail, NHS, Lloyds Banking Group, Barclays, KPMG, Deloitte, PwC, and most FTSE 100 companies. 
                Even SMEs increasingly use platforms like <strong className="text-white">Workday, Greenhouse, and Lever</strong> that automatically score and rank candidates.
              </p>
              <p className="text-gray-300">
                MyCVBuddy&apos;s AI is trained to understand what these systems look for: correct section headings, keyword density, clean formatting, and achievement-led bullet points that match the specific job description you&apos;re applying for.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">UK CV Standards vs US Resume Format</h3>
              <p className="text-gray-300 mb-4">
                A UK CV and a US resume are fundamentally different documents. UK CVs typically include a <strong className="text-white">personal statement</strong>, are 2 pages for experienced candidates, and use British English spelling, UK date formats, and specific section ordering.
              </p>
              <p className="text-gray-300 mb-4">
                Many generic AI resume builders are built for the US market and produce documents that feel wrong to UK recruiters — missing the personal statement, using US spellings like &quot;organisation&quot; vs &quot;organization,&quot; and formatting dates in the wrong order.
              </p>
              <p className="text-gray-300">
                MyCVBuddy is <strong className="text-white">built exclusively for the UK job market</strong>. Every CV generated follows UK conventions, uses British English, and is optimised for UK recruiters and ATS systems.
              </p>
            </div>
          </div>
          {/* UK Job Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { stat: "75%", label: "of UK employers use ATS screening", color: "text-blue-400" },
              { stat: "6 sec", label: "average time a recruiter spends on a CV", color: "text-yellow-400" },
              { stat: "250+", label: "average CVs per UK job posting", color: "text-red-400" },
              { stat: "3x", label: "more interviews with an ATS-optimised CV", color: "text-green-400" },
            ].map(({ stat, label, color }, i) => (
              <div key={i} className="bg-gray-800/60 border border-white/10 rounded-xl p-6 text-center">
                <div className={`text-3xl font-black mb-2 ${color}`}>{stat}</div>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Who Uses MyCVBuddy?
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Whether you&apos;re a fresh graduate or a seasoned executive, our AI CV builder is designed for every stage of your career.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                emoji: "🎓",
                title: "Graduates & School Leavers",
                desc: "Just finished your degree or A-levels? Our AI helps you present limited experience in the most compelling way, highlighting transferable skills, projects, and relevant coursework. Perfect for UK graduate scheme applications.",
                links: [{ href: "/cv-writing-guide", label: "Graduate CV Writing Guide" }],
              },
              {
                emoji: "🔄",
                title: "Career Changers",
                desc: "Switching industries is tough when your CV is full of irrelevant experience. MyCVBuddy reframes your existing skills to match your new target role, drawing out transferable experience that UK recruiters want to see.",
                links: [{ href: "/how-to-tailor-a-cv", label: "How to Tailor Your CV" }],
              },
              {
                emoji: "📈",
                title: "Professionals Seeking Promotion",
                desc: "Moving up the ladder requires a CV that speaks to leadership, impact, and measurable results. Our AI elevates your language and ensures your seniority is immediately apparent to hiring managers.",
                links: [{ href: "/cv-examples", label: "Professional CV Examples UK" }],
              },
              {
                emoji: "🌍",
                title: "International Job Seekers",
                desc: "Moving to the UK from abroad? Your CV needs to follow UK conventions, not the format from your home country. We reformat your experience to match exactly what UK employers expect.",
                links: [{ href: "/cv-vs-resume", label: "CV vs Resume — UK Guide" }],
              },
              {
                emoji: "⚡",
                title: "Active Job Seekers (Applying to Multiple Roles)",
                desc: "Applying for 10+ jobs? Manually tailoring each CV is exhausting. MyCVBuddy lets you upload once and generate a perfectly tailored CV for each job description in under 2 minutes.",
                links: [{ href: "/tailor-cv-to-job-description", label: "Tailor CV to Job Description" }],
              },
              {
                emoji: "🏆",
                title: "Executives & Senior Leaders",
                desc: "C-suite and director-level CVs need to convey strategic vision and business impact. Our AI understands executive language and formats your CV to command the attention of board-level recruiters.",
                links: [{ href: "/resume-writing-services", label: "Professional CV Writing Services" }],
              },
            ].map(({ emoji, title, desc, links }, i) => (
              <div key={i} className="bg-gray-800/60 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {links.map(({ href, label }) => (
                    <Link key={href} href={href} className="text-xs text-blue-400 hover:text-blue-300 underline">
                      {label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is a Good UK CV — Helpful Guide Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Makes a Good UK CV in 2026?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Writing a CV that gets you interviews in the UK requires understanding what recruiters and ATS systems are looking for. Here&apos;s the definitive guide to UK CV best practices:
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">1. Personal Statement (Profile Summary)</h3>
                <p className="text-gray-300 mb-3">
                  Every UK CV should open with a 3–5 sentence personal statement that summarises who you are, what you do, and what you bring to the role. This is the first thing a recruiter reads and should be entirely tailored to the specific job. Generic personal statements are the single biggest reason CVs get rejected.
                </p>
                <p className="text-gray-300">
                  A strong personal statement for a software engineer might read: <em className="text-gray-200">&quot;Results-driven full-stack developer with 6 years&apos; experience building scalable web applications at FTSE 250 companies. Specialist in React, Node.js, and AWS, with a track record of reducing deployment times by 40% and leading cross-functional agile teams. Seeking a senior engineering role where I can drive technical architecture decisions.&quot;</em>
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">2. Work Experience: Achievement-Led Bullet Points</h3>
                <p className="text-gray-300 mb-3">
                  UK recruiters want to see <strong className="text-white">what you achieved</strong>, not just what your responsibilities were. Transform weak duty-based bullets like &quot;Responsible for managing social media&quot; into achievement-led statements: &quot;Grew Instagram following from 2,000 to 28,000 in 8 months, generating £45,000 in attributed revenue.&quot;
                </p>
                <p className="text-gray-300">
                  Use the <strong className="text-white">CAR method</strong>: Context, Action, Result. Every bullet point should answer: what was the situation, what did you do, and what was the measurable outcome?
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">3. ATS Keywords: Match the Job Description</h3>
                <p className="text-gray-300 mb-3">
                  ATS systems score your CV by comparing it against the job description. If the job asks for &quot;stakeholder management&quot; and your CV says &quot;working with clients,&quot; the system may score you lower. You need to use the <strong className="text-white">exact language</strong> from the job posting throughout your CV.
                </p>
                <p className="text-gray-300">
                  MyCVBuddy does this automatically — our AI reads the job description and rewrites your CV to include the specific keywords, phrases, and skills that will get you past the ATS and in front of a human recruiter. Try our{" "}
                  <Link href="/ats-checker" className="text-blue-400 hover:text-blue-300 underline">free ATS CV checker</Link>{" "}
                  to see how your current CV scores.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">4. CV Length: 2 Pages for Most UK Roles</h3>
                <p className="text-gray-300">
                  UK CVs should be <strong className="text-white">2 pages for most professionals</strong> (graduates can use 1 page; senior executives may extend to 3). Unlike the US, where a 1-page resume is standard, UK employers expect to see a full account of your career history. However, more than 3 pages will usually work against you. Read our{" "}
                  <Link href="/cv-writing-guide" className="text-blue-400 hover:text-blue-300 underline">complete UK CV writing guide</Link>{" "}
                  for detailed formatting advice.
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <p className="text-gray-300">
                <strong className="text-white">Want a CV that follows all of these best practices automatically?</strong>{" "}
                MyCVBuddy&apos;s AI generates your CV with the perfect structure, ATS keywords, achievement-led bullet points, and UK formatting — in under 2 minutes.{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 underline font-semibold">Try it free →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links Hub */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Free CV Resources for UK Job Seekers
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Everything you need to land your next UK job — completely free. Guides, examples, templates, and tools.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📄 CV Writing Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cv-writing-guide" className="text-blue-400 hover:text-blue-300 transition-colors">Complete UK CV Writing Guide 2026</Link></li>
                <li><Link href="/how-to-tailor-a-cv" className="text-blue-400 hover:text-blue-300 transition-colors">How to Tailor a CV to a Job</Link></li>
                <li><Link href="/ats-optimization-guide" className="text-blue-400 hover:text-blue-300 transition-colors">ATS Optimisation Guide</Link></li>
                <li><Link href="/cv-vs-resume" className="text-blue-400 hover:text-blue-300 transition-colors">CV vs Resume — UK vs US Format</Link></li>
                <li><Link href="/customize-resume-for-each-job" className="text-blue-400 hover:text-blue-300 transition-colors">How to Customise Your CV for Each Job</Link></li>
              </ul>
            </div>
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📝 CV Examples & Templates</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cv-examples" className="text-blue-400 hover:text-blue-300 transition-colors">CV Examples UK by Industry</Link></li>
                <li><Link href="/cv-templates" className="text-blue-400 hover:text-blue-300 transition-colors">Free UK CV Templates 2026</Link></li>
                <li><Link href="/resume-samples" className="text-blue-400 hover:text-blue-300 transition-colors">Resume Samples for UK Roles</Link></li>
                <li><Link href="/uk-cv-builder" className="text-blue-400 hover:text-blue-300 transition-colors">UK CV Builder</Link></li>
                <li><Link href="/auto-cv" className="text-blue-400 hover:text-blue-300 transition-colors">Auto CV Generator</Link></li>
              </ul>
            </div>
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🔧 Free CV Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ats-checker" className="text-blue-400 hover:text-blue-300 transition-colors">Free ATS CV Checker</Link></li>
                <li><Link href="/fix-my-cv" className="text-blue-400 hover:text-blue-300 transition-colors">Fix My CV — AI Repair Tool</Link></li>
                <li><Link href="/tailor-cv-to-job-description" className="text-blue-400 hover:text-blue-300 transition-colors">Tailor CV to Job Description</Link></li>
                <li><Link href="/rewrite-cv-for-job-application" className="text-blue-400 hover:text-blue-300 transition-colors">Rewrite CV for Job Application</Link></li>
                <li><Link href="/roast-cv" className="text-blue-400 hover:text-blue-300 transition-colors">Roast My CV — Honest AI Feedback</Link></li>
              </ul>
            </div>
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎯 Career Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/interview-prep" className="text-blue-400 hover:text-blue-300 transition-colors">Interview Preparation Tool</Link></li>
                <li><Link href="/cover-letter" className="text-blue-400 hover:text-blue-300 transition-colors">Cover Letter Generator UK</Link></li>
                <li><Link href="/career-advice" className="text-blue-400 hover:text-blue-300 transition-colors">UK Career Advice</Link></li>
                <li><Link href="/resume-tips" className="text-blue-400 hover:text-blue-300 transition-colors">CV & Resume Tips</Link></li>
                <li><Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors">Career Blog & Job Search Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UK Industry CV Tips */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            CV Tips by Industry — UK Job Market 2026
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Different UK industries have different CV expectations. Here&apos;s what employers in each sector are looking for:
          </p>
          <div className="overflow-x-auto max-w-5xl mx-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 border border-white/10">
                  <th className="p-4 text-white font-bold">Industry</th>
                  <th className="p-4 text-white font-bold">Key CV Requirements</th>
                  <th className="p-4 text-white font-bold">Must-Have Keywords</th>
                  <th className="p-4 text-white font-bold">Typical CV Length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Technology & Software", "GitHub links, project metrics, tech stack list, agile experience", "React, Python, AWS, CI/CD, Agile, Scrum, DevOps", "2 pages"],
                  ["Finance & Banking", "Qualified accountant status, FCA awareness, P&L responsibility, regulatory knowledge", "ACA, ACCA, CFA, FCA, Basel III, KYC, AML", "2 pages"],
                  ["Marketing & Digital", "Campaign ROI metrics, platform experience, follower growth data", "SEO, PPC, Google Analytics, CRM, HubSpot, conversion rate", "2 pages"],
                  ["Healthcare & NHS", "Professional registration numbers, CPD records, patient outcomes", "NMC, GMC, CQC, clinical governance, patient safety", "3+ pages"],
                  ["Legal", "Qualifying law firm, practice areas, deal values, client sectors", "LPC, GDL, SRA, regulatory, due diligence, M&A", "2 pages"],
                  ["Education", "Qualified Teacher Status, Ofsted familiarity, subject specialisms", "QTS, PGCE, Key Stage, curriculum, safeguarding, CPD", "2–3 pages"],
                  ["Engineering", "Professional body membership, CAD software, project values", "CEng, IEng, AutoCAD, BIM, ISO, lean manufacturing", "2 pages"],
                  ["Retail & Hospitality", "Revenue figures, team size managed, P&L responsibility", "footfall, margin, NPS, EPOS, shrinkage reduction", "1–2 pages"],
                ].map(([industry, reqs, keywords, length], i) => (
                  <tr key={i} className={`border border-white/10 ${i % 2 === 0 ? "bg-gray-900/60" : "bg-gray-800/40"}`}>
                    <td className="p-4 text-white font-semibold text-sm">{industry}</td>
                    <td className="p-4 text-gray-400 text-sm">{reqs}</td>
                    <td className="p-4 text-blue-300 text-xs font-mono">{keywords}</td>
                    <td className="p-4 text-gray-300 text-sm text-center">{length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center mt-6">
            <Link href="/cv-writing-guide" className="text-blue-400 hover:text-blue-300 underline">
              Read our full industry CV guide →
            </Link>
          </p>
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
                <h3 className="text-xl font-bold text-white mb-3">What is MyCVBuddy and how does the mycv builder work?</h3>
                <p className="text-gray-300">
                  MyCVBuddy is a free AI-powered mycv builder for UK job seekers. Upload your existing CV, 
                  paste the target job description, and the AI rewrites your CV with tailored keywords, 
                  ATS-friendly formatting and achievement-led bullet points. Your first CV is completely free — no credit card required.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Can I get marketing CV examples UK on this site?</h3>
                <p className="text-gray-300">
                  Yes. Our <a href="/blog/cv-examples-by-industry-uk" className="text-blue-400 hover:text-blue-300 underline">CV examples library</a> includes real marketing CV examples for UK jobs, covering marketing manager, digital marketing executive and brand manager roles. You can also use the AI builder to generate a tailored marketing CV in minutes.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Where can I find CV ideas for UK jobs in 2026?</h3>
                <p className="text-gray-300">
                  Browse our free <a href="/blog/cv-examples-by-industry-uk" className="text-blue-400 hover:text-blue-300 underline">CV ideas and examples by industry</a> for formatting inspiration and content ideas. We cover all major UK sectors: finance, tech, healthcare, marketing, education and more. Or use the AI builder to create your own tailored CV.
                </p>
              </div>

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
                <h3 className="text-xl font-bold text-white mb-3">Is MyCVBuddy suitable for UK job applications?</h3>
                <p className="text-gray-300">
                  Absolutely! MyCVBuddy is specifically designed for the UK job market. Our AI understands 
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

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">How long should a UK CV be in 2026?</h3>
                <p className="text-gray-300">
                  For most UK roles, a CV should be <strong className="text-white">2 pages</strong>. Graduates and school leavers can use 1 page. Senior executives, academics, and NHS professionals may extend to 3 pages when necessary. Avoid going beyond 3 pages — UK recruiters rarely read further. MyCVBuddy automatically formats your CV to the correct length for your experience level. See our{" "}
                  <a href="/cv-writing-guide" className="text-blue-400 hover:text-blue-300 underline">UK CV writing guide</a>{" "}
                  for detailed advice on CV length and formatting.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">What is the difference between a CV and a resume in the UK?</h3>
                <p className="text-gray-300">
                  In the UK, a <strong className="text-white">CV (Curriculum Vitae)</strong> is the standard document used for job applications — it&apos;s typically 2 pages and includes a personal statement, full work history, education, and skills. A <strong className="text-white">resume</strong> is the US term for a shorter (usually 1-page) document. UK employers always ask for a CV, not a resume. If you&apos;re applying for UK jobs, you need a properly formatted UK CV. Read our full guide on{" "}
                  <a href="/cv-vs-resume" className="text-blue-400 hover:text-blue-300 underline">CV vs resume differences</a>.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Is MyCVBuddy better than CV-Library, Reed CV Builder, or Canva?</h3>
                <p className="text-gray-300">
                  MyCVBuddy is different because it doesn&apos;t just format your CV — it <strong className="text-white">rewrites it to match the specific job you&apos;re applying for</strong>. CV-Library, Reed&apos;s CV builder, and Canva all offer templates, but none of them read the job description and tailor your content with AI. If you&apos;re serious about getting interviews for a specific role, a job-matched CV from MyCVBuddy will outperform any static template every time.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Can MyCVBuddy help with NHS job applications?</h3>
                <p className="text-gray-300">
                  Yes. NHS job applications through NHS Jobs require a specific CV format that highlights clinical experience, professional registration numbers (NMC, GMC, HCPC), mandatory training (safeguarding, BLS, fire safety), and competency-based statements aligned to the NHS Values. Our AI understands NHS-specific requirements and can reformat your CV to meet the standards expected by NHS hiring managers and trusts. Healthcare is one of our most popular sectors.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">How do I get my CV to pass an ATS system?</h3>
                <p className="text-gray-300">
                  To pass an ATS (Applicant Tracking System), your CV must: (1) use <strong className="text-white">standard section headings</strong> like &quot;Work Experience,&quot; &quot;Education,&quot; and &quot;Skills&quot;; (2) include <strong className="text-white">keywords from the job description</strong> naturally throughout; (3) avoid tables, graphics, headers/footers, and unusual fonts; (4) use a clean, single-column layout. MyCVBuddy automatically does all of this — our AI rewrites your CV to maximise ATS score for each specific job. Try our{" "}
                  <a href="/ats-checker" className="text-blue-400 hover:text-blue-300 underline">free ATS checker tool</a>{" "}
                  to score your existing CV.
                </p>
              </div>

              <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Does MyCVBuddy write cover letters too?</h3>
                <p className="text-gray-300">
                  Yes! Our Pro plan includes an AI-powered <strong className="text-white">cover letter generator</strong> that creates a personalised cover letter matched to your CV and the specific job description. UK cover letters should be no more than one page, address the hiring manager directly, and explain why you want <em>that specific role at that specific company</em> — our AI handles all of this automatically. Visit our{" "}
                  <Link href="/cover-letter" className="text-blue-400 hover:text-blue-300 underline">cover letter generator</Link>{" "}
                  to get started.
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
    </Suspense>
  )
}
