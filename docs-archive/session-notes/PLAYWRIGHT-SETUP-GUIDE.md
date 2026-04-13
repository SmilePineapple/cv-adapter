# Playwright Test Setup Guide

**Purpose:** Run automated end-to-end onboarding flow test  
**Test File:** `tests/e2e/onboarding-flow.spec.ts`

---

## 🚀 **Quick Start**

### **Step 1: Install Playwright** (if not already installed)

```bash
npm install -D @playwright/test
npx playwright install
```

This will install:
- Playwright test runner
- Chromium, Firefox, and WebKit browsers
- Browser dependencies

### **Step 2: Update Test Configuration**

Open `tests/e2e/onboarding-flow.spec.ts` and update the password:

```typescript
const TEST_EMAIL = 'jake.rourke@btinternet.com'
const TEST_PASSWORD = 'YOUR_ACTUAL_PASSWORD_HERE' // ⚠️ UPDATE THIS
const CV_FILE_PATH = 'C:\\Users\\jaket\\Desktop\\Personal\\Pamela Dale-Rourke CV.pdf'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
```

**Important:** Replace `'YOUR_ACTUAL_PASSWORD_HERE'` with the actual password for jake.rourke@btinternet.com

### **Step 3: Choose Test Environment**

**Option A: Test on Production**
```bash
BASE_URL=https://www.mycvbuddy.com npx playwright test tests/e2e/onboarding-flow.spec.ts --headed
```

**Option B: Test Locally**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run test
npx playwright test tests/e2e/onboarding-flow.spec.ts --headed
```

---

## 📋 **Before Running the Test**

### **1. Reset the Test Account**

Run the SQL script in Supabase SQL Editor:
```sql
-- Copy/paste contents of scripts/reset-test-account.sql
```

Verify output shows:
```
✅ Account reset complete for jake.rourke@btinternet.com
```

### **2. Verify CV File Exists**

Check that the file exists at:
```
C:\Users\jaket\Desktop\Personal\Pamela Dale-Rourke CV.pdf
```

**Requirements:**
- ✅ Must be a **text-based PDF** (not scanned/image-based)
- ✅ File size < 10MB
- ✅ Contains extractable text

### **3. Update Test Password**

Edit `tests/e2e/onboarding-flow.spec.ts`:
```typescript
const TEST_PASSWORD = 'ActualPassword123!' // ⚠️ CHANGE THIS
```

---

## 🧪 **Running the Test**

### **Headed Mode (Recommended for First Run)**

See the browser in action:
```bash
npx playwright test tests/e2e/onboarding-flow.spec.ts --headed
```

### **Headless Mode (Faster)**

Run without visible browser:
```bash
npx playwright test tests/e2e/onboarding-flow.spec.ts
```

### **Debug Mode**

Step through the test:
```bash
npx playwright test tests/e2e/onboarding-flow.spec.ts --debug
```

### **Specific Browser**

```bash
# Chromium (default)
npx playwright test tests/e2e/onboarding-flow.spec.ts --project=chromium

# Firefox
npx playwright test tests/e2e/onboarding-flow.spec.ts --project=firefox

# WebKit (Safari)
npx playwright test tests/e2e/onboarding-flow.spec.ts --project=webkit
```

---

## 📊 **What the Test Does**

The automated test performs these steps:

1. ✅ **Navigate to signup page** - Verify usage limits shown
2. ✅ **Login** - Use test account credentials
3. ✅ **Verify mandatory onboarding** - Check no skip/close buttons
4. ✅ **Complete onboarding** - Go through 3-step process
5. ✅ **Verify dashboard empty state** - Check "Upload CV to Get Started" CTA
6. ✅ **Navigate to upload** - Click upload button
7. ✅ **Upload CV** - Upload Pamela Dale-Rourke CV.pdf
8. ✅ **Verify dashboard update** - Check CTA changed to "Generate your New CV"
9. ✅ **Start generation** - Click generate button
10. ✅ **Fill job description** - Paste sample job posting
11. ✅ **Generate CV** - Wait for AI generation (30-60 seconds)
12. ✅ **Verify success** - Check download/view button appears
13. ✅ **Verify usage tracking** - Check 0 generations remaining

**Total Duration:** ~2-3 minutes

---

## 🔍 **Test Output**

### **Success Output:**
```
📍 Step 1: Navigating to signup page...
✅ Signup page loaded with usage limit banner

📍 Step 2: Logging in...
✅ Logged in successfully

📍 Step 3: Checking onboarding modal...
✅ Onboarding modal is mandatory (no skip/close buttons)

... (continues for all 13 steps)

🎉 ========================================
🎉 COMPLETE ONBOARDING FLOW TEST PASSED!
🎉 ========================================
```

### **Failure Output:**
```
Error: Timeout 5000ms exceeded.
waiting for selector "text=Welcome to My CV Buddy!"
```

---

## 🐛 **Troubleshooting**

### **Issue: Test times out on login**
**Solution:** 
- Verify password is correct in test file
- Check account exists in Supabase
- Ensure account is not locked

### **Issue: Onboarding modal doesn't appear**
**Solution:**
- Run reset SQL script again
- Verify `onboarding_completed = FALSE` in profiles table

### **Issue: CV upload fails**
**Solution:**
- Check file path is correct
- Verify file is text-based PDF
- Check file size < 10MB

### **Issue: Generation times out**
**Solution:**
- Increase timeout in test (currently 90 seconds)
- Check OpenAI API key is configured
- Verify no rate limits hit

### **Issue: "Browser not found"**
**Solution:**
```bash
npx playwright install
```

---

## 📝 **Configuration Options**

### **Timeout Settings**

Edit in `tests/e2e/onboarding-flow.spec.ts`:
```typescript
test.setTimeout(120000) // 2 minutes total
await page.waitForSelector('text=Download', { timeout: 90000 }) // 90 seconds for generation
```

### **Base URL**

Set environment variable:
```bash
# Windows PowerShell
$env:BASE_URL="https://www.mycvbuddy.com"
npx playwright test tests/e2e/onboarding-flow.spec.ts --headed

# Windows CMD
set BASE_URL=https://www.mycvbuddy.com
npx playwright test tests/e2e/onboarding-flow.spec.ts --headed

# Linux/Mac
BASE_URL=https://www.mycvbuddy.com npx playwright test tests/e2e/onboarding-flow.spec.ts --headed
```

### **Screenshot on Failure**

Playwright automatically takes screenshots on failure:
```
test-results/
  onboarding-flow-spec-ts-complete-onboarding-flow-chromium/
    test-failed-1.png
```

---

## 🎯 **Expected Results**

After successful test run:

### **Database State:**
- ✅ 1 CV uploaded
- ✅ 1 Generation created
- ✅ `onboarding_completed = TRUE`
- ✅ `lifetime_generation_count = 1`
- ✅ `max_lifetime_generations = 1`
- ✅ `plan_type = 'free'`

### **User Experience Verified:**
- ✅ Signup shows usage limits
- ✅ Onboarding is mandatory
- ✅ Empty state shows upload CTA
- ✅ Upload works correctly
- ✅ Dashboard updates after upload
- ✅ Generation works end-to-end
- ✅ Usage tracking accurate

---

## 📚 **Additional Commands**

### **View Test Report**
```bash
npx playwright show-report
```

### **Update Browsers**
```bash
npx playwright install
```

### **Run All Tests**
```bash
npx playwright test
```

### **Run with UI Mode**
```bash
npx playwright test --ui
```

---

## ⚠️ **Important Notes**

1. **Password Security:** Don't commit the test file with real password to git
2. **Rate Limits:** Don't run test too frequently (OpenAI API limits)
3. **Test Account:** Only use jake.rourke@btinternet.com for testing
4. **Reset Between Runs:** Always reset account before re-running test
5. **Production Testing:** Be careful when testing on production

---

## 🔗 **Related Files**

- Test file: `tests/e2e/onboarding-flow.spec.ts`
- SQL reset: `scripts/reset-test-account.sql`
- Manual guide: `ONBOARDING-TEST-GUIDE.md`
- Schema docs: `DATABASE-SCHEMA-REFERENCE.md`

---

**Last Updated:** March 20, 2026  
**Status:** ✅ Ready to Run
