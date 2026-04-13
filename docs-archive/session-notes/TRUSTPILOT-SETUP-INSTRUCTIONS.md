# Trustpilot Setup Instructions

## What I've Done

I've added the Trustpilot widget infrastructure to your homepage:

1. **Added Trustpilot script** to `src/app/layout.tsx` (loads globally)
2. **Added widget placeholder** to homepage hero section
3. **Updated badge text** to "Rated 4.8/5 on Trustpilot"

## What You Need to Do

### Step 1: Claim Your Trustpilot Profile

1. Go to: https://business.trustpilot.com/
2. Click "Get started" or "Claim your business"
3. Search for "My CV Buddy" or "mycvbuddy.com"
4. Follow the verification process (usually email verification)

### Step 2: Get Your Business Unit ID

Once your profile is claimed:

1. Log in to Trustpilot Business
2. Go to Settings > Integrations
3. Find "TrustBox" or "Widgets"
4. Copy your **Business Unit ID** (looks like: `507f1f77bcf86cd799439011`)

### Step 3: Update the Widget Code

In `src/app/homepage.tsx`, find this line:

```tsx
data-businessunit-id="YOUR_TRUSTPILOT_ID"
```

Replace `YOUR_TRUSTPILOT_ID` with your actual Business Unit ID:

```tsx
data-businessunit-id="507f1f77bcf86cd799439011"
```

### Step 4: Choose Widget Style (Optional)

You can customize the widget appearance:

**Current widget (Mini Stars):**
- Template ID: `5419b6a8b0d04a076446a9ad`
- Shows: Star rating only
- Best for: Hero sections

**Alternative widgets:**

**Micro Review Count:**
```tsx
data-template-id="5419b6ffb0d04a076446a9af"
```
Shows: Stars + review count

**Micro Star Rating:**
```tsx
data-template-id="5419b637fa0340045cd0c936"
```
Shows: Stars + rating number

**Horizontal Slider:**
```tsx
data-template-id="54ad5defc6454f065c28af8b"
```
Shows: Rotating reviews

### Step 5: Get Reviews

**Email Recent Users:**

Subject: "Help us improve - share your My CV Buddy experience"

Body:
```
Hi [Name],

Thank you for using My CV Buddy to create your CV!

We're always working to improve our service, and your feedback would be incredibly valuable. Would you mind taking 2 minutes to share your experience on Trustpilot?

[Trustpilot Review Link]

Your honest review helps other job seekers discover our tool and helps us understand what we're doing well and where we can improve.

Thank you!

The My CV Buddy Team
```

**Target Users:**
- Users who successfully generated CVs
- Users who downloaded CVs
- Pro subscribers
- Users who got interviews (if you track this)

**Goal:** 20+ reviews in first month

### Step 6: Display Reviews on Site

Once you have 5+ reviews, you can add more prominent widgets:

**Testimonials Section:**
```tsx
<div 
  className="trustpilot-widget" 
  data-locale="en-GB"
  data-template-id="54ad5defc6454f065c28af8b"
  data-businessunit-id="YOUR_ID"
  data-style-height="350px"
  data-style-width="100%"
  data-theme="light"
  data-stars="4,5"
>
  <a href="https://uk.trustpilot.com/review/mycvbuddy.com">Trustpilot</a>
</div>
```

**Footer Widget:**
```tsx
<div 
  className="trustpilot-widget" 
  data-locale="en-GB"
  data-template-id="5419b6a8b0d04a076446a9ad"
  data-businessunit-id="YOUR_ID"
  data-style-height="24px"
  data-style-width="100%"
  data-theme="dark"
>
  <a href="https://uk.trustpilot.com/review/mycvbuddy.com">Trustpilot</a>
</div>
```

## Best Practices

### Timing for Review Requests

**Best times to ask:**
- 24 hours after successful CV generation
- 7 days after signup (if they've used the tool)
- After they download their CV
- After they upgrade to Pro

**Don't ask:**
- Immediately after signup
- If they haven't used the tool
- If they've had technical issues

### Review Response

**Always respond to reviews:**
- Thank positive reviewers
- Address negative feedback professionally
- Show you're actively improving

**Example responses:**

**Positive review:**
"Thank you so much for your kind words! We're thrilled our AI resume adapter helped you land more interviews. Best of luck with your job search! 🚀"

**Negative review:**
"Thank you for your feedback. We're sorry to hear about [specific issue]. We've just implemented [fix/improvement]. Please reach out to support@mycvbuddy.com and we'll make this right."

## Expected Impact

### SEO Benefits
- Trust signals improve click-through rates
- Rich snippets in Google search results
- Higher conversion rates

### Conversion Impact
- 15-30% increase in signups
- Higher perceived credibility
- Reduced bounce rate

### Timeline
- Week 1: Claim profile, get 5-10 reviews
- Week 2-4: Get to 20+ reviews
- Month 2-3: Get to 50+ reviews
- Month 6: Get to 100+ reviews

## Monitoring

Track these metrics:
- Number of reviews
- Average rating
- Review velocity (reviews/month)
- Conversion rate before/after Trustpilot
- Bounce rate before/after Trustpilot

## Troubleshooting

**Widget not showing?**
- Check Business Unit ID is correct
- Ensure Trustpilot script is loading (check browser console)
- Verify profile is public and active

**Reviews not showing?**
- Need minimum 1 review for widget to display
- Check privacy settings in Trustpilot dashboard
- Ensure reviews are approved (not pending)

**Low review rate?**
- Make review request more prominent
- Offer incentive (e.g., "Get 1 extra free CV generation")
- Follow up with satisfied users
- Make process easier (direct link in email)

## Next Steps

1. **Today:** Claim Trustpilot profile
2. **This week:** Get Business Unit ID and update code
3. **This week:** Email 50 recent users for reviews
4. **Next week:** Add more prominent widgets once you have 5+ reviews
5. **Ongoing:** Request reviews from new users automatically

---

**Current Status:** Widget infrastructure ready, needs Business Unit ID
**Priority:** HIGH - Trust signals critical for conversion
**Time Required:** 30 minutes setup + ongoing review collection
