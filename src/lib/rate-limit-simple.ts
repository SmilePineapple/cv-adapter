/**
 * Persistent Supabase-backed rate limiter
 * Survives serverless cold starts — works correctly across all instances.
 *
 * Uses an upsert on the `rate_limits` table (service role) with atomic
 * increment logic. Falls back to allow-through if the DB call fails,
 * so a Supabase outage never blocks legitimate users.
 *
 * Migration: migrations/add-rate-limits-table.sql
 */

import { createAdminClient } from './supabase-admin'

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  window: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check and increment the rate limit for an identifier.
 * Uses Supabase upsert for atomic, cross-instance counting.
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowMs = config.window * 1000
  const resetAt = new Date(now + windowMs).toISOString()

  try {
    const supabase = createAdminClient()

    // Upsert: if no row or expired, start fresh at count=1.
    // If within window, increment atomically via RPC.
    const { data, error } = await supabase.rpc('upsert_rate_limit', {
      p_identifier: identifier,
      p_limit: config.limit,
      p_window_seconds: config.window,
      p_reset_at: resetAt,
    })

    if (error) {
      console.error('[RateLimit] Supabase error, allowing through:', error.message)
      return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + windowMs }
    }

    // RPC returns { count, reset_at }
    const { count, reset_at } = data as { count: number; reset_at: string }
    const resetMs = new Date(reset_at).getTime()

    if (count > config.limit) {
      return { success: false, limit: config.limit, remaining: 0, reset: resetMs }
    }

    return {
      success: true,
      limit: config.limit,
      remaining: Math.max(0, config.limit - count),
      reset: resetMs,
    }
  } catch (err) {
    console.error('[RateLimit] Unexpected error, allowing through:', err)
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + windowMs }
  }
}

/**
 * Delete the rate limit record for an identifier (e.g. after a test)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('rate_limits').delete().eq('identifier', identifier)
  } catch (err) {
    console.error('[RateLimit] Failed to reset:', err)
  }
}

/**
 * Read current status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('rate_limits')
      .select('count, reset_at')
      .eq('identifier', identifier)
      .single()

    if (!data || new Date(data.reset_at).getTime() < now) {
      return { success: true, limit: config.limit, remaining: config.limit, reset: now + config.window * 1000 }
    }

    const resetMs = new Date(data.reset_at).getTime()
    return {
      success: data.count < config.limit,
      limit: config.limit,
      remaining: Math.max(0, config.limit - data.count),
      reset: resetMs,
    }
  } catch {
    return { success: true, limit: config.limit, remaining: config.limit, reset: now + config.window * 1000 }
  }
}

/**
 * Create a pre-configured rate limiter function
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (identifier: string) => rateLimit(identifier, config)
}

// Pre-configured rate limiters — same API as before
export const rateLimiters = {
  // Strict: 5 requests per 10 seconds
  strict: createRateLimiter({ limit: 5, window: 10 }),

  // Normal: 10 requests per minute
  normal: createRateLimiter({ limit: 10, window: 60 }),

  // Generous: 30 requests per minute
  generous: createRateLimiter({ limit: 30, window: 60 }),

  // API: 100 requests per hour
  api: createRateLimiter({ limit: 100, window: 3600 }),
}
