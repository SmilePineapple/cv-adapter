# 🧪 Jake's Account - Automated Testing Instructions

**Created:** January 2, 2026  
**Test Account:** jake.rourke@btinternet.com  
**Status:** Ready to Run

---

## 📋 What's Been Created

I've created a **comprehensive automated test suite** that will:

✅ **Sign up** the test account  
✅ **Upload** Jake's CV (Jake_Rourke_CV (1).pdf)  
✅ **Generate** adapted CV with job description  
✅ **Test editing** functionality  
✅ **Test export/download** (PDF generation)  
✅ **Test cover letter** generation  
✅ **Check dashboard** and usage tracking  
✅ **Take screenshots** at every step  
✅ **Track all errors** automatically  
✅ **Generate detailed report**  

---

## 🚀 How to Run the Tests

### **Option 1: Quick Run (Recommended)**

```powershell
# Just run this command:
.\run-jake-tests.ps1
```

This script will:
1. Check and install dependencies
2. Install Playwright if needed
3. Run all tests with visible browser
4. Save screenshots to `test-results/`
5. Generate HTML report
6. Open the report automatically

---

### **Option 2: Manual Run**

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run the test
npx playwright test src/test/e2e/jake-test-flow.spec.ts --headed

# 4. View report
npx playwright show-report
```

---

## 📸 What Gets Tested

### **Test Flow (7 Steps):**

1. **Sign Up** ✅
   - Navigate to signup page
   - Fill in email/password
   - Submit form
   - Screenshot: `01-signup.png`

2. **Upload CV** ✅
   - Login to account
   - Navigate to upload
   - Upload Jake_Rourke_CV (1).pdf
   - Wait for parsing
   - Screenshot: `02-upload.png`

3. **Generate Adapted CV** ✅
   - Fill job details:
     - Title: "Senior Software Engineer"
     - Company: "Tech Solutions Ltd"
     - Description: Full job posting
   - Click generate
   - Wait for AI (30-60 seconds)
   - Check ATS score
   - Screenshots: `03-before-generate.png`, `04-generation-result.png`

4. **Test Editing** ✅
   - Navigate to edit page
   - Edit a section
   - Save changes
   - Screenshots: `05-edit-page.png`, `06-after-edit.png`

5. **Test Export** ✅
   - Navigate to download page
   - Select template
   - Export as PDF
   - Screenshots: `07-download-page.png`, `08-after-export.png`

6. **Test Cover Letter** ✅
   - Navigate to cover letter generator
   - Fill job details
   - Generate cover letter
   - Screenshots: `09-cover-letter-form.png`, `10-cover-letter-result.png`

7. **Check Dashboard** ✅
   - View final dashboard
   - Check usage count
   - Count CVs and generations
   - Screenshot: `11-final-dashboard.png`

---

## 📊 Test Results Location

After running tests, check:

```
test-results/
├── 01-signup.png
├── 02-upload.png
├── 03-before-generate.png
├── 04-generation-result.png
├── 05-edit-page.png
├── 06-after-edit.png
├── 07-download-page.png
├── 08-after-export.png
├── 09-cover-letter-form.png
├── 10-cover-letter-result.png
└── 11-final-dashboard.png

playwright-report/
└── index.html (detailed test report)
```

---

## 🔍 What to Look For

### **In Console Output:**

✅ **Success Indicators:**
```
✅ Signup completed
✅ Logged in successfully
✅ Upload success message found
✅ CV ID extracted: [uuid]
✅ Job title filled
✅ Generation completed
📊 ATS Score: [score]
✅ Template selected
✅ PDF download started
✅ Cover letter generated
📈 Usage: 1/1 generations
```

❌ **Error Indicators:**
```
❌ Timeout waiting for element
❌ Element not found
❌ Upload failed
❌ Generation failed
❌ Network error
```

### **In Screenshots:**

✅ **Check for:**
- Clean UI (no error messages)
- Proper form filling
- Success messages
- Generated content visible
- ATS scores displayed
- Download buttons working
- Dashboard showing CVs/generations

❌ **Watch for:**
- Error messages
- Blank pages
- Loading spinners stuck
- Missing content
- 404 errors
- Console errors (red text)

---

## 🐛 Error Tracking

The test automatically tracks:

1. **Navigation Errors**
   - Failed redirects
   - 404 pages
   - Timeout errors

2. **Form Errors**
   - Missing fields
   - Validation errors
   - Submit failures

3. **Upload Errors**
   - File size issues
   - Format errors
   - Parsing failures

4. **Generation Errors**
   - AI timeout
   - OpenAI errors
   - Database errors

5. **Export Errors**
   - PDF generation failures
   - Template errors
   - Download issues

---

## ⚙️ Test Configuration

### **Test Account Details:**
```javascript
{
  name: 'Jake',
  email: 'jake.rourke@btinternet.com',
  password: 'Fearnley09'
}
```

### **CV File:**
```
C:/Users/jaket/Desktop/CV/cv-adapter/CV examples/Jake_Rourke_CV (1).pdf
```

### **Test Job:**
```javascript
{
  title: 'Senior Software Engineer',
  company: 'Tech Solutions Ltd',
  description: 'Full job posting with requirements...'
}
```

### **Timeouts:**
- Page load: 10 seconds
- Upload: 5 seconds
- AI generation: 60 seconds
- Cover letter: 30 seconds
- Total test: 120 seconds (2 minutes)

---

## 🔧 Troubleshooting

### **Problem: Dependencies not installed**
```bash
npm install
npx playwright install chromium
```

### **Problem: CV file not found**
```
Error: File not found at path
```
**Solution:** Verify the CV file exists at:
`C:/Users/jaket/Desktop/CV/cv-adapter/CV examples/Jake_Rourke_CV (1).pdf`

### **Problem: Test timeout**
```
Error: Timeout 120000ms exceeded
```
**Solution:** 
- Check internet connection
- Verify app is running (localhost:3000 or production)
- Increase timeout in test file

### **Problem: Account already exists**
```
Error: Email already registered
```
**Solution:**
- Delete the account from Supabase
- Or change email in test file
- Or skip signup test

### **Problem: Browser not opening**
```bash
# Run in headed mode to see browser
npx playwright test --headed

# Or debug mode
npx playwright test --debug
```

---

## 📝 Manual Steps Required

### **Before Running Tests:**

1. ✅ **Verify CV file exists:**
   ```
   C:/Users/jaket/Desktop/CV/cv-adapter/CV examples/Jake_Rourke_CV (1).pdf
   ```

2. ✅ **Ensure app is accessible:**
   - Production: https://mycvbuddy.com
   - Or local: http://localhost:3000

3. ⚠️ **Email confirmation:**
   - After signup, you'll need to confirm the email
   - Check jake.rourke@btinternet.com inbox
   - Click confirmation link
   - Then re-run tests from Step 2 onwards

---

## 🎯 Expected Results

### **After Successful Test Run:**

✅ **Account Created:**
- Email: jake.rourke@btinternet.com
- Status: Active (after email confirmation)

✅ **CV Uploaded:**
- Jake_Rourke_CV (1).pdf parsed
- Sections extracted
- Stored in database

✅ **Generation Created:**
- Job: Senior Software Engineer @ Tech Solutions Ltd
- ATS Score: 70-90 (expected range)
- Adapted sections generated

✅ **Edits Made:**
- At least one section edited
- Changes saved

✅ **Export Tested:**
- Template selected
- PDF download initiated

✅ **Cover Letter Generated:**
- Based on Jake's CV
- Tailored to job description

✅ **Dashboard Updated:**
- Shows 1 CV
- Shows 1 generation
- Shows 1/1 usage (free tier)

---

## 📈 Success Metrics

| Metric | Target | How to Check |
|--------|--------|--------------|
| **Signup Success** | ✅ | See "Signup completed" in console |
| **Upload Success** | ✅ | See CV in dashboard |
| **Generation Success** | ✅ | ATS score displayed |
| **ATS Score** | 70-90 | Check screenshot 04 |
| **Edit Success** | ✅ | Changes saved message |
| **Export Success** | ✅ | PDF download started |
| **Cover Letter** | ✅ | Preview visible |
| **No Errors** | 0 | Check console for ❌ |
| **All Screenshots** | 11 | Count files in test-results/ |

---

## 🚨 Known Issues to Watch For

Based on the project analysis, watch for:

1. **Console.log spam** - Lots of debug logs (expected)
2. **Slow AI generation** - Can take 30-60 seconds (normal)
3. **Email confirmation** - Manual step required
4. **Free tier limit** - Only 1 generation allowed
5. **PDF generation** - May be slow on first run

---

## 📞 Next Steps After Testing

### **If Tests Pass:**
1. ✅ Review all screenshots
2. ✅ Verify data in Supabase dashboard
3. ✅ Check admin dashboard for new user
4. ✅ Document any observations
5. ✅ Ready for production use!

### **If Tests Fail:**
1. ❌ Check console output for errors
2. ❌ Review screenshots to see where it failed
3. ❌ Check browser console (F12) for JS errors
4. ❌ Verify environment variables
5. ❌ Run tests again with `--debug` flag
6. ❌ Document the error for fixing

---

## 🎓 Running Specific Tests

```bash
# Run only signup test
npx playwright test -g "Step 1"

# Run only upload test
npx playwright test -g "Step 2"

# Run only generation test
npx playwright test -g "Step 3"

# Run with debug mode
npx playwright test --debug

# Run with slow motion
npx playwright test --slow-mo=1000
```

---

## ✅ Quick Start Checklist

- [ ] CV file exists at correct path
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright installed (`npx playwright install chromium`)
- [ ] App is accessible (production or local)
- [ ] Run: `.\run-jake-tests.ps1`
- [ ] Confirm email (manual step)
- [ ] Review screenshots in `test-results/`
- [ ] Check HTML report
- [ ] Verify in Supabase dashboard
- [ ] Document results

---

**Ready to run?** Execute: `.\run-jake-tests.ps1`

**Questions?** Check the console output and screenshots for detailed information about what happened at each step.
