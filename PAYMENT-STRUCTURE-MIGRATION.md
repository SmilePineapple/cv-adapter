# Payment Structure Migration - Subscription to One-Time Payment

## Overview
Successfully migrated CV Adapter from a monthly subscription model to a one-time payment model with lifetime generation limits.

## Changes Summary

### Old Structure
- **Free tier**: 3 generations/month (resets monthly)
- **Pro tier**: £5/month subscription for 100 generations/month
- Monthly usage resets via database function
- Stripe subscriptions with recurring billing

### New Structure
- **Free tier**: 1 generation (lifetime, never resets)
- **Pro tier**: £5 one-time payment for 100 generations (lifetime, never resets)
- No monthly resets
- Stripe one-time payments (no subscriptions)

## Files Modified

### 1. Database Schema (`migrate-to-lifetime-payments.sql`)
**Changes:**
- Added `lifetime_generation_count`, `plan_type`, `max_lifetime_generations` to `usage_tracking` table
- Renamed `subscriptions` table to `purchases`
- Updated `purchases` table structure for one-time payments
- Removed subscription-specific columns (period_start, period_end, cancel_at_period_end)
- Added payment-specific columns (payment_intent_id, amount_paid, currency, purchased_at)
- Dropped `reset_monthly_usage()` function (no longer needed)
- Created helper functions: `can_user_generate()` and `upgrade_user_to_pro()`

**Migration Steps:**
```sql
-- Run the migration script in Supabase SQL Editor
-- File: migrate-to-lifetime-payments.sql
```

### 2. Environment Variables (`.env.local`)
**Changes:**
```env
# Old
MAX_FREE_GENERATIONS=3

# New
MAX_FREE_GENERATIONS=1
```

### 3. Stripe Checkout API (`/api/stripe/create-checkout/route.ts`)
**Changes:**
- Removed `priceId` parameter (no longer using Stripe Price objects)
- Changed from `mode: 'subscription'` to `mode: 'payment'`
- Using inline `price_data` instead of Stripe Price ID
- Amount: £5.00 (500 pence) one-time
- Updated success URL to include `payment_success=true`

### 4. Stripe Webhook (`/api/stripe/webhook/route.ts`)
**Changes:**
- Updated `checkout.session.completed` handler for one-time payments
- Creates record in `purchases` table instead of `subscriptions`
- Upgrades user to pro by updating `usage_tracking` table
- Removed subscription update/delete handlers
- Added `payment_intent.succeeded` and `payment_intent.payment_failed` handlers

### 5. Rewrite API (`/api/rewrite/route.ts`)
**Changes:**
- Queries `lifetime_generation_count`, `plan_type`, `max_lifetime_generations` from `usage_tracking`
- Checks `plan_type === 'pro'` instead of subscription status
- Updates `lifetime_generation_count` on each generation
- Better error messages for limit reached

### 6. Dashboard (`/dashboard/page.tsx`)
**Changes:**
- Updated `UsageInfo` interface to include lifetime fields
- Renamed `subscription` state to `purchase`
- Queries `purchases` table instead of `subscriptions`
- Checks `usage?.plan_type === 'pro'` instead of subscription status
- Updated usage display to show lifetime generations
- Updated error messages for limit reached

### 7. Subscription Page (`/subscription/page.tsx`)
**Changes:**
- Renamed interfaces from `SubscriptionInfo` to `PurchaseInfo` and added `UsageInfo`
- Renamed `fetchSubscription()` to `fetchPurchaseAndUsage()`
- Removed cancellation logic (not needed for one-time purchases)
- Updated `handleUpgrade()` to not require `priceId`
- Updated Pro plan display to show:
  - "£5 (one-time)" instead of "£5/month"
  - "100 lifetime CV generations" instead of "100/month"
  - Lifetime usage stats (X / 100 used)
  - Purchase date instead of billing period
- Updated Free plan display to show "1 CV generation (lifetime)"
- Changed button text from "Upgrade to Pro" to "Buy Pro Access"

## Database Migration Instructions

### Step 1: Backup Current Data
```sql
-- Backup existing subscriptions
CREATE TABLE subscriptions_backup AS SELECT * FROM subscriptions;

-- Backup existing usage_tracking
CREATE TABLE usage_tracking_backup AS SELECT * FROM usage_tracking;
```

### Step 2: Run Migration Script
```bash
# In Supabase SQL Editor, run:
migrate-to-lifetime-payments.sql
```

### Step 3: Verify Migration
```sql
-- Check usage_tracking structure
SELECT 
  user_id,
  generation_count,
  lifetime_generation_count,
  plan_type,
  max_lifetime_generations
FROM usage_tracking
LIMIT 5;

-- Check purchases structure
SELECT 
  user_id,
  status,
  amount_paid,
  currency,
  purchased_at
FROM purchases
WHERE status = 'completed'
LIMIT 5;

-- Check plan distribution
SELECT 
  plan_type,
  COUNT(*) as user_count,
  AVG(lifetime_generation_count) as avg_generations_used
FROM usage_tracking
GROUP BY plan_type;
```

## Stripe Configuration

### Create New Product (Optional)
Since we're using inline `price_data`, you don't need to create a Stripe Product/Price. However, for better tracking:

1. Go to Stripe Dashboard → Products
2. Create new product: "CV Adapter Pro - Lifetime Access"
3. Set price: £5.00 one-time
4. Note: The code doesn't use this Price ID anymore, but it's good for reference

### Update Webhook Events
Ensure your Stripe webhook listens for:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Testing Checklist

### 1. Free User Flow
- [ ] New user signs up
- [ ] User has 1 free generation available
- [ ] User can generate 1 CV
- [ ] After 1 generation, user sees upgrade prompt
- [ ] Dashboard shows "1 / 1 used"

### 2. Pro Purchase Flow
- [ ] Free user clicks "Upgrade to Pro"
- [ ] Redirected to Stripe Checkout
- [ ] Payment page shows "£5.00" one-time
- [ ] Complete test payment
- [ ] Redirected back to dashboard with success message
- [ ] User now has "pro" plan_type
- [ ] User has 100 lifetime generations available
- [ ] Dashboard shows correct usage (e.g., "1 / 100 used")

### 3. Pro User Experience
- [ ] Pro user can generate CVs
- [ ] Each generation increments lifetime_generation_count
- [ ] Dashboard shows lifetime usage correctly
- [ ] Subscription page shows "Pro Plan Active"
- [ ] Shows purchase date
- [ ] Shows "Lifetime Access" status
- [ ] No cancellation button (one-time purchase)

### 4. Limit Enforcement
- [ ] Free user blocked after 1 generation
- [ ] Pro user blocked after 100 generations
- [ ] Appropriate error messages shown
- [ ] Upgrade prompts appear for free users

### 5. Database Integrity
- [ ] `purchases` table records payment correctly
- [ ] `usage_tracking` updated to pro on payment
- [ ] `lifetime_generation_count` increments correctly
- [ ] No monthly resets occur

## Rollback Plan

If issues arise, rollback steps:

```sql
-- 1. Restore tables
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS usage_tracking;

ALTER TABLE subscriptions_backup RENAME TO subscriptions;
ALTER TABLE usage_tracking_backup RENAME TO usage_tracking;

-- 2. Restore RLS policies
-- (Re-run original database-schema.sql for subscriptions policies)

-- 3. Revert code changes
git revert <commit-hash>
```

## API Endpoints That Need Updates

If you have other API routes that check usage limits, update them similarly:
- `/api/auto-cv-generate/route.ts` - Update to use lifetime_generation_count
- `/api/generate-cover-letter/route.ts` - Update to use lifetime_generation_count
- `/api/cv/[cvId]/ai-populate/route.ts` - Update to use lifetime_generation_count

## Frontend Components That May Need Updates

Check these components for subscription/usage references:
- Any usage display components
- Any upgrade prompts
- Any billing/payment related pages

## Environment Variables Checklist

Ensure these are set correctly:
```env
# Stripe (no changes needed to keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Usage Limits (UPDATED)
MAX_FREE_GENERATIONS=1  # Changed from 3
MAX_PRO_GENERATIONS=100 # Unchanged

# App URLs (no changes)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Success Metrics to Monitor

After deployment, monitor:
1. **Conversion rate**: Free → Pro purchases
2. **Average generations per user**: Should be lower initially (1 free vs 3)
3. **Revenue**: One-time £5 vs monthly £5 (expect initial spike, then plateau)
4. **User retention**: Lifetime access may improve long-term retention
5. **Support requests**: Watch for confusion about "no monthly billing"

## Communication Plan

### User Notification
For existing users, send email:
- **Subject**: "CV Adapter is now even better - Lifetime access!"
- **Body**: Explain the change from monthly to lifetime
- **Existing Pro users**: Grandfather them in (they keep 100 lifetime generations)
- **Existing Free users**: Explain reduction from 3/month to 1 lifetime

### Website Updates
- Update landing page pricing
- Update FAQ about billing
- Update terms of service if needed

## Notes

- **Existing Pro subscribers**: The migration script automatically converts them to "completed" purchases with 100 lifetime generations
- **No refunds needed**: Existing monthly subscribers get lifetime access (better deal)
- **Stripe subscriptions**: Old subscriptions can be cancelled manually in Stripe Dashboard
- **Database cleanup**: Old subscription records are preserved in `purchases` table

## Completed By
- Date: January 2025
- Migration script: `migrate-to-lifetime-payments.sql`
- All code changes committed and ready for deployment
