# CV Adapter - Deployment Guide

This guide covers deploying CV Adapter to production using Vercel.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account with your code pushed
- Vercel account (free tier works)
- OpenAI API key with credits
- Supabase project (already configured)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "cv-adapter" folder if needed

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables
```env
# OpenAI (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://vuslzrevbkuugqeiadnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c2x6cmV2Ymt1dWdxZWlhZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjI3NTUsImV4cCI6MjA2MzI5ODc1NX0.lWAuqi4KZNn9n9AhxVF-w8jEswfXy64wwRBblFvAYAo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c2x6cmV2Ymt1dWdxZWlhZG5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzcyMjc1NSwiZXhwIjoyMDYzMjk4NzU1fQ.W9P_F64afFXU-FH-oSDTaZySswE-3YE5yorcpbfBYZw

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_random_secret_string_here
NEXTAUTH_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Usage Limits
MAX_GENERATIONS_PER_MONTH=100
MAX_FILE_SIZE_MB=10
```

#### Optional (Stripe for Payments)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (3-5 minutes)
3. Your app will be available at `https://your-app-name.vercel.app`

## 🗄️ Database Setup

### Run Schema in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to SQL Editor
4. Copy contents of `database-schema.sql`
5. Run the SQL script
6. Verify tables are created in Table Editor

### Configure OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://vuslzrevbkuugqeiadnq.supabase.co/auth/v1/callback`
4. Add client ID/secret to Supabase Auth settings

#### LinkedIn OAuth
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Create new app
3. Add redirect URI: `https://vuslzrevbkuugqeiadnq.supabase.co/auth/v1/callback`
4. Add client ID/secret to Supabase Auth settings

## 🔧 Production Optimizations

### Vercel Configuration

Create `vercel.json` in project root:
```json
{
  "functions": {
    "src/app/api/export/route.ts": {
      "maxDuration": 30
    },
    "src/app/api/rewrite/route.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["lhr1"]
}
```

### Performance Monitoring

1. Enable Vercel Analytics in project settings
2. Monitor OpenAI API usage in OpenAI dashboard
3. Set up Supabase monitoring for database performance

## 🔒 Security Checklist

- [ ] OpenAI API key is server-side only
- [ ] Supabase RLS policies are enabled
- [ ] Environment variables are properly set
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] File upload limits are configured
- [ ] Rate limiting is in place

## 📊 Monitoring & Maintenance

### Key Metrics to Monitor
- OpenAI API usage and costs
- Supabase database storage
- File upload success rates
- User registration/conversion rates
- Page load times

### Regular Maintenance
- Monitor OpenAI costs monthly
- Review Supabase usage
- Update dependencies quarterly
- Backup database regularly (Supabase handles this)

## 🐛 Troubleshooting Production Issues

### Common Production Problems

1. **OpenAI API Errors**
   - Check API key validity
   - Verify account has credits
   - Monitor rate limits

2. **File Upload Issues**
   - Check Vercel function timeout (max 60s on Pro)
   - Verify file size limits
   - Monitor memory usage

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check connection pooling limits
   - Monitor RLS policy performance

4. **PDF Generation Fails**
   - Puppeteer may need additional config in production
   - Check function memory limits
   - Consider using external PDF service

### Debug Production Issues

1. Check Vercel function logs
2. Monitor Supabase logs
3. Set up error tracking (Sentry recommended)
4. Use Vercel Analytics for performance insights

## 🚀 Scaling Considerations

### When to Scale
- More than 1000 users
- High OpenAI API costs
- Database performance issues
- File processing bottlenecks

### Scaling Options
1. **Vercel Pro** - Increased function limits
2. **Supabase Pro** - Better database performance
3. **External PDF Service** - Offload PDF generation
4. **CDN** - Cache static assets
5. **Background Jobs** - Queue heavy processing

## 💰 Cost Estimation

### Monthly Costs (estimated)
- **Vercel**: Free tier (up to 100GB bandwidth)
- **Supabase**: Free tier (up to 500MB database)
- **OpenAI**: ~$0.002 per CV generation (varies by length)
- **Total for 1000 generations/month**: ~$2-5

### Cost Optimization
- Monitor OpenAI token usage
- Optimize prompts for shorter responses
- Use caching where possible
- Set usage limits per user

---

## 🎯 Go-Live Checklist

- [ ] Database schema deployed
- [ ] All environment variables set
- [ ] OAuth providers configured
- [ ] OpenAI API key working
- [ ] Test user registration flow
- [ ] Test CV upload and generation
- [ ] Test all export formats
- [ ] Monitor logs for errors
- [ ] Set up domain (optional)
- [ ] Configure analytics

Your CV Adapter application is now ready for production! 🚀
