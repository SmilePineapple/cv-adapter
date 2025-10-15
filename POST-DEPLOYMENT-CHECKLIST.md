# Post-Deployment Checklist

## ✅ Code Deployed Successfully!

**Commit**: `7e2c722` - Payment migration: one-time lifetime model, bug fixes, progress indicators
**Pushed to**: GitHub main branch
**Auto-deploying to**: Vercel → mycvbuddy.com & mycvbuddy.co.uk

---

## 🔍 Immediate Actions Required

### 1. Run Database Migration in Production

**CRITICAL**: You must run the migration SQL in your **PRODUCTION** Supabase database!

1. Go to: https://supabase.com/dashboard/project/vuslzrevbkuugqeiadnq
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the ENTIRE contents of `migrate-to-lifetime-payments.sql`
5. Click **Run** (or Ctrl+Enter)
6. **Verify success**:
   ```sql
   SELECT plan_type, COUNT(*) as count 
   FROM usage_tracking 
   GROUP BY plan_type;
   ```
   Should show free and pro users.

### 2. Verify Webhook Configuration

1. Go to: https://dashboard.stripe.com/webhooks
2. Find your production webhook
3. **Verify endpoint URL**: Should be `https://www.mycvbuddy.com/api/stripe/webhook`
4. **Verify events**:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. **Test webhook**:
   - Click "Send test webhook"
   - Select `checkout.session.completed`
   - Click "Send test webhook"
   - **Check response**: Should be `200 OK`

### 3. Verify Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your CV Adapter project
3. Go to **Settings** → **Environment Variables**
4. **Verify these are set**:
   - ✅ `STRIPE_WEBHOOK_SECRET` = Your production webhook secret (whsec_xxx)
   - ✅ `MAX_FREE_GENERATIONS` = `1`
   - ✅ `MAX_PRO_GENERATIONS` = `100`
   - ✅ `STRIPE_SECRET_KEY` = Production key (sk_live_xxx) **NOT test key**
   - ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Production key (pk_live_xxx)

**If you updated any env vars**: Click **Redeploy** in Vercel

---

## 🧪 Production Testing

### Test 1: Homepage Pricing Display
1. Visit: https://www.mycvbuddy.com
2. **Check pricing section**:
   - ✅ Shows "£5 one-time" (NOT /month)
   - ✅ Shows "100 CV generations (lifetime)"
   - ✅ Shows "1 free generation"

### Test 2: Free User Flow
1. **Sign up** with a new test email
2. **Upload a CV**
3. **Generate once** - should work
4. **Try to generate again** - should see:
   - ✅ "You have used your 1 free generation"
   - ✅ Upgrade prompt

### Test 3: Pro Purchase Flow (REAL MONEY!)
⚠️ **WARNING**: This will charge a real card £5!

1. **Use a test account** or your own
2. **Click "Upgrade to Pro"**
3. **Verify Stripe checkout**:
   - ✅ Shows "£5.00" one-time
   - ✅ NOT recurring/subscription
4. **Complete payment** with real card
5. **Wait for redirect** to dashboard
6. **Check account**:
   - ✅ Shows "Pro Plan Active"
   - ✅ Shows "0 / 100 used"
   - ✅ Can generate CVs

### Test 4: Webhook Verification
After making a real purchase:

1. **Check Stripe Dashboard** → Webhooks → Your endpoint
2. **Recent events** should show:
   - ✅ `checkout.session.completed` with `200 OK`
3. **Check Supabase** → Table Editor → `purchases`:
   - ✅ New row with `status='completed'`
   - ✅ `amount_paid=500`
   - ✅ Your user_id
4. **Check Supabase** → Table Editor → `usage_tracking`:
   - ✅ Your row shows `plan_type='pro'`
   - ✅ `max_lifetime_generations=100`

### Test 5: Work Experience Export
1. **Generate a CV** with work experience
2. **Download as PDF**
3. **Open PDF**:
   - ✅ Work experience shows properly
   - ✅ NO "[object Object]" text
   - ✅ Job titles, companies, descriptions visible
4. **Download as DOCX**:
   - ✅ Same - properly formatted

### Test 6: Progress Indicators
1. **Generate a CV**:
   - ✅ Progress bar appears
   - ✅ Shows steps: "Analyzing..." → "AI rewriting..." → "Complete!"
2. **Download as PDF**:
   - ✅ Progress bar appears
   - ✅ Shows steps: "Preparing..." → "Generating PDF..." → "Complete!"

---

## 🐛 If Something Goes Wrong

### Issue: Webhook returns 500 error
**Fix**: 
1. Check Vercel logs for errors
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Redeploy if you updated env vars

### Issue: Payment succeeds but user not upgraded
**Fix**:
1. Check webhook fired (Stripe Dashboard → Webhooks → Recent events)
2. Check Vercel logs for webhook errors
3. Manually upgrade user with `manual-upgrade-user.sql`

### Issue: Pricing still shows "/month"
**Fix**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check deployment completed in Vercel
3. Verify latest code is deployed (check commit hash)

### Issue: PDF export still shows "[object Object]"
**Fix**:
1. Verify deployment completed
2. Hard refresh browser
3. Try generating a NEW CV (not old ones)

### Issue: Database migration failed
**Fix**:
1. Check Supabase logs for error details
2. May need to rollback and retry
3. Contact me for help with specific errors

---

## 📊 Monitor These Metrics

### First 24 Hours
- **Conversion rate**: Free → Pro purchases
- **Webhook success rate**: Should be 100%
- **Error rate**: Check Vercel logs
- **User feedback**: Monitor support emails

### First Week
- **Revenue**: Track total purchases
- **Churn**: Should be 0% (one-time payment!)
- **Generation usage**: Average per user
- **Export success rate**: PDF/DOCX downloads

---

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Database migration completed without errors
- ✅ Webhook returns 200 OK on test
- ✅ Real payment test upgrades user to Pro
- ✅ Pricing displays correctly on all pages
- ✅ PDF exports show work experience properly
- ✅ Progress indicators work on generate and download
- ✅ No errors in Vercel logs
- ✅ No errors in Stripe webhook logs

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Stripe webhook logs
3. Check Supabase database
4. Check browser console for errors
5. Contact Cascade for help!

---

## 🚀 What Changed in This Deployment

### Payment Model
- ❌ Old: £5/month subscription, 100 generations/month
- ✅ New: £5 one-time, 100 generations lifetime
- ❌ Old: 3 free generations/month
- ✅ New: 1 free generation lifetime

### Database
- Added `lifetime_generation_count` to `usage_tracking`
- Added `plan_type` ('free' or 'pro') to `usage_tracking`
- Renamed `subscriptions` → `purchases` table
- Removed monthly reset function

### Stripe Integration
- Changed from subscription mode to one-time payment
- Using inline price_data instead of Price IDs
- Webhook handles one-time payments

### Bug Fixes
- Fixed work experience export showing "[object Object]"
- Added progress indicators for CV generation
- Added progress indicators for PDF/DOCX download

### UI Updates
- All pricing displays show "one-time" not "/month"
- Subscription page shows lifetime access
- Dashboard shows lifetime usage (X / 100)

---

## ⏭️ Next Steps

After successful deployment:
1. Monitor webhook logs for 24 hours
2. Test with real users
3. Gather feedback
4. Consider adding:
   - Usage analytics dashboard
   - Email notifications for purchases
   - Referral program
   - Bulk generation packages

Good luck! 🎉
