/**
 * Comprehensive script to add openai initialization in all API route files
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/api/apply-improvements/route.ts',
  'src/app/api/ats-score/route.ts',
  'src/app/api/auto-cv-generate/route.ts',
  'src/app/api/career/analyze/route.ts',
  'src/app/api/career/chat/route.ts',
  'src/app/api/company/research/route.ts',
  'src/app/api/cover-letter/generate/route.ts',
  'src/app/api/cv/[cvId]/ai-populate/route.ts',
  'src/app/api/cv/[cvId]/section/route.ts',
  'src/app/api/generate-cover-letter-v2/route.ts',
  'src/app/api/interview-prep/generate/route.ts',
  'src/app/api/interview-simulator/chat/route.ts',
  'src/app/api/interview-simulator/start/route.ts',
  'src/app/api/jobs/scrape/route.ts',
  'src/app/api/linkedin/parse/route.ts',
  'src/app/api/optimize-generation/route.ts',
  'src/app/api/rate-cv/route.ts',
  'src/app/api/review-cv/route.ts',
  'src/app/api/rewrite/route.ts',
  'src/app/api/roast-cv/route.ts',
  'src/app/api/skills-assessment/complete/route.ts',
  'src/app/api/skills-assessment/generate/route.ts',
  'src/app/api/upload/route.ts',
];

const rootDir = path.join(__dirname, '..');

filesToFix.forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if file already has openai initialization
  if (/const openai = getOpenAIClient\(\)/.test(content)) {
    console.log(`✓ Already fixed: ${filePath}`);
    return;
  }
  
  // Check if file uses openai
  if (!/\bopenai\./.test(content)) {
    console.log(`ℹ️  No openai usage: ${filePath}`);
    return;
  }
  
  // Add initialization after "try {" in POST/GET/PUT/DELETE/PATCH functions
  const pattern = /(export async function (?:POST|GET|PUT|DELETE|PATCH)[^{]*\{[\s\n]*try \{)([\s\n]*)/;
  
  if (pattern.test(content)) {
    content = content.replace(
      pattern,
      '$1\n    const openai = getOpenAIClient()$2'
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⚠️  Pattern not found in: ${filePath}`);
  }
});

console.log('\n✨ Done!');
