# Google Analytics MCP Setup Guide

## Installation Status: ✅ COMPLETE

Google Analytics MCP has been successfully installed.

## What Was Installed

- **Package**: `google-analytics-mcp` v2.0.1
- **Dependencies**: 
  - `google-analytics-data` v0.19.0
  - `google-auth` v2.40.0
  - `google-api-core` v2.30.0
  - `grpcio` v1.78.0

## Next Steps to Configure

### 1. Enable Google Analytics APIs

Go to Google Cloud Console and enable these APIs:
1. **Google Analytics Admin API**: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com
2. **Google Analytics Data API**: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**: https://console.cloud.google.com/apis/credentials
2. Click **Create Credentials > OAuth client ID**
3. Choose **Desktop app** as application type
4. Download the JSON file (save as `client_secret.json`)

### 3. Set Up Application Default Credentials (ADC)

**Option A: Using OAuth Desktop Client** (Recommended)

```powershell
# Install gcloud CLI if not already installed
# Download from: https://cloud.google.com/sdk/docs/install

# Set up ADC with your OAuth client
gcloud auth application-default login `
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform `
  --client-id-file="C:\path\to\your\client_secret.json"
```

**Option B: Using Service Account Impersonation**

```powershell
gcloud auth application-default login `
  --impersonate-service-account=YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com `
  --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform
```

### 4. Note the Credentials Path

After running the gcloud command, you'll see:
```
Credentials saved to file: [PATH_TO_CREDENTIALS_JSON]
```

**Copy this path!** You'll need it for the MCP configuration.

Common locations:
- Windows: `C:\Users\YOUR_USERNAME\AppData\Roaming\gcloud\application_default_credentials.json`
- Mac/Linux: `~/.config/gcloud/application_default_credentials.json`

### 5. Update MCP Configuration

Add this to your `C:\Users\jaket\.codeium\windsurf\mcp_config.json`:

```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "python",
      "args": [
        "-m",
        "google_analytics_mcp"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\AppData\\Roaming\\gcloud\\application_default_credentials.json"
      }
    }
  }
}
```

**Important**: Replace the path with your actual credentials path from step 4.

### 6. Get Your Google Analytics Property ID

1. Go to Google Analytics: https://analytics.google.com/
2. Click **Admin** (gear icon)
3. Under **Property**, click **Property Settings**
4. Copy your **Property ID** (format: `123456789`)

You'll need this to query your analytics data.

## Available Google Analytics Tools

Once configured, you'll have access to:

### 1. **Traffic Analysis**
- Get page views, sessions, users
- Analyze traffic sources
- Track conversion rates
- Monitor bounce rates

### 2. **Real-time Data**
- Current active users
- Real-time events
- Live traffic sources

### 3. **Audience Insights**
- Demographics
- Interests
- Devices
- Locations

### 4. **Acquisition Reports**
- Traffic channels
- Source/Medium
- Campaigns
- Keywords (limited due to "not provided")

### 5. **Behavior Analysis**
- Top pages
- Landing pages
- Exit pages
- Site search

### 6. **Custom Reports**
- Create custom dimensions
- Build custom metrics
- Filter and segment data

## How to Use with SEO MCP

Once both MCPs are configured, you can:

### Analyze Traffic Drop

```
@google-analytics Get traffic data for February 1-28, 2026
@seo-mcp Analyze why traffic dropped 85% on Feb 13
```

### Keyword Performance

```
@google-analytics Get top landing pages with organic traffic
@seo-mcp Research keywords for these pages
@seo-mcp Analyze competitors for these keywords
```

### Content Optimization

```
@google-analytics Get pages with high bounce rate
@seo-mcp Audit these pages for SEO issues
@seo-mcp Suggest content improvements
```

### Conversion Tracking

```
@google-analytics Get conversion funnel data
@seo-mcp Identify drop-off points
@seo-mcp Optimize for better conversions
```

## Troubleshooting

### "Could not load credentials"

1. Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
2. Check the JSON file exists and is readable
3. Ensure you ran `gcloud auth application-default login`

### "Permission denied"

1. Verify your Google account has access to the Analytics property
2. Check the OAuth scopes include `analytics.readonly`
3. Re-run the gcloud auth command with correct scopes

### "Property not found"

1. Verify the Property ID is correct
2. Ensure your authenticated user has access to this property
3. Check the property exists in Google Analytics

## Using for Traffic Recovery

### Immediate Analysis (Once Configured)

1. **Identify Traffic Drop**
   ```
   @google-analytics Get daily traffic for Jan 1 - Mar 25, 2026
   ```
   - Confirm the Feb 13 drop
   - See current traffic levels
   - Identify affected pages

2. **Analyze Traffic Sources**
   ```
   @google-analytics Get traffic by source for Feb 2026
   ```
   - See organic vs direct vs referral
   - Identify which sources dropped
   - Compare to previous months

3. **Top Pages Analysis**
   ```
   @google-analytics Get top 20 pages by traffic
   ```
   - See which pages lost traffic
   - Identify pages that maintained traffic
   - Find opportunities

4. **Keyword Research with SEO MCP**
   ```
   @seo-mcp Research keywords for "cv builder uk"
   @seo-mcp Analyze competitors for these keywords
   ```
   - Find high-value keywords
   - See what competitors rank for
   - Identify content gaps

5. **Technical SEO Audit**
   ```
   @seo-mcp Audit https://www.mycvbuddy.com
   ```
   - Check technical issues
   - Verify meta tags
   - Test page speed
   - Analyze mobile-friendliness

### Weekly Monitoring

1. **Traffic Trends**
   - Monitor daily organic traffic
   - Track recovery progress
   - Identify new issues early

2. **Keyword Rankings**
   - Track target keyword positions
   - Monitor competitor movements
   - Adjust strategy based on data

3. **Content Performance**
   - Analyze top-performing content
   - Identify underperforming pages
   - Optimize based on data

## Expected Results

### Week 1
- Complete GA setup and verification
- Analyze traffic drop data
- Identify top 20 target keywords
- Audit technical SEO issues

### Week 2-4
- Implement SEO recommendations
- Optimize top 10 pages
- Create new content for target keywords
- Monitor traffic recovery

### Month 2-3
- See traffic stabilize
- Get some keywords to page 2
- Improve click-through rates
- Build backlinks based on data

---

**Status**: ✅ Installed, ⏳ Awaiting Google Cloud Configuration  
**Next Action**: Enable APIs and create OAuth credentials  
**Documentation**: https://github.com/googleanalytics/google-analytics-mcp
