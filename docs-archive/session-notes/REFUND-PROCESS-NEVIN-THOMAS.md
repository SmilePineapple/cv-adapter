# Refund Process - Nevin Thomas (nevinthomas2020@ce.ajce.in)

**Date:** December 9, 2025  
**Amount:** £49 (Annual Pro subscription)  
**Reason:** Product not meeting expectations, signed up 2 days ago  
**Customer Status:** Pro Annual subscriber

---

## Step 1: Find Stripe Customer & Subscription

### Option A: Via Stripe Dashboard (RECOMMENDED)
1. Go to https://dashboard.stripe.com/customers
2. Search for email: `nevinthomas2020@ce.ajce.in`
3. Click on the customer
4. Find the subscription (should be active)
5. Note the **Subscription ID** (starts with `sub_`)
6. Note the **Payment Intent ID** or **Charge ID** (starts with `pi_` or `ch_`)

### Option B: Via Supabase Database
Run this query in Supabase SQL Editor:
```sql
-- Find user and subscription details
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  ut.subscription_tier,
  ut.stripe_customer_id,
  ut.stripe_subscription_id,
  ut.subscription_status,
  ut.subscription_start_date,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations
FROM profiles p
JOIN usage_tracking ut ON p.id = ut.user_id
WHERE p.email = 'nevinthomas2020@ce.ajce.in';
```

---

## Step 2: Issue Refund in Stripe

### Via Stripe Dashboard (EASIEST)
1. In Stripe Dashboard, go to **Payments** → **All payments**
2. Search for customer email: `nevinthomas2020@ce.ajce.in`
3. Find the £49 payment (should be recent - 2 days ago)
4. Click on the payment
5. Click **"Refund"** button (top right)
6. Select **"Full refund"** (£49.00)
7. Add reason: "Customer request - product not meeting expectations"
8. Click **"Refund £49.00"**

### Via Stripe CLI (Alternative)
```bash
# List recent charges for customer
stripe charges list --customer <customer_id> --limit 5

# Issue full refund
stripe refunds create --charge <charge_id> --reason requested_by_customer
```

---

## Step 3: Cancel Subscription in Stripe

### Via Stripe Dashboard
1. Go back to the customer page
2. Find the active subscription
3. Click on the subscription
4. Click **"Cancel subscription"** (top right)
5. Select **"Cancel immediately"**
6. Add reason: "Customer request - full refund issued"
7. Click **"Cancel subscription"**

### Via Stripe CLI (Alternative)
```bash
stripe subscriptions cancel <subscription_id>
```

---

## Step 4: Update Database (IMPORTANT)

Run this SQL script in Supabase SQL Editor:

```sql
-- Update user to free tier after refund
-- Email: nevinthomas2020@ce.ajce.in

-- Step 1: Find the user
SELECT 
  p.id as user_id,
  p.email,
  ut.subscription_tier,
  ut.stripe_subscription_id
FROM profiles p
JOIN usage_tracking ut ON p.id = ut.user_id
WHERE p.email = 'nevinthomas2020@ce.ajce.in';

-- Step 2: Downgrade to free tier
UPDATE usage_tracking
SET 
  subscription_tier = 'free',
  subscription_status = 'canceled',
  stripe_subscription_id = NULL,
  stripe_customer_id = NULL,  -- Optional: keep for records
  max_lifetime_generations = 1,  -- Reset to free tier limit
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'nevinthomas2020@ce.ajce.in'
);

-- Step 3: Verify the update
SELECT 
  p.email,
  ut.subscription_tier,
  ut.subscription_status,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  ut.stripe_subscription_id
FROM profiles p
JOIN usage_tracking ut ON p.id = ut.user_id
WHERE p.email = 'nevinthomas2020@ce.ajce.in';

-- Expected result:
-- subscription_tier: 'free'
-- subscription_status: 'canceled'
-- max_lifetime_generations: 1
-- stripe_subscription_id: NULL
```

---

## Step 5: Send Confirmation Email

**Subject:** Refund Processed - £49 Returned to Your Account

---

Hi Nevin,

Thank you for your email and for giving CV Adapter a try.

I completely understand that our product wasn't the right fit for your needs, and I appreciate you letting us know.

**Refund Processed:**
- ✅ Full refund of £49.00 issued to your original payment method
- ✅ Subscription canceled immediately
- ✅ You should see the refund in 5-10 business days (depending on your bank)

**What Happens Next:**
- Your account has been downgraded to the free tier (1 free generation)
- You can still access your existing CV generations
- No further charges will be made

**We'd Love Your Feedback:**
If you have a moment, could you share what you were looking for that we didn't provide? Your feedback helps us improve for future users.

Thank you for trying CV Adapter, and I wish you the best in finding the right tool for your needs.

Best regards,  
Jake  
CV Adapter Support

---

## Step 6: Document the Refund

Add to internal notes:
```
Date: Dec 9, 2025
Customer: Nevin Thomas (nevinthomas2020@ce.ajce.in)
Amount: £49.00 (Annual Pro)
Reason: Product not meeting expectations
Signed up: 2 days ago
Refund: Full refund issued
Status: Subscription canceled, downgraded to free
```

---

## Verification Checklist

- [ ] Stripe refund issued (£49.00)
- [ ] Stripe subscription canceled
- [ ] Database updated (free tier)
- [ ] Confirmation email sent
- [ ] Customer can still access existing generations
- [ ] No future charges will occur
- [ ] Refund documented in support system

---

## Prevention Notes

**Why did customer leave?**
- "Not helpful for my needs"
- "Wasn't what I expected"
- Signed up only 2 days ago

**Potential improvements:**
1. Better onboarding to set expectations
2. Clearer product demo/screenshots
3. Free trial before paid subscription
4. More detailed feature descriptions
5. Video tutorials showing use cases

**Action items:**
- Review onboarding flow
- Add product tour for new users
- Consider 7-day money-back guarantee messaging
- Improve landing page clarity
