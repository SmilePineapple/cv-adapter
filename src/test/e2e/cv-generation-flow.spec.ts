import { test, expect } from '@playwright/test'

/**
 * E2E Test: Complete CV Generation Flow
 * Tests the entire user journey from upload to download
 */

test.describe('CV Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
  })

  test('should complete full CV generation flow', async ({ page }) => {
    // Step 1: Sign up / Login
    await page.click('text=Sign Up')
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Step 2: Upload CV
    await page.click('text=Upload CV', { timeout: 10000 })
    await page.waitForLoadState('networkidle')
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Mock PDF content')
    })

    // Wait for upload to complete with longer timeout
    await expect(page.locator('text=CV uploaded successfully, text=Upload successful').first()).toBeVisible({ timeout: 15000 })

    // Step 3: Generate CV
    const generateButton = page.locator('button:has-text("Generate CV"), button:has-text("Continue to Job Matching")').first()
    await expect(generateButton).toBeVisible({ timeout: 15000 })
    await generateButton.click()
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[name="jobTitle"], input[placeholder*="Job Title"]', 'Senior Software Engineer')
    await page.fill('input[name="companyName"], input[placeholder*="Company"]', 'Tech Corp')
    await page.fill('textarea[name="jobDescription"], textarea[placeholder*="job description"]', 'Looking for an experienced software engineer with React and TypeScript skills.')
    
    const submitButton = page.locator('button:has-text("Generate"), button:has-text("Tailor CV")').first()
    await expect(submitButton).toBeVisible({ timeout: 10000 })
    await submitButton.click()

    // Wait for AI generation with longer timeout
    await expect(page.locator('text=Generation complete, text=successfully generated, text=Review').first()).toBeVisible({ timeout: 45000 })

    // Step 4: Review generated CV
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=ATS Score, text=Score').first()).toBeVisible({ timeout: 10000 })
    
    // Try to get ATS score if available
    const atsScoreElement = page.locator('[data-testid="ats-score"], text=/\d+%/, text=/Score.*\d+/').first()
    if (await atsScoreElement.isVisible({ timeout: 5000 }).catch(() => false)) {
      const atsScore = await atsScoreElement.textContent()
      const scoreMatch = atsScore?.match(/\d+/)
      if (scoreMatch) {
        expect(parseInt(scoreMatch[0])).toBeGreaterThan(0)
      }
    }

    // Step 5: Download CV
    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")').first()
    await expect(downloadButton).toBeVisible({ timeout: 15000 })
    await downloadButton.click()
    await page.waitForLoadState('networkidle')
    
    // Select template if available
    const templateButton = page.locator('button:has-text("Modern"), button:has-text("Template")').first()
    if (await templateButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await templateButton.click()
    }
    
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download PDF"), button:has-text("PDF")').first()
    await expect(exportButton).toBeVisible({ timeout: 10000 })
    await exportButton.click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i)
  })

  test('should handle file upload errors gracefully', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Navigate to upload page
    await page.click('text=Upload CV, text=Upload', { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    // Try to upload invalid file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Invalid file type')
    })

    // Should show error message
    await expect(page.locator('text=Invalid file type, text=not a valid type, text=PDF, DOC').first()).toBeVisible({ timeout: 10000 })
  })

  test('should show usage limits for free users', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Check usage tracking is visible
    await expect(page.locator('text=Monthly Usage, text=Usage, text=generations').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="usage-count"], text=/\d+\/\d+/, text=/\d+ of \d+/').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Subscription Flow', () => {
  test('should allow user to upgrade to Pro', async ({ page }) => {
    await page.goto('/subscription')
    await page.waitForLoadState('networkidle')

    // Click upgrade button
    const upgradeButton = page.locator('button:has-text("Upgrade"), button:has-text("Pro"), a:has-text("Upgrade")').first()
    await expect(upgradeButton).toBeVisible({ timeout: 10000 })
    await upgradeButton.click()

    // Should redirect to Stripe checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 15000 })
  })

  test('should show correct pricing', async ({ page }) => {
    await page.goto('/')

    // Check monthly pricing
    await expect(page.locator('text=£2.99')).toBeVisible()
    await expect(page.locator('text=/month/')).toBeVisible()

    // Check annual pricing
    await expect(page.locator('text=£14.99')).toBeVisible()
    await expect(page.locator('text=/year/')).toBeVisible()
  })
})

test.describe('Cover Letter Generation', () => {
  test('should generate cover letter from CV', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Navigate to cover letter generator
    const coverLetterButton = page.locator('text=Cover Letter, a:has-text("Cover Letter")').first()
    await expect(coverLetterButton).toBeVisible({ timeout: 10000 })
    await coverLetterButton.click()
    await page.waitForLoadState('networkidle')

    // Fill in details
    await page.fill('input[name="jobTitle"], input[placeholder*="Job Title"]', 'Software Engineer')
    await page.fill('input[name="companyName"], input[placeholder*="Company"]', 'Tech Corp')
    await page.fill('textarea[name="jobDescription"], textarea[placeholder*="description"]', 'We are looking for a talented software engineer.')

    // Generate
    const generateButton = page.locator('button:has-text("Generate")').first()
    await expect(generateButton).toBeVisible({ timeout: 10000 })
    await generateButton.click()

    // Wait for generation with longer timeout
    await expect(page.locator('text=generated, text=success, text=complete').first()).toBeVisible({ timeout: 45000 })

    // Should show preview
    await expect(page.locator('[data-testid="cover-letter-preview"], [class*="preview"], text=Dear').first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()

    // Should be able to activate with Enter
    await page.keyboard.press('Enter')
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')

    // Check for ARIA labels on buttons
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      
      // Should have either aria-label or text content
      expect(ariaLabel || text).toBeTruthy()
    }
  })
})

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/')

    // Check mobile menu
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

    // Check content is readable
    const fontSize = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).fontSize
    )
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14)
  })
})
