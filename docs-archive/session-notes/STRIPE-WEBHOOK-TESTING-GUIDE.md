# 🧪 STRIPE WEBHOOK TESTING GUIDE

**Section 1.9: Complete Testing Instructions**  
**Date**: October 23, 2025

---

## ✅ CURRENT STATUS

**Webhook Configuration**: ✅ Properly configured  
**Checkout Mode**: ✅ Subscription mode  
**Database Updates**: ✅ Configured to update `usage_tracking`  
**Webhook Secret**: ⚠️ Set to placeholder (`whsec_placeholder`)

---

## 📋 WHAT THE WEBHOOK DOES

When a user completes payment, the webhook:

1. ✅ Receives `checkout.session.completed` event from Stripe
2. ✅ Extracts `user_id` from session metadata
3. ✅ Updates `usage_tracking` table:
   - Sets `subscription_tier` to `pro_monthly` or `pro_annual`
   - Sets `subscription_start_date` to current timestamp
   - Sets `subscription_end_date` to subscription period end
4. ✅ Tracks analytics event
5. ✅ Returns success response

**Also Handles**:
- `customer.subscription.updated` - Updates subscription end date
- `customer.subscription.deleted` - Downgrades user to free
- `payment_intent.succeeded` - Records successful payment
- `payment_intent.payment_failed` - Records failed payment

---

## 🚀 OPTION 1: TEST WITHOUT STRIPE CLI (QUICK)

**You can test the payment flow without Stripe CLI by using Stripe's test mode directly:**

### **Step 1: Start Your Dev Server**

```powershell
npm run dev
```

### **Step 2: Go to Subscription Page**

Navigate to: `http://localhost:3000/subscription`

### **Step 3: Click "Upgrade to Pro"**

### **Step 4: Use Test Card**

**Card Number**: `4242 4242 4242 4242`  
**Expiry**: Any future date (e.g., `12/25`)  
**CVC**: Any 3 digits (e.g., `123`)  
**ZIP**: Any 5 digits (e.g., `12345`)

### **Step 5: Complete Payment**

Click "Subscribe" and wait for redirect

### **Step 6: Check Stripe Dashboard**

1. Go to: https://dashboard.stripe.com/test/events
2. Look for `checkout.session.completed` event
3. Click on it to see details
4. Check if webhook was sent

### **Step 7: Verify Database**

**In Supabase SQL Editor**, run:

```sql
SELECT 
  user_id,
  subscription_tier,
  subscription_start_date,
  subscription_end_date,
  lifetime_generation_count,
  updated_at
FROM usage_tracking
WHERE user_id = 'YOUR_USER_ID';
```

**Expected Result**:
- `subscription_tier`: `pro_monthly` or `pro_annual`
- `subscription_start_date`: Recent timestamp
- `subscription_end_date`: ~30 days from now (monthly) or ~365 days (annual)

### **Step 8: Test in App**

1. Go to dashboard: `http://localhost:3000/dashboard`
2. Check header shows "PRO" badge (not "FREE")
3. Try to generate unlimited CVs
4. Try to download DOCX (should work)
5. Try AI Review (should work)
6. Check no locked features

---

## 🔧 OPTION 2: TEST WITH STRIPE CLI (ADVANCED)

**For local webhook testing with real-time events:**

### **Step 1: Install Stripe CLI**

**Option A - Direct Download**:
1. Go to: https://stripe.com/docs/stripe-cli
2. Download Windows installer
3. Run installer
4. Restart PowerShell

**Option B - Using Scoop**:
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

### **Step 2: Login to Stripe**

```powershell
stripe login
```

This will open your browser to authenticate.

### **Step 3: Forward Webhooks to Local**

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**You'll see output like**:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### **Step 4: Update .env.local**

Copy the webhook secret and update `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### **Step 5: Restart Dev Server**

```powershell
# Stop current server (Ctrl+C)
npm run dev
```

### **Step 6: Test Payment Flow**

1. Go to: `http://localhost:3000/subscription`
2. Click "Upgrade to Pro"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment

### **Step 7: Watch Webhook Logs**

In the terminal running `stripe listen`, you'll see:
```
2025-10-23 13:00:00  --> checkout.session.completed [evt_xxxxx]
2025-10-23 13:00:01  <-- [200] POST http://localhost:3000/api/stripe/webhook [evt_xxxxx]
```

### **Step 8: Check Server Logs**

In your dev server terminal, look for:
```
[Webhook] Checkout completed: { customerId: 'cus_xxx', subscriptionId: 'sub_xxx', mode: 'subscription' }
[Webhook] Processing subscription for user: xxx Plan: monthly
[Webhook] User upgraded to Pro successfully: pro_monthly
```

### **Step 9: Verify Database**

Same as Option 1, Step 7.

---

## 🧪 TEST SCENARIOS

### **Scenario 1: Monthly Subscription** ✅

**Steps**:
1. Select "Monthly Plan" (£9.99/month)
2. Complete payment with test card
3. Verify `subscription_tier` = `pro_monthly`
4. Verify `subscription_end_date` is ~30 days from now

### **Scenario 2: Annual Subscription** ✅

**Steps**:
1. Select "Annual Plan" (£49/year)
2. Complete payment with test card
3. Verify `subscription_tier` = `pro_annual`
4. Verify `subscription_end_date` is ~365 days from now

### **Scenario 3: Subscription Cancellation** ✅

**Steps**:
1. Go to Stripe Dashboard → Customers
2. Find test customer
3. Click on subscription
4. Click "Cancel subscription"
5. Verify webhook receives `customer.subscription.deleted`
6. Verify `subscription_tier` reverts to `free`

### **Scenario 4: Failed Payment** ✅

**Steps**:
1. Use declined test card: `4000 0000 0000 0002`
2. Try to complete payment
3. Verify payment fails
4. Verify user remains on free tier

---

## 🔍 TROUBLESHOOTING

### **Issue: Webhook Secret Invalid**

**Symptom**: `Webhook signature verification failed`

**Solution**:
1. Make sure `.env.local` has correct `STRIPE_WEBHOOK_SECRET`
2. Restart dev server after updating
3. If using Stripe CLI, make sure it's running

### **Issue: User Not Upgraded**

**Symptom**: Payment succeeds but user still shows "FREE"

**Possible Causes**:
1. **Webhook not received** - Check Stripe Dashboard → Events
2. **user_id not in metadata** - Check checkout session metadata
3. **Database update failed** - Check server logs for errors

**Debug Steps**:
```sql
-- Check if user exists in usage_tracking
SELECT * FROM usage_tracking WHERE user_id = 'YOUR_USER_ID';

-- Check recent updates
SELECT * FROM usage_tracking 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;
```

### **Issue: Webhook Returns 500 Error**

**Symptom**: Webhook fails with 500 status

**Solution**:
1. Check server logs for error details
2. Verify Supabase service key is correct
3. Verify `usage_tracking` table exists
4. Check RLS policies allow service role to update

---

## ✅ SUCCESS CRITERIA

**Webhook is working correctly when**:

- [ ] Payment completes successfully
- [ ] Stripe Dashboard shows `checkout.session.completed` event
- [ ] Webhook endpoint returns 200 status
- [ ] Database shows `subscription_tier` updated
- [ ] Dashboard shows "PRO" badge
- [ ] User can access all Pro features
- [ ] No errors in server logs

---

## 📊 VERIFICATION CHECKLIST

### **Database Verification**

```sql
-- Check subscription status
SELECT 
  user_id,
  subscription_tier,
  subscription_start_date,
  subscription_end_date,
  lifetime_generation_count,
  max_lifetime_generations
FROM usage_tracking
WHERE user_id = 'YOUR_USER_ID';
```

**Expected for Pro User**:
- `subscription_tier`: `pro_monthly` or `pro_annual`
- `subscription_start_date`: Recent timestamp
- `subscription_end_date`: Future date (30 or 365 days)
- `max_lifetime_generations`: 100 (or unlimited)

### **UI Verification**

**Dashboard Header**:
- [ ] Shows "PRO" badge with crown icon
- [ ] No "Upgrade to Pro" button
- [ ] No feature comparison section

**Features**:
- [ ] Can generate unlimited CVs
- [ ] Can download all formats (PDF, DOCX, HTML, TXT)
- [ ] No watermarks on exports
- [ ] AI Review button works (no PRO badge)
- [ ] All templates unlocked
- [ ] Cover Letter page has no banner

---

## 🚀 NEXT STEPS AFTER TESTING

Once webhooks are working:

1. ✅ Mark Section 1.9 as complete
2. ⏭️ Move to Section 1.10: Final Testing
3. 🧪 Test complete user journeys
4. 🚀 Prepare for production deployment

---

## 📝 PRODUCTION DEPLOYMENT NOTES

**Before deploying to production**:

1. **Create Live Stripe Products**:
   - Go to Stripe Dashboard (live mode)
   - Create "Pro Monthly" product
   - Create "Pro Annual" product
   - Copy live Price IDs

2. **Update Environment Variables**:
   ```env
   STRIPE_SECRET_KEY=sk_live_xxxxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   STRIPE_PRICE_ID_PRO_MONTHLY=price_live_xxxxx
   STRIPE_PRICE_ID_PRO_ANNUAL=price_live_xxxxx
   ```

3. **Set Up Production Webhook**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.*`, `payment_intent.*`
   - Copy webhook signing secret
   - Add to production env: `STRIPE_WEBHOOK_SECRET=whsec_live_xxxxx`

4. **Test in Production**:
   - Use live test mode first
   - Then test with real card (small amount)
   - Verify webhook delivery
   - Monitor for errors

---

## 🎉 COMPLETION

**When you've verified**:
- ✅ Payment flow works
- ✅ Webhooks update database
- ✅ User sees Pro features
- ✅ No errors in logs

**Then you're ready for Section 1.10: Final Testing!**

---

**Questions or Issues?**
- Check Stripe Dashboard → Events for webhook delivery
- Check server logs for errors
- Check Supabase logs for database errors
- Verify all environment variables are set correctly
