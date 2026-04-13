# Quick Stripe Setup - 5 Minutes ⚡

## 🎯 What You Need to Do

You're currently using **inline pricing** which works but has limitations. Here's how to set up a proper Stripe Product and 50% off coupon in 5 minutes.

---

## Step 1: Create Product (2 minutes)

### Go to Stripe Dashboard
1. **Visit**: https://dashboard.stripe.com/products
2. **Click**: "Add product" button (top right)

### Fill in Product Details
```
Name: CV Adapter Pro - 100 Lifetime Generations
Description: Get 100 AI-powered CV generations that never expire. Perfect for job seekers applying to multiple positions.

Pricing:
- Price: 5.00
- Currency: GBP (£)
- Billing: One time

[Save product]
```

### Copy the Price ID
After saving, you'll see a **Price ID** like: `price_1AbCdEfGhIjKlMnO`

**COPY THIS!** You'll need it in Step 3.

---

## Step 2: Create 50% Off Coupon (1 minute)

### Go to Coupons
1. **Visit**: https://dashboard.stripe.com/coupons
2. **Click**: "Create coupon"

### Fill in Coupon Details
```
Name: Launch Special - 50% Off
Coupon ID: LAUNCH50
Type: Percentage discount
Discount: 50%
Duration: Once

Optional Settings:
- Max redemptions: 100 (first 100 customers only)
- Redeem by: [7 days from now] (creates urgency)

[Create coupon]
```

---

## Step 3: Update Environment Variables (1 minute)

### Local Development (.env.local)
Add these lines:
```env
# Stripe Product & Price
STRIPE_PRICE_ID_PRO=price_1AbCdEfGhIjKlMnO

# Auto-apply 50% off coupon (optional - for automatic discount)
STRIPE_DEFAULT_COUPON=LAUNCH50
```

### Vercel Production
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add `STRIPE_PRICE_ID_PRO` = `price_1AbCdEfGhIjKlMnO`
3. Add `STRIPE_DEFAULT_COUPON` = `LAUNCH50` (optional)
4. Click "Save"

---

## Step 4: Test (1 minute)

### Test Mode
1. Switch Stripe to **Test mode** (toggle in top right)
2. Create test product and coupon (same steps as above)
3. Use test Price ID in `.env.local`

### Test Payment
1. Go to your subscription page
2. Click "Upgrade to Pro"
3. At checkout, enter coupon: `LAUNCH50`
4. Verify price shows £2.50 (50% off £5.00)
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. Check Stripe Dashboard for payment

---

## 🎉 That's It!

### What You Get

**With Price ID**:
- ✅ Reusable product in Stripe
- ✅ Can create coupons
- ✅ Better tracking and reporting
- ✅ Easier to update pricing
- ✅ Professional setup

**With LAUNCH50 Coupon**:
- ✅ 50% off for first 100 customers
- ✅ Creates urgency (limited time/quantity)
- ✅ Lower barrier to entry (£2.50 vs £5)
- ✅ Better conversion rate
- ✅ Social proof ("Join 50 others who got 50% off!")

---

## 🚀 How It Works

### Option 1: Automatic Discount (Set STRIPE_DEFAULT_COUPON)
- Every checkout automatically gets 50% off
- No coupon code needed
- Shows as "LAUNCH50 applied" at checkout
- Perfect for limited-time promotions

### Option 2: Manual Coupon Entry (Don't set STRIPE_DEFAULT_COUPON)
- Users must enter "LAUNCH50" at checkout
- Stripe shows coupon input field
- More exclusive feeling
- Can track who knows about the promo

### Option 3: Both
- Set `allow_promotion_codes: true` (already done)
- Users can enter any valid coupon
- You can create multiple coupons (LAUNCH50, FRIEND50, etc.)

---

## 💡 Marketing Ideas

### Upgrade Modal Message
```
🎉 LAUNCH SPECIAL: 50% OFF!

Get 100 Lifetime Generations for just £2.50
Regular price: £5.00 | You save: £2.50

✅ Only £0.025 per generation
✅ Limited to first 100 customers
✅ Offer ends in 7 days

Discount automatically applied at checkout!
```

### Dashboard Banner
```
⚡ LIMITED TIME: 50% OFF PRO!
Only 47 spots left at this price!
[Upgrade Now →]
```

### Urgency Tactics
- "Only 47 of 100 spots left!"
- "Offer ends in 3 days, 14 hours"
- "Last chance - 5 spots remaining!"

---

## 📊 Expected Impact

### Current (No Coupon)
- Price: £5.00
- Conversion: 5-10%
- Revenue: £52.50-£105/month

### With 50% Off
- Price: £2.50
- Conversion: 10-20% (lower barrier)
- Revenue: £52.50-£105/month (same or better due to volume!)
- **Bonus**: More users = more social proof = higher conversion later

### After Coupon Expires
- Price: Back to £5.00
- Conversion: 7-12% (higher than before!)
- Revenue: £73.50-£126/month
- **Why**: Social proof from early adopters

---

## ⚠️ Important Notes

### Coupon Duration
- **7 days** is aggressive but creates urgency
- **14 days** is more reasonable for testing
- **30 days** gives you more data but less urgency

### Max Redemptions
- **100 customers** = good scarcity
- **Unlimited** = less urgency but more conversions
- **50 customers** = very exclusive, high urgency

### Pricing Psychology
- £2.50 feels like a "no-brainer" purchase
- £5.00 is still very reasonable
- 50% off is a strong discount (don't overuse)
- Consider 30% off for longer-term promos

---

## 🔍 How to Track

### Stripe Dashboard
1. Go to Coupons
2. Click "LAUNCH50"
3. See: Times redeemed, revenue impact

### Admin Dashboard
After deployment:
- Track conversion rate with coupon
- Compare to conversion without
- Monitor redemption count
- Adjust strategy based on data

---

## 🎯 Quick Checklist

- [ ] Create Product in Stripe
- [ ] Copy Price ID
- [ ] Create LAUNCH50 coupon
- [ ] Add STRIPE_PRICE_ID_PRO to .env.local
- [ ] Add STRIPE_DEFAULT_COUPON=LAUNCH50 to .env.local (optional)
- [ ] Test in Stripe test mode
- [ ] Add to Vercel environment variables
- [ ] Deploy to production
- [ ] Announce the offer!
- [ ] Monitor redemptions
- [ ] Update marketing copy with urgency

---

## 🚀 Ready to Launch?

1. **Do Steps 1-3 above** (5 minutes)
2. **Test locally** (2 minutes)
3. **Deploy to Vercel** (automatic)
4. **Announce the offer** (email, dashboard, social media)
5. **Watch conversions roll in!** 🎉

---

**Need help?** Check `STRIPE-SETUP-GUIDE.md` for detailed instructions.

**Questions?** The code is already updated and ready to use the Price ID and coupon!
