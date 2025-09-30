import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-gray-600">Last updated: September 30, 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-blue max-w-none">
          
          {/* Quick Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 not-prose">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Quick Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What We Collect</h3>
                <p className="text-gray-700">Email, name, CV content, usage data</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How We Use It</h3>
                <p className="text-gray-700">Provide CV tailoring service, improve platform</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Who We Share With</h3>
                <p className="text-gray-700">OpenAI (AI), Stripe (payments), Supabase (storage)</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
                <p className="text-gray-700">Access, delete, export, correct your data anytime</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <h2>1. Introduction</h2>
          <p>
            Welcome to CV Adapter. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, store, and protect your information when you use our CV tailoring service.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information</strong>: Email address, password (encrypted), name</li>
            <li><strong>CV Content</strong>: Your uploaded CV files and the text content within them</li>
            <li><strong>Job Information</strong>: Job titles, company names, job descriptions you input</li>
            <li><strong>Generated Content</strong>: AI-generated CVs and cover letters</li>
            <li><strong>Payment Information</strong>: Processed securely through Stripe (we don't store card details)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Data</strong>: Pages visited, features used, time spent on platform</li>
            <li><strong>Device Information</strong>: Browser type, operating system, IP address</li>
            <li><strong>Cookies</strong>: Session cookies for authentication and preferences</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide our CV tailoring service</li>
            <li>Generate AI-powered CVs and cover letters</li>
            <li>Maintain and improve our platform</li>
            <li>Process payments and subscriptions</li>
            <li>Communicate service updates</li>
            <li>Analyze usage to improve user experience</li>
          </ul>

          <p className="font-semibold text-gray-900">We do NOT:</p>
          <ul>
            <li>❌ Sell your personal data to third parties</li>
            <li>❌ Share your CV content with anyone except OpenAI for processing</li>
            <li>❌ Use your data for marketing without consent</li>
            <li>❌ Train AI models on your data</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          
          <h3>4.1 Security Measures</h3>
          <ul>
            <li>✅ <strong>Encryption</strong>: All data encrypted in transit (HTTPS) and at rest</li>
            <li>✅ <strong>Authentication</strong>: Secure password hashing</li>
            <li>✅ <strong>Access Control</strong>: Row Level Security on all database tables</li>
            <li>✅ <strong>API Security</strong>: Server-side API key management</li>
          </ul>

          <h3>4.2 Data Retention</h3>
          <ul>
            <li><strong>Active Accounts</strong>: Data retained while account is active</li>
            <li><strong>Inactive Accounts</strong>: Data deleted after 5 years of inactivity</li>
            <li><strong>Deleted Accounts</strong>: Data permanently deleted within 30 days</li>
            <li><strong>Backups</strong>: Backup data retained for 90 days then deleted</li>
          </ul>

          <h2>5. Third-Party Services</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="mt-0">OpenAI (AI Processing)</h3>
            <p className="mb-2"><strong>Purpose</strong>: Generate tailored CVs and cover letters</p>
            <p className="mb-2"><strong>Data Sent</strong>: CV content, job descriptions</p>
            <p className="mb-0"><strong>Privacy</strong>: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="mt-0">Stripe (Payment Processing)</h3>
            <p className="mb-2"><strong>Purpose</strong>: Process subscription payments</p>
            <p className="mb-2"><strong>Security</strong>: PCI DSS compliant</p>
            <p className="mb-0"><strong>Privacy</strong>: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></p>
          </div>

          <h2>6. Your Rights (GDPR Compliance)</h2>
          <ul>
            <li>✅ <strong>Right to Access</strong>: Request a copy of your data</li>
            <li>✅ <strong>Right to Rectification</strong>: Correct inaccurate data</li>
            <li>✅ <strong>Right to Erasure</strong>: Delete your account and data</li>
            <li>✅ <strong>Right to Portability</strong>: Export your data</li>
            <li>✅ <strong>Right to Object</strong>: Object to data processing</li>
          </ul>

          <p>
            To exercise your rights, contact us at: <strong>privacy@cvadapter.com</strong>
          </p>

          <h2>7. Cookies</h2>
          <p>We use essential cookies for:</p>
          <ul>
            <li>Authentication (keeping you logged in)</li>
            <li>Session management</li>
            <li>Security (CSRF protection)</li>
          </ul>
          <p>We do NOT use cookies for advertising or cross-site tracking.</p>

          <h2>8. Children's Privacy</h2>
          <p>
            CV Adapter is NOT intended for users under 16 years old. We do not knowingly collect data from children.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. 
            Significant changes will be notified via email.
          </p>

          <h2>10. Contact Us</h2>
          <div className="bg-blue-50 p-6 rounded-lg not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Protection Officer</h3>
            <p className="text-gray-700 mb-2">
              <strong>Email</strong>: privacy@cvadapter.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Response Time</strong>: Within 5 business days
            </p>
            <p className="text-gray-700 text-sm mt-4">
              You have the right to lodge a complaint with a supervisory authority (e.g., ICO in the UK).
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Last Updated</strong>: September 30, 2025
            </p>
            <p>
              <strong>Version</strong>: 1.0
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link 
            href="/terms"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Terms of Service
          </Link>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
