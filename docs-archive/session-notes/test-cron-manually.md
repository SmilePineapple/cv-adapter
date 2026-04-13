# 🧪 Manual Cron Test Instructions

## Quick Test (Right Now)

### Option 1: Browser Test
1. Open your browser
2. Navigate to: `http://localhost:3000/api/social-bot/cron`
3. You should see a JSON response

### Option 2: PowerShell Test
```powershell
# Test locally
Invoke-WebRequest -Uri "http://localhost:3000/api/social-bot/cron" -Method GET | Select-Object -ExpandProperty Content

# Test production
Invoke-WebRequest -Uri "https://www.mycvbuddy.com/api/social-bot/cron" -Method GET | Select-Object -ExpandProperty Content
```

### Option 3: curl Test (if you have curl)
```bash
# Test locally
curl http://localhost:3000/api/social-bot/cron

# Test production
curl https://www.mycvbuddy.com/api/social-bot/cron
```

## Expected Responses

### Success (No Posts Scheduled)
```json
{
  "success": true,
  "message": "No posts to publish",
  "results": {
    "checked": 0,
    "posted": 0,
    "failed": 0,
    "errors": []
  }
}
```

### Success (Posts Found & Posted)
```json
{
  "success": true,
  "message": "Processed 2 posts",
  "results": {
    "checked": 2,
    "posted": 2,
    "failed": 0,
    "errors": []
  }
}
```

### Error (No Posts in Database)
```json
{
  "success": true,
  "message": "No posts to publish",
  "results": {
    "checked": 0,
    "posted": 0,
    "failed": 0,
    "errors": []
  }
}
```

## What to Check

### 1. Are Posts Scheduled?
Run in Supabase SQL Editor:
```sql
SELECT COUNT(*) as scheduled_posts
FROM social_media_posts
WHERE posted = false 
AND scheduled_for <= NOW();
```

If result is 0, you need to generate posts!

### 2. Are Platforms Enabled?
```sql
SELECT 
  platform, 
  enabled, 
  posting_enabled,
  posts_today,
  daily_post_limit
FROM social_media_config;
```

Should show:
- `enabled = true`
- `posting_enabled = true`
- `posts_today < daily_post_limit`

### 3. Are API Keys Set?
```sql
SELECT 
  platform,
  CASE WHEN api_key IS NOT NULL THEN 'YES' ELSE 'NO' END as has_api_key,
  CASE WHEN access_token IS NOT NULL THEN 'YES' ELSE 'NO' END as has_access_token
FROM social_media_config;
```

## Generate Test Posts

### Via Admin Dashboard
1. Visit: http://localhost:3000/admin/social-bot
2. Click "Generate Week" for Twitter
3. Wait for generation to complete
4. Check database to confirm posts were created

### Via SQL (Quick Test Post)
```sql
-- Insert a test post scheduled for NOW
INSERT INTO social_media_posts (
  content,
  platform,
  content_type,
  hashtags,
  scheduled_for,
  posted
) VALUES (
  'Test post from CV Adapter! 🚀 #CVTips #JobSearch',
  'twitter',
  'cv_tip',
  ARRAY['CVTips', 'JobSearch'],
  NOW(),
  false
);
```

Then run the cron manually to see it post!

## Enable Posting

If platforms are disabled:
```sql
UPDATE social_media_config 
SET 
  enabled = true,
  posting_enabled = true
WHERE platform IN ('twitter', 'linkedin');
```

## Check Logs

### In Code
The cron route logs to console:
- "Cron job triggered at: [timestamp]"
- "Posting to Twitter: [content]"
- "✅ Tweet posted successfully: [url]"
- "❌ Failed to post tweet: [error]"

### In Vercel (Production)
1. Go to Vercel Dashboard
2. Select project
3. Go to "Functions" tab
4. Find `/api/social-bot/cron`
5. View execution logs

## Common Issues & Fixes

### "No posts to publish"
→ Generate posts in admin dashboard

### "Platform not enabled"
→ Run enable SQL above

### "Daily limit reached"
→ Reset or increase limit:
```sql
UPDATE social_media_config 
SET posts_today = 0 
WHERE platform = 'twitter';
```

### "Twitter API error"
→ Check credentials in `.env.local`
→ Verify they're also in database

### "LinkedIn API error"
→ LinkedIn tokens expire - may need to refresh
→ Check token expiration date

## Success Checklist

- [ ] Cron endpoint returns 200 status
- [ ] JSON response is valid
- [ ] Posts are in database
- [ ] Platforms are enabled
- [ ] API keys are configured
- [ ] Test post successfully posted to Twitter
- [ ] Check Twitter to see actual post
- [ ] Verify post URL is saved in database

## After Successful Test

1. ✅ Commit changes
2. ✅ Push to GitHub
3. ✅ Deploy to Vercel
4. ✅ Wait for next hour (cron runs at :00)
5. ✅ Check Vercel logs to confirm automatic execution
6. ✅ Check Twitter/LinkedIn for posted content

## Need Help?

Check these files:
- `CRON-ISSUE-DIAGNOSIS.md` - Detailed troubleshooting
- `SOCIAL-MEDIA-BOT-GUIDE.md` - Complete setup guide
- `SOCIAL-BOT-SUMMARY.md` - Quick reference

Or check the code:
- `src/app/api/social-bot/cron/route.ts` - Cron logic
- `src/lib/social-media-bot.ts` - Content generation
- `src/lib/twitter-api-v2.ts` - Twitter posting
