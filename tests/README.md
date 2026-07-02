# Automated CV Generation Tests

## Overview

This test suite automatically generates CVs with 1, 2, 3, and 4 pages for different job roles using Jake's real CV, then downloads and analyzes the results.

## Setup

### 1. Install Dependencies

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Configure Playwright

Create `playwright.config.ts` in the project root if it doesn't exist:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run one test at a time
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

## Running the Tests

### 1. Start Development Server

```bash
npm run dev
```

### 2. Run Tests

In a separate terminal:

```bash
# Run all CV generation tests
npx playwright test automated-cv-generation.spec.ts

# Run with UI (see what's happening)
npx playwright test automated-cv-generation.spec.ts --ui

# Run in headed mode (see browser)
npx playwright test automated-cv-generation.spec.ts --headed

# Run specific test
npx playwright test automated-cv-generation.spec.ts -g "Generate 2-page"
```

## What the Tests Do

### Test Flow

For each job role (1, 2, 3, 4 pages):

1. **Login** with Jake's credentials
2. **Navigate** to CV list
3. **Select** Jake's CV
4. **Fill in** job details:
   - Job title
   - Job description
5. **Select** target page count (1, 2, 3, or 4)
6. **Check** for warnings
7. **Generate** CV
8. **Wait** for completion
9. **Screenshot** preview
10. **Download** PDF
11. **Save** results

### Test Jobs

1. **Junior Software Developer** (1 page)
   - Entry-level position
   - Should recommend 1 page
   - No warnings expected

2. **Full Stack Developer** (2 pages)
   - Mid-level position
   - Should recommend 2 pages
   - No warnings expected

3. **Senior Software Engineer** (3 pages)
   - Senior position
   - Should recommend 3 pages
   - No warnings expected

4. **Engineering Manager** (4 pages)
   - Management position
   - Should recommend 4 pages
   - May show warning if CV is too junior

## Results

### Output Directory

```
tests/test-results/cv-generation/
├── 1page-Junior-Software-Developer.pdf
├── 1page-Junior-Software-Developer-preview.png
├── 1page-Junior-Software-Developer-result.json
├── 2page-Full-Stack-Developer.pdf
├── 2page-Full-Stack-Developer-preview.png
├── 2page-Full-Stack-Developer-result.json
├── 3page-Senior-Software-Engineer.pdf
├── 3page-Senior-Software-Engineer-preview.png
├── 3page-Senior-Software-Engineer-result.json
├── 4page-Engineering-Manager.pdf
├── 4page-Engineering-Manager-preview.png
├── 4page-Engineering-Manager-result.json
└── summary.json
```

### Result JSON Format

```json
{
  "jobTitle": "Full Stack Developer",
  "expectedPages": 2,
  "cvId": "abc123...",
  "generationId": "xyz789...",
  "timestamp": "2026-06-30T12:30:00.000Z",
  "pdfPath": "/path/to/2page-Full-Stack-Developer.pdf",
  "pdfSizeKB": "245.67",
  "warningShown": false,
  "previewScreenshot": "/path/to/preview.png"
}
```

### Summary Report

The final test generates `summary.json` with all results:

```json
{
  "totalTests": 4,
  "timestamp": "2026-06-30T12:35:00.000Z",
  "results": [
    {
      "jobTitle": "Junior Software Developer",
      "expectedPages": 1,
      "pdfSizeKB": "180.45",
      "warningShown": false,
      "pdfPath": "..."
    },
    // ... more results
  ]
}
```

## Manual Analysis

After running tests, manually check each PDF:

### 1. Visual Inspection

Open each PDF and check:
- ✅ Page fill (85-92%?)
- ✅ No white space at bottom
- ✅ Professional appearance
- ✅ No content clipping
- ✅ Consistent spacing

### 2. Measurement

Use ruler or screenshot method:
- Measure filled height
- Calculate: `occupancy = (filled_height / page_height) × 100`
- Target: 85-92%

### 3. Record Results

Update the spreadsheet from Phase 6 testing guide:

| CV | Pages | Page 1 Fill | Page 2 Fill | Page 3 Fill | Page 4 Fill | Pass/Fail |
|----|-------|-------------|-------------|-------------|-------------|-----------|
| Jake | 1 | 88% | - | - | - | ✅ PASS |
| Jake | 2 | 87% | 90% | - | - | ✅ PASS |
| Jake | 3 | 89% | 91% | 86% | - | ✅ PASS |
| Jake | 4 | 88% | 90% | 89% | 87% | ✅ PASS |

## Troubleshooting

### Test Fails to Login

- Check credentials in `phase-6-testing-guide.md`
- Verify login URL is correct
- Check if account is active

### CV Not Found

- Upload a CV manually first
- Or modify test to upload CV automatically

### Generation Timeout

- Increase timeout in test (currently 60s)
- Check server is running
- Check OpenAI API key is valid

### Download Fails

- Check download permissions
- Verify export button selector
- Check PDF generation is working

## Next Steps

After running tests:

1. **Review PDFs** - Open each PDF and visually inspect
2. **Measure occupancy** - Calculate page fill percentage
3. **Compare to targets** - Should be 85-92%
4. **Identify issues** - Note any problems
5. **Iterate** - Adjust budgets if needed (see Phase 6 guide)
6. **Re-test** - Run tests again after adjustments

## Success Criteria

- ✅ All 4 tests pass (no errors)
- ✅ All PDFs download successfully
- ✅ Page occupancy 85-92% for each page
- ✅ No content clipping
- ✅ Professional appearance
- ✅ Warnings show appropriately

If all criteria met → **Deploy to production!** 🚀
