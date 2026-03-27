import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation | My CV Buddy',
  description: 'Developer API documentation for My CV Buddy CV builder integration.',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          API Documentation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Integrate My CV Buddy's AI-powered CV builder into your application.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-700 mb-4">
            Our API is currently in development. Sign up below to be notified when it launches.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Planned Features:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• CV generation API</li>
              <li>• ATS optimization endpoint</li>
              <li>• Template customization</li>
              <li>• Webhook integrations</li>
              <li>• RESTful and GraphQL support</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
          <p className="mb-4">
            Be the first to integrate our CV builder API into your platform.
          </p>
          <a 
            href="mailto:api@mycvbuddy.com?subject=API Early Access Request"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Request Early Access
          </a>
        </div>
      </div>
    </div>
  )
}
