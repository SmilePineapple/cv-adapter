# 📧 Promotional Email Campaign Guide

## ✅ **READY TO USE!**

---

## 🎯 **What's Been Created**

### **1. Promo Email Template** ⏰
Beautiful email with:
- **Subject**: "⏰ Only 4 Days Left - 50% Off CV Buddy Pro!"
- **Headline**: "Only 4 Days Left!"
- **Promo Code**: LAUNCH50MONTHLY (50% off)
- **Pricing**: ~~£9.99~~ → **£4.99/month**
- **All Pro benefits** listed
- **Urgency messaging**
- **Professional design** with purple gradient

### **2. Test Endpoint** 🧪
**URL**: `https://www.mycvbuddy.com/api/test-promo-email`

**What it does**:
- Sends promo email to: `jakepamdalerourke@gmail.com`
- Safe to test multiple times
- No authentication required

**How to use**:
```bash
# Just visit this URL in your browser:
https://www.mycvbuddy.com/api/test-promo-email

# Or use curl:
curl https://www.mycvbuddy.com/api/test-promo-email
```

### **3. Bulk Send Endpoint** 📨
**URL**: `https://www.mycvbuddy.com/api/send-promo-blast`

**What it does**:
- Sends to ALL free users
- Excludes Pro users automatically
- Rate limited (100ms delay between emails)
- Admin authentication required
- Returns detailed results

**How to use**:
```bash
# Must be logged in as admin (jakedalerourke@gmail.com)
# POST request required
```

### **4. Upgrade Confirmation Email** ✅
**Automatically sends** when user upgrades to Pro via Stripe!

**What it includes**:
- Welcome to Pro message
- All Pro benefits listed
- Link to dashboard
- Professional HTML design

---

## 🚀 **Step-by-Step: Send Promo Campaign**

### **Step 1: Test the Email** (2 minutes)

1. Open your browser
2. Go to: `https://www.mycvbuddy.com/api/test-promo-email`
3. Check your email: `jakepamdalerourke@gmail.com`
4. Verify:
   - ✅ Email received
   - ✅ Design looks good
   - ✅ Links work
   - ✅ Promo code visible

### **Step 2: Send to All Users** (5 minutes)

**Option A: Using Browser (Easiest)**

1. Log in to your admin account
2. Open browser console (F12)
3. Paste this code:
```javascript
fetch('/api/send-promo-blast', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Results:', data))
```
4. Press Enter
5. Wait for results (will take ~10 seconds for 100 users)

**Option B: Using Postman/Insomnia**

1. Create new POST request
2. URL: `https://www.mycvbuddy.com/api/send-promo-blast`
3. Add your auth cookie/token
4. Send request
5. Check response

**Option C: Using curl**

```bash
# Get your auth token from browser cookies
curl -X POST https://www.mycvbuddy.com/api/send-promo-blast \
  -H "Cookie: your-auth-cookie-here" \
  -H "Content-Type: application/json"
```

### **Step 3: Monitor Results**

The response will show:
```json
{
  "success": true,
  "message": "Promo email blast completed",
  "results": {
    "total": 89,
    "sent": 85,
    "failed": 4,
    "errors": [...]
  }
}
```

**Also check**:
- Vercel logs for real-time progress
- Resend dashboard for delivery status

---

## 📊 **What to Expect**

### **Email Stats**
- **Total users**: ~100
- **Free users**: ~85 (Pro users excluded)
- **Send time**: ~10 seconds (with rate limiting)
- **Delivery rate**: 95-98%

### **Expected Results**
- **Open rate**: 20-30%
- **Click rate**: 5-10%
- **Conversion rate**: 2-5%
- **Upgrades**: 2-4 new Pro users

### **Revenue Impact**
- 3 upgrades × £4.99 = **£14.97 immediate**
- 3 upgrades × £9.99/month after = **£29.97/month recurring**

---

## 🔍 **Monitoring**

### **Check Email Delivery**
1. Go to [Resend Dashboard](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. Monitor opens and clicks

### **Check Vercel Logs**
1. Go to Vercel Dashboard → Your Project
2. Click "Logs" tab
3. Search for: `Promo email sent`
4. See success/failure for each email

### **Check Stripe Dashboard**
1. Go to Stripe Dashboard
2. Monitor new subscriptions
3. Track revenue from promo code

---

## ⚠️ **Important Notes**

### **Rate Limiting**
- Resend free plan: **100 emails/day**
- Current users: ~85 free users
- **You're within the limit!** ✅
- Emails sent with 100ms delay to avoid spam filters

### **Pro Users Excluded**
The system automatically excludes:
- Users with `plan_type = 'pro'`
- Users with `subscription_tier = 'pro_monthly'`
- Users with `subscription_tier = 'pro_annual'`

### **Unsubscribe Link**
The email includes an unsubscribe link:
`https://www.mycvbuddy.com/unsubscribe`

**Note**: You'll need to create this page if users click it!

---

## 🎯 **Upgrade Confirmation Email**

### **When It Sends**
Automatically when:
1. User completes Stripe checkout
2. Payment succeeds
3. Subscription is created

### **What It Includes**
- Welcome to Pro message
- 100 CV Generations
- Unlimited Cover Letters
- Interview Preparation
- All Export Formats
- 50+ Languages
- Priority Support
- Link to dashboard

### **Status**
✅ **ACTIVE** - Integrated into Stripe webhook

---

## 📋 **Testing Checklist**

### **Before Sending to All Users**
- [ ] Test email sent to Jake
- [ ] Email received successfully
- [ ] Design looks professional
- [ ] All links work
- [ ] Promo code is correct (LAUNCH50MONTHLY)
- [ ] Pricing is correct (£4.99)
- [ ] Unsubscribe link present

### **After Sending**
- [ ] Check Vercel logs for errors
- [ ] Monitor Resend dashboard
- [ ] Track opens and clicks
- [ ] Monitor Stripe for new subscriptions
- [ ] Respond to any user questions

---

## 🚨 **Troubleshooting**

### **Test Email Not Received**
1. Check spam folder
2. Check Vercel logs for errors
3. Check Resend dashboard
4. Verify RESEND_API_KEY is set

### **Bulk Send Failed**
1. Ensure you're logged in as admin
2. Check Vercel logs for error details
3. Verify authentication token
4. Try again (idempotent - safe to retry)

### **Some Emails Failed**
- Check `errors` array in response
- Common reasons: Invalid email, bounced, spam
- Failed emails are logged in Vercel

### **Upgrade Email Not Sending**
1. Check Stripe webhook is configured
2. Verify webhook secret is correct
3. Check Vercel logs for webhook events
4. Test with a real payment

---

## 💡 **Best Practices**

### **Timing**
- **Best time**: Tuesday-Thursday, 10 AM - 2 PM
- **Avoid**: Weekends, late evenings
- **Current**: Send now (Monday afternoon is okay)

### **Follow-up**
- Send reminder in 2 days: "Only 2 days left!"
- Final reminder on last day: "Last chance!"
- Track who opened but didn't convert

### **A/B Testing** (Future)
- Test different subject lines
- Test different promo codes
- Test different urgency messaging
- Track which performs best

---

## 📈 **Success Metrics**

### **Track These**
1. **Delivery rate**: % of emails delivered
2. **Open rate**: % of emails opened
3. **Click rate**: % who clicked CTA
4. **Conversion rate**: % who upgraded
5. **Revenue**: Total from promo

### **Goals**
- Delivery: >95%
- Open: >25%
- Click: >8%
- Conversion: >3%
- Revenue: >£15

---

## 🎉 **Ready to Send!**

### **Quick Start**
1. ✅ Test: Visit `/api/test-promo-email`
2. ✅ Check email
3. ✅ Send to all: POST to `/api/send-promo-blast`
4. ✅ Monitor results

### **Expected Timeline**
- **Send**: 10 seconds
- **Delivery**: 1-5 minutes
- **Opens**: 1-24 hours
- **Conversions**: 1-4 days

---

## 📞 **Support**

If you have any issues:
1. Check Vercel logs first
2. Check Resend dashboard
3. Review this guide
4. Contact Resend support if needed

---

**Everything is ready! Just test and send!** 🚀📧

**Total setup time**: 5 minutes
**Expected ROI**: 200-400%
**Risk**: Low (can test first)

**Let's get those conversions!** 💰
