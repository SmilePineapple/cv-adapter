# PowerShell script to add Sentry environment variables to Vercel
# Run this in PowerShell: .\add-sentry-to-vercel.ps1

Write-Host "🚀 Adding Sentry Environment Variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "📝 Adding NEXT_PUBLIC_SENTRY_DSN..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SENTRY_DSN production preview development

Write-Host ""
Write-Host "📝 Adding SENTRY_AUTH_TOKEN..." -ForegroundColor Yellow
vercel env add SENTRY_AUTH_TOKEN production preview development

Write-Host ""
Write-Host "📝 Adding SENTRY_ORG..." -ForegroundColor Yellow
vercel env add SENTRY_ORG production preview development

Write-Host ""
Write-Host "📝 Adding SENTRY_PROJECT..." -ForegroundColor Yellow
vercel env add SENTRY_PROJECT production preview development

Write-Host ""
Write-Host "✅ Done! Sentry environment variables added to Vercel." -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test locally: npm run dev" -ForegroundColor White
Write-Host "2. Visit: http://localhost:3000/sentry-example-page" -ForegroundColor White
Write-Host "3. Click 'Throw error' to test" -ForegroundColor White
Write-Host "4. Check Sentry: https://sentry.io/organizations/smilepineapple/issues/" -ForegroundColor White
Write-Host "5. Deploy: git push origin main" -ForegroundColor White
