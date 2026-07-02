import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Automated CV Generation Test Suite
 *
 * Tests the white space solution by generating CVs with 1, 2, 3, and 4 pages
 * for different job roles using Jake's real CV.
 *
 * Requires TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD env vars to be set.
 */

const LOGIN_EMAIL = process.env.TEST_LOGIN_EMAIL || ''
const LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD || ''
const BASE_URL = 'http://localhost:3000' // Adjust if different

// Test job roles to apply for
const TEST_JOBS = [
  {
    title: 'Junior Software Developer',
    description: 'Entry-level position for a software developer with 1-2 years experience',
    expectedPages: 1,
    tone: 'professional'
  },
  {
    title: 'Full Stack Developer',
    description: 'Mid-level full stack developer role requiring React, Node.js, and database experience',
    expectedPages: 2,
    tone: 'professional'
  },
  {
    title: 'Senior Software Engineer',
    description: 'Senior engineering position leading technical projects and mentoring junior developers',
    expectedPages: 3,
    tone: 'professional'
  },
  {
    title: 'Engineering Manager',
    description: 'Engineering management role overseeing multiple teams, technical strategy, and product delivery',
    expectedPages: 4,
    tone: 'professional'
  }
]

// Results directory
const RESULTS_DIR = path.join(__dirname, '../test-results/cv-generation')

test.describe('Automated CV Generation Tests', () => {
  test.beforeAll(async () => {
    // Create results directory
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true })
    }
  })

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
  })

  for (const job of TEST_JOBS) {
    test(`Generate ${job.expectedPages}-page CV for ${job.title}`, async ({ page, context }) => {
      console.log(`\n🎯 Testing: ${job.title} (${job.expectedPages} pages)`)

      // Navigate to CV list
      await page.goto(`${BASE_URL}/dashboard`)
      await page.waitForLoadState('networkidle')

      // Get the first CV (Jake's CV)
      const firstCV = page.locator('[data-testid="cv-card"]').first()
      const cvExists = await firstCV.isVisible().catch(() => false)

      let cvId: string

      if (!cvExists) {
        console.log('📝 No CV found, need to upload one first')
        // You'll need to upload a CV manually first, or add upload logic here
        throw new Error('No CV found. Please upload a CV first.')
      }

      // Click on the CV to go to generate page
      await firstCV.click()
      await page.waitForLoadState('networkidle')

      // Extract CV ID from URL
      const url = page.url()
      const match = url.match(/\/generate\/([a-f0-9]+)/)
      if (!match) {
        throw new Error('Could not extract CV ID from URL')
      }
      cvId = match[1]

      console.log(`📋 Using CV ID: ${cvId}`)

      // Fill in job details
      console.log(`💼 Filling job details...`)
      
      // Job title
      const jobTitleInput = page.locator('input[name="jobTitle"], input[placeholder*="Job Title" i]').first()
      await jobTitleInput.fill(job.title)

      // Job description
      const jobDescInput = page.locator('textarea[name="jobDescription"], textarea[placeholder*="description" i]').first()
      await jobDescInput.fill(job.description)

      // Select page count
      console.log(`📄 Selecting ${job.expectedPages} page(s)...`)
      const pageCountSelector = page.locator(`button:has-text("${job.expectedPages} Page"), label:has-text("${job.expectedPages} Page")`).first()
      await pageCountSelector.click()

      // Wait a bit for capacity analysis to update
      await page.waitForTimeout(1000)

      // Check for warnings
      const warningExists = await page.locator('[data-testid="page-count-warning"], .bg-yellow-500').isVisible().catch(() => false)
      if (warningExists) {
        const warningText = await page.locator('[data-testid="page-count-warning"], .bg-yellow-500').first().textContent()
        console.log(`⚠️  Warning shown: ${warningText?.substring(0, 100)}...`)
      } else {
        console.log(`✅ No warnings - page count is appropriate`)
      }

      // Generate CV
      console.log(`🚀 Generating CV...`)
      const generateButton = page.locator('button:has-text("Generate"), button:has-text("Rewrite")').first()
      await generateButton.click()

      // Wait for generation to complete (max 60 seconds)
      console.log(`⏳ Waiting for generation...`)
      await page.waitForURL(/\/download\//, { timeout: 60000 })
      
      const generationId = page.url().match(/\/download\/([a-f0-9]+)/)?.[1]
      console.log(`✅ Generation complete! ID: ${generationId}`)

      // Wait for preview to load
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      // Take screenshot of preview
      const previewScreenshot = path.join(RESULTS_DIR, `${job.expectedPages}page-${job.title.replace(/\s+/g, '-')}-preview.png`)
      await page.screenshot({ path: previewScreenshot, fullPage: true })
      console.log(`📸 Preview screenshot: ${previewScreenshot}`)

      // Download PDF
      console.log(`📥 Downloading PDF...`)
      
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
      
      // Click export button
      const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first()
      await exportButton.click()

      // Wait for download
      const download = await downloadPromise
      const downloadPath = path.join(RESULTS_DIR, `${job.expectedPages}page-${job.title.replace(/\s+/g, '-')}.pdf`)
      await download.saveAs(downloadPath)
      console.log(`✅ PDF saved: ${downloadPath}`)

      // Analyze the PDF (basic file size check)
      const stats = fs.statSync(downloadPath)
      console.log(`📊 PDF size: ${(stats.size / 1024).toFixed(2)} KB`)

      // Record results
      const result = {
        jobTitle: job.title,
        expectedPages: job.expectedPages,
        cvId,
        generationId,
        timestamp: new Date().toISOString(),
        pdfPath: downloadPath,
        pdfSizeKB: (stats.size / 1024).toFixed(2),
        warningShown: warningExists,
        previewScreenshot
      }

      // Save result to JSON
      const resultPath = path.join(RESULTS_DIR, `${job.expectedPages}page-${job.title.replace(/\s+/g, '-')}-result.json`)
      fs.writeFileSync(resultPath, JSON.stringify(result, null, 2))
      console.log(`💾 Result saved: ${resultPath}`)

      console.log(`✅ Test complete for ${job.title}\n`)
    })
  }

  test('Summary: Analyze all generated CVs', async ({ page }) => {
    console.log('\n📊 GENERATING SUMMARY REPORT...\n')

    // Read all result files
    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('-result.json'))
    const results = files.map(f => JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), 'utf-8')))

    // Generate summary
    const summary = {
      totalTests: results.length,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        jobTitle: r.jobTitle,
        expectedPages: r.expectedPages,
        pdfSizeKB: r.pdfSizeKB,
        warningShown: r.warningShown,
        pdfPath: r.pdfPath
      }))
    }

    // Save summary
    const summaryPath = path.join(RESULTS_DIR, 'summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

    // Print summary
    console.log('═══════════════════════════════════════════════════════')
    console.log('                   TEST SUMMARY                        ')
    console.log('═══════════════════════════════════════════════════════')
    console.log(`Total tests: ${summary.totalTests}`)
    console.log(`Results directory: ${RESULTS_DIR}`)
    console.log('')
    console.log('Generated CVs:')
    summary.results.forEach(r => {
      console.log(`  • ${r.expectedPages}-page: ${r.jobTitle}`)
      console.log(`    - PDF: ${r.pdfPath}`)
      console.log(`    - Size: ${r.pdfSizeKB} KB`)
      console.log(`    - Warning: ${r.warningShown ? 'Yes' : 'No'}`)
      console.log('')
    })
    console.log('═══════════════════════════════════════════════════════')
    console.log(`\n✅ Summary saved: ${summaryPath}\n`)
  })
})

/**
 * Helper function to login
 */
async function login(page: Page) {
  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
    throw new Error('Set TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD env vars before running this suite.')
  }
  await page.goto(`${BASE_URL}/login`)

  // Fill in email
  const emailInput = page.locator('input[type="email"], input[name="email"]').first()
  await emailInput.fill(LOGIN_EMAIL)
  
  // Fill in password
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first()
  await passwordInput.fill(LOGIN_PASSWORD)
  
  // Click login button
  const loginButton = page.locator('button:has-text("Sign in"), button:has-text("Log in"), button[type="submit"]').first()
  await loginButton.click()
  
  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|cvs)/, { timeout: 10000 })
  
  console.log('✅ Logged in successfully')
}
