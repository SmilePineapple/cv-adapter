# 🔴 Urgent Fixes Needed

## ✅ Upload Working!
The CV upload is now working successfully after fixing the pdf-parse issue.

---

## 🔴 Issue 1: Review Page Showing Raw JSON

### Problem:
The Work Experience section is displaying as raw JSON array instead of formatted content:
```json
[
  {
    "company": "Child in Mind, Manchester",
    "job_title": "Service Lead for Schools",
    "responsibilities": "..."
  }
]
```

### Root Cause:
In `src/app/review/[id]/page.tsx`, lines 383-386 use `JSON.stringify()` for non-string content.

### Solution:
Add a helper function to format experience arrays properly:

```typescript
// Add this function near the top of the file (after imports)
const formatSectionContent = (content: any): string => {
  if (typeof content === 'string') {
    return content
  }
  
  // Handle array of experience objects
  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (item.company && item.job_title) {
        // Format as experience entry
        return `${item.job_title} | ${item.company}\n${item.responsibilities || item.description || ''}`
      }
      return JSON.stringify(item, null, 2)
    }).join('\n\n')
  }
  
  // Fallback to JSON for other objects
  return JSON.stringify(content, null, 2)
}
```

Then replace all instances of:
```typescript
{typeof section.content === 'string' 
  ? section.content 
  : JSON.stringify(section.content, null, 2)}
```

With:
```typescript
{formatSectionContent(section.content)}
```

This appears in 4 places:
- Line 356 (textarea value)
- Line 369 (original section display)
- Line 377 (generated section display)
- Line 385 (non-editing display)

---

## 🔴 Issue 2: Export Failing with 500 Error

### Problem:
When clicking "Download as PDF", getting:
```
POST https://www.mycvbuddy.com/api/export 500 (Internal Server Error)
Export error: Error: Export failed
```

### Root Cause:
The `/api/export` route is likely failing due to:
1. Puppeteer not working on Vercel serverless
2. Missing dependencies
3. Timeout issues

### Solution Options:

#### Option A: Use Vercel's PDF Generation (Recommended)
Install `@vercel/og` or use a PDF service like PDFShift

#### Option B: Fix Puppeteer Configuration
Add to `next.config.ts`:
```typescript
experimental: {
  serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
}
```

And use `puppeteer-core` with `@sparticuz/chromium` instead of regular puppeteer.

#### Option C: Disable PDF, Use DOCX Only (Quick Fix)
Temporarily disable PDF export and only offer DOCX/TXT until we can properly configure Puppeteer.

---

## 🔧 Quick Fixes to Implement Now:

### 1. Fix Review Page (High Priority)
- Add `formatSectionContent` helper
- Replace all `JSON.stringify` calls
- Test with uploaded CV

### 2. Fix Export (High Priority)
- Check Vercel logs for exact error
- Either fix Puppeteer or disable PDF temporarily
- Ensure DOCX export works

### 3. Clean Up Duplicate Experience Section
The review page shows both:
- "experience" (original)
- "Work Experience" (AI generated)

Need to merge these properly or hide the original when AI version exists.

---

## 📊 Priority Order:

1. **Fix review page JSON display** (breaks UX)
2. **Fix export functionality** (core feature)
3. **Remove duplicate sections** (polish)
4. **Fix React hydration warning** (already done)
5. **Fix browser extension errors** (not our code, ignore)

---

## 🚀 Next Steps:

1. Implement `formatSectionContent` helper
2. Check export API logs on Vercel
3. Test full flow: Upload → Generate → Review → Download
4. Deploy fixes

Would you like me to implement these fixes now?
