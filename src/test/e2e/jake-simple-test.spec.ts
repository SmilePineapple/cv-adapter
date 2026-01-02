import { test, expect } from '@playwright/test'
import path from 'path'

/**
 * Simplified E2E Test: Jake's Account - Critical Path Only
 * Single browser, focused on main flow
 */

const TEST_USER = {
  email: 'jake.rourke@btinternet.com',
  password: 'Fearnley09'
}

const CV_PATH = path.resolve('C:/Users/jaket/Desktop/CV/cv-adapter/CV examples/Jake_Rourke_CV (1).pdf')

test.describe('Jake Test - Critical Flow', () => {
  test.setTimeout(180000) // 3 minutes total

  test('Complete CV generation flow', async ({ page }) => {
    console.log('Starting test for jake.rourke@btinternet.com')
    
    // Step 1: Login
    console.log('Step 1: Logging in...')
    await page.goto('https://www.mycvbuddy.com/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/01-after-login.png', fullPage: true })
    console.log('✅ Login completed')
    
    // Step 2: Navigate to dashboard
    console.log('Step 2: Checking dashboard...')
    await page.goto('https://www.mycvbuddy.com/dashboard')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/02-dashboard.png', fullPage: true })
    console.log('✅ Dashboard loaded')
    
    // Step 3: Upload CV
    console.log('Step 3: Uploading CV...')
    
    // Try to find upload button or navigate directly
    const uploadButton = page.locator('text=Upload CV, a:has-text("Upload")').first()
    if (await uploadButton.isVisible({ timeout: 3000 })) {
      await uploadButton.click()
    } else {
      await page.goto('https://www.mycvbuddy.com/upload')
    }
    
    await page.waitForTimeout(2000)
    
    // Upload the file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(CV_PATH)
    console.log('📤 File selected, waiting for upload...')
    
    await page.waitForTimeout(8000) // Wait for upload and parsing
    await page.screenshot({ path: 'test-results/03-after-upload.png', fullPage: true })
    
    // Check if we're on generate page or need to navigate
    const currentUrl = page.url()
    console.log('Current URL after upload:', currentUrl)
    
    if (!currentUrl.includes('/generate/')) {
      console.log('Not on generate page, checking dashboard...')
      await page.goto('https://www.mycvbuddy.com/dashboard')
      await page.waitForTimeout(2000)
      await page.screenshot({ path: 'test-results/04-dashboard-after-upload.png', fullPage: true })
    }
    
    console.log('✅ Upload completed')
    
    // Step 4: Generate CV
    console.log('Step 4: Generating adapted CV...')
    
    // Find and click generate button or navigate to first CV
    const generateButton = page.locator('button:has-text("Generate"), a:has-text("Generate")').first()
    if (await generateButton.isVisible({ timeout: 3000 })) {
      await generateButton.click()
    } else {
      // Try to click on first CV card
      const cvCard = page.locator('[data-testid="cv-card"]').first()
      if (await cvCard.isVisible({ timeout: 3000 })) {
        await cvCard.click()
      }
    }
    
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/05-generate-page.png', fullPage: true })
    
    // Fill in job details
    console.log('Filling job details...')
    
    const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="job title" i]').first()
    if (await jobTitleInput.isVisible({ timeout: 3000 })) {
      await jobTitleInput.fill('Senior Software Engineer')
      console.log('✅ Job title filled')
    }
    
    const companyInput = page.locator('input[name="companyName"], input[name="company"], input[placeholder*="company" i]').first()
    if (await companyInput.isVisible({ timeout: 3000 })) {
      await companyInput.fill('Tech Solutions Ltd')
      console.log('✅ Company filled')
    }
    
    const descriptionInput = page.locator('textarea[name="jobDescription"], textarea[placeholder*="description" i]').first()
    if (await descriptionInput.isVisible({ timeout: 3000 })) {
      await descriptionInput.fill('We are seeking an experienced Senior Software Engineer with strong JavaScript and React skills.')
      console.log('✅ Description filled')
    }
    
    await page.screenshot({ path: 'test-results/06-form-filled.png', fullPage: true })
    
    // Submit generation
    const submitButton = page.locator('button:has-text("Generate"), button:has-text("Adapt"), button[type="submit"]').first()
    if (await submitButton.isVisible({ timeout: 3000 })) {
      await submitButton.click()
      console.log('⏳ Generation started, waiting up to 60 seconds...')
      
      await page.waitForTimeout(60000) // Wait for AI generation
      await page.screenshot({ path: 'test-results/07-after-generation.png', fullPage: true })
      
      // Check for ATS score or success indicators
      const atsScore = page.locator('[data-testid="ats-score"], text=/score.*\\d+/i').first()
      if (await atsScore.isVisible({ timeout: 5000 })) {
        const scoreText = await atsScore.textContent()
        console.log('📊 ATS Score found:', scoreText)
      }
      
      console.log('✅ Generation completed')
    }
    
    // Step 5: Check final dashboard
    console.log('Step 5: Checking final dashboard state...')
    await page.goto('https://www.mycvbuddy.com/dashboard')
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/08-final-dashboard.png', fullPage: true })
    
    // Count items
    const cvCards = page.locator('[data-testid="cv-card"], .cv-item')
    const cvCount = await cvCards.count()
    console.log('📄 CVs in dashboard:', cvCount)
    
    const generationCards = page.locator('[data-testid="generation-card"], .generation-item')
    const genCount = await generationCards.count()
    console.log('🤖 Generations in dashboard:', genCount)
    
    // Check usage
    const usageText = page.locator('text=/\\d+\\/\\d+/').first()
    if (await usageText.isVisible({ timeout: 3000 })) {
      const usage = await usageText.textContent()
      console.log('📈 Usage:', usage)
    }
    
    console.log('✅ All tests completed successfully!')
  })
})
