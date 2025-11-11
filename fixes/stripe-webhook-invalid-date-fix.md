# Stripe Webhook Invalid Date Error Fix

## Problem
Users were successfully completing Stripe checkout but were not being upgraded to Pro. The webhook was failing with:
```
RangeError: Invalid time value at Date.toISOString()
```

## Root Cause
The webhook handler was attempting to retrieve subscription data from `checkout.session.completed` event, but the subscription object's `current_period_end` field was either:
1. Undefined/null
2. Not yet populated when the webhook fired
3. Invalid timestamp value

The code was using `(subscription as any).current_period_end` which bypassed TypeScript's type checking and didn't validate the value before converting to a Date.

## Error Location
**File:** `src/app/api/stripe/webhook/route.ts`
**Line 64 (original):**
```typescript
const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000)
```

When `current_period_end` was undefined, this resulted in:
```typescript
new Date(undefined * 1000) // NaN
currentPeriodEnd.toISOString() // RangeError: Invalid time value
```

## Solution Implemented

### 1. Added Type-Safe Property Access with Validation
Due to TypeScript type definition limitations in the Stripe SDK, we use type assertion with comprehensive validation:

```typescript
// Access subscription properties safely
const subData = subscription as any

// Validate current_period_end exists AND is a number
if (!subData.current_period_end || typeof subData.current_period_end !== 'number') {
  console.error('[Webhook] Subscription missing or invalid current_period_end:', subscription.id, subData.current_period_end)
  throw new Error('Invalid subscription: missing or invalid current_period_end')
}

const currentPeriodEnd = new Date(subData.current_period_end * 1000)

// Validate the date is valid
if (isNaN(currentPeriodEnd.getTime())) {
  console.error('[Webhook] Invalid current_period_end timestamp:', subData.current_period_end)
  throw new Error('Invalid subscription: invalid current_period_end timestamp')
}
```

**Why `as any`?**
- Stripe's TypeScript types may not include all runtime properties
- The property `current_period_end` exists in the actual API response but not in type definitions
- We validate both existence AND type before use, making this safe
- Alternative would be to update `@types/stripe` or use custom type definitions

### 2. Enhanced Subscription Retrieval
Added `expand` parameter to ensure all subscription data is loaded:
```typescript
const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
  expand: ['latest_invoice', 'customer']
})
```

### 3. Added Logging for Debugging
```typescript
console.log('[Webhook] Retrieved subscription:', {
  id: subscription.id,
  status: subscription.status,
  current_period_end: subscription.current_period_end,
  current_period_start: subscription.current_period_start
})
```

### 4. Added Fallback Handler: `customer.subscription.created`
This event is more reliable for subscription creation as it fires after the subscription is fully initialized:
```typescript
case 'customer.subscription.created': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string
  
  // Get customer metadata to find user_id
  const customer = await stripe.customers.retrieve(customerId)
  const userId = customer.metadata?.supabase_user_id
  
  // Determine plan type from subscription interval
  const interval = subscription.items.data[0]?.price?.recurring?.interval
  const planType = interval === 'year' ? 'annual' : 'monthly'
  
  // Upgrade user to pro
  // ... validation and database update
}
```

### 5. Applied Same Fixes to `customer.subscription.updated`
Ensured consistent validation across all webhook handlers that use `current_period_end`.

## Testing
To test the fix:
1. Go to `/subscription` page
2. Click "Upgrade to Pro"
3. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
4. Verify webhook logs show successful subscription retrieval
5. Check user is upgraded in database: `usage_tracking.subscription_tier` should be `pro_monthly` or `pro_annual`
6. Verify user can generate unlimited CVs

## Stripe Webhook Events to Listen For
Make sure these events are enabled in Stripe Dashboard → Webhooks:
- ✅ `checkout.session.completed` - Primary handler
- ✅ `customer.subscription.created` - Fallback handler (more reliable)
- ✅ `customer.subscription.updated` - Renewal handler
- ✅ `customer.subscription.deleted` - Cancellation handler
- ✅ `payment_intent.succeeded` - Payment tracking
- ✅ `payment_intent.payment_failed` - Failed payment tracking

## Prevention
- Always validate external API data before using it
- Never use `as any` type casts without validation
- Add proper error logging to identify issues quickly
- Use `expand` parameter when retrieving Stripe objects to ensure all data is loaded
- Handle multiple webhook events for redundancy

## Impact
- ✅ Users can now successfully upgrade to Pro
- ✅ Webhook errors are caught and logged properly
- ✅ Fallback handler ensures upgrade even if primary handler fails
- ✅ Better debugging with detailed logs
