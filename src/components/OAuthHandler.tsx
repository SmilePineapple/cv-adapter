'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export function OAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code && !isProcessing) {
      setIsProcessing(true)
      
      // Exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('OAuth error:', error)
          // Don't redirect on error - might be code already used
          // Just remove the code from URL
          router.replace('/')
        } else if (data.session) {
          // Successfully authenticated, redirect to dashboard
          // Use replace to avoid back button issues
          router.replace('/dashboard')
        } else {
          // No session created, remove code from URL
          router.replace('/')
        }
      }).catch((err) => {
        console.error('OAuth exception:', err)
        router.replace('/')
      })
    }
  }, [searchParams, router, supabase, isProcessing])

  return null // This component doesn't render anything
}
