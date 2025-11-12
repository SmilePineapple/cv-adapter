#!/bin/bash
# Commit and Deploy Script for Signup Fix

echo "🔍 Checking git status..."
git status

echo ""
echo "📦 Adding modified application files..."
git add src/app/auth/signup/page.tsx
git add src/app/api/send-welcome-email/route.ts

echo ""
echo "📝 Adding documentation..."
git add SIGNUP-FIXED-SUMMARY.md
git add DEPLOY-TO-VERCEL.md
git add SUPABASE-EMAIL-SETUP.md

echo ""
echo "🗄️ Adding database fix scripts (for reference)..."
git add drop-problem-trigger-functions.sql
git add fix-missing-net-schema.sql

echo ""
echo "✅ Files staged for commit:"
git status

echo ""
echo "💾 Committing changes..."
git commit -m "Fix: Resolved signup 500 error and added welcome email

- Fixed database trigger conflicts causing 500 errors during signup
- Dropped problematic triggers (send_welcome_email, auto_initialize_cohort)
- Added application-level welcome email sending via Resend
- Updated signup flow to redirect to dashboard after successful signup
- Removed auth requirement from send-welcome-email API endpoint
- Users can now sign up successfully without database errors

Database changes:
- Enabled pg_net extension for Supabase
- Removed triggers that were trying to use net.http_post()
- Kept handle_new_user trigger working (creates profile + usage_tracking)

Application changes:
- Signup page now sends welcome email after successful signup
- Welcome email API endpoint updated to work without authentication
- User redirected to dashboard instead of login page

Tested and verified:
- Signup completes without 500 errors
- Profile and usage_tracking created correctly
- Welcome email sent via Resend
- User can access dashboard immediately"

echo ""
echo "🚀 Pushing to origin/main..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "📊 Check Vercel dashboard for deployment status"
echo "🔗 https://vercel.com/dashboard"
