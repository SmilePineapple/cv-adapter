# 🔧 LINKEDIN INTEGRATION - FIXES & IMPROVEMENTS

**Date**: October 23, 2025

---

## ❌ **ISSUE 1: Database Schema Mismatch**

**Error**: `Could not find the 'sections' column of 'cvs' in the schema cache`

**Root Cause**: The LinkedIn parse API tries to insert `sections` but the `cvs` table has `parsed_sections` instead.

**Fix**: Update the API to use `parsed_sections`:

```typescript
// In src/app/api/linkedin/parse/route.ts
// Change line ~120:
const { data: cv, error: cvError } = await supabase
  .from('cvs')
  .insert({
    user_id: userId,
    file_meta: {
      name: 'LinkedIn Import',
      size: linkedinText.length,
      type: 'text/plain',
      upload_date: new Date().toISOString(),
      source: 'linkedin'
    },
    parsed_sections: cvSections,  // ✅ Changed from 'sections' to 'parsed_sections'
    original_text: linkedinText,  // ✅ Added required field
    detected_language: 'en'
  })
```

---

## ❌ **ISSUE 2: Copy/Paste UX is Confusing**

**Problem**: No "More" button or "Save to PDF" option on LinkedIn

**Solution**: Use LinkedIn scraping API instead!

### **RECOMMENDED: Proxycurl API**

**Why Proxycurl**:
- ✅ Just need profile URL (e.g., `linkedin.com/in/username`)
- ✅ Returns structured JSON data
- ✅ $0.01 per profile (very affordable)
- ✅ No LinkedIn approval needed
- ✅ Used by most CV builders
- ✅ Reliable and maintained

**Setup**:
1. Sign up at: https://nubela.co/proxycurl
2. Get API key
3. Add to `.env.local`:
```env
PROXYCURL_API_KEY=your_key_here
```

**Alternative: RapidAPI**
- Multiple LinkedIn scraper options
- Similar pricing
- Backup option if Proxycurl doesn't work

---

## ✅ **FIXES TO APPLY**

### **Fix 1: Update LinkedIn Parse API**

File: `src/app/api/linkedin/parse/route.ts`

Change line ~120-130 from:
```typescript
const { data: cv, error: cvError } = await supabase
  .from('cvs')
  .insert({
    user_id: userId,
    file_meta: { ... },
    sections: cvSections,  // ❌ Wrong column name
    detected_language: 'en'
  })
```

To:
```typescript
const { data: cv, error: cvError } = await supabase
  .from('cvs')
  .insert({
    user_id: userId,
    file_meta: {
      name: 'LinkedIn Import',
      size: linkedinText.length,
      type: 'text/plain',
      upload_date: new Date().toISOString(),
      source: 'linkedin'
    },
    parsed_sections: cvSections,  // ✅ Correct column name
    original_text: linkedinText,   // ✅ Required field
    detected_language: 'en'
  })
```

### **Fix 2: Update LinkedIn Scrape API**

File: `src/app/api/linkedin/scrape/route.ts`

Change line ~95-105 from:
```typescript
const { data: cv, error: cvError } = await supabase
  .from('cvs')
  .insert({
    user_id: userId,
    file_meta: { ... },
    sections: cvSections,  // ❌ Wrong
    detected_language: 'en'
  })
```

To:
```typescript
const { data: cv, error: cvError } = await supabase
  .from('cvs')
  .insert({
    user_id: userId,
    file_meta: {
      name: `${profileData.full_name || 'LinkedIn Import'}`,
      size: 0,
      type: 'application/json',
      upload_date: new Date().toISOString(),
      source: 'linkedin_scrape',
      linkedin_url: linkedinUrl
    },
    parsed_sections: cvSections,  // ✅ Correct
    original_text: JSON.stringify(profileData),  // ✅ Required
    detected_language: 'en'
  })
```

### **Fix 3: Update LinkedInImport Component**

Add URL input option (already created in `src/app/api/linkedin/scrape/route.ts`)

Update component to show:
1. **Primary**: URL input field
2. **Fallback**: Text paste option

---

## 🚀 **RECOMMENDED IMPLEMENTATION**

### **Step 1: Sign up for Proxycurl**
1. Go to https://nubela.co/proxycurl
2. Sign up (free tier available)
3. Get API key
4. Add to `.env.local`:
```env
PROXYCURL_API_KEY=your_api_key_here
```

### **Step 2: Apply Fixes**
Run these fixes in order:
1. Fix LinkedIn parse API (parsed_sections + original_text)
2. Fix LinkedIn scrape API (parsed_sections + original_text)
3. Test with URL import

### **Step 3: Update UI**
Change LinkedInImport component to show:
- **Tab 1**: "Import by URL" (default, recommended)
- **Tab 2**: "Import by Text" (fallback)

---

## 📋 **TESTING CHECKLIST**

### **Test Parse API (Text Method)**
- [ ] Paste LinkedIn text
- [ ] Click import
- [ ] CV created successfully
- [ ] No "sections" error
- [ ] Redirects to generate page

### **Test Scrape API (URL Method)**
- [ ] Enter LinkedIn URL
- [ ] Click import
- [ ] Profile fetched from Proxycurl
- [ ] CV created successfully
- [ ] Redirects to generate page

### **Test Gating**
- [ ] Free user: 1 import works
- [ ] Free user: 2nd import → Upgrade modal
- [ ] Pro user: Unlimited imports

---

## 💰 **COST ESTIMATE**

**Proxycurl Pricing**:
- $0.01 per profile (with cache)
- $0.03 per profile (fresh data)

**Monthly Cost Examples**:
- 100 imports/month = $1-3
- 500 imports/month = $5-15
- 1000 imports/month = $10-30

**Very affordable!** Much cheaper than building your own scraper.

---

## 🎯 **NEXT STEPS**

1. **Apply Fix 1** (parse API) - 2 minutes
2. **Apply Fix 2** (scrape API) - 2 minutes
3. **Test text import** - 5 minutes
4. **Sign up for Proxycurl** - 10 minutes
5. **Test URL import** - 5 minutes
6. **Update UI to prioritize URL** - 15 minutes

**Total Time**: ~40 minutes to fully working LinkedIn import!

---

**Tell me when ready and I'll apply the fixes!**
