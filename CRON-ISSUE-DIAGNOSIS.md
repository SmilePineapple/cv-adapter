# 🔍 Cron Job Issue Diagnosis

## Problem
The social media bot cron job is scheduled for 2:00 PM but hasn't posted automatically at 2:28 PM.

## Root Cause
**The cron is set to UTC time, not your local time!**

### Current Configuration
```json
{
  "crons": [{
    "path": "/api/social-bot/cron",
    "schedule": "0 14 * * *"  // 14:00 UTC = 2:00 PM UTC
  }]
}
```

### The Issue
- `"0 14 * * *"` means **2:00 PM UTC (Coordinated Universal Time)**
- If you're in **GMT (UK)**: 2:00 PM UTC = 2:00 PM local (same)
- If you're in **BST (UK Summer Time)**: 2:00 PM UTC = 3:00 PM local (1 hour ahead)
- If you're in **EST (US East Coast)**: 2:00 PM UTC = 9:00 AM local
- If you're in **PST (US West Coast)**: 2:00 PM UTC = 6:00 AM local

## Verification Steps

### 1. Check Current Timezone
Your system is likely in a timezone that's different from UTC.

### 2. Check Scheduled Posts
Run this query in Supabase to see what posts are scheduled:
```sql
SELECT 
  id, 
  platform, 
  content, 
  scheduled_for, 
  posted, 
  posted_at,
  scheduled_for AT TIME ZONE 'UTC' as utc_time,
  scheduled_for AT TIME ZONE 'America/New_York' as est_time,
  scheduled_for AT TIME ZONE 'Europe/London' as uk_time
FROM social_media_posts
WHERE scheduled_for::date = CURRENT_DATE
ORDER BY scheduled_for DESC;
```

### 3. Check Cron Execution Logs
In Vercel Dashboard:
1. Go to your project
2. Click "Deployments" → "Functions"
3. Find `/api/social-bot/cron`
4. Check execution logs to see when it last ran

## Solutions

### Option 1: Adjust Cron Schedule to Your Timezone
If you want posts at 2:00 PM UK time (GMT/BST):
- **Winter (GMT)**: Use `"0 14 * * *"` (2:00 PM UTC = 2:00 PM GMT)
- **Summer (BST)**: Use `"0 13 * * *"` (1:00 PM UTC = 2:00 PM BST)

If you want posts at 2:00 PM EST:
```json
"schedule": "0 19 * * *"  // 7:00 PM UTC = 2:00 PM EST
```

### Option 2: Run Cron Multiple Times Per Day
Instead of once at 2 PM, run every hour and let the database handle scheduling:
```json
"schedule": "0 * * * *"  // Every hour at minute 0
```

This way, posts scheduled for any time will be published within an hour.

### Option 3: Manual Trigger (Temporary)
You can manually trigger the cron by visiting:
```
https://www.mycvbuddy.com/api/social-bot/cron
```

## Recommended Fix

**Use Option 2: Run every hour**

This is the most reliable approach because:
- ✅ No timezone confusion
- ✅ Posts go out within 1 hour of scheduled time
- ✅ Works regardless of DST changes
- ✅ More flexible for different posting times

## Implementation

Update `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/social-bot/cron",
      "schedule": "0 * * * *"  // Every hour
    }
  ]
}
```

Then redeploy to Vercel.

## Testing

### Test Manually
```bash
curl -X GET https://www.mycvbuddy.com/api/social-bot/cron
```

### Check Response
Should return:
```json
{
  "success": true,
  "message": "Processed X posts",
  "results": {
    "checked": X,
    "posted": Y,
    "failed": 0,
    "errors": []
  }
}
```

## Current Status

### Posts Scheduled?
Check if there are posts scheduled for today:
```sql
SELECT COUNT(*) FROM social_media_posts 
WHERE scheduled_for::date = CURRENT_DATE 
AND posted = false;
```

### Platform Config Enabled?
Check if platforms are enabled for posting:
```sql
SELECT platform, enabled, posting_enabled, daily_post_limit, posts_today
FROM social_media_config;
```

### API Keys Configured?
Check if Twitter/LinkedIn credentials are set:
```sql
SELECT 
  platform, 
  enabled, 
  posting_enabled,
  CASE WHEN api_key IS NOT NULL THEN 'Set' ELSE 'Missing' END as api_key_status,
  CASE WHEN access_token IS NOT NULL THEN 'Set' ELSE 'Missing' END as access_token_status
FROM social_media_config;
```

## Next Steps

1. **Immediate**: Change cron to run every hour
2. **Verify**: Check that posts are scheduled in database
3. **Enable**: Ensure platforms have `posting_enabled = true`
4. **Test**: Manually trigger cron to verify it works
5. **Monitor**: Check Vercel logs after next hour to confirm automatic execution

## Common Issues

### Issue: "No posts to publish"
**Cause**: No posts scheduled for current time or earlier
**Fix**: Generate posts in admin dashboard (`/admin/social-bot`)

### Issue: "Platform not enabled for posting"
**Cause**: `posting_enabled = false` in database
**Fix**: Update database:
```sql
UPDATE social_media_config 
SET posting_enabled = true 
WHERE platform = 'twitter';
```

### Issue: "Daily limit reached"
**Cause**: Already posted max posts today
**Fix**: Increase limit or wait until tomorrow:
```sql
UPDATE social_media_config 
SET daily_post_limit = 20 
WHERE platform = 'twitter';
```

### Issue: "API error"
**Cause**: Invalid or expired API credentials
**Fix**: Update credentials in database or environment variables

## Monitoring

### Check Cron Execution
Vercel Dashboard → Functions → `/api/social-bot/cron` → Logs

### Check Posted Content
```sql
SELECT platform, content, posted_at, post_url
FROM social_media_posts
WHERE posted = true
ORDER BY posted_at DESC
LIMIT 10;
```

### Check Errors
```sql
SELECT platform, content, error_message, retry_count
FROM social_media_posts
WHERE error_message IS NOT NULL
ORDER BY updated_at DESC;
```
