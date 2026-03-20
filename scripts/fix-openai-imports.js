/**
 * Script to fix OpenAI imports across all API routes
 * Replaces module-level OpenAI initialization with lazy client
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
  let modified = false;
  
  // Replace the import statement
  if (content.includes("import OpenAI from 'openai'")) {
    content = content.replace(
      /import OpenAI from 'openai'/g,
      "import { getOpenAIClient } from '@/lib/openai-client'"
    );
    modified = true;
  }
  
  // Remove the module-level openai initialization
  const openaiInitPattern = /const openai = new OpenAI\(\{[\s\S]*?\}\)/g;
  if (openaiInitPattern.test(content)) {
    content = content.replace(openaiInitPattern, '');
    modified = true;
  }
  
  // Add openai initialization inside functions that use it
  // Find all occurrences of "await openai." and add initialization before the try block
  const tryBlockPattern = /(\s+try \{)\s*\n(\s+const response = await openai\.)/g;
  if (tryBlockPattern.test(content)) {
    content = content.replace(
      tryBlockPattern,
      '$1\n    const openai = getOpenAIClient()\n$2'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\n✨ Done! All files have been updated.');
