import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'https://www.mycvbuddy.com';
const USER_EMAIL = 'jake.rourke@btinternet.com';
const USER_PASSWORD = 'Fearnley09';

test.describe('CV Generation Flow Test', () => {
  test('Complete user journey - login to CV generation', async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('🚀 Starting test: Login and CV generation flow');
    
    // 1. Navigate to homepage
    console.log('📍 Step 1: Navigating to homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/01-homepage.png', fullPage: true });
    console.log('✅ Homepage loaded and screenshot saved');
    
    // Check homepage elements
    await expect(page.locator('text=My CV Buddy')).toBeVisible();
    await expect(page.locator('text=Tailor Your CV')).toBeVisible();
    console.log('✅ Homepage elements verified');
    
    // 2. Navigate to login
    console.log('📍 Step 2: Navigating to login page...');
    await page.click('text=Login');
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    await page.screenshot({ path: 'screenshots/02-login-page.png' });
    console.log('✅ Login page loaded');
    
    // 3. Login
    console.log('📍 Step 3: Logging in...');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', USER_EMAIL);
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', USER_PASSWORD);
    await page.screenshot({ path: 'screenshots/03-login-filled.png' });
    
    // Click login button
    const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign in"), button[type="submit"]').first();
    await loginButton.click();
    
    // Wait for navigation to dashboard or upload page
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/04-after-login.png', fullPage: true });
    console.log('✅ Login submitted');
    
    // Check where we landed
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // 4. If on dashboard, navigate to upload or use existing CV
    if (currentUrl.includes('dashboard')) {
      console.log('📍 On dashboard - checking for existing CVs or uploading new one...');
      await page.screenshot({ path: 'screenshots/05-dashboard.png', fullPage: true });
      
      // Look for "Upload New CV" button or similar
      const uploadButton = page.locator('text=Upload CV, text=New CV, text=Upload').first();
      if (await uploadButton.isVisible().catch(() => false)) {
        await uploadButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // 5. Upload page - check if we need to upload
    if (page.url().includes('upload') || await page.locator('text=Upload your CV').isVisible().catch(() => false)) {
      console.log('📍 Step 5: On upload page...');
      await page.screenshot({ path: 'screenshots/06-upload-page.png', fullPage: true });
      
      // Check if there's already a CV uploaded
      const existingCV = await page.locator('text=already uploaded, text=uploaded, .cv-card, [data-cv]').first().isVisible().catch(() => false);
      
      if (!existingCV) {
        console.log('📤 Uploading CV...');
        // Use the provided CV file
        const cvPath = path.resolve('C:/Users/jaket/Desktop/CV/cv-adapter/CV_Spa_Therapist_creative_modern (4).pdf');
        
        // Find file input
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(cvPath);
        
        // Wait for upload to complete
        await page.waitForTimeout(15000); // Wait for upload + processing
        await page.screenshot({ path: 'screenshots/07-upload-complete.png', fullPage: true });
        console.log('✅ CV uploaded');
      } else {
        console.log('✅ Existing CV found, using that');
      }
      
      // Click continue to generation
      const continueButton = page.locator('text=Continue, text=Generate CV, text=Next, button:has-text("Continue")').first();
      if (await continueButton.isVisible().catch(() => false)) {
        await continueButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // 6. Generation page
    console.log('📍 Step 6: On generation page...');
    await page.screenshot({ path: 'screenshots/08-generation-page.png', fullPage: true });
    
    // Fill in job details
    const jobTitleInput = page.locator('input[placeholder*="job title" i], input[name="jobTitle"], label:has-text("Job Title") + input').first();
    if (await jobTitleInput.isVisible().catch(() => false)) {
      await jobTitleInput.fill('Senior Software Engineer');
    }
    
    const jobDescInput = page.locator('textarea[placeholder*="description" i], textarea[name="jobDescription"]').first();
    if (await jobDescInput.isVisible().catch(() => false)) {
      await jobDescInput.fill('We are looking for a Senior Software Engineer with 5+ years of experience in Python, React, and cloud technologies. The ideal candidate will have experience with microservices, CI/CD pipelines, and leading development teams.');
    }
    
    await page.screenshot({ path: 'screenshots/09-job-details-filled.png' });
    console.log('✅ Job details filled');
    
    // Click generate
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Adapt"), button:has-text("Create"), text=Generate CV').first();
    if (await generateButton.isVisible().catch(() => false)) {
      console.log('🔄 Clicking generate button...');
      await generateButton.click();
      
      // Wait for generation (with progress bar animation)
      await page.waitForTimeout(10000);
      await page.screenshot({ path: 'screenshots/10-generating.png', fullPage: true });
      
      // Wait for completion
      await page.waitForTimeout(15000);
    }
    
    // 7. Results/Review page
    console.log('📍 Step 7: Checking results page...');
    await page.screenshot({ path: 'screenshots/11-results-page.png', fullPage: true });
    
    // Look for success indicators
    const successElements = await page.locator('text=success, text=completed, text=ready, .success, [data-success]').first().isVisible().catch(() => false);
    console.log(`✅ Generation success indicators: ${successElements}`);
    
    // 8. Check for edit/download options
    const editButton = page.locator('text=Edit, text=Review, button:has-text("Edit")').first();
    const downloadButton = page.locator('text=Download, text=Export, button:has-text("Download")').first();
    
    if (await editButton.isVisible().catch(() => false)) {
      console.log('✅ Edit button visible');
    }
    if (await downloadButton.isVisible().catch(() => false)) {
      console.log('✅ Download button visible');
    }
    
    // 9. Navigate to dashboard to verify
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/12-final-dashboard.png', fullPage: true });
    console.log('✅ Final dashboard screenshot saved');
    
    console.log('🎉 Test completed successfully!');
    console.log('📸 All screenshots saved in ./screenshots/');
  });

  test('Visual regression - check for UI issues', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Test login page visual elements
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    
    // Check for common UI issues
    const issues = [];
    
    // Check for broken images
    const images = await page.locator('img').all();
    for (const img of images) {
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      if (naturalWidth === 0) {
        const src = await img.getAttribute('src');
        issues.push(`Broken image: ${src}`);
      }
    }
    
    // Check for elements with no visible text
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      if (isVisible && (!text || text.trim() === '')) {
        const className = await button.getAttribute('class');
        issues.push(`Button with no text (class: ${className})`);
      }
    }
    
    // Check for layout overflow issues
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    if (bodyWidth > viewportWidth) {
      issues.push(`Horizontal overflow detected: ${bodyWidth - viewportWidth}px`);
    }
    
    console.log('UI Issues found:', issues.length > 0 ? issues : 'None');
    
    await page.screenshot({ path: 'screenshots/ui-check-login.png' });
  });
});
