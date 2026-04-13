# Rate Limiting Setup Guide

## Option 1: Simple In-Memory Rate Limiting (No external service needed)

Since you're on Vercel Hobby plan, we'll use a simple in-memory rate limiter that doesn't require Redis.

### Implementation:

1. Create `src/lib/rate-limit-simple.ts`
2. Apply to API routes
3. No additional services needed
4. Works immediately

### Limitations:
- Resets on serverless function cold starts
- Not shared across regions
- Good enough for MVP

## Option 2: Upstash Redis (Recommended for production)

### Setup:
1. Go to https://upstash.com (free tier available)
2. Create Redis database
3. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
4. Add to Vercel environment variables

### Cost:
- Free tier: 10,000 commands/day
- More than enough for current traffic

## Recommendation:
Start with Option 1 (simple), upgrade to Option 2 when you have 100+ users/day
