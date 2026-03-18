const fs = require('fs');
const path = require('path');

// Pages already updated to dark theme
const completedPages = [
  'dashboard',
  'generate',
  'review',
  'download',
  'blog', // main + 22 individual posts
  'privacy',
  'terms',
  'contact'
];

// High priority user-facing pages to check
const pagesToCheck = [
  'upload',
  'edit',
  'subscription',
  'templates',
  'cover-letter',
  'interview-prep',
  'skills-assessment',
  'auth/login',
  'auth/signup',
  'homepage.tsx',
  'landing',
  'help',
  'history',
  'roast-cv',
  'cv-examples',
  'cv-writing-guide',
  'ats-optimization-guide',
  'pricing-comparison',
  'unsubscribe'
];

const appDir = path.join(__dirname, '..', 'src', 'app');

console.log('🔍 Searching for pages needing dark theme migration...\n');

const results = {
  needsDarkTheme: [],
  alreadyDark: [],
  notFound: []
};

pagesToCheck.forEach(pagePath => {
  const fullPath = path.join(appDir, pagePath);
  let pageFile = '';
  
  // Check if it's a direct file or directory with page.tsx
  if (pagePath.endsWith('.tsx')) {
    pageFile = fullPath;
  } else {
    pageFile = path.join(fullPath, 'page.tsx');
  }
  
  if (!fs.existsSync(pageFile)) {
    results.notFound.push(pagePath);
    return;
  }
  
  const content = fs.readFileSync(pageFile, 'utf8');
  
  // Check for light theme indicators
  const hasLightBg = content.includes('bg-white') || content.includes('bg-gray-50') || content.includes('bg-gray-100');
  const hasDarkBg = content.includes('bg-black') || content.includes('bg-white/5') || content.includes('backdrop-blur-md');
  
  if (hasLightBg && !hasDarkBg) {
    results.needsDarkTheme.push(pagePath);
  } else if (hasDarkBg) {
    results.alreadyDark.push(pagePath);
  } else {
    results.needsDarkTheme.push(pagePath); // Assume needs update if unclear
  }
});

console.log('✅ Already Dark Themed:');
results.alreadyDark.forEach(page => console.log(`   - ${page}`));

console.log('\n🎨 Needs Dark Theme Migration:');
results.needsDarkTheme.forEach(page => console.log(`   - ${page}`));

console.log('\n❌ Not Found:');
results.notFound.forEach(page => console.log(`   - ${page}`));

console.log(`\n📊 Summary:`);
console.log(`   Already dark: ${results.alreadyDark.length}`);
console.log(`   Needs migration: ${results.needsDarkTheme.length}`);
console.log(`   Not found: ${results.notFound.length}`);
