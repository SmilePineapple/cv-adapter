# Traffic Recovery Action Plan - My CV Buddy

## Current Situation

**Traffic Drop**: 85% decrease on February 13, 2026  
**Current Status**: Still 25% below pre-drop levels  
**Primary Issue**: Lost organic search visibility  
**Target Keywords**: "resume adapter", "cv builder uk", "free cv builder uk", "ats cv optimizer"

## Tools Now Available

✅ **SEO MCP**: Installed with CapSolver API key  
✅ **Google Analytics MCP**: Installed, awaiting Google Cloud credentials

## Immediate Setup Required (You Need to Do This)

### Step 1: Enable Google Cloud APIs (5 minutes)

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project (or create one)
3. Enable these APIs:
   - **Google Analytics Admin API**: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com
   - **Google Analytics Data API**: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

### Step 2: Create OAuth Credentials (5 minutes)

1. Go to **APIs & Services > Credentials**: https://console.cloud.google.com/apis/credentials
2. Click **Create Credentials > OAuth client ID**
3. Choose **Desktop app**
4. Name it "Google Analytics MCP"
5. Click **Create**
6. **Download JSON** and save as `client_secret.json`

### Step 3: Install Google Cloud SDK (10 minutes)

Download and install from: https://cloud.google.com/sdk/docs/install

### Step 4: Authenticate (5 minutes)

Open PowerShell and run:

```powershell
# Navigate to where you saved client_secret.json
cd C:\path\to\your\downloads

# Authenticate
gcloud auth application-default login `
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform `
  --client-id-file="client_secret.json"
```

This will save credentials to:
`C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json`

### Step 5: Get Your GA4 Property ID (2 minutes)

1. Go to Google Analytics: https://analytics.google.com/
2. Click **Admin** (gear icon)
3. Under **Property**, click **Property Settings**
4. Copy your **Property ID** (e.g., `123456789`)

### Step 6: Update MCP Configuration (2 minutes)

Edit `C:\Users\jaket\.codeium\windsurf\mcp_config.json` and add:

```json
"google-analytics": {
  "command": "python",
  "args": ["-m", "ga4_mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\AppData\\Roaming\\gcloud\\application_default_credentials.json",
    "GA4_PROPERTY_ID": "YOUR_PROPERTY_ID_HERE"
  }
}
```

Replace `YOUR_PROPERTY_ID_HERE` with your actual Property ID.

### Step 7: Restart Windsurf

Close and reopen Windsurf completely.

---

## Once Configured: Immediate Analysis Plan

### Phase 1: Understand the Problem (Day 1)

#### 1.1 Analyze Traffic Drop
```
@google-analytics Get daily traffic from Jan 1 to Mar 25, 2026
@google-analytics Show traffic by source for February 2026
@google-analytics Compare Feb 1-12 vs Feb 13-28 traffic
```

**Expected Output**:
- Confirm 85% drop on Feb 13
- Identify which traffic sources dropped (organic, direct, referral)
- See which pages lost the most traffic

#### 1.2 Identify Affected Pages
```
@google-analytics Get top 20 pages by traffic for Feb 1-12
@google-analytics Get top 20 pages by traffic for Feb 13-28
@google-analytics Show pages with biggest traffic decrease
```

**Expected Output**:
- Homepage traffic change
- Landing page performance
- Which pages maintained traffic

#### 1.3 Technical SEO Audit
```
@seo-mcp Audit https://www.mycvbuddy.com
@seo-mcp Check indexing status
@seo-mcp Analyze site speed
@seo-mcp Verify mobile-friendliness
```

**Expected Output**:
- Technical issues found
- Indexing problems
- Page speed issues
- Mobile UX problems

### Phase 2: Keyword Research (Day 1-2)

#### 2.1 Current Keyword Performance
```
@google-analytics Get landing pages from organic search
@google-analytics Show search queries (if available)
```

**Expected Output**:
- Which keywords are still working
- Which keywords dropped
- New keyword opportunities

#### 2.2 Target Keyword Research
```
@seo-mcp Research keywords "cv builder uk"
@seo-mcp Research keywords "free cv builder uk"
@seo-mcp Research keywords "ats cv optimizer"
@seo-mcp Research keywords "resume adapter"
@seo-mcp Research keywords "cv maker online free"
```

**Expected Output**:
- Search volume for each keyword
- Keyword difficulty
- Related keywords
- Long-tail opportunities

#### 2.3 Competitor Analysis
```
@seo-mcp Analyze competitors for "cv builder uk"
@seo-mcp Analyze competitors for "free cv builder uk"
@seo-mcp Find backlink opportunities
```

**Expected Output**:
- Who's ranking page 1
- Their content strategy
- Their backlink profile
- Content gaps we can fill

### Phase 3: Content Optimization (Day 2-7)

#### 3.1 Homepage Optimization
```
@seo-mcp Optimize content for https://www.mycvbuddy.com/
@seo-mcp Suggest meta tag improvements
@seo-mcp Analyze keyword density
@seo-mcp Recommend internal linking
```

**Actions**:
- Update title tag with primary keyword
- Improve meta description
- Add FAQ section (already planned)
- Add user testimonials
- Optimize H1/H2 tags
- Improve internal linking

#### 3.2 Key Landing Pages
```
@seo-mcp Optimize https://www.mycvbuddy.com/ats-optimization-guide
@seo-mcp Optimize https://www.mycvbuddy.com/cv-writing-guide
@seo-mcp Optimize https://www.mycvbuddy.com/cv-examples
```

**Actions**:
- Expand content to 2,000+ words
- Add more examples
- Improve keyword targeting
- Add downloadable resources
- Build internal links

#### 3.3 Fix Technical Issues
Based on SEO audit results:
- Fix any broken links
- Improve page speed
- Optimize images
- Fix mobile issues
- Improve Core Web Vitals

### Phase 4: Content Creation (Week 2-4)

#### 4.1 Create New High-Value Content
Based on keyword research:
- Cover Letter Writing Guide (2,500+ words)
- LinkedIn Profile Optimization (2,000+ words)
- Salary Negotiation Guide (1,500+ words)
- Career Change Guide (2,000+ words)

#### 4.2 Downloadable Resources
- CV Writing Checklist (PDF)
- ATS Optimization Checklist (PDF)
- Interview Questions Cheat Sheet (PDF)
- CV Template Pack (DOCX)

### Phase 5: Authority Building (Week 2-8)

#### 5.1 Backlink Acquisition
```
@seo-mcp Find backlink opportunities for "cv builder"
@seo-mcp Analyze competitor backlinks
```

**Actions**:
- Submit to 10 CV builder directories
- Post on Product Hunt
- Share on Hacker News
- Reddit posts (r/jobs, r/careerguidance)
- LinkedIn articles
- Quora answers

**Target**: 15-20 backlinks in first month

#### 5.2 Guest Posting
- Reach out to career blogs
- Pitch to UK job sites
- Contact university career services
- Partner with career coaches

**Target**: 5 guest posts in first 2 months

### Phase 6: Monitoring & Iteration (Ongoing)

#### Daily (Next 30 days)
```
@google-analytics Get yesterday's traffic
@seo-mcp Check keyword rankings
```

**Track**:
- Daily organic traffic
- Keyword position changes
- New backlinks
- Indexing status

#### Weekly
```
@google-analytics Get weekly traffic summary
@google-analytics Show top performing pages
@seo-mcp Analyze competitor movements
```

**Review**:
- Traffic trends
- Content performance
- Ranking changes
- Competitor activity

#### Monthly
```
@google-analytics Get monthly traffic comparison
@google-analytics Analyze conversion funnel
@seo-mcp Full site audit
```

**Assess**:
- Overall traffic recovery
- Keyword rankings
- Backlink growth
- Conversion rate

## Success Metrics

### Week 1 (Mar 25 - Apr 1)
- [ ] Both MCPs configured and working
- [ ] Traffic drop analyzed and understood
- [ ] Top 20 target keywords identified
- [ ] Technical SEO issues fixed
- [ ] Homepage optimized

### Month 1 (Apr 2026)
- [ ] Impressions return to 100+ per day
- [ ] 3-5 keywords on page 2
- [ ] 15-20 quality backlinks acquired
- [ ] 5 new content pages published
- [ ] Click-through rate improves to 3%+

### Month 2 (May 2026)
- [ ] Impressions reach 200+ per day
- [ ] 5-10 keywords on page 2
- [ ] 30+ total backlinks
- [ ] 10 new content pages total
- [ ] Some page 1 rankings for long-tail keywords

### Month 3 (Jun 2026)
- [ ] Impressions reach 500+ per day
- [ ] 10+ keywords on page 2
- [ ] 50+ total backlinks
- [ ] 15 new content pages total
- [ ] Multiple page 1 rankings

### Month 6 (Sep 2026)
- [ ] **Traffic returns to pre-drop levels**
- [ ] **Page 1 for "resume adapter"**
- [ ] **Page 1 for 5+ target keywords**
- [ ] **100+ quality backlinks**
- [ ] **1,000+ monthly organic visitors**

## Why This Will Work

### 1. Data-Driven Decisions
- Google Analytics shows exactly what dropped
- SEO MCP identifies specific opportunities
- No guessing, only data-backed actions

### 2. Comprehensive Approach
- Technical SEO fixes
- Content optimization
- New content creation
- Authority building
- Continuous monitoring

### 3. Proven Strategies
- Following Google's guidelines
- Building real value for users
- Earning quality backlinks
- Creating comprehensive content

### 4. Competitive Advantages
- Already have a working product
- 23% traffic from ChatGPT (unique)
- 34% direct traffic (brand awareness)
- Good user engagement (237s avg)

## Next Steps

**Right Now** (30 minutes):
1. Enable Google Cloud APIs
2. Create OAuth credentials
3. Install gcloud CLI
4. Authenticate
5. Get GA4 Property ID
6. Update MCP config
7. Restart Windsurf

**Then** (Let me take over):
1. Analyze traffic drop with GA data
2. Research all target keywords
3. Audit site for technical issues
4. Create optimization plan
5. Start implementing fixes

---

**Status**: Tools ready, awaiting Google Cloud setup  
**Timeline**: 30 minutes to configure, then we start recovery  
**Goal**: Return to pre-drop traffic levels within 6 months  
**Confidence**: High - We have the data and tools to fix this
