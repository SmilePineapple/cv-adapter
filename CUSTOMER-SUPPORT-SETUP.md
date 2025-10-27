# 🎧 Customer Support System Setup Guide

## Overview
Complete customer support integration using Crisp Chat for CV Adapter.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Crisp Account
1. Go to [crisp.chat](https://crisp.chat)
2. Sign up for free account (Free tier includes: unlimited conversations, 2 operators, basic features)
3. Create a new website for "CV Adapter"
4. Copy your **Website ID** from Settings → Setup Instructions

### Step 2: Add to Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=your-website-id-here
```

### Step 3: Integrate into App
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

### Step 4: Deploy
```bash
git add .
git commit -m "feat: Add Crisp customer support chat"
git push origin main
```

Done! Chat widget will appear on all pages.

---

## 🎨 Customization Options

### Chat Widget Appearance
In Crisp Dashboard → Settings → Chatbox:
- **Position**: Bottom right (recommended)
- **Color**: #3B82F6 (CV Adapter blue)
- **Welcome message**: "Hi! Need help with your CV? 👋"
- **Availability**: Show as "Online" during business hours

### Auto-Messages
Set up in Crisp Dashboard → Chatbox → Scenarios:

**1. Welcome Message (Trigger: Page visit)**
```
Hi there! 👋 Welcome to CV Adapter!

Need help with:
• Uploading your CV?
• Generating a new version?
• Exporting to PDF/DOCX?
• Upgrading to Pro?

Just ask! I'm here to help.
```

**2. Idle Message (Trigger: 30 seconds on page)**
```
Still looking around? 🤔

Quick tip: You can upload your CV and get an AI-optimized version in under 2 minutes!

Need any help getting started?
```

**3. Exit Intent (Trigger: Mouse leaves window)**
```
Wait! Before you go... 🎯

Did you know:
✅ Free users get 1 CV generation
✅ Pro users get 100 generations for just £5
✅ All exports include ATS optimization

Have questions? I'm here!
```

---

## 🤖 AI-Powered Responses

### Enable AI Chatbot (Optional - Paid Feature)
Crisp offers MagicReply (AI responses):
1. Go to Plugins → MagicReply
2. Train on your FAQ content
3. Set to "Assist" mode (AI suggests, you approve)

### Common Questions to Train On:
```
Q: How do I upload my CV?
A: Click "Upload CV" on the dashboard, select your file (PDF, DOCX, or TXT), and we'll analyze it automatically!

Q: What's the difference between Free and Pro?
A: Free gives you 1 CV generation (lifetime). Pro gives you 100 generations for a one-time payment of £5.

Q: Can I export to PDF?
A: Yes! After generating your CV, click "Download" and choose PDF, DOCX, or TXT format.

Q: Is my data secure?
A: Absolutely! We use Supabase with row-level security. Your data is encrypted and only you can access it.

Q: What languages do you support?
A: We support 50+ languages! Upload your CV in any language and we'll detect it automatically.

Q: How does ATS optimization work?
A: Our AI analyzes job descriptions and optimizes your CV with relevant keywords, proper formatting, and ATS-friendly structure.
```

---

## 📊 Analytics & Insights

### Track Support Metrics
Crisp Dashboard → Analytics shows:
- **Response time**: Aim for <5 minutes
- **Resolution time**: Aim for <30 minutes
- **Customer satisfaction**: Aim for >4.5/5
- **Common questions**: Identify FAQ opportunities

### Integration with Your Analytics
Track support interactions in your analytics:

```typescript
// In CrispChat.tsx
useEffect(() => {
  if (window.$crisp) {
    window.$crisp.push(['on', 'message:sent', () => {
      // Track when user sends message
      trackEvent('support_message_sent')
    }])
    
    window.$crisp.push(['on', 'message:received', () => {
      // Track when user receives reply
      trackEvent('support_message_received')
    }])
  }
}, [])
```

---

## 🎯 Best Practices

### Response Templates
Create quick replies in Crisp for common questions:

**Template: Upload Help**
```
To upload your CV:
1. Go to your dashboard
2. Click "Upload CV" button
3. Select your file (PDF, DOCX, or TXT)
4. Wait for analysis to complete

Need more help? Let me know! 😊
```

**Template: Pricing Question**
```
Our pricing is simple:
• Free: 1 CV generation (lifetime)
• Pro: 100 generations for £5 (one-time payment)

Pro also includes:
✅ Priority support
✅ Advanced templates
✅ Cover letter generation
✅ Multi-language support

Want to upgrade? Click here: https://www.mycvbuddy.com/subscription
```

**Template: Technical Issue**
```
Sorry you're experiencing issues! 😔

Can you help me understand:
1. What were you trying to do?
2. What happened instead?
3. What browser are you using?

I'll get this sorted for you ASAP!
```

### Availability Hours
Set in Crisp Dashboard → Settings → Availability:
- **Online**: Monday-Friday, 9 AM - 6 PM GMT
- **Away**: Evenings and weekends
- **Auto-reply when offline**: "Thanks for reaching out! We're currently offline but will reply within 24 hours. For urgent issues, email support@mycvbuddy.com"

---

## 🔗 Advanced Integrations

### Email Notifications
Enable in Crisp → Settings → Notifications:
- Get email when new conversation starts
- Get email for unread messages
- Daily summary of conversations

### Slack Integration (Optional)
1. Go to Crisp → Plugins → Slack
2. Connect your Slack workspace
3. Get notifications in #customer-support channel

### User Context
Automatically send user data to Crisp:

```typescript
// In CrispChat.tsx
useEffect(() => {
  const loadUserContext = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && window.$crisp) {
      // Set user email
      window.$crisp.push(['set', 'user:email', [user.email]])
      
      // Set user data
      window.$crisp.push(['set', 'user:nickname', [user.email?.split('@')[0]]])
      
      // Set custom data
      window.$crisp.push(['set', 'session:data', [[
        ['user_id', user.id],
        ['plan', 'free'], // or 'pro' based on usage_tracking
        ['signup_date', user.created_at]
      ]]])
    }
  }
  
  loadUserContext()
}, [])
```

---

## 📱 Mobile Optimization

Crisp is mobile-friendly by default, but optimize:
- **Mobile position**: Bottom right, smaller size
- **Mobile welcome**: Shorter message
- **Touch-friendly**: Ensure buttons are tappable

---

## 🎓 Help Center Integration

### Create Help Center
1. Go to Crisp → Plugins → Help Center
2. Create articles for common questions
3. Link from chat widget

### Suggested Articles:
1. **Getting Started**
   - How to upload your CV
   - How to generate a new version
   - How to export your CV

2. **Features**
   - ATS optimization explained
   - Multi-language support
   - Advanced templates guide

3. **Account & Billing**
   - Free vs Pro comparison
   - How to upgrade
   - Refund policy

4. **Troubleshooting**
   - Upload issues
   - Export problems
   - Browser compatibility

---

## 📈 Success Metrics

### Week 1 Goals:
- [ ] <5 minute average response time
- [ ] >90% customer satisfaction
- [ ] <10 unresolved conversations

### Month 1 Goals:
- [ ] <3 minute average response time
- [ ] >95% customer satisfaction
- [ ] Help center reduces support volume by 20%

### Quarter 1 Goals:
- [ ] <2 minute average response time
- [ ] >98% customer satisfaction
- [ ] Self-service resolves 50% of questions

---

## 🚨 Troubleshooting

### Chat not appearing?
1. Check `NEXT_PUBLIC_CRISP_WEBSITE_ID` is set
2. Clear browser cache
3. Check browser console for errors
4. Verify Crisp script is loading

### Chat appearing on wrong pages?
Add conditional rendering:
```typescript
const pathname = usePathname()
const showChat = !pathname.startsWith('/admin')

if (!showChat) return null
```

### Performance issues?
Crisp loads asynchronously and won't block page load. If concerned:
- Load only on specific pages
- Delay load until user interaction
- Use Crisp's lazy loading option

---

## 💰 Pricing Tiers

### Free Plan (Current)
- ✅ Unlimited conversations
- ✅ 2 operators
- ✅ Basic chatbox
- ✅ Mobile apps
- ✅ Email notifications

### Pro Plan ($25/month)
- ✅ Everything in Free
- ✅ Unlimited operators
- ✅ AI chatbot (MagicReply)
- ✅ Advanced analytics
- ✅ Custom branding
- ✅ Video calls

**Recommendation**: Start with Free, upgrade when you have >100 conversations/month.

---

## ✅ Post-Setup Checklist

- [ ] Crisp account created
- [ ] Website ID added to `.env.local`
- [ ] CrispChat component integrated
- [ ] Chat widget appears on site
- [ ] Welcome message configured
- [ ] Auto-messages set up
- [ ] Response templates created
- [ ] Availability hours set
- [ ] Email notifications enabled
- [ ] Mobile tested
- [ ] User context tracking added
- [ ] Help center articles created

---

## 📞 Support Contacts

**Crisp Support:**
- Email: support@crisp.chat
- Chat: crisp.chat (yes, they use their own product!)
- Docs: docs.crisp.chat

**Your Support Email:**
- support@mycvbuddy.com (set up email forwarding to Crisp)

---

## 🎉 You're All Set!

Your customer support system is now live! Users can:
- Get instant help via chat
- Browse help center articles
- Email support@mycvbuddy.com
- Receive fast, friendly responses

**Next Steps:**
1. Monitor first conversations
2. Refine auto-messages based on feedback
3. Create more help center articles
4. Track metrics and optimize

Happy supporting! 🚀
