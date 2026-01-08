/**
 * User Tracking Utilities
 * Captures device, browser, referrer, and country data for analytics
 */

// Device detection from user agent
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  
  const ua = navigator.userAgent.toLowerCase()
  
  // Mobile detection
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile'
  }
  
  // Tablet detection
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet'
  }
  
  // Desktop
  if (/windows|macintosh|linux/i.test(ua)) {
    return 'desktop'
  }
  
  return 'unknown'
}

// Browser detection from user agent
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  
  // Edge (must be checked before Chrome)
  if (ua.includes('Edg/')) {
    return 'Edge'
  }
  
  // Chrome
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    return 'Chrome'
  }
  
  // Safari (must be checked after Chrome)
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    return 'Safari'
  }
  
  // Firefox
  if (ua.includes('Firefox/')) {
    return 'Firefox'
  }
  
  // Opera
  if (ua.includes('OPR/') || ua.includes('Opera/')) {
    return 'Opera'
  }
  
  // Internet Explorer
  if (ua.includes('MSIE') || ua.includes('Trident/')) {
    return 'Internet Explorer'
  }
  
  return 'Unknown'
}

// Get referrer
export function getReferrer(): string {
  if (typeof document === 'undefined') return 'Direct'
  
  const referrer = document.referrer
  
  if (!referrer) {
    return 'Direct'
  }
  
  try {
    const url = new URL(referrer)
    const hostname = url.hostname
    
    // Check for common sources
    if (hostname.includes('google')) return 'Google'
    if (hostname.includes('bing')) return 'Bing'
    if (hostname.includes('yahoo')) return 'Yahoo'
    if (hostname.includes('facebook')) return 'Facebook'
    if (hostname.includes('twitter') || hostname.includes('t.co')) return 'Twitter'
    if (hostname.includes('linkedin')) return 'LinkedIn'
    if (hostname.includes('instagram')) return 'Instagram'
    if (hostname.includes('youtube')) return 'YouTube'
    if (hostname.includes('reddit')) return 'Reddit'
    if (hostname.includes('pinterest')) return 'Pinterest'
    
    // Return the hostname for other referrers
    return hostname
  } catch {
    return referrer
  }
}

// Get UTM parameters
export function getUTMParameters(): {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
} {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  }
}

// Get country from IP using ipapi.co (free tier: 1000 requests/day)
export async function getCountryFromIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch location')
    }
    
    const data = await response.json()
    return data.country_name || 'Unknown'
  } catch (error) {
    console.error('Failed to get country from IP:', error)
    return 'Unknown'
  }
}

// Alternative: Get country from IP using ip-api.com (free, no API key needed)
export async function getCountryFromIPFallback(): Promise<string> {
  try {
    const response = await fetch('http://ip-api.com/json/', {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch location')
    }
    
    const data = await response.json()
    return data.country || 'Unknown'
  } catch (error) {
    console.error('Failed to get country from IP (fallback):', error)
    return 'Unknown'
  }
}

// Collect all user metadata for signup
export async function collectUserMetadata() {
  const deviceType = getDeviceType()
  const browser = getBrowser()
  const referrer = getReferrer()
  const utmParams = getUTMParameters()
  
  // Try primary geolocation API, fallback to secondary
  let country = 'Unknown'
  try {
    country = await getCountryFromIP()
  } catch {
    try {
      country = await getCountryFromIPFallback()
    } catch {
      country = 'Unknown'
    }
  }
  
  return {
    device_type: deviceType,
    browser: browser,
    referrer: referrer,
    country: country,
    ...utmParams,
    signup_timestamp: new Date().toISOString(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
  }
}

// Store metadata in localStorage for persistence across page loads
export function storeTrackingData() {
  if (typeof window === 'undefined') return
  
  const trackingData = {
    referrer: getReferrer(),
    utm_params: getUTMParameters(),
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString()
  }
  
  try {
    localStorage.setItem('cv_adapter_tracking', JSON.stringify(trackingData))
  } catch (error) {
    console.error('Failed to store tracking data:', error)
  }
}

// Retrieve stored tracking data
export function getStoredTrackingData() {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem('cv_adapter_tracking')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to retrieve tracking data:', error)
    return null
  }
}

// Clear stored tracking data after successful signup
export function clearTrackingData() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('cv_adapter_tracking')
  } catch (error) {
    console.error('Failed to clear tracking data:', error)
  }
}
