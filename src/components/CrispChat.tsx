'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

export default function CrispChat() {
  const pathname = usePathname()

  useEffect(() => {
    // Crisp Website ID - Get this from Crisp dashboard
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || ''

    // Only load if we have a website ID
    if (!window.CRISP_WEBSITE_ID) {
      console.warn('Crisp Website ID not configured')
      return
    }

    // Initialize Crisp
    window.$crisp = []
    window.$crisp.push(['safe', true])

    // Load Crisp script
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.getElementsByTagName('head')[0].appendChild(script)

    // Cleanup
    return () => {
      // Remove Crisp when component unmounts
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide'])
      }
    }
  }, [])

  // Update page view on route change
  useEffect(() => {
    if (window.$crisp) {
      window.$crisp.push(['set', 'session:event', [[['page_view', { page: pathname }]]]])
    }
  }, [pathname])

  return null
}
