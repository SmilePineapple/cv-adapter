'use client'

import { useState } from 'react'
import UpgradeModal from '@/components/UpgradeModal'

export default function TestModalPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [trigger, setTrigger] = useState<'limit_reached' | 'first_generation' | 'dashboard' | 'manual'>('manual')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upgrade Modal Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Different Triggers</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setTrigger('limit_reached')
                setIsOpen(true)
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Test: Limit Reached
            </button>
            
            <button
              onClick={() => {
                setTrigger('first_generation')
                setIsOpen(true)
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Test: First Generation
            </button>
            
            <button
              onClick={() => {
                setTrigger('dashboard')
                setIsOpen(true)
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test: Dashboard
            </button>
            
            <button
              onClick={() => {
                setTrigger('manual')
                setIsOpen(true)
              }}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test: Manual
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">What to Check</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Modal displays correctly</li>
            <li>✅ Pricing shows £2.99/month</li>
            <li>✅ Annual plan shows £29.99/year</li>
            <li>✅ Unlimited generations (∞ symbol)</li>
            <li>✅ Comparison table shows correct features</li>
            <li>✅ Different messaging for each trigger</li>
            <li>✅ Close button works</li>
            <li>✅ Upgrade button redirects to /subscription</li>
            <li>✅ Mobile responsive</li>
          </ul>
        </div>
      </div>

      <UpgradeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trigger={trigger}
        currentUsage={1}
        maxGenerations={1}
      />
    </div>
  )
}
