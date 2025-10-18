# Stripe Product & Coupon Setup Guide

## 🎯 Current Issue

You're using **inline pricing** (`price_data`) which creates products on-the-fly. This means:
- ❌ No reusable Product in Stripe Dashboard
- ❌ Can't create coupons for specific products
- ❌ Harder to track and manage
- ❌ Can't update pricing easily

## ✅ Solution: Create Proper Product & Price

---

## Step 1: Create Product in Stripe Dashboard

### Option A: Via Stripe Dashboard (Recommended)

1. **Go to**: https://dashboard.stripe.com/products
2. **Click**: "Add product"
3. **Fill in**:
   - **Name**: `CV Adapter Pro - 100 Lifetime Generations`
   - **Description**: `Get 100 AI-powered CV generations that never expire. Perfect for job seekers applying to multiple positions.`
   - **Image**: Upload your logo/product image (optional)
   
4. **Pricing**:
   - **Price**: `5.00`
   - **Currency**: `GBP (£)`
   - **Billing period**: `One time`
   
5. **Click**: "Save product"

6. **Copy the Price ID**: It will look like `price_1AbCdEfGhIjKlMnO`

### Option B: Via Stripe CLI (Alternative)

```bash
# Create Product
stripe products create \
  --name "CV Adapter Pro - 100 Lifetime Generations" \
  --description "100 AI-powered CV generations that never expire"

# Create Price (use product ID from above)
stripe prices create \
  --product prod_XXXXX \
  --unit-amount 500 \
  --currency gbp
```

---

## Step 2: Create 50% Off Coupon

### Via Stripe Dashboard (Recommended)

1. **Go to**: https://dashboard.stripe.com/coupons
2. **Click**: "Create coupon"
3. **Fill in**:
   - **Name**: `LAUNCH50` (or your choice)
   - **Coupon ID**: `LAUNCH50` (customer-facing code)
   - **Type**: `Percentage discount`
   - **Discount**: `50%`
   - **Duration**: Choose one:
     - `Once` - Applies once per customer
     - `Forever` - Applies to all future payments (not relevant for one-time)
     - `Repeating` - For subscriptions only
   
4. **Redemption limits** (optional):
   - Max redemptions: `100` (first 100 customers)
   - Redeem by: Set expiry date (e.g., 7 days from now)

5. **Click**: "Create coupon"

### Via Stripe CLI (Alternative)

```bash
# 50% off, limited to first 100 customers, expires in 7 days
stripe coupons create \
  --percent-off 50 \
  --id LAUNCH50 \
  --max-redemptions 100 \
  --redeem-by $(date -d '+7 days' +%s)
```

---

## Step 3: Update Environment Variables

Add to your `.env.local`:

```env
# Stripe Product & Price IDs
STRIPE_PRICE_ID_PRO=price_1AbCdEfGhIjKlMnO

# Optional: Default coupon for promotions
STRIPE_DEFAULT_COUPON=LAUNCH50
```

Add to Vercel Environment Variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `STRIPE_PRICE_ID_PRO` with your Price ID
3. Add `STRIPE_DEFAULT_COUPON` with `LAUNCH50` (optional)

---

## Step 4: Test in Stripe Test Mode

### Create Test Product & Coupon

1. Switch to **Test mode** in Stripe Dashboard (toggle in top right)
2. Repeat Steps 1 & 2 above
3. Use test Price ID in `.env.local`
4. Test with card: `4242 4242 4242 4242`

### Test Coupon

1. Go through checkout
2. Enter coupon code `LAUNCH50`
3. Verify price drops from £5.00 to £2.50
4. Complete test payment
5. Check Stripe Dashboard for payment

---

## 📊 Coupon Strategy Recommendations

### Option 1: Limited Time Launch Offer
```
Code: LAUNCH50
Discount: 50% off
Duration: 7 days
Max redemptions: 100
Message: "🎉 Launch Special: 50% off for first 100 customers!"
```

### Option 2: First-Time User Discount
```
Code: FIRST50
Discount: 50% off
Duration: Once per customer
Max redemptions: Unlimited
Message: "Welcome! Get 50% off your first purchase"
```

### Option 3: Urgency-Based Offer
```
Code: WEEKEND50
Discount: 50% off
Duration: This weekend only
Max redemptions: 50
Message: "⏰ Weekend Special: 50% off - Ends Monday!"
```

### Option 4: Tiered Discounts
```
EARLY30: 30% off (first 50 customers)
LAUNCH40: 40% off (next 50 customers)
FINAL50: 50% off (next 50 customers)
```

---

## 🎯 Marketing Copy for 50% Off

### Upgrade Modal
```
🎉 LAUNCH SPECIAL: 50% OFF!

Get 100 Lifetime Generations for just £2.50
(Regular price: £5.00)

✅ Only £0.025 per generation
✅ Limited to first 100 customers
✅ Offer ends in 7 days

Use code: LAUNCH50 at checkout
```

### Dashboard Banner
```
⚡ LIMITED TIME: Get Pro for 50% off!
Use code LAUNCH50 - Only 47 spots left!
[Upgrade Now →]
```

### Email Campaign
```
Subject: 🎉 You're invited: 50% off CV Adapter Pro

Hi [Name],

As one of our early users, you're getting exclusive access to our launch offer:

50% OFF Pro Plan - Just £2.50 (Regular: £5.00)

✅ 100 Lifetime Generations
✅ Never expires
✅ Only £0.025 per generation

This offer is limited to the first 100 customers and expires in 7 days.

Use code: LAUNCH50

[Claim Your Discount →]
```

---

## 📈 Expected Impact

### Without Coupon (Current)
- Price: £5.00
- Conversion: 5-10% (estimated)
- Revenue/month: £52.50-£105

### With 50% Off Coupon
- Price: £2.50
- Conversion: 10-20% (estimated, lower barrier)
- Revenue/month: £52.50-£105 (same or better due to volume)
- **Benefit**: More users convert, lower barrier to entry

### After Coupon Expires
- Price: Back to £5.00
- Conversion: 7-12% (higher than before due to social proof)
- Revenue/month: £73.50-£126

---

## 🔍 How to Track Coupon Usage

### In Stripe Dashboard
1. Go to: https://dashboard.stripe.com/coupons
2. Click on your coupon (e.g., LAUNCH50)
3. See: Times redeemed, revenue impact, etc.

### In Admin Dashboard
After implementing the updated checkout, you'll see:
- How many users used the coupon
- Revenue with vs without coupon
- Conversion rate comparison

---

## ⚠️ Important Notes

### Pricing Strategy
- **50% off is aggressive** - Great for launch, but don't run too long
- **Consider**: 30% off for longer-term promotions
- **Test**: Different discount levels to find sweet spot

### Scarcity Tactics
- "Only 47 spots left!" (update dynamically)
- "Offer ends in 3 days, 14 hours"
- "Last chance - expires midnight!"

### Coupon Stacking
- Decide: Can users combine coupons? (Usually no)
- Set in Stripe: "Allow promotion codes" setting

---

## 🚀 Next Steps

1. [ ] Create Product in Stripe Dashboard
2. [ ] Copy Price ID
3. [ ] Create LAUNCH50 coupon (50% off)
4. [ ] Update environment variables
5. [ ] Update checkout code (see updated route below)
6. [ ] Test in Stripe test mode
7. [ ] Deploy to production
8. [ ] Announce the offer!

---

## 📝 Quick Reference

### Stripe Dashboard Links
- Products: https://dashboard.stripe.com/products
- Coupons: https://dashboard.stripe.com/coupons
- Payments: https://dashboard.stripe.com/payments
- Customers: https://dashboard.stripe.com/customers

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### Coupon Codes to Consider
- `LAUNCH50` - Launch special
- `FIRST50` - First-time users
- `WEEKEND50` - Weekend special
- `EARLY50` - Early adopters
- `FRIEND50` - Referral discount

---

Ready to implement? See the updated checkout code in the next section!
