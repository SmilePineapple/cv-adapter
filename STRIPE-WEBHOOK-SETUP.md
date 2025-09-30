# Stripe Webhook Setup & Testing Guide

## ✅ Webhook Implementation Complete

The Stripe webhook handler is now fully implemented with:
- ✅ Signature verification
- ✅ Subscription creation on checkout completion
- ✅ Subscription updates (including cancellation status)
- ✅ Subscription deletion handling
- ✅ Comprehensive error logging
- ✅ Support for `cancel_at_period_end` field

---

## 🔧 Setup Steps

### 1. **Create Stripe Account** (if not done)
1. Go to https://stripe.com
2. Sign up for an account
3. Complete business verification

### 2. **Get API Keys**
1. Go to Stripe Dashboard → Developers → API keys
2. Copy **Publishable key** and **Secret key**
3. Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. **Create Product & Price**
1. Go to Stripe Dashboard → Products
2. Click "Add product"
3. Name: "CV Adapter Pro"
4. Description: "Unlimited CV generations and premium features"
5. Pricing: £5.00 GBP / month (recurring)
6. Click "Save product"
7. Copy the **Price ID** (starts with `price_`)
8. Update your code to use this price ID

### 4. **Set Up Webhook (Development)**

#### Option A: Stripe CLI (Recommended for local testing)
```bash
# Install Stripe CLI
# Windows: https://github.com/stripe/stripe-cli/releases
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret (whsec_...)
# Copy it to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Option B: ngrok (Alternative)
```bash
# Install ngrok: https://ngrok.com/download

# Start your Next.js server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Go to Stripe Dashboard → Developers → Webhooks
# Click "Add endpoint"
# URL: https://abc123.ngrok.io/api/stripe/webhook
# Events to send: Select all subscription events
# Click "Add endpoint"
# Copy the webhook signing secret
```

### 5. **Configure Webhook Events**
Select these events in Stripe Dashboard:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded` (optional, for payment tracking)
- ✅ `invoice.payment_failed` (optional, for failed payments)

### 6. **Production Webhook Setup**
After deploying to Vercel:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Select the same events as above
5. Click "Add endpoint"
6. Copy the **Webhook signing secret**
7. Add to Vercel environment variables:
   - `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🧪 Testing the Webhook

### Test 1: Subscription Creation
```bash
# Using Stripe CLI
stripe trigger checkout.session.completed

# Or manually:
# 1. Go to http://localhost:3000/subscription
# 2. Click "Upgrade to Pro"
# 3. Use test card: 4242 4242 4242 4242
# 4. Expiry: Any future date (e.g., 12/25)
# 5. CVC: Any 3 digits (e.g., 123)
# 6. Complete checkout
# 7. Check console logs for webhook events
# 8. Verify subscription in database
```

### Test 2: Subscription Update
```bash
# Using Stripe CLI
stripe trigger customer.subscription.updated

# Or manually in Stripe Dashboard:
# 1. Go to Customers → Select customer
# 2. Click on subscription
# 3. Click "Update subscription"
# 4. Make a change (e.g., add metadata)
# 5. Save
# 6. Check webhook logs
```

### Test 3: Subscription Cancellation
```bash
# Using Stripe CLI
stripe trigger customer.subscription.deleted

# Or manually:
# 1. Go to http://localhost:3000/subscription
# 2. Click "Cancel Subscription"
# 3. Confirm cancellation
# 4. Check webhook logs
# 5. Verify cancel_at_period_end is set in database
```

### Test 4: Verify Database Updates
```sql
-- Run in Supabase SQL Editor
SELECT 
  user_id,
  stripe_subscription_id,
  status,
  price_id,
  cancel_at_period_end,
  current_period_end
FROM subscriptions
ORDER BY created_at DESC
LIMIT 5;
```

---

## 📊 Webhook Event Flow

### Successful Subscription Flow
```
1. User clicks "Upgrade to Pro"
   ↓
2. Frontend calls /api/stripe/create-checkout
   ↓
3. Stripe Checkout page opens
   ↓
4. User enters payment details
   ↓
5. Payment successful
   ↓
6. Stripe sends webhook: checkout.session.completed
   ↓
7. Webhook handler creates subscription in database
   ↓
8. User redirected to dashboard?success=true
   ↓
9. Dashboard shows Pro status
```

### Cancellation Flow
```
1. User clicks "Cancel Subscription"
   ↓
2. Frontend calls /api/stripe/cancel-subscription
   ↓
3. Stripe API cancels subscription (at period end)
   ↓
4. Stripe sends webhook: customer.subscription.updated
   ↓
5. Webhook handler updates cancel_at_period_end = true
   ↓
6. User keeps Pro access until period_end
   ↓
7. At period_end, Stripe sends: customer.subscription.deleted
   ↓
8. Webhook handler sets status = 'canceled'
   ↓
9. User reverts to free plan
```

---

## 🔍 Debugging Webhooks

### Check Webhook Logs
```bash
# Stripe CLI
stripe logs tail

# Or in Stripe Dashboard:
# Developers → Webhooks → Select endpoint → View logs
```

### Common Issues

#### Issue 1: Webhook signature verification failed
**Cause**: Wrong webhook secret
**Fix**: 
- Make sure `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe
- For Stripe CLI, use the secret from `stripe listen` output
- For production, use the secret from Stripe Dashboard webhook settings

#### Issue 2: No user_id in session metadata
**Cause**: Checkout session not created with metadata
**Fix**: 
- Verify `/api/stripe/create-checkout` includes `metadata: { user_id: userId }`
- Check line 66-68 in `create-checkout/route.ts`

#### Issue 3: Subscription not created in database
**Cause**: Database error or RLS policy blocking insert
**Fix**:
- Check webhook logs in console
- Verify RLS policies allow INSERT for service role
- Run `COMPLETE-SUBSCRIPTION-SETUP.sql` to fix policies

#### Issue 4: cancel_at_period_end column not found
**Cause**: Column doesn't exist in database
**Fix**:
- Run `add-cancel-column.sql` in Supabase SQL Editor

---

## 🔐 Security Best Practices

### 1. **Always Verify Webhook Signatures**
```typescript
// Already implemented in webhook/route.ts
event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

### 2. **Use Idempotency**
```typescript
// Already implemented - upsert prevents duplicates
await supabase.from('subscriptions').upsert({...})
```

### 3. **Handle Errors Gracefully**
```typescript
// Already implemented - try/catch with logging
try {
  // Process webhook
} catch (error) {
  console.error('[Webhook] Error:', error)
  return NextResponse.json({ error: '...' }, { status: 500 })
}
```

### 4. **Never Trust Client-Side Data**
- ✅ Webhook verifies with Stripe directly
- ✅ Uses server-side Stripe API
- ✅ No client data trusted

---

## 📝 Environment Variables Checklist

### Development (.env.local)
```env
# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe CLI or ngrok

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)
```env
# Stripe Live Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe Dashboard webhook

# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## ✅ Testing Checklist

Before going live, test:
- [ ] Subscription creation (test card)
- [ ] Subscription shows in database
- [ ] User sees Pro status on dashboard
- [ ] Generate unlimited CVs (Pro feature)
- [ ] Cancel subscription
- [ ] Verify cancel_at_period_end is set
- [ ] User still has Pro access
- [ ] Verify subscription updates in database
- [ ] Test failed payment (card: 4000 0000 0000 0341)
- [ ] Test webhook signature verification
- [ ] Check Stripe Dashboard for events
- [ ] Verify all webhook events are received

---

## 🚀 Production Deployment Steps

### 1. Switch to Live Mode
1. Go to Stripe Dashboard
2. Toggle from "Test mode" to "Live mode"
3. Copy live API keys
4. Update Vercel environment variables

### 2. Create Production Webhook
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events (same as test)
4. Copy webhook secret
5. Add to Vercel: `STRIPE_WEBHOOK_SECRET`

### 3. Test on Production
1. Create test account on production
2. Upgrade to Pro with real card (you can cancel immediately)
3. Verify subscription created
4. Cancel and verify cancellation works
5. Check webhook logs in Stripe Dashboard

### 4. Monitor
- Watch Stripe Dashboard → Events for webhook deliveries
- Check Vercel logs for any errors
- Monitor database for subscription records

---

## 📞 Support

### Stripe Support
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs/webhooks
- Support: https://support.stripe.com

### Webhook Testing
- Stripe CLI: https://stripe.com/docs/stripe-cli
- Test Cards: https://stripe.com/docs/testing

---

## 🎉 You're Ready!

The webhook is fully implemented and ready for testing. Follow the steps above to:
1. Set up Stripe CLI for local testing
2. Test subscription creation
3. Test cancellation
4. Deploy to production
5. Set up production webhook

**Estimated time**: 2-3 hours for full setup and testing.

Good luck! 🚀
