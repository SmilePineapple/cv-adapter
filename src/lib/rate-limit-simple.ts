/**
 * Simple in-memory rate limiter
 * No external dependencies, works immediately
 * Resets on serverless cold starts (acceptable for MVP)
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (resets on cold start)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number
  
  /**
   * Time window in seconds
   */
  window: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if request is within rate limit
 * 
 * @param identifier - Unique identifier (user ID, IP address, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.window * 1000
  const resetTime = now + windowMs
  
  const entry = rateLimitStore.get(identifier)
  
  // No entry or expired entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime
    })
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: resetTime
    }
  }
  
  // Within limit
  if (entry.count < config.limit) {
    entry.count++
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - entry.count,
      reset: entry.resetTime
    }
  }
  
  // Exceeded limit
  return {
    success: false,
    limit: config.limit,
    remaining: 0,
    reset: entry.resetTime
  }
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry || entry.resetTime < now) {
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: now + (config.window * 1000)
    }
  }
  
  return {
    success: entry.count < config.limit,
    limit: config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    reset: entry.resetTime
  }
}

/**
 * Middleware helper for API routes
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (identifier: string) => rateLimit(identifier, config)
}

// Pre-configured rate limiters
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
