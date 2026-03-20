/**
 * Script to properly add openai initialization in all files
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
  
  // Find all uses of openai. and add initialization before them
  const lines = content.split('\n');
  const newLines = [];
  let inFunction = false;
  let functionHasOpenaiInit = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect function start (POST, GET, etc.)
    if (/export async function (POST|GET|PUT|DELETE|PATCH)/.test(line)) {
      inFunction = true;
      functionHasOpenaiInit = false;
    }
    
    // Check if this line uses openai. (but not getOpenAIClient)
    if (inFunction && /\bopenai\./.test(line) && !functionHasOpenaiInit && !/getOpenAIClient/.test(line)) {
      // Find the indentation of current line
      const indent = line.match(/^(\s*)/)[1];
      
      // Add initialization before this line
      newLines.push(`${indent}const openai = getOpenAIClient()`);
      functionHasOpenaiInit = true;
      modified = true;
    }
    
    newLines.push(line);
    
    // Detect function end
    if (inFunction && /^}/.test(line.trim())) {
      inFunction = false;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\n✨ Done! All files have been updated.');
