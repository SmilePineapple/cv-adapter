# Subscription Cancellation Guide

## How Cancellation Works

### For Users:
When a user cancels their Pro subscription:

1. **Immediate Effect:**
   - Subscription marked as "canceling" (`cancel_at_period_end: true`)
   - User receives confirmation message with end date

2. **During Remaining Period:**
   - ✅ User keeps **full Pro access** until `current_period_end`
   - ✅ Can still generate up to **100 CVs/month**
   - ✅ All Pro features remain active
   - ✅ No immediate loss of functionality

3. **After Period Ends:**
   - ❌ Pro access expires
   - ❌ Reverts to free plan (3 generations/month)
   - ❌ No automatic renewal or billing

### Example Timeline:
```
User subscribes: Oct 1, 2025
User cancels:    Oct 15, 2025
Period ends:     Oct 30, 2025

Oct 1-15:  Full Pro access (100 gens)
Oct 15-30: Still Pro access (100 gens) ← Cancellation doesn't remove access
Oct 31+:   Free plan (3 gens/month)
```

## Technical Implementation

### Database Schema:
```sql
subscriptions table:
- status: 'active' | 'canceling' | 'canceled'
- cancel_at_period_end: boolean
- current_period_end: timestamp
```

### Cancellation Flow:

#### 1. Manual Subscriptions (Testing):
```
User clicks "Cancel" 
  → POST /api/cancel-subscription-manual
  → Sets cancel_at_period_end = true
  → Keeps status = 'active'
  → User retains access until current_period_end
```

#### 2. Stripe Subscriptions (Production):
```
User clicks "Cancel"
  → POST /api/stripe/cancel-subscription
  → Calls Stripe API: subscriptions.update({ cancel_at_period_end: true })
  → Updates database: cancel_at_period_end = true
  → Stripe webhook fires at period end
  → Status changes to 'canceled'
```

### Access Control Logic:
```typescript
// User has Pro access if:
const hasPro = subscription?.status === 'active' || 
               (subscription?.status === 'canceling' && 
                new Date() < new Date(subscription.current_period_end))

// Generation limit:
const maxGenerations = hasPro ? 100 : 3
```

## Setup Instructions

### Step 1: Add Cancel Column
Run in Supabase SQL Editor:
```sql
-- Copy contents of: add-cancel-column.sql
```

### Step 2: Test Cancellation
1. Go to `/subscription` page
2. Click "Cancel Subscription"
3. Confirm the cancellation
4. Verify:
   - Success message shows end date
   - Still have Pro access
   - Can still generate CVs
   - Dashboard shows Pro status

### Step 3: Verify Period End Behavior
After `current_period_end` passes:
- User should automatically revert to free plan
- Generation limit drops to 3/month
- Dashboard shows "Upgrade to Pro"

## API Endpoints

### `/api/cancel-subscription-manual` (Testing)
**Purpose:** Cancel subscription without Stripe (for development)

**Request:**
```typescript
POST /api/cancel-subscription-manual
Headers: { 'Content-Type': 'application/json' }
// No body needed - uses auth token
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be cancelled at the end of your billing period",
  "subscription": {
    "status": "active",
    "cancel_at_period_end": true,
    "current_period_end": "2025-10-30T15:08:09.196Z"
  }
}
```

### `/api/stripe/cancel-subscription` (Production)
**Purpose:** Cancel Stripe subscription

**Request:**
```typescript
POST /api/stripe/cancel-subscription
Headers: { 'Content-Type': 'application/json' }
Body: { "userId": "uuid" }
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "subscription": {
    "status": "canceling",
    "cancel_at_period_end": true
  }
}
```

## Frontend Implementation

### Subscription Page:
```typescript
const handleCancelSubscription = async () => {
  // 1. Show confirmation with end date
  const confirmed = confirm(
    `You will keep Pro access until ${periodEnd}`
  )
  
  // 2. Try manual cancellation first (testing)
  const manualResponse = await fetch('/api/cancel-subscription-manual')
  
  // 3. Fallback to Stripe (production)
  if (!manualResponse.ok) {
    await fetch('/api/stripe/cancel-subscription')
  }
  
  // 4. Show success message
  toast.success('Subscription cancelled. Access until ${periodEnd}')
  
  // 5. Refresh subscription data
  await fetchSubscription(user.id)
}
```

## User Experience

### Before Cancellation:
```
Status: Active Pro
Generations: 45/100 this month
Billing: Next charge on Oct 30, 2025
```

### After Cancellation:
```
Status: Canceling (Access until Oct 30, 2025)
Generations: 45/100 this month (still available)
Billing: No future charges
```

### After Period Ends:
```
Status: Free Plan
Generations: 0/3 this month
Billing: Upgrade to resume Pro features
```

## Error Handling

### No Stripe Subscription ID:
```
Error: "No Stripe subscription ID found"
Solution: Use manual cancellation endpoint
Message: "Please contact support to cancel your subscription."
```

### Already Cancelled:
```
Error: "Subscription already cancelled"
Solution: Show current status and end date
```

### Period Already Ended:
```
Error: "Subscription already expired"
Solution: Redirect to upgrade page
```

## Testing Checklist

- [ ] Run `add-cancel-column.sql` in Supabase
- [ ] Click "Cancel Subscription" on subscription page
- [ ] Verify confirmation shows correct end date
- [ ] Confirm cancellation
- [ ] Check success message appears
- [ ] Verify still have Pro access
- [ ] Generate a CV (should work)
- [ ] Check dashboard still shows Pro status
- [ ] Verify `cancel_at_period_end` is true in database

## Production Considerations

### Stripe Webhook:
When `current_period_end` is reached, Stripe sends webhook:
```
Event: customer.subscription.deleted
Action: Update status to 'canceled' in database
```

### Cron Job (Optional):
Check for expired subscriptions daily:
```sql
UPDATE subscriptions
SET status = 'canceled'
WHERE cancel_at_period_end = true
AND current_period_end < NOW()
AND status != 'canceled';
```

### Email Notifications:
- Send confirmation email when user cancels
- Send reminder 3 days before period ends
- Send "subscription ended" email on expiration

## Files Modified

1. **`src/app/subscription/page.tsx`**
   - Added manual cancellation fallback
   - Shows end date in confirmation
   - Better error handling

2. **`src/app/api/cancel-subscription-manual/route.ts`** (New)
   - Manual cancellation for testing
   - No Stripe required

3. **`add-cancel-column.sql`** (New)
   - Adds `cancel_at_period_end` column

## Summary

✅ **Cancellation preserves access** until period end
✅ **No immediate loss** of Pro features
✅ **Clear communication** of end date to user
✅ **Works without Stripe** for testing
✅ **Graceful degradation** to free plan

Users get full value for their payment period, even after cancelling!
