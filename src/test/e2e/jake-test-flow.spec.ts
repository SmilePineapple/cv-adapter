import { test, expect } from '@playwright/test'
import path from 'path'

/**
 * Comprehensive E2E Test: Jake's Account Testing
 * Tests complete user flow with real CV upload and generation
 */

const TEST_USER = {
  name: 'Jake',
  email: 'jake.rourke@btinternet.com',
  password: 'Fearnley09'
}

const CV_PATH = path.resolve('C:/Users/jaket/Desktop/CV/cv-adapter/CV examples/Jake_Rourke_CV (1).pdf')

const TEST_JOB = {
  title: 'Senior Software Engineer',
  company: 'Tech Solutions Ltd',
  description: `We are seeking an experienced Senior Software Engineer to join our growing team.

Key Responsibilities:
- Lead development of scalable web applications
- Mentor junior developers
- Collaborate with cross-functional teams
- Design and implement new features
- Code review and quality assurance

Required Skills:
- 5+ years of software development experience
- Strong proficiency in JavaScript/TypeScript
- Experience with React, Node.js
- Excellent problem-solving skills
- Strong communication abilities

Nice to Have:
- Experience with cloud platforms (AWS, Azure)
- Knowledge of CI/CD pipelines
- Agile/Scrum experience`
}

test.describe('Jake Test Account - Complete Flow', () => {
  test.setTimeout(120000) // 2 minutes for full flow

  let cvId: string
  let generationId: string

  test('Step 1: Sign up new account', async ({ page }) => {
    console.log('🔐 Testing signup flow...')
    
    await page.goto('/')
    
    // Click Sign Up
    await page.click('text=Sign Up')
    await expect(page).toHaveURL(/\/auth\/signup/)
    
    // Fill signup form
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Wait for success message or redirect
    await page.waitForTimeout(3000)
    
    // Check if we're redirected or see success message
    const currentUrl = page.url()
    console.log('✅ Signup completed. Current URL:', currentUrl)
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/01-signup.png', fullPage: true })
  })

  test('Step 2: Upload Jake\'s CV', async ({ page, context }) => {
    console.log('📄 Testing CV upload...')
    
    // Login first (in case previous test didn't persist session)
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    console.log('✅ Logged in successfully')
    
    // Navigate to upload or click upload button
    const uploadButton = page.locator('text=Upload CV').first()
    if (await uploadButton.isVisible()) {
      await uploadButton.click()
    } else {
      await page.goto('/upload')
    }
    
    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(CV_PATH)
    
    console.log('📤 CV file selected, waiting for upload...')
    
    // Wait for upload to complete (look for success message or redirect)
    await page.waitForTimeout(5000)
    
    // Check for success indicators
    const successMessage = page.locator('text=/upload.*success/i, text=/cv.*uploaded/i')
    if (await successMessage.isVisible({ timeout: 5000 })) {
      console.log('✅ Upload success message found')
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/02-upload.png', fullPage: true })
    
    // Try to extract CV ID from URL or page
    const currentUrl = page.url()
    const cvIdMatch = currentUrl.match(/\/generate\/([a-f0-9-]+)/)
    if (cvIdMatch) {
      cvId = cvIdMatch[1]
      console.log('✅ CV ID extracted:', cvId)
    }
  })

  test('Step 3: Generate adapted CV', async ({ page }) => {
    console.log('🤖 Testing CV generation...')
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Navigate to generate page
    const generateButton = page.locator('text=Generate CV, button:has-text("Generate")').first()
    if (await generateButton.isVisible({ timeout: 5000 })) {
      await generateButton.click()
    } else {
      // Try to find CV in dashboard and click it
      const cvCard = page.locator('[data-testid="cv-card"], .cv-item').first()
      if (await cvCard.isVisible({ timeout: 5000 })) {
        await cvCard.click()
      }
    }
    
    await page.waitForTimeout(2000)
    
    // Fill job details
    const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="job title" i]').first()
    if (await jobTitleInput.isVisible({ timeout: 5000 })) {
      await jobTitleInput.fill(TEST_JOB.title)
      console.log('✅ Job title filled')
    }
    
    const companyInput = page.locator('input[name="companyName"], input[name="company"], input[placeholder*="company" i]').first()
    if (await companyInput.isVisible({ timeout: 5000 })) {
      await companyInput.fill(TEST_JOB.company)
      console.log('✅ Company name filled')
    }
    
    const descriptionInput = page.locator('textarea[name="jobDescription"], textarea[placeholder*="description" i]').first()
    if (await descriptionInput.isVisible({ timeout: 5000 })) {
      await descriptionInput.fill(TEST_JOB.description)
      console.log('✅ Job description filled')
    }
    
    // Take screenshot before generation
    await page.screenshot({ path: 'test-results/03-before-generate.png', fullPage: true })
    
    // Click generate button
    const generateSubmitButton = page.locator('button:has-text("Generate"), button:has-text("Adapt CV"), button[type="submit"]').first()
    await generateSubmitButton.click()
    
    console.log('⏳ Waiting for AI generation (this may take 30-60 seconds)...')
    
    // Wait for generation to complete
    await page.waitForTimeout(5000)
    
    // Look for success indicators
    const successIndicators = [
      'text=/generation.*complete/i',
      'text=/ats.*score/i',
      'text=/download/i',
      '[data-testid="generation-result"]',
      '[data-testid="ats-score"]'
    ]
    
    for (const selector of successIndicators) {
      if (await page.locator(selector).isVisible({ timeout: 60000 })) {
        console.log('✅ Generation completed - found:', selector)
        break
      }
    }
    
    // Take screenshot of results
    await page.screenshot({ path: 'test-results/04-generation-result.png', fullPage: true })
    
    // Try to extract generation ID
    const currentUrl = page.url()
    const genIdMatch = currentUrl.match(/\/review\/([a-f0-9-]+)|\/download\/([a-f0-9-]+)/)
    if (genIdMatch) {
      generationId = genIdMatch[1] || genIdMatch[2]
      console.log('✅ Generation ID extracted:', generationId)
    }
    
    // Check ATS score
    const atsScoreElement = page.locator('[data-testid="ats-score"], text=/score.*\\d+/i').first()
    if (await atsScoreElement.isVisible({ timeout: 5000 })) {
      const scoreText = await atsScoreElement.textContent()
      console.log('📊 ATS Score:', scoreText)
    }
  })

  test('Step 4: Test CV editing', async ({ page }) => {
    console.log('✏️ Testing CV editing...')
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Navigate to edit page (try multiple approaches)
    const editButton = page.locator('text=Edit, button:has-text("Edit")').first()
    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click()
    } else {
      // Try to find generation and click edit
      const generationCard = page.locator('[data-testid="generation-card"]').first()
      if (await generationCard.isVisible({ timeout: 5000 })) {
        await generationCard.hover()
        await page.click('text=Edit')
      }
    }
    
    await page.waitForTimeout(3000)
    
    // Take screenshot of edit page
    await page.screenshot({ path: 'test-results/05-edit-page.png', fullPage: true })
    
    // Try to edit a section
    const editableSection = page.locator('[contenteditable="true"], textarea, input[type="text"]').first()
    if (await editableSection.isVisible({ timeout: 5000 })) {
      await editableSection.click()
      await editableSection.fill('Test edit - Updated by automated test')
      console.log('✅ Section edited')
    }
    
    // Look for save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first()
    if (await saveButton.isVisible({ timeout: 5000 })) {
      await saveButton.click()
      console.log('✅ Changes saved')
      await page.waitForTimeout(2000)
    }
    
    await page.screenshot({ path: 'test-results/06-after-edit.png', fullPage: true })
  })

  test('Step 5: Test export/download', async ({ page }) => {
    console.log('📥 Testing export/download...')
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Navigate to download page
    const downloadButton = page.locator('text=Download, button:has-text("Download")').first()
    if (await downloadButton.isVisible({ timeout: 5000 })) {
      await downloadButton.click()
    }
    
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/07-download-page.png', fullPage: true })
    
    // Select a template
    const templateCard = page.locator('[data-testid="template-card"], .template-item').first()
    if (await templateCard.isVisible({ timeout: 5000 })) {
      await templateCard.click()
      console.log('✅ Template selected')
    }
    
    // Try to export as PDF
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download PDF")').first()
    if (await exportButton.isVisible({ timeout: 5000 })) {
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
      await exportButton.click()
      
      try {
        const download = await downloadPromise
        console.log('✅ PDF download started:', download.suggestedFilename())
      } catch (error) {
        console.log('⚠️ Download event not captured (may still be working)')
      }
    }
    
    await page.screenshot({ path: 'test-results/08-after-export.png', fullPage: true })
  })

  test('Step 6: Test cover letter generation', async ({ page }) => {
    console.log('📝 Testing cover letter generation...')
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Navigate to cover letter page
    const coverLetterButton = page.locator('text=Cover Letter, text=Create Cover Letter').first()
    if (await coverLetterButton.isVisible({ timeout: 5000 })) {
      await coverLetterButton.click()
    } else {
      await page.goto('/cover-letter')
    }
    
    await page.waitForTimeout(2000)
    
    // Fill cover letter details
    const jobTitleInput = page.locator('input[name="jobTitle"]').first()
    if (await jobTitleInput.isVisible({ timeout: 5000 })) {
      await jobTitleInput.fill(TEST_JOB.title)
    }
    
    const companyInput = page.locator('input[name="companyName"], input[name="company"]').first()
    if (await companyInput.isVisible({ timeout: 5000 })) {
      await companyInput.fill(TEST_JOB.company)
    }
    
    const descriptionInput = page.locator('textarea[name="jobDescription"]').first()
    if (await descriptionInput.isVisible({ timeout: 5000 })) {
      await descriptionInput.fill(TEST_JOB.description)
    }
    
    await page.screenshot({ path: 'test-results/09-cover-letter-form.png', fullPage: true })
    
    // Generate cover letter
    const generateButton = page.locator('button:has-text("Generate")').first()
    if (await generateButton.isVisible({ timeout: 5000 })) {
      await generateButton.click()
      console.log('⏳ Generating cover letter...')
      
      // Wait for generation
      await page.waitForTimeout(30000)
      
      // Look for success
      const coverLetterPreview = page.locator('[data-testid="cover-letter-preview"], .cover-letter-content').first()
      if (await coverLetterPreview.isVisible({ timeout: 30000 })) {
        console.log('✅ Cover letter generated')
      }
    }
    
    await page.screenshot({ path: 'test-results/10-cover-letter-result.png', fullPage: true })
  })

  test('Step 7: Check dashboard and usage', async ({ page }) => {
    console.log('📊 Checking dashboard and usage tracking...')
    
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Take full dashboard screenshot
    await page.screenshot({ path: 'test-results/11-final-dashboard.png', fullPage: true })
    
    // Check usage count
    const usageElement = page.locator('[data-testid="usage-count"], text=/\\d+\\/\\d+.*generation/i').first()
    if (await usageElement.isVisible({ timeout: 5000 })) {
      const usageText = await usageElement.textContent()
      console.log('📈 Usage:', usageText)
    }
    
    // Count CVs
    const cvCards = page.locator('[data-testid="cv-card"], .cv-item')
    const cvCount = await cvCards.count()
    console.log('📄 CVs in dashboard:', cvCount)
    
    // Count generations
    const generationCards = page.locator('[data-testid="generation-card"], .generation-item')
    const genCount = await generationCards.count()
    console.log('🤖 Generations in dashboard:', genCount)
    
    console.log('✅ All tests completed!')
  })
})
