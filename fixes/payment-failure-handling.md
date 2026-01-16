# Payment Failure Handling Implementation

## Problem
Users whose recurring subscription payments fail (e.g., declined card) remain as Pro users indefinitely, causing:
1. Incorrect MRR calculations on admin dashboard
2. Users getting Pro features without paying
3. No automatic downgrade mechanism

## Example Case
- **User:** imanirenee@hotmail.com
- **Issue:** Payment failed on Jan 11th (card declined)
- **Current State:** Still showing as Pro user
- **Expected:** Should be downgraded to Free tier

## Solution Implemented

### 1. Added `invoice.payment_failed` Webhook Handler
**Location:** `src/app/api/stripe/webhook/route.ts`

**What it does:**
- Listens for Stripe `invoice.payment_failed` events
- Finds the user associated with the failed payment
- Immediately downgrades user to Free tier
- Updates both `usage_tracking` and `subscriptions` tables
- Logs detailed information for debugging

**Downgrade actions:**
```typescript
- plan_type: 'free'
- subscription_tier: 'free'
- subscription_end_date: now
- max_lifetime_generations: 3 (reset to free limit)
- subscriptions.status: 'payment_failed'
```

### 2. Added `invoice.payment_action_required` Webhook Handler
**What it does:**
- Listens for when Stripe needs user action (e.g., 3D Secure)
- Logs the event for monitoring
- TODO: Send email notification to user

### 3. User Lookup Strategy
The webhook uses a fallback strategy to find users:
1. Try `customer.metadata.supabase_user_id`
2. Fallback to `subscriptions` table lookup by `stripe_customer_id`
3. Fallback to `purchases` table lookup by `stripe_customer_id`

This ensures we can always find the user even if metadata is missing.

## Stripe Webhook Events Now Handled

| Event | Action | Status |
|-------|--------|--------|
| `checkout.session.completed` | Upgrade to Pro | ✅ Existing |
| `customer.subscription.created` | Upgrade to Pro | ✅ Existing |
| `customer.subscription.updated` | Update period end | ✅ Existing |
| `customer.subscription.deleted` | Downgrade to Free | ✅ Existing |
| `invoice.payment_failed` | **Downgrade to Free** | ✅ **NEW** |
| `invoice.payment_action_required` | Log & notify | ✅ **NEW** |
| `payment_intent.succeeded` | Mark payment complete | ✅ Existing |
| `payment_intent.payment_failed` | Mark payment failed | ✅ Existing |

## Testing Required

1. **Test failed payment flow:**
   - Use Stripe test card `4000000000000341` (card declined)
   - Verify user is downgraded to Free
   - Verify dashboard MRR updates correctly

2. **Test payment action required:**
   - Use Stripe test card `4000002500003155` (requires 3D Secure)
   - Verify webhook logs the event

3. **Verify existing subscriptions:**
   - Run `migrations/debug-subscription-states.sql` to check current states
   - Manually fix any users stuck in Pro with failed payments

## Next Steps

1. ✅ Deploy webhook changes to production
2. ⏳ Configure Stripe webhook to send `invoice.payment_failed` events
3. ⏳ Run SQL query to identify users with expired/failed subscriptions
4. ⏳ Manually downgrade any users currently stuck in Pro
5. ⏳ Implement email notifications for payment failures
6. ⏳ Verify dashboard MRR reflects accurate subscription states

## Dashboard Impact

After deployment and cleanup:
- **Paying Customers:** Should show only active paying users
- **MRR:** Should reflect actual Stripe subscription amounts
- **Pro Users:** Should exclude users with failed/expired payments

## Stripe Dashboard Configuration

Ensure these webhook events are enabled in Stripe Dashboard:
- `invoice.payment_failed` ← **CRITICAL**
- `invoice.payment_action_required`
- All existing events (checkout.session.completed, customer.subscription.*, etc.)
