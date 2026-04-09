'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
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
  Sparkles,
  ScanLine,
  FileWarning,
  Loader2,
  Clock
} from 'lucide-react'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStep, setUploadStep] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [uploadError, setUploadError] = useState<{ message: string; details?: string } | null>(null)
  const [isTakingLong, setIsTakingLong] = useState(false)
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
    setUploadStep('📄 Preparing file upload...')
    setUploadError(null)

    // Progress animation intervals
    let progressInterval: NodeJS.Timeout | null = null
    let messageInterval: NodeJS.Timeout | null = null

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
      setUploadProgress(10)
      setUploadStep('☁️ Uploading file to cloud storage...')
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
      setUploadProgress(40)
      setUploadStep('🔍 Processing document...')

      // Start progress animation for API processing phase
      const progressMessages = [
        '🔍 Processing document...',
        '🤖 AI is extracting text...',
        '📊 Analyzing CV structure...',
        '📝 Parsing sections...',
        '✨ Optimizing content...',
        '💾 Saving to database...'
      ]

      let messageIndex = 0
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 85) {
            return prev + 1.5 // Increment by 1.5% every interval
          }
          return prev
        })
      }, 400) // Update every 400ms

      messageInterval = setInterval(() => {
        setUploadStep(progressMessages[messageIndex % progressMessages.length])
        messageIndex++
      }, 2500) // Change message every 2.5 seconds

      // Now call API with storage path
      console.log('[UPLOAD] Sending request to /api/upload...')
      
      // Set up timeout warning (15 seconds)
      const timeoutWarning = setTimeout(() => {
        setIsTakingLong(true)
        setUploadStep('⏳ Still working... AI is carefully analyzing your CV (this may take 20-30 seconds)')
      }, 15000)
      
      const responsePromise = fetch('/api/upload', {
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

      // Wait for API response
      const response = await responsePromise

      // Clear intervals and timeout
      if (progressInterval) clearInterval(progressInterval)
      if (messageInterval) clearInterval(messageInterval)
      clearTimeout(timeoutWarning)
      setIsTakingLong(false)

      console.log('[UPLOAD] Response status:', response.status)
      
      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Upload failed' }))
        console.log('[UPLOAD] Error result:', result)
        setUploadError({
          message: result.error || 'Upload failed',
          details: result.details
        })
        throw new Error(result.error || 'Upload failed')
      }
      
      const result = await response.json()
      console.log('[UPLOAD] Response result:', result)

      setUploadProgress(95)
      setUploadStep('✨ Finalizing...')
      
      await new Promise(resolve => setTimeout(resolve, 300))

      setUploadProgress(100)
      setUploadStep('Complete!')
      setParseResult(result)
      setShowVerification(true)
      toast.success('CV uploaded and parsed successfully!')
      
      // Auto-redirect to generate page with the new CV after 2 seconds
      setTimeout(() => {
        if (result.cv_id) {
          router.push(`/generate/${result.cv_id}`)
        } else {
          router.push('/dashboard')
        }
      }, 2000)
    } catch (error: any) {
      console.error('[UPLOAD] Upload error:', error)
      console.error('[UPLOAD] Error stack:', error.stack)
      toast.error(error.message || 'Failed to upload CV')
      // Clear intervals on error
      if (progressInterval) clearInterval(progressInterval)
      if (messageInterval) clearInterval(messageInterval)
      setIsTakingLong(false)
      // Don't clear uploadedFile on error so user can see what failed
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
    setUploadError(null)
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
              {...(getRootProps() as React.HTMLAttributes<HTMLDivElement>)}
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
              <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
              
              {isUploading ? (
                <div className="space-y-6">
                  {/* Enhanced Loading Animation */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
                    </div>
                    
                    {/* Step Message */}
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-white animate-pulse">
                        {uploadStep}
                      </p>
                      <p className="text-sm text-white/60">This may take 30-60 seconds</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="w-full max-w-md mx-auto space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white/80">Processing CV</span>
                      <span className="text-blue-400">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    
                    {/* Step indicators */}
                    <div className="flex justify-center space-x-2 pt-2">
                      {['Upload', 'Process', 'Parse', 'Save'].map((step, index) => {
                        const stepProgress = (index + 1) * 25
                        const isActive = uploadProgress >= stepProgress - 25
                        const isComplete = uploadProgress >= stepProgress
                        return (
                          <div key={step} className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isComplete ? 'bg-green-400 w-4' : isActive ? 'bg-blue-400 animate-pulse' : 'bg-white/20'
                            }`} />
                            <span className={`text-xs transition-colors duration-300 ${
                              isActive ? 'text-white/80' : 'text-white/40'
                            }`}>
                              {step}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Long processing warning */}
                    {isTakingLong && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <p className="text-sm text-yellow-400 flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          Processing is taking longer than usual. Please don't close this page.
                        </p>
                      </div>
                    )}
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

            {/* Upload Error Display */}
            {uploadError && (
              <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileWarning className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white mb-2">Unable to Process This File</h3>
                    <p className="text-white/80 mb-4">{uploadError.message}</p>
                    {uploadError.details && (
                      <p className="text-sm text-white/60 mb-4">{uploadError.details}</p>
                    )}
                    
                    {/* Scanned PDF Help Section */}
                    {uploadError.message.toLowerCase().includes('scanned') && (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-2 mb-3">
                          <ScanLine className="w-5 h-5 text-amber-400" />
                          <h4 className="font-bold text-white">How to Fix This</h4>
                        </div>
                        <p className="text-sm text-white/70 mb-3">
                          This appears to be a scanned document (image-based PDF). Here are your options:
                        </p>
                        <ul className="space-y-2 text-sm text-white/70">
                          <li className="flex items-start space-x-2">
                            <span className="text-green-400 mt-0.5">1.</span>
                            <span><strong>Upload the original file</strong> - If you have the original Word document or text-based PDF, use that instead.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-400 mt-0.5">2.</span>
                            <span><strong>Use OCR software</strong> - Convert your scanned PDF using free tools like:</span>
                          </li>
                        </ul>
                        <div className="mt-3 ml-6 flex flex-wrap gap-2">
                          <a 
                            href="https://www.adobe.com/acrobat/online/ocr.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                          >
                            Adobe OCR (Free)
                          </a>
                          <a 
                            href="https://smallpdf.com/ocr-pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                          >
                            Smallpdf OCR
                          </a>
                          <a 
                            href="https://docs.google.com/document/create" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                          >
                            Google Docs (Open PDF → Download as DOCX)
                          </a>
                        </div>
                        <p className="mt-3 text-xs text-white/50">
                          After converting, upload the new file here.
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={handleReset}
                      className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Try a Different File</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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
