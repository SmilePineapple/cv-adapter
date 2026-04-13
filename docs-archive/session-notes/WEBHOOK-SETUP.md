# Stripe Webhook Setup Guide

## 🚨 CRITICAL: Without webhooks, payments won't upgrade users!

## Option 1: Local Development with Stripe CLI (RECOMMENDED FOR TESTING)

### Step 1: Install Stripe CLI
```bash
# Download from: https://stripe.com/docs/stripe-cli
# Or use Chocolatey on Windows:
choco install stripe
```

### Step 2: Login to Stripe
```bash
stripe login
```
This will open your browser to authenticate.

### Step 3: Forward Webhooks to Localhost
```bash
# Run this in a separate terminal - keep it running!
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Copy the Webhook Secret
Copy the `whsec_xxxxxxxxxxxxx` value and update your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Restart Your Dev Server
```bash
npm run dev
```

### Step 6: Test a Payment
1. Go to http://localhost:3000
2. Sign up/login
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Watch the Stripe CLI terminal - you should see webhook events!
6. Check your account - should be upgraded to Pro!

---

## Option 2: Production Deployment (mycvbuddy.com)

### Step 1: Deploy Your App
Make sure your app is deployed to Vercel/Netlify with the latest code.

### Step 2: Create Production Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Enter your webhook URL**:
   ```
   https://www.mycvbuddy.com/api/stripe/webhook
   ```
   OR
   ```
   https://www.mycvbuddy.co.uk/api/stripe/webhook
   ```

4. **Select events to listen for**:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. **Click "Add endpoint"**

6. **Reveal the signing secret**:
   - Click on your new webhook
   - Click "Reveal" next to "Signing secret"
   - Copy the `whsec_xxxxxxxxxxxxx` value

### Step 3: Update Production Environment Variables

In your Vercel/Netlify dashboard:
1. Go to Settings → Environment Variables
2. Update `STRIPE_WEBHOOK_SECRET` with the production secret
3. Redeploy your app

### Step 4: Test Production Webhook

1. Go to your webhook in Stripe Dashboard
2. Click "Send test webhook"
3. Select `checkout.session.completed`
4. Click "Send test webhook"
5. Check the "Response" tab - should show `200 OK`

---

## 🔍 Debugging Webhooks

### Check if Webhook is Receiving Events

In Stripe Dashboard → Webhooks → Your endpoint:
- **Recent events**: Should show incoming events
- **Response codes**: Should be `200` (success)
- **If 400/500 errors**: Check your server logs

### Common Issues

#### 1. Webhook Secret Mismatch
**Error**: `Invalid signature`
**Fix**: Make sure `.env.local` has the correct `STRIPE_WEBHOOK_SECRET`

#### 2. Webhook Not Receiving Events
**Error**: No events showing in Stripe Dashboard
**Fix**: 
- Check webhook URL is correct
- Make sure your app is running
- For localhost, make sure Stripe CLI is running

#### 3. Database Not Updating
**Error**: Payment succeeds but user not upgraded
**Fix**: Check server logs for errors in webhook handler

### View Webhook Logs

Check your server console when webhook fires. You should see:
```
[Webhook] Checkout completed: { customerId: 'cus_xxx', paymentIntentId: 'pi_xxx', mode: 'payment' }
[Webhook] Processing one-time payment for user: xxx-xxx-xxx
[Webhook] User upgraded to Pro successfully
```

---

## 🧪 Testing Webhook Locally

### Test 1: Trigger Test Webhook
```bash
# In Stripe CLI terminal
stripe trigger checkout.session.completed
```

### Test 2: Make Real Test Payment
1. Go to http://localhost:3000
2. Click "Upgrade to Pro"
3. Use test card: `4242 4242 4242 4242`
4. Watch Stripe CLI terminal for webhook events
5. Check database:
   ```sql
   SELECT plan_type, max_lifetime_generations FROM usage_tracking WHERE user_id = 'YOUR_ID';
   ```

### Test 3: Check Webhook Response
In Stripe Dashboard → Webhooks → Your endpoint → Recent events:
- Click on an event
- Check "Response" tab
- Should show `200 OK` with `{"received":true}`

---

## 📋 Webhook Checklist

### Local Development
- [ ] Stripe CLI installed
- [ ] `stripe login` completed
- [ ] `stripe listen --forward-to localhost:3000/api/stripe/webhook` running
- [ ] Webhook secret copied to `.env.local`
- [ ] Dev server restarted
- [ ] Test payment successful
- [ ] User upgraded to Pro in database

### Production
- [ ] App deployed to production
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Webhook URL: `https://www.mycvbuddy.com/api/stripe/webhook`
- [ ] Events selected: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Webhook secret copied to production env vars
- [ ] App redeployed
- [ ] Test webhook sent successfully
- [ ] Real payment test successful

---

## 🚀 Quick Start (TL;DR)

### For Localhost Testing:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the whsec_xxx secret to .env.local
# Restart dev server
# Test payment!
```

### For Production:
1. Deploy app to mycvbuddy.com
2. Create webhook in Stripe Dashboard: `https://www.mycvbuddy.com/api/stripe/webhook`
3. Add webhook secret to production env vars
4. Redeploy
5. Test!

---

## ❓ FAQ

**Q: Do I need webhooks for localhost testing?**
A: YES! Without webhooks, payments won't upgrade users even in test mode.

**Q: Can I use the same webhook secret for localhost and production?**
A: NO! Localhost uses Stripe CLI secret, production uses Dashboard webhook secret.

**Q: What if I already made test payments without webhooks?**
A: Run the `manual-upgrade-user.sql` script to manually upgrade your account.

**Q: How do I know if webhooks are working?**
A: Check Stripe Dashboard → Webhooks → Recent events. Should show `200 OK` responses.

**Q: Why did my payment redirect to /auth/login?**
A: This is the success URL. The webhook should upgrade your account in the background. If webhook isn't set up, you'll stay on free plan.

---

## 🆘 Still Having Issues?

1. **Check server logs** when making a payment
2. **Check Stripe Dashboard** → Webhooks → Recent events
3. **Verify webhook secret** matches `.env.local`
4. **Make sure Stripe CLI is running** (for localhost)
5. **Check database** to see if purchase was recorded

If webhook fires but user not upgraded, check:
- `purchases` table for new record
- `usage_tracking` table for `plan_type='pro'`
- Server logs for any errors in webhook handler
