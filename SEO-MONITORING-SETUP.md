# Automated SEO Monitoring System

## Overview

This system automatically monitors your SEO health and alerts you to issues **before** they become critical.

---

## What It Monitors

### Daily Metrics Tracked:
1. **Total Users** - Overall user base
2. **New Users (24h)** - Daily signups
3. **New Users (7d)** - Weekly signups
4. **Active Users (30d)** - Monthly active users
5. **Total Generations** - Lifetime CV generations
6. **Generations (7d)** - Weekly CV generations
7. **Conversion Rate** - % of users who upgrade to Pro
8. **Avg Generations/User** - User engagement metric

### Alert Thresholds:

**🔴 CRITICAL Alerts:**
- New users < 4.5/day (50% below pre-drop level of 9/day)
- Weekly signups < 31 (50% below pre-drop level of 63/week)

**🟡 WARNING Alerts:**
- Generations < 25/week (50% below healthy level)
- Active user rate < 10%

**🔵 INFO Alerts:**
- Conversion rate < 2%

---

## How It Works

### 1. Daily Automated Check
- Runs every day at 9 AM UTC (10 AM UK time)
- Collects metrics from Supabase
- Compares against baseline (pre-Feb 13 levels)
- Stores historical data in `seo_metrics` table

### 2. Alert System
- **Critical issues:** Immediate email alert
- **Warnings:** Email alert with recommendations
- **Info:** Logged for tracking

### 3. Email Alerts
Sent to: `jakedalerourke@gmail.com`

Example alert:
```
🚨 SEO Health Alert - March 27, 2026

Critical Issues (2)
- New Users (24h): New user signups critically low: 0.7/day vs expected 9/day
  Current: 0.7 | Expected: 9 | Change: -92.2%
  
- New Users (7d): Weekly signups critically low: 5 vs expected 63
  Current: 5 | Expected: 63 | Change: -92.1%

[View Admin Dashboard]
```

---

## Setup Instructions

### Step 1: Run Database Migration

```bash
# Apply the migration to create seo_metrics table
npx supabase db push
```

Or manually run in Supabase SQL Editor:
```sql
-- Copy contents from supabase/migrations/20260327_create_seo_metrics_table.sql
```

### Step 2: Add GitHub Secret

1. Go to: https://github.com/SmilePineapple/cv-adapter/settings/secrets/actions
2. Add secret: `SUPABASE_SERVICE_ROLE_KEY`
   - Get from: Supabase Dashboard → Settings → API → service_role key
   - **⚠️ NEVER commit this key to git!**

### Step 3: Test Manually

```bash
# Install dependencies
npm install

# Run the monitor locally
npx tsx scripts/seo-monitor.ts
```

Expected output:
```
🔍 Running SEO health check...
📊 Current Metrics: { totalUsers: 457, newUsers24h: 0, ... }
⚠️  Found 2 alerts
📧 Alert email sent

=== SEO Health Summary ===
Total Users: 457
New Users (24h): 0
New Users (7d): 5
Active Users (30d): 17
Generations (7d): 9
Conversion Rate: 1.10%
Avg Gens/User: 0.68
========================
```

### Step 4: Enable GitHub Action

The workflow is already created in `.github/workflows/seo-monitor.yml`

It will run automatically every day at 9 AM UTC.

To test it now:
1. Go to: https://github.com/SmilePineapple/cv-adapter/actions
2. Click "SEO Health Monitor"
3. Click "Run workflow"

---

## Current Status (Based on Your Admin Data)

### 🚨 **CRITICAL ALERTS ACTIVE**

**New Users (24h):** 0.7/day
- Expected: 9/day
- **Change: -92.2%** 🔴

**New Users (7d):** 5/week
- Expected: 63/week
- **Change: -92.1%** 🔴

**Generations (7d):** 9/week
- Expected: 50/week
- **Change: -82%** 🟡

**Active Users:** 17 (3.7% of 457)
- Expected: 10%
- **Change: -63%** 🟡

**Conversion Rate:** 1.1%
- Target: 2%
- **Change: -45%** 🔵

---

## Recovery Targets

### Week 1 (Apr 1-7):
- ✅ SEO monitor running daily
- 🎯 New users: 5-10/day
- 🎯 Generations: 20/week
- 🎯 Active users: 25 (5%)

### Month 1 (April 2026):
- 🎯 New users: 15/day
- 🎯 Generations: 100/week
- 🎯 Active users: 50 (10%)
- 🎯 Conversion rate: 1.5%

### Month 3 (June 2026):
- 🎯 New users: 30/day
- 🎯 Generations: 200/week
- 🎯 Active users: 100 (15%)
- 🎯 Conversion rate: 2%

### Month 6 (September 2026):
- 🎯 **Back to pre-drop levels**
- 🎯 New users: 50/day
- 🎯 Generations: 350/week
- 🎯 Active users: 200 (20%)
- 🎯 Conversion rate: 3%

---

## Dashboard Access

**Admin Dashboard:** https://www.mycvbuddy.com/admin

**SEO Metrics Query:**
```sql
SELECT 
  date,
  new_users_24h,
  new_users_7d,
  generations_7d,
  conversion_rate
FROM seo_metrics
ORDER BY date DESC
LIMIT 30;
```

---

## Automated Fixes (Coming Soon)

The monitor will eventually trigger automated fixes:

1. **Low signups detected** → Trigger social media posts
2. **Low generations** → Send re-engagement emails
3. **Low conversion** → Activate promo campaign
4. **SEO drop** → Submit sitemap to Google
5. **Traffic spike** → Scale infrastructure

---

## Next Steps

1. ✅ Run database migration
2. ✅ Add SUPABASE_SERVICE_ROLE_KEY secret
3. ✅ Test monitor locally
4. ✅ Enable GitHub Action
5. ⏳ Wait for first daily report (9 AM UTC tomorrow)
6. 📧 Check email for alerts

---

**Status:** Ready to deploy! 🚀

The system will start monitoring automatically once you complete the setup steps.
