'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import PhotoUpload from '@/components/PhotoUpload'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  X
} from 'lucide-react'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress steps
      setUploadProgress(20)
      toast.info('Preparing file...')

      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(40)
      toast.info('Uploading file...')

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to upload files')
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData,
      })

      setUploadProgress(70)
      toast.info('Parsing CV content...')

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadProgress(100)
      setParseResult(result)
      toast.success('CV uploaded and parsed successfully!')
      
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload CV')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading || !!parseResult
  })

  const handleContinue = () => {
    if (parseResult?.cv_id) {
      router.push(`/generate/${parseResult.cv_id}`)
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setParseResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!parseResult ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Upload Your CV
              </h1>
              <p className="text-gray-600">
                Upload your CV in PDF or Word format to get started with AI-powered tailoring
              </p>
            </div>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Processing your CV...</p>
                    <p className="text-gray-600">This may take a few moments</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-gray-600">File ready for processing</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
                    </p>
                    <p className="text-gray-600">or click to browse files</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Supports PDF, DOC, and DOCX files up to 10MB
                  </div>
                </div>
              )}
            </div>

            {/* File Requirements */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Supported Formats</h3>
                <p className="text-sm text-gray-600">PDF, DOC, DOCX</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">File Size Limit</h3>
                <p className="text-sm text-gray-600">Maximum 10MB</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your data is encrypted</p>
              </div>
            </div>
          </div>
        ) : (
          /* Parse Results */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CV Uploaded Successfully!</h1>
                  <p className="text-gray-600">Your CV has been parsed and is ready for tailoring</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Upload different CV"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{parseResult.file_meta.name}</p>
                  <p className="text-sm text-gray-600">
                    {Math.round(parseResult.file_meta.size / 1024)} KB • 
                    {parseResult.sections.length} sections detected
                  </p>
                </div>
              </div>
            </div>

            {/* Parsing Status */}
            <div className="mb-6">
              {parseResult.parse_success ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Successfully parsed CV sections</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Partial parsing - some formatting may be lost</span>
                </div>
              )}
            </div>

            {/* Detected Sections */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {parseResult.sections.map((section: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {section.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            {parseResult?.cv_id && (
              <div className="mb-8">
                <PhotoUpload
                  cvId={parseResult.cv_id}
                  currentPhotoUrl={null}
                  onPhotoUploaded={(url) => {
                    toast.success('Photo uploaded! It will appear in your CV templates.')
                  }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContinue}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue to Job Matching
              </button>
              <button
                onClick={handleReset}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Upload Different CV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
