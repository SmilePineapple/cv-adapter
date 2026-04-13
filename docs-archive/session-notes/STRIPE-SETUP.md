# Stripe Setup Guide for CV Adapter

## 🎯 Current Status
✅ **Stripe API routes created**
✅ **Subscription UI completed**  
✅ **Webhook handler ready**
🔧 **Need real Stripe keys and product setup**

## 📋 Setup Steps

### 1. Create Stripe Account
1. Go to https://dashboard.stripe.com
2. Sign up or log in
3. Activate your account

### 2. Create Products and Prices
In your Stripe Dashboard:

1. **Go to Products** → Create Product
2. **Create "CV Adapter Pro"**:
   - Name: `CV Adapter Pro`
   - Description: `Unlimited CV generations and premium features`
   - Pricing: `$9.99/month` (recurring)
   - Copy the **Price ID** (starts with `price_`)

### 3. Get API Keys
In Stripe Dashboard → Developers → API Keys:

1. **Publishable Key** (starts with `pk_test_` or `pk_live_`)
2. **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 4. Update Environment Variables
Update `.env.local`:

```env
# Replace with your real Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. ✅ Price ID Updated
✅ **Already configured**: `price_1SBByxEFkh28oI4Tf8LVjPoe`
✅ **Pricing**: £5/month for Pro plan
✅ **Limits**: 3 free generations, 100 pro generations

### 6. Setup Webhook (For Production)
1. **Stripe Dashboard** → Developers → Webhooks
2. **Add Endpoint**: `https://your-domain.com/api/stripe/webhook`
3. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy Webhook Secret** → Update `STRIPE_WEBHOOK_SECRET`

### 7. Test Subscription Flow
1. Go to `/subscription`
2. Click "Upgrade to Pro"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription in database

## 🧪 Test Cards
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 🗄️ Database Schema
The subscription system uses these tables:
- `subscriptions` - Stores subscription status
- `profiles` - Stores Stripe customer IDs

## 🔧 API Endpoints Created
- `/api/stripe/create-checkout` - Creates Stripe checkout session
- `/api/stripe/webhook` - Handles Stripe events

## 🚀 Production Checklist
- [ ] Real Stripe account activated
- [ ] Products and prices created
- [ ] Real API keys added to production environment
- [ ] Webhook endpoint configured
- [ ] Test subscription flow
- [ ] Update price IDs in code

## 💡 Notes
- Currently using test mode setup
- Free tier: 50 generations/month (increased for testing)
- Pro tier: Unlimited generations
- Subscription handles usage limits automatically
