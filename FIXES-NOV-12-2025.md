# Critical Fixes - November 12, 2025

## Issues Fixed

### 1. ❌ Upload Error - Section Type Constraint Violation (RECURRING)

**Error:**
```
Error creating CV sections: {
  code: '23514',
  message: 'new row for relation "cv_sections" violates check constraint "cv_sections_section_type_check"'
  details: 'Failing row contains (..., volunteer, Groups, ...)'
}
```

**Root Cause:**
The AI was generating sections with types like `'groups'`, `'strengths'`, `'additional'` which we were mapping to valid types (`'volunteer'`, `'skills'`, `'summary'`), BUT the `title` field was still using the **unmapped** original type.

**Code Before:**
```typescript
const sectionsToInsert = parsedSections.sections.map((section, index) => ({
  cv_id: cvData.id,
  section_type: mapSectionType(section.type),  // ✅ Mapped: 'groups' → 'volunteer'
  title: section.type.charAt(0).toUpperCase() + section.type.slice(1),  // ❌ Unmapped: 'Groups'
  content: section.content,
  order_index: index
}))
```

**Code After:**
```typescript
const sectionsToInsert = parsedSections.sections.map((section, index) => {
  const mappedType = mapSectionType(section.type)
  console.log(`Mapping section: "${section.type}" → "${mappedType}"`)
  return {
    cv_id: cvData.id,
    section_type: mappedType,  // ✅ Mapped: 'groups' → 'volunteer'
    title: mappedType.charAt(0).toUpperCase() + mappedType.slice(1),  // ✅ Mapped: 'Volunteer'
    content: section.content,
    order_index: index
  }
})
```

**Fix:**
1. Use the **mapped type** for both `section_type` AND `title`
2. Added detailed logging to track mapping: `"groups" → "volunteer"`
3. Added pre-insert logging to see exactly what's being sent to database
4. Added error logging with full section data when insert fails

**Files Modified:**
- `src/app/api/upload/route.ts` (lines 178-207)

---

### 2. ❌ Admin Dashboard - Incorrect Pro User Count

**Issue:**
```
Dashboard showed: 4 Pro Users
MRR calculation: 5 Monthly Subs (£49.95)
Actual Pro users in table: 7
```

**Math didn't add up!**

**Root Cause:**
Two different data sources were being used:
- **Pro Users count:** Counted from `purchases` + `subscriptions` tables (old model)
- **MRR calculation:** Counted from `usage_tracking.subscription_tier` (new model)

**Code Before:**
```typescript
// Count pro users from both purchases and subscriptions tables
const proUsersFromPurchases = new Set(purchases.filter(p => p.status === 'completed').map(p => p.user_id))
const proUsersFromSubscriptions = new Set(subscriptions.filter(s => s.status === 'active' && s.plan === 'pro').map(s => s.user_id))
const allProUsers = new Set([...proUsersFromPurchases, ...proUsersFromSubscriptions])

const proUsers = allProUsers.size  // ❌ Wrong source
```

**Code After:**
```typescript
// Count Pro users from usage_tracking (source of truth for subscription model)
// Include: pro_monthly, pro_annual, and any plan_type='pro' (legacy manual upgrades)
const proUsersCount = usageTracking.filter(u => 
  u.subscription_tier === 'pro_monthly' || 
  u.subscription_tier === 'pro_annual' ||
  u.plan_type === 'pro'
).length

const proUsers = proUsersCount  // ✅ Correct source
```

**Fix:**
1. Changed Pro user count to use `usage_tracking` table (same as MRR)
2. Counts all Pro users: `pro_monthly` + `pro_annual` + `plan_type='pro'`
3. Now matches the MRR calculation methodology
4. Should show correct count (7 Pro users based on your table data)

**Files Modified:**
- `src/app/api/admin/analytics/route.ts` (lines 80-92)

---

## Expected Results After Fix

### Upload Error
**Before:**
- Users uploading French CVs with "Groups" section → Error
- CV saved but sections failed to create
- User sees incomplete CV in editor

**After:**
- All section types properly mapped before database insert
- Detailed logs show: `"groups" → "volunteer"`, `"strengths" → "skills"`
- Sections created successfully
- User sees complete CV in editor

### Admin Dashboard
**Before:**
```
Pro Users: 4
Monthly MRR: £49.95
Monthly Subs: 5
```
Math: 4 ≠ 5 ❌

**After:**
```
Pro Users: 7 (or whatever the actual count is)
Monthly MRR: £69.93 (7 × £9.99)
Monthly Subs: 7
```
Math: 7 = 7 ✅

---

## Verification Steps

### 1. Test Upload with French CV
1. Upload a French CV with "Groups" or "Strengths" sections
2. Check Vercel logs for mapping output:
   ```
   Mapping section: "groups" → "volunteer"
   Mapping section: "strengths" → "skills"
   Sections to insert: [{ type: 'volunteer', title: 'Volunteer' }, ...]
   ```
3. Verify no constraint violation error
4. Check CV sections created successfully

### 2. Check Admin Dashboard
1. Go to `/admin`
2. Check "Pro Users" count
3. Check "Monthly MRR" amount
4. Check "Monthly Subs" count
5. Verify: Pro Users = Monthly Subs
6. Verify: MRR = Monthly Subs × £9.99

---

## Actual Pro Users (From Your Table)

Based on the table you provided, these users show "👑 Pro":

1. **jakedalerourke@gmail.com** - 44 generations
2. **smilepineapple118@gmail.com** - 9 generations
3. **jake.rourke@btinternet.com** - 4 generations
4. **lakash675@gmail.com** - 1 generation
5. **imanirenee@hotmail.com** - 1 generation (manually upgraded)
6. **jakepamdalerourke@gmail.com** - 0 generations
7. **pameladalerourke@gmail.com** - 1 generation

**Total: 7 Pro Users**

**Expected MRR:** 7 × £9.99 = **£69.93/month**

**Note:** Some of these might be manual upgrades (like Imani) without Stripe subscriptions, so the actual MRR might be lower if they're not paying monthly.

---

## Monitoring

### Watch for These Logs

**Upload Success:**
```
Mapping section: "groups" → "volunteer"
Mapping section: "strengths" → "skills"
Mapping section: "additional" → "summary"
Sections to insert: [{ type: 'volunteer', title: 'Volunteer' }, ...]
CV sections created successfully
```

**Upload Failure (if still happening):**
```
Error creating CV sections: {...}
Failed sections data: [...]
```

**Admin Dashboard:**
```
Pro Users: 7
Monthly MRR: £69.93
Projected ARR: £839
```

---

## Known Issues Still Remaining

### 1. Imani's Payment Issue
- She paid £9.99 but webhook failed
- Manually upgraded (not linked to Stripe)
- She has free Pro forever (no recurring charges)
- **Action needed:** Send apology email via `/admin/send-email`

### 2. ✅ FIXED - Email Sending Bug
From your logs:
```
📧 Sending first generation email to: maddyturner78@gmail.com
📧 Sending limit reached email to: maddyturner78@gmail.com
```

**Root Cause:** Free users were created with `max_lifetime_generations = 1` instead of 2
- On 1st generation: Email logic checked `(0 < 1 && 1 >= 1)` = TRUE → Sent limit email!
- Should be: `(0 < 2 && 1 >= 2)` = FALSE → No limit email

**Fix Applied:**
- Changed database DEFAULT from 1 to 2
- Updated trigger function to insert 2 for new users
- Created migration to fix existing users

**Action Required:** Run `migrations/fix-free-user-limit-to-2.sql` in Supabase!

---

## Deployment

**Status:** ✅ Deployed to production
**Commits:** 
- `b5ed839` - Section mapping & Pro user count fixes
- `9f78ec2` - Free user limit fix (1 → 2 generations)

**Date:** November 12, 2025

**Changes:**
1. Fixed section type mapping in upload route
2. Fixed Pro user count in admin analytics
3. Fixed free user generation limit (1 → 2)
4. Added detailed logging for debugging

---

## Next Steps

1. **RUN MIGRATION IN SUPABASE** - Execute `migrations/fix-free-user-limit-to-2.sql` to update existing users
2. **Monitor upload logs** - Verify section mapping works correctly
3. **Check admin dashboard** - Verify Pro user count is accurate (should show 7)
4. **Send email to Imani** - Use `/admin/send-email` with payment issue template
5. **Investigate webhook failure** - Check Stripe logs for Imani's payment

---

## Prevention

### Section Type Mapping
- Always use mapped type for ALL fields (section_type, title, etc.)
- Add validation before database insert
- Log mapping for debugging
- Consider adding a test suite for section type mapping

### Admin Dashboard Accuracy
- Use single source of truth (usage_tracking)
- Keep all metrics using same data source
- Add data validation checks
- Consider adding a "Data Health" page to spot inconsistencies

### Webhook Reliability
- Add webhook failure alerts
- Log all webhook events
- Monitor success rate
- Add retry logic for failed webhooks
