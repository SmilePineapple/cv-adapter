import Link from 'next/link'
import { ArrowLeft, HelpCircle, Search, Book, MessageCircle, Mail } from 'lucide-react'

export default function HelpCenterPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top right corner, enter your email and password, and verify your email address. You can also sign up with Google or LinkedIn for faster access.'
        },
        {
          q: 'Is CV Adapter free to use?',
          a: 'Yes! We offer 2 free CV generations to try the service. For 100 more generations, upgrade to Pro for £5 one-time payment.'
        },
        {
          q: 'What file formats can I upload?',
          a: 'We support PDF (.pdf) and Word documents (.doc, .docx). Maximum file size is 10MB.'
        }
      ]
    },
    {
      category: 'Using CV Adapter',
      questions: [
        {
          q: 'How does the AI tailoring work?',
          a: 'Upload your CV, paste the job description, and our AI analyzes both to create a tailored version. It matches keywords, highlights relevant experience, and optimizes for ATS systems.'
        },
        {
          q: 'Can I edit the generated CV?',
          a: 'Absolutely! Use our advanced CV editor to make any changes. You can edit text, reorder sections, change formatting, and even use AI to populate individual sections.'
        },
        {
          q: 'How do I export my CV?',
          a: 'After editing, click the "Download" button and choose your preferred format (PDF, DOCX, or TXT) and template. Your CV will download immediately.'
        },
        {
          q: 'What is an ATS score?',
          a: 'ATS (Applicant Tracking System) score shows how well your CV will perform with automated screening software. We analyze keyword matching, formatting, and structure to give you a score out of 100.'
        }
      ]
    },
    {
      category: 'Cover Letters',
      questions: [
        {
          q: 'How do I create a cover letter?',
          a: 'Go to Dashboard → Create Cover Letter. Select a CV, enter job details, choose your tone and length, then click "Generate". Our AI will create a personalized cover letter based on your CV and the job requirements.'
        },
        {
          q: 'Can I customize the cover letter?',
          a: 'Yes! After generation, you can edit the content directly in the editor before exporting.'
        }
      ]
    },
    {
      category: 'Subscription & Billing',
      questions: [
        {
          q: "What's included in the Pro plan?",
          a: 'Pro includes unlimited CV generations, unlimited AI features, priority support, and early access to new features for £5/month.'
        },
        {
          q: 'Can I cancel anytime?',
          a: "Yes! Cancel anytime from your subscription page. You'll retain access until the end of your billing period."
        },
        {
          q: 'Do you offer refunds?',
          a: 'We offer a 7-day money-back guarantee on your first payment. Contact support@cvadapter.com for refund requests.'
        },
        {
          q: 'How do I upgrade to Pro?',
          a: 'Go to Dashboard → Upgrade Plan, or visit the Subscription page. Payment is processed securely through Stripe.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'My CV upload failed. What should I do?',
          a: "Ensure your file is under 10MB and in PDF or DOCX format. Try converting to PDF if you're having issues with Word documents. Clear your browser cache and try again."
        },
        {
          q: 'The AI generation is taking too long',
          a: "AI generation typically takes 10-30 seconds. If it's taking longer, refresh the page and try again. Check your internet connection."
        },
        {
          q: "I can't log in",
          a: 'Use the "Forgot Password" link to reset your password. If you signed up with Google/LinkedIn, use that method to log in. Contact support if issues persist.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          q: 'Is my data secure?',
          a: 'Yes! We use industry-standard encryption, secure authentication, and follow GDPR guidelines. Your data is encrypted in transit and at rest.'
        },
        {
          q: 'Who can see my CV?',
          a: "Only you can see your CV. We don't share your data with anyone except OpenAI for AI processing (they don't store it permanently)."
        },
        {
          q: 'How do I delete my account?',
          a: 'Go to Settings → Delete Account. All your data will be permanently deleted within 30 days.'
        },
        {
          q: 'Do you sell my data?',
          a: 'Never. We do not sell, rent, or share your personal data with third parties for marketing purposes.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="mt-2 text-gray-600">Find answers to common questions and get support</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Try: "How to upload CV", "Export formats", "Pricing"
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/blog" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <Book className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">CV Writing Tips</h3>
            <p className="text-sm text-gray-600">Learn best practices for creating winning CVs</p>
          </Link>
          <Link href="/api-docs" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <Book className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">API Documentation</h3>
            <p className="text-sm text-gray-600">Integrate CV Adapter into your applications</p>
          </Link>
          <Link href="/contact" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our support team</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          {faqs.map((category, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-6">
                {category.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-start">
                      <HelpCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-8">
          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-gray-700 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="/contact"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Contact Support
                </Link>
                <a 
                  href="mailto:support@cvadapter.com"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition border border-blue-600"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
