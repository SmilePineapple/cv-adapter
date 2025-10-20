/**
 * Analytics Tracking Utility
 * Tracks user events for analytics dashboard
 */

import { createSupabaseClient } from './supabase'

export type AnalyticsEventType =
  | 'cv_upload'
  | 'cv_generation'
  | 'cover_letter_generation'
  | 'cv_export'
  | 'cover_letter_export'
  | 'language_override'
  | 'template_selected'
  | 'payment_completed'
  | 'page_view'

export interface AnalyticsEventData {
  // Language tracking
  detected_language?: string
  output_language?: string
  
  // Export tracking
  format?: 'pdf' | 'docx' | 'txt' | 'html'
  template?: string
  
  // Generation tracking
  job_title?: string
  rewrite_style?: string
  tone?: string
  
  // Payment tracking
  amount?: number
  plan_type?: string
  
  // Page tracking
  page?: string
  referrer?: string
  
  // Additional metadata
  [key: string]: any
}

/**
 * Track an analytics event
 */
export async function trackEvent(
  eventType: AnalyticsEventType,
  eventData: AnalyticsEventData = {}
): Promise<void> {
  try {
    const supabase = createSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn('Analytics: User not authenticated, skipping event tracking')
      return
    }

    // Insert event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
      })

    if (error) {
      console.error('Analytics tracking error:', error)
    } else {
      console.log(`📊 Analytics: Tracked ${eventType}`, eventData)
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

/**
 * Track CV upload
 */
export async function trackCVUpload(detectedLanguage: string, fileName: string) {
  await trackEvent('cv_upload', {
    detected_language: detectedLanguage,
    file_name: fileName,
  })
}

/**
 * Track CV generation
 */
export async function trackCVGeneration(data: {
  jobTitle: string
  outputLanguage: string
  rewriteStyle: string
  tone: string
}) {
  await trackEvent('cv_generation', {
    job_title: data.jobTitle,
    output_language: data.outputLanguage,
    rewrite_style: data.rewriteStyle,
    tone: data.tone,
  })
}

/**
 * Track cover letter generation
 */
export async function trackCoverLetterGeneration(data: {
  jobTitle: string
  outputLanguage?: string
  tone: string
  length: string
}) {
  await trackEvent('cover_letter_generation', {
    job_title: data.jobTitle,
    output_language: data.outputLanguage || 'en',
    tone: data.tone,
    length: data.length,
  })
}

/**
 * Track export
 */
export async function trackExport(
  type: 'cv' | 'cover_letter',
  format: 'pdf' | 'docx' | 'txt' | 'html',
  template?: string
) {
  await trackEvent(
    type === 'cv' ? 'cv_export' : 'cover_letter_export',
    {
      format,
      template,
    }
  )
}

/**
 * Track language override
 */
export async function trackLanguageOverride(
  detectedLanguage: string,
  selectedLanguage: string
) {
  await trackEvent('language_override', {
    detected_language: detectedLanguage,
    output_language: selectedLanguage,
  })
}

/**
 * Track template selection
 */
export async function trackTemplateSelection(template: string) {
  await trackEvent('template_selected', {
    template,
  })
}

/**
 * Track payment completion
 */
export async function trackPaymentCompleted(amount: number, planType: string) {
  await trackEvent('payment_completed', {
    amount,
    plan_type: planType,
  })
}

/**
 * Track page view
 */
export async function trackPageView(page: string, referrer?: string) {
  await trackEvent('page_view', {
    page,
    referrer: referrer || document.referrer,
  })
}

/**
 * Get analytics summary for current user
 */
export async function getUserAnalytics() {
  try {
    const supabase = createSupabaseClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_activity_summary')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user analytics:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to get user analytics:', error)
    return null
  }
}

/**
 * Get language usage stats (admin only)
 */
export async function getLanguageUsageStats() {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('language_usage_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching language stats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to get language stats:', error)
    return []
  }
}

/**
 * Get export format stats (admin only)
 */
export async function getExportFormatStats() {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('export_format_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching export stats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to get export stats:', error)
    return []
  }
}

/**
 * Get daily stats (admin only)
 */
export async function getDailyStats(days: number = 30) {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(days)

    if (error) {
      console.error('Error fetching daily stats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to get daily stats:', error)
    return []
  }
}
