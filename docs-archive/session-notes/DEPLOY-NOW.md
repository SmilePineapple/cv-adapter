# 🚀 Deploy CV Adapter Now - Step by Step

## Step 1: Initialize Git & Push to GitHub

### Open Terminal in VS Code (Ctrl + `)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - CV Adapter ready for deployment"

# Create a new repository on GitHub:
# 1. Go to https://github.com/new
# 2. Repository name: cv-adapter
# 3. Description: AI-powered CV tailoring tool
# 4. Public or Private (your choice)
# 5. DON'T initialize with README (we already have code)
# 6. Click "Create repository"

# After creating the repo, GitHub will show you commands like:
# Copy your repository URL and run:

git remote add origin https://github.com/YOUR-USERNAME/cv-adapter.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `cv-adapter` repository
5. Click **"Import"**
6. Vercel will auto-detect Next.js settings
7. **DON'T click Deploy yet!** First add environment variables...

### Add Environment Variables:

Click **"Environment Variables"** and add these:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe (use TEST keys for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# App URL (will update after deployment)
NEXT_PUBLIC_APP_URL=https://cv-adapter.vercel.app

# Admin Emails
ADMIN_EMAILS=your-email@gmail.com
```

8. Click **"Deploy"**
9. Wait 2-3 minutes
10. Click the deployment URL to view your live site!

---

## Step 3: Update App URL

After deployment, Vercel gives you a URL like: `https://cv-adapter-xyz123.vercel.app`

1. Go to **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_APP_URL`
3. Update to your actual Vercel URL
4. Click **"Save"**
5. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## Step 4: Set Up Production Database

### Create Production Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New project"**
3. Name: `cv-adapter-production`
4. Database password: (save this!)
5. Region: Choose closest to your users
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

### Run Migration Scripts

1. Go to **SQL Editor** in Supabase
2. Run these scripts in order:

**Script 1: COMPLETE-SUBSCRIPTION-SETUP.sql**
```sql
-- Copy entire contents of COMPLETE-SUBSCRIPTION-SETUP.sql
-- Paste and run
```

**Script 2: create-cv-ratings-table.sql**
```sql
-- Copy entire contents of create-cv-ratings-table.sql
-- Paste and run
```

**Script 3: fix-usage-tracking-rls.sql**
```sql
-- Copy entire contents of fix-usage-tracking-rls.sql
-- Paste and run (ignore "already exists" errors)
```

**Script 4: add-cancel-column.sql**
```sql
-- Copy entire contents of add-cancel-column.sql
-- Paste and run
```

### Get Production Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update the 3 Supabase variables with production values
3. Click **"Save"**
4. Redeploy

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Upload a CV
4. Generate a tailored CV
5. Download it
6. Try creating a cover letter

**If everything works, you're live!** 🎉

---

## Step 6: Set Up Stripe Webhook (Optional for now)

You can do this later when you're ready to accept real payments.

For now, the app works with test mode Stripe keys.

---

## Troubleshooting

### Build Failed?
- Check build logs in Vercel
- Look for TypeScript errors
- Ensure all environment variables are set

### Database Errors?
- Verify Supabase keys are correct
- Check RLS policies were created
- Ensure all migration scripts ran successfully

### Can't Sign Up?
- Check Supabase email settings
- Verify auth is enabled
- Check browser console for errors

---

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Add custom domain** (optional)
3. **Set up Stripe webhook** for real payments
4. **Submit sitemap** to Google Search Console
5. **Share with friends** for feedback
6. **Launch publicly!**

---

## Quick Reference

### Vercel Dashboard
https://vercel.com/dashboard

### Supabase Dashboard
https://supabase.com/dashboard

### GitHub Repository
https://github.com/YOUR-USERNAME/cv-adapter

### Your Live Site
https://cv-adapter-xyz123.vercel.app (update after deployment)

---

## 🎉 You're Deploying!

Follow the steps above and you'll be live in 30-60 minutes!

**Good luck!** 🚀
