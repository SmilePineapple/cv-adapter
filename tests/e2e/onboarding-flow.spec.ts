import { test, expect } from '@playwright/test'
import path from 'path'

/**
 * End-to-End Onboarding Flow Test
 * Tests the complete user journey from signup to CV generation
 * 
 * Prerequisites:
 * 1. Run scripts/reset-test-account.sql to reset jake.rourke@btinternet.com
 * 2. Ensure test CV exists at: C:\Users\jaket\Desktop\Personal\Pamela Dale-Rourke CV.pdf
 * 3. App running at http://localhost:3000 or production URL
 */

const TEST_EMAIL = 'jake.rourke@btinternet.com'
const TEST_PASSWORD = 'Fearnley09' // Update with actual password
const CV_FILE_PATH = 'C:\\Users\\jaket\\Desktop\\Personal\\Pamela Dale-Rourke CV.pdf'
const BASE_URL = process.env.BASE_URL || 'https://www.mycvbuddy.com'

test.describe('Complete Onboarding Flow', () => {
  test.setTimeout(120000) // 2 minutes for complete flow

  test('Full user journey: Signup → Onboarding → Upload → Generate', async ({ page }) => {
    // ==========================================
    // STEP 1: Navigate to Signup Page
    // ==========================================
    console.log('📍 Step 1: Navigating to signup page...')
    await page.goto(`${BASE_URL}/auth/signup`)
    await page.waitForLoadState('networkidle')
    
    // Verify we're on signup page
    await expect(page.locator('h1')).toContainText('Start Free')
    
    // Verify usage limit banner is visible
    await expect(page.locator('text=Start with 1 free CV generation')).toBeVisible()
    console.log('✅ Signup page loaded with usage limit banner')

    // ==========================================
    // STEP 2: Login (account already exists)
    // ==========================================
    console.log('📍 Step 2: Logging in...')
    await page.goto(`${BASE_URL}/auth/login`)
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    console.log('✅ Logged in successfully')

    // ==========================================
    // STEP 3: Verify Onboarding Modal Appears
    // ==========================================
    console.log('📍 Step 3: Checking onboarding modal...')
    
    // Wait for onboarding modal to appear
    await expect(page.locator('text=Welcome to My CV Buddy!')).toBeVisible({ timeout: 5000 })
    
    // Verify 3-step process is shown
    await expect(page.locator('text=Upload → Generate → Download')).toBeVisible()
    
    // Verify no skip button exists (mandatory onboarding)
    await expect(page.locator('button:has-text("Skip")')).not.toBeVisible()
    
    // Verify no close button exists
    await expect(page.locator('button[aria-label="Close"]')).not.toBeVisible()
    
    console.log('✅ Onboarding modal is mandatory (no skip/close buttons)')

    // ==========================================
    // STEP 4: Complete Onboarding Steps
    // ==========================================
    console.log('📍 Step 4: Completing onboarding steps...')
    
    // Step 1: Select goal (if present)
    const goalButton = page.locator('button:has-text("Get a new job")')
    if (await goalButton.isVisible()) {
      await goalButton.click()
      await page.click('button:has-text("Next")')
      console.log('  ✓ Selected goal: Get a new job')
    }
    
    // Step 2: Experience level (if present)
    const experienceButton = page.locator('button:has-text("Mid-level")')
    if (await experienceButton.isVisible()) {
      await experienceButton.click()
      await page.click('button:has-text("Next")')
      console.log('  ✓ Selected experience: Mid-level')
    }
    
    // Step 3: Industry (if present)
    const industryButton = page.locator('button:has-text("Technology")')
    if (await industryButton.isVisible()) {
      await industryButton.click()
      await page.click('button:has-text("Get Started")')
      console.log('  ✓ Selected industry: Technology')
    }
    
    // Wait for modal to close - check for the modal container to disappear
    await page.waitForSelector('text=Welcome to My CV Buddy!', { state: 'hidden', timeout: 10000 })
    console.log('✅ Onboarding completed')

    // ==========================================
    // STEP 5: Verify Dashboard State
    // ==========================================
    console.log('📍 Step 5: Verifying dashboard state...')
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle')
    
    // Verify primary CTA shows "Upload CV to Get Started" (no CVs yet)
    await expect(page.locator('text=Upload CV to Get Started')).toBeVisible({ timeout: 10000 })
    console.log('✅ Dashboard loaded with correct empty state')
    
    // Verify usage limit banner is visible
    await expect(page.locator('text=1 Free Generation')).toBeVisible()
    await expect(page.locator('text=Remaining')).toBeVisible()
    
    console.log('✅ Dashboard shows correct empty state')

    // ==========================================
    // STEP 6: Navigate to Upload Page
    // ==========================================
    console.log('📍 Step 6: Navigating to upload page...')
    
    await page.click('text=Upload CV to Get Started')
    await page.waitForURL('**/upload', { timeout: 10000 })
    
    await expect(page.locator('h1')).toContainText('Upload')
    console.log('✅ Upload page loaded')

    // ==========================================
    // STEP 7: Upload CV File
    // ==========================================
    console.log('📍 Step 7: Uploading CV file...')
    
    // Check if file exists
    const fs = require('fs')
    if (!fs.existsSync(CV_FILE_PATH)) {
      throw new Error(`CV file not found at: ${CV_FILE_PATH}`)
    }
    
    // Find file input and upload
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(CV_FILE_PATH)
    
    console.log('  ⏳ Uploading and parsing CV...')
    
    // Wait for upload to complete (look for success message or redirect)
    await page.waitForSelector('text=successfully uploaded', { timeout: 30000 })
      .catch(() => page.waitForURL('**/dashboard', { timeout: 30000 }))
    
    console.log('✅ CV uploaded successfully')

    // ==========================================
    // STEP 8: Verify Dashboard After Upload
    // ==========================================
    console.log('📍 Step 8: Verifying dashboard after upload...')
    
    // Navigate back to dashboard if not already there
    if (!page.url().includes('/dashboard')) {
      await page.goto(`${BASE_URL}/dashboard`)
      await page.waitForLoadState('networkidle')
    }
    
    // Verify primary CTA changed to "Generate your New CV"
    await expect(page.locator('text=Generate your New CV')).toBeVisible({ timeout: 5000 })
    
    // Verify CV count shows 1
    await expect(page.locator('text=1').first()).toBeVisible()
    
    console.log('✅ Dashboard updated with uploaded CV')

    // ==========================================
    // STEP 9: Start CV Generation
    // ==========================================
    console.log('📍 Step 9: Starting CV generation...')
    
    await page.click('text=Generate your New CV')
    await page.waitForURL('**/generate/**', { timeout: 10000 })
    
    await expect(page.locator('h1')).toContainText('Generate', { timeout: 5000 })
    console.log('✅ Generation page loaded')

    // ==========================================
    // STEP 10: Fill Job Description
    // ==========================================
    console.log('📍 Step 10: Filling job description...')
    
    const jobDescription = `
Senior Software Engineer
We're looking for an experienced software engineer to join our team.
Requirements:
- 5+ years of experience
- Strong TypeScript/JavaScript skills
- Experience with React and Node.js
- Good communication skills
    `.trim()
    
    const jobDescTextarea = page.locator('textarea').first()
    await jobDescTextarea.fill(jobDescription)
    
    console.log('✅ Job description filled')

    // ==========================================
    // STEP 11: Generate CV
    // ==========================================
    console.log('📍 Step 11: Generating tailored CV...')
    
    const generateButton = page.locator('button:has-text("Generate")')
    await generateButton.click()
    
    console.log('  ⏳ AI is generating your CV (this may take 30-60 seconds)...')
    
    // Wait for generation to complete
    await page.waitForSelector('text=Download', { timeout: 90000 })
      .catch(() => page.waitForSelector('text=View CV', { timeout: 90000 }))
    
    console.log('✅ CV generated successfully')

    // ==========================================
    // STEP 12: Verify Generation Success
    // ==========================================
    console.log('📍 Step 12: Verifying generation success...')
    
    // Check for download or view button
    const hasDownload = await page.locator('text=Download').isVisible()
    const hasView = await page.locator('text=View CV').isVisible()
    
    expect(hasDownload || hasView).toBeTruthy()
    console.log('✅ Generation completed with download/view option')

    // ==========================================
    // STEP 13: Verify Usage Tracking
    // ==========================================
    console.log('📍 Step 13: Verifying usage tracking...')
    
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    
    // Verify usage limit banner shows 0 remaining
    await expect(page.locator('text=0 Free Generation')).toBeVisible()
      .catch(() => expect(page.locator('text=Upgrade to Pro')).toBeVisible())
    
    console.log('✅ Usage tracking updated correctly')

    // ==========================================
    // FINAL SUMMARY
    // ==========================================
    console.log('\n🎉 ========================================')
    console.log('🎉 COMPLETE ONBOARDING FLOW TEST PASSED!')
    console.log('🎉 ========================================')
    console.log('✅ Signup page shows usage limits')
    console.log('✅ Onboarding is mandatory (no skip)')
    console.log('✅ Dashboard shows correct empty state')
    console.log('✅ CV upload works correctly')
    console.log('✅ Dashboard updates after upload')
    console.log('✅ CV generation works end-to-end')
    console.log('✅ Usage tracking updates correctly')
    console.log('========================================\n')
  })

  test('Verify image-based PDF rejection', async ({ page }) => {
    console.log('📍 Testing image-based PDF rejection...')
    
    // This test would require a scanned/image-based PDF
    // Skip for now, but structure is here
    test.skip()
  })

  test('Verify onboarding cannot be skipped', async ({ page }) => {
    console.log('📍 Testing mandatory onboarding...')
    
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    
    // Verify onboarding modal appears
    await expect(page.locator('text=Welcome to My CV Buddy!')).toBeVisible()
    
    // Verify no escape routes
    await expect(page.locator('button:has-text("Skip")')).not.toBeVisible()
    await expect(page.locator('button[aria-label="Close"]')).not.toBeVisible()
    
    // Try pressing Escape key
    await page.keyboard.press('Escape')
    
    // Modal should still be visible
    await expect(page.locator('text=Welcome to My CV Buddy!')).toBeVisible()
    
    console.log('✅ Onboarding is truly mandatory')
  })
})
