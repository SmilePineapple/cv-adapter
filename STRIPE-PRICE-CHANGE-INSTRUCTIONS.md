# Stripe Annual Price Change to £14.99

## ✅ Code Changes (COMPLETED)
- Updated fallback pricing from £29.99 → £14.99
- Updated all currency equivalents proportionally
- Updated savings percentage from 17% → 58%
- Committed: `633ef7d`

## 📋 Remaining Steps (DO THESE IN ORDER)

### Step 1: Create New Price in Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/products
2. **Find** your Pro Annual product
3. **Click** on the product
4. **Scroll** to "Pricing" section
5. **Click** "Add another price"
6. **Configure:**
   - Price: `14.99`
   - Currency: `GBP`
   - Billing period: `Yearly`
7. **Click** "Add price"
8. **COPY** the Price ID (starts with `price_...`)

### Step 2: Update Vercel Environment Variable

1. **Go to:** https://vercel.com/jakedalerourke-gmailcoms-projects/cv-adapter/settings/environment-variables
2. **Find:** `STRIPE_PRICE_ID_PRO_ANNUAL`
3. **Click** "Edit"
4. **Paste** your new Price ID from Step 1
5. **Click** "Save"
6. **Redeploy** (Vercel will prompt, or trigger manually)

### Step 3: Test

1. Go to: https://www.mycvbuddy.com/subscription
2. Click "Upgrade to Pro Annual"
3. Verify checkout shows **£14.99/year**
4. **DO NOT** complete payment (unless you want to test fully)

## 🔍 Verification

After deployment, the annual plan should show:
- **Price:** £14.99/year (was £29.99)
- **Monthly equivalent:** £1.25/month (was £2.50)
- **Savings:** 58% off monthly rate (was 17%)

## 📝 Notes

- The code now uses the new price for fallback scenarios
- The primary pricing comes from the Stripe Price ID in Vercel env vars
- Other currencies updated proportionally (USD: $19.99, EUR: €17.49, etc.)
