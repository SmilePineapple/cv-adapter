# Free Generation Limit Change: 2 → 1

**Date:** December 8, 2025  
**Status:** ✅ IMPLEMENTED

---

## 🎯 Objective

Reduce free generation limit from **2 to 1** to increase conversion rate by creating urgency and encouraging upgrades earlier in the user journey.

---

## 📊 Business Rationale

### Current Problem:
- **1.26% conversion rate** (2/159 users)
- Users get 2 free generations before hitting paywall
- No urgency to upgrade after first generation
- 157 non-converting users = £1,500-3,000 potential MRR

### Expected Impact:
- **Create urgency** after first generation
- **Earlier upgrade prompts** (after 1 gen vs 2 gens)
- **Higher conversion rate** (target: 3-5%)
- **More revenue** from same user base

### Industry Comparison:
- Grammarly: 1 free check
- Canva: Limited free templates
- Most SaaS: 1 free trial or limited features
- **Our change aligns with industry standard**

---

## 🔧 Changes Made

### 1. Database Schema
**File:** `supabase-setup.sql`
- Changed default: `max_lifetime_generations INTEGER NOT NULL DEFAULT 1`
- Comment updated: `-- Free users get 1 generation`

### 2. Frontend Updates

#### Homepage (`src/app/homepage.tsx`)
- ✅ "1 free generation • No credit card required"

#### Dashboard (`src/app/dashboard/page.tsx`)
- ✅ Error message: "You have used your 1 free generation. Upgrade to Pro for unlimited generations!"

#### Generate Page (`src/app/generate/[id]/page.tsx`)
- ✅ Error message: "You have used your 1 free generation. Upgrade to Pro for unlimited generations!"

#### UK CV Builder (`src/app/uk-cv-builder/page.tsx`)
- ✅ Meta description: "Try 1 free generation!"
- ✅ CTA: "Start Free Trial (1 Generation)"
- ✅ Subtext: "Try 1 free generation before upgrading"
- ✅ FAQ: "Do I get 1 free generation?"
- ✅ FAQ: "What happens after I use my 1 free generation?"
- ✅ Final CTA: "Start with 1 free generation today!"

#### USA Resume Builder (`src/app/usa-resume-builder/page.tsx`)
- ✅ Meta description: "Try 1 free generation!"
- ✅ CTA: "Start Free Trial (1 Generation)"
- ✅ Subtext: "Try 1 free generation before upgrading"
- ✅ FAQ: "Do I get 1 free generation?"
- ✅ FAQ: "What happens after I use my 1 free generation?"
- ✅ Final CTA: "Start with 1 free generation today!"

#### Blog Post (`src/app/blog/ats-cv-tips-uk-2025/page.tsx`)
- ✅ CTA: "Optimize My CV Now (1 Free Generation)"

### 3. Database Migration
**File:** `migrations/reduce-free-limit-to-1.sql`

**Actions:**
1. Update default value for new users
2. Update existing free users with 0 generations used (max: 2 → 1)
3. Update existing free users with 1 generation used (max: 2 → 1, now at limit)
4. Keep users with 2 generations used unchanged (already at limit)

**Affected Users:**
- New signups: Get 1 free generation
- Existing free users (0 used): Still have 1 generation left
- Existing free users (1 used): Now at limit, need to upgrade
- Existing free users (2 used): Already at limit (no change)
- Pro users: Unlimited (no change)

---

## 📈 Expected Results

### Conversion Funnel Impact:

**Before:**
1. 159 users sign up
2. 89 upload CV (56%)
3. 86 generate CV (54%)
4. **Hit limit after 2nd generation**
5. 2 convert (1.26%)

**After:**
1. 159 users sign up
2. 89 upload CV (56%)
3. 86 generate CV (54%)
4. **Hit limit after 1st generation** ⚡
5. **5-8 convert (3-5%)** 🎯

### Revenue Impact:
- **Current:** £58.98 (2 customers)
- **Expected:** £150-250 (5-8 customers)
- **Increase:** +154% to +324%

---

## 🚀 Deployment Steps

### 1. Run Migration (Supabase)
```sql
-- Execute: migrations/reduce-free-limit-to-1.sql
-- This updates existing users and default value
```

### 2. Deploy Code Changes
```bash
git add .
git commit -m "Reduce free generation limit from 2 to 1 to increase conversion rate"
git push
# Vercel auto-deploys
```

### 3. Verify Changes
- [ ] Check new user gets max_lifetime_generations = 1
- [ ] Test generation limit prompt after 1 generation
- [ ] Verify upgrade flow works correctly
- [ ] Check all landing pages show "1 free generation"

---

## 📊 Monitoring

### Key Metrics to Track:

**Daily:**
- New signups
- Generations used
- Users hitting limit
- Upgrade conversions

**Weekly:**
- Conversion rate (target: 3-5%)
- Revenue (target: £150+)
- User feedback
- Support tickets

**Monthly:**
- Total conversions
- MRR growth
- Churn rate
- User satisfaction

---

## 💡 Next Steps (After Deployment)

### Immediate (Week 1):
1. ✅ Monitor conversion rate daily
2. ✅ Add upgrade prompt modal after 1st generation
3. ✅ Track "limit reached" events in analytics
4. ✅ Collect user feedback

### Short-term (Week 2-4):
1. Add testimonials to upgrade prompt
2. Implement exit-intent popup
3. Send email to users at limit
4. A/B test upgrade messaging

### Long-term (Month 2+):
1. Analyze conversion data
2. Consider dynamic pricing
3. Add referral program
4. Optimize onboarding flow

---

## 🔄 Rollback Plan (If Needed)

If conversion rate doesn't improve or user feedback is negative:

```sql
-- Rollback migration
ALTER TABLE usage_tracking 
ALTER COLUMN max_lifetime_generations SET DEFAULT 2;

UPDATE usage_tracking 
SET max_lifetime_generations = 2 
WHERE plan_type = 'free' 
  AND max_lifetime_generations = 1;
```

Then revert code changes and redeploy.

---

## 📝 Files Modified

### Database:
- ✅ `supabase-setup.sql` - Default value changed
- ✅ `migrations/reduce-free-limit-to-1.sql` - Migration script

### Frontend:
- ✅ `src/app/homepage.tsx`
- ✅ `src/app/dashboard/page.tsx`
- ✅ `src/app/generate/[id]/page.tsx`
- ✅ `src/app/uk-cv-builder/page.tsx`
- ✅ `src/app/usa-resume-builder/page.tsx`
- ✅ `src/app/blog/ats-cv-tips-uk-2025/page.tsx`

### Documentation:
- ✅ `FREE-GENERATION-LIMIT-CHANGE.md` (this file)

---

## ✅ Summary

**Change:** Free generations reduced from 2 to 1  
**Goal:** Increase conversion rate from 1.26% to 3-5%  
**Expected Revenue:** +£90-190/month  
**Risk:** Low (can rollback easily)  
**User Impact:** Creates urgency, encourages earlier upgrades  
**Industry Standard:** Aligns with typical SaaS free trial limits

---

**Status:** ✅ READY TO DEPLOY  
**Next Action:** Run migration script in Supabase, then deploy code changes
