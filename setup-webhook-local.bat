@echo off
echo ========================================
echo Stripe Webhook Setup for Local Testing
echo ========================================
echo.
echo This will set up Stripe webhooks for localhost:3000
echo.
echo Prerequisites:
echo 1. Stripe CLI must be installed
echo 2. You must be logged in to Stripe (stripe login)
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Starting Stripe webhook forwarding...
echo.
echo IMPORTANT: Keep this window open while testing!
echo.
echo Copy the webhook secret (whsec_xxx) that appears below
echo and paste it into your .env.local file as:
echo STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
echo.
echo Then restart your dev server (npm run dev)
echo.

stripe listen --forward-to localhost:3000/api/stripe/webhook
