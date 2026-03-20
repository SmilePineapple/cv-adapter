# Vercel Environment Variables Setup

## 🚨 CRITICAL: Missing Supabase Environment Variables in Production

The Sentry errors show that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing in production/development deployments on Vercel.

## Required Environment Variables for Vercel

Go to: https://vercel.com/your-project/settings/environment-variables

Add these environment variables for **ALL ENVIRONMENTS** (Production, Preview, Development):

### Supabase (CRITICAL - App won't work without these)
```
NEXT_PUBLIC_SUPABASE_URL=https://vuslzrevbkuugqeiadnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY_FROM_ENV_LOCAL>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY_FROM_ENV_LOCAL>
```
**Get these values from your `.env.local` file**

### OpenAI (CRITICAL - CV generation won't work without this)
```
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY_FROM_ENV_LOCAL>
```
**Get this value from your `.env.local` file**

### Stripe (Required for payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY_FROM_ENV_LOCAL>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY_FROM_ENV_LOCAL>
STRIPE_WEBHOOK_SECRET=whsec_placeholder
STRIPE_PRICE_ID_PRO_MONTHLY=price_1Sl5IuCmLcsbnd6zlytFDSDW
STRIPE_PRICE_ID_PRO_ANNUAL=price_1Sl5JHCmLcsbnd6zL26mSyV5
```
**Get the keys from your `.env.local` file**

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://www.mycvbuddy.com
NEXTAUTH_SECRET=cv-adapter-secret-key-for-development-only-2024
NEXTAUTH_URL=https://www.mycvbuddy.com
```

### Usage Limits
```
MAX_FREE_GENERATIONS=1
MAX_PRO_GENERATIONS=100
MAX_FILE_SIZE_MB=10
```

### Admin
```
ADMIN_EMAILS=jakedalerourke@gmail.com
```

### Analytics & Monitoring
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RY8JTS6VFZ
NEXT_PUBLIC_CRISP_WEBSITE_ID=17394ee3-922f-47a6-a6c9-0533360eb0d2
NEXT_PUBLIC_SENTRY_DSN=https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840
SENTRY_AUTH_TOKEN=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
SENTRY_ORG=smilepineapple
SENTRY_PROJECT=javascript-nextjs
```

### Social Media Bot
```
CRON_SECRET=cv-adapter-social-bot-cron-secret-2024
```

### Email (Resend)
```
RESEND_API_KEY=re_placeholder_key
```

## ⚠️ Important Notes

1. **NEXT_PUBLIC_** prefix makes variables available to the browser (client-side)
2. Variables without this prefix are server-side only
3. After adding variables, you MUST redeploy for changes to take effect
4. The Sentry errors will disappear once these are added

## 🔧 Quick Fix Steps

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Copy-paste all variables above
3. Select "All Environments" for each variable
4. Click "Save"
5. Trigger a new deployment (or wait for next push)

## 🧪 Verify Fix

After deployment, check:
- https://www.mycvbuddy.com/dashboard should load without errors
- Sentry should stop reporting the Supabase environment variable errors
- CV generation should work
