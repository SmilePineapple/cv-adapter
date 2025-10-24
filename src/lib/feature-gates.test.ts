/**
 * Feature Gates Test
 * Quick manual test to verify feature gating logic
 */

import {
  FEATURES,
  canAccessFeature,
  isProUser,
  getRemainingGenerations,
  canGenerate,
  getFeatureName,
  getTierName,
} from './feature-gates'

console.log('🧪 Testing Feature Gates...\n')

// Test 1: Free user cannot access Pro features
console.log('Test 1: Free user access')
console.log('Can access AI Review:', canAccessFeature('free', FEATURES.AI_REVIEW)) // Should be false
console.log('Can access Cover Letters:', canAccessFeature('free', FEATURES.COVER_LETTERS)) // Should be false
console.log('Is Pro User:', isProUser('free')) // Should be false
console.log('')

// Test 2: Pro monthly user can access all features
console.log('Test 2: Pro monthly user access')
console.log('Can access AI Review:', canAccessFeature('pro_monthly', FEATURES.AI_REVIEW)) // Should be true
console.log('Can access Cover Letters:', canAccessFeature('pro_monthly', FEATURES.COVER_LETTERS)) // Should be true
console.log('Is Pro User:', isProUser('pro_monthly')) // Should be true
console.log('')

// Test 3: Pro annual user can access all features
console.log('Test 3: Pro annual user access')
console.log('Can access AI Review:', canAccessFeature('pro_annual', FEATURES.AI_REVIEW)) // Should be true
console.log('Is Pro User:', isProUser('pro_annual')) // Should be true
console.log('')

// Test 4: Generation limits
console.log('Test 4: Generation limits')
console.log('Free user (0/1):', getRemainingGenerations('free', 0, 1)) // Should be 1
console.log('Free user (1/1):', getRemainingGenerations('free', 1, 1)) // Should be 0
console.log('Pro user:', getRemainingGenerations('pro_monthly', 50, 1)) // Should be Infinity
console.log('')

// Test 5: Can generate check
console.log('Test 5: Can generate')
console.log('Free user (0/1):', canGenerate('free', 0, 1)) // Should be true
console.log('Free user (1/1):', canGenerate('free', 1, 1)) // Should be false
console.log('Pro user:', canGenerate('pro_monthly', 100, 1)) // Should be true
console.log('')

// Test 6: Display names
console.log('Test 6: Display names')
console.log('AI Review:', getFeatureName(FEATURES.AI_REVIEW))
console.log('Free tier:', getTierName('free'))
console.log('Pro monthly:', getTierName('pro_monthly'))
console.log('')

console.log('✅ All tests complete!')
console.log('\nExpected results:')
console.log('- Free users: false for all Pro features')
console.log('- Pro users: true for all features')
console.log('- Free users: limited generations')
console.log('- Pro users: unlimited generations')
