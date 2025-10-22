'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

/**
 * Page View Tracker Component
 * Automatically tracks page views when component mounts
 */
export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    trackPageView(pathname)
  }, [pathname])

  return null // This component doesn't render anything
}
