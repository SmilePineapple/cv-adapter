# MCP Configuration Guide - SEO & Google Analytics

## Current Status

✅ **SEO MCP**: Installed and configured with CapSolver API key  
✅ **Google Analytics MCP**: Installed, awaiting Google Cloud credentials

## MCP Configuration File Location

**Path**: `C:\Users\jaket\.codeium\windsurf\mcp_config.json`

## Step-by-Step Setup

### Part 1: Google Analytics MCP Configuration

#### 1. Enable Google Cloud APIs

Go to Google Cloud Console and enable:
- **Google Analytics Admin API**: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com
- **Google Analytics Data API**: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

#### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**: https://console.cloud.google.com/apis/credentials
2. Click **Create Credentials > OAuth client ID**
3. Choose **Desktop app** as application type
4. Name it "Google Analytics MCP"
5. Click **Create**
6. Click **Download JSON** and save as `client_secret.json`

#### 3. Install Google Cloud SDK (if not installed)

Download from: https://cloud.google.com/sdk/docs/install

#### 4. Authenticate with Google Cloud

Open PowerShell and run:

```powershell
# Navigate to where you saved client_secret.json
cd C:\path\to\your\downloads

# Set up Application Default Credentials
gcloud auth application-default login `
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform `
  --client-id-file="client_secret.json"
```

This will:
1. Open your browser
2. Ask you to sign in with Google
3. Grant permissions
4. Save credentials to: `C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json`

#### 5. Get Your Google Analytics Property ID

1. Go to Google Analytics: https://analytics.google.com/
2. Click **Admin** (gear icon at bottom left)
3. Under **Property**, click **Property Settings**
4. Copy your **Property ID** (looks like: `123456789`)

**For My CV Buddy**: The property ID should be visible in your GA4 dashboard.

#### 6. Add Google Analytics MCP to Configuration

Edit `C:\Users\jaket\.codeium\windsurf\mcp_config.json` and add this entry to the `mcpServers` object:

```json
"google-analytics": {
  "command": "python",
  "args": [
    "-m",
    "ga4_mcp"
  ],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\AppData\\Roaming\\gcloud\\application_default_credentials.json",
    "GA4_PROPERTY_ID": "YOUR_PROPERTY_ID_HERE"
  }
}
```

**Replace `YOUR_PROPERTY_ID_HERE`** with your actual GA4 Property ID from step 5.

### Part 2: Verify Configuration

Your complete `mcp_config.json` should look like this:

```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "python",
      "args": ["-m", "seo_mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-D148CBC4BCFEF5B0DCD9FD8FE1A7ED07F69E8957810AFAE6D2A4B1EDAB8D8E84"
      }
    },
    "google-analytics": {
      "command": "python",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\AppData\\Roaming\\gcloud\\application_default_credentials.json",
        "GA4_PROPERTY_ID": "YOUR_PROPERTY_ID_HERE"
      }
    },
    ... (other MCP servers)
  }
}
```

### Part 3: Restart Windsurf

After updating the configuration:
1. Save the file
2. Close Windsurf completely
3. Reopen Windsurf
4. Both MCP servers should load automatically

## Available Tools

### SEO MCP Tools

1. **Keyword Research**
   - Find related keywords
   - Analyze keyword difficulty
   - Get search volume data

2. **Competitor Analysis**
   - Analyze competitor rankings
   - Compare backlink profiles
   - Identify content gaps

3. **Technical SEO Audit**
   - Check page speed
   - Analyze meta tags
   - Verify structured data

4. **Content Optimization**
   - Analyze content quality
   - Check keyword density
   - Suggest improvements

5. **Backlink Analysis**
   - Find backlink opportunities
   - Analyze link quality
   - Track new/lost links

### Google Analytics Tools

1. **Traffic Analysis**
   - Get page views, sessions, users
   - Analyze traffic sources
   - Track conversion rates

2. **Real-time Data**
   - Current active users
   - Real-time events
   - Live traffic sources

3. **Audience Insights**
   - Demographics
   - Interests
   - Devices & locations

4. **Acquisition Reports**
   - Traffic channels
   - Source/Medium
   - Campaigns

5. **Behavior Analysis**
   - Top pages
   - Landing pages
   - Exit pages

## Using Both MCPs Together for Traffic Recovery

### Immediate Analysis Plan

#### 1. Analyze the Traffic Drop (Feb 13, 2026)

**Google Analytics MCP**:
```
Get daily traffic data from January 1 to March 25, 2026
Show traffic by source (organic, direct, referral) for February 2026
Get top 20 pages by traffic for February vs March 2026
```

**SEO MCP**:
```
Audit https://www.mycvbuddy.com for technical SEO issues
Analyze why organic traffic might have dropped
Check for indexing issues
```

#### 2. Keyword Research & Analysis

**Google Analytics MCP**:
```
Get top landing pages from organic search
Get search queries (if available)
Show pages with declining traffic
```

**SEO MCP**:
```
Research keywords: "cv builder uk", "free cv builder uk", "ats cv optimizer"
Analyze competitors for these keywords
Find keyword opportunities we're missing
```

#### 3. Identify Quick Wins

**Google Analytics MCP**:
```
Get pages with high bounce rate
Get pages with low time on page
Identify conversion drop-off points
```

**SEO MCP**:
```
Audit high-bounce pages for SEO issues
Suggest content improvements
Optimize for better engagement
```

#### 4. Content Strategy

**Google Analytics MCP**:
```
Get top performing content
Identify content gaps
Analyze user behavior flow
```

**SEO MCP**:
```
Research content topics for target keywords
Analyze competitor content strategy
Suggest new content ideas
```

### Weekly Monitoring Plan

**Monday**: Traffic Review
- GA: Get weekly traffic summary
- SEO: Check keyword rankings
- Compare to previous week

**Wednesday**: Content Performance
- GA: Analyze top pages
- SEO: Audit underperforming pages
- Plan optimizations

**Friday**: Competitor Analysis
- GA: Compare traffic sources
- SEO: Analyze competitor movements
- Adjust strategy

## Expected Results Timeline

### Week 1 (Mar 25 - Apr 1)
- ✅ Complete setup and configuration
- 📊 Analyze traffic drop data
- 🔍 Identify top 20 target keywords
- 🔧 Fix critical technical SEO issues

### Week 2-4 (Apr 2026)
- 📈 Implement SEO recommendations
- ✍️ Optimize top 10 pages
- 📝 Create new content for target keywords
- 📊 Monitor traffic recovery

### Month 2-3 (May-Jun 2026)
- 🎯 See traffic stabilize at 100+ impressions/day
- 📈 Get some keywords to page 2
- 🔗 Build 15-20 quality backlinks
- 💰 Improve conversion rate

### Month 6 (Sep 2026)
- 🚀 Traffic returns to pre-drop levels
- 🏆 Multiple page 1 rankings
- 💯 50+ quality backlinks
- 📊 1,000+ monthly organic visitors

## Troubleshooting

### Google Analytics MCP Not Loading

**Check credentials**:
```powershell
Test-Path "C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json"
```

**Re-authenticate if needed**:
```powershell
gcloud auth application-default login `
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform
```

### SEO MCP Not Working

**Check CapSolver credits**:
- Go to https://www.capsolver.com/
- Verify you have credits
- Check API key is valid

**Test the module**:
```powershell
python -c "import seo_mcp; print('SEO MCP OK')"
```

### Property ID Issues

**Verify Property ID**:
1. Go to GA4 dashboard
2. Admin > Property Settings
3. Copy the exact Property ID
4. Update in mcp_config.json

## Next Actions

1. ✅ SEO MCP is ready to use
2. ⏳ Complete Google Cloud setup (steps 1-4 above)
3. ⏳ Add GA4 Property ID to config
4. ⏳ Restart Windsurf
5. 🚀 Start analyzing traffic and optimizing!

---

**Status**: SEO MCP ✅ Ready | Google Analytics MCP ⏳ Awaiting credentials  
**Next**: Complete Google Cloud authentication and add Property ID  
**Goal**: Recover 85% traffic drop and improve rankings
