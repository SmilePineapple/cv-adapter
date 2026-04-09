import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'https://www.mycvbuddy.com';
const USER_EMAIL = 'jake.rourke@btinternet.com';
const USER_PASSWORD = 'Fearnley09';

test.describe('CV Generation Flow - Visual Test', () => {
  test('Full user journey with screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('🚀 Starting visual flow test...\n');
    
    // 1. Homepage
    console.log('📸 Step 1: Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/01-homepage.png', fullPage: true });
    console.log('✅ Homepage screenshot saved\n');
    
    // 2. Navigate to Login
    console.log('📸 Step 2: Navigating to login...');
    const loginLink = page.locator('a[href="/auth/login"]').first();
    await loginLink.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/02-login-page.png', fullPage: true });
    console.log('✅ Login page screenshot saved\n');
    
    // 3. Fill login form
    console.log('📸 Step 3: Filling login form...');
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    await page.screenshot({ path: 'screenshots/03-login-filled.png' });
    console.log('✅ Login form filled\n');
    
    // 4. Submit login
    console.log('📸 Step 4: Submitting login...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'screenshots/04-after-login.png', fullPage: true });
    console.log('✅ Post-login screenshot saved\n');
    
    const url = page.url();
    console.log(`Current URL: ${url}\n`);
    
    // 5. Navigate to upload if on dashboard
    if (url.includes('dashboard')) {
      console.log('📸 Step 5: On dashboard - navigating to upload...');
      await page.goto(`${BASE_URL}/upload`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
    }
    
    // 6. Upload page
    if (page.url().includes('upload')) {
      console.log('📸 Step 6: On upload page...');
      await page.screenshot({ path: 'screenshots/05-upload-page.png', fullPage: true });
      
      // Check if there's already a file input or uploaded CVs
      const fileInput = page.locator('input[type="file"]').first();
      const hasFileInput = await fileInput.isVisible().catch(() => false);
      
      if (hasFileInput) {
        console.log('📤 Uploading CV file...');
        const cvPath = path.resolve('CV_Spa_Therapist_creative_modern (4).pdf');
        await fileInput.setInputFiles(cvPath);
        await page.waitForTimeout(15000); // Wait for upload + processing
        await page.screenshot({ path: 'screenshots/06-upload-complete.png', fullPage: true });
        console.log('✅ Upload complete screenshot saved\n');
      } else {
        console.log('ℹ️ No file input found - may have existing CVs\n');
      }
      
      // Click continue if available
      const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next")').first();
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // 7. Generation page
    if (page.url().includes('generate') || await page.locator('text=Job Title').first().isVisible().catch(() => false)) {
      console.log('📸 Step 7: On generation page...');
      await page.screenshot({ path: 'screenshots/07-generation-page.png', fullPage: true });
      
      // Fill job details
      await page.fill('input[placeholder*="job title" i]', 'Senior Software Engineer');
      await page.fill('textarea[placeholder*="description" i]', 'We are looking for a Senior Software Engineer with 5+ years of experience in Python, React, and cloud technologies. The ideal candidate will have experience with microservices, CI/CD pipelines, and leading development teams.');
      await page.screenshot({ path: 'screenshots/08-job-details-filled.png' });
      console.log('✅ Job details filled\n');
      
      // Click generate
      const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Adapt")').first();
      if (await generateBtn.isVisible().catch(() => false)) {
        console.log('🔄 Clicking generate...');
        await generateBtn.click();
        await page.waitForTimeout(10000);
        await page.screenshot({ path: 'screenshots/09-generating.png', fullPage: true });
        await page.waitForTimeout(15000);
      }
    }
    
    // 8. Results/Review page
    console.log('📸 Step 8: Results page...');
    await page.screenshot({ path: 'screenshots/10-results-page.png', fullPage: true });
    console.log('✅ Results screenshot saved\n');
    
    // 9. Check for edit/download buttons
    const editBtn = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    const downloadBtn = page.locator('button:has-text("Download"), a:has-text("Download"), button:has-text("Export")').first();
    
    console.log('🔍 UI Elements Check:');
    console.log(`   Edit button visible: ${await editBtn.isVisible().catch(() => false)}`);
    console.log(`   Download button visible: ${await downloadBtn.isVisible().catch(() => false)}\n`);
    
    // 10. Navigate to dashboard
    console.log('📸 Step 9: Final dashboard view...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/11-final-dashboard.png', fullPage: true });
    console.log('✅ Final dashboard screenshot saved\n');
    
    console.log('🎉 Visual flow test complete!');
    console.log('📸 All screenshots saved in ./screenshots/');
  });
  
  test('Quick visual check of key pages', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Check homepage visual elements
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Check for broken images
    const images = await page.locator('img').all();
    let brokenImages = 0;
    for (const img of images) {
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth).catch(() => 0);
      if (naturalWidth === 0) {
        brokenImages++;
        const src = await img.getAttribute('src');
        console.log(`⚠️ Broken image: ${src}`);
      }
    }
    
    // Check for buttons without text
    const buttons = await page.locator('button').all();
    let emptyButtons = 0;
    for (const btn of buttons) {
      const text = await btn.textContent();
      const isVisible = await btn.isVisible().catch(() => false);
      if (isVisible && (!text || text.trim() === '')) {
        emptyButtons++;
      }
    }
    
    // Check for horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    console.log('\n📊 Visual Check Results:');
    console.log(`   Images: ${images.length} total, ${brokenImages} broken`);
    console.log(`   Buttons: ${buttons.length} total, ${emptyButtons} without text`);
    console.log(`   Horizontal overflow: ${hasOverflow ? 'YES ⚠️' : 'No ✅'}\n`);
    
    await page.screenshot({ path: 'screenshots/ui-quick-check.png', fullPage: true });
  });
});
