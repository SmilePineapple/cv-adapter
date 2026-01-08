/**
 * Feature Gating System
 * Controls access to Pro features based on subscription tier
 */

export const FEATURES = {
  AI_REVIEW: 'ai_review',
  COVER_LETTERS: 'cover_letters',
  ADVANCED_TEMPLATES: 'advanced_templates',
  UNLIMITED_GENERATIONS: 'unlimited_generations',
  ALL_EXPORT_FORMATS: 'all_export_formats',
  NO_WATERMARK: 'no_watermark',
  PRIORITY_SUPPORT: 'priority_support',
} as const

export type Feature = typeof FEATURES[keyof typeof FEATURES]

// Free tier gets NO premium features
export const FREE_TIER_FEATURES: Feature[] = []

// Pro tier gets ALL features
export const PRO_TIER_FEATURES: Feature[] = Object.values(FEATURES)

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(
  userTier: string,
  feature: Feature
): boolean {
  // Pro users get everything
  if (userTier === 'pro_monthly' || userTier === 'pro_annual') {
    return true
  }
  
  // Free users get nothing (except basic functionality)
  return FREE_TIER_FEATURES.includes(feature)
}

/**
 * Check if user is a Pro user
 */
export function isProUser(userTier: string): boolean {
  return userTier === 'pro_monthly' || userTier === 'pro_annual'
}

/**
 * Get list of features for a tier
 */
export function getFeatureList(userTier: string): Feature[] {
  if (isProUser(userTier)) {
    return PRO_TIER_FEATURES
  }
  return FREE_TIER_FEATURES
}

/**
 * Get remaining generations for a user
 */
export function getRemainingGenerations(
  userTier: string,
  lifetimeCount: number,
  maxLifetime: number
): number {
  // Pro users have unlimited
  if (isProUser(userTier)) {
    return Infinity
  }
  
  // Free users have a limit
  return Math.max(0, maxLifetime - lifetimeCount)
}

/**
 * Check if user can generate more CVs
 */
export function canGenerate(
  userTier: string,
  lifetimeCount: number,
  maxLifetime: number
): boolean {
  // Pro users always can
  if (isProUser(userTier)) {
    return true
  }
  
  // Free users check limit
  return lifetimeCount < maxLifetime
}

/**
 * Get feature display name
 */
export function getFeatureName(feature: Feature): string {
  const names: Record<Feature, string> = {
    [FEATURES.AI_REVIEW]: 'AI Expert Review',
    [FEATURES.COVER_LETTERS]: 'Cover Letter Generator',
    [FEATURES.ADVANCED_TEMPLATES]: 'Advanced Templates',
    [FEATURES.UNLIMITED_GENERATIONS]: 'Unlimited Generations',
    [FEATURES.ALL_EXPORT_FORMATS]: 'All Export Formats',
    [FEATURES.NO_WATERMARK]: 'No Watermark',
    [FEATURES.PRIORITY_SUPPORT]: 'Priority Support',
  }
  return names[feature]
}

/**
 * Get feature description
 */
export function getFeatureDescription(feature: Feature): string {
  const descriptions: Record<Feature, string> = {
    [FEATURES.AI_REVIEW]: 'Get personalized feedback to improve your ATS score by 20%+',
    [FEATURES.COVER_LETTERS]: 'Generate tailored cover letters for each job application',
    [FEATURES.ADVANCED_TEMPLATES]: 'Access premium templates with icons and two-column layouts',
    [FEATURES.UNLIMITED_GENERATIONS]: 'Create unlimited CV versions for different jobs',
    [FEATURES.ALL_EXPORT_FORMATS]: 'Export as PDF, DOCX, HTML, and TXT',
    [FEATURES.NO_WATERMARK]: 'Professional exports without watermarks',
    [FEATURES.PRIORITY_SUPPORT]: 'Get help faster with priority email support',
  }
  return descriptions[feature]
}

/**
 * Get tier display name
 */
export function getTierName(tier: string): string {
  const names: Record<string, string> = {
    'free': 'Free',
    'pro_monthly': 'Pro (Monthly)',
    'pro_annual': 'Pro (Annual)',
  }
  return names[tier] || tier
}

/**
 * Get tier badge color
 */
export function getTierBadgeColor(tier: string): string {
  if (isProUser(tier)) {
    return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
  }
  return 'bg-gray-200 text-gray-700'
}
