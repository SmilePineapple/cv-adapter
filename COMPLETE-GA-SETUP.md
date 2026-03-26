# Complete Google Analytics MCP Setup

## ✅ gcloud CLI Installed Successfully!

You're authenticated as: `jakedalerourke@gmail.com`
Project: `uplifted-sphinx-458311-e0`

## Final Steps to Enable Google Analytics MCP

### Step 1: Restart PowerShell (REQUIRED)

**Close and reopen PowerShell** so it recognizes the `gcloud` command.

### Step 2: Run Authentication Command

Once PowerShell is restarted, run:

```powershell
cd C:\Users\jaket\Desktop
gcloud auth application-default login --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform --client-id-file="client_secret.json"
```

This will:
1. Open your browser
2. Ask you to sign in with Google
3. Grant Analytics permissions
4. Save credentials to: `C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json`

### Step 3: Verify Credentials File

After authentication, check the file exists:

```powershell
Test-Path "C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json"
```

Should return: `True`

### Step 4: Restart Windsurf

Close and reopen Windsurf completely. Both MCPs will load automatically.

---

## What Happens Next (I'll Do This)

Once both MCPs are working, I'll immediately:

### 1. Analyze Traffic Drop (Google Analytics MCP)
```
Get daily traffic from Jan 1 - Mar 25, 2026
Identify exact drop on Feb 13
See which pages lost traffic
Analyze traffic sources (organic, direct, referral)
```

### 2. Keyword Research (SEO MCP)
```
Research "resume adapter" - your primary keyword
Research "cv builder uk" - high volume
Research "free cv builder uk" - high intent
Research "ats cv optimizer" - conversion keyword
Research "ai cv builder uk" - trending
```

### 3. Competitor Analysis (SEO MCP)
```
Identify top 5 competitors for each keyword
Analyze their content strategy
Find their backlink sources
Identify content gaps we can fill
```

### 4. Technical SEO Audit (SEO MCP)
```
Full site audit for technical issues
Page speed analysis
Mobile optimization check
Structured data validation
```

### 5. Create Optimization Plan
Based on all data:
- Which pages to optimize first
- Which keywords to target
- What content to create
- Where to get backlinks
- Timeline and priorities

---

## Expected Timeline

### Today (Once Setup Complete)
- Full traffic analysis
- Keyword research complete
- Competitor analysis done
- Optimization plan created

### This Week
- Implement all quick wins
- Create 2 downloadable PDFs
- Submit to 10 directories
- Optimize top 3 pages

### Month 1 (April 2026)
- Traffic returns to 100+ impressions/day
- 15-20 quality backlinks
- 4 new blog posts
- Page 2 rankings for target keywords

### Month 6 (September 2026)
- **GOAL**: Full traffic recovery
- **GOAL**: Page 1 for "resume adapter"
- **GOAL**: 1,000+ monthly organic visitors
- **GOAL**: 100+ quality backlinks

---

## Quick Reference

**Your GA4 Property ID**: `507115921` (already in config)

**MCP Config Location**: `C:\Users\jaket\.codeium\windsurf\mcp_config.json`

**Credentials Will Be At**: `C:\Users\jaket\AppData\Roaming\gcloud\application_default_credentials.json`

---

## Troubleshooting

### If gcloud still not recognized after restart
Check if it's in PATH:
```powershell
$env:PATH -split ';' | Select-String -Pattern "Google"
```

If not found, add manually:
```powershell
$env:PATH += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
```

### If authentication fails
1. Make sure `client_secret.json` is on your Desktop
2. Try with full path:
```powershell
gcloud auth application-default login --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform --client-id-file="C:\Users\jaket\Desktop\client_secret.json"
```

---

**Status**: ⏳ Waiting for PowerShell restart and authentication  
**Next**: Run authentication command, restart Windsurf, then I'll start full analysis  
**Ready**: SEO MCP is already working, GA MCP will work after auth
