'use client'

import { useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

/**
 * OAuthMetadataHandler Component
 * Applies stored metadata to user profile after OAuth signup
 * Should be added to the dashboard page
 */
export function OAuthMetadataHandler() {
  useEffect(() => {
    const applyOAuthMetadata = async () => {
      try {
        // Check if there's stored metadata from OAuth signup
        let storedMetadata: string | null = null
        try {
          storedMetadata = localStorage.getItem('cv_adapter_signup_metadata')
        } catch (storageError) {
          console.warn('[OAuthMetadataHandler] localStorage unavailable:', storageError)
          return
        }
        
        if (!storedMetadata) return
        
        const metadata = JSON.parse(storedMetadata)
        const supabase = createSupabaseClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return
        
        // Check if metadata has already been applied
        if (user.user_metadata?.country) {
          // Metadata already exists, clear localStorage
          try {
            localStorage.removeItem('cv_adapter_signup_metadata')
          } catch (storageError) {
            console.warn('[OAuthMetadataHandler] Failed to clear localStorage:', storageError)
          }
          return
        }
        
        // Update user metadata
        const { error } = await supabase.auth.updateUser({
          data: metadata
        })
        
        if (error) {
          console.error('Failed to update user metadata:', error)
        } else {
          // Clear stored metadata after successful update
          try {
            localStorage.removeItem('cv_adapter_signup_metadata')
          } catch (storageError) {
            console.warn('[OAuthMetadataHandler] Failed to clear localStorage:', storageError)
          }
          console.log('User metadata updated successfully')
        }
      } catch (error) {
        console.error('Error applying OAuth metadata:', error)
      }
    }
    
    // Run after a short delay to ensure user session is established
    const timer = setTimeout(applyOAuthMetadata, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
}
