# 🧪 CV Adapter - Comprehensive Testing Strategy

**Last Updated:** January 2, 2026  
**Status:** Implementation Complete - Ready for Execution

---

## 📊 Testing Overview

This document outlines the complete testing strategy for CV Adapter, including unit tests, integration tests, E2E tests, and quality assurance processes.

### **Testing Pyramid**

```
           /\
          /  \         E2E Tests (10%)
         /____\        - Critical user flows
        /      \       - Cross-browser testing
       /        \      
      /__________\     Integration Tests (30%)
     /            \    - API route testing
    /              \   - Database operations
   /________________\  
  /                  \ Unit Tests (60%)
 /____________________\ - Utility functions
                        - Business logic
                        - Components
```

---

## 🎯 Test Coverage Goals

| Area | Target Coverage | Current | Priority |
|------|----------------|---------|----------|
| **Utilities** | 80% | 0% | 🔴 Critical |
| **API Routes** | 70% | 0% | 🔴 Critical |
| **Components** | 60% | 0% | 🟡 High |
| **E2E Flows** | 100% of critical paths | 0% | 🔴 Critical |
| **Overall** | 60%+ | 0% | 🔴 Critical |

---

## 🛠️ Testing Infrastructure

### **Tools & Frameworks**

1. **Vitest** - Unit & Integration Testing
   - Fast, modern test runner
   - Native ESM support
   - Built-in coverage reporting
   - Watch mode for development

2. **Testing Library** - Component Testing
   - React Testing Library
   - User-centric testing approach
   - Accessibility-focused

3. **Playwright** - E2E Testing
   - Cross-browser support (Chrome, Firefox, Safari)
   - Mobile device emulation
   - Visual regression testing
   - Network mocking

4. **MSW (Mock Service Worker)** - API Mocking
   - Intercept network requests
   - Consistent mocking across tests
   - Works in both tests and browser

5. **Husky + Lint-Staged** - Pre-commit Hooks
   - Automatic linting
   - Type checking
   - Test execution

---

## 📁 Test File Organization

```
cv-adapter/
├── src/
│   ├── lib/
│   │   ├── currency.ts
│   │   └── __tests__/
│   │       └── currency.test.ts
│   ├── app/
│   │   └── api/
│   │       └── rewrite/
│   │           ├── route.ts
│   │           └── route.test.ts
│   ├── components/
│   │   ├── UpgradeModal.tsx
│   │   └── UpgradeModal.test.tsx
│   └── test/
│       ├── setup.ts
│       ├── utils/
│       │   ├── test-helpers.ts
│       │   └── mock-api.ts
│       └── e2e/
│           ├── cv-generation-flow.spec.ts
│           ├── subscription-flow.spec.ts
│           └── cover-letter-flow.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── .lintstagedrc.js
```

---

## ✅ Unit Testing

### **What to Test**

1. **Utility Functions** (`src/lib/`)
   - Currency calculations
   - ATS score calculation
   - Language detection
   - Date formatting
   - Error handling

2. **Business Logic**
   - Pricing calculations
   - Subscription tier logic
   - Usage tracking
   - Feature gates

3. **Pure Functions**
   - Data transformations
   - Validators
   - Parsers

### **Example: Currency Tests**

```typescript
// src/lib/__tests__/currency.test.ts
describe('Currency Module', () => {
  it('should have correct GBP pricing', () => {
    expect(CURRENCIES.GBP.amount).toBe(299) // £2.99
    expect(CURRENCIES.GBP.annualAmount).toBe(2999) // £29.99
  })

  it('should calculate annual savings correctly', () => {
    const monthlyCost = CURRENCIES.GBP.amount * 12
    const annualCost = CURRENCIES.GBP.annualAmount
    const savings = monthlyCost - annualCost
    expect(savings).toBeGreaterThan(0)
  })
})
```

### **Running Unit Tests**

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

---

## 🔗 Integration Testing

### **What to Test**

1. **API Routes** (`src/app/api/`)
   - `/api/upload` - File upload & parsing
   - `/api/rewrite` - CV generation
   - `/api/stripe/create-checkout` - Payment flow
   - `/api/export` - PDF/DOCX generation

2. **Database Operations**
   - CRUD operations
   - RLS policies
   - Triggers
   - Transactions

3. **External Services**
   - OpenAI API integration
   - Stripe API integration
   - Supabase operations

### **Example: API Route Test**

```typescript
// src/app/api/rewrite/route.test.ts
describe('POST /api/rewrite', () => {
  it('should generate CV rewrite', async () => {
    const response = await POST(mockRequest({
      cvId: 'test-cv-id',
      jobTitle: 'Software Engineer',
      jobDescription: 'Looking for React developer'
    }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.generationId).toBeDefined()
    expect(data.atsScore).toBeGreaterThan(0)
  })

  it('should handle missing parameters', async () => {
    const response = await POST(mockRequest({}))
    expect(response.status).toBe(400)
  })
})
```

---

## 🌐 E2E Testing

### **Critical User Flows**

1. **CV Generation Flow** ✅
   - Sign up / Login
   - Upload CV
   - Enter job details
   - Generate CV
   - Review results
   - Download CV

2. **Subscription Flow** ✅
   - View pricing
   - Click upgrade
   - Stripe checkout
   - Webhook processing
   - Access Pro features

3. **Cover Letter Flow** ✅
   - Navigate to generator
   - Fill in details
   - Generate letter
   - Preview & edit
   - Download

### **Cross-Browser Testing**

- ✅ Chrome (Desktop)
- ✅ Firefox (Desktop)
- ✅ Safari (Desktop)
- ✅ Chrome (Mobile - Pixel 5)
- ✅ Safari (Mobile - iPhone 12)

### **Running E2E Tests**

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test cv-generation-flow

# Debug mode
npx playwright test --debug
```

---

## 🤖 CI/CD Integration

### **GitHub Actions Pipeline**

```yaml
Workflow: CI/CD Pipeline
├── Lint & Type Check
│   ├── ESLint
│   └── TypeScript type checking
├── Unit & Integration Tests
│   ├── Run Vitest
│   └── Upload coverage to Codecov
├── E2E Tests
│   ├── Install Playwright
│   ├── Run tests
│   └── Upload test results
├── Build
│   └── Next.js build
├── Deploy Staging (on PR)
│   └── Vercel preview deployment
└── Deploy Production (on main)
    ├── Vercel production deployment
    └── Smoke tests
```

### **Pre-commit Hooks**

```bash
# Automatically runs on git commit
1. ESLint --fix
2. Prettier --write
3. TypeScript type check
4. Run tests for changed files
```

---

## 📊 Coverage Reporting

### **Coverage Thresholds**

```javascript
// vitest.config.ts
coverage: {
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

### **Viewing Coverage**

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### **Coverage Badges**

Add to README.md:
```markdown
[![Coverage](https://codecov.io/gh/your-org/cv-adapter/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/cv-adapter)
```

---

## 🎯 Priority Test Areas

### **Phase 1: Critical Paths (Week 1)**

1. ✅ Currency calculations (`lib/currency.ts`)
2. ✅ ATS score calculator (`lib/ats-calculator.ts`)
3. ⏳ CV generation API (`api/rewrite/route.ts`)
4. ⏳ Stripe checkout API (`api/stripe/create-checkout/route.ts`)
5. ⏳ File upload API (`api/upload/route.ts`)

### **Phase 2: User Flows (Week 2)**

6. ⏳ Complete CV generation E2E flow
7. ⏳ Subscription upgrade flow
8. ⏳ Cover letter generation flow
9. ⏳ Dashboard functionality
10. ⏳ Export functionality

### **Phase 3: Components (Week 3)**

11. ⏳ UpgradeModal component
12. ⏳ Dashboard components
13. ⏳ File upload component
14. ⏳ Template selector
15. ⏳ Diff viewer

### **Phase 4: Edge Cases (Week 4)**

16. ⏳ Error handling
17. ⏳ Rate limiting
18. ⏳ File size limits
19. ⏳ Invalid inputs
20. ⏳ Network failures

---

## 🐛 Test-Driven Development (TDD)

### **TDD Workflow**

```
1. Write failing test
   ↓
2. Write minimal code to pass
   ↓
3. Refactor
   ↓
4. Repeat
```

### **Example: Adding New Feature**

```typescript
// 1. Write test first
it('should calculate discount percentage', () => {
  const discount = calculateDiscount(299, 2999)
  expect(discount).toBe(17) // ~17% discount
})

// 2. Implement function
export function calculateDiscount(monthly: number, annual: number): number {
  const monthlyTotal = monthly * 12
  return Math.round(((monthlyTotal - annual) / monthlyTotal) * 100)
}

// 3. Test passes ✅
```

---

## 📝 Testing Best Practices

### **DO:**

✅ Write tests before fixing bugs  
✅ Test behavior, not implementation  
✅ Use descriptive test names  
✅ Keep tests simple and focused  
✅ Mock external dependencies  
✅ Test edge cases and error scenarios  
✅ Maintain test independence  
✅ Use data-testid for E2E selectors  

### **DON'T:**

❌ Test implementation details  
❌ Write tests that depend on each other  
❌ Mock everything (test real integrations when possible)  
❌ Ignore failing tests  
❌ Skip tests with `.skip()`  
❌ Write tests without assertions  
❌ Test third-party libraries  

---

## 🔍 Debugging Tests

### **Vitest Debugging**

```bash
# Run specific test file
npm test currency.test.ts

# Run tests matching pattern
npm test -- --grep "pricing"

# Debug in VS Code
# Add breakpoint and press F5
```

### **Playwright Debugging**

```bash
# Debug mode with browser
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --slow-mo=1000
```

---

## 📈 Metrics & Monitoring

### **Track These Metrics**

1. **Test Coverage** - Aim for 60%+
2. **Test Execution Time** - Keep under 5 minutes
3. **Flaky Test Rate** - Keep under 1%
4. **Bug Escape Rate** - Bugs found in production
5. **Test Maintenance Time** - Time spent fixing tests

### **Quality Gates**

```yaml
# All must pass before merge
- Lint: ✅ No errors
- Type Check: ✅ No errors
- Unit Tests: ✅ All passing
- Integration Tests: ✅ All passing
- E2E Tests: ✅ All passing
- Coverage: ✅ 60%+ overall
```

---

## 🚀 Getting Started

### **1. Install Dependencies**

```bash
npm install
```

### **2. Run Tests**

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### **3. View Coverage**

```bash
npm run test:coverage
open coverage/index.html
```

### **4. Set Up Pre-commit Hooks**

```bash
npx husky install
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## 🎓 Training & Onboarding

### **For New Developers**

1. Read this document
2. Review existing tests
3. Write a simple test
4. Pair with experienced developer
5. Write tests for new features

### **Testing Checklist**

- [ ] Read testing strategy
- [ ] Set up development environment
- [ ] Run existing tests locally
- [ ] Write first test
- [ ] Submit PR with tests
- [ ] Review test coverage report

---

## 📞 Support

**Questions about testing?**
- Check existing tests for examples
- Review this documentation
- Ask in team chat
- Pair with senior developer

---

**Remember:** Good tests are an investment in code quality, developer confidence, and long-term maintainability. Write tests you'd want to debug at 2 AM! 🌙
