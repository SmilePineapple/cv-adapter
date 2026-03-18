const fs = require('fs');
const path = require('path');

// Files to fix text contrast
const filesToUpdate = [
  'interview-prep/content.tsx',
  'career-coach/page.tsx'
];

// Text contrast replacements - change gray text to white for better readability
const replacements = [
  // Paragraph text
  { from: /text-gray-400/g, to: 'text-white' },
  { from: /text-gray-300/g, to: 'text-white' },
  
  // Placeholder text (keep as gray-500 for placeholders)
  { from: /placeholder-gray-400/g, to: 'placeholder-gray-500' },
];

const appDir = path.join(__dirname, '..', 'src', 'app');
let totalUpdated = 0;
let totalChanges = 0;

console.log('🎨 Fixing text contrast for better readability...\n');

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(appDir, filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${filePath} - file not found`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changeCount = 0;
    
    // Apply all replacements
    replacements.forEach(({ from, to }) => {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        changeCount += matches.length;
      }
    });
    
    if (changeCount > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath} (${changeCount} changes)`);
      totalUpdated++;
      totalChanges += changeCount;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${totalUpdated} files`);
console.log(`   Total changes: ${totalChanges}`);
