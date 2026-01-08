'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft, Download, Copy, Check, Mail, Briefcase, User, Clock } from 'lucide-react'

interface CoverLetterData {
  id: string
  content: string
  job_title: string
  company_name: string
  hiring_manager_name?: string
  tone: string
  length: string
  created_at: string
}

export default function ViewCoverLetterPage() {
  const router = useRouter()
  const params = useParams()
  const coverLetterId = params.id as string
  const supabase = createSupabaseClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchCoverLetter()
  }, [coverLetterId])

  const fetchCoverLetter = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', coverLetterId)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        toast.error('Cover letter not found')
        router.push('/dashboard')
        return
      }

      setCoverLetter(data)
    } catch (error) {
      console.error('Error fetching cover letter:', error)
      toast.error('Failed to load cover letter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter.content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = (format: string) => {
    window.open(`/api/cover-letter/${coverLetterId}/export?format=${format}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!coverLetter) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CV Adapter</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Letter Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {coverLetter.job_title} at {coverLetter.company_name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(coverLetter.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {coverLetter.tone}
                </div>
                {coverLetter.hiring_manager_name && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {coverLetter.hiring_manager_name}
                  </div>
                )}
              </div>
            </div>
            
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </button>
            
            <button
              onClick={() => handleDownload('docx')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Word
            </button>
            
            <button
              onClick={() => handleDownload('pdf')}
              className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            
            <button
              onClick={() => handleDownload('txt')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Text
            </button>
          </div>
        </div>

        {/* Cover Letter Content */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {coverLetter.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
