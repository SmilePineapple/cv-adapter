const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'download', '[id]', 'page.tsx');

// Comprehensive replacements for download page
const replacements = [
  // Main backgrounds
  { from: /className="min-h-screen bg-gray-50"/g, to: 'className="min-h-screen bg-black text-white"' },
  { from: /className="min-h-screen bg-white"/g, to: 'className="min-h-screen bg-black text-white"' },
  
  // Headers
  { from: /className="bg-white border-b"/g, to: 'className="bg-black border-b border-white/10"' },
  { from: /className="bg-white border-b border-gray-200"/g, to: 'className="bg-black border-b border-white/10"' },
  
  // Back links
  { from: /className="flex items-center text-gray-600 hover:text-gray-900/g, to: 'className="flex items-center text-gray-400 hover:text-white transition-colors' },
  { from: /className="inline-flex items-center text-gray-600 hover:text-gray-900/g, to: 'className="inline-flex items-center text-gray-400 hover:text-white transition-colors' },
  
  // Main containers and cards
  { from: /className="bg-white rounded-lg shadow-sm p-6"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"' },
  { from: /className="bg-white rounded-xl shadow-sm p-6"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"' },
  { from: /className="bg-white rounded-2xl shadow-sm p-8"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"' },
  { from: /className="bg-white rounded-lg p-6"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"' },
  { from: /className="bg-white rounded-lg p-8"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8"' },
  { from: /className="bg-white rounded-xl p-6"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"' },
  { from: /className="bg-white shadow-lg rounded-lg p-6"/g, to: 'className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"' },
  
  // Headings
  { from: /className="text-3xl font-bold text-gray-900/g, to: 'className="text-4xl font-black text-white' },
  { from: /className="text-2xl font-bold text-gray-900/g, to: 'className="text-3xl font-black text-white' },
  { from: /className="text-xl font-bold text-gray-900/g, to: 'className="text-2xl font-black text-white' },
  { from: /className="text-lg font-bold text-gray-900/g, to: 'className="text-xl font-black text-white' },
  { from: /className="text-lg font-semibold text-gray-900/g, to: 'className="text-xl font-black text-white' },
  { from: /className="font-semibold text-gray-900/g, to: 'className="font-black text-white' },
  { from: /className="font-bold text-gray-900/g, to: 'className="font-black text-white' },
  { from: /className="font-medium text-gray-900/g, to: 'className="font-bold text-white' },
  
  // Text colors
  { from: /text-gray-900/g, to: 'text-white' },
  { from: /text-gray-800/g, to: 'text-white' },
  { from: /text-gray-700/g, to: 'text-gray-300' },
  { from: /text-gray-600/g, to: 'text-gray-400' },
  { from: /text-gray-500/g, to: 'text-gray-400' },
  
  // Borders
  { from: /border-gray-200/g, to: 'border-white/10' },
  { from: /border-gray-300/g, to: 'border-white/20' },
  
  // Backgrounds
  { from: /bg-gray-50/g, to: 'bg-white/5' },
  { from: /bg-gray-100/g, to: 'bg-white/10' },
  
  // Buttons - primary (download buttons)
  { from: /className="([^"]*?)bg-blue-600([^"]*?)text-white([^"]*?)rounded-lg/g, to: 'className="$1bg-white$2text-black$3rounded-full font-black' },
  { from: /className="([^"]*?)bg-blue-600([^"]*?)text-white([^"]*?)rounded-xl/g, to: 'className="$1bg-white$2text-black$3rounded-full font-black' },
  { from: /className="([^"]*?)bg-green-600([^"]*?)text-white([^"]*?)rounded-lg/g, to: 'className="$1bg-white$2text-black$3rounded-full font-black' },
  
  // Buttons - secondary
  { from: /className="([^"]*?)border border-gray-300([^"]*?)text-gray-700/g, to: 'className="$1border border-white/20$2text-white' },
  
  // Info/Alert boxes
  { from: /className="bg-blue-50 border border-blue-200 rounded-lg/g, to: 'className="bg-blue-500/10 border border-blue-500/30 rounded-xl' },
  { from: /className="bg-blue-100 border border-blue-200 rounded-lg/g, to: 'className="bg-blue-500/10 border border-blue-500/30 rounded-xl' },
  { from: /className="bg-green-50 border border-green-200 rounded-lg/g, to: 'className="bg-green-500/10 border border-green-500/30 rounded-xl' },
  { from: /className="bg-yellow-50 border border-yellow-200 rounded-lg/g, to: 'className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl' },
  { from: /className="bg-purple-50 border border-purple-200 rounded-lg/g, to: 'className="bg-purple-500/10 border border-purple-500/30 rounded-xl' },
  
  // Icon colors
  { from: /text-blue-600/g, to: 'text-blue-400' },
  { from: /text-green-600/g, to: 'text-green-400' },
  { from: /text-yellow-600/g, to: 'text-yellow-400' },
  { from: /text-purple-600/g, to: 'text-purple-400' },
  
  // Badges
  { from: /className="([^"]*?)bg-green-100 text-green-800/g, to: 'className="$1bg-green-500/20 text-green-400 border border-green-500/30' },
  { from: /className="([^"]*?)bg-blue-100 text-blue-800/g, to: 'className="$1bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { from: /className="([^"]*?)bg-purple-100 text-purple-800/g, to: 'className="$1bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  
  // Inputs/Selects
  { from: /className="([^"]*?)border border-gray-300 rounded-lg([^"]*?)focus:ring-2 focus:ring-blue-500/g, to: 'className="$1bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500$2focus:outline-none focus:border-white/40' },
  
  // Dividers
  { from: /className="border-t border-gray-200/g, to: 'className="border-t border-white/10' },
];

try {
  if (!fs.existsSync(filePath)) {
    console.log('❌ Download page file not found');
    process.exit(1);
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      changeCount += matches.length;
    }
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated download page with ${changeCount} changes`);
  
} catch (error) {
  console.error('❌ Error updating download page:', error.message);
  process.exit(1);
}
