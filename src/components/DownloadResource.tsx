import { Download, FileText, CheckSquare } from 'lucide-react'
import Link from 'next/link'

interface DownloadResourceProps {
  title?: string
  description?: string
}

export function DownloadResource({ 
  title = "Free Downloadable Resources",
  description = "Get our professional CV templates and checklists to help you create a winning CV"
}: DownloadResourceProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Download className="w-6 h-6 text-emerald-600 mr-2" />
        {title}
      </h3>
      <p className="text-gray-700 mb-6">{description}</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <a
          href="/downloads/professional-cv-template.md"
          download="Professional_CV_Template_UK.md"
          className="bg-white border-2 border-emerald-500 rounded-lg p-4 hover:shadow-lg transition group"
        >
          <div className="flex items-start">
            <div className="bg-emerald-100 rounded-lg p-3 mr-4">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition">
                Professional CV Template
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Complete UK CV template with examples and instructions
              </p>
              <div className="flex items-center text-emerald-600 text-sm font-semibold">
                <Download className="w-4 h-4 mr-1" />
                Download Free
              </div>
            </div>
          </div>
        </a>

        <a
          href="/downloads/cv-writing-checklist.md"
          download="CV_Writing_Checklist.md"
          className="bg-white border-2 border-blue-500 rounded-lg p-4 hover:shadow-lg transition group"
        >
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                CV Writing Checklist
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                100+ point checklist to ensure your CV is perfect
              </p>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <Download className="w-4 h-4 mr-1" />
                Download Free
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-emerald-200">
        <p className="text-gray-700 text-sm mb-3">
          <strong>Want an AI-generated CV instead?</strong> Upload your CV and get a professional, tailored version in 2 minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth/signup"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-sm inline-flex items-center"
          >
            Try Free (1 Generation)
          </Link>
          <Link
            href="/upload"
            className="bg-white border-2 border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition text-sm inline-flex items-center"
          >
            Upload Your CV
          </Link>
        </div>
      </div>
    </div>
  )
}
