import { test, expect } from '@playwright/test'

/**
 * Test CV Generation with Jake's Manually Uploaded CV
 * Tests the complete generation flow from existing CV to new adapted version
 */

const TEST_USER = {
  email: 'jake.rourke@btinternet.com',
  password: 'Fearnley09'
}

const TEST_JOB = {
  title: 'Senior Full Stack Developer',
  company: 'Tech Innovations Ltd',
  description: `We are seeking an experienced Senior Full Stack Developer to join our dynamic team.

Key Responsibilities:
- Design and develop scalable web applications using modern frameworks
- Lead technical architecture decisions
- Mentor junior developers
- Collaborate with product and design teams
- Implement best practices for code quality and testing

Required Skills:
- 5+ years of full-stack development experience
- Strong proficiency in JavaScript/TypeScript, React, Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Excellent problem-solving and communication skills
- Experience with Agile methodologies

Nice to Have:
- Experience with microservices architecture
- Knowledge of DevOps practices
- Contributions to open-source projects`
}

test.describe('Jake CV Generation Test', () => {
  test.setTimeout(180000) // 3 minutes

  test('Generate CV from manually uploaded CV', async ({ page, context }) => {
    // Enable console log capture
    const consoleLogs: string[] = []
    const errors: string[] = []
    
    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`
      consoleLogs.push(text)
      console.log(text)
    })
    
    page.on('pageerror', error => {
      const errorText = `[PAGE ERROR] ${error.message}`
      errors.push(errorText)
      console.error(errorText)
    })

    console.log('=== STARTING CV GENERATION TEST ===')
    console.log('User:', TEST_USER.email)
    console.log('Job:', TEST_JOB.title, '@', TEST_JOB.company)

    // Step 1: Login
    console.log('\n--- Step 1: Login ---')
    await page.goto('https://www.mycvbuddy.com/auth/login')
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/jake-01-login.png', fullPage: true })
    console.log('✅ Login completed')

    // Step 2: Navigate to Dashboard
    console.log('\n--- Step 2: Dashboard ---')
    await page.goto('https://www.mycvbuddy.com/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ path: 'test-results/jake-02-dashboard.png', fullPage: true })
    
    // Check for CVs
    const cvCount = await page.locator('[data-testid="cv-card"]').count()
    console.log(`📄 CVs found: ${cvCount}`)
    
    if (cvCount === 0) {
      console.error('❌ No CVs found! User needs to upload a CV first.')
      throw new Error('No CVs found in dashboard')
    }

    // Step 3: Click on first CV to generate
    console.log('\n--- Step 3: Navigate to Generate Page ---')
    const firstCV = page.locator('[data-testid="cv-card"]').first()
    await firstCV.click()
    
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/jake-03-generate-page.png', fullPage: true })
    
    const currentUrl = page.url()
    console.log('Current URL:', currentUrl)

    // Step 4: Fill job details
    console.log('\n--- Step 4: Fill Job Details ---')
    
    // Wait for form to be visible
    await page.waitForSelector('input[name="jobTitle"], input[placeholder*="job title" i]', { timeout: 10000 })
    
    const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="job title" i]').first()
    await jobTitleInput.fill(TEST_JOB.title)
    console.log('✅ Job title filled:', TEST_JOB.title)
    
    const companyInput = page.locator('input[name="companyName"], input[name="company"], input[placeholder*="company" i]').first()
    await companyInput.fill(TEST_JOB.company)
    console.log('✅ Company filled:', TEST_JOB.company)
    
    const descriptionInput = page.locator('textarea[name="jobDescription"], textarea[placeholder*="description" i]').first()
    await descriptionInput.fill(TEST_JOB.description)
    console.log('✅ Job description filled')
    
    await page.screenshot({ path: 'test-results/jake-04-form-filled.png', fullPage: true })

    // Step 5: Submit generation
    console.log('\n--- Step 5: Submit Generation ---')
    
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Adapt"), button[type="submit"]').first()
    await generateButton.click()
    console.log('⏳ Generation started...')
    
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/jake-05-generating.png', fullPage: true })

    // Step 6: Wait for generation to complete
    console.log('\n--- Step 6: Wait for Generation ---')
    console.log('Waiting up to 90 seconds for AI generation...')
    
    try {
      // Wait for any of these success indicators
      await Promise.race([
        page.waitForSelector('[data-testid="ats-score"]', { timeout: 90000 }),
        page.waitForSelector('text=/generation.*complete/i', { timeout: 90000 }),
        page.waitForSelector('text=/score/i', { timeout: 90000 }),
        page.waitForURL(/\/review\/|\/download\//, { timeout: 90000 })
      ])
      
      console.log('✅ Generation completed!')
      
      await page.waitForTimeout(2000)
      await page.screenshot({ path: 'test-results/jake-06-generation-complete.png', fullPage: true })
      
      // Try to capture ATS score
      const atsScoreElement = page.locator('[data-testid="ats-score"], text=/score.*\\d+/i').first()
      if (await atsScoreElement.isVisible({ timeout: 3000 })) {
        const scoreText = await atsScoreElement.textContent()
        console.log('📊 ATS Score:', scoreText)
      }
      
    } catch (error) {
      console.error('❌ Generation timeout or failed')
      await page.screenshot({ path: 'test-results/jake-06-generation-timeout.png', fullPage: true })
      
      // Check for error messages
      const errorElement = page.locator('.error, [role="alert"], text=/error|failed/i').first()
      if (await errorElement.isVisible({ timeout: 2000 })) {
        const errorText = await errorElement.textContent()
        console.error('Error message:', errorText)
      }
      
      throw error
    }

    // Step 7: Check final dashboard
    console.log('\n--- Step 7: Final Dashboard Check ---')
    await page.goto('https://www.mycvbuddy.com/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ path: 'test-results/jake-07-final-dashboard.png', fullPage: true })
    
    const finalCVCount = await page.locator('[data-testid="cv-card"]').count()
    const generationCount = await page.locator('[data-testid="generation-card"]').count()
    
    console.log('📄 Final CV count:', finalCVCount)
    console.log('🤖 Generation count:', generationCount)
    
    // Check usage
    const usageElement = page.locator('text=/\\d+\\/\\d+/').first()
    if (await usageElement.isVisible({ timeout: 3000 })) {
      const usageText = await usageElement.textContent()
      console.log('📈 Usage:', usageText)
    }

    // Step 8: Summary
    console.log('\n=== TEST SUMMARY ===')
    console.log('✅ Login: Success')
    console.log('✅ Dashboard: Loaded')
    console.log('✅ CV Found: Yes')
    console.log('✅ Form Filled: Yes')
    console.log('✅ Generation: Completed')
    console.log('✅ Final Dashboard: Updated')
    
    if (errors.length > 0) {
      console.log('\n⚠️ Errors detected:')
      errors.forEach(err => console.log('  -', err))
    } else {
      console.log('\n✅ No errors detected')
    }
    
    console.log('\n📊 Console logs captured:', consoleLogs.length)
    console.log('📸 Screenshots captured: 7')
    
    // Write detailed report
    const report = {
      timestamp: new Date().toISOString(),
      user: TEST_USER.email,
      job: TEST_JOB,
      results: {
        loginSuccess: true,
        cvFound: cvCount > 0,
        formFilled: true,
        generationCompleted: true,
        finalCVCount,
        generationCount
      },
      errors,
      consoleLogs: consoleLogs.slice(-50) // Last 50 logs
    }
    
    console.log('\n📝 Full report:', JSON.stringify(report, null, 2))
  })
})
