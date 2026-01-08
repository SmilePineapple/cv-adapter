'use client'

import { useState } from 'react'
import { Briefcase, Loader2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface JobScraperProps {
  onJobScraped: (jobData: any) => void
}

export default function JobScraper({ onJobScraped }: JobScraperProps) {
  const [jobUrl, setJobUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scrapedJob, setScrapedJob] = useState<any>(null)
  const supabase = createSupabaseClient()

  const handleScrape = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a job URL')
      return
    }

    // Basic URL validation
    if (!jobUrl.startsWith('http')) {
      toast.error('Please enter a valid URL (starting with http:// or https://)')
      return
    }

    setIsScraping(true)
    setScrapedJob(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to scrape job postings')
        return
      }

      const response = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUrl,
          userId: user.id
        })
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
        } else if (data.fallbackMode) {
          toast.error(data.error, {
            duration: 7000,
            description: data.suggestion
          })
        } else {
          toast.error(data.error || 'Failed to scrape job posting')
        }
        return
      }

      setScrapedJob(data.jobData)
      onJobScraped(data.jobData)
      toast.success('Job details extracted successfully!')

    } catch (error: any) {
      console.error('Job scrape error:', error)
      toast.error('Failed to scrape job posting')
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Auto-fill from Job Posting</h3>
          <p className="text-sm text-gray-600">Paste a job URL to extract details</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Posting URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://www.indeed.co.uk/viewjob?jk=..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isScraping}
            />
            <button
              onClick={handleScrape}
              disabled={isScraping || !jobUrl.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Extract
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supports Indeed, LinkedIn Jobs, Reed, Glassdoor, and more
          </p>
        </div>

        {/* Scraped Job Preview */}
        {scrapedJob && (
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{scrapedJob.job_title}</h4>
                <p className="text-sm text-gray-600">{scrapedJob.company}</p>
                {scrapedJob.location && (
                  <p className="text-xs text-gray-500">{scrapedJob.location}</p>
                )}
              </div>
            </div>
            
            {scrapedJob.job_type && (
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {scrapedJob.job_type}
                </span>
                {scrapedJob.remote && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {scrapedJob.remote}
                  </span>
                )}
                {scrapedJob.salary && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {scrapedJob.salary}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-green-600 font-medium">
              ✓ Details auto-filled below
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-100 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800">
            <strong>Free users:</strong> 3 job scrapes. <strong>Pro users:</strong> Unlimited scrapes.
          </p>
        </div>
      </div>
    </div>
  )
}
