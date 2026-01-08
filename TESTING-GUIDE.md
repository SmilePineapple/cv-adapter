# Testing Guide - Payment Migration & Bug Fixes

## ✅ Completed Fixes

### 1. Database Migration
- ✅ Migrated from monthly subscriptions to lifetime one-time payments
- ✅ Updated `usage_tracking` table with lifetime generation fields
- ✅ Renamed `subscriptions` → `purchases` table
- ✅ Migration results: 2 Pro users, 20 Free users

### 2. Pricing Display Updates
- ✅ Homepage: "£5 one-time" instead of "£5/month"
- ✅ Landing page: "100 CV generations (lifetime)"
- ✅ Help page: Updated FAQ to reflect new pricing
- ✅ Subscription page: Shows lifetime access, no cancellation

### 3. Export Bug Fixes
- ✅ Fixed "[object Object]" in work experience exports
- ✅ PDF/DOCX now properly format work experience with job titles, companies, and descriptions
- ✅ Handles multiple field name variations (job_title, jobTitle, title, position, etc.)

### 4. UI/UX Improvements
- ✅ Added progress indicators to "Generate Tailored CV" button
- ✅ Added progress indicators to "Download as PDF/DOCX" button
- ✅ Progress shows: Percentage, current step, animated progress bar

## 🧪 Testing Checklist

### Test 1: Free User Flow
1. **Sign up** with a new email
2. **Upload a CV** with work experience
3. **Generate a CV** - should see:
   - ✅ Progress bar: "Analyzing job requirements..." → "AI is rewriting..." → "Complete!"
   - ✅ Success message
4. **Check dashboard** - should show "1 / 1 used"
5. **Try to generate again** - should see:
   - ✅ Error: "You have used your 1 free generation. Upgrade to Pro for 100 more!"
   - ✅ Upgrade prompt with link to subscription page

### Test 2: Pro Purchase Flow
1. **Click "Upgrade to Pro"** from dashboard or subscription page
2. **Verify Stripe checkout** shows:
   - ✅ "CV Adapter Pro - 100 Lifetime Generations"
   - ✅ "£5.00" (not £5/month)
   - ✅ One-time payment (not recurring)
3. **Complete payment** with test card: `4242 4242 4242 4242`
4. **Verify redirect** to dashboard with success message
5. **Check database**:
   ```sql
   SELECT plan_type, lifetime_generation_count, max_lifetime_generations 
   FROM usage_tracking WHERE user_id = 'YOUR_USER_ID';
   -- Should show: plan_type='pro', max_lifetime_generations=100
   
   SELECT * FROM purchases WHERE user_id = 'YOUR_USER_ID';
   -- Should show: status='completed', amount_paid=500, currency='gbp'
   ```

### Test 3: CV Generation with Progress
1. **Upload a CV** with work experience section
2. **Click "Generate Tailored CV"**
3. **Verify progress indicators**:
   - ✅ Progress bar appears
   - ✅ Shows "Analyzing job requirements..." (20%)
   - ✅ Shows "Preparing CV content..." (20%)
   - ✅ Shows "AI is rewriting your CV..." (60%)
   - ✅ Shows "Finalizing changes..." (90%)
   - ✅ Shows "Complete!" (100%)
   - ✅ Redirects to review page

### Test 4: PDF Export with Progress
1. **Go to download page** after generating a CV
2. **Select a template** (e.g., Modern)
3. **Select PDF format**
4. **Click "Download as PDF"**
5. **Verify progress indicators**:
   - ✅ Button shows "Generating PDF..."
   - ✅ Progress bar appears below
   - ✅ Shows "Preparing export..." (0%)
   - ✅ Shows "Generating PDF file..." (20%)
   - ✅ Shows "Processing document..." (60%)
   - ✅ Shows "Downloading file..." (80%)
   - ✅ Shows "Complete!" (100%)
   - ✅ File downloads successfully

### Test 5: Work Experience in Exports
1. **Generate a CV** with work experience
2. **Download as PDF**
3. **Open the PDF** - should show:
   - ✅ Work experience formatted properly
   - ✅ Job titles, company names visible
   - ✅ Descriptions/responsibilities visible
   - ✅ NO "[object Object]" text
4. **Download as DOCX**
5. **Open in Word** - should show:
   - ✅ Same proper formatting
   - ✅ All work experience details visible

### Test 6: Pricing Display
1. **Visit homepage** (/)
2. **Check pricing section**:
   - ✅ Shows "£5 one-time" (not /month)
   - ✅ Shows "100 CV generations (lifetime)"
   - ✅ Shows "1 free generation"
3. **Visit subscription page** (/subscription)
4. **Check free plan**:
   - ✅ Shows "1 CV generation (lifetime)"
5. **Check pro plan**:
   - ✅ Shows "£5 one-time payment"
   - ✅ Shows "100 CV generations (lifetime)"

### Test 7: Pro User Experience
1. **Log in as Pro user** (or upgrade a test account)
2. **Check subscription page**:
   - ✅ Shows "Pro Plan Active"
   - ✅ Shows "Lifetime access - no recurring charges"
   - ✅ Shows usage: "X / 100 used"
   - ✅ Shows purchase date
   - ✅ NO cancellation button
3. **Generate CVs**:
   - ✅ Can generate up to 100 times
   - ✅ Counter increments: "1 / 100", "2 / 100", etc.
4. **After 100 generations**:
   - ✅ Shows error: "You have used all 100 lifetime generations"

## 🐛 Known Issues

### OAuth Error in Console
- **Issue**: `[ERROR] OAuth error: {"__isAuthError":true,"name":"AuthApiError","status":400,"code":"validation_failed"}`
- **Impact**: Low - doesn't affect functionality, just a console warning
- **Cause**: Likely from social login configuration or redirect URL mismatch
- **Fix**: Check Supabase Auth settings → URL Configuration → Redirect URLs

### PDF Opening Error (If Still Occurring)
- **Issue**: "We cannot open this file, something went wrong"
- **Possible Causes**:
  1. Puppeteer/Chromium not installed properly
  2. PDF generation timeout
  3. Memory issues with large CVs
- **Debug Steps**:
  1. Check server logs during PDF generation
  2. Try with a smaller CV
  3. Try different templates
  4. Check if DOCX export works (if yes, issue is PDF-specific)

## 📊 Database Verification Queries

```sql
-- Check migration success
SELECT 
  plan_type,
  COUNT(*) as user_count,
  AVG(lifetime_generation_count) as avg_generations_used,
  AVG(max_lifetime_generations) as avg_max_generations
FROM usage_tracking
GROUP BY plan_type;

-- Expected results:
-- plan_type | user_count | avg_generations_used | avg_max_generations
-- free      | 20         | ~0.4                 | 1
-- pro       | 2          | ~2.0                 | 100

-- Check purchases
SELECT 
  user_id,
  status,
  amount_paid,
  currency,
  purchased_at
FROM purchases
WHERE status = 'completed'
ORDER BY purchased_at DESC;

-- Check specific user
SELECT 
  ut.user_id,
  ut.plan_type,
  ut.lifetime_generation_count,
  ut.max_lifetime_generations,
  p.status as purchase_status,
  p.amount_paid,
  p.purchased_at
FROM usage_tracking ut
LEFT JOIN purchases p ON p.user_id = ut.user_id
WHERE ut.user_id = 'YOUR_USER_ID';
```

## 🚀 Deployment Checklist

Before deploying to production:

1. **Database Migration**
   - [ ] Run `migrate-to-lifetime-payments.sql` in production Supabase
   - [ ] Verify migration with queries above
   - [ ] Backup database before migration

2. **Environment Variables**
   - [ ] Update `MAX_FREE_GENERATIONS=1` in production
   - [ ] Verify Stripe keys are production keys (not test)
   - [ ] Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

3. **Stripe Configuration**
   - [ ] Create production webhook endpoint
   - [ ] Configure webhook to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - [ ] Test webhook with Stripe CLI

4. **User Communication**
   - [ ] Email existing Pro users about lifetime access upgrade
   - [ ] Update terms of service if needed
   - [ ] Update privacy policy if needed

5. **Monitoring**
   - [ ] Monitor error logs for PDF generation issues
   - [ ] Monitor Stripe webhook logs
   - [ ] Track conversion rate (free → pro)
   - [ ] Monitor user feedback

## 📝 Notes

- **Backward Compatibility**: Old `generation_count` column maintained for compatibility
- **Existing Pro Users**: Automatically converted to lifetime access (better deal!)
- **No Refunds Needed**: Monthly subscribers now get lifetime access
- **Stripe Test Mode**: Currently using test keys - remember to switch to production

## 🎉 Success Criteria

Migration is successful when:
- ✅ All users have correct `plan_type` (free/pro)
- ✅ Free users have `max_lifetime_generations=1`
- ✅ Pro users have `max_lifetime_generations=100`
- ✅ New purchases create records in `purchases` table
- ✅ Stripe checkout shows one-time payment
- ✅ All pricing displays show "one-time" not "/month"
- ✅ PDF exports show work experience properly
- ✅ Progress indicators work on generate and download
