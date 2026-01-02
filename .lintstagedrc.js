module.exports = {
  // Run ESLint on TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  
  // Run type checking on TypeScript files
  '*.{ts,tsx}': () => 'tsc --noEmit',
  
  // Run tests related to changed files
  '*.{ts,tsx}': async (filenames) => {
    const fs = await import('fs')
    const testFiles = filenames
      .filter(file => !file.includes('.test.') && !file.includes('.spec.'))
      .map(file => file.replace(/\.(ts|tsx)$/, '.test.$1'))
      .filter(file => fs.existsSync(file))
    
    if (testFiles.length > 0) {
      return `vitest run ${testFiles.join(' ')}`
    }
    return []
  },
  
  // Format other files
  '*.{json,md,yml,yaml}': 'prettier --write'
}
