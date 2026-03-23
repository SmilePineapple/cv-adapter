'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import PhotoUpload from '@/components/PhotoUpload'
import UploadProgressStepper from '@/components/UploadProgressStepper'
import ExampleCVs from '@/components/ExampleCVs'
import CVVerification from '@/components/CVVerification'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showVerification, setShowVerification] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('[UPLOAD] onDrop called with files:', acceptedFiles)
    const file = acceptedFiles[0]
    if (!file) {
      console.log('[UPLOAD] No file selected')
      return
    }

    console.log('[UPLOAD] File selected:', file.name, file.type, file.size)
    setUploadedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get session first
      console.log('[UPLOAD] Getting session...')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('[UPLOAD] No session found')
        throw new Error('Please log in to upload files')
      }
      console.log('[UPLOAD] Session found, user ID:', session.user.id)

      // Upload file to Supabase Storage first
      setUploadProgress(30)
      toast.info('Uploading file to storage...')

      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
      const filePath = `cv-uploads/${fileName}`

      console.log('[UPLOAD] Uploading to Supabase Storage:', filePath)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('[UPLOAD] Storage upload error:', uploadError)
        throw new Error('Failed to upload file: ' + uploadError.message)
      }

      console.log('[UPLOAD] File uploaded to storage:', uploadData.path)
      setUploadProgress(60)
      toast.info('Processing CV...')

      // Now call API with storage path
      console.log('[UPLOAD] Sending request to /api/upload...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storagePath: uploadData.path,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }),
      })

      setUploadProgress(85)
      toast.info('Parsing CV content...')

      console.log('[UPLOAD] Response status:', response.status)
      
      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Upload failed' }))
        console.log('[UPLOAD] Error result:', result)
        throw new Error(result.error || 'Upload failed')
      }
      
      const result = await response.json()
      console.log('[UPLOAD] Response result:', result)

      setUploadProgress(100)
      setParseResult(result)
      setShowVerification(true)
      toast.success('CV uploaded and parsed successfully!')
      
    } catch (error: any) {
      console.error('[UPLOAD] Upload error:', error)
      console.error('[UPLOAD] Error stack:', error.stack)
      toast.error(error.message || 'Failed to upload CV')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }, [supabase])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[UPLOAD] File input change event triggered')
    const files = e.target.files
    if (!files || files.length === 0) {
      console.log('[UPLOAD] No files in input')
      return
    }
    console.log('[UPLOAD] Files from input:', files)
    await onDrop(Array.from(files))
  }, [onDrop])

  const onDropRejected = useCallback((fileRejections: any[]) => {
    console.log('[UPLOAD] Files rejected:', fileRejections)
    fileRejections.forEach((rejection) => {
      const { file, errors } = rejection
      console.log('[UPLOAD] Rejected file:', file.name, 'Errors:', errors)
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        } else if (error.code === 'file-invalid-type') {
          toast.error(`File ${file.name} is not a valid type. Please upload PDF, DOC, or DOCX.`)
        } else {
          toast.error(`Error with ${file.name}: ${error.message}`)
        }
      })
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading || !!parseResult,
    noClick: false,
    noKeyboard: false,
    multiple: false
  })

  const handleContinue = () => {
    if (parseResult?.cv_id) {
      router.push(`/generate/${parseResult.cv_id}`)
    }
  }

  const handleVerificationConfirm = () => {
    setShowVerification(false)
    handleContinue()
  }

  const handleVerificationEdit = async (editedSections: any[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in')
      }

      // Update CV sections in database
      const { error } = await supabase
        .from('cvs')
        .update({ sections: editedSections })
        .eq('id', parseResult.cv_id)

      if (error) throw error

      toast.success('CV sections updated successfully!')
      setParseResult({ ...parseResult, sections: editedSections })
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.message || 'Failed to update CV')
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setParseResult(null)
    setShowVerification(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-400 hover:text-white transition-colors touch-manipulation min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CV Adapter</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Progress Stepper */}
        <UploadProgressStepper currentStep={1} />
        
        {showVerification && parseResult ? (
          <CVVerification
            sections={parseResult.sections || []}
            fileName={parseResult.file_meta?.name || uploadedFile?.name || 'CV'}
            onConfirm={handleVerificationConfirm}
            onEdit={handleVerificationEdit}
          />
        ) : !parseResult ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Upload Your CV
              </h1>
              <p className="text-sm sm:text-base text-white">
                Upload your CV in PDF or Word format to get started with AI-powered tailoring
              </p>
            </div>

            {/* Upload Area - Mobile Optimized */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300
                min-h-[200px] sm:min-h-[280px] flex items-center justify-center
                touch-manipulation
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-lg' 
                  : 'border-white/20 hover:border-blue-400 hover:bg-white/5 hover:shadow-md'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input 
                {...getInputProps()} 
                onChange={handleFileChange}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="text-lg font-medium text-white">Processing your CV...</p>
                    <p className="text-white">This may take a few moments</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-400 mx-auto animate-bounce" />
                  <div>
                    <p className="text-base sm:text-lg font-medium text-white break-all px-4">{uploadedFile.name}</p>
                    <p className="text-sm sm:text-base text-white mt-2">File ready for processing</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <Upload className="w-14 h-14 sm:w-16 sm:h-16 text-blue-500 mx-auto" />
                    {isDragActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-500 border-dashed rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-white mb-2">
                      {isDragActive ? '📄 Drop your CV here!' : '📤 Drag & drop your CV here'}
                    </p>
                    <p className="text-sm sm:text-base text-white mb-4">or tap to browse files</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-xs sm:text-sm text-blue-400 font-medium">
                        PDF, DOC, DOCX • Max 10MB
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* What Happens Next */}
            <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4 text-center">
                ✨ What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">We Parse Your CV</p>
                    <p className="text-xs text-white mt-1">Extract all sections automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">Add Job Details</p>
                    <p className="text-xs text-white mt-1">Paste the job description</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">Get Tailored CV</p>
                    <p className="text-xs text-white mt-1">Download in 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example CVs */}
            <ExampleCVs />

            {/* File Requirements */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-black text-white mb-1">Supported Formats</h3>
                <p className="text-sm text-white">PDF, DOC, DOCX</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-black text-white mb-1">File Size Limit</h3>
                <p className="text-sm text-white">Maximum 10MB</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-black text-white mb-1">Secure & Private</h3>
                <p className="text-sm text-white">Your data is encrypted</p>
              </div>
            </div>
          </div>
        ) : (
          /* Parse Results */
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h1 className="text-3xl font-black text-white">CV Uploaded Successfully!</h1>
                  <p className="text-white">Your CV has been parsed and is ready for tailoring</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-white"
                title="Upload different CV"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Info */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-bold text-white">{parseResult.file_meta.name}</p>
                  <p className="text-sm text-white">
                    {Math.round(parseResult.file_meta.size / 1024)} KB • 
                    {parseResult.sections.length} sections detected
                  </p>
                </div>
              </div>
            </div>

            {/* Parsing Status */}
            <div className="mb-6">
              {parseResult.parse_success ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Successfully parsed CV sections</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Partial parsing - some formatting may be lost</span>
                </div>
              )}
            </div>

            {/* Detected Sections */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-white mb-4">Detected Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {parseResult.sections.map((section: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white capitalize">
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
                className="flex-1 bg-white text-black py-3 px-6 rounded-full font-black hover:bg-gray-100 transition-colors"
              >
                Continue to Job Matching
              </button>
              <button
                onClick={handleReset}
                className="flex-1 border border-white/20 text-white py-3 px-6 rounded-full font-black hover:bg-white/5 transition-colors"
              >
                Upload Different CV
              </button>
            </div>

            {/* Helpful Resources */}
            <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h3 className="font-black text-white mb-3">📚 Helpful Resources</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href="/cv-writing-guide" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  → CV Writing Guide 2026
                </Link>
                <Link href="/ats-optimization-guide" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  → ATS Optimization Guide
                </Link>
                <Link href="/cv-examples" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  → CV Examples by Industry
                </Link>
                <Link href="/interview-prep" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  → Interview Preparation Guide
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
