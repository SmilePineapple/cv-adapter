# Social Media Bot - Complete Implementation Guide

## 🤖 Overview

Automated social media bot that generates and posts engaging content daily to drive traffic and engagement to CV Adapter.

**Features:**
- ✅ AI-generated content using GPT-4o-mini
- ✅ Multi-platform support (Twitter/X, LinkedIn, Facebook, Instagram)
- ✅ Automated daily posting via cron jobs
- ✅ Engagement tracking and analytics
- ✅ Content variety (10 different types)
- ✅ Admin dashboard for management
- ✅ Scheduling system with best posting times

---

## 📁 Files Created

### Core Library
- `src/lib/social-media-bot.ts` - Content generation engine

### API Routes
- `src/app/api/social-bot/generate/route.ts` - Generate weekly content
- `src/app/api/social-bot/cron/route.ts` - Automated posting cron job

### Admin Dashboard
- `src/app/admin/social-bot/page.tsx` - Management interface

### Database
- `migrations/social-media-bot-setup.sql` - Database schema

---

## 🗄️ Database Setup

### Step 1: Run Migration

```bash
# In Supabase SQL Editor, run:
migrations/social-media-bot-setup.sql
```

### Tables Created:

1. **social_media_posts** - Stores all posts (scheduled & posted)
2. **social_media_config** - Platform configurations & API keys
3. **social_media_analytics** - Daily aggregated metrics
4. **social_media_content_performance** - Content type performance

---

## 🎨 Content Types (10 Varieties)

1. **cv_tip** - Quick CV writing tips
2. **career_advice** - Career development advice
3. **job_search_tip** - Job hunting strategies
4. **industry_stat** - Employment statistics
5. **ats_tip** - ATS optimization advice
6. **interview_prep** - Interview preparation
7. **success_story** - User success stories
8. **question** - Engagement questions
9. **myth_buster** - CV myths debunked
10. **tool_feature** - CV Adapter features

---

## 📅 Weekly Content Schedule

| Day | Content Type | Purpose |
|-----|--------------|---------|
| Monday | cv_tip | Start week with actionable tip |
| Tuesday | industry_stat | Share interesting data |
| Wednesday | question | Engage audience |
| Thursday | ats_tip | Technical advice |
| Friday | career_advice | Weekend motivation |
| Saturday | success_story | Inspire with success |
| Sunday | myth_buster | Educational content |

---

## 🚀 Setup Instructions

### Step 1: Database Setup

```bash
# Run the SQL migration in Supabase
```

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# OpenAI (already exists)
OPENAI_API_KEY=your_openai_key

# Cron Secret (for security)
CRON_SECRET=your_random_secret_key_here

# Social Media API Keys (add when ready)
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_ACCESS_TOKEN=your_twitter_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_token_secret

LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_token

FACEBOOK_APP_ID=your_facebook_id
FACEBOOK_APP_SECRET=your_facebook_secret
FACEBOOK_ACCESS_TOKEN=your_facebook_token

INSTAGRAM_ACCESS_TOKEN=your_instagram_token
```

### Step 3: Generate Initial Content

```bash
# Visit admin dashboard
https://www.mycvbuddy.com/admin/social-bot

# Click "Generate Week" for each platform
```

### Step 4: Set Up Cron Job

**Option A: Vercel Cron (Recommended)**

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/social-bot/cron",
    "schedule": "0 * * * *"
  }]
}
```

**Option B: GitHub Actions**

Create `.github/workflows/social-bot.yml`:

```yaml
name: Social Media Bot
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://www.mycvbuddy.com/api/social-bot/cron
```

**Option C: External Cron Service**

Use cron-job.org or EasyCron:
- URL: `https://www.mycvbuddy.com/api/social-bot/cron`
- Method: GET
- Header: `Authorization: Bearer YOUR_CRON_SECRET`
- Schedule: Every hour

---

## 🔑 Social Media API Setup

### Twitter/X API

1. Go to https://developer.twitter.com
2. Create a new app
3. Enable OAuth 1.0a
4. Get API Key, API Secret, Access Token, Access Token Secret
5. Add to Supabase `social_media_config` table

### LinkedIn API

1. Go to https://www.linkedin.com/developers
2. Create a new app
3. Request "Share on LinkedIn" permission
4. Get Client ID, Client Secret
5. Generate Access Token via OAuth 2.0

### Facebook/Instagram API

1. Go to https://developers.facebook.com
2. Create a new app
3. Add Facebook Login and Instagram Basic Display
4. Get App ID, App Secret
5. Generate long-lived access tokens

---

## 💻 Usage

### Generate Content Manually

```typescript
// Via API
const response = await fetch('/api/social-bot/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform: 'twitter',
    startDate: '2025-10-25'
  })
})
```

### View Scheduled Posts

```typescript
// Via API
const response = await fetch('/api/social-bot/generate?platform=twitter&posted=false')
const { posts } = await response.json()
```

### Trigger Cron Manually

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://www.mycvbuddy.com/api/social-bot/cron
```

---

## 📊 Admin Dashboard

Access at: `https://www.mycvbuddy.com/admin/social-bot`

**Features:**
- View scheduled & posted content
- Generate weekly content for each platform
- Monitor engagement metrics
- Track posting status
- Platform configuration

**Stats Displayed:**
- Scheduled posts count
- Posts published today
- Total engagement (likes + shares + comments)
- Active platforms

---

## 🎯 Best Posting Times

Based on engagement research:

### Twitter/X
- Monday-Thursday: 12:00 PM
- Friday: 11:00 AM
- Weekend: 9:00-10:00 AM

### LinkedIn
- Monday-Thursday: 8:00 AM
- Friday: 9:00 AM
- Weekend: 10:00 AM

### Facebook
- Monday-Friday: 1:00 PM
- Weekend: 12:00-1:00 PM

### Instagram
- All days: 11:00 AM

---

## 📈 Content Examples

### CV Tip (Twitter)
```
Your CV has 6 seconds to impress. Make every word count. ⏱️

Top 3 mistakes to avoid:
❌ Generic objectives
❌ Unexplained gaps
❌ No quantifiable achievements

Try our AI-powered CV optimizer: https://www.mycvbuddy.com

#CVTips #ResumeWriting #CareerAdvice
```

### Industry Stat (LinkedIn)
```
Did you know? 75% of CVs never reach a human recruiter. 🤖

ATS systems filter them out first. Here's how to beat them:

1. Use standard section headings
2. Include relevant keywords
3. Avoid complex formatting
4. Quantify your achievements

Our AI ensures your CV passes ATS screening every time.

https://www.mycvbuddy.com

#ATS #JobSearch #CareerTips
```

### Engagement Question (Facebook)
```
Question for job seekers: 💭

What's the biggest mistake you've made on your CV?

(We've seen them all and can help you fix it!)

Drop your answer below 👇

#CVHelp #JobSearch #CareerAdvice
```

---

## 🔄 Automation Flow

1. **Cron runs hourly** → Checks for scheduled posts
2. **Finds due posts** → Posts scheduled for now or earlier
3. **Checks platform config** → Enabled & within daily limit
4. **Formats content** → Adds hashtags & link
5. **Posts to platform** → Via platform API
6. **Updates database** → Marks as posted, records metrics
7. **Tracks analytics** → Updates daily stats

---

## 📊 Analytics & Tracking

### Daily Metrics
- Posts count per platform
- Total likes, shares, comments
- Click-through rate
- Engagement rate
- Website traffic from social

### Content Performance
- Best performing content types
- Optimal posting times
- Hashtag effectiveness
- Platform comparison

### Access Analytics
```sql
-- Daily analytics
SELECT * FROM social_media_analytics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

-- Content performance
SELECT * FROM social_media_content_performance
ORDER BY avg_engagement_rate DESC;
```

---

## 🛠️ Customization

### Add New Content Type

1. Update `ContentType` in `social-media-bot.ts`
2. Add to `getWeeklyContentSchedule()`
3. Update hashtag generation
4. Test with manual generation

### Adjust Posting Frequency

```typescript
// In vercel.json
{
  "crons": [{
    "path": "/api/social-bot/cron",
    "schedule": "0 */2 * * *"  // Every 2 hours
  }]
}
```

### Change Daily Limits

```sql
UPDATE social_media_config
SET daily_post_limit = 15
WHERE platform = 'twitter';
```

---

## 🔒 Security

### API Keys
- Store in Supabase `social_media_config` table
- Encrypt sensitive data in production
- Use environment variables for secrets

### Cron Protection
- Require `Authorization: Bearer CRON_SECRET` header
- Validate secret before processing
- Log all cron attempts

### Rate Limiting
- Daily post limits per platform
- Retry logic with exponential backoff
- Error tracking and alerting

---

## 🐛 Troubleshooting

### Posts Not Generating
```bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Test generation manually
curl -X POST https://www.mycvbuddy.com/api/social-bot/generate \
  -H "Content-Type: application/json" \
  -d '{"platform":"twitter"}'
```

### Posts Not Posting
```bash
# Check cron is running
curl -X GET https://www.mycvbuddy.com/api/social-bot/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Check platform config
SELECT * FROM social_media_config WHERE posting_enabled = true;
```

### Low Engagement
- Review content performance analytics
- Test different content types
- Adjust posting times
- Experiment with hashtags
- A/B test messaging

---

## 📈 Expected Results

### Month 1
- 30 posts per platform
- 100-500 impressions per post
- 2-5% engagement rate
- 50-100 website clicks

### Month 3
- 90 posts per platform
- 500-2,000 impressions per post
- 3-7% engagement rate
- 200-500 website clicks
- Growing follower base

### Month 6
- 180 posts per platform
- 1,000-5,000 impressions per post
- 5-10% engagement rate
- 500-1,000 website clicks
- Established social presence

---

## 🎯 Growth Strategy

### Phase 1: Foundation (Weeks 1-4)
- Set up all platforms
- Generate & schedule content
- Monitor initial engagement
- Refine content based on performance

### Phase 2: Optimization (Weeks 5-8)
- Identify best-performing content types
- Adjust posting times
- Experiment with hashtags
- Engage with comments

### Phase 3: Scale (Weeks 9-12)
- Increase posting frequency
- Add user-generated content
- Run social media campaigns
- Collaborate with influencers

---

## 🚀 Next Steps

1. **Run database migration** ✅
2. **Generate first week of content** ⏳
3. **Set up cron job** ⏳
4. **Configure platform APIs** ⏳
5. **Enable posting** ⏳
6. **Monitor & optimize** ⏳

---

## 📞 Support

**Issues?**
- Check logs in Supabase
- Review error messages in `social_media_posts` table
- Test API endpoints manually
- Verify environment variables

**Questions?**
- Review this guide
- Check platform API documentation
- Test in development first

---

## 🎉 Conclusion

You now have a fully automated social media bot that:
- ✅ Generates engaging content using AI
- ✅ Posts automatically on schedule
- ✅ Tracks engagement metrics
- ✅ Requires zero daily maintenance
- ✅ Drives traffic to your site

**Just set it up once and let it run!** 🚀
