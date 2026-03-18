const fs = require('fs');
const path = require('path');

// Admin routes that need fixing
const routesToFix = [
  'admin/create-campaign/route.ts',
  'admin/unsubscribed-users/route.ts',
  'admin/process-campaign-queue/route.ts',
  'admin/user-count/route.ts',
  'admin/send-pricing-campaign/route.ts',
  'admin/send-campaign/route.ts',
  'admin/reset-generations/route.ts'
];

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

console.log('🔧 Fixing admin routes to prevent build failures...\n');

routesToFix.forEach(routePath => {
  const fullPath = path.join(apiDir, routePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${routePath} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Pattern 1: Module-level initialization with variables
  if (content.includes('const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!') && 
      content.includes('const supabase = createClient(supabaseUrl, supabaseServiceKey')) {
    
    // Remove module-level initialization
    content = content.replace(
      /const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!\nconst supabaseServiceKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY!\n\nconst supabase = createClient\(supabaseUrl, supabaseServiceKey, \{[\s\S]*?\}\)/,
      ''
    );
    
    // Add import for helper
    if (!content.includes('createAdminClient')) {
      content = content.replace(
        "import { createClient } from '@supabase/supabase-js'",
        "import { createAdminClient } from '@/lib/supabase-admin'"
      );
    }
    
    // Replace supabase usage in POST handler
    content = content.replace(
      /export async function POST\(request: NextRequest\) \{\n  try \{/,
      'export async function POST(request: NextRequest) {\n  try {\n    const supabase = createAdminClient()'
    );
    
    modified = true;
  }
  
  // Pattern 2: Direct module-level initialization
  if (content.match(/^const supabase = createClient\(\n  process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\n  process\.env\.SUPABASE_SERVICE_ROLE_KEY!/m)) {
    
    // Remove module-level initialization
    content = content.replace(
      /const supabase = createClient\(\n  process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\n  process\.env\.SUPABASE_SERVICE_ROLE_KEY!\n\)/,
      ''
    );
    
    // Add import for helper
    if (!content.includes('createAdminClient')) {
      content = content.replace(
        "import { createClient } from '@supabase/supabase-js'",
        "import { createAdminClient } from '@/lib/supabase-admin'"
      );
    }
    
    // Replace supabase usage in POST handler
    content = content.replace(
      /export async function POST\(request: NextRequest\) \{\n  try \{/,
      'export async function POST(request: NextRequest) {\n  try {\n    const supabase = createAdminClient()'
    );
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${routePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${routePath}`);
  }
});

console.log('\n✅ Admin routes fixed! Build should now succeed.');
