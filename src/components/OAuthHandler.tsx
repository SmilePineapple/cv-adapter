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
    // Check for OAuth hash fragments (Supabase implicit flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    // Check for OAuth code (PKCE flow)
    const code = searchParams.get('code')
    
    if ((accessToken || code) && !isProcessing) {
      setIsProcessing(true)
      
      if (accessToken && refreshToken) {
        // Implicit flow - set session directly
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }).then(({ data, error }) => {
          if (error) {
            console.error('OAuth session error:', error)
            router.replace('/auth/login')
          } else if (data.session) {
            router.replace('/dashboard')
          }
        })
      } else if (code) {
        // PKCE flow - exchange code for session
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (error) {
            console.error('OAuth error:', error)
            // Check if user is already logged in
            supabase.auth.getSession().then(({ data: sessionData }) => {
              if (sessionData.session) {
                router.replace('/dashboard')
              } else {
                router.replace('/auth/login')
              }
            })
          } else if (data.session) {
            router.replace('/dashboard')
          } else {
            router.replace('/auth/login')
          }
        }).catch((err) => {
          console.error('OAuth exception:', err)
          router.replace('/auth/login')
        })
      }
    }
  }, [searchParams, router, supabase, isProcessing])

  return null // This component doesn't render anything
}
