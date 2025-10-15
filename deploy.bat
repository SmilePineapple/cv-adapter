@echo off
echo ========================================
echo Deploying CV Adapter to Production
echo ========================================
echo.

echo Step 1: Committing changes...
git commit -m "Payment migration: one-time lifetime model, bug fixes, progress indicators"

echo.
echo Step 2: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Vercel will automatically deploy from GitHub.
echo Check deployment status at: https://vercel.com/dashboard
echo.
echo Your sites will be updated at:
echo - https://www.mycvbuddy.com
echo - https://www.mycvbuddy.co.uk
echo.
pause
