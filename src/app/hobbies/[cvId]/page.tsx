'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'
import HobbyIconSelector from '@/components/HobbyIconSelector'

export default function HobbySelectionPage() {
  const params = useParams()
  const cvId = params.cvId as string
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [hobbiesSection, setHobbiesSection] = useState<any>(null)
  const [selectedHobbies, setSelectedHobbies] = useState<{ name: string; icon: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get return URL from query params
    const urlParams = new URLSearchParams(window.location.search)
    const returnTo = urlParams.get('returnTo')
    setReturnUrl(returnTo)
    
    fetchHobbiesSection()
  }, [cvId])

  const fetchHobbiesSection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch hobbies section (stored as 'interests' in database)
      const { data: section, error } = await supabase
        .from('cv_sections')
        .select('*')
        .eq('cv_id', cvId)
        .eq('section_type', 'interests')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching hobbies:', error)
        toast.error('Failed to load hobbies section')
        return
      }

      if (section) {
        setHobbiesSection(section)
        
        // Check if content is already custom hobbies (array of {name, icon})
        if (Array.isArray(section.content) && section.content.length > 0 && section.content[0].icon) {
          setSelectedHobbies(section.content)
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (selectedHobbies.length === 0) {
      toast.error('Please select at least one hobby')
      return
    }

    setIsSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Prepare hobby icons data
      const hobbyIconsData = selectedHobbies.map((hobby: any) => ({
        name: hobby.name,
        icon: hobby.icon
      }))

      if (hobbiesSection) {
        // Update existing section
        const { error } = await supabase
          .from('cv_sections')
          .update({
            content: selectedHobbies,
            hobby_icons: hobbyIconsData,
            updated_at: new Date().toISOString()
          })
          .eq('id', hobbiesSection.id)

        if (error) throw error
      } else {
        // Create new section
        const { error } = await supabase
          .from('cv_sections')
          .insert({
            cv_id: cvId,
            section_type: 'interests',
            title: 'Hobbies & Interests',
            content: selectedHobbies,
            hobby_icons: hobbyIconsData,
            order_index: 999
          })

        if (error) throw error
      }

      toast.success('Hobbies saved successfully!')
      
      // Redirect back to where the user came from, or default to edit page
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push(`/edit/${cvId}`)
      }
    } catch (error) {
      console.error('Error saving hobbies:', error)
      toast.error('Failed to save hobbies')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hobbies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={returnUrl || `/edit/${cvId}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {returnUrl ? 'Back to Download' : 'Back to Editor'}
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Select Your Hobbies</h1>
          </div>
          <p className="text-gray-600">
            Choose hobby icons that will appear on your CV with our advanced templates
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-8 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-2">✨ Advanced Template Feature</h3>
          <p className="text-purple-800 text-sm">
            When you export your CV using the <strong>Creative Modern</strong> or <strong>Professional Columns</strong> templates,
            these hobby icons will be displayed beautifully with visual icons. Regular templates will show them as text.
          </p>
        </div>

        {/* Hobby Selector */}
        <HobbyIconSelector
          initialHobbies={selectedHobbies}
          onSelect={setSelectedHobbies}
        />

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || selectedHobbies.length === 0}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Hobbies ({selectedHobbies.length})
              </>
            )}
          </button>

          <Link
            href={returnUrl || `/edit/${cvId}`}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>

        {/* Preview */}
        {selectedHobbies.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Preview on CV</h3>
            <div className="flex flex-wrap gap-4">
              {selectedHobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                >
                  <span className="text-4xl">{hobby.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{hobby.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
