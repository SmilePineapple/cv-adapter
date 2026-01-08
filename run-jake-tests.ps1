# Automated Test Runner for Jake's Account
# Run this script to execute all tests and generate report

Write-Host "Starting Jake's Account Testing..." -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if Playwright is installed
Write-Host "Checking Playwright..." -ForegroundColor Yellow
$playwrightPath = "node_modules/@playwright/test"
if (-not (Test-Path $playwrightPath)) {
    Write-Host "Installing Playwright..." -ForegroundColor Yellow
    npm install @playwright/test
    npx playwright install chromium
}

# Create test-results directory
if (-not (Test-Path "test-results")) {
    New-Item -ItemType Directory -Path "test-results" | Out-Null
}

Write-Host ""
Write-Host "Running Jake's comprehensive test suite..." -ForegroundColor Green
Write-Host ""

# Run the test with detailed output
npx playwright test src/test/e2e/jake-test-flow.spec.ts --headed --reporter=list

Write-Host ""
Write-Host "Test Results:" -ForegroundColor Cyan
Write-Host "Screenshots saved in: test-results/" -ForegroundColor White
Write-Host ""

# Check if HTML report exists
if (Test-Path "playwright-report") {
    Write-Host "Opening HTML report..." -ForegroundColor Green
    npx playwright show-report
} else {
    Write-Host "No HTML report generated" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review screenshots in test-results/ folder" -ForegroundColor White
Write-Host "2. Check for any errors in the console output above" -ForegroundColor White
Write-Host "3. Verify the account at: https://mycvbuddy.com/dashboard" -ForegroundColor White
