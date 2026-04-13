# 🚀 Hosting & Deployment Guide - CV Adapter

## ✅ Test Endpoints Secured

Both test endpoints are now **admin-only**:
- `/api/setup-pro-subscription` - Restricted to admin emails
- `/api/cancel-subscription-manual` - Restricted to admin emails

Add your admin email to `.env.local`:
```env
ADMIN_EMAILS=your-email@gmail.com,another-admin@gmail.com
```

---

## 🌐 Best Hosting Solution: Vercel + Custom Domain

### Why Vercel?
- ✅ **Built for Next.js** - Zero configuration
- ✅ **Free tier** - Perfect for starting out
- ✅ **Automatic deployments** - Push to Git, auto-deploy
- ✅ **Global CDN** - Fast worldwide
- ✅ **Serverless functions** - API routes work perfectly
- ✅ **Environment variables** - Easy to manage
- ✅ **Custom domains** - Free SSL included
- ✅ **No server management** - Fully managed

### Alternative: You DON'T need to:
- ❌ Buy hosting space and upload files (old way)
- ❌ Manage servers or SSH
- ❌ Configure nginx or Apache
- ❌ Install Node.js on a server
- ❌ Set up SSL certificates manually

---

## 📋 Complete Deployment Process

### Step 1: Buy a Domain (Optional but Recommended)
**Where to buy:**
- **Namecheap** - £8-12/year (.com)
- **Google Domains** - £10-12/year
- **GoDaddy** - £10-15/year
- **Cloudflare** - £8-10/year (cheapest)

**Recommended domains:**
- `cvadapter.com` (if available)
- `cv-adapter.com`
- `cvadapt.io`
- `tailorcv.com`
- `adaptmycv.com`

**Note**: You can deploy without a domain first and add it later!

---

### Step 2: Set Up Git Repository

#### Option A: GitHub (Recommended)
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - CV Adapter ready for deployment"

# Create repository on GitHub.com
# Then:
git remote add origin https://github.com/yourusername/cv-adapter.git
git branch -M main
git push -u origin main
```

#### Option B: GitLab or Bitbucket
Same process, just use their URLs instead.

---

### Step 3: Deploy to Vercel

#### Method 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js
6. Click "Deploy"
7. Wait 2-3 minutes
8. Done! You get a URL like: `cv-adapter.vercel.app`

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? cv-adapter
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

### Step 4: Add Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from `.env.local`:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Admin Emails (comma-separated)
ADMIN_EMAILS=your-email@gmail.com
```

5. Click "Save"
6. Redeploy (Vercel will prompt you)

---

### Step 5: Connect Custom Domain

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter your domain: `cvadapter.com`
3. Click "Add"
4. Vercel shows DNS records to add

#### Configure DNS (at your domain registrar):
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

5. Wait 5-60 minutes for DNS propagation
6. Vercel automatically provisions SSL certificate
7. Your site is live at `https://cvadapter.com`! 🎉

---

### Step 6: Set Up Production Database

#### Create Production Supabase Project
1. Go to https://supabase.com
2. Create new project (choose region close to users)
3. Wait for project to initialize
4. Go to **SQL Editor**
5. Run these scripts in order:
   ```sql
   -- 1. Run COMPLETE-SUBSCRIPTION-SETUP.sql
   -- 2. Run create-cv-ratings-table.sql
   -- 3. Run fix-usage-tracking-rls.sql
   -- 4. Run add-cancel-column.sql
   ```
6. Go to **Settings** → **API**
7. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key
8. Add to Vercel environment variables
9. Redeploy

---

### Step 7: Set Up Stripe Production

1. Go to Stripe Dashboard
2. **Switch to Live Mode** (toggle in top left)
3. Go to **Developers** → **API keys**
4. Copy live keys to Vercel
5. Go to **Developers** → **Webhooks**
6. Click "Add endpoint"
7. URL: `https://yourdomain.com/api/stripe/webhook`
8. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
9. Click "Add endpoint"
10. Copy webhook signing secret
11. Add to Vercel: `STRIPE_WEBHOOK_SECRET`
12. Redeploy

---

## 🧪 Testing Production Deployment

### 1. Test Basic Functionality
- [ ] Visit your domain
- [ ] Sign up for account
- [ ] Upload a CV
- [ ] Generate tailored CV
- [ ] Download CV
- [ ] Create cover letter

### 2. Test Subscription Flow
- [ ] Click "Upgrade to Pro"
- [ ] Complete Stripe checkout (use real card, can cancel immediately)
- [ ] Verify subscription shows in dashboard
- [ ] Check Supabase database for subscription record
- [ ] Verify webhook was received in Stripe Dashboard

### 3. Test Cancellation
- [ ] Go to subscription page
- [ ] Click "Cancel Subscription"
- [ ] Verify cancellation notice shows
- [ ] Check database: `cancel_at_period_end = true`
- [ ] Verify still have Pro access

---

## 💰 Costs Breakdown

### Free Tier (Sufficient for Launch)
- **Vercel**: Free (100GB bandwidth, unlimited sites)
- **Supabase**: Free (500MB database, 50,000 monthly active users)
- **Domain**: £8-12/year
- **Total**: £8-12/year

### When You Grow
- **Vercel Pro**: $20/month (more bandwidth, analytics)
- **Supabase Pro**: $25/month (8GB database, more features)
- **Stripe**: 1.4% + 20p per transaction (UK)
- **OpenAI**: Pay per use (~$0.002 per CV generation)

### Example at 100 Paying Users
- Revenue: 100 × £5 = £500/month
- Stripe fees: ~£15/month
- Vercel: £0 (free tier sufficient)
- Supabase: £0 (free tier sufficient)
- OpenAI: ~£10/month (500 generations)
- **Profit**: ~£475/month 💰

---

## 🔄 Continuous Deployment

### Automatic Deployments
Once connected to Git:
1. Make changes locally
2. Commit: `git commit -m "Fix bug"`
3. Push: `git push`
4. Vercel automatically deploys
5. Live in 2-3 minutes!

### Preview Deployments
- Every branch gets a preview URL
- Test changes before merging to main
- Share with team/clients

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)
1. Go to Vercel Dashboard → Your Project → **Analytics**
2. Enable Web Analytics
3. See page views, performance, etc.

### Supabase Monitoring
1. Go to Supabase Dashboard → **Database** → **Reports**
2. Monitor queries, connections, storage

### Stripe Dashboard
1. Monitor payments, subscriptions
2. View webhook deliveries
3. Track revenue

---

## 🚨 Common Issues & Solutions

### Issue 1: Environment Variables Not Working
**Solution**: 
- Redeploy after adding variables
- Check spelling exactly matches code
- No quotes needed in Vercel

### Issue 2: Webhook Not Receiving Events
**Solution**:
- Verify webhook URL is correct
- Check webhook secret matches
- View logs in Stripe Dashboard → Webhooks

### Issue 3: Database Connection Errors
**Solution**:
- Verify Supabase URL and keys
- Check RLS policies are set up
- Ensure service role key is used for API routes

### Issue 4: Build Fails on Vercel
**Solution**:
- Check build logs in Vercel
- Ensure all dependencies in `package.json`
- Fix TypeScript errors locally first

---

## 📝 Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Test complete user flow
- [ ] Verify payments work
- [ ] Check webhook logs
- [ ] Monitor error logs
- [ ] Set up Google Search Console
- [ ] Submit sitemap

### Week 1
- [ ] Monitor user feedback
- [ ] Fix any bugs discovered
- [ ] Add Google Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Create first blog posts

### Month 1
- [ ] Analyze usage patterns
- [ ] Optimize performance
- [ ] Implement user feedback
- [ ] Marketing push
- [ ] Monitor costs

---

## 🎯 Launch Strategy

### Soft Launch (Week 1)
1. Deploy to production
2. Test thoroughly
3. Share with friends/family
4. Collect feedback
5. Fix critical bugs

### Public Launch (Week 2)
1. Announce on social media
2. Post on Product Hunt
3. Share in relevant communities
4. Email marketing (if you have list)
5. Monitor closely

---

## 📞 Support Resources

### Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/next.js/discussions

### Supabase
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support
- Discord: https://discord.supabase.com

### Stripe
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com
- Dashboard: https://dashboard.stripe.com

---

## 🎉 You're Ready to Launch!

### Quick Summary:
1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel (free)
3. ✅ Add environment variables
4. ✅ Buy domain (optional, £8-12/year)
5. ✅ Connect domain to Vercel
6. ✅ Set up production Supabase
7. ✅ Configure Stripe webhook
8. ✅ Test everything
9. ✅ Launch! 🚀

**Total time**: 2-3 hours
**Total cost**: £8-12/year (just the domain)

**No need to:**
- ❌ Buy hosting
- ❌ Upload files via FTP
- ❌ Manage servers
- ❌ Configure SSL
- ❌ Install software

**Vercel handles everything!** 🎊

---

## 🚀 Next Steps

1. **Read**: This guide fully
2. **Buy**: Domain (optional, can add later)
3. **Push**: Code to GitHub
4. **Deploy**: To Vercel
5. **Test**: Everything works
6. **Launch**: Share with the world!

**Good luck with your launch!** 🎉
