/**
 * Comprehensive Pricing Test Script
 * Tests all pricing changes from £9.99/month to £2.99/month
 */

const fs = require('fs');

const results = {
  passed: [],
  failed: [],
  warnings: []
};

function testFile(filePath, tests) {
  console.log(`\n📄 Testing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    tests.forEach(test => {
      if (test.shouldContain) {
        test.shouldContain.forEach(str => {
          if (content.includes(str)) {
            results.passed.push(`✅ ${filePath}: Contains "${str}"`);
          } else {
            results.failed.push(`❌ ${filePath}: Missing "${str}"`);
          }
        });
      }
      
      if (test.shouldNotContain) {
        test.shouldNotContain.forEach(str => {
          if (!content.includes(str)) {
            results.passed.push(`✅ ${filePath}: Does not contain old price "${str}"`);
          } else {
            results.failed.push(`❌ ${filePath}: Still contains old price "${str}"`);
          }
        });
      }
    });
  } catch (error) {
    results.failed.push(`❌ ${filePath}: Error reading file - ${error.message}`);
  }
}

// Test 1: Currency Configuration
testFile('src/lib/currency.ts', [
  {
    shouldContain: [
      'amount: 299',  // £2.99/month
      'annualAmount: 2999',  // £29.99/year
      'displayAmount: \'£2.99\'',
      'annualDisplayAmount: \'£29.99\'',
      'annualMonthlyEquivalent: \'£2.50/month\'',
      'annualSavings: \'Save £6/year\''
    ],
    shouldNotContain: [
      'amount: 999',  // Old £9.99
      'annualAmount: 4900',  // Old £49
      'displayAmount: \'£9.99\'',
      'annualDisplayAmount: \'£49\''
    ]
  }
]);

// Test 2: Stripe Checkout API
testFile('src/app/api/stripe/create-checkout/route.ts', [
  {
    shouldContain: [
      'gbp: 299',  // £2.99
      'gbp: 2999',  // £29.99
      'Save 17%'
    ],
    shouldNotContain: [
      'gbp: 999',  // Old £9.99
      'gbp: 4900',  // Old £49
      'Save 59%'
    ]
  }
]);

// Test 3: Admin Analytics
testFile('src/app/api/admin/analytics/route.ts', [
  {
    shouldContain: [
      'monthlyMRR = monthlyProCount * 2.99',
      'annualMRR = annualProCount * (29.99 / 12)'
    ],
    shouldNotContain: [
      'monthlyMRR = monthlyProCount * 9.99',
      'annualMRR = annualProCount * (49 / 12)'
    ]
  }
]);

// Test 4: Subscription Page
testFile('src/app/subscription/page.tsx', [
  {
    shouldContain: [
      '£2.99/month'
    ],
    shouldNotContain: [
      '£9.99/month'
    ]
  }
]);

// Test 5: Homepage
testFile('src/app/homepage.tsx', [
  {
    shouldContain: [
      '£2.99/month or £29.99/year',
      '£2.99<span',
      '£29.99<span',
      'Save £6/year',
      'Just £2.50/month'
    ],
    shouldNotContain: [
      '£9.99/month',
      '£49/year',
      'Save £70/year',
      '£4.08/month'
    ]
  }
]);

// Test 6: Upgrade Modal
testFile('src/components/UpgradeModal.tsx', [
  {
    shouldContain: [
      '£2.99/month',
      '£29.99/year',
      'save 17%',
      '£2.50/month'
    ],
    shouldNotContain: [
      '£9.99',
      '£49/year',
      'save 59%',
      '£4.08/month'
    ]
  }
]);

// Test 7: Admin Dashboard
testFile('src/app/admin/page.tsx', [
  {
    shouldContain: [
      '£2.99'
    ],
    shouldNotContain: [
      '£9.99'
    ]
  }
]);

// Test 8: Environment Variables
testFile('.env.local', [
  {
    shouldContain: [
      'STRIPE_PRICE_ID_PRO_MONTHLY=price_1Sl5IuCmLcsbnd6zlytFDSDW',
      'STRIPE_PRICE_ID_PRO_ANNUAL=price_1Sl5JHCmLcsbnd6zL26mSyV5'
    ],
    shouldNotContain: [
      'price_1SLLfkCmLcsbnd6zJHAzUX0E',  // Old monthly
      'price_1SLLg3CmLcsbnd6zqSOg6aC3'   // Old annual
    ]
  }
]);

// Generate Report
console.log('\n\n' + '='.repeat(80));
console.log('📊 PRICING TEST REPORT');
console.log('='.repeat(80));

console.log(`\n✅ PASSED: ${results.passed.length} tests`);
results.passed.forEach(msg => console.log(`   ${msg}`));

if (results.failed.length > 0) {
  console.log(`\n❌ FAILED: ${results.failed.length} tests`);
  results.failed.forEach(msg => console.log(`   ${msg}`));
}

if (results.warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS: ${results.warnings.length}`);
  results.warnings.forEach(msg => console.log(`   ${msg}`));
}

console.log('\n' + '='.repeat(80));
console.log(`TOTAL: ${results.passed.length + results.failed.length} tests run`);
console.log(`SUCCESS RATE: ${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1)}%`);
console.log('='.repeat(80) + '\n');

// Exit with error code if any tests failed
if (results.failed.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 All pricing tests passed!\n');
  process.exit(0);
}
