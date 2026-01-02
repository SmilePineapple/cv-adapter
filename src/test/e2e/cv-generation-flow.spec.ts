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
    await page.click('text=Upload CV')
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Mock PDF content')
    })

    // Wait for upload to complete
    await expect(page.locator('text=Upload successful')).toBeVisible({ timeout: 10000 })

    // Step 3: Generate CV
    await page.click('text=Generate CV')
    await page.fill('input[name="jobTitle"]', 'Senior Software Engineer')
    await page.fill('input[name="companyName"]', 'Tech Corp')
    await page.fill('textarea[name="jobDescription"]', 'Looking for an experienced software engineer with React and TypeScript skills.')
    await page.click('button:has-text("Generate")')

    // Wait for AI generation
    await expect(page.locator('text=Generation complete')).toBeVisible({ timeout: 30000 })

    // Step 4: Review generated CV
    await expect(page.locator('text=ATS Score')).toBeVisible()
    const atsScore = await page.locator('[data-testid="ats-score"]').textContent()
    expect(parseInt(atsScore || '0')).toBeGreaterThan(0)

    // Step 5: Download CV
    await page.click('text=Download')
    await page.click('text=Modern Template')
    
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export as PDF")')
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain('.pdf')
  })

  test('should handle file upload errors gracefully', async ({ page }) => {
    await page.goto('/dashboard')

    // Try to upload invalid file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Invalid file type')
    })

    // Should show error message
    await expect(page.locator('text=Invalid file type')).toBeVisible({ timeout: 5000 })
  })

  test('should show usage limits for free users', async ({ page }) => {
    await page.goto('/dashboard')

    // Check usage tracking is visible
    await expect(page.locator('text=Monthly Usage')).toBeVisible()
    await expect(page.locator('[data-testid="usage-count"]')).toBeVisible()
  })
})

test.describe('Subscription Flow', () => {
  test('should allow user to upgrade to Pro', async ({ page }) => {
    await page.goto('/subscription')

    // Click upgrade button
    await page.click('text=Upgrade to Pro')

    // Should redirect to Stripe checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 10000 })
  })

  test('should show correct pricing', async ({ page }) => {
    await page.goto('/')

    // Check monthly pricing
    await expect(page.locator('text=£2.99')).toBeVisible()
    await expect(page.locator('text=/month/')).toBeVisible()

    // Check annual pricing
    await expect(page.locator('text=£29.99')).toBeVisible()
    await expect(page.locator('text=/year/')).toBeVisible()
  })
})

test.describe('Cover Letter Generation', () => {
  test('should generate cover letter from CV', async ({ page }) => {
    await page.goto('/dashboard')

    // Navigate to cover letter generator
    await page.click('text=Create Cover Letter')

    // Fill in details
    await page.fill('input[name="jobTitle"]', 'Software Engineer')
    await page.fill('input[name="companyName"]', 'Tech Corp')
    await page.fill('textarea[name="jobDescription"]', 'We are looking for a talented software engineer.')

    // Generate
    await page.click('button:has-text("Generate Cover Letter")')

    // Wait for generation
    await expect(page.locator('text=Cover letter generated')).toBeVisible({ timeout: 30000 })

    // Should show preview
    await expect(page.locator('[data-testid="cover-letter-preview"]')).toBeVisible()
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
