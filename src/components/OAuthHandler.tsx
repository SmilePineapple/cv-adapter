'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export function OAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // Exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('OAuth error:', error)
          router.push('/auth/login')
        } else if (data.session) {
          // Successfully authenticated, redirect to dashboard
          router.push('/dashboard')
        }
      })
    }
  }, [searchParams, router, supabase])

  return null // This component doesn't render anything
}
