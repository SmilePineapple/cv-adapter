# 🚀 Quick Start: Crisp Chat Integration

## 5-Minute Setup

### Step 1: Create Crisp Account
1. Go to https://crisp.chat
2. Click "Sign Up Free"
3. Create account with your email
4. Create a website called "CV Adapter"

### Step 2: Get Your Website ID
1. In Crisp dashboard, go to **Settings** → **Website Settings**
2. Click **Setup Instructions**
3. Copy your **Website ID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 3: Add to Environment
Add to `.env.local`:
```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=your-website-id-here
```

### Step 4: Integrate Component
Add to `src/app/layout.tsx`:

```typescript
import CrispChat from '@/components/CrispChat'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CrispChat />
      </body>
    </html>
  )
}
```

### Step 5: Deploy
```bash
git add .env.local src/app/layout.tsx
git commit -m "feat: Integrate Crisp customer support"
git push origin main
```

Done! Chat widget will appear on your site.

---

## Recommended Settings

### Chatbox Appearance
- **Color**: #3B82F6 (CV Adapter blue)
- **Position**: Bottom right
- **Welcome message**: "Hi! Need help with your CV? 👋"

### Auto-Messages
**Welcome (on page visit):**
```
Hi there! 👋 Welcome to CV Adapter!

Need help with:
• Uploading your CV?
• Generating a new version?
• Exporting to PDF/DOCX?
• Upgrading to Pro?

Just ask! I'm here to help.
```

---

## Test It
1. Visit your site
2. Look for chat bubble in bottom right
3. Click to open
4. Send a test message
5. Reply from Crisp dashboard

That's it! You're live with customer support. 🎉

For full customization options, see `CUSTOMER-SUPPORT-SETUP.md`
