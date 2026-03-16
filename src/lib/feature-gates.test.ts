/**
 * Feature Gates Test
 * Quick manual test to verify feature gating logic
 */

import { describe, expect, it } from 'vitest'

import {
  FEATURES,
  canAccessFeature,
  isProUser,
  getRemainingGenerations,
  canGenerate,
  getFeatureName,
  getTierName,
} from './feature-gates'

describe('feature-gates', () => {
  it('prevents free users from accessing pro features', () => {
    expect(canAccessFeature('free', FEATURES.AI_REVIEW)).toBe(false)
    expect(canAccessFeature('free', FEATURES.COVER_LETTERS)).toBe(false)
    expect(isProUser('free')).toBe(false)
  })

  it('allows pro monthly users to access pro features', () => {
    expect(canAccessFeature('pro_monthly', FEATURES.AI_REVIEW)).toBe(true)
    expect(canAccessFeature('pro_monthly', FEATURES.COVER_LETTERS)).toBe(true)
    expect(isProUser('pro_monthly')).toBe(true)
  })

  it('allows pro annual users to access pro features', () => {
    expect(canAccessFeature('pro_annual', FEATURES.AI_REVIEW)).toBe(true)
    expect(isProUser('pro_annual')).toBe(true)
  })

  it('enforces generation limits for free users and unlimited for pro', () => {
    expect(getRemainingGenerations('free', 0, 1)).toBe(1)
    expect(getRemainingGenerations('free', 1, 1)).toBe(0)
    expect(getRemainingGenerations('pro_monthly', 50, 1)).toBe(Infinity)
  })

  it('canGenerate matches remaining generations logic', () => {
    expect(canGenerate('free', 0, 1)).toBe(true)
    expect(canGenerate('free', 1, 1)).toBe(false)
    expect(canGenerate('pro_monthly', 100, 1)).toBe(true)
  })

  it('returns display names for tiers and features', () => {
    expect(getFeatureName(FEATURES.AI_REVIEW)).toBeTruthy()
    expect(getTierName('free')).toBeTruthy()
    expect(getTierName('pro_monthly')).toBeTruthy()
  })
})
