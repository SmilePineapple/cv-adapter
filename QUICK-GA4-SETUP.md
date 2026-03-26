# Quick GA4 Property ID Setup

## Finding Your GA4 Property ID

### Method 1: From Google Analytics Dashboard (Easiest)

1. Go to **Google Analytics**: https://analytics.google.com/
2. Make sure you're viewing the **My CV Buddy** property
3. Click the **Admin** gear icon (bottom left)
4. Under the **Property** column (middle column), click **Property Settings**
5. Your **Property ID** will be displayed at the top
   - Format: A number like `123456789` or `G-XXXXXXXXXX`
   - Example: `449362847` or `G-ABCD1234EF`

### Method 2: From Any GA4 Page

1. Go to https://analytics.google.com/
2. Look at the URL in your browser
3. The Property ID is in the URL after `/p/`
   - Example URL: `https://analytics.google.com/analytics/web/#/p123456789/reports/...`
   - Property ID: `123456789`

### Method 3: From Data Streams

1. Go to **Admin** → **Data Streams**
2. Click on your website stream
3. The **Measurement ID** (starts with `G-`) is shown
4. The Property ID is the number in the URL or shown in Property Settings

## Once You Have the Property ID

Update your MCP config file at:
`C:\Users\jaket\.codeium\windsurf\mcp_config.json`

Replace `YOUR_PROPERTY_ID` with your actual Property ID:

```json
"google-analytics": {
  "command": "python",
  "args": ["-m", "ga4_mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\jaket\\AppData\\Roaming\\gcloud\\application_default_credentials.json",
    "GA4_PROPERTY_ID": "123456789"
  }
}
```

**Note**: Use just the number (e.g., `123456789`), not the `G-` measurement ID.

---

## Installing gcloud CLI (For Authentication)

Since gcloud isn't recognized, you need to install it:

### Step 1: Download Google Cloud SDK

Go to: https://cloud.google.com/sdk/docs/install-sdk#windows

Or direct download: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

### Step 2: Run the Installer

1. Run `GoogleCloudSDKInstaller.exe`
2. Follow the installation wizard
3. **Important**: Check the box "Run 'gcloud init'" at the end
4. This will open a new terminal window

### Step 3: Restart PowerShell

After installation, close and reopen PowerShell so it recognizes the `gcloud` command.

### Step 4: Authenticate

Now run this command (replace the path with your actual Downloads folder):

```powershell
gcloud auth application-default login `
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform `
  --client-id-file="C:\Users\jaket\Downloads\client_secret.json"
```

This will:
1. Open your browser
2. Ask you to sign in with Google
3. Grant permissions
4. Save credentials automatically

---

## Alternative: Skip gcloud for Now

If you want to test the SEO MCP first while setting up GA later:

### You Can Use SEO MCP Right Now!

The SEO MCP is already working. Try these commands in Windsurf:

```
@seo-mcp Research keywords for "cv builder uk"
@seo-mcp Analyze competitors for "free cv builder uk"
@seo-mcp Audit https://www.mycvbuddy.com
```

This will help us start the traffic recovery while you complete the GA setup.

---

## Summary

**Right Now**:
1. Get GA4 Property ID from Google Analytics (5 minutes)
2. Update mcp_config.json with the Property ID
3. Test SEO MCP while GA setup completes

**Next**:
1. Download and install gcloud CLI (10 minutes)
2. Restart PowerShell
3. Run authentication command with correct path to client_secret.json
4. Restart Windsurf

**Then**:
Both MCPs will be fully operational and we can start analyzing traffic!
