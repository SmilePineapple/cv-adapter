# Google Search Console Indexing Fixes - March 23, 2026

## Issues Reported by GSC

### 1. Page with redirect (11 pages) - VALIDATION FAILED
**Status**: ❌ Failed validation (Started: 3/17/26, Failed: 3/21/26)

**Affected URLs**:
- http://mycvbuddy.com/
- https://mycvbuddy.com/
- http://www.mycvbuddy.com/
- https://www.mycvbuddy.com/blog/cv-writing-tips
- https://mycvbuddy.com/cover-letter
- https://mycvbuddy.com/upload
- https://mycvbuddy.com/help
- https://mycvbuddy.com/privacy
- https://mycvbuddy.com/blog
- https://mycvbuddy.com/auth/signup
- 1 more URL

### 2. Crawled - currently not indexed (7 pages) - VALIDATION FAILED
**Status**: ❌ Failed validation (Started: 3/16/26, Failed: 3/21/26)

**Affected URLs**:
- https://www.mycvbuddy.com/roast-cv
- https://www.mycvbuddy.com/blog/cv-examples-by-industry-uk
- https://www.mycvbuddy.com/blog/ai-powered-cv-optimization-2025
- https://www.mycvbuddy.com/interview-prep
- https://www.mycvbuddy.com/blog/how-to-beat-ats-systems
- https://mycvbuddy.com/subscription
- https://www.mycvbuddy.com/favicon.ico

---

## Root Cause Analysis

### Redirect Chain Problem

**The Issue**:
Google was crawling multiple URL variants and encountering redirect chains:

```
http://mycvbuddy.com/page
  ↓ (redirect)
https://mycvbuddy.com/page
  ↓ (redirect)
https://www.mycvbuddy.com/page
```

This created:
1. **Multiple hops** - Google had to follow 2 redirects to reach canonical URL
2. **Duplicate URL variants** - Google saw 4 versions of each page (http/https × www/non-www)
3. **Indexing confusion** - Google didn't know which version to index

### Sitemap Problem

**The Issue**:
Sitemap contained URLs that were redirecting:
- `/blog/how-to-beat-ats-systems` → redirects to `/ats-optimization-guide`
- `/blog/cv-writing-tips` → redirects to `/cv-writing-guide`
- `/blog/cv-examples-by-industry-uk` → redirects to `/cv-examples`

This caused Google to:
1. Crawl redirected URLs unnecessarily
2. Waste crawl budget on redirect chains
3. Report "Page with redirect" errors

---

## Fixes Implemented (March 23, 2026)

### 1. Fixed Redirect Chains in `vercel.json`

**Added explicit HTTP → HTTPS redirect**:
```json
{
  "source": "/:path*",
  "has": [
    {
      "type": "host",
      "value": "www.mycvbuddy.com"
    },
    {
      "type": "header",
      "key": "x-forwarded-proto",
      "value": "http"
    }
  ],
  "destination": "https://www.mycvbuddy.com/:path*",
  "permanent": true,
  "statusCode": 301
}
```

**Result**: Now only 1 redirect instead of 2
```
http://www.mycvbuddy.com/page
  ↓ (single 301 redirect)
https://www.mycvbuddy.com/page ✅
```

### 2. Removed Duplicate Redirect from `next.config.ts`

**Removed**:
```typescript
{
  source: '/:path*',
  has: [{ type: 'host', value: 'mycvbuddy.com' }],
  destination: 'https://www.mycvbuddy.com/:path*',
  permanent: true,
}
```

**Why**: This was duplicating the redirect in `vercel.json`, causing potential conflicts.

**Kept in `vercel.json`** for proper infrastructure-level handling.

### 3. Added Missing Blog Post Redirect

**Added to `next.config.ts`**:
```typescript
{
  source: '/blog/ai-powered-cv-optimization-2025',
  destination: '/ats-optimization-guide',
  permanent: true,
}
```

**Why**: Google was crawling this URL and finding it not indexed.

### 4. Cleaned Up Sitemap

**Removed redirected URLs from `sitemap.ts`**:
- ❌ `/blog/how-to-beat-ats-systems` (redirects to `/ats-optimization-guide`)
- ❌ `/blog/cv-writing-tips` (redirects to `/cv-writing-guide`)
- ❌ `/blog/cv-examples-by-industry-uk` (redirects to `/cv-examples`)

**Kept only canonical URLs**:
- ✅ `/blog/best-free-cv-builders-uk-2025`
- ✅ `/blog/cv-buddy-vs-canva`
- ✅ `/blog/cv-template-uk-2025`
- ✅ `/blog/resume-vs-cv-difference`
- ✅ `/blog/career-change-cv-guide-uk`
- ✅ `/blog/graduate-cv-no-experience-uk`

---

## Expected Results

### Immediate (Within 24-48 hours)

1. **Clean redirects**: All URL variants redirect with single 301 to canonical URL
2. **No redirect chains**: Google sees only 1 redirect, not 2-3
3. **Sitemap compliance**: All sitemap URLs are directly indexable (no redirects)

### Short-term (Within 1-2 weeks)

1. **GSC validation passes**: "Page with redirect" errors should resolve
2. **Improved crawl efficiency**: Google wastes less crawl budget on redirects
3. **Better indexing**: Google indexes canonical URLs only

### Medium-term (Within 1 month)

1. **Impressions stabilize**: Should see impressions return to 100+ per day
2. **Indexing improves**: More pages properly indexed
3. **Rankings improve**: Canonical URLs get full ranking credit

---

## Monitoring Plan

### Daily (Next 7 days)
- [ ] Check Google Search Console for new indexing errors
- [ ] Monitor "Page with redirect" validation status
- [ ] Check if sitemap is being crawled correctly

### Weekly (Next 4 weeks)
- [ ] Review GSC Coverage report
- [ ] Check impressions and clicks trends
- [ ] Monitor keyword rankings

### Request Re-indexing (After deployment)
1. Go to Google Search Console
2. Use URL Inspection tool for key pages:
   - https://www.mycvbuddy.com/
   - https://www.mycvbuddy.com/ats-optimization-guide
   - https://www.mycvbuddy.com/cv-writing-guide
   - https://www.mycvbuddy.com/cv-examples
3. Click "Request Indexing" for each

---

## Technical Details

### Redirect Flow (Before Fix)

```
User types: mycvbuddy.com
  ↓
http://mycvbuddy.com/ (Vercel)
  ↓ 301 redirect (next.config.ts)
https://mycvbuddy.com/ (Vercel)
  ↓ 301 redirect (vercel.json)
https://www.mycvbuddy.com/ ✅ FINAL
```

**Problem**: 2 redirects = redirect chain

### Redirect Flow (After Fix)

```
User types: mycvbuddy.com
  ↓
http://mycvbuddy.com/ (Vercel)
  ↓ 301 redirect (vercel.json only)
https://www.mycvbuddy.com/ ✅ FINAL
```

**Result**: 1 redirect = clean, fast, SEO-friendly

---

## Files Changed

1. **vercel.json**
   - Added HTTP → HTTPS redirect for www subdomain
   - Explicit statusCode: 301

2. **next.config.ts**
   - Removed duplicate non-www redirect
   - Added `/blog/ai-powered-cv-optimization-2025` redirect

3. **src/app/sitemap.ts**
   - Removed 3 redirected blog post URLs
   - Kept only canonical, directly indexable URLs

---

## Success Metrics

### Week 1 (March 23-30)
- [ ] "Page with redirect" validation passes
- [ ] All 11 redirect errors resolved
- [ ] Sitemap shows 0 redirect URLs

### Week 2-4 (April 2026)
- [ ] Impressions return to 100+ per day
- [ ] "Crawled - currently not indexed" drops from 7 to 0
- [ ] Homepage returns to page 1 for branded terms

### Month 2-3 (May-June 2026)
- [ ] Impressions reach 200+ per day
- [ ] Some non-branded keywords reach page 2
- [ ] Click-through rate improves to 5%+

---

## Next Steps (From Traffic Recovery Plan)

### Phase 1: Emergency Fixes (Completed ✅)
- ✅ Fix redirect chains
- ✅ Clean up sitemap
- ✅ Add missing redirects

### Phase 2: Content & UX (In Progress)
- [ ] Add FAQ section to homepage
- [ ] Add user testimonials
- [ ] Add trust badges
- [ ] Create downloadable resources
- [ ] Improve internal linking

### Phase 3: Authority Building (Upcoming)
- [ ] Build backlinks (target: 15+ in month 1)
- [ ] Guest posting campaign
- [ ] Digital PR outreach
- [ ] Social proof collection

---

**Status**: ✅ DEPLOYED (March 23, 2026)  
**Commit**: Fix Google Search Console indexing errors - redirect chains  
**Next Review**: March 30, 2026 (Check GSC validation status)
