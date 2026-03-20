/**
 * Script to fix module-level Supabase initialization across all API routes
 * Replaces with runtime initialization using createAdminClient()
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/api/upload/route.ts',
  'src/app/api/stripe/create-checkout-v2/route.ts',
  'src/app/api/setup-cover-letters/route.ts',
  'src/app/api/refresh-schema/route.ts',
  'src/app/api/linkedin/callback/route.ts',
  'src/app/api/linkedin/auth/route.ts',
  'src/app/api/linkedin/scrape/route.ts',
  'src/app/api/linkedin/parse/route.ts',
  'src/app/api/jobs/scrape/route.ts',
  'src/app/api/interview-prep/generate/route.ts',
  'src/app/api/generate-cover-letter-v2/route.ts',
  'src/app/api/cover-letter/[id]/export/route.ts',
  'src/app/api/cron/send-reminder-emails/route.ts',
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
  
  // Check if already using createAdminClient
  if (content.includes('createAdminClient')) {
    console.log(`✓ Already fixed: ${filePath}`);
    return;
  }
  
  // Pattern 1: const supabase = createClient(...)
  const pattern1 = /const supabase(?:Admin)? = createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\)/;
  
  // Pattern 2: Multi-line with config
  const pattern2 = /const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!\s*\nconst supabaseServiceKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\n\s*\nconst supabase(?:Admin)? = createClient\(supabaseUrl, supabaseServiceKey, \{[\s\S]*?\}\)/;
  
  // Replace import
  if (content.includes("import { createClient } from '@supabase/supabase-js'")) {
    content = content.replace(
      "import { createClient } from '@supabase/supabase-js'",
      "import { createAdminClient } from '@/lib/supabase-admin'"
    );
    modified = true;
  }
  
  // Remove module-level initialization (pattern 1)
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '');
    modified = true;
  }
  
  // Remove module-level initialization (pattern 2)
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '');
    modified = true;
  }
  
  // Add runtime initialization in each handler function
  // Find all export async function patterns
  const functionPattern = /(export async function (?:POST|GET|PUT|DELETE|PATCH)[^{]*\{)\s*\n(\s*try \{)?/g;
  
  content = content.replace(functionPattern, (match, funcStart, tryBlock) => {
    // Check if this function already has createAdminClient
    const nextLines = content.substring(content.indexOf(match) + match.length, content.indexOf(match) + match.length + 200);
    if (nextLines.includes('createAdminClient()')) {
      return match; // Already has it
    }
    
    if (tryBlock) {
      return `${funcStart}\n${tryBlock}\n    const supabase = createAdminClient()`;
    } else {
      return `${funcStart}\n  const supabase = createAdminClient()`;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\n✨ Done! All files have been updated.');
