'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export function GoogleAnalytics() {
  const [measurementId, setMeasurementId] = useState<string | null>(null)

  useEffect(() => {
    // Determine which GA ID to use based on domain
    const hostname = window.location.hostname
    
    if (hostname.includes('mycvbuddy.co.uk')) {
      setMeasurementId('G-KDYVEN1G3E') // UK domain
    } else {
      setMeasurementId('G-RY8JTS6VFZ') // .com domain (default)
    }
  }, [])

  if (!measurementId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
