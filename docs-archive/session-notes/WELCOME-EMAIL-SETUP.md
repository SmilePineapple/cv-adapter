# Welcome Email Setup Guide

## Issue
Welcome emails are not being sent because the Supabase Auth webhook is not configured.

## Solution: Configure Supabase Auth Webhook

### Step 1: Get Your Webhook URL
Your webhook endpoint is already created at:
```
https://mycvbuddy.com/api/webhooks/auth
```

### Step 2: Configure in Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Hooks**
3. Click **Add a new hook**
4. Configure:
   - **Hook Type**: `Send a webhook`
   - **Event**: `user.created` (or `signup`)
   - **Webhook URL**: `https://mycvbuddy.com/api/webhooks/auth`
   - **HTTP Method**: `POST`
   - **HTTP Headers** (optional):
     ```
     Content-Type: application/json
     ```

5. Click **Save**

### Step 3: Test the Webhook

1. Create a new test account
2. Check your email inbox
3. Check Vercel logs for webhook activity:
   ```
   Auth webhook received: { event: 'user.created', userId: '...' }
   Welcome email triggered for: test@example.com
   ```

## Alternative: Send Welcome Email on First Login

If webhooks are not working, you can trigger the welcome email on first login instead.

### Option A: Trigger on First Dashboard Visit

Add this to `src/app/dashboard/page.tsx`:

```typescript
useEffect(() => {
  const checkFirstLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if welcome email was sent
    const hasSeenWelcome = localStorage.getItem(`welcome_sent_${user.id}`)
    
    if (!hasSeenWelcome) {
      // Send welcome email
      await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      
      localStorage.setItem(`welcome_sent_${user.id}`, 'true')
    }
  }
  
  checkFirstLogin()
}, [])
```

### Option B: Use Supabase Database Trigger

Create a database trigger that sends the email when a new user is created:

```sql
-- Create function to call webhook
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://mycvbuddy.com/api/send-welcome-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object('userId', NEW.id)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email();
```

## Recommended Approach

**Use Supabase Auth Hooks** (Step 2 above) - This is the cleanest and most reliable method.

## Testing Checklist

- [ ] Webhook configured in Supabase
- [ ] Test account created
- [ ] Welcome email received
- [ ] Email has correct branding
- [ ] Links work correctly
- [ ] Check Vercel logs for errors

## Troubleshooting

### Email Not Received
1. Check Vercel logs for webhook calls
2. Check Resend dashboard for delivery status
3. Verify RESEND_API_KEY is set correctly
4. Check spam folder

### Webhook Not Firing
1. Verify webhook URL is correct
2. Check Supabase webhook logs
3. Ensure endpoint is deployed to production
4. Test with manual API call:
   ```bash
   curl -X POST https://mycvbuddy.com/api/webhooks/auth \
     -H "Content-Type: application/json" \
     -d '{"event":"user.created","user":{"id":"test","email":"test@example.com"}}'
   ```

## Current Status

✅ Webhook endpoint created: `/api/webhooks/auth`
✅ Welcome email template created
✅ Email sending function ready
⏳ **PENDING**: Configure webhook in Supabase Dashboard
