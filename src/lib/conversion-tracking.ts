// Conversion tracking utility for analytics

export type ConversionEvent = 
  | 'page_view'
  | 'signup_completed'
  | 'first_cv_upload'
  | 'first_generation'
  | 'limit_reached'
  | 'viewed_pricing'
  | 'clicked_upgrade'
  | 'started_checkout'
  | 'completed_payment'
  | 'generation_after_upgrade'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

/**
 * Track conversion events for analytics
 * This can be extended to integrate with Google Analytics, Mixpanel, etc.
 */
export function trackConversionEvent(
  event: ConversionEvent,
  properties?: EventProperties
) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Conversion Event] ${event}`, properties)
  }

  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties)
  }

  // Track with Facebook Pixel if available
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, properties)
  }

  // You can add more analytics integrations here:
  // - Mixpanel
  // - Amplitude
  // - Segment
  // - PostHog
  // - etc.
}

/**
 * Track page views
 */
export function trackPageView(pageName: string, properties?: EventProperties) {
  trackConversionEvent('page_view', {
    page_name: pageName,
    ...properties
  })
}

/**
 * Track user signup
 */
export function trackSignup(method: 'email' | 'google' | 'linkedin') {
  trackConversionEvent('signup_completed', {
    signup_method: method
  })
}

/**
 * Track first CV upload
 */
export function trackFirstUpload(userId: string) {
  trackConversionEvent('first_cv_upload', {
    user_id: userId
  })
}

/**
 * Track first generation
 */
export function trackFirstGeneration(userId: string) {
  trackConversionEvent('first_generation', {
    user_id: userId
  })
}

/**
 * Track when user hits free limit
 */
export function trackLimitReached(userId: string, currentUsage: number) {
  trackConversionEvent('limit_reached', {
    user_id: userId,
    usage_count: currentUsage
  })
}

/**
 * Track when user views pricing page
 */
export function trackViewedPricing(source: string) {
  trackConversionEvent('viewed_pricing', {
    source
  })
}

/**
 * Track when user clicks upgrade button
 */
export function trackClickedUpgrade(source: string, trigger?: string) {
  trackConversionEvent('clicked_upgrade', {
    source,
    trigger
  })
}

/**
 * Track when user starts checkout
 */
export function trackStartedCheckout(userId: string) {
  trackConversionEvent('started_checkout', {
    user_id: userId,
    value: 5, // £5
    currency: 'GBP'
  })
}

/**
 * Track when payment is completed
 */
export function trackCompletedPayment(userId: string) {
  trackConversionEvent('completed_payment', {
    user_id: userId,
    value: 5, // £5
    currency: 'GBP',
    transaction_id: `payment_${userId}_${Date.now()}`
  })
}

/**
 * Track generation after upgrade (to measure value delivery)
 */
export function trackGenerationAfterUpgrade(userId: string, generationNumber: number) {
  trackConversionEvent('generation_after_upgrade', {
    user_id: userId,
    generation_number: generationNumber
  })
}
