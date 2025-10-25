# 🔑 Social Media API Setup Guide - Option B (Full Automation)

## ✅ Database Setup Complete!

Great! Now let's set up the social media APIs for full automation.

---

## 📋 **What I Need From You:**

### **Step 1: Create Social Media Accounts** (If you haven't already)

You'll need to create business/professional accounts on:
- [ ] Twitter/X
- [ ] LinkedIn (Company Page)
- [ ] Facebook (Business Page)
- [ ] Instagram (Business Account)

---

## 🔑 **API Keys Setup**

I'll guide you through getting API keys for each platform. **Don't worry, I'll help with every step!**

---

## 1️⃣ **TWITTER/X API SETUP**

### **What You'll Need:**
- Twitter/X account
- Developer account (free)
- App credentials

### **Steps:**

1. **Go to Twitter Developer Portal**
   - Visit: https://developer.twitter.com/en/portal/dashboard
   - Click "Sign up" if you don't have a developer account

2. **Create a New App**
   - Click "Create Project"
   - Name: "CV Adapter Social Bot"
   - Use case: "Making a bot"
   - Description: "Automated social media bot for CV Adapter"

3. **Get Your Keys**
   You'll need these 4 values:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret

4. **Enable Permissions**
   - Go to "User authentication settings"
   - Enable "Read and Write" permissions
   - Save changes

5. **Copy These Values:**
   ```
   API Key: [COPY THIS]
   API Secret: [COPY THIS]
   Access Token: [COPY THIS]
   Access Token Secret: [COPY THIS]
   ```

### **Send Me:**
```
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
TWITTER_USERNAME=your_twitter_username
```

---

## 2️⃣ **LINKEDIN API SETUP**

### **What You'll Need:**
- LinkedIn Company Page
- LinkedIn Developer App

### **Steps:**

1. **Create LinkedIn Company Page** (if you don't have one)
   - Go to: https://www.linkedin.com/company/setup/new/
   - Fill in company details
   - Verify your page

2. **Create Developer App**
   - Visit: https://www.linkedin.com/developers/apps
   - Click "Create app"
   - Name: "CV Adapter Social Bot"
   - LinkedIn Page: Select your company page
   - Submit for review

3. **Request Permissions**
   - Request "Share on LinkedIn" permission
   - Request "Sign In with LinkedIn" permission
   - Wait for approval (usually 24-48 hours)

4. **Get Your Keys**
   - Client ID
   - Client Secret

5. **Generate Access Token**
   - Use OAuth 2.0 flow to get access token
   - I can help you with this step!

### **Send Me:**
```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_COMPANY_ID=your_company_id_here
```

**Note:** LinkedIn is the most complex. I'll help you generate the access token once you have the Client ID and Secret.

---

## 3️⃣ **FACEBOOK API SETUP**

### **What You'll Need:**
- Facebook Business Page
- Facebook Developer App

### **Steps:**

1. **Create Facebook Business Page** (if you don't have one)
   - Go to: https://www.facebook.com/pages/create
   - Choose "Business or Brand"
   - Fill in details

2. **Create Developer App**
   - Visit: https://developers.facebook.com/apps
   - Click "Create App"
   - Type: "Business"
   - Name: "CV Adapter Social Bot"

3. **Add Facebook Login**
   - In your app dashboard
   - Click "Add Product"
   - Select "Facebook Login"

4. **Get Page Access Token**
   - Go to Graph API Explorer: https://developers.facebook.com/tools/explorer
   - Select your app
   - Select your page
   - Get "Page Access Token"
   - Click "Generate Access Token"
   - Grant permissions: `pages_manage_posts`, `pages_read_engagement`

5. **Make Token Long-Lived**
   - Use this URL (I'll help you):
   ```
   https://graph.facebook.com/oauth/access_token?
   grant_type=fb_exchange_token&
   client_id=YOUR_APP_ID&
   client_secret=YOUR_APP_SECRET&
   fb_exchange_token=YOUR_SHORT_TOKEN
   ```

### **Send Me:**
```
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_ACCESS_TOKEN=your_long_lived_token_here
```

---

## 4️⃣ **INSTAGRAM API SETUP**

### **What You'll Need:**
- Instagram Business Account
- Connected to Facebook Page

### **Steps:**

1. **Convert to Business Account**
   - Open Instagram app
   - Go to Settings → Account
   - Switch to Professional Account
   - Choose "Business"

2. **Connect to Facebook Page**
   - In Instagram settings
   - Go to "Linked Accounts"
   - Connect to your Facebook Business Page

3. **Get Instagram Business Account ID**
   - Go to Facebook Graph API Explorer
   - Use this query: `me/accounts`
   - Find your page
   - Use this query: `{page-id}?fields=instagram_business_account`
   - Copy the Instagram Business Account ID

4. **Use Facebook Access Token**
   - Instagram uses the same access token as Facebook
   - You'll need the Instagram Business Account ID

### **Send Me:**
```
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_id_here
INSTAGRAM_ACCESS_TOKEN=same_as_facebook_token
```

---

## 🚀 **QUICK START OPTION**

### **Start with Just Twitter!**

Twitter is the easiest to set up. Let's start there:

1. Get Twitter API keys (steps above)
2. Send me the 4 keys
3. I'll configure it for you
4. Test with Twitter first
5. Add other platforms later

**This way you can see it working immediately!**

---

## 📝 **What to Send Me:**

### **Minimum (Twitter Only):**
```
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_TOKEN_SECRET=xxx
TWITTER_USERNAME=@your_handle
```

### **Full Setup (All Platforms):**
```
# Twitter
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_TOKEN_SECRET=xxx
TWITTER_USERNAME=@your_handle

# LinkedIn
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
LINKEDIN_COMPANY_ID=xxx

# Facebook
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_PAGE_ID=xxx
FACEBOOK_ACCESS_TOKEN=xxx

# Instagram
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx
INSTAGRAM_ACCESS_TOKEN=xxx
```

---

## 🔒 **Security Note:**

**NEVER share these keys publicly!**
- Send them to me in a private message
- I'll add them to your `.env.local` file
- They'll be stored securely in Supabase
- Never commit them to Git

---

## 🛠️ **What I'll Do Once You Send Keys:**

1. ✅ Add keys to `.env.local`
2. ✅ Store encrypted keys in Supabase
3. ✅ Configure each platform in database
4. ✅ Enable automated posting
5. ✅ Test posting to each platform
6. ✅ Set up monitoring

---

## ⏱️ **Time Estimates:**

- **Twitter Setup**: 15 minutes
- **Facebook Setup**: 20 minutes
- **LinkedIn Setup**: 30 minutes (+ approval wait)
- **Instagram Setup**: 10 minutes (if Facebook done)

**Total**: ~1-2 hours for all platforms

---

## 🎯 **Recommended Approach:**

### **Phase 1: Twitter Only** (Today)
1. Set up Twitter API
2. Test automated posting
3. Verify it works
4. Generate content for the week

### **Phase 2: Facebook** (This Week)
1. Set up Facebook API
2. Add to automation
3. Test posting

### **Phase 3: LinkedIn** (Next Week)
1. Apply for LinkedIn API access
2. Wait for approval
3. Set up once approved

### **Phase 4: Instagram** (Next Week)
1. Connect Instagram to Facebook
2. Add to automation
3. Complete setup

---

## 🆘 **Need Help?**

I'll help you with:
- ✅ Creating developer accounts
- ✅ Getting API keys
- ✅ Generating access tokens
- ✅ Configuring the bot
- ✅ Testing posts
- ✅ Troubleshooting issues

**Just send me the keys and I'll handle the technical setup!**

---

## 📞 **Next Steps:**

1. **Choose your approach:**
   - Option A: Start with Twitter only (quickest)
   - Option B: Set up all platforms at once

2. **Get API keys** (follow steps above)

3. **Send me the keys** (privately!)

4. **I'll configure everything** for you

5. **Test and launch!**

---

## 🎉 **Once Set Up:**

You'll have:
- ✅ Automated daily posting
- ✅ Content generated weekly
- ✅ Zero daily maintenance
- ✅ Analytics tracking
- ✅ Professional social presence

**Let's start with Twitter and get your first automated post live today!** 🚀

---

## 📋 **Checklist:**

- [ ] Create Twitter developer account
- [ ] Get Twitter API keys
- [ ] Send keys to me
- [ ] I configure the bot
- [ ] Generate first week of content
- [ ] Test first automated post
- [ ] Monitor and optimize

**Ready to start? Get those Twitter API keys and send them over!** 🎯
