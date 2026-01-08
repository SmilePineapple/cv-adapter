'use client'

import { useEffect } from 'react'
import { storeTrackingData } from '@/lib/user-tracking'

/**
 * TrackingInitializer Component
 * Captures referrer and UTM parameters on first page load
 * Should be added to the root layout or landing page
 */
export function TrackingInitializer() {
  useEffect(() => {
    // Store tracking data on initial page load
    storeTrackingData()
  }, [])

  return null // This component doesn't render anything
}
