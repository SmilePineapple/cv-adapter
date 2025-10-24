import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="mt-2 text-gray-600">Last updated: September 30, 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-blue max-w-none">
          
          {/* Quick Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 not-prose">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  What You Can Do
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 list-none pl-0">
                  <li>✅ Upload and tailor CVs</li>
                  <li>✅ Create cover letters</li>
                  <li>✅ Export documents</li>
                  <li>✅ Use for job searching</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  What You Can't Do
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 list-none pl-0">
                  <li>❌ Violate copyright</li>
                  <li>❌ Abuse the Service</li>
                  <li>❌ Share your account</li>
                  <li>❌ Resell the Service</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Important Notes
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 list-none pl-0">
                  <li>⚠️ Service "as is"</li>
                  <li>⚠️ No job guarantees</li>
                  <li>⚠️ Review AI content</li>
                  <li>⚠️ 7-day refund policy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using CV Adapter, you agree to be bound by these Terms of Service. 
            If you do not agree to these Terms, do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>CV Adapter is an AI-powered platform that helps users:</p>
          <ul>
            <li>Upload and parse CV/resume documents</li>
            <li>Tailor CVs to specific job descriptions using AI</li>
            <li>Edit and customize CVs with advanced editing tools</li>
            <li>Generate professional cover letters</li>
            <li>Export documents in multiple formats (PDF, DOCX, TXT)</li>
            <li>Manage and organize career documents</li>
          </ul>

          <h2>3. Eligibility</h2>
          <p>You must be at least <strong>16 years old</strong> to use this Service.</p>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h2>4. Acceptable Use Policy</h2>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="mt-0 text-green-900">✅ Permitted Uses</h3>
            <ul className="mb-0">
              <li>Upload your own CV/resume</li>
              <li>Generate tailored versions for job applications</li>
              <li>Create cover letters</li>
              <li>Export and download your documents</li>
              <li>Use for personal job searching</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg mt-4">
            <h3 className="mt-0 text-red-900">❌ Prohibited Uses</h3>
            <ul className="mb-0">
              <li>Upload copyrighted content you don't own</li>
              <li>Upload malicious files or viruses</li>
              <li>Attempt to hack or breach security</li>
              <li>Use for spam or unsolicited communications</li>
              <li>Resell or redistribute the Service</li>
              <li>Scrape or copy our content/technology</li>
              <li>Create multiple accounts to bypass limits</li>
            </ul>
          </div>

          <h2>5. Subscription and Payments</h2>
          
          <div className="grid md:grid-cols-2 gap-4 not-prose">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Free Tier</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-none pl-0">
                <li>✓ 1 free CV generation</li>
                <li>✓ All core features</li>
                <li>✓ No credit card required</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mt-4">£0/month</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-600">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Pro Tier</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-none pl-0">
                <li>✓ Unlimited generations</li>
                <li>✓ Unlimited AI features</li>
                <li>✓ Priority support</li>
                <li>✓ Early access</li>
              </ul>
              <p className="text-2xl font-bold text-blue-900 mt-4">£5/month</p>
            </div>
          </div>

          <h3>5.1 Refund Policy</h3>
          <ul>
            <li><strong>7-Day Money-Back Guarantee</strong>: Full refund within 7 days of first payment</li>
            <li><strong>Monthly Subscriptions</strong>: No refunds for partial months</li>
            <li><strong>Cancellation</strong>: Cancel anytime, access continues until end of billing period</li>
          </ul>

          <h2>6. Intellectual Property Rights</h2>
          
          <h3>6.1 Your Content</h3>
          <ul>
            <li><strong>You Own Your Content</strong>: You retain all rights to your uploaded CVs</li>
            <li><strong>AI-Generated Content</strong>: You own the AI-generated CVs and cover letters</li>
            <li><strong>No Training</strong>: We do NOT use your content to train AI models</li>
          </ul>

          <h3>6.2 Our Content</h3>
          <ul>
            <li><strong>Platform Ownership</strong>: We own all rights to the CV Adapter platform</li>
            <li><strong>Templates</strong>: Our CV templates are proprietary</li>
            <li><strong>No Copying</strong>: You may not copy, modify, or redistribute our platform</li>
          </ul>

          <h2>7. AI-Generated Content</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
            <h3 className="mt-0 text-yellow-900">⚠️ Important Disclaimer</h3>
            <ul className="mb-0">
              <li><strong>Not Perfect</strong>: AI-generated content may contain errors or inaccuracies</li>
              <li><strong>Your Responsibility</strong>: You must review and verify all AI-generated content</li>
              <li><strong>No Guarantee</strong>: We don't guarantee job offers or interview success</li>
              <li><strong>Human Review Required</strong>: Always review AI content before using</li>
            </ul>
          </div>

          <h2>8. Limitations of Liability</h2>
          <p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.</p>
          
          <p><strong>We do NOT guarantee:</strong></p>
          <ul>
            <li>Uninterrupted or error-free service</li>
            <li>Job offers or interviews</li>
            <li>Specific results from using the Service</li>
            <li>Data will never be lost (though we take precautions)</li>
          </ul>

          <p><strong>Limitation of Damages:</strong></p>
          <ul>
            <li>We are NOT liable for indirect or consequential damages</li>
            <li>Our total liability is limited to the amount you paid in the last 12 months</li>
          </ul>

          <h2>9. Data and Privacy</h2>
          <p>
            Your use of the Service is governed by our <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>, 
            which is incorporated into these Terms.
          </p>

          <h3>Data Retention</h3>
          <ul>
            <li><strong>Active accounts</strong>: Data retained indefinitely</li>
            <li><strong>Inactive accounts</strong>: Data deleted after 5 years</li>
            <li><strong>Deleted accounts</strong>: Data removed within 30 days</li>
          </ul>

          <h2>10. Termination</h2>
          
          <h3>10.1 Termination by You</h3>
          <p>You may delete your account at any time through Settings. All data will be permanently deleted within 30 days.</p>

          <h3>10.2 Termination by Us</h3>
          <p>We may terminate your account if you violate these Terms, engage in fraudulent activity, or abuse the Service.</p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Significant changes will be notified via email. 
            Continued use after changes constitutes acceptance.
          </p>

          <h2>12. Contact Information</h2>
          <div className="bg-blue-50 p-6 rounded-lg not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions or Support</h3>
            <p className="text-gray-700 mb-2">
              <strong>Email</strong>: support@cvadapter.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Response Time</strong>: Within 5 business days
            </p>
            <p className="text-gray-700 text-sm mt-4">
              For refund requests, email: support@cvadapter.com
            </p>
          </div>

          <h2>13. Acknowledgment</h2>
          <p>By using CV Adapter, you acknowledge that:</p>
          <ul>
            <li>✅ You have read and understood these Terms</li>
            <li>✅ You agree to be bound by these Terms</li>
            <li>✅ You are at least 16 years old</li>
            <li>✅ You have the authority to enter into this agreement</li>
          </ul>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Last Updated</strong>: September 30, 2025
            </p>
            <p className="mb-2">
              <strong>Version</strong>: 1.0
            </p>
            <p>
              <strong>Effective</strong>: Immediately upon posting
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link 
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            Privacy Policy
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
