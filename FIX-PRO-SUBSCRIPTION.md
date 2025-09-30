# Fix: Pro Subscription Not Showing After Stripe Checkout

## Problem
You upgraded to Pro via Stripe (got `?success=true`), but the dashboard still shows:
- "3/3 generations used"
- "Upgrade to Pro" button
- Free plan limits

## Root Cause
The Stripe checkout succeeded, but the subscription wasn't created in your Supabase database because:
1. Stripe webhooks can't reach `localhost:3000`
2. The `subscriptions` table might not exist or is missing columns
3. No fallback mechanism to create subscription after successful checkout

## Solution: 3 Steps

### Step 1: Set Up Database Table
Run this in **Supabase SQL Editor**:

```bash
# Copy and run: COMPLETE-SUBSCRIPTION-SETUP.sql
```

This creates the `subscriptions` table with all required columns and RLS policies.

### Step 2: Activate Your Pro Subscription

**Option A: Use the Dashboard Button (Easiest)**
1. Go to your dashboard at `http://localhost:3000/dashboard`
2. Look for the yellow **"Activate Pro (Testing)"** button
3. Click it
4. Page will refresh and show Pro features

**Option B: Use Browser Console**
1. Open DevTools (F12) → Console tab
2. Paste and run:
```javascript
fetch('/api/setup-pro-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(console.log)
```
3. Refresh the page

**Option C: Run SQL Directly**
1. Get your User ID from Supabase Dashboard → Authentication → Users
2. Run in SQL Editor (replace `YOUR_USER_ID`):
```sql
INSERT INTO public.subscriptions (
  user_id, status, price_id,
  current_period_start, current_period_end
) VALUES (
  'YOUR_USER_ID'::uuid,
  'active',
  'price_pro',
  NOW(),
  NOW() + INTERVAL '30 days'
)
ON CONFLICT (user_id) DO UPDATE SET
  status = 'active',
  price_id = 'price_pro',
  current_period_end = NOW() + INTERVAL '30 days';
```

### Step 3: Verify It Works
After activation, you should see:
- ✅ **100/month** generations (instead of 3/month)
- ✅ **"Manage Plan"** button (instead of "Upgrade to Pro")
- ✅ No usage limit warnings
- ✅ "Pro" badge or indicator

## What Changed

### Files Modified:
1. **`src/app/subscription/page.tsx`**
   - Removed fake Pro subscription creation
   - Now correctly shows free plan when no subscription exists

2. **`src/app/dashboard/page.tsx`**
   - Added "Activate Pro (Testing)" button for easy testing
   - Added `handleActivatePro()` function

3. **`create-subscriptions-table.sql`**
   - Added `price_id` column
   - Added migration for existing tables

4. **`COMPLETE-SUBSCRIPTION-SETUP.sql`** (New)
   - Comprehensive setup script
   - Creates table, policies, indexes
   - Handles all edge cases

## For Production

To make Stripe work properly in production:

1. **Set up Stripe Webhook**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

2. **Add Webhook Handler**:
   - Create `/api/stripe/webhook/route.ts`
   - Verify webhook signature
   - Create/update subscription in database

3. **Remove Testing Button**:
   - Delete the "Activate Pro (Testing)" button from dashboard
   - Remove `/api/setup-pro-subscription` endpoint

## Testing Checklist

- [ ] Run `COMPLETE-SUBSCRIPTION-SETUP.sql` in Supabase
- [ ] Click "Activate Pro (Testing)" button on dashboard
- [ ] Verify dashboard shows "100/month" generations
- [ ] Try generating a CV (should work)
- [ ] Check subscription page shows "Active" status
- [ ] Verify usage tracking increments properly

## Notes

- The yellow "Activate Pro (Testing)" button is **temporary** for development
- Remove it before deploying to production
- In production, subscriptions will be created automatically via Stripe webhooks
- The `?success=true` parameter from Stripe is just a redirect indicator, not a confirmation
