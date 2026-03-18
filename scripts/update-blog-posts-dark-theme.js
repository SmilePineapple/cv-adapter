const fs = require('fs');
const path = require('path');

// List of blog post directories to update (excluding main blog page which is already done)
const blogPosts = [
  'ai-cv-generator-guide',
  'ai-powered-cv-optimization-2025',
  'ats-cv-tips-uk-2025',
  'ats-friendly-cv-builder',
  'career-change-cv-guide-uk',
  'cover-letter-template-uk-2025',
  'cv-buddy-vs-canva',
  'cv-examples-by-industry-uk',
  'cv-format-best-layouts-uk',
  'cv-keywords-for-ats-2025',
  'cv-personal-statement-examples',
  'cv-skills-section-guide',
  'cv-template-uk-2025',
  'cv-writing-tips',
  'first-job-cv-no-experience',
  'free-cv-builder-no-sign-up',
  'graduate-cv-no-experience-uk',
  'how-long-should-cv-be-uk',
  'how-to-beat-ats-systems',
  'professional-cv-how-to-create',
  'resume-vs-cv-difference',
  'what-to-put-on-cv-complete-guide'
];

// Replacements to apply to each blog post
const replacements = [
  // Main container background
  { from: /className="min-h-screen bg-gray-50"/g, to: 'className="min-h-screen bg-black text-white"' },
  { from: /className="min-h-screen bg-white"/g, to: 'className="min-h-screen bg-black text-white"' },
  
  // Header
  { from: /className="bg-white border-b border-gray-200"/g, to: 'className="bg-black border-b border-white/10"' },
  { from: /className="bg-white border-b"/g, to: 'className="bg-black border-b border-white/10"' },
  
  // Back to Blog link
  { from: /className="inline-flex items-center text-gray-600 hover:text-gray-900/g, to: 'className="inline-flex items-center text-gray-400 hover:text-white transition-colors' },
  
  // Article container
  { from: /className="bg-white rounded-lg shadow-sm p-8"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"' },
  { from: /className="bg-white rounded-2xl shadow-sm p-8"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"' },
  
  // Headings
  { from: /className="text-4xl sm:text-5xl font-bold text-gray-900/g, to: 'className="text-5xl sm:text-6xl font-black text-white tracking-tight' },
  { from: /className="text-3xl font-bold text-gray-900/g, to: 'className="text-4xl font-black text-white' },
  { from: /className="text-2xl font-bold text-gray-900/g, to: 'className="text-3xl font-black text-white' },
  { from: /className="text-xl font-bold text-gray-900/g, to: 'className="text-2xl font-black text-white' },
  
  // Text colors
  { from: /className="text-xl text-gray-600/g, to: 'className="text-xl text-gray-300' },
  { from: /className="text-gray-600/g, to: 'className="text-gray-400' },
  { from: /className="text-gray-700/g, to: 'className="text-gray-300' },
  { from: /className="text-gray-900/g, to: 'className="text-white' },
  { from: /className="text-gray-500/g, to: 'className="text-gray-400' },
  
  // Date/meta text
  { from: /className="flex items-center gap-2 text-sm text-gray-600/g, to: 'className="flex items-center gap-2 text-sm text-gray-400' },
  
  // Category badges
  { from: /className="text-blue-600 font-medium"/g, to: 'className="text-blue-400 font-black"' },
  
  // Prose styling
  { from: /className="prose prose-lg max-w-none"/g, to: 'className="prose prose-invert prose-lg max-w-none"' },
  
  // Tables
  { from: /className="min-w-full divide-y divide-gray-200"/g, to: 'className="min-w-full divide-y divide-white/10"' },
  { from: /className="bg-gray-50"/g, to: 'className="bg-white/5"' },
  { from: /className="bg-white divide-y divide-gray-200"/g, to: 'className="bg-white/5 divide-y divide-white/10"' },
  { from: /className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"/g, to: 'className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase"' },
  { from: /className="px-4 py-4 text-sm text-gray-900"/g, to: 'className="px-4 py-4 text-sm text-white"' },
  { from: /className="px-4 py-4 text-sm text-gray-600"/g, to: 'className="px-4 py-4 text-sm text-gray-400"' },
  
  // Highlighted rows
  { from: /className="bg-blue-50"/g, to: 'className="bg-blue-500/10"' },
  
  // Badges
  { from: /className="bg-green-100 text-green-800"/g, to: 'className="bg-green-500/20 text-green-400 border border-green-500/30"' },
  { from: /className="bg-yellow-100 text-yellow-800"/g, to: 'className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"' },
  { from: /className="bg-red-100 text-red-800"/g, to: 'className="bg-red-500/20 text-red-400 border border-red-500/30"' },
  { from: /className="bg-blue-100 text-blue-800"/g, to: 'className="bg-blue-500/20 text-blue-400 border border-blue-500/30"' },
  
  // Cards/Sections
  { from: /className="my-8 p-6 bg-gray-50 rounded-xl border border-gray-200"/g, to: 'className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"' },
  { from: /className="bg-white rounded-lg border border-gray-200"/g, to: 'className="bg-white/5 rounded-xl border border-white/10"' },
  
  // Icons
  { from: /className="w-5 h-5 text-green-600"/g, to: 'className="w-5 h-5 text-green-400"' },
  { from: /className="w-5 h-5 text-red-600"/g, to: 'className="w-5 h-5 text-red-400"' },
  { from: /className="w-6 h-6 text-blue-600"/g, to: 'className="w-6 h-6 text-blue-400"' },
  
  // Buttons/Links
  { from: /className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700/g, to: 'className="inline-flex items-center px-6 py-3 bg-white text-black rounded-full font-black hover:bg-gray-100' },
  
  // CTA sections
  { from: /className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl"/g, to: 'className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl"' },
  { from: /className="text-xl font-bold text-gray-900 mb-3/g, to: 'className="text-xl font-black text-white mb-3' },
];

let updatedCount = 0;
let errorCount = 0;

blogPosts.forEach(blogPost => {
  const filePath = path.join(__dirname, '..', 'src', 'app', 'blog', blogPost, 'page.tsx');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${blogPost} - file not found`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all replacements
    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${blogPost}`);
      updatedCount++;
    } else {
      console.log(`ℹ️  No changes needed: ${blogPost}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${blogPost}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total processed: ${blogPosts.length} files`);
