'use client'

import { useState } from 'react'
import { X, Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface LinkedInImportProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (cvId: string) => void
}

export default function LinkedInImport({ isOpen, onClose, onSuccess }: LinkedInImportProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importMethod, setImportMethod] = useState<'url' | 'text'>('url')
  const [linkedinText, setLinkedinText] = useState('')
  const supabase = createSupabaseClient()

  if (!isOpen) return null

  const handleImport = async () => {
    // Validate input based on method
    if (importMethod === 'url') {
      if (!linkedinUrl.trim()) {
        toast.error('Please enter your LinkedIn profile URL')
        return
      }
      if (!linkedinUrl.includes('linkedin.com/in/')) {
        toast.error('Please enter a valid LinkedIn profile URL')
        return
      }
    } else {
      if (!linkedinText.trim()) {
        toast.error('Please paste your LinkedIn profile text')
        return
      }
    }

    setIsImporting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to import from LinkedIn')
        return
      }

      // Choose API endpoint based on method
      const endpoint = importMethod === 'url' ? '/api/linkedin/scrape' : '/api/linkedin/parse'
      const body = importMethod === 'url' 
        ? { linkedinUrl, userId: user.id }
        : { linkedinText, userId: user.id }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresUpgrade) {
          toast.error(data.error, {
            duration: 5000,
            action: {
              label: 'Upgrade',
              onClick: () => window.location.href = '/subscription'
            }
          })
        } else {
          toast.error(data.error || 'Failed to import LinkedIn profile')
        }
        return
      }

      toast.success('LinkedIn profile imported successfully!')
      onSuccess(data.cvId)
      onClose()
      setLinkedinText('')

    } catch (error: any) {
      console.error('LinkedIn import error:', error)
      toast.error('Failed to import LinkedIn profile')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Import from LinkedIn</h2>
                <p className="text-blue-100 text-sm">Paste your LinkedIn profile text</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              How to get your LinkedIn profile text:
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 ml-7 list-decimal">
              <li>Go to your LinkedIn profile</li>
              <li>Click "More" → "Save to PDF"</li>
              <li>Open the PDF and copy all text</li>
              <li>Paste it in the box below</li>
            </ol>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile Text
            </label>
            <textarea
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              placeholder="Paste your LinkedIn profile text here...

Example:
John Smith
Senior Software Engineer at Tech Company
London, United Kingdom

About
Experienced software engineer with 5+ years...

Experience
Senior Software Engineer
Tech Company
Jan 2020 - Present
• Led development of...
• Improved performance by..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              disabled={isImporting}
            />
            <p className="text-xs text-gray-500 mt-2">
              {linkedinText.length} characters
            </p>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What we'll extract:</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Personal info</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Work experience</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Education</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Skills</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Certifications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Summary</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              disabled={isImporting}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting || !linkedinText.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Linkedin className="w-5 h-5" />
                  Import from LinkedIn
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
