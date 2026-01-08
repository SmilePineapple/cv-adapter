# 🚀 Quick Deploy Guide

## Before You Deploy

### 1. Configure Supabase SMTP (5 minutes)

**Go to Supabase Dashboard:**
https://supabase.com/dashboard/project/vuslzrevbkuugqeiadnq

**Navigate to:** Authentication → Settings → SMTP Settings

**Enter these details:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your RESEND_API_KEY]
Sender Email: noreply@mycvbuddy.com
Sender Name: CV Buddy
```

**Click "Save"**

This ensures password reset emails and other Supabase system emails work.

---

## Deploy to Vercel

### Option A: Run PowerShell Script (Easiest)

```powershell
.\COMMIT-AND-DEPLOY.ps1
```

This will:
1. Stage the modified files
2. Commit with a detailed message
3. Push to GitHub
4. Vercel will auto-deploy

### Option B: Manual Commands

```bash
# Add modified files
git add src/app/auth/signup/page.tsx
git add src/app/api/send-welcome-email/route.ts
git add SIGNUP-FIXED-SUMMARY.md
git add DEPLOY-TO-VERCEL.md
git add drop-problem-trigger-functions.sql

# Commit
git commit -m "Fix: Resolved signup 500 error and added welcome email"

# Push
git push origin main
```

---

## After Deployment

### 1. Wait for Vercel (2-3 minutes)
- Vercel will automatically deploy when you push
- Check: https://vercel.com/dashboard

### 2. Test Production Signup
- Go to: https://mycvbuddy.com/signup
- Sign up with a test email
- Verify:
  - ✅ Signup completes without errors
  - ✅ Redirected to dashboard
  - ✅ Welcome email received (check spam)
  - ✅ Can log in with new account

### 3. Check Logs
- **Supabase:** Dashboard → Logs → Auth (no 500 errors)
- **Vercel:** Dashboard → Logs (no runtime errors)
- **Resend:** https://resend.com/emails (email delivered)

---

## Environment Variables in Vercel

Make sure these are set (they should already be):

```
NEXT_PUBLIC_SUPABASE_URL=https://vuslzrevbkuugqeiadnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=CV Buddy <noreply@mycvbuddy.com>
OPENAI_API_KEY=sk-...
```

If you added new variables, redeploy in Vercel dashboard.

---

## Troubleshooting

### Signup Still Fails
1. Check Vercel environment variables
2. Check Supabase logs for new errors
3. Verify Resend API key is correct

### Welcome Email Not Received
1. Check spam folder
2. Check Resend dashboard
3. Verify email domain is verified in Resend

### Need to Rollback
```bash
git revert HEAD
git push origin main
```

Or use Vercel dashboard to promote previous deployment.

---

## Success! 🎉

Once deployed:
- Users can sign up without errors
- Welcome emails are sent automatically
- Everything works smoothly

**Ready?** Run `.\COMMIT-AND-DEPLOY.ps1` now!
