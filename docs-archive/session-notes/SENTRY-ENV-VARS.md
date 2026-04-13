# Sentry Environment Variables

**Copy these to Vercel Environment Variables**

---

## ✅ Your Sentry Configuration

### Environment Variables for Vercel:

```bash
# Public DSN (safe to expose in browser)
NEXT_PUBLIC_SENTRY_DSN=https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840

# Auth token for source map uploads (KEEP SECRET!)
SENTRY_AUTH_TOKEN=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

# Organization name
SENTRY_ORG=smilepineapple

# Project name
SENTRY_PROJECT=javascript-nextjs
```

---

## 🚀 How to Add to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/your-team/cv-adapter/settings/environment-variables

2. Add each variable:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_SENTRY_DSN`
   - Value: `https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Key: `SENTRY_AUTH_TOKEN`
   - Value: `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`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 3:**
   - Key: `SENTRY_ORG`
   - Value: `smilepineapple`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 4:**
   - Key: `SENTRY_PROJECT`
   - Value: `javascript-nextjs`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. Click "Save"

### Option 2: Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SENTRY_DSN
# Paste: https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840

vercel env add SENTRY_AUTH_TOKEN
# Paste: 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

vercel env add SENTRY_ORG
# Paste: smilepineapple

vercel env add SENTRY_PROJECT
# Paste: javascript-nextjs
```

---

## 📝 Add to .env.local (for local testing)

Create or update `.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840
SENTRY_AUTH_TOKEN=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
SENTRY_ORG=smilepineapple
SENTRY_PROJECT=javascript-nextjs
```

**Note:** `.env.local` is already in `.gitignore` so it won't be committed.

---

## 🧪 Test Sentry Locally

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit test page:**
   ```
   http://localhost:3000/sentry-example-page
   ```

3. **Click buttons to trigger test errors:**
   - "Throw error" → Client-side error
   - "Trigger API error" → Server-side error

4. **Check Sentry Dashboard:**
   - Go to: https://sentry.io/organizations/smilepineapple/issues/
   - You should see the test errors appear!

---

## 🚀 Deploy to Production

```bash
# Commit the Sentry files
git add .
git commit -m "Add Sentry error monitoring"

# Push to deploy
git push origin main
```

**Vercel will automatically:**
- ✅ Use your environment variables
- ✅ Upload source maps to Sentry
- ✅ Enable error tracking in production

---

## 📊 View Errors in Sentry

**Dashboard:** https://sentry.io/organizations/smilepineapple/issues/

**What you'll see:**
- All errors from your app
- User context (email, ID)
- Stack traces with source maps
- Browser/device info
- Frequency and trends

---

## 🔔 Set Up Email Alerts

1. Go to: https://sentry.io/organizations/smilepineapple/alerts/rules/

2. Click "Create Alert"

3. Configure:
   - **When:** An event is seen
   - **If:** All events
   - **Then:** Send a notification to: Your Email

4. Save as "All Errors Alert"

---

## ✅ Checklist

- [ ] Add env vars to Vercel Dashboard
- [ ] Add env vars to `.env.local`
- [ ] Test locally at `/sentry-example-page`
- [ ] Verify errors appear in Sentry dashboard
- [ ] Set up email alerts
- [ ] Commit and deploy to production
- [ ] Test production errors
- [ ] Remove test page (optional)

---

## 🔗 Important Links

- **Sentry Dashboard:** https://sentry.io/organizations/smilepineapple/issues/
- **Project Settings:** https://sentry.io/organizations/smilepineapple/projects/javascript-nextjs/
- **Alerts:** https://sentry.io/organizations/smilepineapple/alerts/rules/
- **Performance:** https://sentry.io/organizations/smilepineapple/performance/

---

## 🎯 What's Already Configured

✅ **Installed:**
- `@sentry/nextjs` package
- Client config (`src/instrumentation-client.ts`)
- Server config (`sentry.server.config.ts`)
- Edge config (`sentry.edge.config.ts`)
- Global error handler (`src/app/global-error.tsx`)
- Test pages (`/sentry-example-page`, `/api/sentry-example-api`)

✅ **Features Enabled:**
- Error tracking
- Performance monitoring (tracing)
- Session replay (see what user did before error)
- Logs (application logs sent to Sentry)
- Source maps (see exact code causing errors)

✅ **Sample Rates:**
- Traces: 100% (all requests tracked)
- Replays: 10% normal sessions, 100% on errors
- Logs: Enabled

---

## 🚨 Security Note

**NEVER commit these to git:**
- ❌ `SENTRY_AUTH_TOKEN` (already in `.gitignore`)
- ❌ `.env.sentry-build-plugin` (already in `.gitignore`)
- ❌ `.env.local` (already in `.gitignore`)

**Safe to commit:**
- ✅ `NEXT_PUBLIC_SENTRY_DSN` (public, safe to expose)
- ✅ Sentry config files (no secrets)

---

**You're all set!** 🎉

Add the env vars to Vercel, deploy, and you'll start catching errors automatically!
