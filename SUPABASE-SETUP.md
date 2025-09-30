# Supabase Setup Guide for CV Adapter

## 🗄️ Step 1: Create Database Tables

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `vuslzrevbkuugqeiadnq`
3. Go to **SQL Editor** in the left sidebar
4. Copy the entire contents of `supabase-setup.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute the script

This will create:
- ✅ All required tables (profiles, cvs, generations, usage_tracking, subscriptions, cover_letters)
- ✅ Row Level Security (RLS) policies
- ✅ Database triggers for auto-profile creation
- ✅ Indexes for performance

## 🔐 Step 2: Configure Authentication

### Enable Email Confirmation
1. Go to **Authentication** → **Settings**
2. Under **User Signups**, ensure:
   - ✅ "Enable email confirmations" is ON
   - ✅ "Enable custom SMTP" (recommended) or use Supabase SMTP

### Configure SMTP (Recommended)
1. In **Authentication** → **Settings** → **SMTP Settings**
2. Add your email provider settings:
   ```
   SMTP Host: smtp.gmail.com (for Gmail)
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Pass: your-app-password
   ```

### Enable OAuth Providers

#### Google OAuth
1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Configure**
3. Toggle **Enable sign in with Google** to ON
4. You need to create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://vuslzrevbkuugqeiadnq.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

#### LinkedIn OAuth
1. In **Authentication** → **Providers**
2. Find **LinkedIn** and click **Configure**
3. Toggle **Enable sign in with LinkedIn** to ON
4. Create LinkedIn OAuth app:
   - Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
   - Create new app
   - Add redirect URI: `https://vuslzrevbkuugqeiadnq.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## 🔧 Step 3: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/auth/callback`

## 📧 Step 4: Test Email Signup

1. Go to your CV Adapter app: http://localhost:3000
2. Click **Get Started** → **Sign up with email**
3. Enter email and password
4. Check your email for confirmation link
5. Click the confirmation link
6. You should be redirected to the dashboard

## 🔍 Step 5: Verify Database Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `cvs`
   - ✅ `generations`
   - ✅ `usage_tracking`
   - ✅ `subscriptions`
   - ✅ `cover_letters`

3. After signing up a test user, check:
   - `auth.users` should have your user
   - `profiles` should have your profile
   - `usage_tracking` should have your usage record

## 🐛 Troubleshooting

### Email Not Received
- Check spam folder
- Verify SMTP settings in Supabase
- Try using Supabase's built-in SMTP first
- Check email templates in **Authentication** → **Email Templates**

### OAuth Errors
- Verify redirect URLs match exactly
- Check OAuth app is approved/published
- Ensure OAuth scopes include email and profile
- Check browser console for detailed errors

### Database Errors
- Verify all SQL ran successfully
- Check RLS policies are enabled
- Ensure triggers are created
- Look at Supabase logs in **Logs** section

### 400 Bad Request on OAuth
This means the OAuth provider is not properly configured:
1. Double-check Client ID and Secret
2. Verify redirect URLs
3. Ensure the provider is enabled in Supabase

## ✅ Success Checklist

- [ ] Database tables created successfully
- [ ] RLS policies enabled
- [ ] Email signup working (confirmation email received)
- [ ] Google OAuth working
- [ ] LinkedIn OAuth working (optional)
- [ ] User profile created automatically
- [ ] Usage tracking initialized
- [ ] Dashboard loads after login

## 🚀 Next Steps

Once Supabase is configured:
1. Add your OpenAI API key to `.env.local`
2. Test the complete CV upload and generation flow
3. Deploy to production with updated environment variables

---

**Need Help?**
- Check Supabase logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure your OpenAI API key has sufficient credits
