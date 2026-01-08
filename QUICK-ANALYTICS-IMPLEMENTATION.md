# Quick Analytics Implementation Guide

## 🎯 Goal: Add Event Tracking in 2 Hours

This guide will help you implement the most critical event tracking to understand user behavior.

---

## Step 1: Update GoogleAnalytics Component (10 min)

**File: `src/components/GoogleAnalytics.tsx`**

Add these helper functions at the end of the file:

```typescript
// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams)
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, eventParams)
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

// Track conversions
export const trackConversion = (value: number, currency: string = 'GBP') => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      value: value,
      currency: currency,
    })
  }
}
```

---

## Step 2: Track Dashboard Events (15 min)

**File: `src/app/dashboard/page.tsx`**

Add import at top:
```typescript
import { trackEvent } from '@/components/GoogleAnalytics'
```

Add tracking in useEffect:
```typescript
useEffect(() => {
  if (usageInfo) {
    trackEvent('page_view', {
      page: 'dashboard',
      plan_type: usageInfo.plan_type,
      generations_used: usageInfo.lifetime_generation_count,
      generations_remaining: usageInfo.max_lifetime_generations - usageInfo.lifetime_generation_count,
    })
  }
}, [usageInfo])
```

Track button clicks:
```typescript
// Find the Generate CV button click handler
const handleGenerateClick = (cvId: string) => {
  trackEvent('cv_generation_started', {
    cv_id: cvId,
    source: 'dashboard',
  })
  router.push(`/generate/${cvId}`)
}

// Find the Upload button
<Link
  href="/upload"
  onClick={() => trackEvent('upload_clicked', { source: 'dashboard' })}
  className="..."
>

// Find the Upgrade button
<Link
  href="/subscription"
  onClick={() => trackEvent('upgrade_clicked', { source: 'dashboard' })}
  className="..."
>
```

---

## Step 3: Track Upload Events (15 min)

**File: `src/app/upload/page.tsx`**

Add import:
```typescript
import { trackEvent } from '@/components/GoogleAnalytics'
```

Track page view:
```typescript
useEffect(() => {
  trackEvent('page_view', { page: 'upload' })
}, [])
```

Track upload:
```typescript
// Find the upload handler
const handleUpload = async () => {
  trackEvent('cv_upload_started', {
    file_size: file.size,
    file_type: file.type,
  })
  
  try {
    // ... existing upload logic ...
    
    trackEvent('cv_upload_completed', {
      file_size: file.size,
      file_type: file.type,
      cv_id: data.cv_id,
    })
  } catch (error) {
    trackEvent('cv_upload_failed', {
      error: error.message,
    })
  }
}
```

---

## Step 4: Track Generation Events (20 min)

**File: `src/app/generate/[id]/page.tsx`**

Add import:
```typescript
import { trackEvent } from '@/components/GoogleAnalytics'
```

Track page view:
```typescript
useEffect(() => {
  if (cvData) {
    trackEvent('page_view', {
      page: 'generate',
      cv_id: cvData.id,
    })
  }
}, [cvData])
```

Track generation:
```typescript
// Find the generate handler
const handleGenerate = async () => {
  trackEvent('cv_generation_started', {
    cv_id: cvId,
    job_title: jobTitle,
    tone: selectedTone,
    has_job_description: !!jobDescription,
  })
  
  try {
    // ... existing generation logic ...
    
    trackEvent('cv_generation_completed', {
      cv_id: cvId,
      job_title: jobTitle,
      generation_id: data.generation_id,
      ats_score: data.ats_score,
    })
  } catch (error) {
    trackEvent('cv_generation_failed', {
      error: error.message,
    })
  }
}
```

---

## Step 5: Track Download/Export Events (20 min)

**File: `src/app/download/[id]/page.tsx`**

Add import:
```typescript
import { trackEvent } from '@/components/GoogleAnalytics'
```

Track page view:
```typescript
useEffect(() => {
  if (generationData) {
    trackEvent('page_view', {
      page: 'download',
      generation_id: generationData.id,
      job_title: generationData.job_title,
    })
  }
}, [generationData])
```

Track template selection:
```typescript
// Find template selection handler
const handleTemplateSelect = (templateId: string) => {
  setSelectedTemplate(templateId)
  trackEvent('template_selected', {
    template: templateId,
    generation_id: generationId,
  })
}
```

Track export:
```typescript
// Find the export handler
const handleExport = async () => {
  trackEvent('cv_export_started', {
    format: selectedFormat,
    template: selectedTemplate,
    generation_id: generationId,
  })
  
  try {
    // ... existing export logic ...
    
    trackEvent('cv_export_completed', {
      format: selectedFormat,
      template: selectedTemplate,
      generation_id: generationId,
    })
  } catch (error) {
    trackEvent('cv_export_failed', {
      error: error.message,
    })
  }
}
```

Track AI Review:
```typescript
// Find AI Review handler
const handleAIReview = async () => {
  trackEvent('ai_review_started', {
    generation_id: generationId,
  })
  
  try {
    // ... existing review logic ...
    
    trackEvent('ai_review_completed', {
      generation_id: generationId,
    })
  } catch (error) {
    trackEvent('ai_review_failed', {
      error: error.message,
    })
  }
}
```

---

## Step 6: Track Subscription Events (15 min)

**File: `src/app/subscription/page.tsx`**

Add import:
```typescript
import { trackEvent } from '@/components/GoogleAnalytics'
```

Track page view:
```typescript
useEffect(() => {
  trackEvent('page_view', {
    page: 'subscription',
    current_plan: isPro ? 'pro' : 'free',
  })
}, [isPro])
```

Track upgrade click:
```typescript
// Find the upgrade button handler
const handleUpgrade = async () => {
  trackEvent('upgrade_clicked', {
    plan: 'pro',
    price: 5,
    source: 'subscription_page',
  })
  
  // ... existing checkout logic ...
}
```

---

## Step 7: Track Payment Events (10 min)

**File: `src/app/api/stripe/webhook/route.ts`**

Add import at top:
```typescript
import { trackConversion } from '@/components/GoogleAnalytics'
```

Track successful payment:
```typescript
// Find the payment success handler
if (event.type === 'checkout.session.completed') {
  // ... existing logic ...
  
  trackConversion(5, 'GBP')
  
  // Also track in your analytics DB
  await trackEvent('payment_completed', {
    amount: 5,
    plan_type: 'pro',
    user_id: userId,
  })
}
```

---

## Step 8: Set Up Conversion Funnels in GA4 (15 min)

1. Go to Google Analytics 4
2. Click **Admin** → **Events**
3. Mark these as **Conversions**:
   - `cv_generation_completed`
   - `cv_export_completed`
   - `payment_completed`

4. Create **Exploration** → **Funnel Exploration**:

**Funnel 1: CV Generation Flow**
- Step 1: `page_view` (page = upload)
- Step 2: `cv_upload_completed`
- Step 3: `page_view` (page = generate)
- Step 4: `cv_generation_completed`
- Step 5: `page_view` (page = download)
- Step 6: `cv_export_completed`

**Funnel 2: Upgrade Flow**
- Step 1: `upgrade_clicked`
- Step 2: `page_view` (page = subscription)
- Step 3: `payment_completed`

---

## Step 9: Test Everything (10 min)

1. Open browser console
2. Go through the entire flow:
   - Visit dashboard → See "📊 Analytics Event: page_view"
   - Upload CV → See "📊 Analytics Event: cv_upload_started"
   - Generate CV → See "📊 Analytics Event: cv_generation_started"
   - Download CV → See "📊 Analytics Event: cv_export_started"

3. Check GA4 Real-time reports to confirm events are coming through

---

## Step 10: Monitor & Optimize (Ongoing)

### Daily Check (5 min)
- Open GA4 → Real-time
- Verify events are tracking
- Check for any errors

### Weekly Review (30 min)
- Review conversion funnels
- Identify drop-off points
- Plan optimizations

### Monthly Analysis (2 hours)
- Deep dive into user behavior
- A/B test results
- Plan next month's improvements

---

## 📊 Expected Results After Implementation

### Week 1
- **Events:** 107 → 1,000+ (10x increase)
- **Insights:** Clear view of user journey
- **Drop-offs:** Identified 2-3 friction points

### Week 2
- **Optimizations:** Implemented quick fixes
- **Conversion:** +10-20% improvement
- **Confidence:** Data-driven decisions

### Month 1
- **Users:** 89 → 150-200
- **Revenue:** Measurable growth
- **Product:** Better user experience

---

## 🎯 Success Criteria

✅ All critical events tracking
✅ Conversion funnels set up in GA4
✅ Real-time monitoring working
✅ Weekly review process established
✅ First optimization implemented

---

## 🚀 Quick Wins to Implement Based on Data

Once you have data, look for:

1. **High drop-off at upload?**
   - Add drag-and-drop
   - Show example CVs
   - Improve error messages

2. **High drop-off at generate?**
   - Simplify form
   - Add job description templates
   - Show preview of output

3. **High drop-off at download?**
   - Improve template previews
   - Add more export formats
   - Show social proof

4. **Low upgrade rate?**
   - Improve value proposition
   - Add testimonials
   - Offer limited-time discount

---

## 💡 Pro Tips

1. **Start Small:** Implement tracking on 2-3 key pages first
2. **Test Locally:** Use console logs to verify events
3. **Monitor Daily:** Check GA4 real-time for first week
4. **Iterate Fast:** Make small improvements weekly
5. **Document Changes:** Track what you optimize and results

---

## 📞 Need Help?

If you get stuck:
1. Check browser console for errors
2. Verify GA4 Measurement ID is correct
3. Test in incognito mode
4. Check GA4 DebugView for real-time debugging

**Remember:** Perfect is the enemy of good. Get basic tracking live, then improve! 🚀
