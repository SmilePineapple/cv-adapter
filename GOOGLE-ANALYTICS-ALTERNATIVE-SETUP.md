# Google Analytics MCP - Alternative Setup

## Issue: OAuth Client Not Verified

Your OAuth client shows:
```
Error 403: access_denied
CV Adapter has not completed the Google verification process
```

This happens because the OAuth client needs Google verification for production use.

## Solution Options

### Option 1: Use Service Account (RECOMMENDED - Works Immediately)

Service accounts don't require OAuth verification and work right away.

#### Steps:

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/
   - Select project: `uplifted-sphinx-458311-e0`

2. **Create Service Account**
   - Navigate to: IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name: `ga4-mcp-service`
   - Click "Create and Continue"
   - Skip role assignment (we'll add in GA4)
   - Click "Done"

3. **Create Service Account Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the JSON file
   - Save it to: `C:\Users\jaket\Desktop\service-account-key.json`

4. **Add Service Account to Google Analytics**
   - Go to: https://analytics.google.com/
   - Select your property (ID: 507115921)
   - Click Admin (bottom left)
   - Under "Property" column, click "Property Access Management"
   - Click the "+" button (top right)
   - Click "Add users"
   - Enter the service account email (looks like: `ga4-mcp-service@uplifted-sphinx-458311-e0.iam.gserviceaccount.com`)
   - Select role: "Viewer"
   - Click "Add"

5. **Update MCP Config**
   
   Edit: `C:\Users\jaket\.codeium\windsurf\mcp_config.json`
   
   Change the `google-analytics` section to:
   ```json
   "google-analytics": {
     "command": "python",
     "args": ["-m", "ga4_mcp"],
     "env": {
       "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\Desktop\\service-account-key.json",
       "GA4_PROPERTY_ID": "507115921"
     }
   }
   ```

6. **Restart Windsurf**

**DONE!** Service account authentication works immediately without verification.

---

### Option 2: Verify OAuth Client (Takes 1-4 Weeks)

If you want to use OAuth instead:

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/apis/credentials/consent
   - Select project: `uplifted-sphinx-458311-e0`

2. **Configure OAuth Consent Screen**
   - User Type: External
   - Fill in app information
   - Add test users (your email)
   - Save

3. **Submit for Verification** (if needed for production)
   - Provide app details
   - Explain use case
   - Wait 1-4 weeks for approval

**For now, use Option 1 (Service Account) - it's faster and works immediately.**

---

### Option 3: Add Yourself as Test User (Quick Workaround)

While OAuth client is unverified, you can add yourself as a test user:

1. **Go to OAuth Consent Screen**
   - https://console.cloud.google.com/apis/credentials/consent
   - Select project: `uplifted-sphinx-458311-e0`

2. **Add Test Users**
   - Scroll to "Test users"
   - Click "Add Users"
   - Add: `jakedalerourke@gmail.com`
   - Save

3. **Try Authentication Again**
   ```powershell
   gcloud auth application-default login --scopes="https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform" --client-id-file="C:\Users\jaket\Desktop\client_secret.json"
   ```

4. **Restart Windsurf**

---

## Recommended: Use Service Account

**Why?**
- Works immediately (no verification needed)
- More secure for server-side applications
- No browser authentication required
- Better for automation

**Steps Summary:**
1. Create service account in Google Cloud
2. Download JSON key
3. Add service account email to GA4 property as Viewer
4. Update MCP config with service account key path
5. Restart Windsurf

**Time Required:** 5-10 minutes

---

## Current Status

- ✅ gcloud CLI installed and authenticated
- ✅ GA4 Property ID: 507115921
- ❌ OAuth client blocked (not verified)
- ⏳ Need to use service account instead

---

## What Happens After Setup

Once Google Analytics MCP is working, I'll immediately:

1. **Analyze Traffic Drop**
   - Get daily traffic from Jan 1 - Mar 25, 2026
   - Confirm Feb 13 drop (85% decrease)
   - Identify which pages lost traffic
   - See which traffic sources dropped

2. **Keyword Analysis**
   - Which keywords disappeared
   - Which keywords are still ranking
   - Opportunity keywords to target

3. **Create Data-Driven Plan**
   - Which pages to optimize first
   - What content to create
   - Where to get backlinks
   - Timeline and priorities

---

**Recommended Next Step:** Create service account (5 minutes) - it's the fastest path to getting GA MCP working.
