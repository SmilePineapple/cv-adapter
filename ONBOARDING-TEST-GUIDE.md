# Complete Onboarding Flow Test Guide

**Date:** March 20, 2026  
**Purpose:** Test the complete user journey from signup to CV generation  
**Test Account:** jake.rourke@btinternet.com

---

## 🎯 **Test Objectives**

Verify that all critical UX improvements work correctly:

1. ✅ Mandatory onboarding (no skip/close buttons)
2. ✅ Usage limits shown upfront (signup + dashboard)
3. ✅ Empty state shows "Upload CV to Get Started"
4. ✅ Image-based PDF validation (< 100 chars)
5. ✅ Dashboard default tab is "Overview"
6. ✅ Complete flow: Signup → Onboarding → Upload → Generate

---

## 📋 **Prerequisites**

### 1. Reset Test Account

Run the SQL script to reset the test account to a fresh state:

```bash
# Connect to Supabase and run:
psql -h <your-supabase-host> -U postgres -d postgres -f scripts/reset-test-account.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `scripts/reset-test-account.sql`
3. Execute the script
4. Verify output shows account was reset

### 2. Prepare Test CV

Ensure the test CV exists at:
```
C:\Users\jaket\Desktop\Personal\Pamela Dale-Rourke CV.pdf
```

**Important:** This should be a **text-based PDF**, not a scanned/image-based PDF.

### 3. Start Development Server (Optional)

If testing locally:
```bash
npm run dev
```

Or test on production: `https://www.mycvbuddy.com`

---

## 🧪 **Manual Test Steps**

### **Phase 1: Signup & Onboarding**

#### Step 1: Navigate to Signup
- **URL:** `/auth/signup`
- **Expected:**
  - ✅ Page shows "Start Free" heading
  - ✅ Banner visible: "✨ Start with 1 free CV generation • Upgrade anytime for unlimited"
  - ✅ Google OAuth button visible
  - ✅ Email/password form visible

#### Step 2: Login (Account Already Exists)
- **URL:** `/auth/login`
- **Action:** Login with `jake.rourke@btinternet.com`
- **Expected:**
  - ✅ Redirects to `/dashboard`
  - ✅ Onboarding modal appears immediately

#### Step 3: Verify Mandatory Onboarding
- **Expected:**
  - ✅ Modal shows "Welcome to My CV Buddy!"
  - ✅ Shows "Upload → Generate → Download" process
  - ✅ **NO** skip button visible
  - ✅ **NO** close (X) button visible
  - ✅ Shows "Step 1 of 3" counter
  - ✅ Pressing ESC key does NOT close modal

#### Step 4: Complete Onboarding
- **Action:** Go through all 3 steps
  - Step 1: Select goal (e.g., "Get a new job")
  - Step 2: Select experience level (e.g., "Mid-level")
  - Step 3: Select industry (e.g., "Technology")
- **Expected:**
  - ✅ Each step shows "Next" button
  - ✅ Final step shows "Get Started" button
  - ✅ Modal closes after completion

---

### **Phase 2: Dashboard Empty State**

#### Step 5: Verify Dashboard State
- **URL:** `/dashboard`
- **Expected:**
  - ✅ Default tab is "Overview" (NOT "Generations")
  - ✅ Primary CTA shows **"Upload CV to Get Started"** (full width, white button)
  - ✅ Usage banner visible: "1 Free Generation Remaining"
  - ✅ Stats show: 0 CVs, 0 Generations
  - ✅ Secondary "Upload CV" button also visible

---

### **Phase 3: CV Upload**

#### Step 6: Navigate to Upload
- **Action:** Click "Upload CV to Get Started"
- **Expected:**
  - ✅ Redirects to `/upload`
  - ✅ Shows upload dropzone
  - ✅ Shows file size limit (10MB)

#### Step 7: Upload CV
- **Action:** Upload `Pamela Dale-Rourke CV.pdf`
- **Expected:**
  - ✅ Shows upload progress
  - ✅ Shows parsing progress
  - ✅ Success message appears
  - ✅ Redirects to dashboard OR shows success modal

**Timing:** Should take 5-15 seconds for upload + parsing

---

### **Phase 4: Dashboard After Upload**

#### Step 8: Verify Updated Dashboard
- **URL:** `/dashboard`
- **Expected:**
  - ✅ Primary CTA changed to **"Generate your New CV"**
  - ✅ Stats show: 1 CV, 0 Generations
  - ✅ Usage banner still shows: "1 Free Generation Remaining"
  - ✅ CV appears in "CVs" tab

---

### **Phase 5: CV Generation**

#### Step 9: Start Generation
- **Action:** Click "Generate your New CV"
- **Expected:**
  - ✅ Redirects to `/generate/[cvId]`
  - ✅ Shows job description textarea
  - ✅ Shows CV preview (optional)

#### Step 10: Fill Job Description
- **Action:** Paste a job description
- **Example:**
```
Senior Software Engineer
We're looking for an experienced software engineer to join our team.
Requirements:
- 5+ years of experience
- Strong TypeScript/JavaScript skills
- Experience with React and Node.js
- Good communication skills
```

#### Step 11: Generate CV
- **Action:** Click "Generate CV" button
- **Expected:**
  - ✅ Shows loading state
  - ✅ Shows progress indicator (if implemented)
  - ✅ Generation completes in 30-60 seconds
  - ✅ Shows success message
  - ✅ Shows "Download" or "View CV" button

---

### **Phase 6: Post-Generation**

#### Step 12: Verify Usage Tracking
- **URL:** `/dashboard`
- **Expected:**
  - ✅ Stats show: 1 CV, 1 Generation
  - ✅ Usage banner shows: "0 Free Generations Remaining"
  - ✅ Upgrade CTA is prominent
  - ✅ Attempting another generation shows upgrade prompt

---

## 🤖 **Automated Test (Playwright)**

Run the automated end-to-end test:

```bash
# Install Playwright if not already installed
npm install -D @playwright/test

# Run the test
npx playwright test tests/e2e/onboarding-flow.spec.ts --headed

# Or run in headless mode
npx playwright test tests/e2e/onboarding-flow.spec.ts
```

**Test File:** `tests/e2e/onboarding-flow.spec.ts`

---

## 🐛 **Edge Cases to Test**

### 1. Image-Based PDF Upload
- **Action:** Upload a scanned/image-based PDF
- **Expected:**
  - ✅ Upload fails with error
  - ✅ Error message: "This appears to be a scanned PDF with very little extractable text"
  - ✅ Suggests OCR or text-based PDF

### 2. Onboarding Escape Attempts
- **Actions to try:**
  - Press ESC key
  - Click outside modal
  - Press browser back button
  - Refresh page
- **Expected:**
  - ✅ Modal remains visible
  - ✅ User cannot access dashboard without completing onboarding

### 3. Direct URL Access
- **Action:** Navigate directly to `/generate/[cvId]` before uploading CV
- **Expected:**
  - ✅ Redirects to upload page OR shows error

### 4. Usage Limit Enforcement
- **Action:** Try to generate a 2nd CV after using free generation
- **Expected:**
  - ✅ Shows upgrade modal
  - ✅ Cannot proceed without upgrading

---

## 📊 **Success Criteria**

All of the following must pass:

- [ ] Signup page shows usage limits clearly
- [ ] Onboarding is mandatory (no skip/close)
- [ ] Onboarding shows 3-step process
- [ ] Dashboard default tab is "Overview"
- [ ] Empty state shows "Upload CV to Get Started"
- [ ] Usage banner is prominent
- [ ] CV upload works correctly
- [ ] Image-based PDFs are rejected
- [ ] Dashboard updates after upload
- [ ] Primary CTA changes to "Generate your New CV"
- [ ] CV generation works end-to-end
- [ ] Usage tracking updates correctly
- [ ] Upgrade prompt appears after limit reached

---

## 🔧 **Troubleshooting**

### Issue: Onboarding doesn't appear
**Solution:** Check that `onboarding_completed` is FALSE in profiles table

### Issue: Upload fails
**Possible causes:**
- File too large (>10MB)
- Image-based PDF (expected behavior)
- Network error
- API key missing

### Issue: Generation fails
**Possible causes:**
- OpenAI API key missing
- Rate limit reached
- Invalid job description
- Network timeout

### Issue: Usage tracking incorrect
**Solution:** Check `usage_tracking` table for correct values

---

## 📝 **Test Results Template**

```markdown
## Test Results - [Date]

**Tester:** [Name]
**Environment:** [Local/Production]
**Browser:** [Chrome/Firefox/Safari]

### Phase 1: Signup & Onboarding
- [ ] Signup page shows usage limits
- [ ] Onboarding is mandatory
- [ ] 3-step process works
- [ ] Notes: ___________

### Phase 2: Dashboard Empty State
- [ ] Default tab is Overview
- [ ] Shows "Upload CV to Get Started"
- [ ] Usage banner visible
- [ ] Notes: ___________

### Phase 3: CV Upload
- [ ] Upload works correctly
- [ ] Parsing completes
- [ ] Success message shown
- [ ] Notes: ___________

### Phase 4: Dashboard After Upload
- [ ] CTA changes to "Generate your New CV"
- [ ] Stats updated correctly
- [ ] Notes: ___________

### Phase 5: CV Generation
- [ ] Generation page loads
- [ ] Job description accepted
- [ ] Generation completes
- [ ] Download/View available
- [ ] Notes: ___________

### Phase 6: Post-Generation
- [ ] Usage tracking updated
- [ ] Upgrade prompt shown
- [ ] Notes: ___________

### Overall Result: PASS / FAIL

**Issues Found:**
1. ___________
2. ___________

**Recommendations:**
1. ___________
2. ___________
```

---

## 🎯 **Next Steps After Testing**

1. **If all tests pass:**
   - ✅ Mark onboarding improvements as complete
   - ✅ Monitor production metrics
   - ✅ Track conversion rate improvements

2. **If issues found:**
   - 🐛 Document issues in GitHub
   - 🔧 Prioritize fixes
   - 🔄 Re-test after fixes

3. **Future improvements:**
   - Add post-upload success modal
   - Add progress indicators
   - Improve error messages
   - A/B test variations

---

## 📞 **Support**

If you encounter issues during testing:
- Check console logs for errors
- Check network tab for failed requests
- Check Supabase logs for database errors
- Contact: jakedalerourke@gmail.com

---

**Last Updated:** March 20, 2026  
**Version:** 1.0  
**Status:** Ready for Testing ✅
