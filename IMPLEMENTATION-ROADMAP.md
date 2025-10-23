# 🚀 CV Adapter - Implementation Roadmap
**Created**: October 23, 2025  
**Goal**: Transform 0% conversion to 10%+ and build sustainable revenue  
**Timeline**: 12 weeks to profitability

---

## 📋 HOW TO USE THIS ROADMAP

1. **Complete each task in order** - Dependencies matter
2. **Check off tasks as you finish** - Track progress
3. **Test after each section** - Don't move forward with bugs
4. **Come back when ready** - We'll tackle next section together
5. **Celebrate wins** - Each phase completion is a milestone!

---

## 🎯 PHASE 1: FOUNDATION (Week 1-2)
**Goal**: Restructure pricing and add conversion triggers  
**Expected Impact**: First conversions within 7 days

### **SECTION 1.1: Database Schema Updates** ✅ START HERE

**Objective**: Add columns for new pricing model

**Tasks**:
- [ ] Create migration file: `add-freemium-columns.sql`
- [ ] Add `is_pro` boolean to `profiles` table
- [ ] Add `subscription_tier` enum ('free', 'pro_monthly', 'pro_annual')
- [ ] Add `subscription_start_date` timestamp
- [ ] Add `subscription_end_date` timestamp
- [ ] Add `features_unlocked` jsonb column
- [ ] Run migration in Supabase
- [ ] Verify columns exist

**SQL Script**:
```sql
-- Add to usage_tracking table
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS features_unlocked JSONB DEFAULT '[]'::jsonb;

-- Update existing users to free tier
UPDATE usage_tracking SET subscription_tier = 'free' WHERE subscription_tier IS NULL;
```

**Checkpoint**: ✋ Stop here and confirm database updated before continuing

---

### **SECTION 1.2: Feature Gating System**

**Objective**: Create system to check if user can access features

**Tasks**:
- [ ] Create `src/lib/feature-gates.ts`
- [ ] Add `canAccessFeature()` function
- [ ] Add `getFeatureList()` for free vs pro
- [ ] Add `isProUser()` helper
- [ ] Add `getRemainingGenerations()` helper
- [ ] Test with sample user data

**File to Create**: `src/lib/feature-gates.ts`
```typescript
export const FEATURES = {
  AI_REVIEW: 'ai_review',
  COVER_LETTERS: 'cover_letters',
  ADVANCED_TEMPLATES: 'advanced_templates',
  UNLIMITED_GENERATIONS: 'unlimited_generations',
  ALL_EXPORT_FORMATS: 'all_export_formats',
  NO_WATERMARK: 'no_watermark',
  PRIORITY_SUPPORT: 'priority_support',
} as const

export const FREE_TIER_FEATURES = []
export const PRO_TIER_FEATURES = Object.values(FEATURES)

export function canAccessFeature(
  userTier: string,
  feature: string
): boolean {
  if (userTier === 'pro_monthly' || userTier === 'pro_annual') {
    return true
  }
  return FREE_TIER_FEATURES.includes(feature)
}
```

**Checkpoint**: ✋ Test feature gating logic before continuing

---

### **SECTION 1.3: Upgrade Modal Component**

**Objective**: Create beautiful upgrade modal

**Tasks**:
- [ ] Create `src/components/UpgradeModal.tsx`
- [ ] Add pricing display (£9.99/month, £49/year)
- [ ] Add feature comparison table
- [ ] Add social proof elements
- [ ] Add "Upgrade Now" CTA button
- [ ] Add close button
- [ ] Style with gradients and animations
- [ ] Test modal display

**Checkpoint**: ✋ Test modal appearance before continuing

---

### **SECTION 1.4: Update Stripe Checkout**

**Objective**: Change from one-time to subscription

**Tasks**:
- [ ] Update `src/app/api/stripe/create-checkout/route.ts`
- [ ] Change mode from 'payment' to 'subscription'
- [ ] Create monthly price: £9.99
- [ ] Create annual price: £49
- [ ] Add price IDs to environment variables
- [ ] Test checkout flow in Stripe test mode
- [ ] Verify webhook receives subscription events

**Checkpoint**: ✋ Test full Stripe flow before continuing

---

### **SECTION 1.5: Limit Free Tier**

**Objective**: Reduce free generations from 100 to 1

**Tasks**:
- [ ] Update `.env.local`: `MAX_FREE_GENERATIONS=1`
- [ ] Update `src/app/api/rewrite/route.ts` to check tier
- [ ] Block generation if limit reached and not pro
- [ ] Return clear error message with upgrade CTA
- [ ] Test with free user account
- [ ] Test with pro user account

**Checkpoint**: ✋ Test generation limits before continuing

---

### **SECTION 1.6: Add Watermarks to Free Exports**

**Objective**: Add "Created with CV Adapter - Upgrade to remove" watermark

**Tasks**:
- [ ] Update `src/app/api/export/route.ts`
- [ ] Add watermark to PDF footer (free users only)
- [ ] Add watermark to DOCX footer (free users only)
- [ ] Style watermark (light gray, small text)
- [ ] Test free user export
- [ ] Test pro user export (no watermark)

**Checkpoint**: ✋ Test exports before continuing

---

### **SECTION 1.7: Gate Advanced Features**

**Objective**: Block AI Review and Cover Letters for free users

**Tasks**:
- [ ] Update `src/app/review/[id]/page.tsx`
  - [ ] Check if user is pro before showing AI Review button
  - [ ] Show "Upgrade to unlock" if free user
  - [ ] Open upgrade modal on click
- [ ] Update `src/app/cover-letter/page.tsx`
  - [ ] Check if user is pro on page load
  - [ ] Show upgrade prompt if free user
  - [ ] Redirect to subscription page
- [ ] Update `src/app/download/[id]/page.tsx`
  - [ ] Hide advanced templates for free users
  - [ ] Show "Pro" badge on advanced templates
  - [ ] Open upgrade modal on click
- [ ] Test all gated features

**Checkpoint**: ✋ Test all feature gates before continuing

---

### **SECTION 1.8: Update Dashboard UI**

**Objective**: Show tier status and usage prominently

**Tasks**:
- [ ] Update `src/app/dashboard/page.tsx`
- [ ] Add tier badge (Free/Pro) next to user name
- [ ] Update usage display: "1/1 used" for free
- [ ] Add "Upgrade to Pro" button prominently
- [ ] Add comparison section showing locked features
- [ ] Style with color coding (red for limit reached)
- [ ] Test with free user
- [ ] Test with pro user

**Checkpoint**: ✋ Test dashboard display before continuing

---

### **SECTION 1.9: Update Subscription Page**

**Objective**: New pricing page with monthly/annual toggle

**Tasks**:
- [ ] Update `src/app/subscription/page.tsx`
- [ ] Add monthly/annual toggle switch
- [ ] Show £9.99/month or £49/year (save 59%)
- [ ] Add feature comparison table
- [ ] Add testimonials section
- [ ] Add FAQ section
- [ ] Add "Start Free Trial" CTA
- [ ] Style professionally
- [ ] Test toggle functionality
- [ ] Test checkout flow

**Checkpoint**: ✋ Test subscription page before continuing

---

### **SECTION 1.10: Conversion Tracking Integration**

**Objective**: Track all conversion events

**Tasks**:
- [ ] Update `src/app/auth/callback/route.ts` - track signup
- [ ] Update `src/app/api/upload/route.ts` - track first upload
- [ ] Update `src/app/api/rewrite/route.ts` - track first generation
- [ ] Update `src/app/subscription/page.tsx` - track viewed pricing
- [ ] Update upgrade modal - track clicked upgrade
- [ ] Update Stripe checkout - track started checkout
- [ ] Update webhook - track completed payment
- [ ] Test all tracking events in console
- [ ] Set up Google Analytics goals

**Checkpoint**: ✋ Verify tracking works before continuing

---

### **✅ PHASE 1 COMPLETE CHECKLIST**

Before moving to Phase 2, verify:
- [ ] Free users limited to 1 generation
- [ ] Watermarks appear on free exports
- [ ] AI Review blocked for free users
- [ ] Cover Letters blocked for free users
- [ ] Advanced templates blocked for free users
- [ ] Upgrade modal displays correctly
- [ ] Stripe checkout works (test mode)
- [ ] Webhook updates user to pro
- [ ] Pro users have unlimited access
- [ ] Conversion tracking logs events
- [ ] Dashboard shows tier status
- [ ] Subscription page looks professional

**Expected Result**: First conversion within 7 days! 🎉

---

## 🚀 PHASE 2: GROWTH FEATURES (Week 3-4)
**Goal**: Add high-value features to increase conversions  
**Expected Impact**: 2x signups, 20% higher conversion

### **SECTION 2.1: LinkedIn Integration**

**Objective**: Import CV from LinkedIn profile

**Tasks**:
- [ ] Research LinkedIn API/scraping options
- [ ] Create `src/app/api/linkedin/import/route.ts`
- [ ] Add "Import from LinkedIn" button to upload page
- [ ] Parse LinkedIn profile data
- [ ] Map to CV sections
- [ ] Save to database
- [ ] Show success message
- [ ] Gate: Free = 1 import, Pro = unlimited
- [ ] Test with sample LinkedIn profile

**Checkpoint**: ✋ Test LinkedIn import before continuing

---

### **SECTION 2.2: Job Board Integration**

**Objective**: Scrape job postings and auto-fill

**Tasks**:
- [ ] Create `src/app/api/jobs/scrape/route.ts`
- [ ] Add job URL input on generate page
- [ ] Scrape job description from URL
- [ ] Extract: title, company, description, requirements
- [ ] Auto-fill generation form
- [ ] Show "Scraped from [company]" badge
- [ ] Gate: Free = 1 job, Pro = unlimited
- [ ] Test with Indeed, LinkedIn, Reed URLs

**Checkpoint**: ✋ Test job scraping before continuing

---

### **SECTION 2.3: Interview Prep Assistant**

**Objective**: Generate interview questions + answers

**Tasks**:
- [ ] Create `src/app/interview-prep/page.tsx`
- [ ] Create `src/app/api/interview-prep/route.ts`
- [ ] Input: Job description + CV
- [ ] Generate 10 common interview questions
- [ ] Generate sample answers based on CV
- [ ] Add practice mode (timer, record answers)
- [ ] Gate: Free = 5 questions, Pro = unlimited
- [ ] Add to navigation menu
- [ ] Test question generation

**Checkpoint**: ✋ Test interview prep before continuing

---

### **SECTION 2.4: Salary Negotiation Tool**

**Objective**: Provide salary data and scripts

**Tasks**:
- [ ] Create `src/app/salary/page.tsx`
- [ ] Integrate salary API (Glassdoor/Indeed)
- [ ] Show salary range for role
- [ ] Generate negotiation scripts
- [ ] Provide counter-offer templates
- [ ] Gate: Free = see range, Pro = get scripts
- [ ] Add to navigation menu
- [ ] Test with various job titles

**Checkpoint**: ✋ Test salary tool before continuing

---

### **SECTION 2.5: Enhanced Onboarding Flow**

**Objective**: Guide new users to first generation

**Tasks**:
- [ ] Create `src/components/OnboardingModal.tsx`
- [ ] Step 1: "What's your goal?" (4 options)
- [ ] Step 2: "Upload CV or Import from LinkedIn"
- [ ] Step 3: "Let's create your first tailored CV"
- [ ] Step 4: Success + upgrade prompt
- [ ] Show only for new users (first login)
- [ ] Add skip option
- [ ] Track completion rate
- [ ] Test full flow

**Checkpoint**: ✋ Test onboarding before continuing

---

### **✅ PHASE 2 COMPLETE CHECKLIST**

Before moving to Phase 3, verify:
- [ ] LinkedIn import works
- [ ] Job scraping works
- [ ] Interview prep generates questions
- [ ] Salary tool shows data
- [ ] Onboarding guides new users
- [ ] All features properly gated
- [ ] Navigation updated
- [ ] Mobile responsive
- [ ] No console errors

**Expected Result**: 2x signups, 12%+ conversion rate! 🚀

---

## 💎 PHASE 3: VIRAL GROWTH (Week 5-6)
**Goal**: Implement referral program and content marketing  
**Expected Impact**: 50% more signups, viral growth

### **SECTION 3.1: Referral Program Database**

**Objective**: Track referrals and rewards

**Tasks**:
- [ ] Create `referrals` table in Supabase
- [ ] Columns: referrer_id, referee_id, status, reward_given
- [ ] Add `referral_code` to profiles table
- [ ] Add `referred_by` to profiles table
- [ ] Generate unique codes for all users
- [ ] Create RLS policies
- [ ] Test database operations

**Checkpoint**: ✋ Verify database before continuing

---

### **SECTION 3.2: Referral UI**

**Objective**: Let users share referral links

**Tasks**:
- [ ] Create `src/app/referrals/page.tsx`
- [ ] Show user's referral code
- [ ] Generate shareable link
- [ ] Add social share buttons (Twitter, LinkedIn, Email)
- [ ] Show referral stats (invited, signed up, upgraded)
- [ ] Show rewards earned
- [ ] Add to dashboard
- [ ] Test sharing functionality

**Checkpoint**: ✋ Test referral UI before continuing

---

### **SECTION 3.3: Referral Rewards Logic**

**Objective**: Give rewards when referrals convert

**Tasks**:
- [ ] Update signup flow to accept referral code
- [ ] Track referee signup
- [ ] Give referrer 5 free generations
- [ ] Give referee 2 free generations
- [ ] When referee upgrades, give referrer 1 month free
- [ ] Send email notifications
- [ ] Update dashboard with rewards
- [ ] Test full referral flow

**Checkpoint**: ✋ Test rewards before continuing

---

### **SECTION 3.4: Blog Setup**

**Objective**: Create SEO-optimized blog

**Tasks**:
- [ ] Create `src/app/blog/page.tsx`
- [ ] Create `src/app/blog/[slug]/page.tsx`
- [ ] Create `blog_posts` table in Supabase
- [ ] Add markdown support
- [ ] Add syntax highlighting
- [ ] Add social share buttons
- [ ] Add related posts
- [ ] Create 5 initial posts
- [ ] Test blog display

**Blog Post Ideas**:
1. "How to Beat ATS Systems in 2025"
2. "10 CV Mistakes That Cost You Interviews"
3. "The Perfect CV Template for Software Engineers"
4. "How I Got 5 Interviews in 1 Week"
5. "AI vs Human: Which Writes Better CVs?"

**Checkpoint**: ✋ Test blog before continuing

---

### **SECTION 3.5: Email Marketing Setup**

**Objective**: Automated email sequences

**Tasks**:
- [ ] Choose email provider (SendGrid/Mailgun/Resend)
- [ ] Create email templates
- [ ] Set up automated sequences
- [ ] Welcome email (Day 0)
- [ ] First generation prompt (Day 1)
- [ ] Upgrade reminder (Day 3)
- [ ] Special offer (Day 7)
- [ ] Re-engagement (Day 14)
- [ ] Test all emails

**Checkpoint**: ✋ Test emails before continuing

---

### **✅ PHASE 3 COMPLETE CHECKLIST**

Before moving to Phase 4, verify:
- [ ] Referral program works end-to-end
- [ ] Rewards are given correctly
- [ ] Blog is live with 5 posts
- [ ] Email sequences are active
- [ ] Social sharing works
- [ ] Analytics tracking referrals
- [ ] No spam complaints

**Expected Result**: 50% more signups, viral growth! 🎉

---

## 🎨 PHASE 4: ADVANCED FEATURES (Week 7-8)
**Goal**: Add premium features for higher-tier pricing  
**Expected Impact**: New revenue streams

### **SECTION 4.1: CV Roast Feature**

**Objective**: Viral CV roasting tool

**Tasks**:
- [ ] Create `src/app/roast/page.tsx`
- [ ] Upload CV for roasting
- [ ] AI generates humorous but helpful critique
- [ ] Show roast publicly (optional)
- [ ] Add share buttons
- [ ] Track viral shares
- [ ] Gate: Free = 1 roast, Pro = unlimited
- [ ] Test roast generation

**Checkpoint**: ✋ Test roast feature before continuing

---

### **SECTION 4.2: Interview Simulator (Premium)**

**Objective**: Video interview practice

**Tasks**:
- [ ] Create `src/app/interview-simulator/page.tsx`
- [ ] Record video/audio
- [ ] AI asks questions
- [ ] Analyze responses
- [ ] Provide feedback
- [ ] Premium feature: £14.99/month
- [ ] Add to pricing page
- [ ] Test recording

**Checkpoint**: ✋ Test simulator before continuing

---

### **SECTION 4.3: Career Path Predictor**

**Objective**: Show career trajectory

**Tasks**:
- [ ] Create `src/app/career-path/page.tsx`
- [ ] Analyze CV
- [ ] Predict career progression
- [ ] Show required skills
- [ ] Provide learning roadmap
- [ ] Gate: Free = prediction, Pro = roadmap
- [ ] Test predictions

**Checkpoint**: ✋ Test predictor before continuing

---

### **SECTION 4.4: Recruiter View**

**Objective**: See CV through recruiter's eyes

**Tasks**:
- [ ] Create `src/app/recruiter-view/page.tsx`
- [ ] Generate heatmap
- [ ] Show time spent per section
- [ ] Highlight what stands out
- [ ] One-time purchase: £4.99
- [ ] Add to pricing page
- [ ] Test heatmap generation

**Checkpoint**: ✋ Test recruiter view before continuing

---

### **✅ PHASE 4 COMPLETE CHECKLIST**

Before moving to Phase 5, verify:
- [ ] CV Roast is viral-ready
- [ ] Interview Simulator works
- [ ] Career Path shows predictions
- [ ] Recruiter View generates heatmaps
- [ ] All premium features properly gated
- [ ] Pricing page updated
- [ ] Payment flows work

**Expected Result**: New revenue streams, £20+/user! 💰

---

## 📱 PHASE 5: MOBILE & POLISH (Week 9-10)
**Goal**: Mobile app and UX improvements  
**Expected Impact**: 30% more users, higher retention

### **SECTION 5.1: Mobile Optimization**

**Objective**: Perfect mobile experience

**Tasks**:
- [ ] Audit all pages on mobile
- [ ] Fix responsive issues
- [ ] Optimize touch targets
- [ ] Add mobile navigation
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Fix any layout issues

**Checkpoint**: ✋ Test on real devices before continuing

---

### **SECTION 5.2: Progressive Web App (PWA)**

**Objective**: Installable mobile app

**Tasks**:
- [ ] Create `manifest.json`
- [ ] Add service worker
- [ ] Add app icons
- [ ] Enable offline mode
- [ ] Add install prompt
- [ ] Test installation
- [ ] Test offline functionality

**Checkpoint**: ✋ Test PWA before continuing

---

### **SECTION 5.3: Performance Optimization**

**Objective**: Lightning-fast load times

**Tasks**:
- [ ] Run Lighthouse audit
- [ ] Optimize images
- [ ] Add lazy loading
- [ ] Minimize JavaScript
- [ ] Enable caching
- [ ] Add CDN
- [ ] Test page speed

**Checkpoint**: ✋ Verify performance before continuing

---

### **SECTION 5.4: A/B Testing Setup**

**Objective**: Test and optimize conversions

**Tasks**:
- [ ] Choose A/B testing tool (Vercel, Optimizely)
- [ ] Set up experiments
- [ ] Test pricing: £9.99 vs £12.99
- [ ] Test CTA: "Upgrade" vs "Go Pro"
- [ ] Test modal timing: 3s vs 5s
- [ ] Analyze results
- [ ] Implement winners

**Checkpoint**: ✋ Review A/B results before continuing

---

### **✅ PHASE 5 COMPLETE CHECKLIST**

Before moving to Phase 6, verify:
- [ ] Mobile experience is perfect
- [ ] PWA installs correctly
- [ ] Page speed > 90
- [ ] A/B tests running
- [ ] No mobile bugs
- [ ] Fast on 3G

**Expected Result**: 30% more mobile users! 📱

---

## 🌍 PHASE 6: SCALE & EXPAND (Week 11-12)
**Goal**: B2B, partnerships, international expansion  
**Expected Impact**: 10x revenue potential

### **SECTION 6.1: B2B University Package**

**Objective**: Sell to universities

**Tasks**:
- [ ] Create B2B pricing page
- [ ] Offer: £500/year for 100 students
- [ ] Add bulk user management
- [ ] Add admin dashboard for universities
- [ ] Create sales deck
- [ ] Reach out to 10 universities
- [ ] Close first B2B deal

**Checkpoint**: ✋ Get first B2B customer before continuing

---

### **SECTION 6.2: Career Coach Affiliate Program**

**Objective**: Recruit affiliates

**Tasks**:
- [ ] Create affiliate dashboard
- [ ] Generate tracking links
- [ ] Set commission: 30% recurring
- [ ] Create affiliate resources
- [ ] Recruit 10 career coaches
- [ ] Track affiliate sales
- [ ] Pay first commissions

**Checkpoint**: ✋ Get 10 affiliates before continuing

---

### **SECTION 6.3: International Expansion**

**Objective**: Launch in US, Canada, Australia

**Tasks**:
- [ ] Add multi-currency support
- [ ] USD, CAD, AUD pricing
- [ ] Localize content
- [ ] Add country selector
- [ ] Update SEO for each country
- [ ] Launch marketing campaigns
- [ ] Track international signups

**Checkpoint**: ✋ Get international users before continuing

---

### **✅ PHASE 6 COMPLETE CHECKLIST**

Before celebrating, verify:
- [ ] B2B package live
- [ ] First university customer
- [ ] 10+ active affiliates
- [ ] Multi-currency working
- [ ] International users signing up
- [ ] Revenue > £1,000/month

**Expected Result**: £1,000+ MRR, sustainable business! 🎉

---

## 📊 SUCCESS METRICS BY PHASE

| Phase | Timeline | Conversion | MRR | Users |
|-------|----------|------------|-----|-------|
| Phase 1 | Week 1-2 | 5% | £100 | 100 |
| Phase 2 | Week 3-4 | 10% | £200 | 150 |
| Phase 3 | Week 5-6 | 12% | £350 | 250 |
| Phase 4 | Week 7-8 | 15% | £500 | 350 |
| Phase 5 | Week 9-10 | 15% | £700 | 500 |
| Phase 6 | Week 11-12 | 15% | £1,000+ | 700+ |

---

## 🎯 HOW TO WORK THROUGH THIS

### **Step 1: Start with Phase 1, Section 1.1**
- Read the tasks carefully
- Complete each checkbox
- Test thoroughly
- Come back when done

### **Step 2: Report Progress**
- Tell me: "Section 1.1 complete"
- I'll review and give next steps
- Or help if you're stuck

### **Step 3: Move to Next Section**
- Only after previous section works
- Don't skip checkpoints
- Test everything

### **Step 4: Celebrate Milestones**
- Each phase completion = win!
- Track your progress
- See the revenue grow

---

## 🚨 IMPORTANT NOTES

### **Don't Skip Checkpoints**
- Each checkpoint is critical
- Test before moving forward
- Bugs compound if not caught early

### **Test with Real Users**
- Use your own account (free tier)
- Create test pro account
- Try to break things

### **Track Everything**
- Monitor conversion events
- Watch Google Analytics
- Check Stripe dashboard

### **Iterate Based on Data**
- If something doesn't work, adjust
- A/B test variations
- Double down on winners

---

## 🎉 READY TO START?

**Begin with Phase 1, Section 1.1: Database Schema Updates**

When you complete it, come back and say:
> "Section 1.1 complete - database updated"

And I'll guide you through Section 1.2!

**Let's turn those signups into revenue! 🚀**

---

**Last Updated**: October 23, 2025  
**Status**: Ready to implement  
**Expected Timeline**: 12 weeks to £1,000+ MRR
