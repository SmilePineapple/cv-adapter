const fs = require('fs');
const path = require('path');

// Files to fix based on grep results
const filesToFix = [
  'src/app/api/unsubscribe/route.ts',
  'src/app/api/stripe/webhook/route.ts',
  'src/app/api/stripe/invoices/route.ts',
  'src/app/api/stripe/create-checkout-v2/route.ts',
  'src/app/api/stripe/create-checkout/route.ts',
  'src/app/api/stripe/cancel-subscription/route.ts',
  'src/app/api/social-bot/posts/route.ts',
  'src/app/api/social-bot/test/route.ts',
  'src/app/api/social-bot/generate/route.ts',
  'src/app/api/social-bot/debug/route.ts',
  'src/app/api/social-bot/cron/route.ts',
  'src/app/api/social-bot/config/route.ts',
  'src/app/api/skills-assessment/generate/route.ts',
  'src/app/api/skills-assessment/complete/route.ts',
  'src/app/api/skills-assessment/submit/route.ts',
  'src/app/api/setup-cover-letters/route.ts',
  'src/app/api/refresh-schema/route.ts',
  'src/app/api/linkedin/scrape/route.ts',
  'src/app/api/linkedin/callback/route.ts',
  'src/app/api/linkedin/parse/route.ts',
  'src/app/api/linkedin/auth/route.ts',
  'src/app/api/jobs/scrape/route.ts',
  'src/app/api/interview-simulator/chat/route.ts',
  'src/app/api/interview-simulator/start/route.ts',
  'src/app/api/interview-prep/generate/route.ts',
  'src/app/api/generate-cover-letter-v2/route.ts',
  'src/app/api/delete-account/route.ts',
  'src/app/api/cron/send-reminder-emails/route.ts',
  'src/app/api/cover-letter/[id]/export/route.ts',
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  if (content.includes('const supabase = createClient(')) {
    // Remove the module-level supabase client
    content = content.replace(
      /const supabase = createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\)/g,
      '// Supabase client moved inside route handlers'
    );
    modified = true;
  }

  // Pattern 2: const supabaseUrl = ... const supabaseServiceKey = ... const supabase = createClient(...)
  if (content.match(/const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!/)) {
    content = content.replace(
      /const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!\s*const supabaseServiceKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\n\s*const supabase = createClient\(supabaseUrl, supabaseServiceKey,\s*\{[^}]+\}\s*\)/gs,
      '// Supabase client moved inside route handlers'
    );
    modified = true;
  }

  // Replace import if needed
  if (content.includes("import { createClient } from '@supabase/supabase-js'") && !content.includes('createSupabaseAdminClient')) {
    content = content.replace(
      /import \{ createClient \} from '@supabase\/supabase-js'/,
      "import { createSupabaseAdminClient } from '@/lib/supabase-server'"
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`ℹ️  No changes needed for ${file}`);
  }
});

console.log('\n✨ Done! Now manually add createSupabaseAdminClient() calls inside each route handler.');
