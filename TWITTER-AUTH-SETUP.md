# Twitter User Authentication Setup

## The Error
```
"You are not permitted to perform this action."
```

This means your Twitter app needs **User Authentication Settings** configured.

---

## Fix: Configure User Authentication

### Step 1: Go to Twitter Developer Portal

1. Visit: https://developer.twitter.com/en/portal/dashboard
2. Click on your app
3. Go to **"Settings"** tab
4. Scroll to **"User authentication settings"**

### Step 2: Set Up Authentication

Click **"Set up"** and configure:

**App permissions:**
- ✅ Select: **"Read and Write"**

**Type of App:**
- ✅ Select: **"Web App, Automated App or Bot"**

**App info:**
- **Callback URI / Redirect URL**: 
  ```
  https://www.mycvbuddy.com/api/auth/twitter/callback
  ```
- **Website URL**: 
  ```
  https://www.mycvbuddy.com
  ```
- **Organization name**: `CV Adapter`
- **Organization website**: `https://www.mycvbuddy.com`
- **Terms of service**: `https://www.mycvbuddy.com/terms` (optional)
- **Privacy policy**: `https://www.mycvbuddy.com/privacy` (optional)

**Client Type:**
- ✅ Select: **"Confidential client"**

Click **"Save"**

### Step 3: Regenerate Tokens AGAIN

After saving User Authentication Settings:

1. Go to **"Keys and tokens"** tab
2. Under **"Access Token and Secret"**
3. Click **"Regenerate"**
4. Copy the NEW tokens

### Step 4: Update Vercel Environment Variables AGAIN

With the newly regenerated tokens:

1. Go to Vercel Dashboard
2. Update environment variables
3. Redeploy

---

## Why This Happens

Twitter's API v2 requires:
1. ✅ App permissions: "Read and Write"
2. ✅ User authentication settings configured
3. ✅ Valid access tokens generated AFTER both above are set

If you set permissions but don't configure user auth, you get "not permitted" error.

---

## After Setup

Test the cron:
```
https://www.mycvbuddy.com/api/social-bot/cron
```

Should see:
```json
{
  "success": true,
  "results": {
    "posted": 1,
    "failed": 0
  }
}
```

Then check: https://x.com/JPicklejak5299
