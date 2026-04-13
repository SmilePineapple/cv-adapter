# Deploy to Vercel - Checklist

## ✅ Pre-Deployment Checklist

### 1. Supabase Configuration
- [x] Database triggers fixed (handle_new_user working)
- [x] Problematic triggers removed (send_welcome_email, auto_initialize_cohort)
- [ ] Configure Resend SMTP in Supabase (for password reset emails)

### 2. Environment Variables in Vercel
Make sure these are set in Vercel dashboard:

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://vuslzrevbkuugqeiadnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=CV Buddy <noreply@mycvbuddy.com>
OPENAI_API_KEY=sk-xxxxx
```

**Optional (if using):**
```
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
```

### 3. Files to Commit
- [x] src/app/auth/signup/page.tsx (updated with welcome email)
- [x] src/app/api/send-welcome-email/route.ts (updated without auth)
- [ ] Any other modified files

### 4. Files NOT to Commit (already in .gitignore)
- .env.local
- .env
- node_modules/
- .next/
- .vercel/

---

## 🚀 Deployment Steps

### Step 1: Configure Supabase SMTP (5 minutes)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/vuslzrevbkuugqeiadnq

2. **Navigate to Authentication → Settings**

3. **Scroll to SMTP Settings**

4. **Enter Resend SMTP Details:**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP Username: resend
   SMTP Password: [Your RESEND_API_KEY from Vercel]
   Sender Email: noreply@mycvbuddy.com
   Sender Name: CV Buddy
   ```

5. **Click "Save"**

6. **Test by triggering a password reset email**

---

### Step 2: Commit Changes to Git

```bash
# Check what files changed
git status

# Add the modified files
git add src/app/auth/signup/page.tsx
git add src/app/api/send-welcome-email/route.ts

# Commit with descriptive message
git commit -m "Fix: Resolved signup 500 error and added welcome email

- Dropped problematic database triggers (send_welcome_email, auto_initialize_cohort)
- Added application-level welcome email sending via Resend
- Updated signup flow to redirect to dashboard after successful signup
- Removed auth requirement from send-welcome-email API endpoint
- Users can now sign up successfully without 500 errors"

# Push to main branch (or your deployment branch)
git push origin main
```

---

### Step 3: Verify Vercel Deployment

1. **Vercel will auto-deploy** when you push to main

2. **Check Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Find your CV Adapter project
   - Watch the deployment progress

3. **Wait for deployment to complete** (usually 2-3 minutes)

4. **Check deployment logs** for any errors

---

### Step 4: Test Production Signup

1. **Go to your production URL**
   - https://mycvbuddy.com/signup

2. **Sign up with a test email**
   - Use a real email you can check

3. **Verify:**
   - ✅ Signup completes without errors
   - ✅ Redirected to dashboard
   - ✅ Welcome email received (check spam folder)
   - ✅ Can log in with new account
   - ✅ Profile and usage tracking created

4. **Check Supabase Database:**
   ```sql
   -- Check latest user
   SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 1;
   
   -- Check profile
   SELECT id, email, full_name FROM profiles ORDER BY created_at DESC LIMIT 1;
   
   -- Check usage tracking
   SELECT user_id, plan_type, lifetime_generation_count, max_lifetime_generations 
   FROM usage_tracking ORDER BY created_at DESC LIMIT 1;
   ```

---

## 🔍 Post-Deployment Verification

### Check 1: Supabase Logs
- Dashboard → Logs → Auth
- Should see successful `/signup` requests
- No "Database error saving new user" errors

### Check 2: Vercel Logs
- Vercel Dashboard → Your Project → Logs
- Check for any runtime errors
- Verify welcome email API calls succeed

### Check 3: Resend Dashboard
- https://resend.com/emails
- Verify welcome emails are being sent
- Check delivery status

### Check 4: User Experience
- Signup flow is smooth
- Welcome email arrives within 1 minute
- User can access dashboard immediately
- No error messages

---

## 🐛 Troubleshooting

### If Signup Still Fails:

1. **Check Vercel Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Verify all required variables are set
   - Redeploy if you added new variables

2. **Check Supabase Logs**
   - Look for any new error messages
   - Verify triggers are still working

3. **Check Vercel Function Logs**
   - Look for errors in `/api/send-welcome-email`
   - Verify Resend API key is correct

### If Welcome Email Not Received:

1. **Check Spam Folder**

2. **Check Resend Dashboard**
   - Verify email was sent
   - Check delivery status
   - Look for bounce/reject reasons

3. **Verify Resend API Key**
   - Make sure it's set in Vercel
   - Test with Resend API directly

4. **Check Email Domain**
   - Verify `mycvbuddy.com` is verified in Resend
   - Check DNS records are correct

---

## 📊 Monitoring

### After Deployment:

1. **Monitor Signup Rate**
   - Check how many users sign up
   - Track any failed signups

2. **Monitor Email Delivery**
   - Check Resend dashboard daily
   - Track bounce/reject rates

3. **Monitor Supabase Usage**
   - Check database size
   - Monitor API usage
   - Track active users

4. **Monitor Vercel Usage**
   - Check function invocations
   - Monitor bandwidth
   - Track errors

---

## 🎯 Success Criteria

- ✅ Users can sign up without errors
- ✅ Welcome emails are delivered within 1 minute
- ✅ Users can access dashboard immediately
- ✅ Profile and usage tracking created correctly
- ✅ No 500 errors in logs
- ✅ Smooth user experience

---

## 📝 Rollback Plan

If something goes wrong:

1. **Revert Git Commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Vercel will auto-deploy the previous version**

3. **Or manually rollback in Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

---

## 🔐 Security Notes

- ✅ `.env` files are in `.gitignore` (not committed)
- ✅ API keys are in Vercel environment variables (secure)
- ✅ Supabase RLS policies are active
- ✅ Service role key only used server-side
- ✅ No sensitive data in client code

---

## 📞 Support

If issues persist:
1. Check this document first
2. Review Supabase logs
3. Review Vercel logs
4. Check Resend dashboard
5. Test locally with production environment variables

---

**Ready to deploy?** Follow the steps above! 🚀
