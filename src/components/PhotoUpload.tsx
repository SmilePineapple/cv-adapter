'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PhotoUploadProps {
  cvId: string
  currentPhotoUrl?: string | null
  onPhotoUploaded: (url: string) => void
}

export default function PhotoUpload({ cvId, currentPhotoUrl, onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentPhotoUrl)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, etc.)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      const supabase = createSupabaseClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${cvId}-${Date.now()}.${fileExt}`
      const filePath = `cv-photos/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error('Failed to upload photo')
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cv-assets')
        .getPublicUrl(filePath)

      // Update CV record
      const { error: updateError } = await supabase
        .from('cvs')
        .update({ photo_url: publicUrl })
        .eq('id', cvId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update CV record')
      }

      setPreview(publicUrl)
      onPhotoUploaded(publicUrl)
      toast.success('Photo uploaded successfully!')
      
    } catch (error: any) {
      console.error('Photo upload error:', error)
      toast.error(error.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    try {
      const supabase = createSupabaseClient()
      
      // Update CV record to remove photo
      const { error } = await supabase
        .from('cvs')
        .update({ photo_url: null })
        .eq('id', cvId)

      if (error) throw error

      setPreview(null)
      onPhotoUploaded('')
      toast.success('Photo removed')
      
    } catch (error) {
      console.error('Remove error:', error)
      toast.error('Failed to remove photo')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-blue-600" />
        Profile Photo
      </h3>
      
      <div className="flex items-center gap-6">
        {/* Photo Preview */}
        <div className="relative">
          {preview ? (
            <>
              <img 
                src={preview} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm"
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-dashed border-gray-300">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Upload Controls */}
        <div className="flex-1">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              } text-white shadow-sm hover:shadow-md
            `}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </div>
          </label>
          
          <div className="mt-3 space-y-1">
            <p className="text-sm text-gray-600">
              • Max size: 5MB
            </p>
            <p className="text-sm text-gray-600">
              • Formats: JPG, PNG, GIF
            </p>
            <p className="text-sm text-gray-600">
              • Recommended: Square image, 400x400px
            </p>
          </div>
        </div>
      </div>
      
      {preview && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Photo will appear in templates that support profile photos
          </p>
        </div>
      )}
    </div>
  )
}
