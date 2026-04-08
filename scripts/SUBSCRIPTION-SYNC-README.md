# Subscription Sync Fix

## Problem
A paying Pro user (`seethalmanohar12@gmail.com`) was downgraded to free because their payment failed. After the payment went through a couple hours ago, their account was not automatically upgraded back to Pro.

## Root Cause
The Stripe webhook that should have fired after the successful payment either:
1. Failed to process
2. Was delayed
3. Had a database connection issue at the time

## Immediate Fix Options

### Option 1: Use Admin Dashboard (Recommended - Easiest)
1. Go to `/admin/sync-subscription` in your CV Adapter dashboard
2. Enter the email: `seethalmanohar12@gmail.com`
3. Click "Sync Subscription"
4. The system will check Stripe and upgrade the user if they have an active subscription

### Option 2: Use Admin Upgrade Page
1. Go to `/admin/upgrade-user` in your CV Adapter dashboard
2. Enter the email: `seethalmanohar12@gmail.com`
3. Click "Upgrade to Pro (Free)"
4. This bypasses Stripe and manually upgrades the user

### Option 3: Run CLI Script
```bash
npx ts-node scripts/fix-subscription.ts seethalmanohar12@gmail.com
```

This will:
- Find the user in the database
- Search for their Stripe customer record
- Check for active subscriptions
- Automatically upgrade them if they have an active subscription

## What Was Implemented to Prevent This

### 1. New `invoice.payment_succeeded` Webhook Handler
**File:** `src/app/api/stripe/webhook/route.ts`

Added a new handler that fires when an invoice payment succeeds (including subscription renewals). This ensures that:
- If a user's payment goes through after a failure, they get re-upgraded
- Subscription end dates are always kept in sync
- The database stays consistent with Stripe

### 2. New Subscription Sync API
**File:** `src/app/api/admin/sync-subscription/route.ts`

A new admin API that:
- Finds a user by email or ID
- Searches for their Stripe customer record
- Checks for active subscriptions in Stripe
- Syncs the database to match Stripe status
- Can upgrade or downgrade users as needed

### 3. New Admin Sync Page
**File:** `src/app/admin/sync-subscription/page.tsx`

A user-friendly admin interface that:
- Allows manual sync with a single click
- Shows detailed results of the sync
- Provides direct link to Stripe Dashboard
- Explains common scenarios

### 4. New CLI Script
**File:** `scripts/fix-subscription.ts`

A command-line tool for:
- Batch fixing subscriptions
- Troubleshooting specific users
- Running without the web interface

## Prevention Measures

### Webhook Improvements
- Added `invoice.payment_succeeded` handler (lines 507-647)
- Better error handling with try-catch blocks
- Multiple fallback methods to find user ID
- Detailed logging for debugging

### User Lookup Fallbacks
The webhook now tries multiple methods to find the user:
1. Customer metadata (`supabase_user_id`)
2. Subscriptions table lookup
3. Purchases table lookup

### Stripe Dashboard
Check your webhook endpoint health:
1. Go to https://dashboard.stripe.com/webhooks
2. Check if `https://cvadapter.com/api/stripe/webhook` is healthy
3. Look for any failed events in the last 24 hours
4. Check if `invoice.payment_succeeded` events are being delivered

## Testing the Fix

### After applying the fix:
1. User should see "Pro Plan Active" on their subscription page
2. They should have unlimited generations
3. Their `usage_tracking` table should show:
   - `plan_type: 'pro'`
   - `subscription_tier: 'pro_monthly'` or `'pro_annual'`
   - `max_lifetime_generations: 999999`

### Verify in Stripe:
1. Go to https://dashboard.stripe.com/customers
2. Search for `seethalmanohar12@gmail.com`
3. Verify subscription status is `active`
4. Check the subscription period end date

## Next Steps
1. **Immediate:** Apply one of the three fix options above
2. **Short-term:** Monitor the new webhook handler for any issues
3. **Long-term:** Consider implementing a periodic sync job that runs nightly to catch any missed webhooks

## Files Modified/Created
- ✅ `src/app/api/stripe/webhook/route.ts` - Added `invoice.payment_succeeded` handler
- ✅ `src/app/api/admin/sync-subscription/route.ts` - New sync API
- ✅ `src/app/admin/sync-subscription/page.tsx` - New admin UI
- ✅ `src/app/admin/page.tsx` - Added sync link to dashboard
- ✅ `scripts/fix-subscription.ts` - CLI script for manual fixes
