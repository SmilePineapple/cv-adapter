const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');
const componentsDir = path.join(__dirname, '..', 'src', 'components');

// Analysis results
const analysis = {
  pages: {
    total: 0,
    darkTheme: 0,
    lightTheme: 0,
    mixed: 0,
    details: []
  },
  components: {
    total: 0,
    darkTheme: 0,
    lightTheme: 0,
    mixed: 0,
    details: []
  },
  issues: []
};

// Check if file uses dark theme
function analyzeFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Dark theme indicators
  const hasBgBlack = content.includes('bg-black');
  const hasWhiteText = content.includes('text-white');
  const hasGlassmorphism = content.includes('bg-white/5') || content.includes('backdrop-blur');
  const hasBorderWhite = content.includes('border-white/10') || content.includes('border-white/20');
  
  // Light theme indicators
  const hasBgWhite = content.match(/className="[^"]*bg-white[^/][^"]*"/g);
  const hasBgGray = content.match(/className="[^"]*bg-gray-50[^"]*"/g) || content.match(/className="[^"]*bg-gray-100[^"]*"/g);
  const hasTextGray = content.match(/text-gray-900|text-gray-800/g);
  const hasBorderGray = content.match(/border-gray-200|border-gray-300/g);
  
  const darkScore = (hasBgBlack ? 1 : 0) + (hasWhiteText ? 1 : 0) + (hasGlassmorphism ? 1 : 0) + (hasBorderWhite ? 1 : 0);
  const lightScore = (hasBgWhite ? hasBgWhite.length : 0) + (hasBgGray ? hasBgGray.length : 0) + (hasTextGray ? hasTextGray.length : 0) + (hasBorderGray ? hasBorderGray.length : 0);
  
  let theme = 'unknown';
  if (darkScore >= 2 && lightScore === 0) {
    theme = 'dark';
  } else if (lightScore > 5 && darkScore === 0) {
    theme = 'light';
  } else if (darkScore > 0 && lightScore > 0) {
    theme = 'mixed';
  }
  
  return {
    path: relativePath,
    theme,
    darkScore,
    lightScore,
    issues: lightScore > 0 ? ['Contains light theme elements'] : []
  };
}

// Recursively scan directory
function scanDirectory(dir, baseDir, type) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'api') {
        scanDirectory(fullPath, baseDir, type);
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const relativePath = path.relative(baseDir, fullPath);
      const result = analyzeFile(fullPath, relativePath);
      
      analysis[type].total++;
      if (result.theme === 'dark') {
        analysis[type].darkTheme++;
      } else if (result.theme === 'light') {
        analysis[type].lightTheme++;
        analysis.issues.push(`${relativePath}: Still using light theme`);
      } else if (result.theme === 'mixed') {
        analysis[type].mixed++;
        analysis.issues.push(`${relativePath}: Mixed theme (dark: ${result.darkScore}, light: ${result.lightScore})`);
      }
      
      analysis[type].details.push(result);
    }
  });
}

console.log('🔍 Starting comprehensive project analysis...\n');

// Scan pages
console.log('📄 Analyzing pages...');
scanDirectory(appDir, appDir, 'pages');

// Scan components
console.log('🧩 Analyzing components...');
scanDirectory(componentsDir, componentsDir, 'components');

// Generate report
console.log('\n' + '='.repeat(80));
console.log('📊 COMPREHENSIVE PROJECT ANALYSIS REPORT');
console.log('='.repeat(80));

console.log('\n📄 PAGES ANALYSIS:');
console.log(`   Total pages: ${analysis.pages.total}`);
console.log(`   ✅ Dark theme: ${analysis.pages.darkTheme} (${Math.round(analysis.pages.darkTheme / analysis.pages.total * 100)}%)`);
console.log(`   ⚠️  Mixed theme: ${analysis.pages.mixed} (${Math.round(analysis.pages.mixed / analysis.pages.total * 100)}%)`);
console.log(`   ❌ Light theme: ${analysis.pages.lightTheme} (${Math.round(analysis.pages.lightTheme / analysis.pages.total * 100)}%)`);

console.log('\n🧩 COMPONENTS ANALYSIS:');
console.log(`   Total components: ${analysis.components.total}`);
console.log(`   ✅ Dark theme: ${analysis.components.darkTheme} (${Math.round(analysis.components.darkTheme / analysis.components.total * 100)}%)`);
console.log(`   ⚠️  Mixed theme: ${analysis.components.mixed} (${Math.round(analysis.components.mixed / analysis.components.total * 100)}%)`);
console.log(`   ❌ Light theme: ${analysis.components.lightTheme} (${Math.round(analysis.components.lightTheme / analysis.components.total * 100)}%)`);

console.log('\n🎨 OVERALL DARK THEME COVERAGE:');
const totalFiles = analysis.pages.total + analysis.components.total;
const totalDark = analysis.pages.darkTheme + analysis.components.darkTheme;
const coverage = Math.round(totalDark / totalFiles * 100);
console.log(`   ${coverage}% of files fully support dark theme`);

if (analysis.issues.length > 0) {
  console.log('\n⚠️  ISSUES FOUND:');
  analysis.issues.slice(0, 20).forEach(issue => {
    console.log(`   - ${issue}`);
  });
  if (analysis.issues.length > 20) {
    console.log(`   ... and ${analysis.issues.length - 20} more issues`);
  }
} else {
  console.log('\n✅ NO ISSUES FOUND - All files support dark theme!');
}

console.log('\n' + '='.repeat(80));

// Save detailed report
const reportPath = path.join(__dirname, 'analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
console.log(`\n📝 Detailed report saved to: ${reportPath}`);
