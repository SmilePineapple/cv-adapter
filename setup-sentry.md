# 🚀 Quick Sentry Setup (5 Minutes)

**Goal:** Automatically catch and report all errors from your users

---

## Step 1: Install Sentry (2 minutes)

```bash
# Run this command in your project directory
npx @sentry/wizard@latest -i nextjs
```

**What this does:**
- ✅ Installs `@sentry/nextjs` package
- ✅ Creates `sentry.client.config.ts`
- ✅ Creates `sentry.server.config.ts`
- ✅ Creates `sentry.edge.config.ts`
- ✅ Updates `next.config.js`
- ✅ Sets up automatic source map uploads

**Follow the prompts:**
1. Login to Sentry (or create account)
2. Select/create organization
3. Create project: "cv-adapter"
4. Platform: Next.js
5. Copy the DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

---

## Step 2: Add Environment Variables (1 minute)

### Local Development (.env.local)
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your_auth_token_here
SENTRY_ORG=your-org-name
SENTRY_PROJECT=cv-adapter
```

### Vercel Production
1. Go to: https://vercel.com/your-team/cv-adapter/settings/environment-variables
2. Add each variable:
   - `NEXT_PUBLIC_SENTRY_DSN` → Your DSN
   - `SENTRY_AUTH_TOKEN` → Your auth token
   - `SENTRY_ORG` → Your org name
   - `SENTRY_PROJECT` → cv-adapter
3. Select: ✅ Production, ✅ Preview, ✅ Development

**Get your auth token:**
1. Go to: https://sentry.io/settings/account/api/auth-tokens/
2. Click "Create New Token"
3. Name: "Vercel Deployment"
4. Scopes: `project:read`, `project:releases`, `org:read`
5. Copy the token

---

## Step 3: Test It (1 minute)

Add this to any page temporarily:

```typescript
// src/app/page.tsx
'use client'

export default function Home() {
  return (
    <div>
      <button onClick={() => {
        throw new Error('Test Sentry - This is a test error!')
      }}>
        Test Error Tracking
      </button>
    </div>
  )
}
```

Click the button → Check Sentry dashboard → You should see the error!

---

## Step 4: Configure Alerts (1 minute)

1. Go to: https://sentry.io/organizations/your-org/alerts/rules/
2. Click "Create Alert"
3. Choose "Issues"
4. Configure:
   - **When:** An event is seen
   - **If:** All events
   - **Then:** Send a notification to: Your Email
5. Save as "All Errors Alert"

**Create a second alert for critical errors:**
1. Create Alert → Issues
2. Configure:
   - **When:** An event is seen
   - **If:** The event's level is equal to `fatal` or `error`
   - **Then:** Send a notification to: Your Email
3. Save as "Critical Errors Only"

---

## Step 5: Deploy (1 minute)

```bash
git add .
git commit -m "Add Sentry error monitoring"
git push origin main
```

Vercel will automatically deploy with Sentry enabled!

---

## ✅ What You Get

### Immediate Benefits:
- 📧 **Email alerts** when errors occur
- 👤 **User context** (email, ID, actions)
- 📍 **Exact location** (file, line number)
- 📊 **Error frequency** (how many users affected)
- 🔍 **Stack traces** (full error details)
- 📈 **Trends** (increasing/decreasing)

### Example Alert:
```
🔴 New Error: "Failed to parse CV sections"

User: jake@example.com
Page: /generate/abc123
Browser: Chrome 119
Device: Desktop
Time: 2 minutes ago

Stack Trace:
  at parseSections (upload/route.ts:182)
  at POST (upload/route.ts:156)
  
Affected: 1 user
First seen: 2 minutes ago
```

---

## 🎯 Next Steps After Setup

### Week 1: Monitor
- Check Sentry daily
- Identify top 3 errors
- Fix the most common ones

### Week 2: Optimize
- Set up custom error boundaries
- Add user feedback widget
- Configure performance monitoring

### Week 3: Refine
- Adjust alert thresholds
- Add custom tags for better filtering
- Set up Slack integration (optional)

---

## 🔧 Advanced Configuration (Optional)

### Add User Feedback Widget

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Enable user feedback
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session replay (see what user did before error)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // 100% when error occurs
})
```

### Add Custom Context

```typescript
// In your API routes or pages
import * as Sentry from '@sentry/nextjs'

Sentry.setUser({
  id: user.id,
  email: user.email,
  subscription: user.subscription_tier
})

Sentry.setContext('cv_generation', {
  cv_id: cvId,
  job_title: jobTitle,
  generation_count: userGenerations
})
```

### Filter Out Noise

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  beforeSend(event, hint) {
    // Don't send errors from bots
    if (event.request?.headers?.['user-agent']?.includes('bot')) {
      return null
    }
    
    // Don't send network errors (user's internet issue)
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      return null
    }
    
    return event
  }
})
```

---

## 📊 Monitoring Dashboard

After setup, you'll have access to:

### Issues Dashboard
- All errors grouped by type
- Frequency charts
- Affected users count
- Resolution status

### Performance Dashboard
- API response times
- Slow database queries
- Frontend load times
- User interactions

### Releases Dashboard
- Which deployment caused errors
- Error rate per release
- Rollback recommendations

---

## 🆘 Troubleshooting

### "Sentry not capturing errors"
1. Check DSN is correct in env vars
2. Verify env vars are in Vercel
3. Redeploy after adding env vars
4. Check browser console for Sentry init errors

### "Source maps not uploading"
1. Check `SENTRY_AUTH_TOKEN` is set
2. Verify token has correct scopes
3. Check `next.config.js` has Sentry plugin
4. Look for upload errors in build logs

### "Too many alerts"
1. Adjust alert thresholds
2. Add filters to ignore known issues
3. Use `beforeSend` to filter noise
4. Group similar errors together

---

## 💰 Cost Estimate

**Free Tier:**
- 5,000 errors/month
- 10,000 transactions/month
- 50 replays/month
- 1 project
- 7-day data retention

**Your current scale (96 users):**
- Estimated: ~500-1,000 errors/month
- **You'll stay in free tier easily!**

**If you grow to 1,000 users:**
- Estimated: ~5,000-10,000 errors/month
- **Still free tier or $26/month**

---

## ✅ Checklist

- [ ] Run `npx @sentry/wizard@latest -i nextjs`
- [ ] Add env vars to `.env.local`
- [ ] Add env vars to Vercel
- [ ] Test with error button
- [ ] Configure email alerts
- [ ] Deploy to production
- [ ] Verify errors are being captured
- [ ] Set up Slack integration (optional)
- [ ] Add user feedback widget (optional)
- [ ] Configure performance monitoring (optional)

---

**Time to complete:** 5-10 minutes
**Effort:** Low
**Impact:** High 🚀

**Your users are now your testers!** Every error they hit will be automatically reported to you with full context.
