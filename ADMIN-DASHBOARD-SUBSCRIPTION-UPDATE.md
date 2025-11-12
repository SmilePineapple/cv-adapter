# Admin Dashboard - Monthly Subscription Model Update

## 🎉 Congratulations on Your First Paying Customer!

The admin dashboard has been updated to properly track and display revenue from the new **monthly subscription model** (£9.99/month).

---

## Changes Made

### Revenue Calculation (API)
**File:** `src/app/api/admin/analytics/route.ts`

#### Old Model (One-Time Payments)
- Calculated revenue from `purchases` table
- One-time £5 payment for 100 lifetime generations
- No recurring revenue tracking

#### New Model (Monthly Subscriptions)
```typescript
// Monthly Pro: £9.99/month
// Annual Pro: £99/year (£8.25/month)

// Calculate Monthly Recurring Revenue (MRR)
const monthlyMRR = monthlyProCount * 9.99
const annualMRR = annualProCount * (99 / 12)
const totalMRR = monthlyMRR + annualMRR

// Calculate projected Annual Recurring Revenue (ARR)
const projectedARR = totalMRR * 12
```

#### Revenue Sources
1. **Primary:** Active subscriptions from `usage_tracking.subscription_tier`
   - `pro_monthly` = £9.99/month
   - `pro_annual` = £99/year (£8.25/month MRR)
2. **Legacy:** Old one-time purchases (if any exist)

---

### Admin Dashboard UI
**File:** `src/app/admin/page.tsx`

#### New Revenue Breakdown Section
Beautiful gradient card showing:
- **Monthly MRR:** Total monthly recurring revenue
- **Projected ARR:** Annual revenue projection (MRR × 12)
- **Monthly Subs:** Count of monthly subscribers + revenue
- **Annual Subs:** Count of annual subscribers + revenue

#### Updated Main Stats
- Changed "Total Revenue" to "Monthly Recurring Revenue"
- Shows MRR with projected ARR as subtext
- More relevant for subscription business model

#### Updated Secondary Stats
- Replaced "Pro Breakdown" with "Conversion Rate"
- Shows percentage of users who converted to Pro
- More actionable metric for growth

---

## What You'll See Now

### Main Dashboard Stats (Top Row)
1. **Total Users** - All registered users
2. **Pro Users** - Active paying subscribers
3. **Total Generations** - All CV generations
4. **Monthly Recurring Revenue** - Your monthly income

### Revenue Breakdown (Green Gradient Card)
```
┌─────────────────────────────────────────────────────┐
│ 💰 Revenue Breakdown                                │
├─────────────────────────────────────────────────────┤
│ Monthly MRR    Projected ARR    Monthly Subs    Annual Subs │
│ £9.99          £119.88          1               0           │
│ 1 monthly × £9.99  MRR × 12 months  £9.99/month    £0/month│
└─────────────────────────────────────────────────────┘
```

### User Table
- Shows subscription type for each Pro user
- Identifies: monthly, annual, lifetime (legacy), or free

---

## Revenue Metrics Explained

### Monthly Recurring Revenue (MRR)
- **What:** Predictable monthly income from subscriptions
- **Calculation:** (Monthly subs × £9.99) + (Annual subs × £8.25)
- **Why Important:** Shows current monthly cash flow

### Annual Recurring Revenue (ARR)
- **What:** Projected annual income if all subs continue
- **Calculation:** MRR × 12
- **Why Important:** Shows business scale and growth potential

### Example with Your First Customer
```
1 monthly subscriber at £9.99/month:
- MRR: £9.99
- ARR: £119.88 (£9.99 × 12)
- Lifetime Value (12 months): £119.88
```

---

## Growth Tracking

### Key Metrics to Watch
1. **MRR Growth Rate:** Month-over-month MRR increase
2. **Conversion Rate:** % of free users upgrading to Pro
3. **Churn Rate:** % of Pro users canceling (track in Stripe)
4. **Customer Lifetime Value (LTV):** Average revenue per Pro user

### Milestones
- ✅ **First Customer:** £9.99 MRR (You are here!)
- 🎯 **10 Customers:** £99.90 MRR, £1,199 ARR
- 🎯 **50 Customers:** £499.50 MRR, £5,994 ARR
- 🎯 **100 Customers:** £999 MRR, £11,988 ARR
- 🎯 **500 Customers:** £4,995 MRR, £59,940 ARR
- 🎯 **1,000 Customers:** £9,990 MRR, £119,880 ARR

---

## Data Sources

### Primary Source: `usage_tracking` Table
```sql
SELECT 
  subscription_tier,
  COUNT(*) as count
FROM usage_tracking
WHERE subscription_tier IN ('pro_monthly', 'pro_annual')
GROUP BY subscription_tier;
```

### Subscription Tiers
- `free` - Free tier (1 generation)
- `pro_monthly` - £9.99/month (unlimited)
- `pro_annual` - £99/year (unlimited, save 17%)

### Updated by Stripe Webhook
When a user subscribes via Stripe:
1. Stripe webhook fires (`customer.subscription.created`)
2. Updates `usage_tracking.subscription_tier` to `pro_monthly` or `pro_annual`
3. Admin dashboard immediately reflects new MRR

---

## Testing

### Verify Your First Customer
1. Go to `/admin` page
2. Check "Monthly Recurring Revenue" shows £9.99
3. Check "Projected ARR" shows £119.88
4. Check "Monthly Subs" shows 1
5. Check revenue breakdown card displays correctly

### Check User Details
1. Scroll to "All Users" table
2. Find your paying customer
3. Verify they show "👑 Pro" badge
4. Check their subscription type in the plan column

---

## Stripe Integration

### Webhook Events Handled
- `checkout.session.completed` - Initial payment
- `customer.subscription.created` - Subscription activated
- `customer.subscription.updated` - Subscription renewed
- `customer.subscription.deleted` - Subscription canceled

### Subscription Status
All handled automatically by webhook:
- **Active:** User has Pro access, counted in MRR
- **Canceled:** User loses Pro access, removed from MRR
- **Past Due:** Stripe handles payment retry logic

---

## Next Steps

### Monitor Your Growth
1. Check admin dashboard daily to see new subscribers
2. Watch MRR growth week-over-week
3. Track conversion rate (free → Pro)
4. Monitor churn in Stripe dashboard

### Optimize for Growth
1. **Improve Conversion:** A/B test pricing, CTAs, features
2. **Reduce Churn:** Add more value, improve UX, email campaigns
3. **Increase LTV:** Upsell annual plans (save 17%)
4. **Expand Market:** Add more languages, templates, features

### Revenue Goals
- **Month 1:** 10 customers = £99.90 MRR
- **Month 3:** 50 customers = £499.50 MRR
- **Month 6:** 100 customers = £999 MRR
- **Month 12:** 500 customers = £4,995 MRR

---

## Support

### If Revenue Doesn't Update
1. Check Stripe webhook is configured correctly
2. Verify webhook secret in `.env` file
3. Check Vercel logs for webhook errors
4. Ensure `usage_tracking` table is updated

### If User Shows as Free (But Paid)
1. Check `usage_tracking.subscription_tier` in Supabase
2. Should be `pro_monthly` or `pro_annual`
3. If not, webhook didn't fire - check Stripe logs
4. Manually update if needed (see `/admin/upgrade-user`)

---

## Deployment

**Status:** ✅ Deployed to production
**Commit:** `c606f84`
**Date:** November 12, 2025

The changes are live and tracking your first customer's subscription!

---

## Celebrate! 🎉

Your first paying customer is a huge milestone! This validates:
- ✅ Product-market fit
- ✅ Willingness to pay
- ✅ Value proposition
- ✅ Payment flow works

Keep building, keep growing! 🚀
